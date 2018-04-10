# Friends Library API

## dev

```SH
$ yarn reset
$ yarn start
```

## deploy

```SH
$ yarn deploy
```

## production tidbits

To start the production server, you should use this command:

```SH
$ NODE_ENV=production pm2 start /path/to/deploy/dir/current/src/index.js
```

If that is the command used to start the process, the `yarn deploy` will work correctly, since all it does is execute `pm2 restart all`, thus restarting the process originally started.

To troubleshoot and log out stuff from production, try:

```SH
$ pm2 delete all
$ NODE_ENV=production nodemon /path/to/deploy/dir/current/src/index.js
```
