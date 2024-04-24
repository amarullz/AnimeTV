#!bash
rm pic/*
mogrify -format png -path pic -resize 256x256^ -gravity Center -extent 256x256 src/*
