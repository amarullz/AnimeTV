# AnimeTV for Android TV & Google TV

AnimeTV is Android TV application for watching your favorite anime series and movies on your Android TV, It also runs on non-TV Android devices (Phones and Tablets) with some UI limitations.

> Source data is from *one anime streaming website* and I don't have any affiliation with it, and it may break on site updates.
> Take a look at source code for more info

[![AnimeTV](/tools/logo-design/animetv-logo/animetv-logo-brand.png)](https://amarullz.com/)

## Download URL and Code
- **STABLE APK**
  - URL: [https://animetv.amarullz.com/apk](https://animetv.amarullz.com/apk)
  - AFTV Downloader code: **`601972`**
- **NIGHTLY APK**
  - URL: [https://animetv.amarullz.com/nightly](https://animetv.amarullz.com/nightly)
  - AFTV Downloader code: **`196130`**

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/ZP5Do1HB0f8/maxresdefault.jpg)](https://www.youtube.com/watch?v=ZP5Do1HB0f8)

## Donation & More Information

| License | Stable Release | Nightly Release | Support |
|-------|---------|---------|---------|
| [![GitHub License](https://img.shields.io/github/license/amarullz/AnimeTV)](/LICENSE) | [![GitHub Release](https://img.shields.io/github/v/release/amarullz/AnimeTV?logo=github&label=Release)](https://github.com/amarullz/AnimeTV/releases) | [![Nightly](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fanimetv.amarullz.com%2Flast-nightly&query=%24%5B0%5D.name&style=flat&logo=amp&logoColor=fff&label=Nightly&color=800)](https://amarullz.com/animetv-nightly/) | [![Discord](https://img.shields.io/discord/1199444562670792714?style=flat&labelColor=7289da&color=2c2f33&label=Discord&logo=discord&logoColor=ffffff)](https://discord.gg/VGtGtRedGR) |


- **Donate Project :** [Paypal Link - https://paypal.me/amarullz](https://paypal.me/amarullz)
- **Developer Website :** [https://amarullz.com/](https://amarullz.com/)
- **Nightly Release :** [https://amarullz.com/animetv-nightly/](https://amarullz.com/animetv-nightly/)
- **Development Discussion :** [https://amarullz.com/animetv-discord/](https://amarullz.com/animetv-discord/)
- **More Detail Information :** [https://amarullz.com/animetv/](https://amarullz.com/animetv/)
- **Join Discussion on Discord :**  [https://discord.gg/VGtGtRedGR](https://discord.gg/VGtGtRedGR)

- **3.4.0 Release Information:** [https://amarullz.com/2024/03/25/animetv-version-3-4-0-has-been-released/](https://amarullz.com/2024/03/25/animetv-version-3-4-0-has-been-released/)

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

![Main Home Screen](https://cdn.discordapp.com/attachments/1221532077699108994/1221532534488301609/1-animetv-home.jpg?ex=6612ebd3&is=660076d3&hm=010c36ea9812b97a81ba2930e7f9eb1c26769a32528bf7314516cbcdc8a6a195&)

![MyList](https://cdn.discordapp.com/attachments/1221532077699108994/1221532534916255955/2-animetv-mylist.jpg?ex=6612ebd3&is=660076d3&hm=32f30579203d346b84d12c06cee214021270e7f1db05e654b42ce01ead35f692&)

![Airing Schedule](https://cdn.discordapp.com/attachments/1221532077699108994/1221532535251664897/3-animetv-schedule.jpg?ex=6612ebd3&is=660076d3&hm=73cf79d25d7386544337721e1cf68147aa2c6f1ffcb19e941cc0f41dc01048c1&)

![Settings](https://cdn.discordapp.com/attachments/1221532077699108994/1221532535880945755/4-animetv-settings.jpg?ex=6612ebd3&is=660076d3&hm=eebdb348f9aaa4fe56293ae7e38a7fe92f8360871ee088c1692fe37d6f8f61ad&)

![Popup](https://cdn.discordapp.com/attachments/1221532077699108994/1221532536413491370/5-animetv-popup.jpg?ex=6612ebd3&is=660076d3&hm=a0522ca71fab612ad5de4b6604ac8ec203ebdba20647e4424ac1c69bae6fc717&)

![Play Info](https://cdn.discordapp.com/attachments/1214548946521821254/1214941469815607326/image.png?ex=65faf16a&is=65e87c6a&hm=95d783e49fd17d4f2f2c7f77783cdfbefc12b315c90f2549f79392a02f93fc09&)

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