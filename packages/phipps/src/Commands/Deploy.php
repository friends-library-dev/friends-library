<?php

namespace Phipps\Commands;

use Aws\S3\S3ClientInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Console\Output\OutputInterface;

class Deploy extends Command
{
    /**
     * @var string
     */
    protected $name = 'deploy';

    /**
     * @var string
     */
    protected $description = 'Deploys assets to cloud platform';

    /**
     * @var Client
     */
    protected $client;

    /**
     * @var int
     */
    protected $transformations = 0;

    /**
     * @var Array<string>
     */
    protected $remoteFiles = [];

    /**
     * @var int
     */
    protected const STATUS_REMOTE_FILE_IDENTICAL = 1;

    /**
     * @var int
     */
    protected const STATUS_REMOTE_FILE_DIFFERENT = 2;

    /**
     * @var int
     */
    protected const STATUS_REMOTE_FILE_NOT_FOUND = 3;

    /**
     * @param Finder $finder
     * @param S3ClientInterface $client
     */
    public function __construct(Finder $finder, S3ClientInterface $client)
    {
        parent::__construct();
        $this->finder = $finder;
        $this->client = $client;
    }

    /**
     * {@inheritdoc}
     */
    protected function fire(): int
    {
        $cleanCommand = $this->getApplication()->find('clean');
        $cleanInput = new ArrayInput(['command' => 'clean', '--dry-run' => true]);
        $cleanResult = $cleanCommand->run($cleanInput, new NullOutput());
        if ($cleanResult !== 0) {
            $this->print('<error>Files not clean. Run `php phipps clean` before deploying.</>');
            return 1;
        }

        $this->listRemoteFiles();
        $this->syncLocalFiles();
        $this->removeDeletedFiles();
        $this->result("Modified {$this->transformations} remote file/s.");
        return 0;
    }

    /**
     * Store a list of all remote files
     *
     * @return void
     */
    protected function listRemoteFiles(): void
    {
        $objects = $this->client->getIterator('ListObjects', [
            'Bucket' => getenv('DEPLOY_BUCKET'),
        ]);

        foreach ($objects as $object) {
            $this->remoteFiles[$object['Key']] = trim($object['ETag'], '"');
        }
    }

    /**
     * Sync all local files with remote storage
     *
     * @return void
     */
    protected function syncLocalFiles(): void
    {
        foreach ($this->finder->files() as $file) {
            $this->syncFile($file);
        }
    }

    /**
     * Remove any remote files that do not exist locally
     *
     * @return void
     */
    protected function removeDeletedFiles(): void
    {
        foreach (array_keys($this->remoteFiles) as $path) {
            if (file_exists(getenv('LOCAL_ASSETS_DIR') . '/' . $path)) {
                continue;
            }

            $this->transformations++;

            if ($this->dryRun) {
                $this->print([
                    "<purple>phipps:deploy</> will <yellow>delete</> remote file not found locally:",
                    "  <cyan>(DRY-RUN)</> 🚽  <red>{$path}</>",
                ]);
                continue;
            }

            $this->client->deleteObject([
                'Bucket' => getenv('DEPLOY_BUCKET'),
                'Key' => $path,
            ]);

            $this->print([
                "<purple>phipps:deploy</> <yellow>deleted</> remote file not found locally:",
                "  🚽  <red>{$path}</>",
            ]);
        }
    }

    /**
     * Sync a file with remote asset storage
     *
     * @param SplFileInfo $file
     * @return void
     */
    protected function syncFile(SplFileInfo $file): void
    {
        $status = $this->getSyncState($file);
        switch ($status) {
            case static::STATUS_REMOTE_FILE_IDENTICAL:
                $this->skipIdenticalFile($file);
                return;

            case static::STATUS_REMOTE_FILE_DIFFERENT:
                $this->transformations++;
                $this->replaceFile($file);
                return;

            case static::STATUS_REMOTE_FILE_NOT_FOUND:
                $this->transformations++;
                $this->uploadFile($file);
                return;
        }
    }

    /**
     * Get sync state of local file vs remote file
     *
     * @param SplFileInfo $local
     * @return int
     */
    protected function getSyncState(SplFileInfo $local): int
    {
        if (! isset($this->remoteFiles[$local->getRelativePathname()])) {
            return static::STATUS_REMOTE_FILE_NOT_FOUND;
        }

        $remoteHash = $this->remoteFiles[$local->getRelativePathname()];
        $localHash = md5_file($local->getRealPath());
        if ($remoteHash === $localHash) {
            return static::STATUS_REMOTE_FILE_IDENTICAL;
        }

        return static::STATUS_REMOTE_FILE_DIFFERENT;
    }

    /**
     * Notify skipping of file that is identical on local and remote
     *
     * @param SplFileInfo $file
     * @return void
     */
    protected function skipIdenticalFile(SplFileInfo $file): void
    {
        if (! $this->output->isVerbose()) {
            return;
        }

        if ($this->dryRun) {
            $this->print([
                "<purple>phipps:deploy</> will <yellow>skip</> syncing identical file:",
                "  <cyan>(DRY-RUN)</> 🎉  <green>{$file->getRelativePathname()}</>",
            ]);
            return;
        }

        $this->print([
            "<purple>phipps:deploy</> <yellow>skipped</> syncing identical file:",
            "  🎉  <green>{$file->getRelativePathname()}</>",
        ]);
    }

    /**
     * Upload a file to remote storage
     *
     * @param SplFileInfo $file
     * @return void
     */
    protected function uploadFile(SplFileInfo $file): void
    {
        if ($this->dryRun) {
            $this->print([
                "<purple>phipps:deploy</> will <yellow>upload</> file to remote storage:",
                "  <cyan>(DRY-RUN)</> 📫  <yellow>{$file->getRelativePathname()}</>",
            ]);
            return;
        }

        $this->client->putObject([
            'Bucket' => getenv('DEPLOY_BUCKET'),
            'Key' => $file->getRelativePathname(),
            'SourceFile' => $file->getRealPath(),
            'ACL' => 'public-read',
        ]);

        $this->print([
            "<purple>phipps:deploy</> successfully <yellow>uploaded</> file to remote storage:",
            "  <green>📫  {$file->getRelativePathname()}</>",
        ]);
    }

    /**
     * Replace an outdated file on the remote storage server
     *
     * @param SplFileInfo $file
     * @return void
     */
    protected function replaceFile(SplFileInfo $file): void
    {
        if ($this->dryRun) {
            $this->print([
                "<purple>phipps:deploy</> will <yellow>replace</> file on remote storage:",
                "  <cyan>(DRY-RUN)</> 🛁  <yellow>{$file->getRelativePathname()}</>",
            ]);
            return;
        }

        $this->client->deleteObject([
            'Bucket' => getenv('DEPLOY_BUCKET'),
            'Key' => $file->getRelativePathname(),
        ]);

        $this->client->putObject([
            'Bucket' => getenv('DEPLOY_BUCKET'),
            'Key' => $file->getRelativePathname(),
            'SourceFile' => $file->getRealPath(),
            'ACL' => 'public-read',
        ]);

        $this->print([
            "<purple>phipps:deploy</> successfully <yellow>replaced</> file on remote storage:",
            "  <green>🛁  {$file->getRelativePathname()}</>",
        ]);
    }
}
