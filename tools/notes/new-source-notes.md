# Universal Skip Time

```
FORMAT:
https://api.aniskip.com/v2/skip-times/<--MAL-ID-->/<--EPISODE-->?episodeLength=0&types%5B%5D=ed&types%5B%5D=mixed-ed&types%5B%5D=mixed-op&types%5B%5D=op&types%5B%5D=recap

EXAMPLE:
https://api.aniskip.com/v2/skip-times/54744/3?episodeLength=0&types%5B%5D=ed&types%5B%5D=mixed-ed&types%5B%5D=mixed-op&types%5B%5D=op&types%5B%5D=recap
```

# MIRURO
```
12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=
12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=

# Get anime info: Bleach: Thousand-Year Blood War - The Conflict
curl "https://mapper.miruro.tv/anilist/anime/169755.json" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

# Get Episode Bleach - Animepahe
curl "https://dio.miruro.tv/info?id=5652&provider=animepahe" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

# Get Episode M3U8
curl "https://dio.miruro.tv/sources?id=5652&provider=animepahe&ep=1" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

curl "https://dio.miruro.tv/sources?id=5652&provider=animepahe&ep=1" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

curl "https://dio.miruro.tv/sources?id=bleach-sennen-kessen-hen-soukoku-tan&provider=gogoanime&ep=1" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

curl "https://dio.miruro.tv/sources?id=bleach-thousand-year-blood-war-the-conflict-19322&provider=zoro&ep=128682" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="


curl "https://dio.miruro.tv/info?id=bleach-thousand-year-blood-war-the-conflict-19322&provider=zoro" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="


curl "https://zeta.miruro.tv/?url=https:%2F%2Fhi.miruro.tv%2Fapi%2Fv2%2Fhianime%2Fepisode%2Fsources%3FanimeEpisodeId%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D128682%3Fep%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D128682%3Fserver%3Dhd-1%26category%3Dsub" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="

https://hi.miruro.tv/api/v2/hianime/episode/sources?animeEpisodeId=bleach-thousand-year-blood-war-the-conflict-19322?ep=128682?ep=bleach-thousand-year-blood-war-the-conflict-19322?ep=128682?server=hd-1&category=sub




https://hi.miruro.tv/api/v2/hianime/episode/sources?animeEpisodeId=bleach-thousand-year-blood-war-the-conflict-19322?ep=128682?ep=bleach-thousand-year-blood-war-the-conflict-19322?ep=128682?server=hd-1&category=sub

https://hi.miruro.tv/api/v2/hianime/episode/sources?animeEpisodeId=anime-19322%3Fep%3D128682


# Info Episode List
{
    "episodeList": {
        "status": true,
        "totalItems": 11,
        "episodes": [
        {
            "number": 1,
            "id": "128444",
            "title": "A",
            "jptitle": "A",
            "href": "/watch/bleach-thousand-year-blood-war-the-conflict-19322?ep=128444",
            "filler": false
        },
        {
            "number": 2,
            "id": "128578",
            "title": "Kill the King",
            "jptitle": "Kill the King",
            "href": "/watch/bleach-thousand-year-blood-war-the-conflict-19322?ep=128578",
            "filler": false
        }
        ]
    }
}
<HREF> = href.substring(7) => "/watch/bleach-thousand-year-blood-war-the-conflict-19322?ep=128578" => "bleach-thousand-year-blood-war-the-conflict-19322?ep=128578"
<API-URL> = https://hi.miruro.tv/api/v2/hianime/episode/sources?animeEpisodeId=<HREF>?ep=<HREF>?server=hd-1&category=sub
GET URL = "https://zeta.miruro.tv/?url="+encodeURIComponent(<API-URL>);

---- GET SOURCES HIANIME ----

curl "https://zeta.miruro.tv/?url=https%3A%2F%2Fhi.miruro.tv%2Fapi%2Fv2%2Fhianime%2Fepisode%2Fsources%3FanimeEpisodeId%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D129599%3Fep%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D129599%3Fserver%3Dhd-1%26category%3Dsub" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="


curl "https://beta.miruro.tv/?url=https%3A%2F%2Fhi.miruro.tv%2Fapi%2Fv2%2Fhianime%2Fepisode%2Fsources%3FanimeEpisodeId%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D129599%3Fep%3Dbleach-thousand-year-blood-war-the-conflict-19322%3Fep%3D129599%3Fserver%3Dhd-1%26category%3Dsub" -H "origin: https://www.miruro.tv" -H "x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ="


/watch/bleach-thousand-year-blood-war-the-conflict-19322?ep=128682
https://hi.miruro.tv/api/v2/hianime/episode/sources?animeEpisodeId=bleach-thousand-year-blood-war-the-conflict-19322?ep=129599?ep=bleach-thousand-year-blood-war-the-conflict-19322?ep=129599?server=hd-1&category=sub


---- INFO ----


curl 'https://alpha.miruro.tv/?url=https:%2F%2Fdio.miruro.tv%2Finfo%3Fid%3D178729%26provider%3Danilist' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'origin: https://www.miruro.tv' \
  -H 'referer: https://www.miruro.tv/' \  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='


curl 'https://dio.miruro.tv/info?id=178729&provider=anilist' -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='
curl 'https://dio.miruro.tv/mal/anime/54744.json' -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='


curl 'https://mapper.miruro.tv/anilist/anime/21.json' -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=' -H 'origin: https://www.miruro.tv'



https://mapper.miruro.tv/mal/anime/54744.json

https://mapper.miruro.tv/mal/anime/59175.json


curl 'https://mapper.miruro.tv/mal/anime/59175.json' -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='


curl 'https://mapper.miruro.tv/mal/anime/59175.json' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'origin: https://www.miruro.tv' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='



curl 'https://mapper.miruro.tv/anilist/anime/21.json' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'origin: https://www.miruro.tv' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='


curl 'https://mapper.miruro.tv/mal/anime/21.json' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'origin: https://www.miruro.tv' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='

curl 'https://dio.miruro.tv/info?id=5691&provider=animepahe' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'origin: https://www.miruro.tv' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='


---------- OLD -------------


curl 'https://mapper.miruro.tv/mal/anime/54744.json' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='

curl 'https://mapper.miruro.tv/anilist/anime/162804.json' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0' \
  -H 'x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ='

x-atx: 12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=

https://miruro-api.vercel.app/meta/anilist/data/<ANILIST-ID>
https://miruro-api.vercel.app/meta/anilist/data/162804


https://miruro-api.vercel.app/meta/anilist/watch/tokidoki-bosotto-russia-go-de-dereru-tonari-no-alya-san-episode-2

https://aniwatch-api-azure.vercel.app/anime/info?id=alya-sometimes-hides-her-feelings-in-russian-19254

https://miruro-api.vercel.app/meta/anilist/watch/tokidoki-bosotto-russia-go-de-dereru-tonari-no-alya-san-episode-4

```

