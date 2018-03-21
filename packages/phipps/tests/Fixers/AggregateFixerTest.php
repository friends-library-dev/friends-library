<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class AggregateFixerTest extends TestCase
{
    /**
     * @var AggregateFixer
     */
    protected $fixer;


    public function setUp()
    {
        $this->fixer = new AggregateFixer();
        $this->path = new Path('en/friend/doc/edition/foo--updated.pdf');
    }

    public function testFixesLongDashAndDoubleDot()
    {
        $this->path->setFilename('foo—updated.');

        $fixed = $this->fixer->fix($this->path);

        $this->assertSame('foo--updated.pdf', $fixed->getBasename());
    }

    /**
     * @dataProvider transformations
     */
    public function testFixesBadFilenames($beforeBasename, $afterBasename)
    {
        $this->path->setBasename($beforeBasename);

        $fixed = $this->fixer->fix($this->path);

        $this->assertSame($afterBasename, $fixed->getBasename());
    }

    /**
     * Get expected basename transformations
     *
     * @return array
     */
    public function transformations()
    {
        return [
            ['Foobar-chapters-1-2-lo_q.mp3', 'Foobar--ch1-2--lq.mp3'],
            ['Foobar-chapters-1-2.mp3', 'Foobar--ch1-2.mp3'],
        ];
    }
}
