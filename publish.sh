for i in 'common' 'mobile' 'web' 'config' 'cli'
do
cd packages/$i
npm publish
cd ../..
done