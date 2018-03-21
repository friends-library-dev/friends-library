<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class LoQualityMp3Fixer implements FixerInterface
{
    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        if (! $path->isAudio()) {
            return $path;
        }

        $filename = $path->getFilename();
        if (preg_match('/-lo_q$/', $filename)) {
            $fixed = preg_replace('/-lo_q$/', '--lq', $filename);
            $path->setFilename($fixed);
        }

        return $path;
    }
}
