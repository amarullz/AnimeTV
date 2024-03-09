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

# ANIMEFLIX

## Important urls:
```
https://api.animeflix.dev/popular?page=0
https://api.animeflix.dev/collections
https://api.animeflix.dev/airing
https://api.animeflix.dev/trending?page=0

https://api.animeflix.dev/watch/sousou-no-frieren-episode-1?server=&c=5f5b5h5f5b5h255a5b25525e55515e515a25515c555f5b50512529
https://api.animeflix.dev/player?id=sousou-no-frieren-1-source&server=gogo&servers=0011&position=undefined
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
