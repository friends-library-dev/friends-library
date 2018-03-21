<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class SpaceFixer implements FixerInterface
{
    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        $filename = $path->getFilename();
        $fixed = str_replace(' ', '_', $filename);
        $path->setFilename($fixed);
        return $path;
    }
}
