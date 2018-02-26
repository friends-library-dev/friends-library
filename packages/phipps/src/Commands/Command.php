<?php

namespace Phipps\Commands;

use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Command\Command as SymfonyCommand;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

abstract class Command extends SymfonyCommand
{
    /**
     * @var InputInterface
     */
    protected $input;

    /**
     * @var OutputInterface
     */
    protected $output;

    /**
     * @var $dryRun
     */
    protected $dryRun = true;


    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName($this->name)
            ->setDescription($this->description)
            ->addOption(
                'dry-run',
                null,
                InputOption::VALUE_OPTIONAL,
                'dry run or actually execute',
                true
            );
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->input = $input;
        $this->output = $output;
        $this->setOutputStyles();
        $this->dryRun = filter_var($input->getOption('dry-run'), FILTER_VALIDATE_BOOLEAN);
        $this->fire();
    }

    /**
     * Since we use the `execute()` method to do boilerplate things,
     * this method actually indicates the main action of the command.
     *
     * @return int
     */
    abstract protected function fire();

    /**
     * Set easier-to-use output tag styles
     * Use `$this->printOutputStyles()` for reference
     *
     * @return void
     */
    protected function setOutputStyles()
    {
        $styles = [
            'green' => ['green'],
            'red' => ['red'],
            'yellow' => ['yellow'],
            'blue' => ['blue'],
            'cyan' => ['cyan'],
            'black' => ['black'],
            'white' => ['white'],
            'purple' => ['magenta'],
            'result' => ['black', 'cyan'],
        ];

        $formatter = $this->output->getFormatter();
        foreach ($styles as $name => $args) {
            $formatter->setStyle($name, new OutputFormatterStyle(...$args));
        }
    }

    /**
     * Show output styles for reference when writing commands
     *
     * @return void
     */
    protected function printOutputStyles()
    {
        $this->output->writeLn([
            '<green>This is \<green></green>',
            '<yellow>This is \<yellow></yellow>',
            '<red>This is \<red></red>',
            '<blue>This is \<blue></blue>',
            '<cyan>This is \<cyan></cyan>',
            '<purple>This is \<purple></purple>',
            '<result>This is \<result></result>',
            '<error>This is \<error></error>',
        ]);
    }
}
