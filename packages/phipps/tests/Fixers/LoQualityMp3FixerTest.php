<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class LoQualityMp3FixerTest extends TestCase
{
    /**
     * @var LoQualityMp3Fixer
     */
    protected $fixer;

    /**
     * @var Path
     */
    protected $path;

    public function setUp()
    {
        $this->fixer = new LoQualityMp3Fixer();
        $this->path = new Path('en/g-fox/journal/modern/Foo-lo_q.mp3');
    }

    public function testFixesOldStyleLoQualitySuffix()
    {
        $fixed = $this->fixer->fix($this->path);

        $this->assertSame('Foo--lq.mp3', $fixed->getBasename());
    }

    public function testIgnoresNonAudioFiles()
    {
        $this->path->setExtension('pdf');

        $fixed = $this->fixer->fix($this->path);

        $this->assertTrue($fixed->equals($this->path));
    }
}
