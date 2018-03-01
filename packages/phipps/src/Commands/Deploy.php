<?php

namespace Phipps\Commands;

use Aws\S3\S3ClientInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;

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
        foreach ($this->finder->files() as $file) {
            $this->syncFile($file);
        }
    }

    /**
     * Sync a file with remote asset storage
     *
     * @param SplFileInfo $file
     * @return void
     */
    protected function syncFile(SplFileInfo $file)
    {
        if ($this->dryRun) {
            $this->output->writeLn([
                "<purple>phipps:deploy</> will <yellow>upload</> file to remote storage:",
                "  <cyan>(DRY-RUN)</> <green>{$file->getRelativePathname()}</>",
            ]);
            return;
        }

        $this->client->putObject([
            'Bucket' => getenv('DEPLOY_BUCKET'),
            'Key' => $file->getRelativePathname(),
            'SourceFile' => $file->getRealPath(),
            'ACL' => 'public-read',
        ]);

        $this->output->writeLn([
            "<purple>phipps:deploy</> successfully <yellow>uploaded</> file to remote storage:",
            "  <green>√ {$file->getRelativePathname()}</>",
        ]);
    }
}
