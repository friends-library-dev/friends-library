<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class DoubleDotFixerTest extends TestCase
{
    /**
     * @var DoubleDotFixer
     */
    protected $fixer;

    public function setUp()
    {
        $this->fixer = new DoubleDotFixer();
    }

    public function testFixesDoubleDot()
    {
        $path = new Path('en/g-fox/journal/modern/foo--updated..pdf');

        $fixed = $this->fixer->fix($path);

        $this->assertSame('foo--updated.pdf', $fixed->getBasename());
    }

    public function testLeavesAloneExtraDotNotAtEndOfFilename()
    {
        $path = new Path('en/g-fox/journal/modern/foo.bar--updated.pdf');

        $fixed = $this->fixer->fix($path);

        $this->assertTrue($fixed->equals($path));
    }
}
