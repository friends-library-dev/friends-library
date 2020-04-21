#!/bin/sh
# @see https://github.com/slawekkolodziej/netlify-lerna-caching-demo
NODE_MODULES_CACHE="./node_modules"
MONOREPO_CACHE="$NODE_MODULES_CACHE/monorepo-cache"
mkdir -p $MONOREPO_CACHE

cache_deps() {
    PACKAGES=$(ls -1 $1)

    for PKG in $PACKAGES
    do
        PKG_NODE_MODULES="$1/$PKG/node_modules"
        if [ -d $PKG_NODE_MODULES ];
        then
            mv $PKG_NODE_MODULES $MONOREPO_CACHE/$PKG
            echo "Cached node_modules/ dir for package: $PKG"
        else
            echo "No node_modules/ dir to cache for package: $PKG"
        fi
    done
}

cache_deps packages
# cache_deps apps
