# Fell

Group manipulation of friend repositories.

## Commands

```SHELL
$ yarn fell branch
$ yarn fell status
$ yarn fell checkout -b feature-x
$ yarn fell commit -m "my message"
$ yarn fell push feature-x --open-pr
$ yarn fell delete feature-x
$ yarn fell sync # pull --rebase
$ yarn fell clone
```

_Exclude_ repos by passing strings, if these strings appear _anywhere in repo path_, that
repo will be excluded:

```SHELL
$ yarn fell branch --exclude wheeler
$ yarn fell branch --exclude wheeler --exclude fox
```

Or, you can _scope_ most command to repos on a specific branch, using the `--scope` flag:

```SHELL
$ yarn fell commit -m "feature x is rad" --scope feature-x
```

### `branch`

Reports the current HEAD branch for all repos.

```SHELL
$ yarn fell branch
```

### `status [--scope]`

Reports the current status for all repos.

```SHELL
$ yarn fell status
$ yarn fell status --scope master # only report repos on branch = `master`
```

### `checkout [-b] <branchname> [--exclude] [--scope]`

Checkout a branch for all selected repos. Only repos with a clean status will checkout to
requested branch. If `-b` is passed, a new branch will be created, same as standard
`git checkout -b <branchname>`. Like most other commands, the scope of this command can be
restricted by passing a `--scope` option, so that the command will only operate on repos
that started on that branch.

```SHELL
$ yarn fell checkout -b feature-x
$ yarn fell checkout -b feature-x --scope master # only checkout if repo WAS `master`
```

### `commit --message "my commit message" [--exclude] [--scope]`

Stage everything `git add .` and commit to all repos.

```SHELL
$ yarn fell commit --message "my message" --scope feature-x
$ yarn fell commit -m "my message" # -m shorthand for message
```

### `push <branch> [--open-pr] [--pr-title] [--pr-body] [--delay]`

Push branch from all repos to remote: `origin`. Can also auto-open Pull Requests with the
`--open-pr` option. By default the pull request title will be the most recent commit
message and the pull request body will be empty, unless you pass custom strings using
`--pr-title` and/or `--pr-body`.

**Note:** This command _auto-scopes_ to the `<branch>` you pass.

**Note:** You can pass a `--delay` flag (in seconds) to add seconds between PR creation.
This helps prevent GitHub api abuse sensors, and gives time for the API to not be
overwhelmed making pdf previews.

```SHELL
$ yarn fell push feature-x --open-pr --pr-title "my rad pr!"
$ yarn fell push master # push all repos straight to master
$ yarn fell push feature-x --delay 120 # delay 2 minutes between each push
```

### `delete <branch> [--exclude] [--scope]`

Delete branch from repos. Seems to always behave as if _forced_
(`git branch -D <branch>`).

```SHELL
$ yarn fell delete feature-x  # delete all `feature-x` branch
```

### `sync [--exclude] [--scope]`

Sync local repos with `origin/master`. Similar to `git pull --rebase`. Only operates on
repos with clean statuses. Should only do fast-forward merges.

```SHELL
$ yarn fell sync
$ yarn fell sync --exclude wheeler
$ yarn fell sync --scope feature-x
```
