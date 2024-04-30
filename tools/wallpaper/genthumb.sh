#!bash
mkdir tmp
mogrify -path tmp -resize 200x200^ -gravity Center -extent 200x200 *
cp -n tmp/* thumbs/
rm -rf tmp
