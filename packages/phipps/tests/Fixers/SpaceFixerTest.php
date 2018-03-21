<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class SpaceFixerTest extends TestCase
{
    /**
     * @var SpaceFixer
     */
    protected $fixer;

    /**
     * @var Path
     */
    protected $path;

    public function setUp()
    {
        $this->fixer = new SpaceFixer();
        $this->path = new Path('en/friend/doc/edition/Foo bar.pdf');
    }

    public function testFixesSpaceInFilename()
    {
        $fixed = $this->fixer->fix($this->path);

        $this->assertSame('Foo_bar.pdf', $fixed->getBasename());
    }
}
