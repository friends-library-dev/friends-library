<?php

Use Aws\Sdk;
use Aws\S3\S3Client;
use Aws\S3\S3ClientInterface;
use Illuminate\Container\Container;
use Symfony\Component\Finder\Finder;

$container = new Container();

$container->bind(Finder::CLASS, function () {
    return Finder::create()
        ->in(getenv('LOCAL_ASSETS_DIR'))
        ->exclude('Sync.Cache')
        ->name('/\.(mobi|epub|pdf|mp3)$/');
});

$container->singleton(Sdk::CLASS, function () {
    return new Aws\Sdk([
        'version' => 'latest',
        'region'  => getenv('DEPLOY_REGION'),
        'endpoint' => getenv('DEPLOY_ENDPOINT'),
        'credentials' => [
            'key' => getenv('DEPLOY_KEY'),
            'secret' => getenv('DEPLOY_SECRET'),
        ],
    ]);
});

$container->bind(S3ClientInterface::CLASS, function (Container $container) {
    return $container->make(Sdk::CLASS)->createS3();
});


return $container;
