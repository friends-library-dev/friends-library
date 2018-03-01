# Phipps

Asset sanitization, validation, and deployment.

## Install

```
$ composer install
$ yarn
```

## Usage

```
$ php phipps clean
$ php phipps deploy
```

All commands run by default in `dry-run` mode.  To actually run them with side-effects you must specify non-dry-run like so:

```
$ php phipps clean --dry-run=false
$ php phipps deploy --dry-run=false
```
