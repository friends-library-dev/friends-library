# github bot

Use the `bunyan` cli to tail logs in production:

```sh
$ tail -f bot.log | node api/current/node_modules/.bin/bunyan --level DEBUG
```
