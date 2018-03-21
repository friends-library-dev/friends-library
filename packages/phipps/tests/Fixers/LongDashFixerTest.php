<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class LongDashFixerTest extends TestCase
{
    /**
     * @var LongDashFixer
     */
    protected $fixer;

    /**
     * @var Path
     */
    protected $path;

    public function setUp()
    {
        $this->fixer = new LongDashFixer();
    }

    public function testFixesLongDashes()
    {
        $path = new Path('en/g-fox/journal/modern/foo—updated.pdf');

        $fixed = $this->fixer->fix($path);

        $this->assertSame('foo--updated.pdf', $fixed->getBasename());
    }
}