## MIRURO KEYS
```js
# index.js
const BASE_URL = ensureUrlEndsWithSlash("https://api.miruro.tv/")
  , BASE_URL_2 = ensureUrlEndsWithSlash("https://api.miruro.tv/")
  , BASE_URL_3 = ensureUrlEndsWithSlash("https://hi.miruro.tv/")
  , BASE_URL_4 = ensureUrlEndsWithSlash("https://api.malsync.moe/")
  , BASE_URL_5 = ensureUrlEndsWithSlash("https://mapper.miruro.tv/")
  , SKIP_TIMES = ensureUrlEndsWithSlash("https://api.aniskip.com/")
  , PROXY_ALPHA = ensureUrlEndsWithSlash("https://alpha.miruro.tv")
  , PROXY_BETA = ensureUrlEndsWithSlash("https://beta.miruro.tv")
  , PROXY_GAMMA = ensureUrlEndsWithSlash("https://gamma.miruro.tv")
  , PROXY_DELTA = ensureUrlEndsWithSlash("https://delta.miruro.tv")
  , PROXY_EPSILON = ensureUrlEndsWithSlash("https://epsilon.miruro.tv")
  , API_KEY = "12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=";
```

# SHIROKO API

```
var res=await fetch('https://shiroko.co/api/v2/episode/21',{method:"GET",
        headers:{
          'referer': 'https://shiroko.co/'
        }});
await res.text();

var res=await fetch('https://kaizoku.live/api/v2/episode/21',{method:"GET",
        headers:{
          'referer': 'https://kaizoku.live/'
        }});
await res.text();
```


