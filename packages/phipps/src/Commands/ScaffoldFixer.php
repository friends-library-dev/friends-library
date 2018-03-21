<?php

namespace Phipps\Commands;

use Symfony\Component\Console\Input\InputArgument;

class ScaffoldFixer extends Command
{
    /**
     * @var string
     */
    protected $name = 'scaffold:fixer';

    /**
     * @var string
     */
    protected $description = 'scaffold a fixer class file and test file';

    /**
     * {@inheritdoc}
     */
    protected function configureArguments()
    {
        $this->addArgument(
            'class',
            InputArgument::REQUIRED,
            'fixer class name: (e.g: FooFixer)'
        );
    }

    /**
     * {@inheritdoc}
     */
    protected function fire(): int
    {
        $class = $this->input->getArgument('class');
        $fixerPhp = $this->getFixerPhp($class);
        $testPhp = $this->getTestPhp($class);

        $appDir = getcwd();
        $classPath = $appDir . "/src/Fixers/{$class}.php";
        $testPath = $appDir . "/tests/Fixers/{$class}Test.php";
        if (file_exists($classPath) || file_exists($testPath)) {
            throw new \Exception("Fixer files already exist!");
        }

        file_put_contents($classPath, $fixerPhp);
        file_put_contents($testPath, $testPhp);
        return 0;
    }

    /**
     * Get php for fixer (non-test) class
     *
     * @param string $class
     * @return string
     */
    protected function getFixerPhp(string $class): string
    {
        return <<<PHP
<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;

class $class implements FixerInterface
{
    /**
     * {@inheritdoc}
     */
    public function fix(Path \$path): Path
    {
        return \$path;
    }
}

PHP;
    }

    /**
     * Get php for step test class
     *
     * @param string $class
     * @return string
     */
    protected function getTestPhp(string $class): string
    {
        return <<<PHP
<?php

namespace Phipps\Fixers;

use Phipps\Models\Path;
use PHPUnit\Framework\TestCase;

class {$class}Test extends TestCase
{
    /**
     * @var $class
     */
    protected \$fixer;

    /**
     * @var Path
     */
    protected \$path;

    public function setUp()
    {
        \$this->fixer = new $class();
        \$this->path = new Path('en/friend/doc/edition/Foo--updated.pdf');
    }

    public function testFixesSomething()
    {
        \$fixed = \$this->fixer->fix(\$this->path);

        \$this->assertSame('Foo--updated.pdf', \$fixed->getBasename());
    }
}
PHP;
    }
}
