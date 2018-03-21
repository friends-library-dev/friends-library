# Phipps

Asset sanitization, validation, and deployment.

## Install

```SH
$ composer install
$ yarn
```

## Usage

```SH
$ php phipps clean
$ php phipps deploy
```

All commands run by default in `dry-run` mode.  To actually run them with side-effects you must specify non-dry-run like so:

```SH
$ php phipps clean --dry-run=false
$ php phipps deploy --dry-run=false
```

## Testing

```SH
$ yarn test         # run all php tests
$ yarn test:watch   # watch all php tests
```

## Scaffolding

```SH
$ php phipps scaffold:fixer SomeFixer  # scaffold a path fixer file and test class
```
