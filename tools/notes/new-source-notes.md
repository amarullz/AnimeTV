# Universal Skip Time

```
FORMAT:
https://api.aniskip.com/v2/skip-times/<--MAL-ID-->/<--EPISODE-->?episodeLength=0&types%5B%5D=ed&types%5B%5D=mixed-ed&types%5B%5D=mixed-op&types%5B%5D=op&types%5B%5D=recap

EXAMPLE:
https://api.aniskip.com/v2/skip-times/54744/3?episodeLength=0&types%5B%5D=ed&types%5B%5D=mixed-ed&types%5B%5D=mixed-op&types%5B%5D=op&types%5B%5D=recap
```

# AnimeKai
```js
/* nonstrict */
function safeBtoa(s){ /* safeBtoa */
  return btoa(s).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
}
function safeAtob(s){
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'))
}
function rc4(key,str){
    var s = [], j = 0, x, res = '';
    for (var i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (i = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
}
function reverseString(s) {
    return s.split('').reverse().join('');
}
function replaceChars(s,f,r){
    let i = f.length;
    let m = {};
    while (i-- && (m[f[i]] = r[i])){}
    return s.split("").map(v=>m[v]||v).join('');
}
function vrfStrict(n){
  n = safeBtoa(
    replaceChars(
        safeBtoa(
            rc4(
                'sXmH96C4vhRrgi8', 
                reverseString(
                    reverseString(
                        safeBtoa(
                            rc4('kOCJnByYmfI', replaceChars(
                                    replaceChars(
                                        reverseString(
                                            safeBtoa(
                                                rc4('0DU8ksIVlFcia2', n)
                                            )
                                        ),
                                        '1wctXeHqb2', '1tecHq2Xbw'
                                    ),
                                    '48KbrZx1ml', 'Km8Zb4lxr1'
                                )
                            )
                        )
                    )
                )
            )
        ), 'hTn79AMjduR5', 'djn5uT7AMR9h')
    );
  return encodeURIComponent(n);
}
function vrfNoStrict(n){
    return safeBtoa(rc4(
        'n1PEbDBiipbJZvZc',
        encodeURIComponent(n)
    ));
}

function vrfDecode(n){
    n = rc4(
        '0DU8ksIVlFcia2', 
        safeAtob(
            reverseString(
                replaceChars(
                    replaceChars(
                        rc4('kOCJnByYmfI', 
                            safeAtob(
                                reverseString(
                                    reverseString(
                                        rc4(
                                            'sXmH96C4vhRrgi8',
                                            safeAtob(
                                                replaceChars(
                                                    safeAtob(n),
                                                    'djn5uT7AMR9h',
                                                    'hTn79AMjduR5'
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ), 'Km8Zb4lxr1', '48KbrZx1ml'
                    ),
                    '1tecHq2Xbw', '1wctXeHqb2'
                )
            )
        )
    )
    return decodeURIComponent(n);
}

function vrfDecodeNoStrict(n){
    return decodeURIComponent(
        rc4(
            'n1PEbDBiipbJZvZc', 
            safeAtob(n)
        )
    );
}

function vrfMegaDecode(n) {
    n = reverseString(
        replaceChars(
            rc4(
                '5ygxI8hjLiuDQ0',
                safeAtob(
                    rc4('z9cWnXuoDtx', safeAtob(
                        replaceChars(
                            reverseString(
                                replaceChars(
                                    rc4(
                                        'EZnfG1IL6DF',
                                        safeAtob(
                                            reverseString(
                                                safeAtob(n)
                                            )
                                        )
                                    ),
                                    'M2DCEbQmWOe', 'bEDCeOQ2mWM')
                                ), 
                                'Lw7nfcTNz3FbWy', 'TFf37zywcNWnLb'
                            )
                        )
                    )
                )
            ), 'HK0TOgYzU1C', 'T1CHYU0OKgz'
        )
    );
    return decodeURIComponent(n);
}


/*********************** TEST UNIT ***********************/
vrfMegaDecode("SFJ0N2hwT3d6V2ZFa21EM0szZ0ZnN2REOVNyaVAyTzhkNGZvZGJDYlJQeVdOVHdPTklRMThNaXhvY0w0NTZ3VWV3dUxETXN1cjYwQl85YWtrUXV5NEpHWUVBa2JlU3Z3ZFV1TUUzaGVyNnl1MV92WGxZZjdKWkh3VFFBR1BIcDl3VVR3b0h4QkxZdlFQRDgyNEdXM2lXSkFSY2tPQ0owd2lfZld3cWdqdkpRT01Bcm1vdmN0d29ibGxsMXpHajNnUHBJV0c4ZGJoNExkcDRZUHV2d1pmcXRjUkZXSUloUUphQnNxN2tKSEsxLWFTZHVKYjdreGpCeTExY0NFMTRULWN5QmtWMEI3UlB6cmppVmdPQi1EXzBCNHBUT2FUUWFUaXI2REE3QWdRZGtuWXhhcFZxclVHdW92ZXNCNjM1ZTcxZVZWQW1SRThlUk1XYTNlN0U3QWpUNHYzXzNYQU5xNHVvU1RLS19Ma1dGOFNFVnI1bmV1RTdYOHBoeXJJcWJNbThkX2wwSFUwVlJVa0wxU3dJYmc1Z1lPMzlzcHVOUmpBaFNHcmJOQUFsQllpSkN2czRrc3VnaG5UaVI2TzRKM1ZDTkxLX1ZWclNvU3BvOVBMdVltc3NrUlhPOHkwbG0yYWRVR2I3RzBzQ2VuVWNBbktsRkJRTW41MC1lU2hMQTdHcFRhWUMyZkVtRDNZdG43ZUs3M1FfcU9hVmU5VUc1d2VDajZabU9TcG1iV3hUV0hWVm5iQlFzLWd3UzRYRnVEaGZhWG9YUmdTSWctMGdsR1F0bmdPbl9XRmFNaS1wS25VelhETF9weGJfQXV6bUlqVFBNaDk3bTYtS2M5NkZOQUM4bDBsdWJfVUltRXpYZ1FYZklabFJYd1ItbEplejJvTFNsWXVuSTNzaXJBdTJaMl9LTW43NEJZN2NjNFB1UDN0bUpGRGM4ZGdkVkJHbTlOQ3Y1aHFTdUE4YU1CU2tCQlpGaUlhOEdnM2U3VmExWS1VS0dXQW4xUVVHVkxURDVMd1diMU0xR1VUcU5lTUk5NGFob2M0WWNrdzVJT2ZsNXVzdDNiS1JaSnZZd29kek9IM0ZmejBrUzhqTndVd0gyZkhHbjZuSVR4Yy1OckxXTTNCejZ5bDFuSklhcWR0SjhCbUxEOG5lb0RwYUF3NTN3U3FmbHZ4RVk0eDN5cHNlSnUtQUJBd0lReTZXSnlxc1BpWHhLUVQ4Unl0aE9qU2VzeHNwQ3B6dmtJU2FCWXNBS0w2MG1EeWxDZWhwRFlVX2M5S1B4RkYtMEZ6bzZqNHNvcVpsMnNQS3hEd2VrYThxaEpTNHdLWmp1b1h4Y1pKeTQtNnNYX211WVlOcmQzaDQ2Z05FMUJRdmJRdWtoYjNTUkJBZjQyelhWLVBnNlBlVjh1RVgwSkhKNjRhZ3pqc25LQzMzTWk0U3A1cEllTXJmNHRQOGVKaGFMQXdjT3duYVV0am5PYm1zTnFpRmJGNUY2X3pSNTREUkxIOHVkUWpFUTRVczFpNUt6T1dKblI4aTAxaWI2NU0xdnRPNnNVY3piSU5SMlNmSWFsVkpMRGNEUGJ5eDliUG9JWElwZ0RzeGI5RzJKNVNJZGNiUVR4U2RPckdJZ1gydHhzQkg4TG43N2t2RndUTnZkUDY4amxpYnJMT0ZXQ25lNGdxdXZnRndmaFFkLUI0Ul80Ykhncm9OdTZMdmJJQXAwN21mVENlaXhWbUxNLWRFTVVkb21uNENWS3VaZGJtdGhOY0FaSXBMaGtQbGhVRC1Idm5mbzI5OUtlUHJJTGxiTEpqdWpqLUZXdWhsazlDNmFvX0ktelpjNjFiVExUZTVHejc1RGJUTkRwU2NQcXRkalduS1VTMGNTUnp0Yzl6XzBISmdJenpTNXZiMUlHeHVwUXdJVkZyQU9hMFptMGNNemZMUXk5cTBtOHRQN1ozVGxzdHR5RHJOTWZrbm5ENXdSOGc3aFhORUtDUm03Q2ZyRXFzSWQ2SmxTLTNGYXR6d3pSNk93dGVWd2RvaDdGU1Y5OXR1YTJPdVBDOXN3TEp1TmZKM1l0R2Zmb280dHdLSzF1Tm0wTVdRcUVTN1ZIU1F6TDRONjhDNUpwcnY2SVBZVUdCN0JzTElsNEVtaTRwYzc5SGEzelRoTGVsdmNqQnM4UVNITnRnMTF5STRCQW1tVzhXc0NpRUdjZE04N2NiRXExbTZMdGNWRjhXbE41WUZ2V3k0MFVOTGNIc3NJdWxLQUNzTHFLeVVEUENZUENrVUd5eDNQalBWQWVHQzVmQmU0VENYeWV5Mm5EQWktUmtDbTVPS3F2R21MdHF0S2ZXQzB1ZjNfSHRrZjYwdlA3c0V3RlBEdnpCSHU2aVo2NWlXSEpVZEgtUy1hYW5pZi1ycWNzblp2Q0FFdUc2NVE3WWQ4NHlGQjExdzlJdTBuZlRIQ3VJdEJ0TkxRTUVNeklXdW1wTlV4VVBuUDhmbjVyWHNfektidXhQLTcwVEJva0hGZVgxckxneFVnbXJuRzQzbXV2NzN6VXN5SURkSy0yeS1mYTZZRXE1ckFDNmo4WWdZak1LdEdkZlJBNEFFd2tzSTJ6aXh0cmp6bWhiWWZWbURKc1ZfT1ZhMTZfakltZUd1MkZaYlFNNURfd0J3MkUzWE91QnVBQ1NYSDZHeW1VTUpHenNHcERyZ3NYQWkzb1J3ejVXZG0ySTRPWGJhLVNZSE9S");

RESULT = '{"sources":[{"file":"https:\\/\\/54d8e.infinity-loop-21.biz\\/c3\\/h1e00e76d6043835b9cc206f446a7563984a4cd132f93c00355ffcaf60d90855259cd8d70c2d9014636b170eed451dae77dd9dab5507b1dea249d16e5cf68f083249697715c0768604e8a2a1eddff5b7dde5ae8e6fc461b835f82d0714e69ba96ebc177ebd6a7d7e2c236a0970429\\/list,5b49a52e32138f5289c309be43a64868d1bfd0166088c3.m3u8"}],"tracks":[{"file":"https:\\/\\/54d8e.megaup.cc\\/v3\\/h1e00e76d6043835b9cc206f446a7563984a4cd132f93c00355ffcaf60d90855259cd8d70c2d9014636b170eed451dae87ad8d8bb527f1dea249d16e5cf68f0842b9bc86743047b234e83231397a71934950ebababc02598a0f918c2b4c38b1d1f2dd3de6ccb889ac93\\/thumbnails.vtt","kind":"thumbnails"}],"download":"https:\\/\\/megaup.cc\\/download\\/2MjhfTmrWSyJcOLxELpI5hDhDQ"}';

//----------------------------
vrfDecode("amhVMUVlS3g4clFuQ0owd2xWei1ZcjVWc1V1NXpseVFrNTd6VEhtZHpXSGotNHQ1SjI3UFlta012V0xtWmhHcTBxTjdOQ0dIMVpXb2FiNnllQ1I3Ty11c242bFFjTElpMkNOOWs4VWpSUXdtWFl5MXJLbWhrU1hDX1FibDVDd2pnQ3pHd2VKcGh2STBWNjRVVFA2TjBKVTRoTnpleWQ3cjBQSHM1MTVFZVR5RktCVG1jT2FaUGx1WUx2bGdUM3pDX2FFMTFveEx4Mk9PN2FjZ0tKNTlTazBzTXc1YnpEdHVXWjBxN250VnpZdHlIT2hXYUdJbEx2WEFsemVZblNtODNBbHF4WHhybkt1V0lmUHBtWl9KVWtHb1dZNTRObEtNUEZBRl9leVFhSnZEUXhnSWlnbnU4ZzA5VFFGdEZvMjQ4NF8yaGZZcFI4UERuSzhzTTQzdVpfeHJwOXlwWlRiUE9KQXUwT1RtM2Y1MGFpTkV2U3ZRTWhnTDc5cDc1cUpWZFZLQnN2VU12dWhoLXc");

RESULT='{"url":"https:\\/\\/megaup.cc\\/e\\/m43ve2T0WS2JcOLxELpI7hHpCQ","skip":{"intro":[0,0],"outro":[0,0]}}';


//----------------------------
vrfDecodeNoStrict('ZZQdeGGgpgtJaU1ZTbbuRdZIKVnndk63ViNBxyXGiUh6YtUMeHBh0zqyIUdczFyYjCPPu2cSmkFjdREmZMMcAgiBgX3J');

RESULT = '{"id":0,"settings":[],"folders":[]}';


//----------------------------
vrfStrict('c4C486M');

RESULT = 'OUlUN0RQMmRfcE5fSTRVVUFWWQ';


rc4('0DU8ksIVlFcia2','c4C486M');




```

