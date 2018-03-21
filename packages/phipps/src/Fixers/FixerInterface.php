<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

interface FixerInterface
{
    /**
     * Fix a path
     *
     * @param Path $path
     * @return Path
     */
    public function fix(Path $path): Path;
}
