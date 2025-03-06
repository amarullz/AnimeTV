# AnimeTV for Android TV & Google TV

AnimeTV is Android TV application for watching your favorite anime series and movies on your Android TV, It also runs on non-TV Android devices (Phones and Tablets) with some UI limitations.

> Source data is from *one anime streaming website* and I don't have any affiliation with it, and it may break on site updates.
> Take a look at source code for more info

## Download URL and Code
- **STABLE APK**
  - AFTV Downloader code: **`601972`**
- **NIGHTLY APK**
  - AFTV Downloader code: **`196130`**

## Donation & More Information
- **Donate Project :** [Paypal Link - https://paypal.me/amarullz](https://paypal.me/amarullz)
- **Join Discussion on Discord :**  [https://discord.gg/xPmEnY32](https://discord.gg/xPmEnY32)

## Features
- **NEW** - UI Interface with Trailer Video
- **NEW** - 6 Different sources
- **NEW** - List reorder / management
- **NEW** - Auto Update App and in app nightly build installation
- **NEW** - Airing Schedule
- **NEW** - MAL & AniList Integration
- **NEW** - DNS over HTTPS and Multiple HTTP Client selection
- **NEW** - Mirror Stream Server
- **NEW** - Soft-subtitle & Auto Translate to **134 Languages** (Only for supported contents)
- **NEW** - Settings panel
- **NEW** - Change Theme Color & Animation performance
- **NEW** - Soft-subtitle Text Style Configuration
- **NEW** - Playback Speed (0.5x - 3.00x)
- **NEW** - Include Non-Japan Anime Settings
- Search and Advance Search with Genre & Anime Type filters
- Auto Next episode
- Auto Skip Intro & Outro
- Auto Skip Filler Episode
- Genre & Type Tags
- Video display style ( Centered, Fit, Scaled ) for non widescreen videos.
- Easy to navigate with Android TV Remote
- Home Anime List
  - Hot
  - Recently Updated
  - Dub Update
  - Top Anime
  - Trending Episodes
  - Random Anime
  - Watchlist Anime – You can set anime as favorite to watch
  - Watch History – All anime has been watched before with last timestamp
- List of episodes and seasons for show
- Recommendation anime for current show
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
More screenshot is available in my website: https://amarullz.com/animetv/
Here only a couple screenshot:

![Homescreen](https://github.com/amarullz/AnimeTV/assets/1386831/d05c7e5d-8abc-4fed-9183-0c58aa815c44)

![Settings](https://github.com/amarullz/AnimeTV/assets/1386831/68686765-a7eb-4fe8-bc69-f69996053a5d)

![Anime Popup](https://github.com/amarullz/AnimeTV/assets/1386831/c8854596-1984-4c54-993d-d358d9943e7d)

![MyList](https://github.com/amarullz/AnimeTV/assets/1386831/9d8a9e51-c3a0-43c0-a487-c9fb36949c43)

![Customize & Ordering](https://github.com/amarullz/AnimeTV/assets/1386831/b1c86f23-5ca3-4008-95f6-c3107e062f07)

![TV friendly search](https://github.com/amarullz/AnimeTV/assets/1386831/59e722d8-f695-4245-8783-1d1675906c98)

![Playback](https://github.com/amarullz/AnimeTV/assets/1386831/ff1c0363-746d-4216-831b-cf60f4dce243)

## DISCLAIMER

* AnimeTV only scrapes links from various websites and makes it easier for users to find anime.

* AnimeTV or any of its developer doesn't host any of the contents found inside the app. All images and anime information found in the app are taken from various public APIs.

* All anime found in AnimeTV are taken from various 3rd party anime hosting websites.

* AnimeTV or it's owners aren't liable for any misuse of any of the contents found inside or outside of the app and cannot be held accountable for the distribution of any of the contents found inside the app.

* By using AnimeTV, you comply to the fact that the developer of the app is not responsible for any of the contents found in the app; nonetheless they may or may not be from their legitimate sources.

* If the internet infringement issues are involved, please contact the source website. The developer does not assume any legal responsibility.

## License
**Copyright 2023 Ahmad Amarullah**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