# Github repo search
```
https://api.github.com/search/repositories?q=Anime+topic%3Aandroidtv+license:apache-2.0&sort=stars&order=desc

{
    "total_count": 1,
    "incomplete_results": false,
    "items": [
        {
            "id": 646964160,
            "node_id": "R_kgDOJo_jwA",
            "name": "AnimeTV",
            "full_name": "amarullz/AnimeTV",
            "private": false,
            "owner": {
                "login": "amarullz",
                "id": 1386831,
                "node_id": "MDQ6VXNlcjEzODY4MzE=",
                "avatar_url": "https://avatars.githubusercontent.com/u/1386831?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/amarullz",
                "html_url": "https://github.com/amarullz",
                "followers_url": "https://api.github.com/users/amarullz/followers",
                "following_url": "https://api.github.com/users/amarullz/following{/other_user}",
                "gists_url": "https://api.github.com/users/amarullz/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/amarullz/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/amarullz/subscriptions",
                "organizations_url": "https://api.github.com/users/amarullz/orgs",
                "repos_url": "https://api.github.com/users/amarullz/repos",
                "events_url": "https://api.github.com/users/amarullz/events{/privacy}",
                "received_events_url": "https://api.github.com/users/amarullz/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false
            },
            "html_url": "https://github.com/amarullz/AnimeTV",
            "description": "Watch Anime in Your AndroidTV",
            "fork": false,
            "url": "https://api.github.com/repos/amarullz/AnimeTV",
            "forks_url": "https://api.github.com/repos/amarullz/AnimeTV/forks",
            "keys_url": "https://api.github.com/repos/amarullz/AnimeTV/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/amarullz/AnimeTV/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/amarullz/AnimeTV/teams",
            "hooks_url": "https://api.github.com/repos/amarullz/AnimeTV/hooks",
            "issue_events_url": "https://api.github.com/repos/amarullz/AnimeTV/issues/events{/number}",
            "events_url": "https://api.github.com/repos/amarullz/AnimeTV/events",
            "assignees_url": "https://api.github.com/repos/amarullz/AnimeTV/assignees{/user}",
            "branches_url": "https://api.github.com/repos/amarullz/AnimeTV/branches{/branch}",
            "tags_url": "https://api.github.com/repos/amarullz/AnimeTV/tags",
            "blobs_url": "https://api.github.com/repos/amarullz/AnimeTV/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/amarullz/AnimeTV/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/amarullz/AnimeTV/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/amarullz/AnimeTV/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/amarullz/AnimeTV/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/amarullz/AnimeTV/languages",
            "stargazers_url": "https://api.github.com/repos/amarullz/AnimeTV/stargazers",
            "contributors_url": "https://api.github.com/repos/amarullz/AnimeTV/contributors",
            "subscribers_url": "https://api.github.com/repos/amarullz/AnimeTV/subscribers",
            "subscription_url": "https://api.github.com/repos/amarullz/AnimeTV/subscription",
            "commits_url": "https://api.github.com/repos/amarullz/AnimeTV/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/amarullz/AnimeTV/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/amarullz/AnimeTV/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/amarullz/AnimeTV/issues/comments{/number}",
            "contents_url": "https://api.github.com/repos/amarullz/AnimeTV/contents/{+path}",
            "compare_url": "https://api.github.com/repos/amarullz/AnimeTV/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/amarullz/AnimeTV/merges",
            "archive_url": "https://api.github.com/repos/amarullz/AnimeTV/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/amarullz/AnimeTV/downloads",
            "issues_url": "https://api.github.com/repos/amarullz/AnimeTV/issues{/number}",
            "pulls_url": "https://api.github.com/repos/amarullz/AnimeTV/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/amarullz/AnimeTV/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/amarullz/AnimeTV/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/amarullz/AnimeTV/labels{/name}",
            "releases_url": "https://api.github.com/repos/amarullz/AnimeTV/releases{/id}",
            "deployments_url": "https://api.github.com/repos/amarullz/AnimeTV/deployments",
            "created_at": "2023-05-29T18:47:39Z",
            "updated_at": "2025-01-08T17:24:43Z",
            "pushed_at": "2025-01-08T17:24:39Z",
            "git_url": "git://github.com/amarullz/AnimeTV.git",
            "ssh_url": "git@github.com:amarullz/AnimeTV.git",
            "clone_url": "https://github.com/amarullz/AnimeTV.git",
            "svn_url": "https://github.com/amarullz/AnimeTV",
            "homepage": "https://amarullz.com/",
            "size": 46607,
            "stargazers_count": 805,
            "watchers_count": 805,
            "language": "JavaScript",
            "has_issues": true,
            "has_projects": true,
            "has_downloads": true,
            "has_wiki": true,
            "has_pages": false,
            "has_discussions": true,
            "forks_count": 52,
            "mirror_url": null,
            "archived": false,
            "disabled": false,
            "open_issues_count": 8,
            "license": {
                "key": "apache-2.0",
                "name": "Apache License 2.0",
                "spdx_id": "Apache-2.0",
                "url": "https://api.github.com/licenses/apache-2.0",
                "node_id": "MDc6TGljZW5zZTI="
            },
            "allow_forking": true,
            "is_template": false,
            "web_commit_signoff_required": false,
            "topics": [
                "android",
                "androidtv",
                "anime",
                "entertainment",
                "video"
            ],
            "visibility": "public",
            "forks": 52,
            "open_issues": 8,
            "watchers": 805,
            "default_branch": "master",
            "score": 1
        }
    ]
}
```

