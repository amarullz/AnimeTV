#!bash
rm pic/*
mogrify -path pic -resize 256x256^ -gravity Center -extent 256x256 src/*
