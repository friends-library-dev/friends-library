<?php

namespace Phipps\Commands;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Clean extends Command
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('clean')
            ->setDescription('Cleans/prepares documents for deployment');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->fixEditionDoubleDashes($output);
    }

    /**
     * Fix bad double-dash edition suffixes
     *
     * @param OutputInterface $output
     * @return void
     */
    protected function fixEditionDoubleDashes(OutputInterface $output)
    {
        $finder = new Finder();
        $finder
            ->in(getenv('LOCAL_ASSETS_DIR'))
            ->exclude('Sync.Cache')
            ->name('/\.(mobi|epub|pdf|mp3)$/')
            ->files();

        $fixed = 0;
        $pattern = '/—(updated|original|modernized)\.(mobi|epub|pdf|mp3)$/';

        foreach ($finder as $file) {
            if (!preg_match($pattern, $file->getRelativePathname(), $matches)) {
                continue;
            }
            $corrected = preg_replace(
                "/{$matches[0]}$/",
                "--{$matches[1]}.{$matches[2]}",
                $file->getRealPath()
            );

            $success = rename($file->getRealPath(), $corrected);
            if (! $success) {
                throw new \Exception("Failed to rename {$file->getRealPath()}");
            }
            $fixed++;
        }

        $output->writeLn("Fixed $fixed files!");
    }
}
