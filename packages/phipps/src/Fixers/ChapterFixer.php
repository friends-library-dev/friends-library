<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class ChapterFixer implements FixerInterface
{
    /**
     * @var string
     */
    private static $pattern = '/(?:-+)chapter(?:s)?-([0-9+](?:-[0-9+])?)/';

    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        $filename = $path->getFilename();
        if (strpos($filename, 'chapter') === false) {
            return $path;
        }

        preg_match(static::$pattern, $filename, $matches);
        if (empty($matches)) {
            return $path;
        }

        $abbrev = $path->isEnglish() ? 'ch' : 'cap';
        $fixed = str_replace($matches[0], "--{$abbrev}{$matches[1]}", $filename);
        $path->setFilename($fixed);

        return $path;
    }
}
