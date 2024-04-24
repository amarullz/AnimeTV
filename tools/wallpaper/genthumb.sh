#!bash
rm thumbs/*
mogrify -path thumbs -resize 200x200^ -gravity Center -extent 200x200 *