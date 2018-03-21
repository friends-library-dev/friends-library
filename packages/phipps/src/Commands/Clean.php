<?php

namespace Phipps\Commands;

use Phipps\Models\Path;
use Phipps\Fixers\AggregateFixer;
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
     * @var AggregateFixer
     */
    protected $fixer;

    /**
     * @var int
     */
    protected $transformations = 0;

    /**
     * @param Finder $finder
     * @param AggregateFixer $fixer;
     */
    public function __construct(Finder $finder, AggregateFixer $fixer)
    {
        parent::__construct();
        $this->finder = $finder;
        $this->fixer = $fixer;
    }

    /**
     * {@inheritdoc}
     */
    protected function fire(): int
    {
        foreach ($this->finder->files() as $file) {
            $relPath = $file->getRelativePathname();
            $current = new Path($relPath);
            $proposed = $this->fixer->fix(new Path($relPath));
            $this->cleanFile($current, $proposed);
        }

        $this->result("Modified $this->transformations file/s.");
        return $this->dryRun && $this->transformations > 0 ? 1 : 0;
    }

    /**
     * Clean a file
     *
     * @param Path $current
     * @param Path $proposed
     */
    protected function cleanFile(Path $current, Path $proposed): void
    {
        if ($proposed->equals($current)) {
            if ($this->output->isVerbose()) {
                $this->print([
                    "<purple>phipps:clean</> will <yellow>skip</> modifying acceptable file:",
                    "  <cyan>(DRY-RUN)</> 🎉  <green>{$current}</>",
                ]);
            }
            return;
        }

        $this->transformations++;

        if ($this->dryRun) {
            $this->output->writeLn([
                '<purple>phipps:clean</> will <yellow>rename</> file:',
                "  <cyan>(DRY-RUN)</> <yellow>{$current}</>",
                "  <cyan>(DRY-RUN)</> <green>{$proposed}</>",
            ]);
            return;
        }

        $assetsDir = getenv('LOCAL_ASSETS_DIR');
        $success = rename("$assetsDir/$current", "$assetsDir/$proposed");
        if (! $success) {
            throw new \Exception("Failed to rename $current");
        }

        $this->output->writeLn([
            '<purple>phipps:clean</> successfully <yellow>renamed</> file:',
            "  <yellow>{$current}</>",
            "  <green>{$proposed}</>",
        ]);
    }
}
