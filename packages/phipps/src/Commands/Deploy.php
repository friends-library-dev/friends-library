<?php

namespace Phipps\Commands;

use Aws\S3\S3ClientInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

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
    protected function fire()
    {
        $cleanCommand = $this->getApplication()->find('clean');
        $cleanInput = new ArrayInput(['command' => 'clean', '--dry-run' => true]);
        $cleanResult = $cleanCommand->run($cleanInput, new NullOutput());
        if ($cleanResult !== 0) {
            $this->print('<error>Files not clean. Run `php phipps clean` before deploying.</>');
            return;
        }

        $this->syncLocalFiles();
        $this->removeDeletedFiles();
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
        $objects = $this->client->getIterator('ListObjects', [
            'Bucket' => getenv('DEPLOY_BUCKET'),
        ]);

        foreach ($objects as $object) {
            if (file_exists(getenv('LOCAL_ASSETS_DIR') . '/' . $object['Key'])) {
                continue;
            }

            if ($this->dryRun) {
                $this->print([
                    "<purple>phipps:deploy</> will <yellow>delete</> remote file not found locally:",
                    "  <cyan>(DRY-RUN)</> 🚽  <red>{$object['Key']}</>",
                ]);
                continue;
            }

            $this->client->deleteObject([
                'Bucket' => getenv('DEPLOY_BUCKET'),
                'Key' => $object['Key'],
            ]);

            $this->print([
                "<purple>phipps:deploy</> <yellow>deleted</> remote file not found locally:",
                "  🚽  <red>{$object['Key']}</>",
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
                return $this->skipIdenticalFile($file);

            case static::STATUS_REMOTE_FILE_DIFFERENT:
                return $this->replaceFile($file);

            case static::STATUS_REMOTE_FILE_NOT_FOUND:
                return $this->uploadFile($file);
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
        try {
            $result = $this->client->headObject([
                'Bucket' => getenv('DEPLOY_BUCKET'),
                'Key' => $local->getRelativePathname(),
            ]);
        } catch (\Exception $exception) {
            if ($exception->getStatusCode() === 404) {
                return static::STATUS_REMOTE_FILE_NOT_FOUND;
            }
            throw $exception;
        }

        $localHash = md5_file($local->getRealPath());
        $remoteHash = trim($result['@metadata']['headers']['etag'], '"');
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
