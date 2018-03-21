<?php

namespace Phipps\Models;

class Path
{
    /**
     * @var string
     */
    protected $language;

    /**
     * @var string
     */
    protected $friend;

    /**
     * @var string
     */
    protected $document;

    /**
     * @var string
     */
    protected $edition;

    /**
     * @var string
     */
    protected $filename;

    /**
     * @var string
     */
    protected $extension;

    /**
     * @param string $relativePath
     */
    public function __construct(string $relativePath)
    {
        if ($relativePath[0] === '/') {
            throw new \InvalidArgumentException('new Path() expects relative path.');
        }

        $this->extension = pathinfo($relativePath, PATHINFO_EXTENSION);
        $this->filename = pathinfo($relativePath, PATHINFO_FILENAME);

        $dirPath = trim(dirname($relativePath), '/');
        $dirs = explode('/', $dirPath);
        if (count($dirs) < 3) {
            throw new \InvalidArgumentException("Invalid path: $relativePath.");
        }

        list($this->language, $this->friend, $this->document) = $dirs;
        if ($this->isEnglish()) {
            if (count($dirs) !== 4) {
                throw new \InvalidArgumentException("Invalid path: $relativePath.");
            }
            $this->edition = $dirs[3];
            return;
        }

        if (count($dirs) !== 3) {
            throw new \InvalidArgumentException("Invalid path: $relativePath.");
        }
    }

    /**
     * Set the language
     *
     * @param string $language
     */
    public function setLanguage(string $language): void
    {
        if ($language !== 'es' && $language !== 'en') {
            throw new \InvalidArgumentException('Invalid language, use `en` or `es`.');
        }

        $this->language = $language;
    }

    /**
     * Get the language
     *
     * @return string
     */
    public function getLanguage(): string
    {
        return $this->language;
    }

    /**
     * Set the friend
     *
     * @param string $friend
     */
    public function setFriend(string $friend): void
    {
        $this->friend = $friend;
    }

    /**
     * Get the friend
     *
     * @return string
     */
    public function getFriend(): string
    {
        return $this->friend;
    }

    /**
     * Set the document
     *
     * @param string $document
     */
    public function setDocument(string $document): void
    {
        $this->document = $document;
    }

    /**
     * Get the document
     *
     * @return string
     */
    public function getDocument(): string
    {
        return $this->document;
    }

    /**
     * Set the edition
     *
     * @param string $edition
     */
    public function setEdition(string $edition): void
    {
        $this->edition = $edition;
    }

    /**
     * Get the edition
     *
     * @return string
     */
    public function getEdition(): string
    {
        return $this->edition;
    }

    /**
     * Set the filename
     *
     * @param string $filename
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * Get the filename
     *
     * @return string
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * Get the basename
     *
     * @return string
     */
    public function getBasename(): string
    {
        return $this->filename . '.' . $this->extension;
    }

    public function setBasename(string $basename): void
    {
        $this->extension = pathinfo($basename, PATHINFO_EXTENSION);
        $this->filename = pathinfo($basename, PATHINFO_FILENAME);
    }

    /**
     * Get the extension
     *
     * @return string
     */
    public function getExtension(): string
    {
        return $this->extension;
    }

    /**
     * Set the extension
     *
     * @param string $extension
     */
    public function setExtension(string $extension): void
    {
        $this->extension = $extension;
    }

    /**
     * Is the path a mobi?
     *
     * @return bool
     */
    public function isMobi(): bool
    {
        return $this->getExtension() === 'mobi';
    }

    /**
     * Is the path a pdf?
     *
     * @return bool
     */
    public function isPdf(): bool
    {
        return $this->getExtension() === 'pdf';
    }

    /**
     * Is the path an epub?
     *
     * @return bool
     */
    public function isEpub(): bool
    {
        return $this->getExtension() === 'epub';
    }

    /**
     * Is the path an audio file?
     *
     * @return bool
     */
    public function isAudio(): bool
    {
        return $this->isMp3();
    }

    /**
     * Is the path an mp3?
     *
     * @return bool
     */
    public function isMp3(): bool
    {
        return $this->getExtension() === 'mp3';
    }

    /**
     * Is the path English?
     *
     * @return bool
     */
    public function isEnglish(): bool
    {
        return $this->language === 'en';
    }

    /**
     * Is the path Spanish?
     *
     * @return bool
     */
    public function isSpanish(): bool
    {
        return $this->language === 'es';
    }

    /**
     * Is this Path equal to another?
     *
     * @param Path $other
     * @return bool
     */
    public function equals(Path $other): bool
    {
        return (string) $this === (string) $other;
    }

    /**
     * Get the path as a simple string
     *
     * @return string
     */
    public function __toString(): string
    {
        return str_replace('//', '/', join('/', [
            $this->language,
            $this->friend,
            $this->document,
            $this->edition,
            $this->getBasename()
        ]));
    }
}