## Get Source
```
var res=await fetch('https://shiroko.co/api/v2/source',{
        method:"POST",
        headers:{
          'referer': 'https://shiroko.co/',
          'content-type':'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
            "providerId": "soft",
            "watchId": "alya-sometimes-hides-her-feelings-in-russian-19254?ep=125794",
            "id": 162804,
            "sub": "sub"
        })
    });
await res.text();

DATA: {
    "providerId": "soft",
    "watchId": "alya-sometimes-hides-her-feelings-in-russian-19254?ep=125794",
    "id": 162804,
    "sub": "sub"
}
await res.text();

RESPONSE:
{
    "results": {
        "sources": [
            {
                "url": "https://w2r.biananset.net/_v7/73850d3a2ef1e0ed7c38f43c0e7c4ea89f8decc4daf73b2700bd4a1f9f04f1d0c6ccb082c5fdd27cf98b39da186100165432a5a4b2c628401923e3eee0414e516515cd8cf4ef0e46a95390cf08ee4d672ef2a25cd177b1f2ec3a574adcd8911d5b0fdd638fd9cfeb1184692bfe4ef98c907227adc9eb5a47e390d87655bc2659/master.m3u8",
                "isM3U8": true
            },
            {
                "url": "https://w2r.biananset.net/_v7/73850d3a2ef1e0ed7c38f43c0e7c4ea89f8decc4daf73b2700bd4a1f9f04f1d0c6ccb082c5fdd27cf98b39da186100165432a5a4b2c628401923e3eee0414e516515cd8cf4ef0e46a95390cf08ee4d672ef2a25cd177b1f2ec3a574adcd8911d5b0fdd638fd9cfeb1184692bfe4ef98c907227adc9eb5a47e390d87655bc2659/master.m3u8",
                "isM3U8": true,
                "quality": "auto"
            }
        ],
        "subtitles": [
            {
                "url": "https://ccb.megaresources.co/e3/35/e3357bc9764d7a0f1bdf4dc1e7eb0176/chi-5.vtt",
                "lang": "Chinese - Chinese (Simplified)"
            },
            {
                "url": "https://ccb.megaresources.co/e3/35/e3357bc9764d7a0f1bdf4dc1e7eb0176/eng-2.vtt",
                "lang": "English"
            },
            {
                "url": "https://ccb.megaresources.co/e3/35/e3357bc9764d7a0f1bdf4dc1e7eb0176/ind-3.vtt",
                "lang": "Indonesian"
            },
            {
                "url": "https://ccb.megaresources.co/e3/35/e3357bc9764d7a0f1bdf4dc1e7eb0176/tha-4.vtt",
                "lang": "Thai"
            },
            {
                "url": "https://imgb.megaresources.co/_a_preview/48/48a476e069d82059999f750cd1b749dd/thumbnails/sprite.vtt",
                "lang": "Thumbnails"
            }
        ],
        "intro": {
            "start": 285,
            "end": 374
        },
        "outro": {
            "start": 1390,
            "end": 1480
        }
    }
}
```



# ANIMEPAHE

## DDOS Protection Cookie
```
Check DDOS
https://check.ddos-guard.net/check.js

Cookie (__ddg2_):
headers:{
    'cookie': '__ddg2_=1234567890'
}

DDOS Guard ID:
(function(){
    new Image().src = 'https://animepahe.ru/.well-known/ddos-guard/id/CedonXg73FXxEsrJ';
    new Image().src='https://check.ddos-guard.net/set/id/CedonXg73FXxEsrJ';}
)()

--> CedonXg73FXxEsrJ : __ddg2_ cookie
```

## Search:
```
URL: https://animepahe.ru/api?m=search&q=russia
var res=await fetch('https://animepahe.ru/api?m=search&q=russia',{method:"GET",
        headers:{
          'cookie': '__ddg2_=1234567890'
        }});
await res.text();

RESPONSE:
{
    "total": 12,
    "per_page": 8,
    "current_page": 1,
    "last_page": 2,
    "from": 1,
    "to": 8,
    "data": [
        {
            "id": 5594,
            "title": "Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san",
            "type": "TV",
            "episodes": 12,
            "status": "Currently Airing",
            "season": "Summer",
            "year": 2024,
            "score": 7.94,
            "poster": "https://i.animepahe.ru/posters/5851fb3586b3bbb8ea2a9d046170c208bb8df2d291550534484018a1aaf9f363.jpg",
            "session": "dd32c7c0-e215-c911-5081-23ed5037b26c"
        },
        ...
    ]
}
```

