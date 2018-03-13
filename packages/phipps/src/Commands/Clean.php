<?php

namespace Phipps\Commands;

use Symfony\Component\Finder\Finder;

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
     * @var int
     */
    protected $transformations = 0;

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
    protected function fire(): int
    {
        $exitCode = $this->fixEditionDoubleDashes();
        $this->result("Modified $this->transformations file/s.");
        return $exitCode;
    }

    /**
     * Fix bad double-dash edition suffixes
     *
     * @return int
     */
    protected function fixEditionDoubleDashes(): int
    {
        $pattern = '/—(updated|original|modernized)\.(mobi|epub|pdf|mp3)$/';

        foreach ($this->finder->files() as $file) {
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
                    "  <cyan>(DRY-RUN)</> <green>{$file->getRealPath()}</>",
                    "  <cyan>(DRY-RUN)</> <yellow>{$corrected}</>",
                ]);
            } else {
                $success = rename($file->getRealPath(), $corrected);
                if (! $success) {
                    throw new \Exception("Failed to rename {$file->getRealPath()}");
                }
            }

            $this->transformations++;
        }

        return $this->dryRun && $this->transformations > 0 ? 1 : 0;
    }
}
