#!bash
mkdir tmp
mogrify -format png -path tmp -resize 256x256^ -gravity Center -extent 256x256 src/*
cp -n tmp/* pic/
rm -rf tmp