## Detail Data:
```
URL: https://animepahe.ru/api?m=release&id=dd32c7c0-e215-c911-5081-23ed5037b26c&sort=episode_desc&page=1
var res=await fetch('https://animepahe.ru/api?m=release&id=dd32c7c0-e215-c911-5081-23ed5037b26c&sort=episode_desc&page=1',{method:"GET",
        headers:{
          'cookie': '__ddg2_=1234567890'
        }});
await res.text();

RESPONSE:
{
    "total": 9,
    "per_page": 30,
    "current_page": 1,
    "last_page": 1,
    "next_page_url": null,
    "prev_page_url": null,
    "from": 1,
    "to": 9,
    "data": [
        {
            "id": 63677,
            "anime_id": 5594,
            "episode": 9,
            "episode2": 0,
            "edition": "",
            "title": "",
            "snapshot": "https://i.animepahe.ru/snapshots/4214758b88a6a02b65075ed3a2cdf592068d039f7666cbac420d8f074acc65f3.jpg",
            "disc": "",
            "audio": "jpn",
            "duration": "00:25:10",
            "session": "a1c7ef88e44bcd678506e0617ece32932112df621f4e2a906130c29c5c481751",
            "filler": 0,
            "created_at": "2024-08-28 15:05:25"
        },
        {
            "id": 63614,
            "anime_id": 5594,
            "episode": 8,
            "episode2": 0,
            "edition": "",
            "title": "",
            "snapshot": "https://i.animepahe.ru/snapshots/952f573d5cb7e5539565aa8a475598a239c556c2f77c016c1d05a27d377c0609.jpg",
            "disc": "",
            "audio": "jpn",
            "duration": "00:24:10",
            "session": "30e59776c50592deeca4f48ea1039dace8ebfcc554d0df2a8c3b47e534f75476",
            "filler": 0,
            "created_at": "2024-08-21 15:04:48"
        },
        ...
    ]
}
```

## Player Data:
```
URL: https://animepahe.ru/play/dd32c7c0-e215-c911-5081-23ed5037b26c/8efaf69ccb45d7a41a435a39354b1d78aec0990f9e4cb831dfba9c13c63f5ddc
var res=await fetch('https://animepahe.ru/play/dd32c7c0-e215-c911-5081-23ed5037b26c/8efaf69ccb45d7a41a435a39354b1d78aec0990f9e4cb831dfba9c13c63f5ddc',{method:"GET",
        headers:{
          'cookie': '__ddg2_=1234567890'
        }});
await res.text();
```


# ANIMEFLIX

## Important urls:
```
https://api.animeflix.dev/popular?page=0
https://api.animeflix.dev/collections
https://api.animeflix.dev/airing
https://api.animeflix.dev/trending?page=0

https://api.animeflix.dev/watch/sousou-no-frieren-episode-1?server=&c=5f5b5h5f5b5h255a5b25525e55515e515a25515c555f5b50512529
https://api.animeflix.dev/player?id=sousou-no-frieren-1-source&server=gogo&servers=0011&position=undefined

https://api.animeflix.dev/episodes?id=oroka-na-tenshi-wa-akuma-to-odoru&dub=false&c=5b5e5b574h255a4h255g515a5f5455255j4h254h575h594h255g5b255b505b5e5h


/watch/sousou-no-frieren-episode-1?server=&c=5f5b5h5f5b5h255a5b25525e55515e515a25515c555f5b50512529
/watch/shangri-la-frontier-dub-episode-19?server=&c=5f544h5a535e5525584h25525e5b5a5g55515e25505h4i25515c555f5b505125292h

DUB:
/watch/<slug>-dub-episode-<epnum>?server=&c=5f544h5a535e5525584h25525e5b5a5g55515e25505h4i25515c555f5b505125292h
/watch/<slug>-episode-<epnum>?server=&c=5f544h5a535e5525584h25525e5b5a5g55515e25505h4i25515c555f5b505125292h

Search:
https://api.animeflix.dev/info/?query=Game&limit=15&filters={%22type%22:%22[\%22TV\%22]%22,%22genre%22:%22[\%22Comedy\%22,\%22Romance\%22]%22}&k=3b4h59
Filters--> {"type":"["TV"]","genre":"["Comedy","Romance"]"}
```

