GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`

TAG="latest"

if [ "$GIT_BRANCH" = "master" ]; then
  TAG="latest"
else
  TAG="rc-latest"
fi

npm_token=$1 bunx @morlay/bunpublish --tag $TAG