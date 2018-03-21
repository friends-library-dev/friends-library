<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class AggregateFixer implements FixerInterface
{
    /**
     * @var Array<FixerInterface>
     */
    protected $fixers = [];

    /**
     * AggregateFixer constructor.
     */
    public function __construct()
    {
        $files = glob(__DIR__ . '/*Fixer.php');
        foreach ($files as $file) {
            if ($file !== __FILE__) {
                $class = '\Phipps\Fixers\\' . pathinfo($file, PATHINFO_FILENAME);
                $this->fixers[] = new $class();
            }
        }
    }
    /**
     * {@inheritdoc}
     */
    public function fix(Path $path): Path
    {
        return array_reduce($this->fixers, function (Path $acc, FixerInterface $fixer): Path {
            return $fixer->fix($acc);
        }, $path);
    }
}
