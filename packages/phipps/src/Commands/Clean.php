<?php

namespace Phipps\Commands;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Clean extends Command
{
    /**
     * @var string
     */
    protected $name = 'clean';

    /**
     * @var string
     */
    protected $description = 'Cleans/prepares documents for deployment';

    /**
     * @var Finder
     */
    protected $finder;

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
    protected function fire()
    {
        return $this->fixEditionDoubleDashes();
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
                    '<purple>phipps:clean</> will <yellow>rename</> file:',
                    "  <green>{$file->getRealPath()}</>",
                    "  <yellow>{$corrected}</>",
                ]);
            } else {
                $success = rename($file->getRealPath(), $corrected);
                if (! $success) {
                    throw new \Exception("Failed to rename {$file->getRealPath()}");
                }
            }

            $fixed++;
        }

        $msg = "modified $fixed files";
        if ($this->dryRun) {
            $msg = 'non dry-run would have ' . $msg;
        }

        $this->output->writeLn("<result>--> phipps:clean $msg</>");
        return $this->dryRun && $fixed > 0 ? 1 : 0;
    }
}
