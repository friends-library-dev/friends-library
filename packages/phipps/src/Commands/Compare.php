<?php

namespace Phipps\Commands;

use Iterator;

class Compare extends Command
{
    /**
     * @var string
     */
    protected $name = 'compare';

    /**
     * @var string
     */
    protected $description = 'Compares data from friends/*.yml to Sync files';

    /**
     * @var Iterator
     */
    protected $friends;

    /**
     * @var array
     */
    protected $warnings = [];

    /**
     * @param Iterator $friends
     */
    public function __construct(Iterator $friends)
    {
        parent::__construct();
        $this->friends = $friends;
    }

    /**
     * {@inheritdoc}
     */
    protected function fire(): int
    {
        $this->dryRun = false;

        foreach ($this->friends as $file => $data) {
            [$language] = explode('/', $file);
            $this->setDir($language);
            $this->compareFriend($data, $language);
        }

        foreach ($this->warnings as $warning) {
            $this->printWarning(...$warning);
        }

        if (! empty($this->warnings)) {
            $this->print("<error>Found " . count($this->warnings) . ' problems.</>');
            $this->printElapsedTime();
            return 1;
        }

        $this->result('No problems found.');
        return 0;
    }

    /**
     * Compare friend data with local files
     *
     * @param array $friend
     * @param string $language
     * @return void
     */
    protected function compareFriend(array $friend, string $language): void
    {
        if (! is_dir($this->absPath($friend['slug']))) {
            $path = $this->relPath($friend['slug']);
            $this->addWarning('friend', 'directory', $path);
            return;
        }

        $this->pushDir($friend['slug']);
        foreach ($friend['documents'] as $document) {
            $this->compareDocument($document);
        }
        $this->popDir();
    }

    /**
     * Compare document data with local files
     *
     * @param array $document
     * @return void
     */
    protected function compareDocument(array $document): void
    {
        if (! is_dir($this->absPath($document['slug']))) {
            $path = $this->relPath($document['slug']);
            $this->addWarning('document', 'directory', $path);
            return;
        }

        $this->pushDir($document['slug']);
        foreach ($document['editions'] as $edition) {
            $this->compareEdition($edition, $document);
        }
        $this->popDir();
    }

    /**
     * Compare edition data with local files
     *
     * @param array $edition
     * @param array $document
     * @return void
     */
    protected function compareEdition(array $edition, array $document): void
    {
        if (! is_dir($this->absPath($edition['type']))) {
            $path = $this->relPath($edition['type']);
            $this->addWarning('edition', 'directory', $path);
            return;
        }

        $this->pushDir($edition['type']);
        foreach ($edition['formats'] as $format) {
            $this->compareFormat($format, $edition, $document);
        }
        $this->popDir();
    }

    /**
     * Compare format data with local files
     *
     * @param array $format
     * @param array $edition
     * @param array $document
     * @return void
     */
    protected function compareFormat(array $format, array $edition, array $document): void
    {
        if ($format['type'] === 'audio') {
            return; // @TODO
        }

        if ($format['type'] === 'softcover') {
            return;
        }

        $filename = "{$document['filename']}--{$edition['type']}.{$format['type']}";
        if (! file_exists($this->absPath($filename))) {
            $path = $this->relPath($filename);
            $this->addWarning('format', 'file', $path);
        }
    }

    /**
     * Get a relative path
     *
     * @param ?string $append
     * @return string
     */
    protected function relPath(?string $append): string
    {
        if (! $append) {
            return $this->dir;
        }

        $append = ltrim($append, '/');
        return "{$this->dir}/$append";
    }

    /**
     * Get an absolute path
     *
     * @param ?string $append
     * @return string
     */
    protected function absPath(?string $append = null): string
    {
        return getenv('LOCAL_ASSETS_DIR') . '/' . $this->relPath($append);
    }

    /**
     * Set the current operating directory
     *
     * @param string $dir
     * @return void
     */
    protected function setDir(string $dir): void
    {
        $this->dir = trim($dir, '/');
    }

    /**
     * Push a directory onto the operating directory stack
     *
     * @param string $dir
     * @return void
     */
    protected function pushDir(string $dir): void
    {
        $this->dir = $this->dir . '/' . trim($dir, '/');
    }

    /**
     * Pop the last directory off the operating stack
     *
     * @return void
     */
    protected function popDir()
    {
        $this->dir = dirname($this->dir);
    }

    /**
     * Add a warning
     *
     * @param Array<string> $args
     * @return void
     */
    protected function addWarning(...$args): void
    {
        $this->warnings[] = $args;
    }

    /**
     * Print a warning
     *
     * @param string $name
     * @param string $type
     * @param string $path
     * @return void
     */
    protected function printWarning(string $name, string $type, string $path): void
    {
        $typeIcon = [
            'directory' => '📦 ',
            'file' => '📜 ',
        ][$type];

        $nameIcon = [
            'friend' => '👵 ',
            'document' => '📒 ',
            'edition' => '📚 ',
            'format' => '💾 ',
        ][$name];

        $typeStr = "$typeIcon <purple>$type</>";
        $nameStr = "$nameIcon <cyan>$name</>";

        $this->print([
            "<green>Expected to find a $typeStr for the $nameStr at this location:</>",
            "  ↳ <red>$path</>",
            "",
        ]);
    }
}
