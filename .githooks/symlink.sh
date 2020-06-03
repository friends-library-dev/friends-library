# execute by running `yarn link:githooks` from monorepo root

cd ../.git/hooks

ln -sfv ../../.githooks/pre-commit ./pre-commit
chmod a+rwx ./pre-commit

ln -sfv ../../.githooks/post-checkout ./post-checkout
chmod a+rwx ./post-checkout
