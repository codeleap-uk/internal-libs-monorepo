for i in 'common' 'mobile' 'web' 'config' 'cli'
do
cd packages/$i
npm version patch
cd ../..
done