# anime.uniquestream.net

```

# Recent
https://anime.uniquestream.net/api/v1/videos/new?slider=1

[
    {
        "content_id": "0X5B6fPV",
        "title": "Tower of God",
        "image": "https://anime.uniquestream.net/public/images/posters/480x720/472656b0aa3c869827826cb130e0785a.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/posters/480x720/missing.jpg",
        "type": "show"
    },
    {
        "content_id": "hy0Edxtk",
        "title": "I'll Become a Villainess Who Goes Down in History",
        "image": "https://anime.uniquestream.net/public/images/posters/480x720/79990d0395ee1d681ca0981acf3eda7e.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/posters/480x720/missing.jpg",
        "type": "show"
    },
]

# Video Detail
https://anime.uniquestream.net/api/v1/series/hy0Edxtk
{
    "content_id": "hy0Edxtk",
    "title": "I'll Become a Villainess Who Goes Down in History",
    "description": "This young girl hates all those goodie-two-shoes heroines. So when she’s reincarnated as Alicia, the villain in her favorite fantasy dating sim, it’s like a dream come true! There’s just one problem: the more she tries to be evil, the more the prince seems to fall for her. Alicia will have to work much harder if she ever wants to become the world’s greatest villainess.",
    "images": [
        {
            "url": "https://anime.uniquestream.net/public/images/posters/480x720/79990d0395ee1d681ca0981acf3eda7e.jpg",
            "type": "poster_tall"
        },
        {
            "url": "https://anime.uniquestream.net/public/images/posters/1200x675/79990d0395ee1d681ca0981acf3eda7e.jpg",
            "type": "poster_wide"
        }
    ],
    "seasons": [
        {
            "content_id": "ntFzgVsu",
            "title": "I'll Become a Villainess Who Goes Down in History",
            "season_number": 1,
            "season_seq_number": 0,
            "display_number": "",
            "episode_count": 12
        }
    ],
    "episode": {
        "content_id": "EAXpSgfB",
        "title": "The Villainess and Working Out",
        "image": "https://anime.uniquestream.net/public/images/episodes/320x180/25bb3671b623f0bbe34e4e84c94f9f28.jpg",
        "image_loading": null,
        "type": "show",
        "series_title": null,
        "season_number": null,
        "season_display": "",
        "episode_number": 1.0,
        "duration_ms": 1420046,
        "episode": "1",
        "is_clip": false
    }
}

# Episodes (Season-1: ntFzgVsu)
https://anime.uniquestream.net/api/v1/season/ntFzgVsu/episodes?page=1&limit=5&order_by=asc
[
    {
        "title": "The Villainess and Working Out",
        "episode": "1",
        "is_clip": false,
        "content_id": "EAXpSgfB",
        "episode_number": 1.0,
        "duration_ms": 1420046,
        "image": "https://anime.uniquestream.net/public/images/episodes/320x180/25bb3671b623f0bbe34e4e84c94f9f28.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/episodes/320x180/missing.jpg"
    },
    {
        "title": "The Villainess and a Kiss",
        "episode": "2",
        "is_clip": false,
        "content_id": "BL5RTf00",
        "episode_number": 2.0,
        "duration_ms": 1420087,
        "image": "https://anime.uniquestream.net/public/images/episodes/320x180/826a7c74f1f8aa78d8d754103ea8922b.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/episodes/320x180/missing.jpg"
    }
]


# Get Stream (Ep-2: BL5RTf00)
https://anime.uniquestream.net/api/v1/content/BL5RTf00
{
    "content_id": "BL5RTf00",
    "episode": "2",
    "description": "Believing that actual experience is just as crucial as book smarts if she wants to be the greatest villainess ever, Alicia heads to the village of Loana, which is isolated by a magic barrier. There, she has an encounter that changes her life...",
    "episode_number": 2.0,
    "title": "The Villainess and a Kiss",
    "is_clip": false,
    "duration_ms": 1420087,
    "content_type": "episode",
    "series_id": "hy0Edxtk",
    "series_title": "I'll Become a Villainess Who Goes Down in History",
    "season_title": "I'll Become a Villainess Who Goes Down in History",
    "image": "https://anime.uniquestream.net/public/images/episodes/1200x675/826a7c74f1f8aa78d8d754103ea8922b.jpg",
    "image_loading": "https://anime.uniquestream.net/public/images/episodes/1200x675/missing.jpg",
    "prev": {
        "title": "The Villainess and Working Out",
        "episode_number": 1.0,
        "content_id": "EAXpSgfB",
        "duration_ms": 1420046,
        "episode": "1",
        "image": "https://anime.uniquestream.net/public/images/episodes/320x180/25bb3671b623f0bbe34e4e84c94f9f28.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/episodes/320x180/missing.jpg"
    },
    "next": {
        "title": "The Villainess and Trespassing",
        "episode_number": 3.0,
        "content_id": "tfNynk5O",
        "duration_ms": 1420004,
        "episode": "3",
        "image": "https://anime.uniquestream.net/public/images/episodes/320x180/40d1a5fcf7469b6c41f2ae7dccac18b7.jpg",
        "image_loading": "https://anime.uniquestream.net/public/images/episodes/320x180/missing.jpg"
    }
}

# Get Media
https://anime.uniquestream.net/api/v1/episode/BL5RTf00/media/dash/ja-JP

https://anime.uniquestream.net/api/v1/episode/EAXpSgfB/media/dash/ja-JP

# Get License
curl 'https://anime.uniquestream.net/api/v1/lic/widevine' \
  -H 'x-am-media-id: f5597ed24676e587f49af7884eef6aaf' \
  --data-raw $'\u0008\u0004'

{
  "status": "OK",
  "license": "CAUSwQUKuwIIAxIQoNzRYDAsBBPVIHaiDIEkTBi/hPHuBSKOAjCCAQoCggEBALxdz8ZNHBkO2WcFOGrxXfzYPWgkAzQX9iAJC00MvPu9NYn5CyQ0aLkN3arM7izjwKfHkEu8vgfTEJFLDYR3p6QdJ2tFTDKhg4T4z+3WghtxzCVNDuj4GlXVfpMHt/EXLHWOwG1GwFamFTrnDXbXOqZKLDNnMnjGxdVAImlCc0jrWDMc7jZdk4y7HK0ybQXqm40dNOqHJjdnb3Riq9IN04H5RjlAm5cmCOG85QP36houW9P6/CZXb80lbEqocEp0v0mq86c2JBQXSEMjtZ/xZvrdFhJcoTbsrLfWEqDHXC6rtNNaQD6QeclNStMR9DF89Hh0lOq4T4gMsCLnJ5VXHNsCAwEAAToMY2FzdGxhYnMuY29tQAESgAMyYZeleD/SrFS7CiSmypUgdmsl+7rZqv4EXxRVQp0rmhhCiJNl307MreSvb2SoYaTeVKAzT+nj32n8VQvygcfOCwnsdqN2zLOfRWzf5XKwCBokCRdn6T43oprRYGJmUK1y6dUkOIdBvPWwX0a9x49RSLZ8z+HuHKyQblksDIkzNO+CdXcPz8jljqYIUE9v/79GL71sS+q48XcV/2KnfIQe72ZxB4RgJ4Z73NH/bt4jkwBNff2Bi0Keft0NdXGjj+sJgrQDhV6YLcdFqLZfelIZywpjv7rB7uHgjJyOq24a1iDwBtqKCi9yhREBlyvV38bSulESMt1UsbQaOqTrcbHrzxbmCHdMp6awrdHWNXR05+Pd7q5X+ROmw1Ev0qwPS/vKwFBV1RcRsmi1wXPvW0jmpzePCvoaNgg8DdXO6wPXs83oAZCeIzDElXXbP8SCdSilwUHXeizJ2kPYBoOyBajlFYlw1/5/MKC1RDH/QC737FWbktAF2/wlrh/aiIc3d3A=",
  "service_version_info": {
    "license_sdk_version": "19.0.2",
    "license_service_version": "DRMtoday"
  }
}



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
