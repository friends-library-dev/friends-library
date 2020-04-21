#!/bin/sh
# @see https://github.com/slawekkolodziej/netlify-lerna-caching-demo
NODE_MODULES_CACHE="./node_modules"
MONOREPO_CACHE="$NODE_MODULES_CACHE/monorepo-cache"
mkdir -p $MONOREPO_CACHE

restore_deps() {
    PACKAGES=$(ls -1 $1)

    for PKG in $PACKAGES
    do
        PKG_CACHE="$MONOREPO_CACHE/$PKG"
        if [ -d $PKG_CACHE ];
        then
            mv $PKG_CACHE $1/$PKG/node_modules
            echo "Restored node_modules/ dir for package: $PKG"
        else
            echo "No node_modules/ dir cached for package: $PKG"
        fi
    done
}

restore_deps packages
# restore_deps apps
