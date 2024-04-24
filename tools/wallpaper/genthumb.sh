#!bash
rm thumbs/*
mogrify -path thumbs -resize 100x100^ -gravity Center -extent 100x100 *