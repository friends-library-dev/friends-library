# Phipps

Asset sanitization, validation, and deployment.

## Install

```SH
$ composer install
$ yarn
```

## Usage

```SH
$ php phipps clean    # check all Sync files for problems and fix
$ php phipps deploy   # deploy current state of Sync files to remote cloud storage
$ php phipps compare  # compare data in friends .yml files to local Sync files
```

All commands run by default in `dry-run` mode.  To actually run them with side-effects you must specify non-dry-run like so:

```SH
$ php phipps clean --dry-run=false
$ php phipps deploy --dry-run=false
```

The only exception is the `php phipps compare` command which does not have a `dry-run` mode because it makes no transformations or side-effects, it only notifies of inconsistencies which must then be manually addressed.

## Testing

```SH
$ yarn test         # run all php tests
$ yarn test:watch   # watch all php tests
```

## Scaffolding

```SH
$ php phipps scaffold:fixer SomeFixer  # scaffold a path fixer file and test class
```
