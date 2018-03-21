<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class DoubleDotFixer implements FixerInterface
{
    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        $trimmed = rtrim($path->getFilename(), '.');
        $path->setFilename($trimmed);
        return $path;
    }
}
