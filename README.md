# AnimeTV for Android TV & Google TV

AnimeTV is Android TV application for watching your favorite anime series and movies on your Android TV, It also runs on non-TV Android devices (Phones and Tablets) with some UI limitations.

> Source data is from *one anime streaming website* and I don't have any affiliation with it, and it may break on site updates.
> Take a look at source code for more info

## Features
- Search and Advance Search with Genre & Anime Type filters
- Easy to navigate with Android TV Remote
- Change Theme Color
- Home Anime List
  - Hot
  - Recently Updated
  - Top Anime
  - Trending Episodes
  - Random Anime
  - Watchlist Anime – You can set anime as favorite to watch
  - Watch History – All anime has been watched before with last timestamp
- List of episodes and seasons for show
- Recommendation anime for current show
- Auto Next episode
- Auto Skip Intro & Outro
- Auto Skip Filler Episode
- Genre & Type Tags
- Video display style ( Centered, Fit, Scaled ) for non widescreen videos.
- Multiple video server
- Support for Android TV / Google TV home list and PlayNext
- All Watchlist & History is saved locally – I don’t have any server to save your watch & history 🤣 So don’t worry.

## Open Source
Source code is available at github ( https://github.com/amarullz/AnimeTV ). Release of source code may make *source website* prevent this apps to run, but hope it work fine for long, and you will help me update it when it break 😂.

And Please Contribute your bugfixes, reports & suggestions for next better update. If you find it useful, donation is welcome.

## WebView Based?
Yes, it was webview based application. UI and Data Fetch Method is using webview, because I don't have access to *source website* database, I just load the web in headless webview and fetch site data info with javascript injection, because it's not possible to use only http client to get data.

Almost all data need javascript to make it available (It's not pure HTML that can easily parsed from text). The site also use **QUIC** rather than HTTP1X, so I need to include **CronetEngine** to make it works.

But the good news is **AnimeTV** will block any analytics and ads domain (dns) when requesting & fetching data. All data like watchlist & watch history also stored local in **localStorage**.

## Screenshot
More screenshot is available in my website: https://amarullz.com/2023/09/02/animetv-for-android-tv-google-tv/
Here only a couple screenshot:

![Main Home Screen](https://amarullzcom.files.wordpress.com/2023/09/01-home.jpg)

![Play Info](https://amarullzcom.files.wordpress.com/2023/09/07-play-info.jpg)

## License
**Copyright 2023 Ahmad Amarullah (https://amarullz.com)**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.