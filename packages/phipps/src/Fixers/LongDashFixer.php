<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class LongDashFixer implements FixerInterface
{
    /**
     * @var string
     */
    private static $pattern = '/—(updated|original|modernized)$/';

    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        $filename = $path->getFilename();

        if (preg_match(static::$pattern, $filename, $matches)) {
            $fixed = preg_replace("/{$matches[0]}$/", "--{$matches[1]}", $filename);
            $path->setFilename($fixed);
        }

        return $path;
    }
}
