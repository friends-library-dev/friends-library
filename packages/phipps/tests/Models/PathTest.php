<?php

namespace Phipps\Models;

use PHPUnit\Framework\TestCase;

class PathTest extends TestCase
{
    /**
     * @expectedException \InvalidArgumentException
     */
    public function testAbsolutePathThrowsException()
    {
        new Path('/en/g-fox/journal/modern/foo.pdf');
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testWrongNumberOfDirsThrowsException()
    {
        new Path('/foo/bar/foo.pdf');
    }

    public function testCanSetAllPartsOfPath()
    {
        $path = new Path('en/g-fox/journal/modern/foo.mp3');

        $path->setLanguage('es');
        $path->setFriend('robert-barclay');
        $path->setDocument('apology');
        $path->setEdition('updated');
        $path->setFilename('apology');
        $path->setExtension('mobi');

        $this->assertSame('es/robert-barclay/apology/updated/apology.mobi', (string) $path);
    }

    public function testAudioFileIdentityChecks()
    {
        $path = new Path('en/g-fox/journal/modern/foo.mp3');

        $this->assertFalse($path->isMobi());
        $this->assertFalse($path->isPdf());
        $this->assertFalse($path->isEpub());
        $this->assertTrue($path->isAudio());
        $this->assertTrue($path->isMp3());
    }

    public function testCanGetExtension()
    {
        $path = new Path('en/g-fox/journal/modern/foo.pdf');

        $this->assertSame('pdf', $path->getExtension());
    }

    public function testCanGetBasename()
    {
        $path = new Path('en/g-fox/journal/modern/foo.pdf');

        $this->assertSame('foo.pdf', $path->getBasename());
    }

    public function testToStringReturnsFullRelativePath()
    {
        $path = new Path('en/g-fox/journal/modern/foo.pdf');

        $this->assertSame('en/g-fox/journal/modern/foo.pdf', (string) $path);
    }

    public function testPathNotStartingWithEnIsNotEnglish()
    {
        $path = new Path('es/g-fox/journal/foo.pdf');

        $this->assertFalse($path->isEnglish());
    }

    public function testPathStartingWithEnIsEnglish()
    {
        $path = new Path('en/g-fox/journal/modern/foo.pdf');

        $this->assertTrue($path->isEnglish());
    }

    public function testPathNotStartingWithEnIsNotSpanish()
    {
        $path = new Path('en/g-fox/journal/modern/foo.pdf');

        $this->assertFalse($path->isSpanish());
    }

    public function testPathStartingWithEnIsSpanish()
    {
        $path = new Path('es/g-fox/journal/foo.pdf');

        $this->assertTrue($path->isSpanish());
    }

    public function testSpanishToStringOmitsEdition()
    {
        $path = new Path('es/g-fox/journal/foo.pdf');

        $this->assertSame('es/g-fox/journal/foo.pdf', (string) $path);
    }
}
