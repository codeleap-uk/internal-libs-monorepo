GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`

TAG="latest"

if [ "$GIT_BRANCH" = "master" ]; then
  TAG="latest"
else
  TAG="rc-latest"
fi

for i in 'common' 'mobile' 'web' 'config' 'cli'
do
cd packages/$i
npm publish --tag $TAG
cd ../..
done