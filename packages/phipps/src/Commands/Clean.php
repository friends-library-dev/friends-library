<?php

namespace Phipps\Commands;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Clean extends Command
{
    /**
     * @var InputInterface
     */
    protected $input;

    /**
     * @var OutputInterface
     */
    protected $output;

    /**
     * @var Finder
     */
    protected $finder;

    /**
     * @var $dryRun
     */
    protected $dryRun = true;

    /**
     * @param Finder $finder
     */
    public function __construct(Finder $finder)
    {
        parent::__construct();
        $this->finder = $finder;
    }

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('clean')
            ->setDescription('Cleans/prepares documents for deployment')
            ->addOption(
                'dry-run',
                null,
                InputOption::VALUE_OPTIONAL,
                'dry run or actually execute',
                true
            );
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->input = $input;
        $this->output = $output;
        $this->dryRun = filter_var($input->getOption('dry-run'), FILTER_VALIDATE_BOOLEAN);
        $this->fixEditionDoubleDashes();
    }

    /**
     * Fix bad double-dash edition suffixes
     *
     * @return void
     */
    protected function fixEditionDoubleDashes()
    {
        $files = $this->finder
            ->name('/\.(mobi|epub|pdf|mp3)$/')
            ->files();

        $fixed = 0;
        $pattern = '/—(updated|original|modernized)\.(mobi|epub|pdf|mp3)$/';

        foreach ($files as $file) {
            if (!preg_match($pattern, $file->getRelativePathname(), $matches)) {
                continue;
            }

            $corrected = preg_replace(
                "/{$matches[0]}$/",
                "--{$matches[1]}.{$matches[2]}",
                $file->getRealPath()
            );

            if ($this->dryRun) {
                $this->output->writeLn([
                    '<fg=magenta>phipps:clean</> will <comment>rename</comment> file:',
                    "  <info>{$file->getRealPath()}</info>",
                    "  <comment>{$corrected}</comment>",
                ]);
            } else {
                $success = rename($file->getRealPath(), $corrected);
                if (! $success) {
                    throw new \Exception("Failed to rename {$file->getRealPath()}");
                }
            }

            $fixed++;
        }

        if ($this->dryRun) {
            $msg = "Non dry-run would have modified $fixed files.";
        } else {
            $msg = "Modified $fixed files.";
        }
        $this->output->writeLn("<question>--> $msg</question>");
    }
}