### Encode & Decode
```
function aflix_decode(x){
    var l=x.length,o=[],i;
    for (i=0;i<l;i+=2){
        o.push(String.fromCharCode(parseInt(x.substring(i,i+2), 20)));
    }
    return o.join('');
}
function aflix_encode(x){
    var l=x.length,o=[],i;
    for (i=0;i<l;i++){
        o.push(x.charCodeAt(i).toString(20));
    }
    return o.join('').toUpperCase();
}
```

## Searching
```
99944	GET	200	https://api.animeflix.dev/info/?query=a&limit=5&k=4h
99947	GET	200	https://api.animeflix.dev/info/?query=b&limit=5&k=4i
99948	GET	200	https://api.animeflix.dev/info/?query=c&limit=5&k=4j
99950	GET	200	https://api.animeflix.dev/info/?query=d&limit=5&k=50
99952	GET	200	https://api.animeflix.dev/info/?query=e&limit=5&k=51
99953	GET	200	https://api.animeflix.dev/info/?query=f&limit=5&k=52
99956	GET	200	https://api.animeflix.dev/info/?query=g&limit=5&k=53
99957	GET	200	https://api.animeflix.dev/info/?query=h&limit=5&k=54
99959	GET	200	https://api.animeflix.dev/info/?query=i&limit=5&k=55
99966	GET	200	https://api.animeflix.dev/info/?query=j&limit=5&k=56
99969	GET	200	https://api.animeflix.dev/info/?query=k&limit=5&k=57
99971	GET	200	https://api.animeflix.dev/info/?query=l&limit=5&k=58
99972	GET	200	https://api.animeflix.dev/info/?query=m&limit=5&k=59
99973	GET	200	https://api.animeflix.dev/info/?query=n&limit=5&k=5a
99976	GET	200	https://api.animeflix.dev/info/?query=o&limit=5&k=5b
99981	GET	200	https://api.animeflix.dev/info/?query=p&limit=5&k=5c
99983	GET	200	https://api.animeflix.dev/info/?query=q&limit=5&k=5d
99984	GET	200	https://api.animeflix.dev/info/?query=r&limit=5&k=5e
99990	GET	200	https://api.animeflix.dev/info/?query=s&limit=5&k=5f
99996	GET	200	https://api.animeflix.dev/info/?query=t&limit=5&k=5g
99998	GET	200	https://api.animeflix.dev/info/?query=u&limit=5&k=5h
100005	GET	200	https://api.animeflix.dev/info/?query=v&limit=5&k=5i
100006	GET	200	https://api.animeflix.dev/info/?query=w&limit=5&k=5j
100010	GET	200	https://api.animeflix.dev/info/?query=x&limit=5&k=60
100017	GET	200	https://api.animeflix.dev/info/?query=y&limit=5&k=61
100020	GET	200	https://api.animeflix.dev/info/?query=z&limit=5&k=62
```

```
GET k parameter:
"z".charCodeAt(0).toString(20)
```

### AniList Integration
```
https://api.animeflix.dev/idtoinfo?ids=[163076,151807,164244,155963,20447,21507,132405,162780,146066,162144,143866,168374,152072,156131,162002,153518,158028,21,151970,166610,166216,151801,137908,150672,169935,147642,152682,130003,166522,1210,105333,20954,99578,133965,18897,120697,523,21049,171019,141821,142329,5114]
&y=5550555a525b


https://api.animeflix.dev/idtoinfo?ids=[21,137908,143866,153518,155963,162144,163076,166531,166610,168374]&y=5550555a525b
https://api.animeflix.dev/idtoinfo?ids=[393582593]&y=5550555a525b


# Get Mal List
https://api.animeflix.dev/maluser?username=amarullz

55 i
50 d
55 i
5a n
52 f
5b o

AniSkip:
https://api.aniskip.com/v2/skip-times/52701/5?types[]=op&types[]=ed&episodeLength=

https://api.aniskip.com/v2/skip-times/<MAL-ID>/<EP-NUM>?types[]=op&types[]=ed&episodeLength=
```

### M3U8
```
https://stockholm.gogocden.site/https://v2.gogocden.site/sasaki-to-pi-chan-10/master.m3u8

curl 'https://v2.gogocden.site/sasaki-to-pi-chan-10/master.m3u8?k=UTPw89rbPKdl_5LsF-g9KA&expires=1709972813478' \
  -H 'authority: v2.gogocden.site' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9,id;q=0.8' \
  -H 'cache-control: no-cache' \
  -H 'dnt: 1' \
  -H 'origin: https://api.animeflix.dev' \
  -H 'pragma: no-cache' \
  -H 'referer: https://api.animeflix.dev/' \
  -H 'sec-ch-ua: "Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'

Important Header:
'origin: https://api.animeflix.dev'
```

