#!/bin/sh
git filter-branch -f --env-filter '
OLD_EMAIL="qutabrohaan@gmail.com"
NEW_NAME="Vivek Dhumankhede"
NEW_EMAIL="mamaclassic57@gmail.com"
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
    GIT_AUTHOR_NAME="$NEW_NAME"
    GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]; then
    GIT_COMMITTER_NAME="$NEW_NAME"
    GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
export GIT_AUTHOR_NAME GIT_AUTHOR_EMAIL GIT_COMMITTER_NAME GIT_COMMITTER_EMAIL
' --tag-name-filter cat -- --branches --tags
