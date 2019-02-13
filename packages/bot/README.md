# friends-library-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Development

Run the bot server

```SHELL
$ yarn bot:develop # from monorepo root
```

## Simulate Test Events

Use `yarn bot:receive` and pass the slug of a payload fixture located in `packages/bot/__tests__/fixtures`.
The fixture file _must_ have a special top-level property `__github_event__` to help the simulation
script correctly emulate a GitHub webhook event.

__Note: the bot dev server needs to be running for this to work.__

```SHELL
$ yarn bot:receive pull_request.opened
```