*Test from XMLRequest:*
```
https://v2.gogocden.site/sasaki-to-pi-chan-10/1080p.m3u8?k=UTPw89rbPKdl_5LsF-g9KA&expires=1709972813478

$a('/__proxy/https://v2.gogocden.site/sasaki-to-pi-chan-10/1080p.m3u8',function(r){ console.log(r); });
```

---------------------------------------------------------------------------------------

# KICKASSANIME
ANIME INFO:

`https://www1.kickassanime.mx/api/show/my-instant-death-ability-is-so-overpowered-no-one-in-this-other-world-stands-a-chance-against-me-7cdb`


`https://www1.kickassanime.mx/api/show/my-instant-death-ability-is-so-overpowered-no-one-in-this-other-world-stands-a-chance-against-me-7cdb/episodes?ep=10&lang=ja-JP`

`https://www1.kickassanime.mx/api/show/the-weakest-tamer-began-a-journey-to-pick-up-trash-ce7c/ep-9-254017`


`https://www1.kickassanime.mx/api/show/the-weakest-tamer-began-a-journey-to-pick-up-trash-ce7c/episodes?lang=en-US`

```
https://www1.kickassanime.mx/api/show/the-weakest-tamer-began-a-journey-to-pick-up-trash-ce7c/episode/ep-9-254017
                                                                                                      ep-9-slug
```


---------------------------------------------------------------------------------------
# HI-ANIME:

## LIST EPISODE
- FORMAT: `https://hianime.to/ajax/v2/episode/list/<anime-id>`
- EXAMPLE: `https://hianime.to/ajax/v2/episode/list/18832`
  - `data-id="114820" <-- episode-id`
  - `h.querySelectorAll('div.ss-list a[data-id]');`
- Result
```
<div class="ss-list">
    <a title="The Foolish Angel and the Demon" class="ssl-item  ep-item" data-number="1" data-id="114820" href="/watch/the-foolish-angel-dances-with-the-devil-18832?ep=114820">
        <div class="ssli-order">1</div>
        <div class="ssli-detail">
            <div class="ep-name e-dynamic-name" data-jname="The Foolish Angel and the Demon" title="The Foolish Angel and the Demon">The Foolish Angel and the Demon</div>
        </div>
        <div class="ssli-btn">
            <div class="btn btn-circle"><i class="fas fa-play"></i></div>
        </div>
        <div class="clearfix"></div>
    </a>
    <a title="The Even More Foolish Angel and Demon" class="ssl-item  ep-item" data-number="2" data-id="115363" href="/watch/the-foolish-angel-dances-with-the-devil-18832?ep=115363">
        <div class="ssli-order">2</div>
        <div class="ssli-detail">
            <div class="ep-name e-dynamic-name" data-jname="The Even More Foolish Angel and Demon" title="The Even More Foolish Angel and Demon">The Even More Foolish Angel and Demon</div>
        </div>
        <div class="ssli-btn">
            <div class="btn btn-circle"><i class="fas fa-play"></i></div>
        </div>
        <div class="clearfix"></div>
    </a>
    ...
</div>
```

## LIST SERVER
- FORMAT: `https://hianime.to/ajax/v2/episode/servers?episodeId=<episode-id>`
- EXAMPLE: `https://hianime.to/ajax/v2/episode/servers?episodeId=115363`
```
  data-id="1083301" <-- server-id
  var sub=h.querySelector('div.servers-sub');
  var dub=h.querySelector('div.servers-dub');

  var servers=h.querySelectorAll('div[data-type][data-id][data-server-id]');
```
- Data
  - data-type : sub/dub
  - data-id : server-id
  - data-server-id : just mirror id
- Fetch example:
  - `https://hianime.to/ajax/v2/episode/sources?id=<server-id>`
  - `https://hianime.to/ajax/v2/episode/sources?id=1083301`
  - `https://hianime.to/ajax/v2/episode/sources?id=1083295`
