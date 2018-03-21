<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class ChapterFixerTest extends TestCase
{
    /**
     * @var ChapterFixer
     */
    protected $fixer;


    public function setUp()
    {
        $this->fixer = new ChapterFixer();
    }

    /**
     * @dataProvider transformations
     */
    public function testFixesChapters(string $relPath, string $fixedBasename)
    {
        $path = new Path($relPath);

        $fixed = $this->fixer->fix($path);

        $this->assertSame($fixedBasename, $fixed->getBasename());
    }

    /**
     * Get expected transformations
     *
     * @return array
     */
    public function transformations(): array
    {
        return [
            ['en/fox/doc/ed/Foobar-chapter-1.mp3', 'Foobar--ch1.mp3'],
            ['en/fox/doc/ed/Foobar--chapter-1.mp3', 'Foobar--ch1.mp3'],
            ['en/fox/doc/ed/Foobar-chapters-1-2.mp3', 'Foobar--ch1-2.mp3'],
            ['en/fox/doc/ed/Foobar-chapter-1-lo_q.mp3', 'Foobar--ch1-lo_q.mp3'],
            ['en/fox/doc/ed/chapterlol.mp3', 'chapterlol.mp3'],
            ['es/fox/doc/Foobar-chapter-1.mp3', 'Foobar--cap1.mp3'],
            ['es/fox/doc/Foobar--chapter-1.mp3', 'Foobar--cap1.mp3'],
            ['es/fox/doc/Foobar-chapters-1-2.mp3', 'Foobar--cap1-2.mp3'],
        ];
    }
}
