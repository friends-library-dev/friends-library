<?php

use Illuminate\Container\Container;
use Symfony\Component\Finder\Finder;

$container = new Container();

$container->bind(Finder::CLASS, function () {
    return Finder::create()
        ->in(getenv('LOCAL_ASSETS_DIR'))
        ->exclude('Sync.Cache');
});



return $container;