- Result:
```
<div class="ps_-block ps_-block-sub servers-sub">
  <div class="ps__-title"><i class="fas fa-closed-captioning mr-2"></i>SUB:</div>
  <div class="ps__-list">
    <div class="item server-item" data-type="sub" data-id="1083301" data-server-id="4">
        <a href="javascript:;" class="btn">HD-1</a>
    </div>
    <div class="item server-item" data-type="sub" data-id="1083295" data-server-id="1">
        <a href="javascript:;" class="btn">HD-2</a>
    </div>
  </div>
</div>

<div class="ps_-block ps_-block-sub servers-dub">
  <div class="ps__-title"><i class="fas fa-microphone-alt mr-2"></i>DUB:</div>
    <div class="ps__-list">
      <div class="item server-item" data-type="dub" data-id="1092859" data-server-id="4">
          <a href="javascript:;" class="btn">HD-1</a>
      </div>
      <div class="item server-item" data-type="dub" data-id="1092814" data-server-id="1">
          <a href="javascript:;" class="btn">HD-2</a>
      </div>
    </div>
</div>
```

## SERVER URL
- FORMAT: `https://hianime.to/ajax/v2/episode/sources?id=<server-id>`
- EXAMPLE: `https://hianime.to/ajax/v2/episode/sources?id=1083301`
- Parsing URL:
  - `https://megacloud.tv/embed-2/e-1/<stream-id>?k=1`
  - `https://megacloud.tv/embed-2/e-1/2I5tr56M4UQJ?k=1`
- Result
```
{
    "type": "iframe",
    "link": "https://megacloud.tv/embed-2/e-1/2I5tr56M4UQJ?k=1",
    "server": 1,
    "sources": [],
    "tracks": [],
    "htmlGuide": ""
}
```

## SUB & STREAM
- FORMAT : `https://megacloud.tv/embed-2/ajax/e-1/getSources?id=<stream-id>`
- EXAMPLE : `https://megacloud.tv/embed-2/ajax/e-1/getSources?id=flxWZ4Pey1Za`
- Result
```
{
    "sources": "U2FsdGVkX1/LWTUrqzpD2nRewGQFLZ3acFkKYMXKFeL6rn3KMEx1ya7O1OYiC7QIPgmRNEKZONoQbY0jIi5X81ZPOJslLmgM/hlTlraTIKkNLrD/h2jwhfN/DNZrhg7D0oQDy7gJhOC0UUr1UvyzIVa4buDQ+909mSl2S6r6+9vCNT8n58lAx0bHl0aC7EDfiKrruA0UbDZ28CwtBHO377pEZUmcqowsznS2bwNLdWgFqsibIp4wvqFlsrK8GnOYgpSR6XbKjkQIXVdbDmVgsTM+Mn2RsJ7mNrq784v46oX4WJmpGG67JHKS2HvEriHD8aLQyVE+/uEH/oVa5b7Rj5PBgvifhQPM+Q3gKBDgFS5UTq/IcrYoewMUcY3ztdKOZ5fD4G/NwvdhZkP0SXY+HdIq1AwPC/1Yo85fRq5TwnX2RCXLkKM7QHRslOmoSGEd+vP5w6ueR7fqp/P0UtPG4mP8RDXSfdwMn+R/kPv5g==",
    "tracks": [
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/ara-6.vtt",
            "label": "Arabic",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/eng-2.vtt",
            "label": "English",
            "kind": "captions",
            "default": true
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/fre-7.vtt",
            "label": "French",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/ger-8.vtt",
            "label": "German",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/ita-9.vtt",
            "label": "Italian",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/por-3.vtt",
            "label": "Portuguese - Portuguese(Brazil)",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/rus-10.vtt",
            "label": "Russian",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/spa-5.vtt",
            "label": "Spanish",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/subtitle/572926c84ad23c45b649d61f2c57c95a/spa-4.vtt",
            "label": "Spanish - Spanish(Latin_America)",
            "kind": "captions"
        },
        {
            "file": "https://s.megastatics.com/thumbnails/0dd95c5e825bd1d935a6fbdc1e177e71/thumbnails.vtt",
            "kind": "thumbnails"
        }
    ],
    "encrypted": true,
    "intro": {
        "start": 33,
        "end": 122
    },
    "outro": {
        "start": 1330,
        "end": 1420
    },
    "server": 4
}
```

## M3U8
- Load inside iframe: `https://megacloud.tv/embed-2/e-1/2I5tr56M4UQJ?k=1&autoplay=1`
- Fetch until got `/master.m3u8`
