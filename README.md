# AnimeTV for Android TV & Google TV

AnimeTV is Android TV application for watching your favorite anime series and movies on your Android TV, It also runs on non-TV Android devices (Phones and Tablets) with some UI limitations.

> Source data is from *one anime streaming website* and I don't have any affiliation with it, and it may break on site updates.
> Take a look at source code for more info

## Donation & More Information

| License | Stable Release | Nightly Release | Support |
|-------|---------|---------|---------|
| [![GitHub License](https://img.shields.io/github/license/amarullz/AnimeTV)](/LICENSE) | [![GitHub Release](https://img.shields.io/github/v/release/amarullz/AnimeTV?logo=github&label=Release)](https://github.com/amarullz/AnimeTV/releases) | [![Nightly](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fanimetv.amarullz.com%2Flast-nightly&query=%24%5B0%5D.name&style=flat&logo=flood&logoColor=fff&label=Nightly&labelColor=600&color=494)](https://amarullz.com/animetv-nightly/) | [![Discord](https://img.shields.io/discord/1199444562670792714?style=flat&labelColor=7289da&color=2c2f33&label=Discord&logo=discord&logoColor=ffffff)](https://discord.gg/VGtGtRedGR) |


- **Donate Project :** [Paypal Link - https://paypal.me/amarullz](https://paypal.me/amarullz)
- **Developer Website :** [https://amarullz.com/](https://amarullz.com/)
- **Nightly Release :** [https://amarullz.com/animetv-nightly/](https://amarullz.com/animetv-nightly/)
- **Development Discussion :** [https://amarullz.com/animetv-discord/](https://amarullz.com/animetv-discord/)
- **More Detail Information :** [https://amarullz.com/animetv/](https://amarullz.com/animetv/)
- **Join Discussion on Discord :**  [https://discord.gg/VGtGtRedGR](https://discord.gg/VGtGtRedGR)

## Features
- **NEW** - MAL & AniList Integration
- **NEW** - DNS over HTTPS and Multiple HTTP Client selection
- **NEW** - Multiple Source
- **NEW** - Mirror Stream Server
- **NEW** - Auto Update App
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

![Main Home Screen](https://cdn.discordapp.com/attachments/1214548946521821254/1214940773334786078/image.png?ex=65faf0c4&is=65e87bc4&hm=0a6e18f6ce46829b06d5fc391c1939606f08cc149b32b4d5d45a912a2d8342ea&)

![Anime Popup](https://cdn.discordapp.com/attachments/1214548946521821254/1214941019896938516/image.png?ex=65faf0ff&is=65e87bff&hm=3f0c936bba98b85f6d4595f49d1a22d222ecd1640e82d5cbdd20d1a96a452b55&)

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