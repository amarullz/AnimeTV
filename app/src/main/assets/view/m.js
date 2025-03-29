/* Body */
const body=document.body;
/* const _DNS="9anime.to"; */
const __DNS=('_JSAPI' in window)?_JSAPI.dns():"animekai.to";
const __SD=('_JSAPI' in window)?_JSAPI.getSd():1;

/* Change Removed Sources */
if (__SD==2){
  _JSAPI.setSd(1);
  _JSAPI.reloadHome();
}
if (__SD==4){
  _JSAPI.setSd(3);
  _JSAPI.reloadHome();
}

/* Source Constants */
const __SDKAI=(__SD==1);
const __SD3=((__SD==3) || (__SD==4))?true:false;
const __SD5=(__SD==5);
const __SD6=(__SD==6);
const __SD7=(__SD==7);
const __SD8=(__SD==8);

/* is touch screen */
var _USE_TOUCH=true;
var _TOUCH=false;
var _ISELECTRON=('isElectron' in _JSAPI);

const __SOURCE_NAME=[
  'AnimeKAI', 'Anix', 'Hianime', 'Aniwatch', 'Animeflix', 'KickAss', 'Gojo', 'Miruro'
];

const __SOURCE_DOMAINS=[
  ['animekai.to' ,'animekai.bz'],
  ['anix.to','anix.ac','anix.vc','anixtv.to'], // rip
  ['hianime.to','hianime.sx','hianime.nz', 'aniwatchtv.to'],
  ['aniwatchtv.to'],
  ['animeflix.live','animeflix.gg','animeflix.li'], // rip
  ['kaa.mx','kaas.to','kaas.ro'],
  ['api.gojo.wtf'],
  ['www.miruro.tv']
];

/* video res change */
var __VIDRESW=0;
var __VIDRESH=0;
window.__VIDRESCB=function(w,h){
  __VIDRESW=w;
  __VIDRESH=h;
  try{
    pb.cfg_update_el("quality");
  }catch(e){}
};
/* sysnav change */
var __SYSHNAV=0;
var __SYSHSTAT=0;
window.__INSETCHANGE=function(s,n){
  __SYSHNAV=n;
  __SYSHSTAT=s;
  document.documentElement.style.setProperty("--sys-nav-height", n+"px");
  document.documentElement.style.setProperty("--sys-stat-height", s+"px");
};
var __VIDLANGS='';
window.__VIDLANGAVAIL=function(s){
  __VIDLANGS=s;
  try{
    pb.cfg_update_el("alang");
  }catch(e){}
};
requestAnimationFrame(function(){
  try{
    __INSETCHANGE(_JSAPI.getSysHeight(false),_JSAPI.getSysHeight(true));
  }catch(e){
    __INSETCHANGE(0,0);
  }
});

var _video_is_dash=false;
function html5video(){
  return _ISELECTRON || ((pb.cfg_data.html5player || (__SD8 && (miruro.provider==0))) && !_video_is_dash);
}

const __SD_NAME = __SD+". "+(__SOURCE_NAME[__SD-1]);
var __SD_DOMAIN = "";
function SD_CHECK_DOMAIN(sd,cb){
  var sm=sd-1;
  if (sm<0 || sd>8){
    return false;
  }
  var chk_url='/manifest.json';
  var chk_json='name';
  if (sd==6){
    // animeflix
    chk_url='/api/home_data';
    chk_json='recent_update';
  }
  else if (sd==7){
    // gojo
    chk_url='/config';
    chk_json='maintenance';
  }
  var res=[];
  var num=__SOURCE_DOMAINS[sm].length;
  function do_test(dm,u,c,i,tstart){
    res[i]={
      dn:dm,
      st:0,
      tm:-1
    };
    $ap(u,function(r){
      var rv={
        dn:dm,
        st:1,
        tm:$tick()-tstart
      };
      if (r.ok){
        try{
          var jv=JSON.parse(r.responseText);
          if (c in jv){
            rv.st=2;
          }
        }catch(e){}
      }
      res[i]=rv;
      if (--num<1){
        if (cb){
          cb(JSON.parse(JSON.stringify(res)));
        }
        console.log(["TEST RESULT", res]);
      }
    },{"X-Fixdomain-Prox":"1"}).timeout=4000;
  }
  for (var i=0;i<__SOURCE_DOMAINS[sm].length;i++){
    do_test(__SOURCE_DOMAINS[sm][i],"https://"+__SOURCE_DOMAINS[sm][i]+chk_url,chk_json,i,$tick());
  }
  return true;
}
function SD_CFGNAME(n){
  return _API.user_prefix+'sdomain_'+n;
}
function SD_CHANGE(){
  listOrder.showList(
    "Source Server",
    __SOURCE_NAME,
    __SD-1,
    function(nxe){
      if (nxe==null){
        return;
      }
      SD_SETTINGS(toInt(nxe)+1);
    },
    false,
    '',
    true
  );
}
function SD_SETTINGS(n, cb){
  $('popupcontainer').className='active';
  $('aboutpopup').className='active'; 
  $('popup_qrcode').onclick=null;
  $('popup_qrcode').innerHTML='Benchmarking...';
  $('popup_qrcode').style.display='';
  SD_CHECK_DOMAIN(n,function(r){
    home.settings.close_qrcode();
    $('popup_qrcode').innerHTML='';
    var list_info=[];
    var sid=0;
    var sid_time=60000;
    for (var i=0;i<r.length;i++){
      var w=r[i];
      var tx=special(w.dn)+'<span class="value">'+(w.st==2?("OK - "+w.tm+"ms"):"ERROR")+'</span>';
      if (w.st==2){
        if (w.tm<sid_time){
          sid=i;
          sid_time=w.tm;
        }
      }
      list_info.push(tx);
    }
    var nx=n-1;
    listOrder.showList(
      "Select Source Domain",list_info,
      sid,
      function(chval){
        if (chval!=null){
          var wsel=r[chval];
          function setDomainNow(){
            var sdomain="";
            if (chval>0){
              sdomain=__SOURCE_DOMAINS[nx][chval];
            }
            _JSAPI.storeSet(SD_CFGNAME(n),sdomain);
            if (cb){
              cb(__SOURCE_DOMAINS[nx][chval]);
            }
          }
          if (wsel.st!=2){
            _API.confirm("Domain Warning!!",
            "Target Domain <b>"+wsel.dn+"</b> is failed in benchmark!!!<br>"+
            "Do you want to continue?",
            function(val){
              if (val){
                setDomainNow();
              }
            });
            return;
          }
          setDomainNow();
          return;
        }
        if (cb){
          cb(null);
        }
      },
      true,
      '',
      true
    );
  });
}
function SD_LOAD_DOMAIN(){
    __SD_DOMAIN=_JSAPI.storeGet(SD_CFGNAME(__SD),"");
    _JSAPI.setSdomain(__SD_DOMAIN);
    console.log("SD Domain: "+__SD_DOMAIN);
}

/* getId */
function $(i){
  return document.getElementById(i);
}

/* MIRURO SOURCE */
var _miruro_api_key = "12RmYtJexlqnNym38z4ahwy+g1g0la/El8nkkMOVtiQ=";
var miruro={
  providerKey:function(){
    return _API.user_prefix+'_miruro_provider';
  },
  setProvider:function(v){
    _JSAPI.storeSet(miruro.providerKey(),v+'');
  },
  getProvider:function(){
    var prov=toInt(_JSAPI.storeGet(miruro.providerKey(),"0"));
    if (!prov){
      prov=0;
    }
    if (prov>=miruro.providers_name.length){
      prov=0;
    }
    return prov;
  },
  providers:[
    'animepahe',
    'zoro',
    'animez',
    'animekai',
  ],
  providers_mirror_key:[
    'ANIMEPAHE',
    'ZORO',
    'ANIMEZ',
    'ANIMEKAI',
  ],
  providers_name:[
    'Animepahe',
    'Zoro Hianime',
    'AnimeZ',
    'AnimeKai',
  ],
  providers_features:[
    'Hardsub, Dub, Best Quality, Fast',
    'Softsub, Dub, Multilang',
    'Hardsub, Dub, Fast, Multi Mirror',
    'Hardsub, Dub',
    
  ],
  proxyM3u8:function(url){
    return 'https://prxy.miruro.to/m3u8?url='+encodeURIComponent(url);
  },
  provider:0, // miruro_get_saved_provider(),
  beforeChangeSource:function(cb){
    var selProv=[];
    for (var i=0;i<miruro.providers_name.length;i++){
      selProv.push({
        title:'<span class="label">'+special(miruro.providers_name[i])+'</span><br>'+
        '<span class="value vinline">'+special(miruro.providers_features[i])+'</span>',
        icon:'storefront'
      });
    }
    listOrder.showMenu(
      "Select Miruro Provider",
      selProv,
      miruro.getProvider(),
      function(chval){
        if (chval!==null){
          miruro.setProvider(chval);
          miruro.provider=chval;
          cb();
        }
      }
    );
  },
  /* API */
  cache:{},
  add_headers:{
    "X-Atx":_miruro_api_key,
    "X-Org-Prox":"https://www.miruro.tv",
    "X-Ref-Prox":"https://www.miruro.tv/",
    'X-Requested-With':'XMLHttpRequest',
    'Pragma':'no-cache',
    'Cache-Control':'no-cache'
  },
  base:{
    dio:"https://dio.miruro.tv",
    mapper:"https://mapper.miruro.tv",
    hi:"https://hi.miruro.tv"
  },
  proxy_round_robin:0,
  base_proxy_length:6,
  base_proxy:{
    alpha:"https://alpha.yamista.xyz",
    beta:"https://beta.yamista.xyz",
    epsilon:"https://epsilon.yamista.xyz",
    zeta:"https://zeta.yamista.xyz",
  },
  req:function(b,u,cb,proxy){
    var req_url = miruro.base[b]+u;
    // proxy=0;
    if (proxy){
      if (!(proxy in miruro.base_proxy)){
        var pid = (++miruro.proxy_round_robin) % miruro.base_proxy_length;
        for (var i in miruro.base_proxy){
          proxy = i;
          if (pid--<1) break;
        }
      }
      var get_uri = encodeURIComponent(req_url);
      req_url= miruro.base_proxy[proxy]+'/?url='+get_uri;
    }
    return $ap(req_url,function(r){
      if (r.ok){
        try{
          cb(JSON.parse(r.responseText));
          return;
        }catch(e){}
      }
      cb(null);
    },miruro.add_headers);
  },
  getAnimeId:function(url){
    var ux=url.split('#');
    return ux[0];
  },
  getFilterOrigin:function(){
    var orgn={
      "X-Atx":_miruro_api_key,
      "X-Org-Prox":"https://www.miruro.tv",
      "X-Ref-Prox":"https://www.miruro.tv/",
      'X-Requested-With':'XMLHttpRequest',
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    };
    return orgn;
  },
  getFilterUrl:function(q,genres,sort,page,ses,year){
    return "";
  },
  /* Reuse miruro anilist view */
  getTooltip:function(id, cb, url, isview){
    if (!id){
      var ux=url.split('#');
      id=ux[0];
    }
    if (id in miruro.cache){
      if (miruro.cache[id]){
        var oval=JSON.parse(miruro.cache[id]);
        if ('url' in oval){
          requestAnimationFrame(function(){
            cb(oval);
          });
          return;
        }
      }
    }
    _MAL.alreq(`query ($id: Int) {
      Media(id:$id, type:ANIME, isAdult:false){
        id
        idMal
        title{
          romaji
          english
        }
        coverImage{
          large
        }
        status
        duration
        format
        episodes
        description
        bannerImage
        genres
        nextAiringEpisode {
          episode
        }
      }
    }`,{
          "id":id
        },function(r){
      if (r){
        var o=null;
        var ostr=null;
        try{
          var m = r.data.Media;
          var kk=document.createElement('div');
          kk.innerHTML=m.description;

          var sumep = m.episodes;
          if (m.nextAiringEpisode){
            sumep=m.nextAiringEpisode.episode-1;
          }
          o={
            url:id,
            title:m.title.english?m.title.english:m.title.romaji,
            title_jp:m.title.romaji?m.title.romaji:m.title.english,
            synopsis:(kk.textContent+'').trim(),
            genres:[],
            genre:'',
            quality:null,
            ep:sumep,
            rating:'',
            ttid:id,
            poster:m.coverImage.large,
            tip:id,
            malId:m.idMal
          };
          o.genre=m.genres.join(", ");
          for (var i=1;i<m.genres.length;i++){
            try{
              o.genres.push({
                name:m.genres[i],
                val:m.genres[i].toLowerCase()
              });
            }catch(e){}
          }
          ostr=JSON.stringify(o);
          miruro.cache[id]=ostr;
        }catch(e){
          console.warn(e);
        }
        cb(JSON.parse(ostr));
        return;
      }
      cb(null);
    },1);
  },
  getFromMAL:function(id,f){
    return gojo.getFromMAL(id,f);
  },
  recent_parse:function(v){
    return gojo.recent_parse(v);
  },
  loadVideoProv:function(dt, f){
    var epIndex=dt.epactive;
    var epItem=dt.ep[epIndex];
    if (!epItem){
      requestAnimationFrame(function(){
        f(null);
      });
      return 0;
    }
    var prov = epItem.prov;

    function loadEpisodeData(streamType){
      dt.skip=[[0,0],[0,0]];
      var cd = epItem.cache[streamType];
      if (prov=='ZORO' || prov=='ANIMEKAI'){
        var isKai=(prov=='ANIMEKAI')?true:false;
        var servName = isKai?'KAI':'ZORO';
        var snSub='';
        var snDub='';
        var kdat=null;
        var kdub=null;
        for (var i in cd.dub){ snDub=i; kdub=cd.dub[i]; break; }
        var ksub=null;
        for (var i in cd.sub){ snSub=i; ksub=cd.sub[i]; break; }

        if (kdub && streamType=='dub'){
          kdat=kdub;
          servName=snDub;
        }
        else{
          kdat=ksub;
          servName=snSub;
        }

        dt.servers={
          sub:[
            {n:servName,p:0}
          ],
          softsub:[
            {n:servName,p:0}
          ],
          dub:[
            {n:servName,p:0}
          ]
        };

        console.log("loadEpisodeData: "+prov+" -> "+servName);
        console.log(kdat);

        if ('intro' in kdat){
          dt.skip[0]=[kdat.intro.start,kdat.intro.end];
        }
        if ('outro' in kdat){
          dt.skip[1]=[kdat.outro.start,kdat.outro.end];
        }

        var urls=[];
        var src = "";
        for (var i=0;i<kdat.sources.length;i++){
          var sc=kdat.sources[i];
          var csrc = isKai?sc.file:sc.url;
          if (isKai){
            csrc='https://prxy.miruro.to/m3u8/?url='+encodeURIComponent(csrc);
          }
          if (!src){
            src=csrc;
          }
          urls.push(csrc);
        }

        if (src){
          dt.streamtype=(streamType=='dub')?'dub':'softsub';
          dt.stream_url.dub=src;
          dt.stream_url.soft=src;
          dt.stream_url.hard=src;
          var o={
            url:src,
            urls:urls,
            subtitles:JSON.parse(JSON.stringify(kdat.tracks))
          };
          console.log(["EPINFO", o]);
          f(o);
          return;
        }
        else{
          f(null);
          return;
        }
      }
      else if (prov=='ANIMEPAHE'){
        cd.videoSources.sort(function(a, b) {
          return Number(b.resolution) - Number(a.resolution);
        });
        var src = "";
        dt.servers={};
        dt.stream_url={};
        epItem._pahe={};

        for (var i=0;i<cd.videoSources.length;i++){
          var vs=cd.videoSources[i];
          if ('m3u8Url' in vs){
            var isDub=(vs.audio=='eng');
            var pkey=isDub?'dub':'sub';

            /* Save Server */
            if (!epItem._pahe[pkey]) epItem._pahe[pkey]=[];
            var mirror_pos = epItem._pahe[pkey].length;
            epItem._pahe[pkey].push({
              p:mirror_pos,
              n:vs.fansub+" "+vs.resolution,
              u:vs.m3u8Url
            });

            if (((_API.currentStreamType==2) && isDub) || ((_API.currentStreamType!=2) && !isDub)){
              if (isDub){
                dt.streamtype='dub';
                dt.playingStreamType=2;
              }
              else{
                dt.streamtype='sub';
                dt.playingStreamType=0;
              }

              if (mirror_pos==pb.cfg_data.mirrorserver || !src){
                src = vs.m3u8Url;
              }
            }
            if (mirror_pos==pb.cfg_data.mirrorserver){
              if (isDub){
                dt.stream_url.dub=vs.m3u8Url;
              }
            }
          }
        }

        dt.servers=JSON.parse(JSON.stringify(epItem._pahe));
        if (src){
          var o={
            url:src
          };
          f(o);
          return;
        }
        f(null);
        return;
      }
      else if (prov=='ANIMEZ'){
        var kdat=null;
        var kdub=null;
        var ksub=null;
        if (cd.dub && 'srcList' in cd.dub){
          kdub=cd.dub.srcList;
        }
        if (cd.sub && 'srcList' in cd.sub){
          ksub=cd.sub.srcList;
        }

        dt.servers={};
        var crs='sub';
        if (kdub && streamType=='dub'){
          kdat=kdub;
          dt.servers={
            sub:[{n:'MAIN',p:0}],
            dub:[]
          };
          crs='dub';
        }
        else if (ksub){
          kdat=ksub;
          dt.servers={
            dub:[{n:'MAIN',p:0}],
            sub:[]
          };
        }
        else{
          f(null);
          return;
        }

        var urls=[];
        var src = "";
        var crn = 0;
        var ndat=[];
        var nmain=null;
        for (var i in kdat){
          kdat[i].nm=i;
          if (i=='main'){
            nmain=kdat[i];
          }
          else{
            ndat.push(kdat[i]);
          }
        }
        if (_ISELECTRON && nmain){
          ndat.push(nmain);
        }
        for (var i=0;i<ndat.length;i++){
          var sc=ndat[i];
          if ('m3u8' in sc){
            dt.servers[crs].push(
              {
                n:sc.nm,
                p:crn
              }
            );

            var csrc = sc.m3u8;
            if (i!='main'){
              csrc='https://prxy.miruro.to/m3u8/?url='+encodeURIComponent(csrc);
            }
            if ((pb.cfg_data.mirrorserver==crn) || !src){
              src=csrc;
            }
            urls.push(csrc);
            crn++;
          }
        }
        if (src){
          dt.streamtype=(streamType=='dub')?'dub':'sub';
          dt.stream_url.dub=src;
          dt.stream_url.soft=src;
          dt.stream_url.hard=src;
          var o={
            url:src,
            urls:urls
          };
          console.log(["EPINFO", o]);
          f(o);
          return;
        }
        else{
          f(null);
          return;
        }
      }
    }
    
    /* LOAD DATA / CACHE */
    var streamType='sub';
    if (_API.currentStreamType==2){
      streamType = 'dub';
    }
    if (!epItem.cache){
      epItem.cache={};
    }

    console.log("LOAD EPISODE: "+epIndex);
    console.log(epItem);
    if (epItem.cache[streamType]){
      requestAnimationFrame(function(){
        loadEpisodeData(streamType);
      });
    }
    else{
      function loadStreamData(){
        miruro.req("dio",epItem.epurl+"&lang="+streamType,function(k){
          if (k){
            epItem.cache[streamType]=k;
            loadEpisodeData(streamType);
          }
          else{
            if (streamType=="dub"){
              streamType="sub";
              loadStreamData();
            }
            else{
              f(null);
            }
          }
        },true);
      }
      loadStreamData();
    }

    return 1;
  },
  loadVideo:function(dt,f){ /* dt: data, f: callback */
    if (!miruro.loadVideoProv(dt,f)){
      f(null);
      return 0;
    }
    return 1;
  },
  getView:function(url,f){ /* dt: data, f: callback */
    var uid=++_API.viewid;
    var ux=url.split('#');
    var uri=ux[0];
    var ep=1;
    if (ux.length==2){
      ep=ux[1]?ux[1]:0;
    }
    function callCb(d){
      d.status=true;
      f(JSON.parse(JSON.stringify(d)),uid);
    }
    function failCb(){
      f({status:false},uid);
    }

    /* DATA FETCH */
    var dat ={
      tip:null,
      cov:null,
      banner:null,
      x:0,
      out:{}
    };

    function fetchProviders(prov, site){
      if (!site){
        return 0;
      }
      if (prov=='ZORO'){
        for (var i=0;i<site.episodeList.episodes.length;i++){
          var pp=site.episodeList.episodes[i];
          pp.number=(i+1)+"";
          var pptitle=pp.title?pp.title:"EP-"+pp.number;
          var oe={
            "ep":pp.number,
            "url":dat.out.url+"#"+pp.number,
            "active":ep==pp.number,
            "title":pptitle,
            "title_jp":pp.jptitle?pp.jptitle:pptitle,
            "filler":pp.filler?pp.filler:false,
            "epid":pp.id,
            "epurl":"/sources?epId="+pp.id+"&provider=zoro",
            "prov":prov
          };
          if (oe.active){
            dat.out.epactive=i;
          }
          dat.out.ep.push(oe);
        }
      }
      else if (prov=='ANIMEKAI'){
        for (var i=0;i<site.episodeList.episodes.length;i++){
          var pp=site.episodeList.episodes[i];
          pp.number=(i+1)+"";
          var pptitle=pp.title?pp.title:"EP-"+pp.number;
          var oe={
            "ep":pp.number,
            "dub":pp.dub,
            "url":dat.out.url+"#"+pp.number,
            "active":ep==pp.number,
            "title":pptitle,
            "title_jp":pptitle,
            "epid":pp.id,
            "epurl":"/sources?epId="+pp.id+"&provider=animekai",
            "prov":prov
          };
          if (oe.active){
            dat.out.epactive=i;
          }
          dat.out.ep.push(oe);
        }
      }
      else if (prov=='ANIMEPAHE'){
        for (var i=0;i<site.episodeList.length;i++){
          var pp=site.episodeList[i];
          pp.number=(i+1)+"";
          var pptitle="EP-"+pp.number;
          var oe={
            "ep":pp.number,
            "url":dat.out.url+"#"+pp.number,
            "active":ep==pp.number,
            "title":pptitle,
            "title_jp":pptitle,
            "epid":pp.id,
            "epurl":"/sources?id="+site.id+"&ep="+pp.number+"&provider=animepahe",
            "prov":prov
          };
          if (oe.active){
            dat.out.epactive=i;
          }
          dat.out.ep.push(oe);
        }
      }
      else if (prov=='ANIMEZ'){
        for (var i=0;i<site.episodeList.episodes.sub.length;i++){
          var pp=site.episodeList.episodes.sub[i];
          var ppd=null;
          var isdub = false;
          try{
            isdub=(site.episodeList.episodes.dub[i])?true:false;
            if (isdub){
              ppd=site.episodeList.episodes.dub[i];
            }
          }catch(e){}
          pp.number=(i+1)+"";
          var pptitle="EP-"+pp.number;
          var oe={
            "dub":isdub,
            "ep":pp.number,
            "url":dat.out.url+"#"+pp.number,
            "active":ep==pp.number,
            "title":pptitle,
            "title_jp":pptitle,
            "epid":pp.id,
            "epurl":"/sources?epId="+pp.id+"&provider=animez",
            "dub_epid":isdub?ppd.id:null,
            "dub_epurl":ppd?("/sources?epId="+ppd.id+"&provider=animez"):null,
            "prov":prov
          };
          if (oe.active){
            dat.out.epactive=i;
          }
          dat.out.ep.push(oe);
        }
      }
      else{
        return 0;
      }
      try{
        dat.out.ep[dat.out.epactive].active=true;
        dat.out.epactivenum = dat.out.ep[dat.out.epactive].ep;
      }catch(e){}
      return 1;
    }

    function datacb(){
      if (dat.x!=3){
        return;
      }
      if (!dat.cov || !dat.tip){
        failCb();
        return;
      }
      var d = dat.tip;
      var r = dat.cov;
      dat.out={
        "idMal":d.malId,
        "title": d.title,
        "title_jp": d.title_jp,
        "synopsis": d.synopsis,
        "genres": d.genres,
        "quality": null,
        "banner": dat.banner,
        "rating": "",
        "ttid": d.tip,
        "url": d.url,
        "poster": d.poster,
        "rating":"",
        "status": false,
        "epavail": d.ep,
        "epdub": 0,
        "type": "TV",
        "genre": d.genre,
        "info": {
            "type": {
                "val": "_TV",
                "name": "TV"
            },
            "rating": "",
            "quality": null
        },
        "ep": [],
        "epactive":0,
        "epactivenum":ep,
        "servers":{dub:[],sub:[],softsub:[]},
        "streamtype":"sub",
        "stream_url":{}
      };
      var foundProvider=false;
      if (r){
        var prov = miruro.providers_mirror_key[miruro.provider];
        if (prov in r){
          for (var sid in r[prov]){
            try{
              if (fetchProviders(prov, r[prov][sid])){
                foundProvider=true;
                break;
              }
            }catch(e){}
          }
        }
      }

      if (!foundProvider){
        failCb();
      }
      else{
        console.log("PROVIDER DATA:");
        console.log(dat.out);
        callCb(dat.out);
      }
    }

    bannerCacher.get(uri,function(im){
      if (im){
        dat.banner=im;
      }
      dat.x++;
      datacb();
    });

    miruro.getTooltip(uri, function(k){
      if (k) dat.tip=k;
      dat.x++;
      var urljson = "/i?id="+k.malId+"&provider=anilist&type=anime";
      if (k.malId){
        urljson = "/i?id="+k.malId+"&provider=mal&type=anime";
      }
      miruro.req("dio",urljson,function(k){
        if (k) dat.cov=k;
        dat.x++;
        datacb();
      },true);
    }, uri, true);

    
    return uid;
  }
}





/* GOJO SOURCE */
var gojo={
  /* API */
  subtitle_origin:{
    "X-Org-Prox":"https://vidco.pro",
    "X-NoH-Proxy":"true"
  },
  cache:{},
  getAnimeId:function(url){
    var ux=(url+'').split('#');
    return ux[0];
  },
  getFilterOrigin:function(){
    var orgn={
      "X-Org-Prox":"https://"+__DNS,
      "X-Ref-Prox":"https://"+__DNS+"/",
      'X-Requested-With':'XMLHttpRequest',
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    };
    return orgn;
  },
  getFilterUrl:function(q,genres,sort,page,ses,year){
    return "";
  },
  getTooltip:function(id, cb, url, isview){
    if (!id){
      var ux=url.split('#');
      id=ux[0];
    }
    if (id in gojo.cache){
      if (gojo.cache[id]){
        var oval=JSON.parse(gojo.cache[id]);
        if (!isview || (isview && oval.gojo.ep)){
          requestAnimationFrame(function(){
            cb(oval);
          });
          return;
        }
      }
    }
    var dat={
      info:null,
      ep:null,
      x:isview?0:1
    };
    function oncb(){
      if (dat.x==2){
        if (dat.info){
          var o=null;
          var ostr=null;
          try{
            var m=dat.info.data.Media;
            var kk=document.createElement('div');
            kk.innerHTML=m.description;
            o={
              url:id,
              title:m.title.english?m.title.english:m.title.romaji,
              title_jp:m.title.romaji?m.title.romaji:m.title.english,
              synopsis:(kk.textContent+'').trim(),
              genres:[],
              genre:'',
              quality:null,
              ep:dat.ep?(dat.ep[0].episodes.length):m.episodes,
              rating:'',
              ttid:id,
              gojo:dat,
              poster:m.coverImage.large,
              tip:id
            };
            o.genre=m.genres.join(", ");
            for (var i=1;i<m.genres.length;i++){
              try{
                o.genres.push({
                  name:m.genres[i],
                  val:m.genres[i].toLowerCase()
                });
              }catch(e){}
            }
            ostr=JSON.stringify(o);
            gojo.cache[id]=ostr;
          }catch(e){
            console.warn(e);
          }
          cb(JSON.parse(ostr));
        }
        else{
          cb(null);
        }
      }
    }
    if (isview){
      $a("/episodes?id="+id,function(r){
        if (r.ok){
          try{
            dat.ep=JSON.parse(r.responseText);
          }
          catch(e){
            dat.ep=null;
          }
        }
        dat.x++;
        oncb();
      });
    }
    _MAL.alreq(`query ($id: Int) {
  Media(id:$id, type:ANIME, isAdult:false){
    id
    idMal
    title{
      romaji
      english
    }
    coverImage{
      large
    }
    status
    duration
    format
    episodes
    description
    bannerImage
    genres
  }
}`,{
      "id":id
    },function(r){
      dat.info=r;
      dat.x++;
      oncb();
    },1);
  },
  getFromMAL:function(id,f){
    _MAL.alreq(`query ($id: Int) {
      Media(idMal:$id, type:ANIME, isAdult:false){
        id
        idMal
        title{
          romaji
          english
        }
        coverImage{
          large
        }
        status
        duration
        format
        episodes
        description
        bannerImage
        genres
      }
    }`,{
          "id":id
        },function(r){
          f(r);
        },1);
  },
  loadVideo:function(dt,f){
    var oe=dt.ep[dt.epactive];
    var subtype="sub";
    var svs=oe.svs;
    if (oe.dub>0){
      dt.servers['dub']=[pb.serverobj(oe.streams[oe.dub-1].provider,0)];
      dt.stream_url.dub=oe.streams[oe.dub-1].id;
    }
    // if ('roro' in svs){
    //   dt.servers['softsub']=[pb.serverobj('roro',0)];
    //   dt.stream_url.soft=svs['roro'];
    // }
    dt.servers['sub']=[];
    dt.servers['softsub']=[];
    var nn=0;
    var nns=0;
    for (var idr in svs){
      // https://rox.gojo.wtf/
      dt.servers['sub'].push(pb.serverobj(idr,nn++));
      dt.servers['softsub'].push(pb.serverobj(idr,nns++));
    }
    dt.stream_url.soft=svs['roro'];
    dt.stream_url.hard=oe.streams[0].id;

    dt.streamtype="sub";
    var is_soft=false;
    if (_API.currentStreamType==2 || pb.cfg_data.dubaudio){
      if (dt.servers['dub'].length>0){
        dt.streamtype="dub";
        dt.stream_provider=oe.streams[oe.dub-1].provider;
        dt.stream_sid=oe.streams[oe.dub-1].id;
      }
    }
    else if ((_API.currentStreamType==1) && (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub')){
      if ('roro' in svs){
        is_soft=true;
        dt.streamtype="softsub";
        dt.stream_provider='roro';
        dt.stream_sid=svs['roro'];
      }
    }
    // if (is_soft||_API.currentStreamType==1){
    //   dt.stream_provider=oe.streams[0].provider;
    //   dt.stream_sid=oe.streams[0].id;
    //   if (pb.cfg_data.mirrorserver){
    //     if (oe.streams[1]){
    //       dt.stream_provider=oe.streams[1].provider;
    //       dt.stream_sid=oe.streams[1].id;
    //     }
    //   }
    // }

    var prov=dt.stream_provider;
    var wid=dt.stream_sid;
    if (dt.streamtype=="dub"){
      if (oe.dub>0){
        subtype="dub";
        dt.streamtype="dub";
      }
    }
    else if (dt.streamtype=="softsub"){
      subtype="sub";
      dt.streamtype="softsub";
      if ('roro' in svs){
        prov='roro';
        wid=svs['roro'];
      }
    }
    else{
      subtype="sub";
      dt.streamtype="sub";
      dt.stream_provider=prov=oe.streams[0].provider;
      dt.stream_sid=wid=oe.streams[0].id;
      if (pb.cfg_data.mirrorserver){
        if (oe.streams[1]){
          dt.stream_provider=prov=oe.streams[1].provider;
          dt.stream_sid=wid=oe.streams[1].id;
        }
      }
    }
    var kurl="/tiddies?provider="+enc(prov)+"&id="+enc(dt.url+'')+"&num="+enc(oe.ep)+"&subType="+enc(subtype)+"&watchId="+enc(wid);
    var skurl="/skips?id="+enc(dt.url+'')+"&num="+enc(oe.ep);
    console.warn("VID-FETCH = "+kurl);

    var o={
      d:null,
      s:null,
      x:0
    };

    function dataCb(){
      if (o.x!=2){
        return;
      }
      if (!o.d){
        f(null);
        return;
      }
      f(o);
    }

    $a(kurl,function(r){
      if (r.ok){
        try{
          o.d=JSON.parse(r.responseText);
        }catch(e){
          o.d=null;
        }
      }
      o.x++;
      dataCb();
    });

    $a(skurl,function(r){
      if (r.ok){
        try{
          o.s=JSON.parse(r.responseText);
        }catch(e){
          o.s=null;
        }
      }
      o.x++;
      dataCb();
    });
  },
  getView:function(url,f){
    var uid=++_API.viewid;
    var ux=url.split('#');
    var uri=ux[0];
    var ep=1;
    if (ux.length==2){
      ep=ux[1]?ux[1]:0;
    }

    var dat={
      tip:null,
      cov:null,
      x:0
    };

    function callCb(d){
      d.status=true;
      f(JSON.parse(JSON.stringify(d)),uid);
    }

    function datacb(){
      if (dat.x!=2){
        return;
      }
      console.log(dat);
      const d=dat.tip;
      var malId=d.gojo.info.data.Media.idMal;
      // $ap('https://api.aniskip.com/v2/skip-times/'+malId+'/'+ep+
      //   '?episodeLength=0&types%5B%5D=ed&types%5B%5D=mixed-ed&types%5B%5D=mixed-op&types%5B%5D=op&types%5B%5D=recap',
      // function(r){
      //   console.warn(["EP SKIP ANI", r]);
      // });
      var o={
        "idMal":malId,
        "title": d.title,
        "title_jp": d.title_jp,
        "synopsis": d.synopsis,
        "genres": d.genres,
        "quality": null,
        "banner": null,
        "rating": "",
        "ttid": d.tip,
        "url": d.url,
        "poster": d.poster,
        "rating":"",
        "status": false,
        "epavail": d.ep,
        "epdub": 0,
        "type": "TV",
        "genre": d.genre,
        "info": {
            "type": {
                "val": "_TV",
                "name": "TV"
            },
            "rating": "",
            "quality": null
        },
        "ep": [],
        "epactive":0,
        "servers":{dub:[],sub:[],softsub:[]},
        "streamtype":"sub",
        "stream_url":{}
      };
      const eps=d.gojo.ep;
      // const covs={};
      // for (var i=0;i<dat.cov[0].data.length;i++){
      //   var cvdt=dat.cov[0].data[i];
      //   covs[cvdt.number]={
      //     title:cvdt.title,
      //     img:cvdt.img,
      //     desc:cvdt.description
      //   };
      // }
      for (var i=0;i<eps[0].episodes.length;i++){
        var pp=eps[0].episodes[i];
        var oe={
          "ep":pp.number,
          "url":d.url+"#"+pp.number,
          "active":ep==pp.number,
          "filler":false,
          "title":pp.title,
          "streams":[]
        };
        
        // if (pp.number in covs){
        //   var cvd=covs[pp.number];
        //   oe.title=cvd.title;
        //   oe.img=cvd.img;
        //   oe.desc=cvd.desc;
        // }
        
        var svs={};
        for (var j=0;j<eps.length;j++){
          var ips=eps[j];
          if (ips.episodes[i]){
            oe.streams.push({
              "provider":ips.providerId,
              "id":ips.episodes[i].id
            });
            if (ips.episodes[i].hasDub){
              oe.dub=j+1;
            }
            if (ips.episodes[i].isFiller){
              oe.filler=true;
            }
            svs[ips.providerId]=ips.episodes[i].id;
          }
        }
        oe.svs=svs;

        if (oe.active){
          o.epactive=i;
          if (oe.img){
            o.banner=oe.img;
          }

          
        }
        o.ep.push(oe);
      }
      try{
        o.ep[o.epactive].active=true;
      }catch(e){}
      console.log(o);
      callCb(o);
    }


    // $a("/ep-covers?id="+uri,function(r){
    //   if (r.ok){
    //     try{
    //       dat.cov=JSON.parse(r.responseText);
    //     }
    //     catch(e){
    //       dat.cov=null;
    //     }
    //   }
    //   dat.x++;
    //   datacb();
    // });

    dat.x++;
    gojo.getTooltip(uri,function(k){
      if (k){
        dat.tip=k;
      }
      dat.x++;
      datacb();
    }, uri, true);

    return uid;
  },


  recent_parse:function(v){
    var rd=[];
    try{
      var t=JSON.parse(v);
      var l=t.length;
      for (var i=0;i<l;i++){
        try{
          var d={};
          var u=t[i];
          d.url=u.id;
          d.title=u.title.english?u.title.english:u.title.romaji;
          d.title_jp=u.title.romaji?u.title.romaji:u.title.english;
          d.tip=u.id;
          d.poster=u.coverImage;
          d.epavail=d.ep=u.currentEpisode;
          d.type='';
          d.rating='';
          rd.push(d);
        }catch(e2){}
      }

    }catch(e){
      console.log("ERR kaas.recentParse: "+e);
    }
    return rd;
  }

};

/* KICAKASSANIME SOURCE */
var kaas={
  genres:{
    "_tv":"tv","_movie":"movie",
    "_ova":"ova","_ona":"ona",
    "_special":"special",

    "Action":"Action","Adult Cast":"Adult Cast","Adventure":"Adventure","Anthropomorphic":"Anthropomorphic",
    "Avant Garde":"Avant Garde","Award Winning":"Award Winning","Boys Love":"Boys Love","CGDCT":"CGDCT",
    "Childcare":"Childcare","Combat Sports":"Combat Sports","Comedy":"Comedy","Crossdressing":"Crossdressing",
    "Delinquents":"Delinquents","Detective":"Detective","Drama":"Drama","Ecchi":"Ecchi","Educational":"Educational",
    "Erotica":"Erotica","Fantasy":"Fantasy","Gag Humor":"Gag Humor","Girls Love":"Girls Love","Gore":"Gore",
    "Gourmet":"Gourmet","Harem":"Harem","High Stakes Game":"High Stakes Game","Historical":"Historical",
    "Horror":"Horror","Idols (Female)":"Idols (Female)","Idols (Male)":"Idols (Male)","Isekai":"Isekai",
    "Iyashikei":"Iyashikei","Josei":"Josei","Kids":"Kids","Love Polygon":"Love Polygon","Magical Sex Shift":
    "Magical Sex Shift","Mahou Shoujo":"Mahou Shoujo","Martial Arts":"Martial Arts","Mecha":"Mecha","Medical":
    "Medical","Military":"Military","Music":"Music","Mystery":"Mystery","Mythology":"Mythology","Organized Crime":
    "Organized Crime","Otaku Culture":"Otaku Culture","Parody":"Parody","Performing Arts":"Performing Arts","Pets":"Pets",
    "Psychological":"Psychological","Racing":"Racing","Reincarnation":"Reincarnation","Reverse Harem":"Reverse Harem",
    "Romance":"Romance","Romantic Subtext":"Romantic Subtext","Samurai":"Samurai","School":"School","Sci-Fi":"Sci-Fi",
    "Seinen":"Seinen","Shoujo":"Shoujo","Shounen":"Shounen","Showbiz":"Showbiz","Slice of Life":"Slice of Life","Space":"Space",
    "Sports":"Sports","Strategy Game":"Strategy Game","Super Power":"Super Power","Supernatural":"Supernatural",
    "Survival":"Survival","Suspense":"Suspense","Team Sports":"Team Sports","Time Travel":"Time Travel",
    "Vampire":"Vampire","Video Game":"Video Game","Visual Arts":"Visual Arts","Workplace":"Workplace"
  },
  stream_keys:{
    vidstreaming:'e13d38099bf562e8b9851a652d2043d3',
    duckstream:'4504447b74641ad972980a6b8ffd7631',
    birdstream:'4b14d0ff625163e3c9c7a47926484bf2'
  },
  stream_sig_order:{
    vidstreaming:["IP", "USERAGENT", "ROUTE", "MID", "TIMESTAMP", "KEY"],
    duckstream:["IP", "USERAGENT", "ROUTE", "MID", "TIMESTAMP", "KEY"],
    birdstream:["IP", "USERAGENT", "ROUTE", "MID", "KEY"]
  },
  hex2a:function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  },
  animeStatus:function(status){
    if (status=='currently_airing'){
      return 'RELEASING';
    }
    else if (status=='finished_airing'){
      return 'COMPLETED';
    }
    return '';
  },

  /* API */
  getAnimeId:function(url){
    var ux=url.split('#');
    return ux[0];
  },
  filterIsPost:false,
  filterData:'',
  getFilterOrigin:function(){
    var orgn={
      "X-Org-Prox":"https://"+__DNS,
      "X-Ref-Prox":"https://"+__DNS+"/",
      'X-Requested-With':'XMLHttpRequest',
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    };
    if (kaas.filterIsPost){
      if (kaas.filterData){
        orgn={
          'post':kaas.filterData+'',
          'X-Requested-With':'XMLHttpRequest',
          'Pragma':'no-cache',
          'Cache-Control':'no-cache',
          'Content-Type':"application/json"
        };
      }
      else{
        orgn["X-Post-Prox"]="application/json";
        orgn["Accept"]="application/json, text/plain, */*";
      }
    }
    return orgn;
  },
  getFilterUrl:function(q,genres,sort,page,ses,year){
    var nq=q.toLowerCase()
      .replace(/  /g, "  ")
      .replace(/  /g, " ")
      .replace(/  /g, " ")
      .replace(/  /g, " ")
      .replace(/ /g, ' ').trim();
    nq=utfascii(nq);
    if (!nq){
      kaas.filterIsPost=false;
    }
    else{
      kaas.filterIsPost=true;
    }

    var d={
      "query":nq,
      "page":page?page:1
    };
    var f={};
    var has_filter=false;

    if (!ses){
      if (genres){
        for (var i=0;i<genres.length;i++){
          var vl=genres[i];
          if (vl.charAt(0)=='_'){
            f.type=kaas.genres[vl];
            has_filter=true;
          }
          else{
            if (!f.genres){
              f.genres=[];
            }
            f.genres.push(kaas.genres[vl]);
            has_filter=true;
          }
        }
      }
    }
    if (has_filter){
      d.filters=btoa(JSON.stringify(f));
    }
    var jsv='';
    var jpath='';
    if (kaas.filterIsPost){
      jpath='/api/fsearch';
      jsv=JSON.stringify(d);
    }
    else{
      jpath='/api/anime';
      jsv='page='+enc(page);
      if (has_filter){
        jsv+='&filters='+enc(d.filters);
      }
    }
    var furi=null;
    // if ((pb.cfg_data.httpclient==1) && kaas.filterIsPost){
    //   furi=jpath;
    //   kaas.filterData=jsv;
    // }
    // else{
      kaas.filterData=null;// kaa.mx
      furi="/__proxy/https://kaa.mx"+jpath+"?"+enc(jsv);
      // furi="/__proxy/https://"+__DNS+jpath+"?"+enc(jsv);
    // }
    console.warn("KAAS FILTER = "+furi+" / "+kaas.filterData);
    return furi;
  },
  ttip_cache:{},
  getTooltip:function(id, cb, url, isview){
    if (!id){
      id=url;
    }
    var tturl='/api/show/'+id;
    var epsurl='/api/show/'+id+'/episodes?ep=1&lang=ja-JP&page=1';
    var epsurl_dub='/api/show/'+id+'/episodes?ep=1&lang=en-US&page=1';
    function processData(ld){
      var u=ld.info;
      var p=ld.ep;
      var pd=ld.epdub;
      var o={
        title:'',
        title_jp:'',
        synopsis:'',
        genres:[],
        quality:null,
        ep:0,
        rating:'',
        ttid:id
      };

      o.url=u.slug;
      o.ttid=u.slug;
      o.title=u.title_en?u.title_en:u.title;
      o.title_jp=u.title;
      o.synopsis=u.synopsis;
      
      o.poster=kaas.imgPoster(u.poster,0);
      if (u.banner){
        o.banner=kaas.imgPoster(u.banner,1);
      }

      var epnum=0;
      var epdub=0;
      try{
        if (p.pages.length>0){
          epnum=toInt(p.pages[p.pages.length-1].to);
        }
      }catch(e){}
      try{
        if (pd.pages.length>0){
          epdub=toInt(pd.pages[pd.pages.length-1].to);
        }
      }catch(e){}

      o.rating=u.rating?u.rating:'';
      o.status=kaas.animeStatus(u.status);
      o.epavail=o.ep=epnum;
      o.epdub=epdub;
      o.type=u.type?u.type.toUpperCase():'';
      if (u.duration){
        o.duration=Math.floor(u.duration/60000)+'MIN';
      }
      if (u.episode_duration){
        o.duration=Math.floor(u.episode_duration/60)+'MIN';
      }
      o.genre=u.genres.join(", ");
      for (var i=1;i<u.genres.length;i++){
        try{
          o.genres.push({
            name:u.genres[i],
            val:u.genres[i].toLowerCase()
          });
        }catch(e){}
      }
      if (isview){
        o.kaasep_data=p;
        o.kaasepdub_data=pd;
        o.info={
          type:o.type?{
            val:'_'+o.type,
            name:o.type
          }:null,
          rating:o.rating,
          quality:null
        };
      }
      cb(o);
    }

    if (!kaas.ttip_cache[id]){
      kaas.ttip_cache[id]={
        ep:null,
        epdub:null,
        info:null
      };
    }
    var loaded_data=kaas.ttip_cache[id];
    

    function dtLoad(){
      if (loaded_data.info==null) return;
      if (loaded_data.ep==null) return;
      if (isview && loaded_data.epdub==null) return;
      processData(loaded_data);
    }
    
    if (!loaded_data.info){
      $a(tturl,function(r){
        if (r.ok){
          loaded_data.info=JSON.parse(r.responseText);
          dtLoad();
          return;
        }
        cb(null);
      });
    }

    if (!loaded_data.ep){
      $a(epsurl,function(r){
        if (r.ok){
          loaded_data.ep=JSON.parse(r.responseText);
          dtLoad();
          return;
        }
        cb(null);
      });
    }

    if (isview){
      if (!loaded_data.epdub){
        $a(epsurl_dub,function(r){
          if (r.ok){
            loaded_data.epdub=JSON.parse(r.responseText);
            dtLoad();
            return;
          }
          cb(null);
        });
      }
    }

    dtLoad();
  },
  view_cache:{},
  selectServer:function(d){
    d.stream_vurl = d.stream_url.hard;
    d.stream_sname = d.stream_types.hard;
    d.stream_mirror_data = d.stream_mirror.hard;
    d.streamtype="sub";
    var is_soft=false;
    if (_API.currentStreamType==2){
      if (d.stream_url.dub){
        d.stream_mirror_data = d.stream_mirror.dub;
        d.stream_vurl = d.stream_url.dub;
        d.stream_sname = d.stream_types.dub;
        d.streamtype="dub";
      }
      else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
        is_soft=true;
      }
    }
    if (is_soft||_API.currentStreamType==1){
      if (d.stream_url.soft){
        d.stream_mirror_data = d.stream_mirror.soft;
        d.stream_vurl = d.stream_url.soft;
        d.stream_sname = d.stream_types.soft;
        d.streamtype="softsub";
      }
    }
  },
  getView:function(url,f){
    var uid=++_API.viewid;
    var view_data=null;
    var ux=url.split('#');
    var uri=ux[0];
    var ep=1;
    if (ux.length==2){
      ep=ux[1]?ux[1]:0;
    }

    function callCb(d){
      d.status=true;
      // console.log(["KAAS callCb", d, uid]);
      f(JSON.parse(JSON.stringify(d)),uid);
    }

    function selectServer(stid,d){
      if (!d || d.length<1){
        return null;
      }
      var ismirror=(pb.server_selected(1)==1);
      var hasod=false;
      var od=d[0];
      var md=d[0];
      var vs=null;
      var bs=null;
      for (var i=0;i<d.length;i++){
        var di=d[i];
        if (di.name){
          if (di.name=='VidStreaming'){
            vs=di;
            view_data.servers[stid].push(
              pb.serverobj('VidStreaming',0)
            );
            if (pb.server_selected(2)==0){
              hasod=true;
              od=di;
            }
          }
          else if (di.name=='BirdStream'){
            bs=di;
            view_data.servers[stid].push(
              pb.serverobj('BirdStream',1)
            );
            if (pb.server_selected(2)==1){
              hasod=true;
              od=di;
            }
          }
          else if (di.name=='CatStream'){
            bs=di;
            view_data.servers[stid].push(
              pb.serverobj('CatStream',2)
            );
            if (pb.server_selected(2)==2){
              hasod=true;
              od=di;
            }
          }
          else if (di.name=='DuckStream'){
            view_data.servers[stid].push(
              pb.serverobj('DuckStream',3)
            );
            if (pb.server_selected(2)==3){
              hasod=true;
              od=di;
            }
          }
        }
      }
      if (bs){
        if (!hasod){
          od=bs;
        }
        md=vs?vs:bs;
      }
      else if (vs){
        if (!hasod){
          od=vs;
        }
        md=bs?bs:vs;
      }
      if (!ismirror){
        if (!hasod){
          od=vs?vs:od;
        }
        md=bs?bs:md;
      }
      else{
        if (!hasod){
          od=bs?bs:od;
        }
        md=vs?vs:md;
      }
      if (!md.name){
        var vd=md;
        odname="VidStreaming";
        if (vd.indexOf("/pink-bird")>0){
          odname="BirdStream";
        }
        else if (vd.indexOf("-duck")>0){
          odname="DuckStream";
        }
        md={
          name:odname,
          src:vd
        }
      }
      if (!od.name){
        var vd=od;
        odname="VidStreaming";
        if (vd.indexOf("/pink-bird")>0){
          odname="BirdStream";
        }
        else if (vd.indexOf("-duck")>0){
          odname="DuckStream";
        }
        od={
          name:odname,
          src:vd
        };
      }
      od.mirror=JSON.parse(JSON.stringify(ismirror?(bs?bs:md):md));
      return od;
    }

    function loadServer(){
      if (view_data && view_data._active_ep){
        try{
          var d=view_data._active_ep;
          var sub_url=null;
          var dub_url=null;
          var sv_num=0;

          function parseServer(){
            if (--sv_num>0){
              return;
            }
            view_data.stream_mirror={
              'hard':null,
              'soft':null,
              'dub':null
            };
            view_data.stream_url={
              'hard':'',
              'soft':'',
              'dub':''
            };
            view_data.stream_types={
              'hard':'',
              'soft':'',
              'dub':''
            };
            view_data.skip=[];
            view_data.servers={
              'sub':[],
              'softsub':[],
              'dub':[]
            };
            if (d.sub_data){
              var sv=selectServer('softsub',d.sub_data);
              if (sv){
                view_data.servers.sub=JSON.parse(JSON.stringify(view_data.servers.softsub));
                sv.mirror.name=(sv.mirror.name+'').toLowerCase();
                view_data.stream_mirror.hard=
                view_data.stream_mirror.soft=sv.mirror;
                view_data.stream_url.hard=
                view_data.stream_url.soft=sv.src;
                view_data.stream_types.hard=
                view_data.stream_types.soft=sv.name.toLowerCase();
              }
            }
            if (d.dub_data){
              var sv=selectServer('dub',d.dub_data);
              if (sv){
                sv.mirror.name=(sv.mirror.name+'').toLowerCase();
                view_data.stream_mirror.dub=sv.mirror;
                view_data.stream_url.dub=sv.src;
                view_data.stream_types.dub=sv.name.toLowerCase();
              }
            }
            if (d.img){
              view_data.banner=d.img;
            }
            callCb(view_data);
          }
          if (d.sub){
            sub_url='/api/show/'+uri+'/episode/ep-'+d.ep+'-'+d.sub;
            sv_num++;
          }
          if (d.dub){
            dub_url='/api/show/'+uri+'/episode/ep-'+d.ep+'-'+d.dub;
            sv_num++;
          }
          if (sub_url){
            if (d.sub_data){
              setTimeout(parseServer,10);
            }
            else{
              $a(sub_url,function(r){
                if (r.ok){
                  try{
                    d.sub_data=JSON.parse(r.responseText).servers;
                  }catch(e){}
                }
                parseServer();
              });
            }
          }
          if (dub_url){
            if (d.dub_data){
              setTimeout(parseServer,10);
            }
            else{
              $a(dub_url,function(r){
                if (r.ok){
                  try{
                    d.dub_data=JSON.parse(r.responseText).servers;
                  }catch(e){}
                }
                parseServer();
              });
            }
          }
          return;
        }catch(e){
          console.warn("GET VIEW KAAS: "+e);
        }
      }
      f({status:false},uid);
    }

    if (kaas.view_cache[uri]){
      view_data=kaas.view_cache[uri];
      if (view_data._active_ep){
        view_data._active_ep.active=false;
      }
      var found_ep=false;
      for (var i=0;i<view_data.ep.length;i++){
        if (view_data.ep[i].ep==ep){
          view_data.ep[i].active=true;
          view_data._active_ep=view_data.ep[i];
          found_ep=true;
        }
      }
      if (!found_ep && (view_data.ep.length>0)){
        ep=view_data.ep[0].ep;
        view_data.ep[0].active=true;
        view_data._active_ep=view_data.ep[0];
      }
      loadServer();
      return uid;
    }
    var view_load_en_num=0;
    var view_eps={};
    function ep_loaded(r,isdub){
      if (r && r.result){
        
        for (var i=0;i<r.result.length;i++){
          var p=r.result[i];
          var d=null;
          if (p.episode_number in view_eps){
            d=view_eps[p.episode_number];
          }
          else{
            view_eps[p.episode_number]={};
            d=view_eps[p.episode_number];
            // d.title=p.title;
            d.ep=p.episode_number;
            d.url=uri+"#"+d.ep;
            if (d.ep==ep){
              d.active=true;
              view_data._active_ep=d;
            }
          }
          if (isdub){
            d.dub=p.slug;
          }
          else{
            d.sub=p.slug;
          }
          if (!d.img){
            if (p.thumbnail){
              d.img=kaas.imgPoster(p.thumbnail,2);
            }
          }
        }
      }
      if (--view_load_en_num<1){
        view_data.ep=[];
        var vep=view_data.ep;
        for (var i in view_eps){
          vep.push(view_eps[i]);
        }
        vep.sort(function(a, b) {
          return Number(a.ep) - Number(b.ep);
        });
        if (!view_data._active_ep && (view_data.ep.length>0)) {
          ep=view_data.ep[0].ep;
          view_data.ep[0].active=true;
          view_data._active_ep=view_data.ep[0];
        }
        kaas.view_cache[uri]=view_data;
        loadServer();
      }
    }
    kaas.getTooltip(uri,function(k){
      if (k){
        console.log(["KAAS getView Tooltip",k]);
        view_data=k;
        view_load_en_num=2;
        for (var i=1;i<k.kaasep_data.pages.length;i++){
          var u='/api/show/'+uri+'/episodes?ep=1&lang=ja-JP&page='+
            (k.kaasep_data.pages[i].number);
            view_load_en_num++;
          $a(u,function(r){
            var d=null;
            try{
              d=JSON.parse(r.responseText);
            }catch(e){}
            ep_loaded(d,false);
          });
        }
        for (var i=1;i<k.kaasepdub_data.pages.length;i++){
          var u='/api/show/'+uri+'/episodes?ep=1&lang=en-US&page='+
            (k.kaasepdub_data.pages[i].number);
            view_load_en_num++;
            $a(u,function(r){
              var d=null;
              try{
                d=JSON.parse(r.responseText);
              }catch(e){}
              ep_loaded(d,true);
            });
        }
        ep_loaded(k.kaasep_data,false);
        ep_loaded(k.kaasepdub_data,true);
        delete k.kaasep_data;
        delete k.kaasepdub_data;
      }
    },uri,true);
    return uid;
  },
  imgPoster:function(poster, isbanner){
    if (!poster || !poster.formats){
      return null;
    }
    var type='poster';
    if (isbanner==2){
      type='thumbnail';
    }
    else if (isbanner){
      type='banner';
    }
    var base='/image/'+type+'/';
    var ext=(poster.formats.indexOf('webp')>-1)?'webp':'jpg';
    var slug=poster.hq?poster.hq:poster.sm;
    return base+slug+"."+ext;
  },
  recentParse:function(v){
    var rd=[];
    try{
      var j=JSON.parse(v);
      var t=j.result;
      var l=t.length;
      for (var i=0;i<l;i++){
        try{
          var d={};
          var u=t[i];
          if (!ratingSystem.checkRating(u.rating)){
            continue;
          }
          d.url=u.slug;
          d.title=u.title_en?u.title_en:u.title;
          d.title_jp=u.title;
          d.tip=u.slug;
          d.poster=kaas.imgPoster(u.poster,0);
          d.epavail=d.ep=u.episode_number?u.episode_number:'';
          d.type=u.type?u.type.toUpperCase():'';
          d.rating=u.rating;
          if (u.duration){
            d.duration=Math.floor(u.duration/60000)+'MIN';
          }
          if (ratingSystem.toRating(u.rating)>3 || ratingSystem.checkAdultTitle(u.title_en,u.title)){
            d.adult=true;
          }
          rd.push(d);
        }catch(e2){}
      }

    }catch(e){
      console.log("ERR kaas.recentParse: "+e);
    }
    return rd;
  },

  /* Scrapper */
  subtitle_origin:{
    "X-Org-Prox":"https://vidco.pro",
    "X-NoH-Proxy":"true"
  },
  streamGet:function(url, type, cb){
    var vidUrl=new URL(url);
    var vidMid=(type=='duckstream')?'mid':'id';
    var vidBird=((type=='catstream')||(type=='birdstream'))?true:false;
    var vidId=vidUrl.searchParams.get(vidMid);
    var vidLang=vidUrl.searchParams.get('ln');
    var vidHost=vidUrl.host;
    var vidPath=vidUrl.pathname;
    var vidKey=(type in kaas.stream_keys)?kaas.stream_keys[type]:kaas.stream_keys.vidstreaming;
    var vidOrder=(type in kaas.stream_sig_order)?kaas.stream_sig_order[type]:kaas.stream_sig_order.vidstreaming;
    var vidUag=navigator.userAgent;

    /* Load Source Data */
    function streamLoadSource(sourceUrl){
      $ap(sourceUrl,function(r){
        if (r.ok){
          var srcData=null;
          try{
            srcData=JSON.parse(r.responseText);
          }catch(e){
            srcData=null;
          }
          if (srcData){
            try{
              if ('manifest' in srcData){
                try{
                  console.log("DEC DATA: "+JSON.stringify(srcData));
                  cb(srcData);
                }catch(ee){
                  console.warn("Err streamGet cb: "+ee);
                }
                return;
              }
              else{
                var encData=srcData.data.split(':');
                var decData=_JSAPI.aesDec(
                  encData[0],
                  vidKey,
                  encData[1]
                );
                console.warn(JSON.stringify(["AESDEC",encData[0],
                vidKey,
                encData[1], decData]));
                var data=JSON.parse(decData);
                data.server_type=type;
                data.server_url=url;
                try{
                  cb(data);
                }catch(ee){
                  console.warn("Err streamGet cb: "+ee);
                }
                return;
              }
            }catch(e){}
          }
          else{
            try{
              var kk=$n('div','',0,0,r.responseText);
              var ast=kk.querySelector('astro-island[ssr]');
              if (ast){
                srcData=JSON.parse(ast.getAttribute('props'));
                console.log(srcData);
                if ('manifest' in srcData){
                  try{
                    try{
                      var subs=[];
                      for (var i=0;i<srcData.subtitles[1].length;i++){
                        var k=srcData.subtitles[1][i][1];
                        var psh={
                          "name":k.name[1],
                          "language":k.language[1],
                          "src":k.src[1]
                        };
                        if (psh.language=='en'){
                          subs.unshift(psh);
                        }
                        else{
                          subs.push(psh);
                        }
                      }
                      srcData.subtitles=subs;
                    }catch(ext){}
                    srcData.vttabs=true;
                    srcData.manifest=srcData.manifest[1];
                    srcData.isDash=true;
                    if (srcData.manifest.indexOf("http")!=0){
                      srcData.manifest="https:"+srcData.manifest;
                      srcData.isDash=false;
                    }
                    else{
                      srcData.manifest=srcData.manifest.replace('https:////','https://');
                    }
                    console.log("DEC DATA: "+JSON.stringify(srcData));
                    cb(srcData);
                  }catch(ee){
                    console.warn("Err streamGet cb: "+ee);
                  }
                  return;
                }
              }
            }catch(e){}
          }
        }
        cb(null);
      },
      {
        "X-Ref-Prox":url,
        "Accept":"application/json, text/plain, */*"
      });
    }

    /* Generate Source Url */
    function generateSourceUrl(playerConfig){
      var timeStamp = $time()+60;
      var cid=kaas.hex2a(playerConfig.cid).split('|');
      var route=cid[1].replace("player.php", "source.php");
      console.log("KAAS LOG: "+JSON.stringify(cid));
      var sigs=[];
      for (var i in vidOrder){
        var b=vidOrder[i];
        if (b=="IP") sigs.push(cid[0]);
        else if (b=="USERAGENT") sigs.push(vidUag);
        else if (b=="ROUTE") sigs.push(route);
        else if (b=="MID") sigs.push(vidId);
        else if (b=="TIMESTAMP") sigs.push(timeStamp);
        else if (b=="KEY") sigs.push(vidKey);
        else if (b=="SIG") sigs.push(playerConfig.config_params.signature);
      }
      var sig_plain=sigs.join('');
      var signature=_JSAPI.sha1sum(sig_plain);
      var sourceUrl=[
        'https://', vidHost, route, "?"+vidMid+"="+vidId,
        vidBird?'':'&e='+timeStamp,
        '&s='+signature
      ].join('');
      return sourceUrl;
    }

    console.log("KAAS LOAD TYPE: "+type+" => "+url);
    if (vidBird){
      try{
        var sourceUrl = url.replace("player.php", "source.php");
        console.log("KAAS BIRDSTREAM SOURCE URL: "+sourceUrl);
        streamLoadSource(sourceUrl);
      }catch(ee){}
    }
    else{
      /* Load Player HTML */
      $ap(url,function(r){
        if (r.ok){
          try{
            var d=$n('div','',0,0,r.responseText);
            var k=d.querySelector('#player + script').innerHTML.trim();
            var ku=k.substring(k.indexOf('=')+1).trim();
            var playerConfig=JSON.parse(eval("JSON.stringify("+ku+")"));
            var sourceUrl=generateSourceUrl(playerConfig);
            try{
              streamLoadSource(sourceUrl);
            }catch(ee){}
            return;
          }catch(e){
            console.warn(e);
          }
        }
        cb(null);
        return;
      },
      {
        "X-Ref-Prox":"https://www1.kickassanime.mx/"
      });
    }
  }
};

/******************* ANIMEKAI *************************/
if (__SDKAI){
  // AnimeKai Codex
  $ap('https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/utils/kai.js?'+$time(),function(r){
    if (r.ok){
      try{
        eval(r.responseText+"\n\nwindow.KAICODEX=KAICODEX;");
      }catch(e){}
    }
  });
}
const kai={
  sdns:'megaup.cc',
  dns:'animekai.to',
  req(u,cb,vdns){
    if (!vdns){
      vdns=__SD_DOMAIN?__SD_DOMAIN:kai.dns;
    }
    return $ap("https://"+vdns+u,cb,{
      "X-Org-Prox":"https://"+vdns+"/",
      "X-Ref-Prox":"https://"+vdns+"/",
      'X-Requested-With':'XMLHttpRequest',
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    });
  },
  caches:{
    ttip:{},
    eps:{}
  },
  getTooltip(id, cb, url, isview){
    var tipOut={
      tip:null,
      ep:null,
      more:null,
      n:0
    };
    if (!id && url){
      id=url;
    }
    var ttip_ttid=id;

    if (id in kai.caches.ttip){
      requestAnimationFrame(
        function(){
          cb(JSON.parse(kai.caches.ttip[id]));
        }
      );
      return;
    }
    function tipFinalize(){
      if (tipOut.n<3){
        return;
      }
      var o=tipOut.tip;
      o.ep=tipOut.ep.epnum;
      o.epdata=tipOut.ep; 
      o.more=tipOut.more;
      o.poster='';
      o.banner='';

      if (o.more){
        if (o.more.poster){
          o.poster=o.more.poster;
        }
        if (o.more.banner){
          o.banner=o.more.banner;
        }
        if (o.more.detail.duration){
          o.duration=o.more.detail.duration;
        }
        if (o.more.detail.genres){
          o.genre=o.more.detail.genres.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
          });
        }
        if (o.more.detail.status){
          o.status=o.more.detail.status.toUpperCase();
        }
        if (tipOut.more.anilistid){
          o.anilistId=tipOut.more.anilistid;
        }
        if (tipOut.more.malid){
          o.malId=tipOut.more.malid;
        }
      }

      console.log(o);
      kai.caches.ttip[id]=JSON.stringify(o);
      cb(o);
    }

    /* parse ttip */
    function tipParse(r){
      var o={
        title:'',
        title_jp:'',
        synopsis:'',
        genres:[],
        quality:null,
        ep:0,
        rating:'',
        ttid:''
      };
      var d=$n('div','',0,0,r);

      
      try{
        var did=d.querySelector('[data-id]').getAttribute('data-id');
        o.ttid=o.url=ttip_ttid;
        // o.ttid=

        var detailuri=d.querySelector('a.watch-btn').getAttribute('href');
        kai.req(detailuri,function(t){
          if (t.ok){
            var txs=t.responseText;
            try{
              var jsdt=JSON.parse(txs);
              if (jsdt && ('result' in jsdt)){
                txs=jsdt.result;
              }
            }catch(e){}
            var g=$n('div','',0,0,txs);
            // window._kaitip=g;
            tipOut.more={
              banner:'',
              poster:'',
              desc:'',
              detail:{}
            };
            try{
              tipOut.more.banner=g.querySelector('div.player-main div.player-bg').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
              tipOut.more.poster=g.querySelector('section div.poster-wrap div.poster img').src;
              tipOut.more.desc=g.querySelector('section div.main-entity div.desc').textContent.trim();

              try{
                tipOut.more.type=g.querySelector('section div.main-entity div.info span:last-child').textContent;
              }catch(e){}

              /* Get Anilist */
              try{
                var meta=g.querySelector('div#wrapper main div[data-meta]');
                try{
                  tipOut.more.anilistid = meta.getAttribute('data-al-id');
                }catch(ee){}
                try{
                  tipOut.more.malid = meta.getAttribute('data-mal-id');
                }catch(ee){}
              }catch(e){}

              var dtEl=g.querySelectorAll('section div.main-entity div.detail>div');
              tipOut.more.detail={};
              for (var i=0;i<dtEl.length;i++){
                var tx=dtEl[i].textContent.split(':');
                if (tx.length==2){
                  var key=tx[0].trim().toLowerCase();
                  var val=tx[1].trim().toLowerCase();
                  tipOut.more.detail[key]=val;
                }
              }
            }catch(e){}
            g.innerHTML='';
          }
          tipOut.n++;
          tipFinalize();
        });
      }
      catch(e){
        return 0;
      }
      var tt=d.querySelector('div.title');
      if (tt){
        o.title=tt.textContent.trim();
        o.title_jp=tt.getAttribute('data-jp');
      }
      try{
        o.synopsis=d.querySelector('div.desc').textContent.trim();
      }catch(e){}
      try{
        var gn=d.querySelectorAll('div.genre a');
        for (var i=0;i<gn.length;i++){
          var gd={
            name:gn[i].textContent.trim(),
            val:null
          };
          var gnr=gn[i].getAttribute('href').split('/');
          gd.val=gnr[gnr.length-1].trim();
          o.genres.push(gd);
        }
      }catch(e){}
      try{
        o.rating=d.querySelector('span.ttrating').textContent.trim();
      }catch(e){}
      tipOut.tip=o;

      tipOut.n++;
      tipFinalize();
      return 1;
    }

    /* parse episodes */
    function epParse(r){
      var d=$n('div','',0,0,r);
      var epEls=d.querySelectorAll('ul li a[token]');
      var epd={
        ep:[],
        epnum:0,
        epsub:0,
        epdub:0
      };
      for (var i=0;i<epEls.length;i++){
        var t=epEls[i];
        var p={};
        p.ep=(i+1)+"";
        p.token=t.getAttribute('token');
        var lg = toInt(t.getAttribute('langs'));
        if (lg&2==2){
          epd.epdub++;
          p.dub=true;
        }
        if (lg&1==1){
          epd.epsub++;
        }
        p.filler=t.classList.contains('filler');
        epd.epnum++;
        p.title="EP-"+p.ep;
        p.title_jp=p.title;
        var tt=t.querySelector('span');
        if (tt){
          var titen=tt.textContent.trim();
          var titjp=tt.getAttribute('data-jp').trim();
          if (titen){
            p.title=titen;
            p.title_jp=titen;
          }
          if (titjp){
            p.title_jp=titjp;
          }
        }
        epd.ep.push(p);
      }
      tipOut.ep=epd;
    }

    /* Load Tooltip */
    kai.req("/ajax/anime/tip?id="+enc(id),function(r){
      if (r.ok){
        var vd=JSON.parse(r.responseText);
        if ('result' in vd){
          if (tipParse(vd.result)){
            return;
          }
        }
      }
      tipOut.n+=2;
      tipFinalize();
    });

    /* Load Episodes Info */
    kai.req("/ajax/episodes/list?ani_id="+enc(id)+"&_="+KAICODEX.enc(id),function(r){
      if (r.ok){
        var vd=JSON.parse(r.responseText);
        if ('result' in vd){
          epParse(vd.result);
        }
      }
      tipOut.n++;
      tipFinalize();
    });
  },
  getView(url,f){
    var uid=++_API.viewid;
    var ux=url.split('#');
    var uri=ux[0];
    var ep=1;
    if (ux.length==2){
      ep=ux[1]?ux[1]:0;
    }
    function callCb(d){
      d.status=true;
      f(JSON.parse(JSON.stringify(d)),uid);
    }
    function failCb(){
      f({status:false},uid);
    }

    /* DATA FETCH */
    var dat ={
      tip:null,
      out:{}
    };

    function datacb(d){
      if (!d){
        failCb();
        return;
      }
      dat.tip=d;
      dat.out={
        "title": d.title,
        "title_jp": d.title_jp,
        "synopsis": (d.more&&d.more.desc)?d.more.desc:d.synopsis,
        "genres": d.genres,
        "quality": null,
        "banner": d.banner,
        "rating": "",
        "ttid": d.ttid,
        "url": d.url,
        "poster": d.poster,
        "rating":"",
        "status": false,
        "epavail": d.ep,
        "epdub": d.epdata.epdub,
        "type": "",
        "genre": d.genre?d.genre:'',
        "info": {
            "type": {
                "val": "_TV",
                "name": "TV"
            },
            "rating": "",
            "quality": null
        },
        "ep": [],
        "epactive":0,
        "epactivenum":ep,
        "servers":{dub:[],sub:[],softsub:[]},
        "streamtype":"sub",
        "stream_url":{}
      };

      if (d.anilistId){
        dat.out.anilistId=d.anilistId;
      }
      if (d.malId){
        dat.out.malId=d.malId;
      }

      /* fetch episode */
      for (var i=0;i<d.epdata.ep.length;i++){
        var pp=d.epdata.ep[i];
        var oe={
          "ep":pp.ep,
          "url":dat.out.url+"#"+pp.ep,
          "active":ep==pp.ep,
          "title":pp.title,
          "title_jp":pp.title_jp,
          "dub":pp.dub,
          "filler":pp.filler,
          "token":pp.token,
          "epuri":"/ajax/links/list?token="+enc(pp.token)+"&_="+KAICODEX.enc(pp.token)
        };
        if (oe.active){
          dat.out.epactive=i;
        }
        dat.out.ep.push(oe);
      }

      try{
        dat.out.ep[dat.out.epactive].active=true;
        dat.out.epactivenum = dat.out.ep[dat.out.epactive].ep;
      }catch(e){}

      console.log("KAI PROVIDER DATA:");
      console.log(dat.out);
      callCb(dat.out);
    }

    /* get tooltip data */
    kai.getTooltip(uri, datacb, uri, true);
    return uid;
  },
  loadVideo(dt,cb){
    var aEp=dt.ep[dt.epactive];
    if (!aEp){
      cb(null);
      return;
    }

    function serverOpen(eps){
      console.log("serverOpen");
      console.log(eps);

      dt.streamtype="sub";
      var is_soft=false;
      var streamObj=eps.sub;
      if (_API.currentStreamType==2){
        if (eps.dub.length>0){
          dt.streamtype="dub";
          streamObj=eps.dub;
        } 
      }
      else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
        is_soft=true;
      }
      if (is_soft && (_API.currentStreamType==1)){
        if (eps.softsub.length>0){
          dt.streamtype="softsub";
          streamObj=eps.softsub;
        }
      }

      dt.servers=JSON.parse(JSON.stringify(eps));
      dt.stream_url={};
      if (eps.softsub.length>0){
        dt.stream_url.soft="1";
      }
      if (eps.dub.length>0){
        dt.stream_url.dub="1";
      }
      if (eps.sub.length>0){
        dt.stream_url.hard="1";
      }

      var srcuri="";
      for (var i=0;i<streamObj.length;i++){
        var sc=streamObj[i];
        if ((pb.cfg_data.mirrorserver==i) || !srcuri){
          srcuri=sc.suri;
          dt.stream_provider=sc.n;
        }
      }

      /* Load Data */
      kai.req(srcuri,function(r){
        if (r.ok){
          try{
            var rs=JSON.parse(r.responseText);
            var sv=JSON.parse(KAICODEX.dec(rs.result));

            /* Init Skip Intro */
            dt.skip=[[0,0],[0,0]];
            if ('skip' in sv){
              if ('intro' in sv.skip){
                try{
                  dt.skip[0]=[sv.skip.intro[0],sv.skip.intro[1]];
                }catch(e){}
              }
              if ('outro' in sv.skip){
                try{
                  dt.skip[1]=[sv.skip.outro[0],sv.skip.outro[1]];
                }catch(e){}
              }
            }

            /* Fetch M3U8 */
            var megaId=sv.url.split('/');
            megaId=megaId[megaId.length-1];
            var megaUrl="/media/"+megaId;
            kai.req(megaUrl,function(r2){
              if (r2.ok){
                try{
                  var rs2=JSON.parse(r2.responseText);
                  var sv2=JSON.parse(KAICODEX.decMega(rs2.result));
                  cb(sv2);
                  return;
                }catch(e){}
              }
              cb(null);
            },kai.sdns);
            return;
          }catch(e){}
        }
        cb(null);
      });
    }

    if (aEp.token in kai.caches.eps){
      requestAnimationFrame(function(){
        serverOpen(kai.caches.eps[aEp.token]);
      });
      return;
    }

    function serverParse(r){
      console.log("serverParse");

      var d=$n('div','',0,0,r);
      // window._kaiep=d;

      var sList=[
        d.querySelectorAll('div[data-id="sub"] span.server'),
        d.querySelectorAll('div[data-id="softsub"] span.server'),
        d.querySelectorAll('div[data-id="dub"] span.server')
      ];
      var epServers=[
        [],[],[]
      ];

      for (var j=0;j<3;j++){
        var ls=sList[j];
        for (var i=0;i<ls.length;i++){
          var t=ls[i];
          var so={};
          so.lid=t.getAttribute('data-lid');
          so.n=t.textContent.trim();
          so.p=i;
          so.suri="/ajax/links/view?id="+enc(so.lid)+"&_="+KAICODEX.enc(so.lid);
          epServers[j].push(so);
        }
      }

      kai.caches.eps[aEp.token]={
        sub:epServers[0],
        softsub:epServers[1],
        dub:epServers[2]
      };

      d.innerHTML='';

      serverOpen(kai.caches.eps[aEp.token]);
    }

    kai.req(aEp.epuri,function(r){
      if (r.ok){
        var rs=null;
        try{ rs=JSON.parse(r.responseText); }catch(e){}
        if (r && ('result' in rs)){
          serverParse(rs.result);
          return;
        }
      }
      cb(null);
    });
  },
  /* PARSE HOME SLIDESHOW */
  parseHomeSlideshow:function(d){
    var r=d.querySelectorAll('main section div.swiper.featured div.swiper-slide');
    var g=[];
    for (var i=0;i<r.length;i++){
      try{
        var k=r[i];
        var h={};
        h.banner=k.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        h.synopsis=k.querySelector('p.desc').textContent.trim();
        var titEl=k.querySelector('p.title');
        h.title=titEl.textContent.trim();
        h.title_jp=titEl.getAttribute('data-jp');
        if (!h.title_jp) h.title_jp=h.title;
        h.url=h.tip=k.querySelector('div.swiper-ctrl div[data-id]').getAttribute('data-id');

        try{
          h.ep=k.querySelector('div.info span.sub').textContent;
        }catch(e){}

        try{
          h.type=k.querySelector('div.info span:nth-last-child(2)').textContent;
        }catch(e){}
        g.push(h);
      }catch(e2){}
    }
    return g;
  }
};




/* ANIWAVE & ANIX SOURCE */
// if (__SD<=2){
//   $ap('https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/utils/vrf.js?'+$time(),function(r){
//     if (r.ok){
//       try{
//         eval(r.responseText+"\n\nwindow.VRF=VRF;");
//       }catch(e){}
//     }
//   });
// }
const wave={
  ns:'https://'+__DNS,
  origin:{
    "X-Org-Prox":"https://"+__DNS+"/",
    "X-Ref-Prox":"https://"+__DNS+"/",
    'X-Requested-With':'XMLHttpRequest',
    'Pragma':'no-cache',
    'Cache-Control':'no-cache'
  },
  vrfEncrypt:function (t) {
    return VRF.vrfEncrypt(t);
  },
  vrfDecrypt:function(input){
    return VRF.vrfDecrypt(input);
  },

  /* PARSE HOME SLIDESHOW */
  parseHomeSlideshow:function(d){
    var r=d.querySelectorAll('.swiper-wrapper .swiper-slide.item');
    var g=[];
    for (var i=0;i<r.length;i++){
      try{
        var h={};
        var slide_url=r[i].querySelector('a.btn.play').getAttribute('href');
        h.banner=r[i].querySelector('.image div').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        h.synopsis=r[i].querySelector('.info .synopsis').textContent.trim();
        var t=d.querySelector('#top-anime .side [href="'+slide_url+'"].item');
        if (t){
          var tt=t.querySelector('div.d-title');
          h.title=tt.textContent.trim();
          h.title_jp=tt.getAttribute('data-jp');
          h.url=t.href;
          h.tip=t.querySelector('div.poster').getAttribute('data-tip');
          h.poster=$imgcdn(t.querySelector('img').src);
          h.adult=t.querySelector('div.adult')?true:false;
          try{
            h.ep=(t.querySelector('span.ep-status.sub').textContent+'').trim()
          }catch(e){}
          try{
            h.type=(t.querySelector('div.info .meta span.dot:not(.ep-wrap)').textContent+'').trim();
          }catch(e){}
          g.push(h);
        }
      }catch(e2){}
    }
    return g;
  },
  
  /* Get Episode View */
  view_cache:{},
  getView:function(url_with_hash, f, retuid){
    var uid=retuid?retuid:++_API.viewid;
    try { if (VRF){} }
    catch(e){
      console.log("No VRF Yet...");
      setTimeout(function(){
        wave.getView(url_with_hash,f,uid);
      },500);
      return uid;
    }
    var url_parse_hash=url_with_hash.split('#');
    var url=url_parse_hash[0];
    var hash_ep='';
    if (url_parse_hash[1]){
      hash_ep=url_parse_hash[1];
    }
    var url_parse=url.split('/');
    var animeId = url_parse[4];
    var epId = 1;
    if (url_parse[5]){
      epId=url_parse[5].substring(3);
    }

    // var root_view_url='https://'+__DNS+(__SD==1?'/watch/':'/anime/')+animeId;
    var root_view_url='https://'+__DNS+'/watch/'+animeId;
    var watch_url=root_view_url+'/ep-'+epId;
    console.log("WATCH URL : "+watch_url);

    console.log(
      "wave.getView - EPID: "+epId+" / url="+url+" / fullurl = "+url_with_hash+" / animeId = "+animeId+" / ROOTURL = "+root_view_url);
    var data=null;

    function cbErr(msg){
      console.warn(msg);
      f({status:false},uid);
    }

    function skipScore(s){
      var sc=(s[0][0]+s[0][1]>0)?1:0;
      sc+=(s[1][0]+s[1][1]>0)?1:0;
      return sc;
    }
    function callCb(d){
      if (!d.stream_url.hard){
        d.stream_url.hard=d.stream_url.soft;
        d.skip_vals.hard=d.skip_vals.soft;
      }
      d.stream_vurl = d.stream_url.hard;
      d.skip=d.skip_vals.hard;
      var cscore=skipScore(d.skip);
      d.streamtype="sub";
      var is_soft=false;
      if (_API.currentStreamType==2){
        if (d.stream_url.dub){
          d.stream_vurl = d.stream_url.dub;
          d.streamtype="dub";
          if (d.skip_vals.dub.length>0){
            if (cscore<skipScore(d.skip_vals.dub)){
              d.skip=d.skip_vals.dub;
            }
          }
        }
        else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
          is_soft=true;
        }
      }
      if (is_soft||_API.currentStreamType==1){
        if (d.stream_url.soft){
          d.stream_vurl = d.stream_url.soft;
          d.streamtype="softsub";
          if (d.skip_vals.soft.length>0){
            if (cscore<skipScore(d.skip_vals.soft)){
              d.skip=d.skip_vals.soft;
            }
          }
        }
      }
      f(JSON.parse(JSON.stringify(d)),uid);
    }

    function loadServer(){
      var slist_url=
        "/ajax/server/list/"+
        data.curr_ep+'?vrf='+enc(wave.vrfEncrypt(data.curr_ep));
      var num_servers=0;
      var loaded_servers=0;
      data.servers={
        'sub':[],
        'softsub':[],
        'dub':[]
      };
      function fetchServer(t,s){
        data.stream_url[t]='';
        data.skip_vals[t]=[];
        if (!s){
          return;
        }
        var dLink=s.getAttribute('data-link-id');
        var isFilemoon=s.isfilemoon?true:false;
        var svurl=
          "/ajax/server/"+
          dLink+'?vrf='+enc(wave.vrfEncrypt(dLink));
        $a(svurl,function(r){
          if (r.ok){
            try{
              var j=JSON.parse(r.responseText);
              var surl=wave.vrfDecrypt(j.result.url);
              if (isFilemoon){
                surl+="#FILEMOON";
              }
              var skdt=JSON.parse(wave.vrfDecrypt(j.result.skip_data));
              data.stream_url[t]=surl;
              data.skip_vals[t]=[
                skdt.intro,
                skdt.outro
              ];
            }catch(e){}
          }
          if (++loaded_servers>=num_servers){
            data.status=true;
            callCb(data);
          }
        },{
          'X-Requested-With':'XMLHttpRequest',
          "X-Ref-Prox":url
        });
      }
      function findServer(stid, d){
        var sid={
          main:null,
          mirror:null,
        };
        // data.servers
        var mp4upload=null;
        var load_s=null;

        var vnames=[
          'vidplay','megaf','mp4u','moonf'
        ];
        var vtitles=[
          'VidPlay','MegaF','Mp4Upload','Filemoon'
        ];
        if ('server_ids' in VRF){
          vnames=VRF.server_ids;
        }
        if ('server_titles' in VRF){
          vtitles=VRF.server_titles;
        }

        for (var i=0;i<d.length;i++){
          var s=d[i];
          var st=s.textContent.toLowerCase().trim();
          if (st==vnames[0]){
            sid.main=s;
            data.servers[stid].push(
              pb.serverobj(vtitles[0],0)
            );
            if (pb.server_selected(3)==0){
              load_s=s;
            }
          }
          else if (st==vnames[1]){
            sid.mirror=s;
            data.servers[stid].push(
              pb.serverobj(vtitles[1],1)
            );
            if (pb.server_selected(3)==1){
              load_s=s;
            }
          }
          else if (st==vnames[2]){
            if (!_ISELECTRON){
              mp4upload=s;
              data.servers[stid].push(
                pb.serverobj(vtitles[2],2)
              );
              if (pb.server_selected(3)==2){
                load_s=s;
              }
            }
          }
          else if (st==vnames[3]){
            s.isfilemoon=true;
            data.servers[stid].push(
              pb.serverobj(vtitles[3],3)
            );
            if (pb.server_selected(3)==3){
              load_s=s;
            }
          }
        }
        
        if (!load_s){
          if (sid.main==null && sid.mirror==null && mp4upload){
            sid.main=mp4upload;
          }
          else if (sid.mirror==null && mp4upload){
            sid.mirror=mp4upload;
          }
          else if (sid.main==null && mp4upload){
            sid.main=sid.mirror;
            sid.mirror=mp4upload;
          }
          if (pb.server_selected(3)==1){
            load_s=(sid.main)?sid.main:sid.mirror;
          }
          else{
            load_s=(sid.mirror)?sid.mirror:sid.main;
          }
        }
        if (load_s){
          num_servers++;
          return load_s;
        }
        return null;
      }
      $a(slist_url,function(r){
        if (r.ok){
          var query_el=(__SD==1)?'li':'div.server';
          try{
            var j=JSON.parse(r.responseText);
            var d=$n('div','',0,0,j.result);
            fetchServer('hard',findServer('sub',d.querySelectorAll('[data-type=sub] '+query_el)));
            fetchServer('soft',findServer('softsub',d.querySelectorAll('[data-type=softsub] '+query_el)));
            fetchServer('dub',findServer('dub',d.querySelectorAll('[data-type=dub] '+query_el)));
            d.innerHTML='';
            d='';
            return;
          }catch(e){}
        }
        cbErr('findServer');
      },{
        'X-Requested-With':'XMLHttpRequest',
        "X-Ref-Prox":url
      });
    }

    if (animeId in wave.view_cache){
      data=wave.view_cache[animeId];
      data.url=watch_url;
      var sold=data.ep[data.curr_ep_index];
      if (sold){
        sold.active=false;
      }
      for (var i=0;i<data.ep.length;i++){
        var s=data.ep[i];
        var g=false;
        if (hash_ep){
          if (hash_ep==s.ids) g=true;
        }else if (epId==s.datanum) g=true;
        if (g){
          s.active=true;
          data.curr_ep=s.ids;
          data.curr_ep_index=i;
          break;
        }
      }
      loadServer();
      return uid;
    }
    else{
      data={
        status:true,
        title:'',
        title_jp:'',
        synopsis:'',
        stream_url:{
            hard:'',
            soft:'',
            dub:''
        },
        skip_vals:{
          hard:[],
          soft:[],
          dub:[]
        },
        stream_vurl:'',
        poster:'',
        banner:null,
        "url":watch_url,
        skip:[],
        ep:[],
        related:[],
        genres:[],
        seasons:[],
        recs:[],
        info:{
            type:null,
            rating:null,
            quality:null
        },
        curr_ep:0,
        curr_ep_index:0,
        animeId:null
      };
    }

    function getEpisodes(){
      var eps_url="/ajax/episode/list/"+data.animeId+'?vrf='+enc(wave.vrfEncrypt(data.animeId));
      $a(eps_url,function(r){
        if (r.ok){
          try{
            var j=JSON.parse(r.responseText);
            var d=$n('div','',0,0,j.result);
            var ep=[];
            if (__SD==1){
              ep=d.querySelectorAll(".body li a");
            }
            else{
              ep=d.querySelectorAll("div.range-wrap a");
            }
            data.ep=[];
            for (var i=0;i<ep.length;i++){
              var a=ep[i];
              var s={};
              s.ids=a.getAttribute('data-ids');
              s.sub=toInt(a.getAttribute('data-sub'))?true:false;
              s.dub=toInt(a.getAttribute('data-dub'))?true:false;
              s.slug=a.getAttribute('data-slug');
              s.datanum=a.getAttribute('data-num');
              s.url=root_view_url+'/ep-'+s.slug+"#"+s.ids;
              var b=a.firstElementChild;
              if (b){
                s.ep=b.textContent;
                var span=b.nextElementSibling;
                s.title=span.textContent;
              }
              else{
                s.ep=a.textContent;
                s.title='';
              }

              if (epId==s.datanum){
              // if (a.classList.contains('active')){
                s.active=true;
                data.curr_ep=s.ids;
                data.curr_ep_index=i;
              }
              if (a.classList.contains('filler')){
                s.filler=true;
              }
              data.ep.push(s);
            }
            d.innerHTML='';
            d='';

            // Cache:
            wave.view_cache[animeId]=data;
            loadServer();
            return;
          }catch(e){
            console.warn("Error wave.getEpisodes "+e);
          }
        }
        cbErr('getEpisodes');
      },{'X-Requested-With':'XMLHttpRequest'});
    }
    function waveParse(d){
      try{
        var player=d.querySelector('#player');
        data.animeId=d.querySelector('#watch-main').getAttribute('data-id');
        try{
          data.banner=player.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        }catch(e){}
        data.poster=d.querySelector('#w-info img').src;
        var title=d.querySelector('#w-info h1')
        data.title=title.textContent;
        data.title_jp=title.getAttribute('data-jp');
        data.synopsis=d.querySelector('#w-info .info .synopsis .content').textContent;

        /* info */
        var info=d.querySelector('#w-info');
        if (info){
            /* get genres */
            var bmeta=info.getElementsByClassName('bmeta');
            if (bmeta[0]){
                try{
                    /* Find Genres */
                    var k=bmeta[0].firstElementChild.lastElementChild.getElementsByTagName('a');
                    for (var i=0;i<k.length;i++){
                        try{
                            var gn={};
                            gn.val=k[i].href.substring(k[i].href.lastIndexOf('/')+1);
                            gn.name=k[i].textContent.trim();
                            data.genres.push(gn);
                        }catch(ee){}
                    }
                }catch(e){}
                try{
                    /* Find Type */
                    var r=bmeta[0].firstElementChild.firstElementChild.getElementsByTagName('a');
                    if (r.length>0){
                        data.info.type={
                            val:r[0].getAttribute('href'),
                            name:r[0].textContent.trim()
                        };
                    }
                }catch(e){}
            }
            try{
                /* rating */
                data.info.rating=info.querySelectorAll("i.rating")[0].textContent;
            }catch(e){}
            try{
                /* quality */
                data.info.quality=info.querySelectorAll("i.quality")[0].textContent;
            }catch(e){}
        }

        /* get seasons */
        var ses=d.querySelector('#w-seasons');
        if (ses){
            var sa=ses.getElementsByTagName('a');
            data.seasons=[];
            for (var i=0;i<sa.length;i++){
                var sv={};
                sv.url=sa[i].href;
                sv.title=sa[i].textContent.trim();
                if (sa[i].parentNode.className.indexOf(' active')>0)
                    sv.active=true;
                try{
                    sv.poster=sa[i].style.backgroundImage.slice(4, -1).replace(/["']/g, "");
                }catch(e){}
                data.seasons.push(sv);
            }
        }

        /* get related */
        var rel=d.querySelector('#w-related');
        if (rel){
            var ri=rel.getElementsByTagName('a');
            for (var i=0;i<ri.length;i++){
                try{
                    var ra=ri[i];
                    var rd={};
                    rd.poster=ra.getElementsByTagName('img')[0].src;
                    rd.url=ra.href;
                    rd.title=ra.getElementsByClassName('d-title')[0].textContent.trim();
                    var dtip=ra.querySelector('[data-tip]');
                    if (dtip)
                       rd.tip=dtip.getAttribute('data-tip');
                    data.related.push(rd);
                }catch(e){}
            }
        }

        /* get recs */
        var ws=d.querySelector('#watch-second');
        if (ws){
            var wss=ws.querySelector('section.w-side-section');
            if (wss){
                var recs=wss.querySelectorAll('a.item');
                for (var i=0;i<recs.length;i++){
                    try{
                        var ra=recs[i];
                        var rd={};
                        rd.url=ra.href;
                        rd.poster=ra.querySelector('img').src;
                        rd.title=ra.querySelector('div.d-title').textContent.trim();
                        var dtip=ra.querySelector('[data-tip]');
                        if (dtip)
                           rd.tip=dtip.getAttribute('data-tip');
                        data.recs.push(rd);
                    }catch(e){}
                }
            }
        }

        getEpisodes();
        return true;
      }catch(e){
        console.warn("Error waveParse "+e);
      }
      return false;
    }

    function anixParse(d){
      try{
        data.animeId=d.querySelector('main div.watch-wrap').getAttribute('data-id');
        var ply=d.querySelector('#ani-player-section');
        try{
          data.banner=ply.querySelector('div.player-bg').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        }catch(e){}
        /* info */
        var info=d.querySelector('#ani-detail-info');
        if (info){
            var poster=info.querySelector('div.poster img');
            var title=info.querySelector('.maindata h1');
            var content=info.querySelector('.maindata .description .full.cts-block');
            if (poster){
              data.poster=poster.src;
            }
            if (title){
                data.title=(title.textContent+"").trim();
                data.title_jp=title.getAttribute('data-jp');
            }
            if (content){
              data.synopsis=(content.textContent+"").trim();
            }

            /* get genres */
            var bmeta=info.querySelector('.metadata');
            if (bmeta){
              var cmeta=bmeta.querySelectorAll('div.limiter div div');
              function findMeta(kw){
                for (var i=0;i<cmeta.length;i++){
                  if ((cmeta[i].textContent+"").trim().toLowerCase()==kw){
                    return cmeta[i].nextElementSibling;
                  }
                }
                return null;
              }

              var gnr=findMeta('genre:');
              if (gnr){
                try{
                  var k=gnr.querySelectorAll('a');
                  for (var i=0;i<k.length;i++){
                    try{
                      var gn={};
                      gn.val=k[i].href.substring(k[i].href.lastIndexOf('/')+1);
                      gn.name=k[i].textContent.trim();
                      data.genres.push(gn);
                    }catch(ee){}
                  }
                }catch(e){}
              }
              
              gnr=findMeta('type:');
              if (gnr){
                try{
                  var k=gnr.querySelector('a');
                  if (k){
                    data.info.type={
                      val:k.getAttribute('href'),
                      name:k.textContent.trim()
                    };
                  }
                }catch(e){}
              }
            }
            try{
                /* rating */
                data.info.rating=info.querySelector('.maindata .sub-info .rating').textContent;
            }catch(e){}

            try{
                /* quality */
                data.info.quality=info.querySelector('.maindata .sub-info .quality').textContent;
            }catch(e){}
        }

        /* get seasons */
        if (ply){
          data.seasons=[];
          var sa=ply.querySelectorAll('div.ani-season div.ani-season-body a');
          for (var i=0;i<sa.length;i++){
              var sv={};
              sv.url=sa[i].href;
              sv.title=(sa[i].textContent+'').trim();
              if (sa[i].classList.contains('active')){
                  sv.active=true;
              }
              try{
                  sv.poster=sa[i].querySelector('div.swiper-banner').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
              }catch(e){}
              data.seasons.push(sv);
          }
        }

        /* get related */
        var ri=d.querySelectorAll('section.sidebar-set.related div.sidebar-item a');
        for (var i=0;i<ri.length;i++){
            try{
                var ra=ri[i];
                var rd={};
                rd.poster=ra.querySelector('div.poster img').src;
                rd.url=ra.href;
                rd.title=(ra.querySelector('div.ani-detail div.ani-name').textContent+'').trim();
                rd.tip=ra.querySelector('div.poster').getAttribute('data-tip');
                data.related.push(rd);
            }catch(e){}
        }

        var ws=d.querySelectorAll('section.sidebar-set:not(.related) div.sidebar-item a');
        for (var i=0;i<ws.length;i++){
            try{
                var ra=ws[i];
                var rd={};
                rd.poster=ra.querySelector('div.poster img').src;
                rd.url=ra.href;
                rd.title=(ra.querySelector('div.ani-detail div.ani-name').textContent+'').trim();
                rd.tip=ra.querySelector('div.poster').getAttribute('data-tip');
                data.recs.push(rd);
            }catch(e){}
        }

        getEpisodes();
        return true;
      }catch(e){
        console.warn("Error anixParse "+e);
      }
      return false;
    }

    $a(watch_url,function(r){
      if (r.ok){
        try{
          var d=$n('div','',0,0,r.responseText);
          var isok=false;
          if (__SD==1){
            isok=waveParse(d);
          }
          else{
            isok=anixParse(d);
          }
          d.innerHTML='';
          d='';
          if (isok){
            return;
          }
        }catch(e){
          console.warn("ERR WatchURL = "+e);
        }
      }
      cbErr('getWatch : '+watch_url);
    },
    {
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    });

    return uid;
  },

  vidplayLastKeys:{
    tick:0,
    k:null
  },

  /* Streaming Video */
  vidplayKeys:function(cb){
    if (wave.vidplayLastKeys.tick>$time()){
      cb(JSON.parse(wave.vidplayLastKeys.k));
      return;
    }
    $ap("https://raw.githubusercontent.com/KillerDogeEmpire/vidplay-keys/keys/keys.json?"+$tick(),
    function(r){
      if (r.ok){
        try{
          var d=JSON.parse(r.responseText);
          try{
            wave.vidplayLastKeys.tick=$time()+3600;
            wave.vidplayLastKeys.k=r.responseText;
            cb(d);
          }catch(e){}
          return;
        }catch(e){}
      }
      cb(null);
    },{
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    });
  },
  vidplayFuToken:function(host,embedurl,cb){
    $ap("https://"+host+"/futoken?"+$tick(),
      function(r){
        if (r.ok){
          cb(r.responseText);
          return;
        }
        cb(null);
      },
      {
        "X-Org-Prox":"https://"+host+"/",
        "X-Ref-Prox":embedurl,
        'Pragma':'no-cache',
        'Cache-Control':'no-cache'
      });
  },
  vidEncode:function(videoID,k1,k2){
    var encoded=VRF.rc4(k1,videoID);
    encoded=VRF.rc4(k2,encoded);
    return VRF.safeBtoa(encoded);
  },
  vidplayGetMedia:function(u, cb){
    var vidLoc=u.substring(0,u.indexOf("?"));
    var vidSearch=u.substring(u.indexOf("?"));
    var vidHost=vidLoc.split('/')[2];
    var vidId=vidLoc.substring(vidLoc.lastIndexOf("/")+1);
    var vidDataId=null;
    var vidFutoken=null;
    function vidplayMediaCallback(){
      if (!vidDataId) return;
      if (!vidFutoken) return;
      try{
        var su=vidFutoken.substring(vidFutoken.indexOf('function(v)'));
        su="("+su.substring(0,su.indexOf('+location')).replace('jQuery.ajax','')+')})';
        var slug=eval(su+"('"+vidDataId+"')");
        var mediaUrl=
          'https://'+
          vidHost+
          '/'+
          slug+
          vidSearch;
        try{
          console.warn("MEDIA-URL:: "+mediaUrl);
          cb(mediaUrl);
        }catch(e){}
        return;
      }catch(e){}
      cb(null);
    }
    /* Request Keys */
    wave.vidplayKeys(function(k){
      if (k){
        // vidDataId=_JSAPI.vidEncode(vidId,k[0],k[1]);
        vidDataId=wave.vidEncode(vidId,k[0],k[1]);
        if (vidDataId){
          vidplayMediaCallback();
          return;
        }
      }
      cb(null);
    });
    /* Request Futoken */
    wave.vidplayFuToken(vidHost,u,function(r){
      if (r){
        vidFutoken=r;
        vidplayMediaCallback();
        return;
      }
      cb(null);
    });
  },
  mp4uploadGetData:function(u,cb){
    console.warn("MP4UPLOAD VID: "+u);
    $ap(u,function(r){
      if (r.ok){
        try{
          var player_data=null;
          eval("player_data="+r.responseText.split('player.src(',2)[1].split(');')[0]);
          if (player_data){
            console.warn(player_data);
            cb({
              result:{
                sources:[
                  {
                    file:player_data.src,
                    type:player_data.type
                  }
                ]
              }
            });
            return;
          }
        }catch(e){}
      }
      cb(null);
    });
  },
  filemoonGetData:function(u,cb){
    console.warn("FILEMOON VID: "+u);
    $ap(u,function(r){
      if (r.ok){
        try{
          var d=$n('div','',null,null,r.responseText);
          var src=d.querySelector('script:last-child').innerHTML;
          var vdat='';
          eval("vdat="+src.trim().substr(4));
          if (vdat){
            var uri=JSON.parse("["+vdat.split('{sources:[{file:')[1].split("}]")[0]+"]")[0];
            cb({
              result:{
                sources:[
                  {
                    file:uri+"#FILEMOON",
                    type:'hls'
                  }
                ]
              }
            });
          }
          d=null;
          return;
        }catch(e){}
      }
      cb({
        result:{
          sources:[
            {
              file:'ERROR',
              type:''
            }
          ]
        }
      });
    });
  },

  /* Vidstream data scrapper */
  vidstream:{
    keys:null,
    get:function(u,cb){
      var vidLoc=u.substring(0,u.indexOf("?"));
      var vidSearch=u.substring(u.indexOf("?"));
      var vidHost=vidLoc.split('/')[2];
      var vidId=vidLoc.substring(vidLoc.lastIndexOf("/")+1);
      var mediaUrl = VRF.vidstreamMakeUrl(vidHost,vidSearch,vidId);

      console.log("[VIDSTREAM] VideoID: "+vidId+" -> Mediainfo = "+mediaUrl);
      $ap(mediaUrl,function(r){
        if (r.ok){
          try{
            var d=JSON.parse(r.responseText);
            try{
              var de=VRF.vidstreamDecode(d.result);
              d.result=JSON.parse(de);
              cb(d);
              console.log("[VIDSTREAM] Got Mediainfo Data: "+JSON.stringify(d)+"");
              return;
            }catch(e){}
          }catch(e){}
        }
        cb(null);
      },
      {
        "X-Org-Prox":"https://"+vidHost+"/",
        "X-Ref-Prox":u,
        'X-Requested-With':'XMLHttpRequest',
        'Accept':'application/json, text/javascript, */*; q=0.01'
      }
      );
    }
  },

  vidplayGetData:function(u,cb){
    var vidHost=u.split('/')[2];
    if (vidHost.indexOf("mp4upload.com")>-1){
      wave.mp4uploadGetData(u,cb);
      return;
    }
    else if (u.indexOf("#FILEMOON")>0){
      wave.filemoonGetData(u,cb);
      return;
    }
    else{
      wave.vidstream.get(u,cb);
      return;
    }

    /* Old legacy Vidplay - todo: delete + cleanup old vidplay functions */
    wave.vidplayGetMedia(u,function(url){
      if (url){
        $ap(url,function(r){
          if (r.ok){
            try{
              var d=JSON.parse(r.responseText);
              try{
                cb(d);
              }catch(e){}
              return;
            }catch(e){}
          }
          cb(null);
        },
        {
          "X-Org-Prox":"https://"+vidHost+"/",
          "X-Ref-Prox":u,
          'X-Requested-With':'XMLHttpRequest',
          'Accept':'application/json, text/javascript, */*; q=0.01'
        }
        );
        return;
      }
      cb(null);
    });
  }
  
};


/* ajax request */
function $a(uri, cb, hdr, pd){
  var xhttp = new XMLHttpRequest();
  if (pd!==undefined){
    xhttp.args=pd;
  }
  xhttp.onload = function() {
    xhttp.ok=true;
    cb(xhttp);
  };
  xhttp.ontimeout =
  xhttp.onerror = function() {
      xhttp.ok=false;
      cb(xhttp);
  };
  
  /* Post Request */
  var ispost=false;
  var postdata='';
  try{
    if (hdr && hdr!==1){
      if ('post' in hdr){
        ispost=true;
        postdata=hdr.post+'';
        delete hdr.post;
      }
    }
  }catch(e){}

  xhttp.open(ispost?"POST":"GET", uri, true);
  if (hdr){
    if (hdr===1){
      if (__SD3){
        xhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
      }
    }
    else{
      for (var k in hdr){
        if (k!='post'){
          xhttp.setRequestHeader(k, hdr[k]);
        }
      }
    }
  }
  if (ispost){
    xhttp.send(postdata);
  }
  else{
    xhttp.send();
  }
  return xhttp;
}
function $scroll(el,val,isHoriz,duration){
  if (!_TOUCH){
    el[isHoriz?'scrollLeft':'scrollTop']=val;
    return;
  }
  if (duration && duration<0){
    if (el.__scroll_to){
      clearTimeout(el.__scroll_to);
      el.__scroll_to=null;
    }
    el[isHoriz?'scrollLeft':'scrollTop']=val;
    return;
  }
  var sid=el.__scroll_id=$tick();
  el.__scroll_duration = duration?duration:100;
  el.__scroll_end=$tick()+el.__scroll_duration;
  el.__scroll_duration = parseFloat(el.__scroll_duration);
  el.__scroll_start=(isHoriz?el.scrollLeft:el.scrollTop);
  el.__scroll_target=val;
  if (el.__scroll_to){
    clearTimeout(el.__scroll_to);
    el.__scroll_to=null;
  }
  function move(){
    if (sid!=el.__scroll_id){
      return;
    }
    var delta = (el.__scroll_end-$tick());
    if (delta>0){
      var t = 1.0 - (delta / el.__scroll_duration);
      var v = el.__scroll_start+((el.__scroll_target-el.__scroll_start) * t);
      if (v>0 || v<el[isHoriz?'scrollWidth':'scrollHeight']){
        requestAnimationFrame(function(){
          if (sid!=el.__scroll_id){
            return;
          }
          el[isHoriz?'scrollLeft':'scrollTop']=v;
          el.__scroll_to=setTimeout(move,8);
        });
        return;
      }
    }
    el[isHoriz?'scrollLeft':'scrollTop']=el.__scroll_target;
    return;
  }
  el.__scroll_to=setTimeout(move,2);
}

/* proxy ajax */
function $ap(uri, cb, hdr){
  return $a("/__proxy/"+uri,cb, hdr);
}

var __IMGCDNL=toInt(_JSAPI.storeGet("imgcdnl","1"));

/* proxy image */
function $imgnl(src, maxw){
  if (__IMGCDNL!=1 || src.indexOf("anilist.co") || __SD7 || __SD8){
    return src;
  }
  return 'https://wsrv.nl/?url='+encodeURIComponent(src)+'&w='+maxw+'&we';
}

/* proxy image */
function $img(src){
  /* kai image cache */
  // if ((src.indexOf('https://static.animekai.')==0) && (src.indexOf('https://wsrv.nl')==-1)){
  //   return 'https://wsrv.nl/?url='+encodeURIComponent(src)+'&w=256&we';
  // }

  if (src && __IMGCDNL==1){
    if (__SD6 && src.substring(0,1)=='/' && (src.indexOf("/poster/")>-1 || src.indexOf("/thumbnail/")>-1)){
      return $imgnl('https://'+__DNS+src, 256);
    }
    else if (
      src.indexOf("//img.flawlessfiles.com/")>-1||
      src.indexOf("//cdn.noitatnemucod.net/")>-1||
      src.indexOf("//img.zorores.com/")>-1){
      return $imgnl(src, 256);
    }
  }

  if (!src || ((src+'')=='undefined')){
    return '/__view/noimg.jpg';
  }
  // if (src.indexOf('/hqdefault.jpg')>0){
  //   src=src.replace('/hqdefault.jpg','/maxresdefault.jpg');
  // }
  return src;
}
function $aimg(cvi){
  if (cvi.large){
    return cvi.large;
  }
  return cvi.medium;
}

function $imgcdn(src){
  try{
    return src.replace('@100.jpg','.jpg');
  }catch(e){}
  return src;
}

function stripHtml(s){
  var d=$n('div','',null,null,s);
  s=d.textContent;
  d.innerHTML='';
  d=null;
  return s;
}

/* new element */
function $n(t,c,a,p,h){
  var l=document.createElement(t);
  if (a!=undefined&&a){
    for (var i in a)
      l.setAttribute(i,a[i]);
  }
  if (c!=undefined&&c) l.className=c;
  if (h!=undefined&&h) l.innerHTML=h;
  if (p!=undefined&&p) p.appendChild(l);
  return l;
}

/* htmlspecial */
function special(str){
  return (str+"").replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tspecial(str){
    return '<ttl>'+special(str)+'</ttl>';
}

function utfascii(nq){
  try{
    nq = nq.replace(/\u201C|\u201D|\u201e|\u2033/g, '"');
    nq = nq.replace(/\u2013|\u2014|\u2015/g, '-');
    nq = nq.replace(/\u2017/g, '_');
    nq = nq.replace(/\u201a/g, ',');
    nq = nq.replace(/\u2018|\u2019|\u201b|\u2032/g, "'");
  }catch(e){}
  return nq;
}

/* trim */
function trim(s){
  return (s+"").trim();
}
function ucfirst(string,lw) {
  if (lw){
    string=(string+'').toLowerCase();
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function slugString(Text,rp) {
  if (rp===undefined || rp===null){
    rp=' ';
  }
  return Text.toLowerCase()
    .replace(/[^\w]+/g, " ")
    .replace(/  /g, "  ")
    .replace(/  /g, " ")
    .replace(/  /g, " ")
    .replace(/  /g, " ").trim()
    .replace(/ /g, rp);
}

/* nl2br */
function nlbr(s) {
  return s.replace(/\n/g, "<br>");
}

/* url encode */
function enc(s){
  return encodeURIComponent(s);
}

/* time tick */
function $tick() {
  var dt = new Date();
  return dt.getTime();
}

function $time(){
  return Math.floor($tick()/1000);
}

/* make search query url from object */
function query(r){
  var v=[];
  for (var i in r){
    v.push(i+'='+enc(r[i]));
  }
  return v.join('&');
}

/* Parse Number */
function toInt(x) {
  var x = parseInt(x);
  return isNaN(x)?0:x;
}
function toFloat(x) {
  var x = parseFloat(x);
  return isNaN(x)?0:x;
}

/* absolute y position */
function absY(v){
  var rect = v.getBoundingClientRect();
  return rect.y+window.scrollY;
}

/* doublepad */
function pad2(v) {
  return ("00" + v).slice(-2);
}

/* seconds to timestamp */
function sec2ts(s,nohour){
  var s=Math.floor(s);
  var h=Math.floor(s/3600);
  s-=(h*3600);
  var m=Math.floor(s/60.0);
  s-=m*60;
  var o='';
  if (!nohour||h>0)
    o+=h+":";
  o+=pad2(m)+":"+pad2(s);
  return o;
}

function md2html(text,safe_code){
  return nlbr(special(text))
    .replace(/(?:\*\*)([^*<\n]+)(?:\*\*)/g, safe_code?"<b>$1</b>":"<strong>$1</strong>")
    .replace(/(?:__)([^_<\n]+)(?:__)/g, "<u>$1</u>")
    .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<i>$1</i>")
    .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:`)([^`<\n]+)(?:`)/g, safe_code?"<b>$1</b>":"<t>$1</t>")
}

/**************************** ANIMEFLIX ***************************/
const __AFLIX = {
  ns:'https://'+_JSAPI.flix_dns(),
  cache:{},
  req_cache:{},
  slug_cache:{},
  req:function(u,cb,shouldJson,nocache){
    var cache_name=slugString(u,'_');
    if (!nocache){
      if (cache_name in __AFLIX.req_cache){
        if (__AFLIX.req_cache[cache_name].exp>$time()){
          setTimeout(function(){
            cb(JSON.parse(JSON.stringify(__AFLIX.req_cache[cache_name])));
          },5);
          return;
        }
      }
    }
    $ap(__AFLIX.ns+u,function(r){
      if (r.ok){
        r.contentType=r.getResponseHeader('content-type');
        if (shouldJson && r.contentType!='application/json'){
          r.ok=false;
        }
      }
      if (r.ok){
        __AFLIX.req_cache[cache_name]=JSON.parse(JSON.stringify({
          responseText:r.responseText,
          contentType:r.contentType,
          ok:true,
          exp:$time()+240
        }));
      }
      else{
        delete __AFLIX.req_cache[cache_name];
        if (shouldJson){
          if (--shouldJson>0){
            // Retry
            setTimeout(function(){
              __AFLIX.req(u,cb,shouldJson);
            },10);
            return;
          }
        }
      }
      cb(r);
    },__AFLIX.origin);
  },
  setCache:function(u){
    try{
      __AFLIX.cache[u.anilistID]=JSON.stringify(u);
      __AFLIX.slug_cache[u.slug]=u.anilistID;
    }catch(e){};
  },
  setUrl:function(slug,alid){
    return slug+"/"+alid;
  },
  getUrl:function(url){
    return url.split("#")[0];
  },
  getEp:function(url){
    var p=url.split("#");
    return (p[1]?p[1]:1);
  },
  getSlug:function(url){
    return __AFLIX.getUrl(url).split("/")[0];
  },
  getAid:function(url){
    return __AFLIX.getUrl(url).split("/")[1];
  },
  getTitle:function(u,jp){
    if (jp){
      if (u.title.romaji)
        return u.title.romaji;
    }
    else{
      if (u.title.english)
        return u.title.english;
    }
    if (u.userPreferred)
        return u.userPreferred;
    if (u.title.english)
        return u.title.english;
    if (u.title.romaji)
        return u.title.romaji;
    return 'No-title';
  },
  dec:function(x){
    var l=x.length,o=[],i;
    for (i=0;i<l;i+=2){
        o.push(String.fromCharCode(parseInt(x.substring(i,i+2), 20)));
    }
    return o.join('');
  },
  enc:function(x){
      var l=x.length,o=[],i;
      for (i=0;i<l;i++){
          o.push(x.charCodeAt(i).toString(20));
      }
      return o.join('');
  },
  enc_kk:["getUTCDate", "getUTCMonth", "0", "padStart", "floor", "charCodeAt", "", "reduce", "split"],
  enc2:function(e) {
      var kk=__AFLIX.enc_kk;
      var t = new Date
        , n = 17 + (t[kk[0]]() - t[kk[1]]()) / 2;
      return e[kk[8]](kk[6])[kk[7]](((e,t)=>e + t[kk[5]](0).toString(Math[kk[4]](n))[kk[3]](2, kk[2])), kk[6])
  }
};
__AFLIX.origin={
  "X-Org-Prox":__AFLIX.ns,
  "X-Ref-Prox":"https://"+__DNS+"/",
  'X-Requested-With':'XMLHttpRequest',
  'Pragma':'no-cache',
  'Cache-Control':'no-cache'
};
__AFLIX.origin_dev={
  "X-Org-Prox":__AFLIX.ns,
  "X-Ref-Prox":__AFLIX.ns
};
/**************************** GLOBAL LISTENERS ***************************/
/* Key event handler */
window._KEYEV=function(key, evSource){
  if (!evSource) evSource=0;
  _API.last_key_source=evSource;
  if (_API.keycb){
    if (_API.keycb(key)){ 
      return true;
    }
  }
  return false;
};

/**** NON KEY GESTURES ******/
(function(){
  if (!_USE_TOUCH){
    window.addEventListener("wheel", event => {
      if (!_TOUCH){
        if (event.deltaY <= -80)
        {
          _KEYEV(KUP);
        }
        else if (event.deltaY >= 80)
        {
          _KEYEV(KDOWN);
        }
      }
    });
  }
})();
/**** NON KEY GESTURES ******/

/* JS default key event listener */
document.addEventListener('keydown', function(e) { 
  var key = e.keyCode || e.which;
  if (window._KEYEV(key)){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  return true;
});

/* Window message listener */
window.addEventListener('message',function(e) {
  if (_API.messagecb)
  _API.messagecb(e);
});

/* JSAPI getview callback handler */
// window.__GETVIEWCB=function(d,u){
//   if(_API.viewcb)
//     _API.viewcb(d,u);
// };

window.__M3U8CB=function(d){
  window.__MDATA=(d);
  if(_API.m3u8cb)
    _API.m3u8cb(d);
};
window.__VIDPAGELOADCB=function(d){
  if(_API.vidpageload)
    _API.vidpageload(d);
};
window.__VOICESEARCH=function(d){
  if(_API.voicesearchcb)
    _API.voicesearchcb(d);
};

/* mp4upload url callback */
// window.__MP4CB=function(d){
//   if(_API.mp4cb) 
//   _API.mp4cb(d);
// };

/* Key codes */
const KUP=38;
const KDOWN=40;
const KLEFT=37;
const KRIGHT=39;
const KBACK=27;
const KENTER=13;
const KENTER_UP=1013;
const KPGUP=33;
const KPGDOWN=34;
const KPLAY=402;
const KNEXT=403;
const KPREV=401;
const KMENU=93;

/* sound click */
function __clk_init(){
  return (function(){
    var ___lclk=0;
    return function(){
      if (pb.cfg_data.clksound && ___lclk<$tick()){
        ___lclk=$tick()+100;
        _JSAPI.playClick();
      }
    };
  })();
}
var clk=__clk_init();

/***************************** API HANDLERS *****************************/
const _API={
  electronInitFullscreen:function(){
    if (!_ISELECTRON){
      return;
    }
    _API.fullscreenEl=$n('c','electron-fullscreen',null,$('animetv'),'');
    /* set kiosk */
    if (_JSAPI.varGet("kiosk","0")){
      _API.fullscreenEl.style.display='none';
    }
    else{
      _API.fullscreenEl.onclick=function(){
        _JSAPI.toggleFullscreen();
      };
    }
    _API.fullscreenCb(_JSAPI.getFullscreen());
  },
  fullscreenCb:function(s){
    _API.fullscreenEl.innerHTML=s?'fullscreen_exit':'fullscreen';
    _API.fullscreenEl.setAttribute('title',s?'Exit Fullscreen':'Fullscreen');
  },

  videoInitCbInitialized:false,
  videoSrcValue:'',
  videoElectronPos:{},
  videoElectronVars:{
    resolution:0
  },
  videoInitCb:function(){
    if (_API.videoInitCbInitialized){
      return;
    }
    _API.videoInitCbInitialized=true;
    window.addEventListener('message',function(e) {
      if (_API.videoSrcValue && e){
        try{
          var pd=JSON.parse(e.data);
          if (pd){
            if ('vcmd' in pd){
              if (pd.vcmd=='mediainfo'){
                // _API.showToast("Got MediaInfo Event 2");
                window.__M3U8CB(pd.val);
                return;
              }
              if (pd.vcmd!='time'){
                console.log("PLAYER-MSG = "+e.data);
              }
              if (pd.vcmd=='time'){
                _API.videoElectronPos=pd.val;
              }
              else if (pd.vcmd=='initializing'){
                _API.videoPost('quality',pb.cfg_data.quality);
                _API.videoPost('audiolang',pb.cfg_data.alang);
                return;
              }
              else if (pd.vcmd=='ready'){
                _API.videoPost('quality',pb.cfg_data.quality);
                _API.videoPost('audiolang',pb.cfg_data.alang);
              }
              else if (pd.vcmd=='resolution'){
                try{
                  _API.videoElectronVars.resolution=pd.val.split(",");
                  __VIDRESCB(_API.videoElectronVars.resolution[0],_API.videoElectronVars.resolution[1]);
                  console.warn("GOT RESOLUTION: "+pd.val);
                }catch(e){}
              }
              else if (pd.vcmd=='langavail'){
                window.__VIDLANGAVAIL(pd.val);
              }
              pb.vid_event(pd.vcmd,pd.val);
            }
          }
        }catch(x){
          console.error(x);
        }
      }
    });
  },
  videoPost:function(c,v){
    if (html5video()){
      console.log("PLAYER-POST = "+c+" -> "+v);
      try{
        if (c=='seek'){
          _API.videoElectronPos.position=v;
        }
        else if (c=='quality'){
          __VIDRESW=0;
          __VIDRESH=0;
        }
      }catch(e){};
      if (pb.vid){
        try{
          pb.vid.contentWindow.postMessage(JSON.stringify({
            vcmd:c,
            val:v
          }),'*');
        }catch(e){};
      }
    }
  },
  videoSetUrl:function(src_ori){
    var src=src_ori;
    if (src_ori){
      if (pb.cfg_data && pb.cfg_data.hlsproxy){
        if (
          !__SD7 && !__SD8 && !__SDKAI &&
          (src_ori.indexOf("#dash")==-1)
          && (src_ori.indexOf("megaup.cc")==-1)
          && (src_ori.indexOf("prxy.miruro.to")==-1)
          && (src_ori.indexOf("mp4upload.com")==-1)
          && (src_ori.indexOf("netmagcdn.com")==-1)
          && (src_ori.indexOf("vidco.pro")==-1)
          && (src_ori.indexOf("#FILEMOON")==-1)){
          // src='https://prxy.miruro.to/m3u8?url='+encodeURIComponent(src_ori);
          src='https://m3u8.justchill.workers.dev/?url='+encodeURIComponent(src_ori);
        }
        console.warn("VIDEO_SET_URL = "+src);
      }
    }
    _video_is_dash=(src_ori.indexOf("#dash")>0);
    pb.pb_vid.innerHTML="";
    if (html5video()){
      if (!_ISELECTRON){
        try{
          _JSAPI.videoSetUrl("");
        }catch(e){}
      }
      console.warn("ELECTRON VIDEO SRC = "+src);
      try{
        if (pb && 'pb_vid' in pb){
          _API.videoSrcValue=src;
          if (src){
            _API.videoInitCb();
            pb.vid=$n('iframe','',{src:'/__view/ui/player.html?'+src,frameborder:'0'},pb.pb_vid,'');
          }
          else{
            pb.pb_vid.innerHTML='';
            pb.vid=null;
          }
        }
      }catch(e){}
    }else{
      _JSAPI.videoSetUrl(src);
    }
  },

  /* USER-MANAGEMENT */
  user:'', /* current user prefix _API.user */
  user_prefix:'', /* current localStorage user prefix _API.user_prefix */
  
  html_class:'',

  wallpaper_base:'https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/wallpaper/',
  wallpaper_data:[],
  wallpaper_list:function(cb){
    if (_API.wallpaper_data.length>0){
      cb(_API.wallpaper_data.length);
      return;
    }
    $ap(_API.wallpaper_base+'wallpaper.json',function(v){
      if (v.ok){
        try{
          var wd=JSON.parse(v.responseText);
          if (wd.length>0){
            _API.wallpaper_data=JSON.parse(v.responseText);
          }
        }catch(e){}
      }
      cb(_API.wallpaper_data.length);
    });
  },

  rplustxt:"R+",

  ppic_base:'https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/ppic/',
  ppic_data:[],
  ppic_list:function(cb){
    if (_API.ppic_data.length>0){
      cb(_API.ppic_data.length);
      return;
    }
    $ap(_API.ppic_base+'ppic.json',function(v){
      if (v.ok){
        try{
          var wd=JSON.parse(v.responseText);
          if (wd.length>0){
            _API.ppic_data=JSON.parse(v.responseText);
          }
        }catch(e){}
      }
      cb(_API.ppic_data.length);
    });
  },

  /*** THEMES ***/
  theme_list:[
    'theme_purple',
    'theme_blue',
    'theme_teal',
    'theme_green',
    'theme_brown',
    'theme_red',
    'theme_grey',
    'theme_dark'
  ],
  theme_sel:0,
  theme_update:function(){
    var itm=_JSAPI.storeGet(_API.user_prefix+"theme","theme_dark");
    if (itm){
      document.documentElement.className=itm+' '+_API.html_class;
      _API.theme_sel=_API.theme_list.indexOf(itm);
      if (_API.theme_sel<0) _API.theme_sel=0;
    }
    else{
      document.documentElement.className=_API.html_class;
    }
  },

  bgimg_update:function(){
    if (pb.cfg_data.bgimg.src){
      var main_url = _API.wallpaper_base+pb.cfg_data.bgimg.src;
      if (pb.cfg_data.bgimg.src.startsWith("https://")){
        main_url=pb.cfg_data.bgimg.src;
      }
      $('animebg').style.backgroundImage='url('+$imgnl(main_url, screen.width>screen.height?screen.width:screen.height)+')';
      $('animebg').className='';
    }
    else{
      $('animebg').style.backgroundImage='';
      $('animebg').className='bg0';
    }
  },

  asyncPrompCb:function(n,v){
    var cbn="cb_"+n;
    if (cbn in _API.asyncPrompCbs){
      _API.asyncPrompCbs[cbn](v);
      delete _API.asyncPrompCbs[cbn];
    }
  },
  asyncPrompCbs:{},
  asyncPrompCbn:0,

  listPrompt:function(title,list,sel,allowsel,nodim,selpos, cb){
    var d={
      'type':'list',
      'title':title,
      'list':list
    };
    if (sel!=undefined){
      if (Array.isArray(sel)){
        d.multi=sel;
      }
      else{
        d.sel=sel;
      }
    }
    if (allowsel){
      d.allowsel=true;
    }
    if (nodim){
      d.nodim=true;
    }
    if (selpos!=undefined){
      d.selpos=selpos;
    }

    if (cb){
      var cb_n = ++_API.asyncPrompCbn;
      _API.asyncPrompCbs["cb_"+cb_n]=cb;
      _JSAPI.asyncPrompt(JSON.stringify(d),cb_n);
      return;
    }
    return prompt(JSON.stringify(d));
  },

  textPrompt:function(title,message,ispin,maxlen,dv,cb,nohtml){
    if (_ISELECTRON){
      listOrder.showInput(title,message,ispin,maxlen,dv,cb,nohtml);
      return;
    }
    var d={
      'type':'text',
      'title':title,
      'message':message
    };
    if (!nohtml){
      d.html=true;
    }
    if (ispin){
      d.ispin=true;
    }
    if (maxlen){
      d.maxlen=maxlen;
    }
    if (dv){
      d.deval=dv;
    }
    if (!cb){
      var o=prompt(JSON.stringify(d));
      try{
        var k=JSON.parse(o);
        if ('value' in k){
          return k.value;
        }
      }catch(e){}
      return null;
    }
    var cb_n = ++_API.asyncPrompCbn;
    _API.asyncPrompCbs["cb_"+cb_n]=cb;
    _JSAPI.asyncPrompt(JSON.stringify(d),cb_n);
  },

  confirm:function(title,text,cb){
    listOrder.showConfirm(title,text,cb);
  },
  alert:function(title,text,cb){
    listOrder.showConfirm(title,text,cb,true);
  },

  confirmDialog:function(title,text,ishtml){
    var d={
      "title":title,
      "message":text
    };
    if (ishtml){
      d.html=true;
    }
    return confirm(JSON.stringify(d));
  },

  animeId:function(url){
    if (__SD3){
      var ux=url.split('/');
      if (ux.length>1){
        var url_parse=ux[1].split('#');
        return url_parse[0];
      }
    }
    else if (__SD5){
      return url;
    }
    else if (__SDKAI){
      return url;
    }
    else if (__SD6){
      return kaas.getAnimeId(url);
    }
    else if (__SD7){
      return gojo.getAnimeId(url);
    }
    else if (__SD8){
      return miruro.getAnimeId(url);
    }
    else{
      var url_parse=url.split('/');
      if (url_parse.length>=5){
        return url_parse[4];
      }
    }
    return null;
  },

  /*** GENRES ***/
  genres:{
    "_tv":"tv","_movie":"movie",
    "_ova":"ova","_ona":"ona",
    "_special":"special",

    // "action":"1","adventure":"2","avant_garde":"2262888",
    // "comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9",
    // "gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552",
    // "josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18",
    // "mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25",
    // "reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31",
    // "shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38",
    // "supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"

    // ANIMEKAI:
    "action":"47","adventure":"1","avant_garde":"235","boys_love":"184","comedy":"7","demons":"127",
    "drama":"66","ecchi":"8","fantasy":"34","girls_love":"926","gourmet":"436","harem":"196","horror":"421",
    "isekai":"77","iyashikei":"225","josei":"555","kids":"35","magic":"78","mahou_shoujo":"857","martial_arts":"92",
    "mecha":"219","military":"134","music":"27","mystery":"48","parody":"356","psychological":"240","reverse_harem":"798",
    "romance":"145","school":"9","sci_fi":"36","seinen":"189","shoujo":"183","shounen":"37","slice_of_life":"125",
    "space":"220","sports":"10","super_power":"350","supernatural":"49","suspense":"322","thriller":"241","vampire":"126"
  },

  genres_hi:{
    "_tv":"2","_movie":"1",
    "_ova":"3","_ona":"4",
    "_special":"5",
    "_music":"6",

    // "TV","MOVIE","OVA","ONA","SPECIAL"

    "action":"1","adventure":"2","cars":"3","comedy":"4","dementia":"5","demons":"6","drama":"8",
    "ecchi":"9","fantasy":"10","game":"11","harem":"35","historical":"13","horror":"14","isekai":"44",
    "josei":"43","kids":"15","magic":"16","martial_arts":"17","mecha":"18","military":"38","music":"19",
    "mystery":"7","parody":"20","police":"39","psychological":"40","romance":"22","samurai":"21","school":"23",
    "sci-fi":"24","seinen":"42","shoujo":"25","shoujo_ai":"26","shounen":"27","shounen_ai":"28","slice_of_life":"36",
    "space":"29","sports":"30","super_power":"31","supernatural":"37","thriller":"41","vampire":"32"
  },

  genres_flix:{
    "_tv":"TV","_movie":"MOVIE",
    "_ova":"OVA","_ona":"ONA",
    "_special":"SPECIAL",

    "action":"Action","adventure":"Adventure","comedy":"Comedy","drama":"Drama","ecchi":"Ecchi","fantasy":"Fantasy",
    "horror":"Horror","mecha":"Mecha","mystery":"Mystery","psychological":"Psychological","romance":"Romance",
    "sci_fi":"Sci-Fi","sports":"Sports","supernatural":"Supernatural","thriller":"Thriller"
  },

  filterorigin:function(){
    if (__SD5)
      return __AFLIX.origin;
    else if (__SD6)
      return kaas.getFilterOrigin();
    else if (__SD7)
      return gojo.getFilterOrigin();
    else if (__SD8)
      return miruro.getFilterOrigin();
    return null;
  },

  filterurl:function(q,genres,sort,page,ses,year){
    /*
      sort: 1.Relevant, 2.RecentUpdate
    */
    var uri='';
    if (__SD6){
      return kaas.getFilterUrl(q,genres,sort,page,ses,year);
    }
    else if (__SD7){
      return gojo.getFilterUrl(q,genres,sort,page,ses,year);
    }
    else if (__SD8){
      return miruro.getFilterUrl(q,genres,sort,page,ses,year);
    }
    else if (!__SD3 && !__SD5){
      var qv=[];
      
      qv.push('keyword='+enc(q));
      // Wave & Anix
      if (ses){
        qv.push('season='+enc(ses));
      }
      if (year){
        qv.push('year='+enc(year));
      }

      if (!ses){
        if (genres){
          for (var i=0;i<genres.length;i++){
            var vl=genres[i];
            if (vl.charAt(0)=='_'){
              qv.push(enc('type[]')+'='+enc(_API.genres[vl]));
            }
            else{
              qv.push(enc('genre[]')+'='+enc(_API.genres[vl]));
            }
          }
          qv.push('genre_mode=and');
        }
        qv.push(enc('language[]')+'=sub');
      }
      if (sort==1){
        qv.push('sort=most_relevance');
      }
      else if (sort==2){
        qv.push('sort=recently_updated');
      }

      if (page&&(page>1)){
        qv.push('page='+page);
      }
      uri='/browser?'+qv.join('&');
      console.log('FILTER: '+uri);
    }
    else if (__SD5){
      // ANIME FLIX
      var filters={};
      var qv=[];
      q=(q+'').toLowerCase();
      qv.push('query='+enc(q));
      if (genres){
        var gnr=[];
        var tps=[];
        for (var i=0;i<genres.length;i++){
          var vl=genres[i];
          if (vl.charAt(0)=='_'){
            tps.push(_API.genres_flix[vl]);
          }
          else{
            gnr.push(_API.genres_flix[vl]);
          }
        }
        if (tps.length>0){
          filters.type=tps;
        }
        if (gnr.length>0){
          filters.genre=gnr;
        }
      }
      var ksalt=q;
      if (q.length>3){
        ksalt=q.substring(0,3);
      }
      qv.push('limit=15');
      qv.push('filters='+enc(JSON.stringify(filters)));
      qv.push('k='+enc(__AFLIX.enc2(ksalt)));

      if (!q){
        uri='';
        if (filters.genre.length>0){
          uri='/__proxy/'+__AFLIX.ns+'/genres/'+(filters.genre[filters.genre.length-1])+'?page='+(page>1?page-1:0);
        }
      }
      else{
        uri='/__proxy/'+__AFLIX.ns+'/info/?'+qv.join('&');
      }
      console.log('FILTER: '+uri);
    }
    else{
      // HIANIME
      var qv=[];
      if (q){
        q=q.substring(0,100).trim();
      }
      qv.push('keyword='+enc(q?q:' '));
      console.log("FILTER URL REQ : "+JSON.stringify([q,genres,sort,page,ses,year]));
      if (!ses){
        if (genres){
          var tgenre=[];
          for (var i=0;i<genres.length;i++){
            var vl=genres[i];
            if (vl.charAt(0)=='_'){
              qv.push(enc('type')+'='+enc(_API.genres_hi[vl]));
            }
            else{
              tgenre.push(_API.genres_hi[vl]);
            }
          }
          if (tgenre.length>0){
            qv.push(enc('genres')+'='+enc(tgenre.join(',')));
          }
        }
        qv.push('language=1');
      }
      if (sort==1){
        qv.push('sort=default');
      }
      else if (sort==2){
        qv.push('sort=recently_updated');
      }
      else if (sort==2){
        qv.push('sort=default');
      }

      if (page&&(page>1)){
        qv.push('page='+page);
      }
      uri='/search?'+qv.join('&');
      console.log('FILTER: '+uri);
    }

    return uri;
  },

  videoAudioTrack:function(id, update){
    if (html5video()){
      _API.videoPost('audiolang',id);
    }
    else if ('videoAudioTrack' in _JSAPI){
      _JSAPI.videoAudioTrack(id, update?true:false);
    }
  },

  videoTrackQuality:function(id, update){
    if ('videoTrackQuality' in _JSAPI){
      _JSAPI.videoTrackQuality(id, update?true:false);
    }
  },

  

  /*** AUDIO LANGUAGES ***/
  audiolang:[
    ["Original",""],
    ["English","eng"],
    ["French","fre"],
    ["German","ger"],
    ["Hindi","hin"],
    ["Indonesian","ind"],
    ["Italian","ita"],
    ["Portuguese (Brazil)","por"],
    ["Spanish","spa"],
    ["Tamil","tam"],
    ["Telugu","tel"]
  ],
  audiolang_titles:function(withavail){
    var avl=__VIDLANGS.split(',');
    var olang=[];
    for (var i=0;i<_API.audiolang.length;i++){
      var txp=_API.audiolang[i][0];
      var tx=special(txp);
      if (withavail){
        if (!txp){
          txp='';
        }
        else{
          txp=txp.toLowerCase().substring(0,3);
        }
        if (i==0 || avl.indexOf(txp)>-1){
          tx+='<span class="alangavail"><c>check</c> Available</span>';
        }
      }
      olang.push(tx);
    }
    return olang;
  },
  audiolang_getindex:function(id){
    if (!id){
      return 0;
    }
    for (var i=0;i<_API.audiolang.length;i++){
      if (_API.audiolang[i][1]==id){
        return i;
      }
    }
    return 0;
  },
  audiolang_getname:function(id){
    return _API.audiolang[_API.audiolang_getindex(id)][0];
  },

  /*** TRANSLATE LANGUAGES ***/
  tlangs:[
    ["Hardsub","hard"],
    // ["Dub","dub"],
    ["Disable Subtitle","nosub"],
    ["English","en"],
    /* sources */
    ["Arabic","ar"],["German","de"], ["French","fr"], ["Italian","it"], 
    ["Brazilian","pt"], ["Portuguese","pt-PT"], ["Russian","ru"], ["Spanish","es"],
    /* translates - start=11 */
    ["Indonesian","id"],
    ["Chinese (Simplified)","zh-CN"],["Chinese (Traditional)","zh-TW"],
    ["Danish","da"], ["Dutch","nl"], ["Filipino","tl"],["Finnish","fi"],
    ["Greek","el"],["Hindi","hi"],["Japanese","ja"],
    ["Korean","ko"],["Latin","la"],["Malay","ms"],
    ["Thai","th"],["Vietnamese","vi"],
    ["Afrikaans","af"],["Albanian","sq"],["Amharic","am"],["Armenian","hy"],["Assamese","as"],
    ["Aymara","ay"],["Azerbaijani","az"],["Bambara","bm"],["Basque","eu"],["Belarusian","be"],["Bengali","bn"],["Bhojpuri","bho"],["Bosnian","bs"],
    ["Bulgarian","bg"],["Catalan","ca"],["Cebuano","ceb"],["Chichewa","ny"],
    ["Corsican","co"],["Croatian","hr"],["Czech","cs"],["Dhivehi","dv"],["Dogri","doi"],["Esperanto","eo"],
    ["Estonian","et"],["Ewe","ee"],["Frisian","fy"],["Galician","gl"],["Georgian","ka"],
    ["Guarani","gn"],["Gujarati","gu"],["Haitian Creole","ht"],["Hausa","ha"],["Hawaiian","haw"],["Hebrew","iw"],["Hmong","hmn"],
    ["Hungarian","hu"],["Icelandic","is"],["Igbo","ig"],["Ilocano","ilo"],["Irish","ga"],
    ["Javanese","jw"],["Kannada","kn"],["Kazakh","kk"],["Khmer","km"],["Kinyarwanda","rw"],["Konkani","gom"],["Krio","kri"],
    ["Kurdish (Kurmanji)","ku"],["Kurdish (Sorani)","ckb"],["Kyrgyz","ky"],["Lao","lo"],["Latvian","lv"],["Lingala","ln"],
    ["Lithuanian","lt"],["Luganda","lg"],["Luxembourgish","lb"],["Macedonian","mk"],["Maithili","mai"],["Malagasy","mg"],
    ["Malayalam","ml"],["Maltese","mt"],["Maori","mi"],["Marathi","mr"],["Meiteilon (Manipuri)","mni-Mtei"],["Mizo","lus"],["Mongolian","mn"],
    ["Myanmar (Burmese)","my"],["Nepali","ne"],["Norwegian","no"],["Odia (Oriya)","or"],["Oromo","om"],["Pashto","ps"],["Persian","fa"],["Polish","pl"],
    ["Punjabi","pa"],["Quechua","qu"],["Romanian","ro"],["Samoan","sm"],["Sanskrit","sa"],["Scots Gaelic","gd"],
    ["Sepedi","nso"],["Serbian","sr"],["Sesotho","st"],["Shona","sn"],["Sindhi","sd"],["Sinhala","si"],["Slovak","sk"],["Slovenian","sl"],["Somali","so"],
    ["Sundanese","su"],["Swahili","sw"],["Swedish","sv"],["Tajik","tg"],["Tamil","ta"],["Tatar","tt"],["Telugu","te"],["Tigrinya","ti"],
    ["Tsonga","ts"],["Turkish","tr"],["Turkmen","tk"],["Twi","ak"],["Ukrainian","uk"],["Urdu","ur"],["Uyghur","ug"],["Uzbek","uz"],["Welsh","cy"],
    ["Xhosa","xh"],["Yiddish","yi"],["Yoruba","yo"],["Zulu","zu"]],
  
  tlangs_id:function(id,getid){
    if (!_API.idlang){
      _API.idlang={};
      _API.lang_titles=[];
      for (var i=0;i<_API.tlangs.length;i++){
        var ti=_API.tlangs[i][1];
        var tx=_API.tlangs[i][0];
        _API.idlang[ti]=[tx,i];
        _API.lang_titles.push(tx);
      }
    }
    if (id in _API.idlang){
      return _API.idlang[id][getid?1:0];
    }
    if (getid){
      return 0;
    }
    return "Hardsub";
  },

  /*** URL API ***/
  setUri:function(u){
    try{
      history.pushState({}, "", u);
    }catch(e){}
  },

  reload:function(){
    try{
      _JSAPI.reloadHome();
      // var rloc="https://"+_JSAPI.dns()+"/__view/main.html";
      // console.log("RELOAD HOME = "+rloc);
      // location=rloc;
    }catch(e){
      console.log("ERROR Reload Home = "+e);
    }
  },
  
  checkUpdate(){
    if (_ISELECTRON){
      if (window._ELECTRON_CHECK_UPDATE){
        try{
          window._ELECTRON_CHECK_UPDATE(1);
        }catch(e){};
      }
    }
    else if (!_JSAPI.isOnUpdate()){
      _JSAPI.checkUpdate();
    }
  },

  nightly_oncheck:false,
  checkNightly(){
    if (_API.nightly_oncheck || _JSAPI.isOnUpdate()){
      return;
    }
    pb.cfg_setactive(home.settings.tools._s_checknightly,false);
    _API.nightly_oncheck=true;
    function reCheckForOnUpdate(){
      if (_JSAPI.isOnUpdate()){
        setTimeout(reCheckForOnUpdate,500);
      }
      else{
        _API.nightly_oncheck=false;
        pb.cfg_setactive(home.settings.tools._s_checknightly,true);
      }
    }
    var urlcheck = 'https://animetv.amarullz.com/last-nightly'+(_ISELECTRON?'-pc':'');
    $ap(urlcheck,function(r){
      if (r.ok){
        try{
          var nb=JSON.parse(r.responseText);
          var nl=[];
          var np=[];
          var bv=Number(_JSAPI.getVersion(2));
          var currentVersion=-1;
          var push_num=0;
          var namev="v"+_JSAPI.getVersion(0).toLowerCase();
          for (var i=0;i<nb.length;i++){
            var n=nb[i];
            if(n.vnum>=bv){
              n.nightly=false;
              if (n.name.toLowerCase().indexOf("-nightly")>-1){
                n.nightly=true;
              }
              if (n.name.toLowerCase()==namev){
                currentVersion=push_num;
              }
              var dt=new Date(n.time);
              var ds=(dt.getYear()+1900)+'-'+pad2(dt.getMonth()+1)+'-'+pad2(dt.getDate())+' '+pad2(dt.getHours())+':'+pad2(dt.getMinutes());
              nl.push(special(n.name+(n.nightly?'':'-STABLE'))+
                '<span class="datetime">'+special(ds)+'</span><span class="value">'+n.filesize+'</span>'
              );
              np.push(n);
              push_num++;
            }
          }
          if (nl.length>0){
            listOrder.showList(
              "Nightly and Release",
              nl,
              (currentVersion>-1)?currentVersion:undefined,
              function(chval){
                if (chval!=null){
                  var d=np[chval];
                  var dt=new Date(d.time);
                  var ctxt=
                    "Filename: **"+d.filename+"** ("+d.filesize+")\n"+
                    "Release Date: **"+dt.toLocaleString()+"**\n\n"+
                    d.content.trim()+
                    (d.nightly?"\n\n**CAUTION: __NIGHTLY BUILD MAY UNSTABLE !!!__**\n":"\n\n")+
                    (d.nightly?"**ARE YOU SURE YOU WANT TO INSTALL NIGHTLY BUILD?**":"**Install this stable build?**");
                  ctxt=md2html(ctxt,true);
                  _API.confirm((d.nightly?"Nightly ":"Release ")+d.name,ctxt,function(isok){
                    if (!isok){
                      return;
                    }
                    _API.showToast(
                      d.nightly?"Downloading Nightly Build...":"Downloading Stable Build..."
                    );

                    _JSAPI.installApk(d.url,d.nightly);
                    setTimeout(reCheckForOnUpdate,500);
                    return;
                  });
                }
              },
              true,
              'deployed_code_update'
            );
          }
          else{
            _API.showToast("There is no new compatible nightly build...");
          }
        }catch(e){
          _API.showToast("Nightly data corrupt...");  
        }
      }
      else{
        _API.showToast("Checking nightly build failed...");
      }
      _API.nightly_oncheck=false;
      pb.cfg_setactive(home.settings.tools._s_checknightly,true);
    });
  },

  /*** JSAPI CALLBACKS ***/
  keycb:null,
  messagecb:null,
  // mp4cb:null,
  // viewcb:null,
  m3u8cb:null,
  vidpageload:null,
  voicesearchcb:null,
  viewid:0,

  last_key_source:0,

  clearCb:function(){
    _API.keycb=null;
    _API.messagecb=null;
    // _API.mp4cb=null;
    // _API.viewcb=null;
    _API.m3u8cb=null;
    _API.vidpageload=null;
  },

  /* set vizcloud m3u8 callback */
  setVizCb:function(f){
    _API.m3u8cb=f;
  },

  /* set vizcloud page loaded callback */
  setVizPageCb:function(f){
    _API.vidpageload=f;
  },

  voiceSearch:function(cb){
    _API.voicesearchcb=cb;
    if (cb){
      _JSAPI.voiceSearch();
    }
  },

  /* Set key handler */
  setKey:function(f){
    _API.keycb=f;
  },

  /* Set window message handler */
  setMessage:function(f){
    _API.messagecb=f;
  },

  /* get anime player view data */
  getView:function(url, f){
    if (__SD3){
      return _API.getViewHi(url,f);
    }
    else if (__SD5){
      return _API.getViewFlix(url,f);
    }
    else if (__SD6){
      return kaas.getView(url,f);
    }
    else if (__SD7){
      return gojo.getView(url,f);
    }
    else if (__SD8){
      return miruro.getView(url,f);
    }
    else if (__SDKAI){
      return kai.getView(url,f);
    }
    // else if (__SD==1||__SD==2){
    //   return wave.getView(url,f);
    // }
    // _API.viewcb=f;
    // var uid=++_API.viewid;
    // if (_JSAPI.getview(url,uid))
    //   return uid;
    return false;
  },

  // HI ANIME
  hi_last_view:{
    view_url:'',
    data:null
  },
  getViewWave:function(url,f){
    function cbErr(){
      f({status:false},uid);
    }
    var data={
      streamtype:"",
      stp:0,
      status:true,
      title:'-',
      title_jp:'-',
      synopsis:'',
      stream_url:{
          hard:'',
          soft:'',
          dub:''
      },
      stream_vurl:'',
      poster:'',
      banner:null,
      "url":url,
      skip:[],
      ep:[],
      related:[],
      genres:[],
      seasons:[],
      recs:[],
      info:{
          type:null,
          rating:null,
          quality:null
      }
    };

    /* Load Main Episode */
    $a(url,function(r){
      if (r.ok){
        try{
          var d=$n('div','',0,0,r.responseText);

          if (__SD==1){
            // Wave

          }
          
          d.innerHTML='';
          return;
        }catch(e){}
      }
      cbErr();
    });
  },
  getViewFlix:function(url,f){
    var slug=__AFLIX.getSlug(url);
    var aid=__AFLIX.getAid(url);
    var get_ep = __AFLIX.getEp(url);
    var viewurl = __AFLIX.getUrl(url);
    var uid=++_API.viewid;

    function runCb(d){
      if (_API.hi_last_view.data==null){
        _API.hi_last_view.data=d;
      }
      else{
        for (var k in d){
          _API.hi_last_view.data[k]=d[k];
        }
        _API.hi_last_view.data.status=true;
        f(JSON.parse(JSON.stringify(_API.hi_last_view.data)),uid);
      }
    }

    function getEpServer(d,edat){
      var load_n=0;
      if (edat.sub) load_n++;
      if (edat.dub) load_n++;
      d.skip=[];
      console.log(['getEpServer',edat]);
      if (edat.sub){
        __AFLIX.req(edat.sub,function(r){
          if (r.ok){
            try{
              var k=JSON.parse(r.responseText);
              d.stream_sub_url=k.source;
            }catch(e){}
          }
          if (--load_n<1){
            runCb(d);
          }
        },6);
      }
      if (edat.dub){
        __AFLIX.req(edat.dub,function(r){
          if (r.ok){
            try{
              var k=JSON.parse(r.responseText);
              d.stream_dub_url=k.source;
            }catch(e){}
          }
          if (--load_n<1){
            runCb(d);
          }
        },3);
      }
      if (load_n==0){
        _API.hi_last_view.view_url='';
        _API.hi_last_view.data=null;
        f({status:false},uid);
      }
    }

    if (_API.hi_last_view.view_url==aid){
      if (_API.hi_last_view.data && _API.hi_last_view.data.ep){
        pb.open_ttip(_API.hi_last_view.data);
        /* Just Load Server */
        var eps=_API.hi_last_view.data.ep;
        var active_ep_id=null;
        if (_API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index]){
          _API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index].active=false;
          for (var i=0;i<eps.length;i++){
            var s=eps[i];
            if (get_ep==s.ep){
              active_ep_id=s;
              _API.hi_last_view.data.active_ep=active_ep_id;
              _API.hi_last_view.data.active_ep_index=i;
              _API.hi_last_view.data.ep[i].active=true;
              break;
            }
          }
          console.log("CACHED : "+active_ep_id);
          if (active_ep_id){
            getEpServer({},active_ep_id);
            return uid;
          }
        }
      }
    }
    _API.hi_last_view.data=null;
    _API.hi_last_view.view_url=aid;

    // Get Data
    if (_API.hi_last_view.data==null){
      _API.getTooltip(aid,function(d){
        if (d){
          pb.open_ttip(d);
          runCb(d);
        }else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      },url,1);
    }

    var epurl=
      '/episodes?id='+enc(slug)+'&c='+__AFLIX.enc2(slug)+'&dub=';
    var ep_data={
      d:{ep_val:{}},
      n:0,
      active_ep:null
    };
    function ep_cb(r,dub){
      if (r.ok){
        try{
          var t=JSON.parse(r.responseText);
          var l=t.episodes.length;
          var active_s=null;
          for (var i=0;i<l;i++){
            var p=t.episodes[i];
            var s={};
            if (!ep_data.d.ep_val[p.number]){
              s.ep=p.number;
              s.url=viewurl+"#"+s.ep;
              s.active=(get_ep==s.ep)?true:false;
              s.filler=false;
              s.img=p.image;
              s.title=p.title;
              if (!active_s){
                active_s=s;
              }
              if (s.active){
                ep_data.active_ep=s;
                ep_data.d.active_ep=ep_data.active_ep;
              }
              ep_data.d.ep_val[p.number]=s;
            }
            else{
              s=ep_data.d.ep_val[p.number];
            }
            if (dub){
              // var surl=slug+'-dub-episode-'+s.ep;
              var surl=slug+'-episode-'+s.ep;
              var c=__AFLIX.enc2(surl);
              s.dub='/watch/'+surl+'?server=&dub=ENG&c='+c;
            }
            else{
              var surl=slug+'-episode-'+s.ep;
              var c=__AFLIX.enc2(surl);
              s.sub='/watch/'+surl+'?server=&c='+c;
            }
          }
          if (!ep_data.active_ep && active_s){
            ep_data.active_ep=active_s;
            ep_data.d.active_ep=ep_data.active_ep;
          }
        }catch(e){
          console.log("EPCBERR: "+e+" -> "+r.responseText);
        }
      }
      if (++ep_data.n>=2){
        // runCb(ep_data.d);
        if (ep_data.active_ep){
          /* Fix ep ordering */
          var ep=ep_data.d.ep_val;
          delete ep_data.d.ep_val;
          ep_data.d.ep=[];
          var esorted=[];
          for (var i in ep){
            esorted.push(i);
          }
          esorted.sort(function(a, b) {
            return Number(a) - Number(b);
          });
          var vindex=0;
          for (var i=0;i<esorted.length;i++){
            var id=esorted[i];
            if (ep[id]){
              ep_data.d.ep.push(ep[id]);
              if (ep[id].active){
                ep_data.d.active_ep_index=vindex;
              }
              vindex++;
            }
          }
          getEpServer(ep_data.d,ep_data.active_ep);
        }
        else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      }
    }
    // Get Episodes
    console.log("Get Episode URL: "+epurl);
    function fetchEpInfo(isdub){
      __AFLIX.req(epurl+(isdub?'true':'false'),function(r){
        if (r.contentType=='application/json'){
          ep_cb(r,isdub);
          return;
        }
        r.ok=false;
        ep_cb(r,isdub);
      }, 0);
    }
    fetchEpInfo(false);
    fetchEpInfo(true);

    return uid;
  },

  getViewHi:function(url,f){
    var uid=++_API.viewid;
    var tipurl=home.hi_tipurl(url);
    var get_ep_s = url.split('#');
    var get_ep=1;
    if (get_ep_s.length>1){
      get_ep=toInt(get_ep_s[1]);
    }
    var ajax_url = '/ajax/v2';
    if (__SD_DOMAIN=="kaido.to"){
      ajax_url='/ajax';
    }

    function runCb(d){
      if (_API.hi_last_view.data==null){
        _API.hi_last_view.data=d;
      }
      else{
        for (var k in d){
          _API.hi_last_view.data[k]=d[k];
        }
        _API.hi_last_view.data.status=true;
        f(JSON.parse(JSON.stringify(_API.hi_last_view.data)),uid);
      }
    }

    function fetchServer(d, srv_d){
      var dserver={
        'raw':[],
        'sub':[],
        'dub':[]
      };
      var srv_c=0;
      for (var i=0;i<srv_d.length;i++){
        var sd=srv_d[i];
        $a(ajax_url+'/episode/sources?id='+enc(sd[0]),function(r2){
          if (r2.ok){
            try{
              var jj=JSON.parse(r2.responseText);
              var sid=srv_d[r2.args];
              dserver[sid[1]].push({
                id:sid[0],
                link:jj.link,
                server:jj.server,
                sid:(jj.link.split('?').shift().split('/').pop()),
                dns:(jj.link.split('/'))[2]
              });
            }catch(ee){}
          }
          srv_c++;
          if (srv_c>=srv_d.length){
            d.ep_servers=dserver;
            d.stream_vurl  = "";
            d.ep_stream_sel=null;
            d.skip=[];
            runCb(d);
          }
        },1,i);
      }
    }

    function getEpServer(d,eid){
      $a(ajax_url+'/episode/servers?episodeId='+enc(eid),function(r){
        if (r.ok){
          try{
            var v=JSON.parse(r.responseText);
            var hd=$n('d','','',null,v.html);
            var srv=hd.querySelectorAll('.server-item');
            

            var srv_d=[];

            // pb.cfg_data.mirrorserver
            for (var i=0;i<srv.length;i++){
              var svid=srv[i].getAttribute('data-id');
              var svtp=srv[i].getAttribute('data-type');
              if (svtp=='sub'||svtp=='dub'||svtp=='raw'){
                srv_d.push([svid,svtp]);
              }
            }
            hd.innerHTML='';
            fetchServer(d, srv_d);
            return;
          }
          catch(e){
          }
        }
        f({status:false},uid);
      });
    }

    if (_API.hi_last_view.view_url==tipurl){
      /* Just Load Server */
      var eps=_API.hi_last_view.data.ep;
      var active_ep_id=null;
      _API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index].active=false;
      for (var i=0;i<eps.length;i++){
        var s=eps[i];
        if (get_ep==s.ep){
          active_ep_id=s.ep_id;
          _API.hi_last_view.data.active_ep=active_ep_id;
          _API.hi_last_view.data.active_ep_index=i;
          _API.hi_last_view.data.ep[i].active=true;
          break;
        }
      }
      if (active_ep_id){
        getEpServer({},active_ep_id);
        return uid;
      }
    }
    else{
      _API.hi_last_view.data=null;
    }
    _API.hi_last_view.view_url=tipurl;

    // Get Data
    if (_API.hi_last_view.data==null){
      _API.getTooltip(home.hi_tipurl(url),function(d){
        if (d){
          runCb(d);
        }else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      },url,1);
    }

    // Get Episodes
    $a(ajax_url+'/episode/list/'+home.hi_animeid(url),function(r){
      if (r.ok){
        try{
          var v=JSON.parse(r.responseText);
          if (v.status){
            var d={
              ep:[]
            };
            var active_ep_id=0;
            var first_s=null;
            var hd=$n('d','','',null,v.html);
            var epel=hd.querySelectorAll('#detail-ss-list .ss-list a.ep-item');
            for (var i=0;i<epel.length;i++){
              var p=epel[i];
              var s={};
              s.ep=p.getAttribute('data-number');
              s.url=tipurl+"#"+s.ep;
              s.active=(get_ep==s.ep)?true:false;
              s.filler=p.classList.contains('ssl-item-filler')?true:false;
              s.ep_id=p.getAttribute('data-id');
              s.title=p.getAttribute('title');
              if (s.active){
                active_ep_id=s.ep_id;
                d.active_ep=active_ep_id;
                d.active_ep_index=i;
              }
              if (!first_s){
                first_s=s;
              }
              d.ep.push(s);
            }

            /* Execute Callbacks */
            hd.innerHTML='';
            /* kaido fix */
            if (!active_ep_id && first_s){
              first_s.active=true;
              active_ep_id=first_s.ep_id;
              d.active_ep=active_ep_id;
              d.active_ep_index=0;
            }
            if (active_ep_id){
              getEpServer(d,active_ep_id);
              return;
            }
          }
        }catch(e){
        }
      }
      _API.hi_last_view.view_url='';
      _API.hi_last_view.data=null;
      f({status:false},uid);
    },1);

    return uid;
  },

  /* get mp4upload mp4-video url */
  // getMp4:function(url, f){
  //   _API.mp4cb=f;
  //   _JSAPI.getmp4vid(url);
  // },

  currentStreamType:0,
  currentStreamTypeValue:0,
  streamTypeById:function(l){
    t=1;
    if (l=='dub' || pb.cfg_data.dubaudio){
      t=2;
    }
    else if (l=='hard' || l==''){
      t=0;
    }
    return t;
  },
  setStreamServer:function(t,c){
    _JSAPI.setStreamServer(t,c);
  },
  setStreamType:function(t,c){
    if (_API.currentStreamTypeValue){
      _JSAPI.setStreamType(_API.currentStreamType,c);
    }
    else{
      var ct=_API.streamTypeById(pb.cfg_data.lang);
      _API.currentStreamType=ct;
      _JSAPI.setStreamType(ct,c);
    }
  },
  setStreamTypeValue:function(t,c){
    if (t==-1){
      _API.currentStreamTypeValue=0;
      _API.setStreamType(0,c);
    }
    else{
      _API.currentStreamTypeValue=1;
      _API.currentStreamType=t;
      _JSAPI.setStreamType(t,c);
    }
  },

  getStreamType:function(){
    return _JSAPI.getStreamType();
  },

  /*** SHOW/HIDE IME ***/
  showIme:function(show){
    _JSAPI.showIme(show);
  },

  /*** Toast ***/
  toastElectronTo:null,
  showToast:function(txt){
    if (_ISELECTRON){
      if (_API.toastElectronTo){
        clearTimeout(_API.toastElectronTo);
        _API.toastElectronTo=null;
      }
      $('animetv_toast').innerHTML='<div>'+special(txt)+'</div>';
      $('animetv_toast').classList.add('active');
      _API.toastElectronTo=setTimeout(function(){
        $('animetv_toast').classList.remove('active');
      },2000);
    }
    else{
      _JSAPI.showToast(txt);
    }
  },

  /*** FETCH AJAX ***/
  tooltipFlixParse(jsn,isview){
    var o={
      title:'',
      title_jp:'',
      synopsis:'',
      genres:[],
      quality:null,
      ep:0,
      rating:'',
      ttid:''
    };
    try{
      console.log("ATVLOG FLIX JSON : "+jsn);
      var da=JSON.parse(jsn);
      var u=('slug' in da)?da:da[0];
      if (!u){
        return null;
      }
      __AFLIX.setCache(u);
      o.url=__AFLIX.setUrl(u.slug,u.anilistID);
      o.title=__AFLIX.getTitle(u);
      o.title_jp=__AFLIX.getTitle(u,1);
      o.ttid=u.anilistID;
      o.synopsis=stripHtml(u.description);
      o.poster=u.images.medium;
      o.ep=u.episodeNum;
      if (u.nextAiringEpisode){
        if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
          o.ep=o.epavail=u.nextAiringEpisode.episode-1;
        }
      }
      o.type=u.type?u.type:'';
      o.status=u.status?u.status:'';
      if (u.duration){
        o.duration=u.duration+'MIN';
      }
      if(u.bannerImage){
        o.headimg=u.bannerImage;
      }
      if(u.logoart){
        o.logoimg=u.logoart;
      }
      o.genre=u.genres.join(", ");
      for (var i=1;i<u.genres.length;i++){
        try{
          o.genres.push({
            name:u.genres[i],
            val:u.genres[i]
          });
        }catch(e){}
      }
      if (isview){
        o.seasons=[];
        o.related=[];
        o.recs=[];

        o.info={
          type:{
            val:o.type.toLowerCase(),
            name:o.type,
          },
          rating:null,
          quality:null
        };
        o.banner=null;
        if (u.bannerart){
          if (u.bannerart.medium){
            o.banner=u.bannerart.medium;
          }
          else if (u.bannerart.large){
            o.banner=u.bannerart.large;
          }
        }
        if (!o.banner){
          o.banner=u.bannerImage?u.bannerImage:o.poster;
        }
        o.numep=o.ep;
        delete o.ep;
        o.stp=0;
        o.streamtype='';
        o.url=__AFLIX.setUrl(u.slug,u.anilistID);

        /* Get Related */
        if (u.relatedAnime){
          for (var i=0;i<u.relatedAnime.length;i++){
            var rel=u.relatedAnime[i];
            var sv={};
            sv.url=__AFLIX.setUrl(rel.slug,rel.anilistID);
            sv.tip=rel.anilistID;
            rel.title=rel.animeName;
            sv.title=__AFLIX.getTitle(rel);
            sv.title_jp=__AFLIX.getTitle(rel,1);
            sv.poster=rel.images.medium;
            o.related.push(sv);
          }
        }
      }
      return o;
    }catch(e){
      console.log("ERR "+e);
    }
    return null;
  },

  getTooltip:function(id, cb, url, isview){
    console.log("GET TOOLTIP = "+id);
    if (__SD6){
      return kaas.getTooltip(id, cb, url, 0);
    }
    else if (__SDKAI){
      return kai.getTooltip(id, cb, url, 0);
    }
    else if (__SD7){
      return gojo.getTooltip(id, cb, url, 0);
    }
    else if (__SD8){
      return miruro.getTooltip(id, cb, url, 0);
    }

    if (!id && url){
      if (__SD3){
        id=home.hi_tipurl(url);
      }
      else if (__SD5){
        id=__AFLIX.getAid(url);
      }
      else{
        // No-ttid fix
        $a(url,function(r){
          if (r.ok){
            var d=$n('div','',0,0,r.responseText);
            try{
              if (__SD==1){
                var tipid=d.querySelector("#watch-main").getAttribute('data-id');
                var ttid=''+tipid+'?/cache'+$tick();
                try{
                  _API.getTooltip(ttid,cb);
                }catch(e){}
                return;
              }
              else{
                var tipid=d.querySelector("main div.container.watch-wrap").getAttribute('data-id');
                var ttid=''+tipid+'?/cache'+$tick();
                try{
                  _API.getTooltip(ttid,cb);
                }catch(e){}
                return;
              }
            }catch(e){}
          }
          cb(null);
        });
        return;
      }
    }

    var tt_url='';
    if (__SD3){
      tt_url=id;
    }
    else if (__SD5){
      if (id in __AFLIX.cache){
        cb(_API.tooltipFlixParse(__AFLIX.cache[id],isview));
        return;
      }
      tt_url='/__proxy/'+__AFLIX.ns+"/idtoinfo?ids=["+id+"]&y="+__AFLIX.enc2("idinfo");
      console.log("TTURL = "+tt_url);
    }
    else{
      tt_url="https://"+__DNS+"/ajax/anime/tooltip/"+id+"?"+$tick();
    }
    $a(tt_url,function(r){
      if (r.ok){
        var o={
          title:'',
          title_jp:'',
          synopsis:'',
          genres:[],
          quality:null,
          ep:0,
          rating:'',
          ttid:id
        };
        if (__SD5){
          cb(_API.tooltipFlixParse(r.responseText,isview));
          return;
        }

        var d=$n('div','',0,0,r.responseText);
        if (__SD3){
          var c=d.querySelector('.anis-content');
          var et = c.querySelector('h2.film-name');
          o.title=et.textContent;
          o.title_jp=et.getAttribute('data-jname');
          
          try{
            o.synopsis=c.querySelector('.film-description .text').textContent.trim();
          }catch(e){}

          try{
            o.ep=c.querySelector('.tick-item.tick-sub').textContent.trim();
          }catch(e){}
          try{
            o.rating=c.querySelector('.tick-item.tick-pg').textContent.trim();
          }catch(e){}
          try{
            o.type=c.querySelector('.tick .dot+.item').textContent.trim();
          }catch(e){}
          try{
            o.quality=c.querySelector('.tick-item.tick-quality').textContent.trim();
          }catch(e){}

          var dmeta=c.querySelectorAll('.anisc-info-wrap .anisc-info .item');
          function findMeta(kw){
            for (var i=0;i<dmeta.length;i++){
              if ((dmeta[i].firstElementChild.textContent+"").trim().toLowerCase().indexOf(kw)==0){
                return dmeta[i].firstElementChild;
              }
            }
            return null;
          }
          var fs=findMeta("status:");
          try{
            if (fs){
              o.status=fs.nextElementSibling.textContent.trim();
            }
          }catch(e){}
          fs=findMeta("duration:");
          try{
            if (fs){
              o.duration=fs.nextElementSibling.textContent.trim();
            }
          }catch(e){}

          var fg=findMeta('genres:');
          if (fg){
            var pc=fg.parentElement.children;
            var gn=[];
            for (var i=1;i<pc.length;i++){
              try{
                var gd={
                  name:pc[i].textContent.trim(),
                  val:null
                };
                gn.push(gd.name);
                var gnr=pc[i].getAttribute('href').split('/');
                gd.val=gnr[gnr.length-1].trim();
                o.genres.push(gd);
              }catch(e){}
            }
            o.genre=gn.join(', ');
          }

          try{
            o.poster=d.querySelector('#ani_detail .film-poster img').getAttribute('src').replace('100x200','300x400');
          }catch(e){}

          // Is View
          if (isview){
            o.seasons=[];

            // Seasons
            var sa=d.querySelectorAll('.block_area-seasons .os-list a');
            for (var i=0;i<sa.length;i++){
              var sv={};
              sv.url=sa[i].getAttribute('href');
              sv.tip=home.hi_tipurl(sv.url);
              sv.title=sa[i].getAttribute('title');
              sv.active=sa[i].classList.contains('active');
              try{
                  sv.poster=sa[i].querySelector('.season-poster').style.backgroundImage.slice(4, -1).replace(/["']/g, "").replace('100x200','300x400');
              }catch(e){}
              o.seasons.push(sv);
            }

            // Related
            o.related=[];
            var rh=d.querySelector('#main-sidebar section .block_area-header');
            if (rh){
              if (rh.textContent.trim().toLowerCase().indexOf('related')>=0){
                var rl=rh.nextElementSibling.querySelectorAll('.ulclear li');;
                for (var i=0;i<rl.length;i++){
                  var sv={};
                  var tt=rl[i].querySelector('.film-name a');
                  sv.url=tt.getAttribute('href');
                  sv.tip=home.hi_tipurl(sv.url);
                  sv.title=tt.getAttribute('title');
                  sv.title_jp=tt.getAttribute('data-jname');
                  try{
                    tt=rl[i].querySelector('.film-poster img');
                    sv.poster=tt.getAttribute('data-src');
                  }catch(e){}
                  o.related.push(sv);
                }
              }
            }

            // Reccommendation
            o.recs=[];
            var rcs=d.querySelectorAll('#main-content .block_area.block_area_category .film_list-wrap .flw-item');
            for (var i=0;i<rcs.length;i++){
              var sv={};
              var tt=rcs[i].querySelector('.film-name a');
              sv.url=tt.getAttribute('href');
              sv.tip=home.hi_tipurl(sv.url);
              sv.title=tt.getAttribute('title');
              sv.title_jp=tt.getAttribute('data-jname');
              try{
                tt=rcs[i].querySelector('.film-poster img');
                sv.poster=tt.getAttribute('data-src');
              }catch(e){}
              o.recs.push(sv);
            }

            o.info={
                type:{
                  val:(o.type+'').toLowerCase(),
                  name:o.type+'',
                },
                rating:o.rating,
                quality:o.quality
            };
            
            o.banner=o.poster;
            o.numep=o.ep;
            delete o.ep;

            // Tobe Filled
            o.stp=0;
            o.streamtype='';
            o.url=tt_url;
          }
        }
        else if (__SD==1){
          // wave
          var tt=d.querySelector('div.title.d-title');
          if (tt){
            o.title=tt.textContent.trim();
            o.title_jp=tt.getAttribute('data-jp');
          }
          try{
            o.synopsis=d.querySelector('div.synopsis').textContent.trim();
          }catch(e){}

          try{
            o.ep=d.querySelector('span.ep-status.sub').textContent.trim();
          }catch(e){}

          try{
            var gn=d.querySelector('div.meta-bl').lastElementChild.querySelectorAll('a');
            for (var i=0;i<gn.length;i++){
              var gd={
                name:gn[i].textContent.trim(),
                val:null
              };
              var gnr=gn[i].getAttribute('href').split('/');
              gd.val=gnr[gnr.length-1].trim();
              o.genres.push(gd);
            }
          }catch(e){}
          try{
            o.rating=d.querySelector('i.rating').textContent.trim();
          }catch(e){}
          try{
            o.quality=d.querySelector('i.quality').textContent.trim();
          }catch(e){}

          var sp=d.querySelectorAll('div.meta-bl div>span');
          for (var i=0;i<sp.length;i+=2){
            try{
              var vt=sp[i].textContent.trim();
              if (vt=='Genre:'){
                o.genre=sp[i+1].textContent.replace(/\n/g,'').replace(/   /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/ \,/g,',').trim();
              }
              else if (vt=='Status:'){
                o.status=sp[i+1].textContent.trim();
              }
              else if (vt=='Duration:'){
                o.duration=sp[i+1].textContent.trim();
              }
            }catch(e){}
          }

          var watch=d.querySelector('a.watch');
          if (watch){
            o.url=watch.href;
          }
        }
        else{
          // anix
          var tt=d.querySelector('div.ani-name');
          if (tt){
            o.title=tt.textContent.trim();
            o.title_jp=tt.getAttribute('data-jp');
          }

          try{
            o.synopsis=d.querySelector('div.ani-detail div.ani-desc').textContent.trim();
          }catch(e){}

          try{
            o.ep=d.querySelector('div.ani-info span.sub').textContent.trim();
          }catch(e){}

          var dmeta=d.querySelectorAll('div.ani-detail div.ani-meta>div');
          function findMeta(kw){
            for (var i=0;i<dmeta.length;i++){
              if ((dmeta[i].textContent+"").trim().toLowerCase().indexOf(kw)==0){
                return dmeta[i];
              }
            }
            return null;
          }

          var fg=findMeta('genre:');
          if (fg){
            o.genre=fg.textContent.replace('Genre:','').replace(/\n/g,'').replace(/   /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/ \,/g,',').trim();
            try{
              var gn=fg.querySelectorAll('a');
              for (var i=0;i<gn.length;i++){
                var gd={
                  name:gn[i].textContent.trim(),
                  val:null
                };
                var gnr=gn[i].getAttribute('href').split('/');
                gd.val=gnr[gnr.length-1].trim();
                o.genres.push(gd);
              }
            }catch(e){}
          }
          var fs=findMeta('status:');
          if (fs){
            o.status=fs.firstElementChild.textContent.trim();
          }

          try{
            o.rating=d.querySelector('div.ani-info span.ani-rating').textContent.trim();
          }catch(e){}

          try{
            o.type=d.querySelector('div.ani-info span i.mdi-play').nextSibling.textContent.trim();
          }catch(e){}

          var watch=d.querySelector('div.watchnow-btn a.btn');
          if (watch){
            o.url=watch.href;
          }
        }

        d=null;
        // console.log(o);
        cb(o);
      }
      else
        cb(null);
    },__SD5?__AFLIX.origin:null);
  },

  /*** VIDEO VIEW API ***/
  vidSpeed:1.0,
  vidSpeedTimeout:null,
  videoSpeed:function(s){
    _API.vidSpeed=s;
    clearTimeout(_API.vidSpeedTimeout);
    _API.vidSpeedTimeout=setTimeout(function(){
      _JSAPI.videoSetSpeed(s);
      _API.vidSpeedTimeout=null;
    },800);
  },
  vidInterval:null,
  videoGetPos:function(){
    if (html5video()){
      return _API.videoElectronPos;
    }
    return {
      position:_JSAPI.videoGetPosition()/1000.0,
      duration:_JSAPI.videoGetDuration()/1000.0
    };
  },
  videoScale:function(scale){
    _JSAPI.videoSetScale(scale);
  },

  videoPlay:function(){
    _JSAPI.videoPlay(true);
  },
  videoPause:function(){
    _JSAPI.videoPlay(false);
  },
  videoSeek:function(v){
    _JSAPI.videoSetPosition(v*1000);
  },
  videoCompleteTo:null,
  setVideo:function(src, cb){
    if (_API.vidInterval){
      clearInterval(_API.vidInterval);
      _API.vidInterval=null;
    }
    if (src){
      _API.videoSetUrl(src);
      var initialized=false;
      var isplayed=false;
      body.classList.remove('playback_on_video');
      _API.vidInterval=setInterval(function(){
        if (!initialized){
          if (_JSAPI.videoIsPlaying()&&_JSAPI.videoGetDuration()>0){
            body.classList.add('playback_on_video');
            initialized=true;
            isplayed=true;
            cb('ready',0);
            cb('time',_API.videoGetPos());
            cb('play',0);
          }
        }
        else{
          var pl=_JSAPI.videoIsPlaying();
          if (pl!=isplayed){
            isplayed=pl;
            if (pl){
              cb('play',0);
            }
            else{
              cb('pause',0);
            }
          }
          if (pl){
            var np=_API.videoGetPos();
            cb('time',np);
            if ((np.duration>0)&&(np.duration-1<=np.position)){
              if (!_API.videoCompleteTo){
                console.log("Post Video Completed");
                _API.videoCompleteTo=setTimeout(function(){
                  console.log("Trigger Video Completed");
                  _API.videoCompleteTo=null;
                  cb('complete',0);
                },1500);
              }
            }
            else if (_API.videoCompleteTo){
              clearTimeout(_API.videoCompleteTo);
              _API.videoCompleteTo=null;
            }
          }
        }
      },50);
    }
    else{
      body.classList.remove('playback_on_video');
      _API.videoSetUrl("");
    }
  },

  /* Fetch animetv-info last message */
  discord_info_url:"https://raw.githubusercontent.com/amarullz/AnimeTV/refs/heads/master/tools/home-info.json",
  discordFetch:function(cb){
    $ap(_API.discord_info_url+"?"+$tick(), cb);
  }
};


(function(){
  /* VERSION INFO */
  try{
    var verel=$('home_version');
    if (_JSAPI){
      var srv=_JSAPI.dnsver();
      if (!_ISELECTRON){
        srv="Server "+srv;
      }
      verel.innerHTML="<b>AnimeTV "+_JSAPI.getVersion(0)+" "+
        "&copy; 2023-2024 amarullz.com</b><br />Build "+_JSAPI.getVersion(1)
        +" - "+srv+" - Source "+__SD_NAME;
    }
  }catch(e){}

  /* INITIALIZING */
  _API.theme_update();
})();


/****************************** HISTORY & WATCHLIST ******************************/
const list={
  history:{detail:{},list:[]},
  fav:{detail:{},list:[]},
  store_name:function(name){
    if (__SD==1){
      return _API.user_prefix+""+name;
    }
    else{
      return _API.user_prefix+"_anix_"+name;
    }
  },
  load_storage:function(name){
    var itm=localStorage.getItem(list.store_name(name));
    if (itm){
      var j=JSON.parse(itm);
      if (('detail' in j)&&('list' in j)){
        return {detail:j.detail,list:j.list};
      }
    }
    return {detail:{},list:[]};
  },
  save:function(o,name){
    localStorage.setItem(list.store_name(name),JSON.stringify(o));
  },
  del:function(o,id){
    var pos=o.list.indexOf(id);
    if (pos>=0){
      o.list.splice(pos,1);
      delete o.detail[id];
    }
  },
  add:function(o,id,val,refirst){
    var epos=o.list.indexOf(id);
    if (epos>-1){
      if (refirst){
        o.list.splice(epos,1);
        o.list.push(id);
      }
    }
    else{
      o.list.push(id);
    }
    o.detail[id]=val;
    if (o.list.length>200){
      var todel=o.list.shift();
      delete o.detail[todel];
    }
  },
  exists:function(o,id){
    return (o.list.indexOf(id)==-1)?false:true;
  },
  history_save:function(){
    list.save(list.history,'list_history');
  },
  history_add:function(id,val,refirst){
    if (!val.play){
      if (id in list.history.detail){
        if ((val.ep==list.history.detail[id].ep) && (list.history.detail[id].play)){
          val.play=JSON.parse(JSON.stringify(list.history.detail[id].play));
        }
      }
    }
    list.add(list.history,id,val,refirst);
    list.history_save();
  },
  history_del:function(id){
    list.del(list.history,id);
    list.history_save();
  },
  fav_save:function(){
    list.save(list.fav,'list_fav');
  },
  fav_add:function(id,val){
    if (!val.play){
      if (id in list.fav.detail){
        if ((val.ep==list.fav.detail[id].ep)&&(list.fav.detail[id].play)){
          val.play=JSON.parse(JSON.stringify(list.fav.detail[id].play));
        }
      }
    }
    list.add(list.fav,id,val);
    list.fav_save();
  },
  fav_del:function(id){
    list.del(list.fav,id);
    list.fav_save();
  },
  fav_exists(id){
    return list.exists(list.fav,id);
  },
  history_exists(id){
    return list.exists(list.history,id);
  },
  load:function(){
    list.history=list.load_storage('list_history');
    list.fav=list.load_storage('list_fav');
  }
};

/* subtitle libs (c) amarullz.com */
const vtt={
  h:$('vtt_subtitle'),
  set_style:function(n){
    var stn=[];
    for (var i=0;i<vtt.style_order.length;i++){
      stn.push(vtt.style_get(n,i,2));
    }
    var font_family=vtt.style_get(n,0,1).toLowerCase();
    vtt.set_font_family(font_family);
    cn=stn.join(' ');
    vtt.h.className=cn;
    $('vtt_subtitle_preview').className=cn;
  },
  font_family_el:{},
  set_font_family:function(ff){
    function rmel(n){
      if (n in vtt.font_family_el){
        vtt.font_family_el[n].parentElement.removeChild(vtt.font_family_el[n]);
        vtt.font_family_el[n]=null;
        delete vtt.font_family_el[n];
      }
    }
    rmel('preload1');
    rmel('preload2');
    rmel('link');
    console.warn('Font Family: '+ff);
    if (ff in vtt.google_font_family){
      vtt.font_family_el['preload1']=$n('link','',{'href':'https://fonts.googleapis.com','rel':'preconnect'},document.head,'');
      vtt.font_family_el['preload2']=$n('link','',{'href':'https://fonts.gstatic.com','rel':'preconnect','crossorigin':'crossorigin'},document.head,'');
      vtt.font_family_el['link']=$n('link','',{'href':vtt.google_font_family[ff],'rel':'stylesheet'},document.head,'');
    }
  },
  sel:0,
  substyle:0,
  listdef:[
    'english','portuguese (brazil)','spanish (latin_america)',
    'Spanish','Arabic','French','German','Italian','Russian'
  ],
  google_font_family:{
    'proportional':'https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    'itim':'https://fonts.googleapis.com/css2?family=Itim&display=swap',
    'salsa':'https://fonts.googleapis.com/css2?family=Salsa&display=swap',
    'outfit':'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap',
    'merriweather':'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
    'cantora_one':'https://fonts.googleapis.com/css2?family=Cantora+One&display=swap',
    'open_sans':'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
    'ruluko':'https://fonts.googleapis.com/css2?family=Ruluko&display=swap',
    'comic_neue':'https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap',
  },
  style_type:[
    'Font Type',
    'Font Size',
    'Font Weight',
    'Background',
    'Color',
    'Text Opacity',
    'Outline'
  ],
  style_icons:[
    'brand_family',
    'format_size',
    'format_bold',
    'gradient',
    'palette',
    'opacity',
    'text_format'
  ],
  style_order:[
    [
      "Serif",
      "Proportional",
      "Itim",
      "Salsa",
      "Outfit",
      "Merriweather",
      "Cantora One",
      "Open Sans",
      "Ruluko",
      "Comic Neue"
    ],
    [
      "Large",
      "Medium",
      "Small",
      "Extra Large"
    ],
    [
      "Normal",
      "Bold",
      "Bolder",
      "Thin"
    ],
    [
      "No Background",
      "Background 25%",
      "Background 50%",
      "Background 75%",
      "Background 100%"
    ],
    [
      "White",
      "Black",
      "Cyan",
      "Yellow",
      "Red",
      "Green",
      "Blue",
      "Primary",
      "Accent"
    ],
    [
      "Full Opacity",
      "95% Transparent",
      "90% Transparent",
      "85% Transparent",
      "80% Transparent",
      "75% Transparent",
      "70% Transparent",
      "65% Transparent",
      "60% Transparent"
    ],
    [
      "No Outline",
      "Thin Outline",
      "Medium Outline",
      "Thick Outline",
      "Extra Thick Outline",
    ],
  ],
  style_divs:[
    1,10,100,1000,10000,100000,1000000
  ],
  style_get:function(v, t, sl){
    if (t<0 || t>=vtt.style_order.length){
      return null;
    }
    var d=Math.floor(v / vtt.style_divs[t]) % 10;
    var g=vtt.style_order[t];
    if (g.length<=d){
      d=0;
    }
    if (sl==3){
      return d;
    }
    var out = g[d];
    if (sl){
      out = slugString(out,'_');
      if (sl==2){
        out="vtt_style_"+out;
      }
    }
    return out;
  },
  changestyle:function(prev_selpos){
    $('popupcontainer').className='active';
    $('vtt_subtitle_preview').style.display='';
    if (!prev_selpos){
      prev_selpos=0;
    }
    requestAnimationFrame(function(){
      var sel=[];
      for (var i=0;i<vtt.style_order.length;i++){
        var val=vtt.style_get(pb.cfg_data.ccstyle,i);
        // sel.push(vtt.style_type[i]+': '+val);
        sel.push({
          'icon':vtt.style_icons[i],
          'title':'<span class="label">'+special(vtt.style_type[i])+
            '</span><span class="value vinline">'+special(val)+'</span>'
        });
      }
      // _API.listPrompt(
      //   "Subtitle Style",
      //   sel, undefined, false, true, prev_selpos,
      listOrder.showMenu("Subtitle Style",sel,prev_selpos,
        function(chval){
          if (chval!=null){
            $('popupcontainer').className='active';
            var ssel=vtt.style_get(pb.cfg_data.ccstyle,chval,3);
            prev_selpos=chval;
            listOrder.showList(
              vtt.style_type[chval],
              vtt.style_order[chval],
              ssel, function(ssval){
                if (ssval!=null){
                  var k=pb.cfg_data.ccstyle;
                  k-=(Math.floor(k / vtt.style_divs[chval]) % 10) * vtt.style_divs[chval];
                  k+=ssval * vtt.style_divs[chval];
                  pb.cfg_data.ccstyle=k;
                  pb.cfg_update_el('ccstyle');
                  vtt.set_style(pb.cfg_data.ccstyle);
                  pb.cfg_save();
                }
                vtt.changestyle(prev_selpos);
              }
            );
          }
          else{
            $('popupcontainer').className='';
            $('vtt_subtitle_preview').style.display='none';
          }
        }
      );
    });
  },
  stylename:function(id){
    var stn=[];
    for (var i=0;i<vtt.style_order.length;i++){
      stn.push(vtt.style_get(id,i));
    }
    return stn.join(', ');
  },
  init:function(subs){
    // vtt.castSet("");
    if (pb.cfg_data.lang=='nosub'){
      /* No Subtitle */
      vtt.set('');
      // vtt.castSetIndex(0);
      vtt.playback.sub=null;
      vtt.playback.pos=0;
      vtt.playback.posid=0;
      vtt.substyle=0;
      vtt.playback.show=false;
      return;
    }

    // console.log("SUBTITLE INIT = ");
    if (subs.length>0){
      // console.log("SUBTITLE LENGTH = "+subs.length);
      if (pb.cfg_data.lang!='' && pb.cfg_data.lang!='en'){
        var ffind = vtt.find_match(subs, pb.cfg_data.lang);
        // console.log("SUBTITLES SOFT = "+pb.cfg_data.lang+" => "+ffind+" // "+JSON.stringify(subs,null,'\t'));
        if (ffind>-1){
          // console.log("SUBTITLES FIND = "+ffind+" -> "+JSON.stringify(subs[ffind],null,'\t'));
          vtt.load(subs[ffind], 1);
          // vtt.castSetIndex(ffind+1);
          return;
        }
      }

      // vtt.castSet(sub.u);
      // var subs_url=[];
      // for (var i=0;i<subs.length;i++){
      //   subs_url.push(subs[i].u);
      // }
      // vtt.castSet(subs_url.join("\n"));

      // console.error(JSON.stringify(subs));
      for (var i=0;i<subs.length;i++){
        if ((subs[i].l=='english')||(subs[i].i && subs[i].i=='en')){
          console.log("SUBTITLE LENGTH = FOUND ENGLISH");
          vtt.load(subs[i]);
          // vtt.castSetIndex(i+1);
          return;
        }
      }
      for (var i=0;i<subs.length;i++){
        if (subs[i].d){
          vtt.load(subs[i]);
          // vtt.castSetIndex(i+1);
          return;
        }
      }
      for (var i=0;i<subs.length;i++){
        if (subs[i].l.indexOf("eng")>-1){
          vtt.load(subs[i]);
          // vtt.castSetIndex(i+1);
          return;
        }
      }
      vtt.load(subs[0]);
      // vtt.castSetIndex(1);
    }
  },
  match_lang:{ 
    it:['ita'], 
    es:['esp','spa'], 
    ar:['ara'], 
    fr:['fra','fre'], 
    ru:['rus'], 
    de:['deu','ger'],
    pt:['por','bra'],
  },
  find_match:function(t, lang){
    if (lang in vtt.match_lang){
      // console.log("SUBTITLES FIND = "+pb.cfg_data.lang);
      var y=vtt.match_lang[lang];
      for (var i=0;i<t.length;i++){
          var u=t[i];
          for (var j=0;j<y.length;j++){
              if (u.l.toLowerCase().indexOf(y[j])>-1){
                  return i;
              }
          }
      }
    }

    var lang_name=_API.tlangs_id(lang);
    if (lang_name){
      lang_name=lang_name.toLowerCase();
      for (var i=0;i<t.length;i++){
        if ((t[i].l==lang_name) || (t[i].i && t[i].i==lang)){
          console.log("VTT MATCH GOT -> "+lang_name+" = "+i+" => "+JSON.stringify(t[i]));
          return i;
        }
      }
    }

    return -1;
  },
  ts2pos:function(ts){
    var k=ts.split(":");
    while (k.length<3){
      k.splice(0, 0, "00");
    }
    return toFloat(k[2])+(toInt(k[1])*60)+(toInt(k[0])*3600);
  },
  parse:function(dt){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var t=[];
    var p=-1;
    try{
      for (var n=0;n<l.length;n++){
        var s=false;
        var ln=l[n];
        if (ln.indexOf("-->")>0){
          try{
            var range=ln.replace(/ /g,'').split("-->",2);
            if (range.length==2){
              // range[1].split(' ')
              t.push(
                {
                  ti:p+1,
                  ts:vtt.ts2pos(range[0]),
                  te:vtt.ts2pos(range[1]),
                  tr:range,
                  tx:''
                }
              );
              s=true;
              p++;
            }
          }catch(ee){}
        }
        if (!s&&p>=0){
          if (__SD6){
            if (ln.indexOf('kickassanimes.info')>0){
              ln='';
            }
          }
          /* remove escapes */
          ln=ln.replace(/{b}/g,'<b>').replace(/{\/b}/g,'</b>').replace(/{i}/g,'<i>').replace(/{\/i}/g,'</i>').replace(/{u}/g,'<u>').replace(/{\/u}/g,'</u>');
          ln=ln.replace(/{[\*\=][^}]*}/g,"");
          t[p].tx+='\n'+ln;
          t[p].tx=t[p].tx.trim();
        }
      }
    }catch(e){
    }
    return t;
  },
  parse_ass:function(dt){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var s=l.length;
    var t=[];
    var onevent=false;
    var format=null;
    var fl=0;
    var p=-1;
    for (var i=0;i<s;i++){
      var n=l[i];
      if (onevent){
        var m=n.split(':');
        if (m.length>=2){
          var k=m.shift().trim().toLowerCase();
          m=m.join(':');
          if (k=='format'){
            format=(m.trim().toLowerCase()).split(',');
            fl=format.length;
          }
          else if(format!=null && k=='dialogue'){
            var v=(m.trim()).split(',');
            var o={};
            var q={ti:p+1};
            for (var j=0;j<fl;j++){
              var cn=format[j].trim();
              if (j==fl-1){
                o[cn]=v.join(',');
              }
              else{
                o[cn]=v.shift();
              }
              if (cn=='text'){
                q.tx=o[cn].replace(/(?:{)([^}<\n]+)(?:})/g, "")
                  .replace(/\\N/g,'\n');
              }
              else if (cn=='start'){
                q.ts=vtt.ts2pos(o[cn]);
              }
              else if (cn=='end'){
                q.te=vtt.ts2pos(o[cn]);
              }
            }
            if (('tx' in q) && ('ts' in q) && ('te' in q)){
              if (q.tx){
                if (q.tx.toLowerCase().indexOf('animeflix')<0){
                  t.push(q);
                  p++;
                }
              }
            }
          }
        }
      }
      else{
        if (n.toLowerCase().trim()=='[events]'){
          onevent=true;
        }
        else if (n.trim().startsWith('[')){
          onevent=false;
        }
      }
    }
    return t;
  },
  translate:function(timelines, lang){
    var chunks=[],m=0,d=0,n=timelines.length;
    for (var i=0;i<n;i++){
      if (m==0){
        chunks.push({t:timelines[i].tx,s:i,e:i});
      }
      else{
        chunks[d].t+="  [103060]  "+timelines[i].tx;
        chunks[d].e=i;
      }
      if (++m==15){
        m=0;
        d++;
      }
    }
    if (chunks.length>0){
      var chunkn = chunks.length;
      for (var i=0;i<chunkn;i++){
        vtt.translate_chunk(timelines, lang, chunks[i],i*400);
      }
    }
  },
  translate_text:function(text, lang, cb){
    var translate_url='https://translate.google.com/m?tl='+
      lang+'&sl=en&q='+encodeURIComponent(text);
    $ap(translate_url,function(r){
      if (r.ok){
        try{
          var l=document.createElement('div');
          l.innerHTML=r.responseText;
          var txts=l.querySelector('div.result-container').outerText+'';

          /* Fix space on tags xd */
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\ >/g,">");
          txts=txts.replace(/\ >/g,">");
          txts=txts.replace(/\ >/g,">");
          try{
            cb(txts);
          }catch(e){}
          return;
        }
        catch(e){
        }
      }
      cb(null);
    });
  },
  translate_chunk:function(timelines, lang, chunk, delay){
    setTimeout(function(){
      vtt.translate_text(chunk.t,lang,function(txts){
        if (txts){
          txts=txts.split("[103060]");
          // console.log(txts);
          for (var i=0;i<txts.length;i++){
            var p=chunk.s+i;
            if (p<=chunk.e){
              timelines[p].tz=txts[i];
            }
          }
        }
      });
    },delay);
  },
  set:function(s){
    vtt.h.innerHTML=s?nlbr(s+''):'';
  },
  /*
  castSet:function(u){
    if ('castSubtitle' in _JSAPI){
      try{
        _JSAPI.castSubtitle(u);
      }catch(e){}
    }
  },
  castSetIndex:function(u){
    if ('castSubtitleIndex' in _JSAPI){
      try{
        _JSAPI.castSubtitleIndex(u);
      }catch(e){}
    }
  },
  */
  load:function(sub,n){
    vtt.set('');
    vtt.playback.sub=null;
    vtt.playback.pos=0;
    vtt.playback.posid=0;
    vtt.substyle=0;
    vtt.playback.show=false;
    // console.log("LOADING SUBTITLE = "+JSON.stringify(sub));
    var hdr=null;
    if (__SD5){
      hdr=__AFLIX.origin_dev;
    }
    else if (__SD6){
      hdr=kaas.subtitle_origin;
    }else if (__SD7){
      hdr=gojo.subtitle_origin;
    }else if (__SD8){
      hdr=miruro.add_headers;
    }
    $ap(sub.u,function(r){
      if (r.ok){
        sub.v=r.responseText;
        // console.log("LOADING GET SUB RAW = "+sub.v);
        if (__SD5){
          sub.p=vtt.parse_ass(sub.v);
          // console.log("LOADING PARSED ASS = "+JSON.stringify(sub.p));
        }
        else{
          sub.p=vtt.parse(sub.v);
        }

        if (pb.cfg_data.lang!='en' && 
          pb.cfg_data.lang!='hard' && 
          pb.cfg_data.lang!='dub' && 
          pb.cfg_data.lang!='' &&
          !n){
          /* If auto translate */
          vtt.substyle=1;
          vtt.translate(sub.p, pb.cfg_data.lang);
        }

        vtt.playback.show=false;
        vtt.playback.sub=sub;
        window.__activesub=sub;

        pb.updateStreamTypeInfo();
      }
      else{
        // console.log("LOADING GET SUB RAW FAILED");
      }
    }, hdr);
  },
  clear:function(){
    clearInterval(vtt.playback.intv);
    vtt.playback.sub=null;
    vtt.playback.pos=0;
    vtt.playback.posid=0;
    vtt.playback.show=false;
    vtt.set('');
  },
  setobj:function(txt){
    if (txt){
      vtt.set('<div class="vtt_obj">'+(txt)+'</div>');
    }
    else{
      vtt.set('');
    }
  },
  getobj:function(obj){
    if (('tz' in obj) && (pb.cfg_data.lang!='en')){
      return (obj.tz?obj.tz:'');
    }
    else if ('tx' in obj){
      return (obj.tx?obj.tx:'');
    }
    return '';
  },
  playback:{
    intv:null,
    btntv:null,
    sub:null,
    pos:0,
    posid:0,
    prevs:'',
    show:false,
    buffer_track:function(){
      _JSAPI.videoBufferPercent();
      requestAnimationFrame(function(){
        var pc=_JSAPI.videoBufferPercent();
        if (html5video() && _API.videoElectronPos.buffer && _API.videoElectronPos.duration){
          pc=_API.videoElectronPos.buffer/_API.videoElectronPos.duration * 100;
        }
        if (pb.pb_track_buffer._curr!=pc){
          pb.pb_track_buffer._curr=pc;
          if (pb.pb_track_buffer._curr>0){
            pb.pb_track_buffer.style.width=pb.pb_track_buffer._curr+"%"; 
          }
          else{
            pb.pb_track_buffer.style.width=""; 
          }
        }
      });
    },
    monitor:function(){
      if (!vtt.playback.sub||!vtt.playback.sub.p){
        return;
      }
      var p=pb.vid_stat.pos;
      var o=vtt.playback.sub.p;
      var s='';
      var v=[];
      for (var i=0;i<o.length;i++){ 
        if (p>=o[i].ts&&p<=o[i].te){
          s+=i+';';
          var vt=vtt.getobj(o[i]);
          if (vt){
            v.push('<span>'+vt+'</span>');
          }
        }
        else if (p<o[i].ts){
          break;
        }
      }
      if (s.length==0){
        if (vtt.playback.show){
          vtt.playback.show=false;
          vtt.set('');
        }
      }
      else if (vtt.playback.prevs!=s){
        vtt.playback.prevs=s;
        if (v.length>0){
          vtt.playback.show=true;
          vtt.setobj(v.join('<br>'));
        }
        else{
          vtt.playback.show=false;
          vtt.set('');
        }
      }
    },
    buffering_set:function(start){
      if (vtt.playback.btntv){
        clearInterval(vtt.playback.btntv);
      }
      vtt.playback.btntv=null;
      pb.pb_track_buffer._curr=-1;
      pb.pb_track_buffer.style.width="";
      if (start){
        vtt.playback.btntv=setInterval(vtt.playback.buffer_track,200);
      }
    },
    play:function(){
      if (vtt.playback.intv){
        clearInterval(vtt.playback.intv);
        vtt.playback.intv=null;
      }
      vtt.playback.intv=setInterval(vtt.playback.monitor,50);
      
    },
    pause:function(){
      vtt.playback.show=false;
      clearInterval(vtt.playback.intv);
      vtt.playback.intv=null;
    }
  }
};
/****************************** BANNER CACHE ******************************/
const bannerCacher={
  enable:true,
  key:'e4reefz8',
  base:'https://keyvalue.immanuel.co/api/KeyVal',

  apiani:'https://api.ani.zip/mappings?anilist_id=',
  isaniapi:true,

  cache:{},
  apiCache:{},
  aniApi:function(id,cb){
    var vkey='c'+id;
    if (vkey in bannerCacher.apiCache){
      requestAnimationFrame(function(){
        cb(bannerCacher.apiCache[vkey]);
      });
      return;
    }
    $ap(bannerCacher.apiani+id,function(r){
      var o=null;
      if (r.ok){
        try{
          o=JSON.parse(r.responseText);
        }catch(e){
          o=null;
        }
      }
      bannerCacher.apiCache[vkey]=o;
      cb(o);
    },
    {
      "Pragma": "max-age=604800",
      "Cache-Control": "max-age=604800"
    });
  },

  aniApiGetImage:function(kdat, type){
    if (kdat && ('images' in kdat)){
      for (var i=0;i<kdat.images.length;i++){
        if (kdat.images[i].coverType==type){
          return kdat.images[i].url;
        }
      }
    }
    return null;
  },

  aniApiGet:function(id,cb){
    var vkey='c'+id;
    bannerCacher.aniApi(id,function(kdat){
      var o=bannerCacher.aniApiGetImage(kdat,'Fanart');
      bannerCacher.cache[vkey]=o;
      cb(o);
    });
  },

  get:function(id,cb){
    if (!bannerCacher.enable){
      requestAnimationFrame(function(){
        cb(null);
      });
      return;
    }
    
    var vkey='c'+id;
    if (vkey in bannerCacher.cache){
      requestAnimationFrame(function(){
        cb(bannerCacher.cache[vkey]);
      });
      return;
    }

    if (bannerCacher.isaniapi){
      bannerCacher.aniApiGet(id,cb);
      return;
    }

    $ap(bannerCacher.base+"/GetValue/"+bannerCacher.key+"/"+id,function(r){
      var o=null;
      if (r.ok){
        try{
          o=atob(JSON.parse(r.responseText));
        }catch(e){}
      }
      bannerCacher.cache[vkey]=o;
      cb(o);
    },
    {
      "Pragma": "max-age=604800",
      "Cache-Control": "max-age=604800"
    });
  },
  set:function(id,val,cb){
    if (!bannerCacher.enable){
      requestAnimationFrame(function(){
        cb(null);
      });
      return;
    }
    var vkey='c'+id;
    if (bannerCacher.cache[vkey]){
      requestAnimationFrame(function(){
        cb(bannerCacher.cache[vkey]);
      });
      return;
    }
    $ap(bannerCacher.base+"/UpdateValue/"+bannerCacher.key+"/"+id+"/"+btoa(val).replace(/\=/g,''),function(r){
      var o=null;
      if (r.ok){
        try{
          o=JSON.parse(r.responseText);
          bannerCacher.cache[vkey]=val;
        }catch(e){}
      }
      cb(o);
    },
    {
      "Content-Type":"text/plain",
      "post":"1"
    });
  }
};
/****************************** RATING ******************************/
const ratingSystem={
  ratings:[
    'G',
    'PG',
    'PG-13',
    'R',
    'R+',
    'Rx',
    'No Limitation'
  ],
  rating_match:[
    'G',
    'PG',
    'PG13',
    'R',
    'R+',
    'RX',
    'No Limitation'
  ],
  ratings_withdesc:[
    'G - All Ages',
    'PG - Children',
    'PG-13 - Teens 13 and Older',
    'R - 17+ Violence & Profanity',
    'R+ - Profanity & Mild Nudity',
    'Rx - More adult audience',
    'No Limitation'
  ],
  noLimit:6,
  currentRating:2,
  allSource:true,
  blockMessage:function(){
    _API.showToast("PARENTAL: Opening anime is not allowed...");
  },
  toRating:function(t){
    var tx=(t+'').toUpperCase().replace(/\-/g,'').replace(/ /g,'');
    return ratingSystem.rating_match.indexOf(tx);
  },
  checkRating:function(t){
    if (!t){
      /* Set PG-13 as default if there is no rating */
      t="PG-13";
    }
    /* Check rating */
    var r=ratingSystem.toRating(t);
    return (r<=ratingSystem.currentRating);
  },
  ratingName:function(i){
    if (ratingSystem.ratings.length>i && i>=0){
      return ratingSystem.ratings[i];
    }
    return '';
  },
  checkAdultTitle:function(title, title_jp){
    if (title && (title+'').toLowerCase().indexOf("censor")>-1){
      return true;
    }
    if (title_jp && (title_jp+'').toLowerCase().indexOf("censor")>-1){
      return true;
    }
    return false;
  },
  checkAdult:function(isadult, title, title_jp){
    if (ratingSystem.currentRating<4){
      if (isadult){
        return false;
      }
      else if (ratingSystem.checkAdultTitle(title,title_jp)){
        return false;
      }
    }
    return true;
  },
  toRatingId:function(x){
    var rc=parseInt(x);
    if (isNaN(rc)){
      rc=ratingSystem.noLimit;
    }
    return rc;
  },
  setCurrentRating:function(x){
    ratingSystem.currentRating=ratingSystem.toRatingId(x);
    ratingSystem.allSource=(ratingSystem.currentRating>=4);
  }
};

/****************************** PLAYBACK ******************************/
const pb={
  /* elements */
  pb:$('pb'),
  pb_loading:$('pb_loading'),
  pb_load:$('pb_load'),
  pb_list:$('pb_lists'),
  pb_actions:$('pb_actions'),
  pb_meta:$('pb_meta'),
  pb_genres:$('pb_genres'),
  pb_episodes:$('pb_episodes'),
  pb_seasons:$('pb_seasons'),
  pb_related:$('pb_related'),
  pb_recs:$('pb_recs'),
  pb_settings:$('pb_settings'),
  pb_iactions:$('pb_iactions'),

  pb_touch_actions:$('pb_touch_actions'),
  pb_touch_iactions:$('pb_touch_iactions'),
  pb_touch_play:$('pb_touch_play'),
  pb_touch_prev:$('pb_touch_prev'),
  pb_touch_next:$('pb_touch_next'),
  pb_touch_close:$('pb_touch_close'),

  pb_vid:$('pb_vid'),

  pb_tracks:$('pb_tracks'),
  pb_track:$('pb_track'),
  pb_track_val:$('pb_track_val'),
  pb_track_skip1:$('pb_track_skip1'),
  pb_track_skip2:$('pb_track_skip2'),
  pb_track_buffer:$('pb_track_buffer'),

  pb_track_pos:$('pb_track_pos'),
  pb_track_dur:$('pb_track_dur'),
  pb_track_ctl:$('pb_track_ctl'),
  pb_track_title:$('pb_track_title'),

  pb_action_streamtype:$('pb_action_streamtype'),

  subtitles:[],

  /* meta elements */
  pb_title:$('pb_title'),
  pb_desc:$('pb_desc'),

  pb_event_skip:$('pb_event_skip'),
  pb_event_skip_title:$('pb_event_skip_title'),

  curr_stream_type:0,

  serverobj:function(name, priority){
    return {
      n: name,
      p: priority
    };
  },

  server_selected:function(max){
    if (!max){
      max=1;
    }
    if (!pb.cfg_data.mirrorserver){
      return 0;
    }
    else if ((pb.cfg_data.mirrorserver===true)||(pb.cfg_data.mirrorserver==1)){
      return 1;
    }
    else if (toInt(pb.cfg_data.mirrorserver)<=max){
      return toInt(pb.cfg_data.mirrorserver);
    }
    return 0;
  },

  server_ismulti:function(){
    var multi=true;
    if (!pb.state)
      multi=false;
    else if (!pb.data.servers)
      multi=false;
    else if (!pb.data.streamtype)
      multi=false;
    else if (!pb.data.servers[pb.data.streamtype])
      multi=false;
    else if (pb.data.servers[pb.data.streamtype].length<1)
      multi=false;
    return multi;
  },

  server_getname:function(){
    if (pb.server_ismulti()){
      var vr=pb.data.servers[pb.data.streamtype];
      var sel="Main";
      for (var i=0;i<vr.length;i++){
        if (vr[i].p==pb.cfg_data.mirrorserver || i==0){
          sel=vr[i].n;
        }
      }
      return sel;
    }
    if (pb.cfg_data.mirrorserver){
      return "Mirror";
    }
    return "Main";
  },

  listobj:function(){
    var ob={
      'url':pb.data.url,
      'title':pb.data.title,
      'title_jp':pb.data.title_jp,
      'poster':pb.data.poster,
      'ep':pb.ep_val,
      'episode':pb.ep_title,
      'tip':pb.tip_value
    };
    return ob;
  },

  playnext_update:function(pos,dur){
    var dr=(pos/dur)*100.0;
    if (dr>5){
      /* Update only if progress > 5% */
      try{
        var updateit=true;
        if (list.history.detail[pb.data.animeid].play){
          if (list.history.detail[pb.data.animeid].play[0]>pos){
            updateit=false;
          }
        }
        if (updateit){
          list.history.detail[pb.data.animeid].play=[pos,dur];
        }
      }catch(e){}
      try{
        if (pb.data.animeid in list.fav.detail){
          var updateit=true;
          if (list.fav.detail[pb.data.animeid].play){
            if (list.fav.detail[pb.data.animeid].play[0]>pos){
              updateit=false;
            }
          }
          if (updateit){
            list.fav.detail[pb.data.animeid].play=[pos,dur];
          }
        }
      }catch(e){}
      try{
        _JSAPI.playNextPos(pos,dur);
        pb.playnext_last_tick=$tick()+2000;
      }catch(e){}
    }
  },

  tip_value:'',
  url_value:'',
  startpos_val:0,

  updateanimation:function(){
    switch(pb.cfg_data.animation){
      case 1:
        _API.html_class='ani_quick';
        break;
      case 2:
        _API.html_class='ani_super_quick';
        break;
      case 3:
        _API.html_class='ani_no_transition';
        break;
      default:
        _API.html_class='';
        break;
    }
    if (pb.cfg_data.performance){
      var addclass=[];
      var n=0;
      if (pb.cfg_data.performance[0]){
        addclass.push('ui_performance_blur');
        n++;
      }
      if (pb.cfg_data.performance[1]){
        addclass.push('ui_performance_scale');
        n++;
      }
      if (pb.cfg_data.performance[2]){
        addclass.push('ui_performance_shadow');
        n++;
      }
      if (pb.cfg_data.performance[3]){
        addclass.push('ui_performance_mask');
        n++;
      }
      if (pb.cfg_data.performance[4]){
        addclass.push('ui_performance_textshadow');
        n++;
      }
      if (n>0){
        addclass.push('ui_performance');
      }
      var cls=addclass.join(' ').trim();
      if (cls){
        _API.html_class+=' '+cls; // ' ui_performance'
      }
    }

    switch(pb.cfg_data.uifontsize){
      case 1:
        _API.html_class+=' view-bigfont';
        break;
      case 2:
        _API.html_class+=' view-bigfont view-biggerfont';
        break;
      case 3:
        _API.html_class+=' view-bigfont view-biggest';
        break;
    }
    
    _API.theme_update();
    if (pb.cfg_data.jptitle){
      document.body.classList.add('japan-title');
    }
    else{
      document.body.classList.remove('japan-title');
    }
    // if (pb.cfg_data.compactlist){
    //   document.body.classList.remove('view-informative');
    // }
    // else{
    if (pb.cfg_data.largeui){
      document.body.classList.add('large-ui-list');
    }
    else{
      document.body.classList.remove('large-ui-list');
    }
    document.body.classList.add('view-informative');
    // }

    if (pb.cfg_data.showclock){
      $('home_header').classList.remove('animetv_noclock');
    }
    else{
      $('home_header').classList.add('animetv_noclock');
    }

    

    _JSAPI.setProgCache(pb.cfg_data.progcache);
    _JSAPI.setDOH(pb.cfg_data.usedoh);
    
  },

  cfg_data:{
    directpage:true,
    animation:0,
    performance:[true,false,true,true,false],
    autoskip:false,
    autonext:true,
    disablegesture:false,
    closeconfirm:0,
    html5player:false,
    skipfiller:false,
    jptitle:false,
    // compactlist:false,
    largeui:false,
    directsidebar:true,
    showclock:true,
    progcache:true,
    usedoh:true,
    nonjapan:false,
    alisthomess:true,
    alisthqbanner:false,
    trailer:1,
    server:0,
    scale:0,
    lang:'',
    alang:'',
    ccstyle:0,
    bgimg:{},
    quality:0,
    uifontsize:2,
    seekvalue:10,
    httpclient:0,
    mirrorserver:0,
    listprog:0,
    dubaudio:false,
    preloadep:true,
    hlsproxy:false,
    homylist:false,
    clksound:true,
    maltrackdialog:0
  },
  cfg_load:function(){
    var itm=_JSAPI.storeGet(_API.user_prefix+'pb_cfg',"");
    if (itm==""){
        itm=localStorage.getItem(_API.user_prefix+'pb_cfg');
        if (itm){
            _JSAPI.storeSet(_API.user_prefix+'pb_cfg',itm);
            localStorage.removeItem(_API.user_prefix+'pb_cfg');
        }
    }
    if (itm){
      var j=JSON.parse(itm);
      if (j){
        pb.cfg_data.autoskip=('autoskip' in j)?(j.autoskip?true:false):false;
        pb.cfg_data.disablegesture=('disablegesture' in j)?(j.disablegesture?true:false):false;
        
        
        pb.cfg_data.autonext=('autonext' in j)?(j.autonext?true:false):true;
        pb.cfg_data.html5player=('html5player' in j)?(j.html5player?true:false):false;
        pb.cfg_data.dubaudio=('dubaudio' in j)?(j.dubaudio?true:false):false;
        
        pb.cfg_data.skipfiller=('skipfiller' in j)?(j.skipfiller?true:false):false;
        pb.cfg_data.preloadep=('preloadep' in j)?(j.preloadep?true:false):true;
        pb.cfg_data.hlsproxy=('hlsproxy' in j)?(j.hlsproxy?true:false):false;
        
        pb.cfg_data.homylist=('homylist' in j)?(j.homylist?true:false):false;
        pb.cfg_data.clksound=('clksound' in j)?(j.clksound?true:false):true;
        
        pb.cfg_data.jptitle=('jptitle' in j)?(j.jptitle?true:false):false;
        pb.cfg_data.progcache=('progcache' in j)?(j.progcache?true:false):true;
        pb.cfg_data.usedoh=('usedoh' in j)?(j.usedoh?true:false):true;
        
        
        // pb.cfg_data.compactlist=('compactlist' in j)?(j.compactlist?true:false):false;
        pb.cfg_data.largeui=('largeui' in j)?(j.largeui?true:false):false;
        
        pb.cfg_data.showclock=('showclock' in j)?(j.showclock?true:false):true;
        pb.cfg_data.directsidebar=('directsidebar' in j)?(j.directsidebar?true:false):true;
        pb.cfg_data.directpage=('directpage' in j)?(j.directpage?true:false):true;
        
        
        pb.cfg_data.nonjapan=('nonjapan' in j)?(j.nonjapan?true:false):false;
        pb.cfg_data.alisthomess=('alisthomess' in j)?(j.alisthomess?true:false):true;
        pb.cfg_data.alisthqbanner=('alisthqbanner' in j)?(j.alisthqbanner?true:false):false;
        
        // pb.cfg_data.performance=('performance' in j)?(j.performance?true:false):true;
        // pb.cfg_data.mirrorserver=('mirrorserver' in j)?(j.mirrorserver?true:false):false;
        pb.cfg_data.mirrorserver=('mirrorserver' in j)?(j.mirrorserver===true?1:toInt(j.mirrorserver)):0;

        // _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
        

        pb.cfg_data.closeconfirm=0;
        if ('closeconfirm' in j){
          if (j.closeconfirm){
            if (j.closeconfirm==2){
              pb.cfg_data.closeconfirm=2;
            }
            else{
              pb.cfg_data.closeconfirm=1;
            }
          }
        }

        
        pb.cfg_data.lang=('lang' in j)?j.lang:'';
        pb.cfg_data.alang=('alang' in j)?j.alang:'';
        _API.setStreamType(0,0);

        pb.cfg_data.server=0;


        pb.cfg_data.ccstyle=('ccstyle' in j)?j.ccstyle:'';
        vtt.set_style(pb.cfg_data.ccstyle);

        pb.cfg_data.bgimg=JSON.parse(JSON.stringify(('bgimg' in j)?j.bgimg:{}));
        _API.bgimg_update();

        if ('performance' in j){
          if (Array.isArray(j.performance)){
            pb.cfg_data.performance=JSON.parse(JSON.stringify(j.performance));
          }
          else if (j.performance){
            pb.cfg_data.performance=[true,false,true,true,false];
          }
          else{
            pb.cfg_data.performance=[false,false,false,false,false];
          }
        }

        if ('trailer' in j){
          var sv=parseInt(j.trailer);
          if (!isNaN(sv)&&sv>=0&&sv<=2)
            pb.cfg_data.trailer=sv;
        }

        if ('maltrackdialog' in j){
          var sv=parseInt(j.maltrackdialog);
          if (!isNaN(sv)&&sv>=0&&sv<=4)
            pb.cfg_data.maltrackdialog=sv;
        }

        if ('quality' in j){
          var sv=parseInt(j.quality);
          if (sv&&sv>0&&sv<=3)
            pb.cfg_data.quality=sv;
        }

        if ('scale' in j){
          var sv=parseInt(j.scale);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.scale=sv;
        }

        if ('animation' in j){
          var sv=parseInt(j.animation);
          if (sv&&sv>0&&sv<=3)
            pb.cfg_data.animation=sv;
        }

        if ('uifontsize' in j){
          var sv=parseInt(j.uifontsize);
          pb.cfg_data.uifontsize=2;
          if (!isNaN(sv)&&(sv!=null)&&sv>=0&&sv<=3){
            pb.cfg_data.uifontsize=sv;
          }
        }
        else{
          pb.cfg_data.uifontsize=2;
        }

        if ('seekvalue' in j){
          var sv=parseInt(j.seekvalue);
          pb.cfg_data.seekvalue=10;
          if (!isNaN(sv)&&(sv!=null)&&sv>=2&&sv<=20){
            pb.cfg_data.seekvalue=sv;
          }
        }
        else{
          pb.cfg_data.seekvalue=10;
        }

        

        if ('httpclient' in j){
          var sv=parseInt(j.httpclient);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.httpclient=sv;
        }

        if ('listprog' in j){
          var sv=parseInt(j.listprog);
          if (sv&&sv>0&&sv<=4)
            pb.cfg_data.listprog=sv;
        }

        _JSAPI.setHttpClient(pb.cfg_data.httpclient);
        pb.updateanimation();
        return;
      }
    }
    pb.cfg_data.disablegesture=false;
    pb.cfg_data.autoskip=false;
    pb.cfg_data.closeconfirm=0;
    pb.cfg_data.autonext=true;
    pb.cfg_data.html5player=false;
    pb.cfg_data.dubaudio=false;
    
    pb.cfg_data.skipfiller=false;
    pb.cfg_data.jptitle=false;
    pb.cfg_data.progcache=true;
    pb.cfg_data.preloadep=true;
    pb.cfg_data.hlsproxy=false;
    pb.cfg_data.homylist=false;
    pb.cfg_data.clksound=true;
    pb.cfg_data.maltrackdialog=0;
    
    
    pb.cfg_data.usedoh=true;
    
    // pb.cfg_data.compactlist=false;
    pb.cfg_data.largeui=false;
    pb.cfg_data.directsidebar=true;
    pb.cfg_data.directpage=true;
    
    pb.cfg_data.showclock=true;
    
    pb.cfg_data.nonjapan=false;
    pb.cfg_data.alisthomess=true;
    pb.cfg_data.alisthqbanner=false;
    
    pb.cfg_data.performance=[true,false,true,true,false];
    pb.cfg_data.mirrorserver=0;
    
    
    pb.cfg_data.trailer=1;
    pb.cfg_data.server=0;
    pb.cfg_data.animation=0;
    pb.cfg_data.uifontsize=2;
    pb.cfg_data.seekvalue=10;
    
    pb.cfg_data.httpclient=0;
    pb.cfg_data.listprog=0;
    
    pb.cfg_data.scale=0;
    pb.cfg_data.lang='';
    pb.cfg_data.alang='';
    pb.cfg_data.ccstyle=0;
    pb.cfg_data.bgimg={};
    pb.cfg_data.quality=0;

    // _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
    _API.setStreamType(0,0);
    vtt.set_style(pb.cfg_data.ccstyle);
    _API.bgimg_update();
    _JSAPI.setHttpClient(pb.cfg_data.httpclient);
    pb.updateanimation();
  },
  cfgserver_name:[
    'VIZCLOUD M3U8',
    'VIZCLOUD HTML5',
    'MP4UPLOAD'
  ],
  cfgtrailer_name:[
    'No trailer',
    'Trailer without sound',
    'Trailer with sound'
  ],
  cfgcloseconfirm_name:[
    'Double Back',
    'Close Confirmation',
    'Close Directly'
  ],

  
  cfganimation_name:[
    'Normal',
    'Fast',
    'Faster',
    'No Transition'
  ],
  cfgperformance_name:[
    'Blur Effect',
    'Scale Effect',
    'Drop Shadow',
    'Mask Effect',
    'Text Shadow'
  ],
  cfgperformance_icon:[
    'blur_on',
    'resize',
    'shadow',
    'gradient',
    'text_format'
  ],
  cfgperformance_short_name:[
    'Blur',
    'Scale',
    'Shadow',
    'Mask',
    'Text'
  ],
  cfguifontsize_name:[
    'Small',
    'Medium',
    'Large',
    'Larger'
  ],
  cfghttpclient_name:[
    'OkHttp with DoH Support',
    'Generic HttpClient',
    'Cronet - Chromium Networking'
  ],
  cfghttpclient_electron_name:[
    'Google DNS',
    'Cloudflare DNS',
    'Disable DoH'
  ],

  cfglistprog_name:[
    'Start playing',
    'Watched 25%',
    'Watched 50%',
    'Watched 75%',
    'Finish watching',
  ],

  cfgmaltrackdialog_name:[
    'Do nothing',
    'Show tracking dialog',
    'Auto add to AniList',
    'Auto add to MAL',
    'Auto add to AniList and MAL',
  ],
  
  cfgstreamtype_name:[
    'HARDSUB',
    'SOFTSUB',
    'DUB'
  ],
  cfgstreamtype_ico:[
    'subtitles',
    'closed_caption',
    'keyboard_voice'
  ],
  cfgscale_name:[
    'Normal',
    'Cover',
    'Stretch'
  ],
  cfgquality_name:[
    "Auto",
    "High",
    "Medium",
    "Low"
  ],
  cfgtheme_name:[
    'Purple',
    'Blue',
    'Teal',
    'Green',
    'Brown',
    'Red',
    'Grey',
    'Dark'
  ],
  cfgloginscreen_name:[
    'Static Style',
    'Follow User Theme',
    'Follow User Theme and Wallpaper'
  ],
  cfgexitmode_name:[
    'Exit directly',
    'Confirm to exit',
    'Back to login screen',
    'Open sidebar before exit',
    'Sidebar to login screen'
  ],
  cfginitwinstate_name:[
    'Normal',
    'Maximize',
    'Fullscreen'
  ],
  cfg_save:function(){
    _JSAPI.storeSet(_API.user_prefix+'pb_cfg',JSON.stringify(pb.cfg_data));
  },
  cfg_setactive(el, state){
    if (state){
      el.classList.remove('disabled');
    }
    else{
      el.classList.add('disabled');
    }
  },
  cfg_update_el_root:function(key, root){
    if (!root){
      root=pb.pb_settings;
    }
    if (key){
      var el=root['_s_'+key];
      if (!el){
        return;
      }
      if (key=='speed'){
        el.lastElementChild.innerHTML="Speed "+_API.vidSpeed.toFixed(2)+"x";
      }
      else if (key=='loginscreen'){
        var ls=toInt(_JSAPI.storeGet("loginstyle","1"));
        if (ls<0||ls>2){
          ls=1;
        }
        el.lastElementChild.innerHTML=pb.cfgloginscreen_name[ls];
      }
      else if (key=='exitmode'){
        var ls=toInt(_JSAPI.storeGet("exitmode","0"));
        if (ls<0||ls>4){
          ls=0;
        }
        el.lastElementChild.innerHTML=pb.cfgexitmode_name[ls];
      }
      else if (key=='initwinstate'){
        var ls=toInt(_JSAPI.varGet("initwinstate","0"));
        if (ls<0||ls>2){
          ls=0;
        }
        el.lastElementChild.innerHTML=pb.cfginitwinstate_name[ls];
      }
      else if (key=='cachesz'){
        el.lastElementChild.innerHTML=_JSAPI.getCacheSz()+" MB";
      }
      else if (key=='useimgcdn'){
        var iscnd=(__IMGCDNL==1);
        el.firstElementChild.innerHTML=iscnd?'check':'clear';
        if (iscnd)
          el.firstElementChild.classList.add('checked');
        else
          el.firstElementChild.classList.remove('checked');
      }
      else if (key=='ccstyle'){
        el.lastElementChild.innerHTML=vtt.stylename(pb.cfg_data.ccstyle);
      }
      else if (key=='alang'){
        if (root!=pb.pb_settings){
          el.lastElementChild.innerHTML=_API.audiolang_getname(pb.cfg_data.alang);
        }
        else{
          var avl=__VIDLANGS.split(',');
          var vsel=avl.indexOf(pb.cfg_data.alang);
          if (vsel>-1 && pb.cfg_data.alang){
            el.lastElementChild.innerHTML=_API.audiolang_getname(pb.cfg_data.alang);
          }
          else{
            el.lastElementChild.innerHTML=_API.audiolang_getname('');
          }
        }
      }
      else if (key=='bgimg'){
        el.lastElementChild.innerHTML=pb.cfg_data.bgimg.title?pb.cfg_data.bgimg.title:"No Wallpaper";
      }
      else if (key=='quality'){
        if (root!=pb.pb_settings){
          el.lastElementChild.innerHTML=pb.cfgquality_name[pb.cfg_data.quality];
        }
        else{
          var ico='hd';
          if (pb.cfg_data.quality==0 && __VIDRESH>0){
            el.lastElementChild.innerHTML="Auto "+__VIDRESH+"p";
            vr=toInt(__VIDRESH);
          }
          else /* if (_ISELECTRON) */ {
            el.lastElementChild.innerHTML=(pb.cfgquality_name[pb.cfg_data.quality]+" "+
              (__VIDRESH?__VIDRESH+"p":"")).trim();
            vr=__VIDRESH;
          }
          // else{
          //   el.lastElementChild.innerHTML=pb.sel_quality;
          //   vr=toInt(pb.sel_quality);
          // }
          if (vr==0){
            ico='hd';
          }
          else if (vr==720){
            ico='hd';
          }
          else if (vr==1080){
            ico='full_hd';
          }
          else if (vr>1080){
            ico='4k';
          }
          else if (vr<720){
            ico='sd';
          }
          el.firstElementChild.innerHTML=ico;
        }
      }
      else if (key=='mirrorserver'){
        el.lastElementChild.innerHTML=special(pb.server_getname());
      }
      else if (key=='trailer'){
        el.lastElementChild.innerHTML=pb.cfgtrailer_name[pb.cfg_data.trailer];
      }else if (key=='closeconfirm'){
        el.lastElementChild.innerHTML=pb.cfgcloseconfirm_name[pb.cfg_data.closeconfirm];
      }
      else if (key=='theme'){
        el.lastElementChild.innerHTML=pb.cfgtheme_name[_API.theme_sel];
      }
      else if (key=='fav'){
        if (pb.data.animeid){
          if (list.fav_exists(pb.data.animeid)){
            el.innerHTML='<c>clear</c> Watchlist';
          }
          else{
            el.innerHTML='<c>bookmark_add</c> Watchlist';
          }
        }
      }
      else if (key=="streamselect"){
        var icos=[
          'subtitles','closed_caption','mic'
        ];
        var subel=[
          'Hardsub','Softsub','Dub'
        ];
        var sid=_API.currentStreamType;
        if ('playingStreamType' in pb.data){
          sid=pb.data.playingStreamType;
        }
        el.innerHTML='<c>'+icos[sid]+'</c> '+subel[sid];
      }
      else if (key=="miruroprovider"){
        el.innerHTML='<c>storefront</c> '+miruro.providers_name[miruro.provider];
      }
      else if (key=="hardsub" || key=="softsub"||key=="dub"){
        var subel=[
          'hardsub','softsub','dub'
        ];
        for (var i=0;i<3;i++){
          var kel=root['_s_'+subel[i]];
          if (kel){
            kel.firstElementChild.innerHTML=(_API.currentStreamType==i)?'check':'';
          }
        }
      }
      else if (key in pb.cfg_data){
        /* Set Active */
        if (key=='usedoh'){
          pb.cfg_setactive(el,pb.cfg_data.httpclient==0);
        }
        // else if (key=='html5player'){
        //   pb.cfg_setactive(el,pb.cfg_data.html5player);
        // }
        // else if (key=='dubaudio'){
          // pb.cfg_setactive(el,__SD3);
        // }

        /* Set Values */
        if (key=='server'){
          el.lastElementChild.innerHTML=pb.cfgserver_name[pb.cfg_data[key]];
        }
        else if (key=='lang'){
          var l=pb.cfg_data[key];
          var c='subtitles';
          var at='';
          if (l=='dub'){
            c='keyboard_voice';
          }
          else if (l && l!='hard'){
            c='closed_caption';
            at=' <l>'+(l.toUpperCase())+'</l>';
          }
          el.lastElementChild.innerHTML='<c>'+c+'</c> '+_API.tlangs_id(l)+at;
        }
        else if (key=='animation'){
          el.lastElementChild.innerHTML=pb.cfganimation_name[pb.cfg_data[key]];
        }
        else if (key=='performance'){
          var s=[];
          var n=0
          for (var i=0;i<pb.cfgperformance_short_name.length;i++){
            if (!pb.cfg_data[key][i]){
              s.push(pb.cfgperformance_short_name[i]);
              n++;
            }
          }
          var tx='Full performance';
          if (n==pb.cfgperformance_short_name.length){
            tx='Full effects';
          }
          else if (n>0){
            tx=s.join(", ").trim();
          }
          el.lastElementChild.innerHTML=tx;
        }
        else if (key=='uifontsize'){
          el.lastElementChild.innerHTML=pb.cfguifontsize_name[pb.cfg_data[key]];
        }
        else if (key=='seekvalue'){
          el.lastElementChild.innerHTML=pb.cfg_data[key]+" seconds";
        }
        else if (key=='httpclient'){
          if (_ISELECTRON)
            el.lastElementChild.innerHTML=pb.cfghttpclient_electron_name[pb.cfg_data[key]];
          else
            el.lastElementChild.innerHTML=pb.cfghttpclient_name[pb.cfg_data[key]];
        }
        else if (key=='listprog'){
          el.lastElementChild.innerHTML=pb.cfglistprog_name[pb.cfg_data[key]];
        }
        else if (key=='maltrackdialog'){
          el.lastElementChild.innerHTML=pb.cfgmaltrackdialog_name[pb.cfg_data[key]];
        }
        else if (key=='scale'){
          el.lastElementChild.innerHTML=pb.cfgscale_name[pb.cfg_data[key]];
        }
        else{
          if (el){
            el.firstElementChild.innerHTML=pb.cfg_data[key]?'check':'clear';
            if (pb.cfg_data[key])
              el.firstElementChild.classList.add('checked');
            else
              el.firstElementChild.classList.remove('checked');
          }
        }
      }
    }
  },
  cfg_update_el:function(key){
    if (key){
      pb.cfg_update_el_root(key,pb.pb_settings);
      pb.cfg_update_el_root(key,home.settings.tools);
    }
    else{
      pb.cfg_update_el('animation');
      pb.cfg_update_el('autoskip');
      pb.cfg_update_el('disablegesture');
      
      pb.cfg_update_el('closeconfirm');
      
      pb.cfg_update_el('autonext');
      pb.cfg_update_el('dubaudio');
      
      if (!_ISELECTRON){
        pb.cfg_update_el('html5player');
      }
      
      pb.cfg_update_el('skipfiller');
      pb.cfg_update_el('preloadep');
      pb.cfg_update_el('hlsproxy'); 
      
      pb.cfg_update_el('homylist');
      pb.cfg_update_el('clksound');
      pb.cfg_update_el('maltrackdialog');
      
      
      pb.cfg_update_el('nonjapan');
      pb.cfg_update_el('alisthomess');
      pb.cfg_update_el('alisthqbanner');

      pb.cfg_update_el('trailer');
      
      pb.cfg_update_el('performance');
      pb.cfg_update_el('mirrorserver');
      pb.cfg_update_el('jptitle');
      pb.cfg_update_el('progcache');
      pb.cfg_update_el('usedoh');
      
      // pb.cfg_update_el('compactlist');
      pb.cfg_update_el('largeui');
      pb.cfg_update_el('directsidebar');
      pb.cfg_update_el('directpage');
      
      
      pb.cfg_update_el('showclock');
      

      pb.cfg_update_el('loginscreen');
      pb.cfg_update_el('exitmode');

      if (_ISELECTRON){
        pb.cfg_update_el('initwinstate');
      }

      pb.cfg_update_el('uifontsize');
      pb.cfg_update_el('seekvalue');
      pb.cfg_update_el('httpclient');
      pb.cfg_update_el('listprog');
      
      pb.cfg_update_el('theme');

      pb.cfg_update_el('scale');
      pb.cfg_update_el('fav');
      pb.cfg_update_el('speed');
      pb.cfg_update_el('ccstyle');
      pb.cfg_update_el('bgimg');

      pb.cfg_update_el('quality');

      pb.cfg_update_el('hardsub');
      pb.cfg_update_el('softsub');
      pb.cfg_update_el('dub');
      pb.cfg_update_el('streamselect');

      pb.cfg_update_el('lang');
      pb.cfg_update_el('alang');

      pb.cfg_update_el('cachesz');
      pb.cfg_update_el('useimgcdn');
    }
  },
  cfg:function(v){
    if (v=='server') return pb.cfg_data.server;
    if (v=='scale') return pb.cfg_data.scale;
    if (v in pb.cfg_data) return pb.cfg_data[v];
    return false;
  },

  onskip:false,
  skip_val:0,
  skip_auto_timeout:null,
  skipauto_update:function(v){
    if (v){
      clearTimeout(pb.skip_auto_timeout);
      if (pb.onskip&&pb.cfg('autoskip')){
        pb.pb_event_skip.classList.add('autoskip');
        pb.skip_auto_timeout=setTimeout(function(){
          if (pb.onskip&&!pb.pb.classList.contains('menushow')){
            pb.vid_cmd('seek',pb.skip_val);
          }
        },1800);
      }
    }
    else{
      clearTimeout(pb.skip_auto_timeout);
    }
  },
  setskip:function(v,skid){
    if (v&&!pb.onskip){
      pb.onskip=true;
      pb.pb_event_skip.classList.add('active');
      pb.skipauto_update(1);
      if (skid){
        pb.pb_event_skip_title.innerHTML='SKIP OUTRO';
      }
      else{
        pb.pb_event_skip_title.innerHTML='SKIP INTRO';
      }
    }
    else if (!v&&pb.onskip){
      pb.skip_val=0;
      pb.onskip=false;
      pb.pb_event_skip.classList.remove('active');
      pb.pb_event_skip.classList.remove('autoskip');
      pb.skipauto_update(0);
    }
  },
  setskip_track:function(haveduration){
    /* Check Skip Data */
    pb.pb_track_skip1.style.left=
    pb.pb_track_skip1.style.width=
    pb.pb_track_skip2.style.left=
    pb.pb_track_skip2.style.width='0';
    if (haveduration){
      var tsk=[
        pb.pb_track_skip1,
        pb.pb_track_skip2
      ];
      var cd=pb.vid_stat.duration;
      if (cd>0){
        for (var i=0;(i<pb.data.skip.length) && (i<2);i++){
          var l=(pb.data.skip[i][0] / cd) * 100.0;
          var r=(pb.data.skip[i][1] / cd) * 100.0;
          tsk[i].style.left=l+"%";
          tsk[i].style.width=(r-l)+"%";
        }
      }
    }
  },

  reloadPlaybackTimeout:0,
  reloadPlayback:function(delay){
    clearTimeout(pb.reloadPlaybackTimeout);
    pb.reloadPlaybackTimeout=setTimeout(function(){
      pb.open(pb.url_value, pb.tip_value,0,pb.vid_stat.pos);
    },delay);
  },
  

  /* reset */
  reset:function(close, noclean){
    vtt.playback.buffering_set(false);
    pb.state=0;
    pb.vid=null;
    pb.vid_reset_stat();
    pb.pb_vid.innerHTML='';
    __VIDLANGS='';
    
    _API.setVideo('');
    _JSAPI.videoSetMeta("","","");
    _JSAPI.videoHaveNP(false,false);
    body.classList.remove('playback_menu_hide');

    pb.pb_track_val.style.width="0%";
    pb.pb_iactions.style.transform='';

    pb.setskip(false);
    pb.skipauto_update(0);

    _API.setMessage(null);
    _API.setKey(null);

    vtt.clear();

    if (noclean){
      if (noclean!==2){
        pb.pb_meta.classList.add('active');
      }
    }
    else{
      pb.pb.style.backgroundImage='';
      pb.pb_meta.classList.remove('active');
    }
    pb.pb_actions.classList.remove('active');
    if (close){
      try{
        list.history_save();
        if (pb.data.animeid in list.fav.detail){
          list.fav_save();
        }
      }catch(e){}
      try{
        _JSAPI.playNextRegister();
      }catch(e){}

      $('home').style.display=$('search').style.display='';

      /* Reset Stream Type */
      _API.setStreamTypeValue(-1,0);
      pb.pb_loading.classList.remove('active');
      pb.pb.classList.remove('active');
      home.home.classList.remove('onpb');
      _API.clearCb();
      _API.setKey(home.keycb);
      home.list_init();
      _API.setUri("/home");
      _JSAPI.setLandscape(false);
    }
    else{
      pb.pb_loading.classList.add('active');
      pb.pb.classList.add('active');
      home.home.classList.add('onpb');
    }
  },

  playback_error:function(txt, msg){
    pb.pb_track_pos.innerHTML=txt;
    pb.pb_track_ctl.innerHTML='warning';
    pb.pb_touch_play.innerHTML='warning';
    pb.pb_touch_actions.classList.add('hide');
    _API.showToast(msg);
  },

  /* videos */
  vid:null,
  vid_stat:{
    ready:false,
    pos:0,
    duration:0,
    play:false
  },
  vid_get_time_cb:null,
  vid_cmd_cb:null,
  vid_cmd:function(c,v){
    if (pb.vid_cmd_cb) return pb.vid_cmd_cb(c,v);
    return null;
  },
  vid_get_time:function(){
    var realSz={position:0,duration:0};
    if (pb.vid_get_time_cb) realSz=pb.vid_get_time_cb();
    if (pb.seek_timeout && pb.seek_target_pos){
      realSz.position=pb.seek_target_pos;
    }
    return realSz;
  },
  vid_startpos_init_to:null,
  vid_startpos_init:function(){
    clearTimeout(pb.vid_startpos_init_to);
    if (pb.startpos_val>0){
      if (pb.vid_stat.duration>0){
        pb.vid_cmd('seek',pb.startpos_val);
        pb.startpos_val=0;
        return;
      }
      if (pb.state) pb.vid_startpos_init_to=setTimeout(pb.vid_startpos_init,50);
    }
  },
  vid_event:function(c,v){
    if (c=='mediainfo'){
      // _API.showToast("Got MediaInfo Event");
      window.__M3U8CB(v);
    }
    else if (c=='complete'){
      if (pb.pb_track_ctl.innerHTML!='replay'){
        vtt.playback.buffering_set(false);
        pb.vid_stat.play=false;
        pb.pb_track_ctl.innerHTML='replay';
        pb.pb_touch_play.innerHTML='replay';
        pb.menu_show(1);
        pb.next_ep(0);
        try{
          _JSAPI.playNextClear();
        }catch(e){}
      }
    }
    else if (c=='ready'){
      pb.state=2;
      pb.pb_track_ctl.innerHTML='pause';
      pb.pb_touch_play.innerHTML='pause';
      pb.pb_touch_actions.classList.remove('hide');
      pb.pb_track_ctl.className='';
      console.log("EVENT VID READY");
      if (pb.startpos_val>0){
        pb.vid_startpos_init();
      }
      // if (pb.cfg_data.html5player){
      //   pb.vid_cmd('scale',pb.cfg_data.scale);
      // }
      if (html5video()){
        pb.vid_cmd('scale',pb.cfg_data.scale);
        pb.vid_cmd('speed',_API.vidSpeed);
        if (pb.vid){
          pb.vid.classList.add('ready');
        }
      }
      vtt.playback.buffering_set(true);
      pb.menu_autohide();
    }
    else if (c=='play'){
      pb.vid_stat.play=true;
      pb.pb_track_ctl.innerHTML='pause';
      pb.pb_touch_play.innerHTML='pause';
      pb.setskip_track(1);
      vtt.playback.play();
      // if (pb.cfg_data.html5player){
      //   pb.vid_cmd('speed',_API.vidSpeed);
      //   pb.vid_cmd('scale',pb.cfg_data.scale);
      // }
      if (html5video()){
        pb.vid_cmd('scale',pb.cfg_data.scale);
        pb.vid_cmd('speed',_API.vidSpeed);
        if (pb.vid){
          pb.vid.classList.add('ready');
        }
        if (pb.state<2){
          pb.vid_event('ready',0);
        }
      }
      pb.menu_autohide();
    }
    else if (c=='pause'){
      vtt.playback.pause();
      pb.vid_stat.play=false;
      pb.pb_track_ctl.innerHTML='play_arrow';
      pb.pb_touch_play.innerHTML='play_arrow';
    }
    else if (c=='time'){
      // console.warn(v);
      pb.vid_stat.pos=v.position;
      pb.vid_stat.duration=v.duration;
      pb.track_update_pos();

      /* Check Skip Data */
      var sk=0;
      var skid=0;
      var ct=pb.vid_stat.pos;
      for (var i=0;i<pb.data.skip.length;i++){
          if ((pb.data.skip[i][0]<ct)&&(pb.data.skip[i][1]>ct)){
              sk=pb.data.skip[i][1]+1;
              skid=i;
          }
      }
      if (sk>0){
        if (!pb.onskip){
          pb.skip_val=sk;
          if (pb.vid_stat.pos>3){
            pb.setskip(true,skid);
          }
        }
      }else if (pb.onskip){
        pb.setskip(false);
      }

      try{
        if (pb.playnext_last_tick<$tick()){
          pb.playnext_update(Math.floor(pb.vid_stat.pos),Math.ceil(pb.vid_stat.duration));
        }
      }catch(e){}
    }
  },
  playnext_last_tick:0,
  vid_reset_stat:function(){
    pb.vid_stat.ready=false;
    pb.vid_stat.pos=0;
    pb.vid_stat.duration=0;
    pb.vid_stat.play=false;
  },
  seek_timeout:null,
  seek_target_pos:0,
  init_video_player_url:function(src){
    pb.pb_track_pos.innerHTML='STREAMING VIDEO';
    pb.vid_get_time_cb=function(){
      return _API.videoGetPos();
    };
    pb.vid_cmd_cb=function(c,v){
      if (c=='play'){
        pb.vid_stat.play=true;
        _API.videoPlay();
        _API.videoPost('play',v);
      }
      else if (c=='pause'){
        pb.vid_stat.play=false;
        _API.videoPause();
        _API.videoPost('pause',v);
      }
      else if (c=='seek'){
        pb.seek_target_pos=pb.vid_stat.pos=v<0?0:v;
        pb.track_update_pos();
        if (pb.seek_timeout){
          clearTimeout(pb.seek_timeout);
        }
        pb.seek_timeout=setTimeout(function(){
          pb.vid_stat.pos=pb.seek_target_pos;
          _API.videoSeek(pb.vid_stat.pos);
          _API.videoPost('seek',pb.vid_stat.pos);
          pb.seek_target_pos=0;
          pb.seek_timeout=null;
        },500);
      }
      else{
        _API.videoPost(c,v);
      }
    };
    _API.setVideo(src,function(c,v){
      pb.vid_event(c,v);
    });
  },
  dash_parse(src,dt){
    console.warn("DASH PARSER: "+src);
    try{
      var doc = new DOMParser().parseFromString(dt,"text/xml");
      var vids=doc.querySelectorAll("Representation[height]");
      var parent=vids[0].parentElement;
      var elm={};
      for (var i=0;i<vids.length;i++){
        var v=vids[i];
        var h=v.getAttribute("height");
        var hi='p'+h;
        if (!(hi in elm)){
          elm[hi]={
            c:[],
            id:h
          };
        }
        elm[hi].c.push(v);
        parent.removeChild(v);
      }
      var ela=[];
      for (var i in elm){
        parent.textContent='';
        for (var j=0;j<elm[i].c.length;j++){
          parent.appendChild(elm[i].c[j]);
        }
        var x=new XMLSerializer().serializeToString(doc);
        x=x.replace(/\t/g,' ').replace(/\r/g,'').replace(/\n/g,' ').replace(/   /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/  /g,' ');
        elm[i].x=x;
        ela.push(elm[i]);
        parent.textContent='';
      }
      ela.sort(function(a,b){
        return toInt(b.id)-toInt(a.id);
      });
      var srcparse=src.split('#')[0];
      for (var i=0;i<ela.length;i++){
        var lela=ela[i];
        pb.data.vsources.push({
          r:lela.id+"p",
          u:srcparse+"#DAT="+btoa(lela.x)+"#dash",
          c:lela.x
        });
      }
    }catch(e){
      console.log("No DOMParser?");
    }
  },
  m3u8_kaas_parse:function(src,dt){
    var l=dt.split('\n');
    var m=[];
    var v=[];
    var a=[];
    var k='';
    var kl='';
    for (var i=0;i<l.length;i++){
      var ln=l[i];
      if (k==''){
        if (ln.indexOf('RESOLUTION=')>0){
          var n=ln.split("RESOLUTION=");
          if (n.length==2){
            n=n[1].split('x');
            if (n.length==2){
              k=((n[1]+"").split(',')[0]).trim();
              kl=ln;
            }
          }
          a.push(ln);
        }
        else{
          if (ln.indexOf('TYPE=AUDIO')>0){
            if (pb.data.streamtype=="dub"){
              if (ln.indexOf('LANGUAGE="eng"')>0){
                m.push(ln);
              }
            }
            else{
              m.push(ln);
            }
          }
          else{
            // pb.data.streamtype=
            m.push(ln);
          }
        }
      }
      else{
        v.push(
          [k,kl,ln]
        );
        a.push(ln);
        k=kl='';
      }
    }
    v.sort(function(a,b){
      return toInt(b[0])-toInt(a[0])
    });
    var tx=m.join("\n");
    pb.data.vsources=[];
    var ct1=[tx,a.join('\n')].join('\n');
    pb.data.vsources.push({
      r:"Auto",
      u:src+"#DAT="+btoa(ct1),
      c:ct1
    });
    for (var i=0;i<v.length;i++){
      var content=[tx,v[i][1],v[i][2]].join('\n');
      pb.data.vsources.push({
        r:v[i][0]+"p",
        u:src+"#DAT="+btoa(content),
        c:content
      });
    }
    return pb.data.vsources;
  },
  m3u8_parse_main:function(src,dt,addurl){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var r=0;
    var lsrc=src.substr(0,src.lastIndexOf("/")+1);
    var t=[];
    var nsrc={};
    for (var i=0;i<l.length;i++){
      var ln=(l[i]+"").trim();
      if (ln.indexOf("#")==0){
        if (ln.indexOf("RESOLUTION=")>0){
          var n=ln.split("RESOLUTION=");
          if (n.length==2){
            n=n[1].split('x');
            if (n.length==2){
              r=((n[1]+"").split(',')[0]).trim();
            }
          }
        }
      }
      else if (r && ln){
        var tr=toInt(r);
        t.push(tr);
        nsrc["p"+tr]=lsrc+ln;
        r=0;
      }
    }
    t.sort(function(a, b){return b - a});
    for (var i=0;i<t.length;i++){
      pb.data.vsources.push(
        {
          r:t[i]+"p",
          u:nsrc["p"+(t[i])]+(addurl?addurl:'')
        }
      );
    }
  },
  sel_quality:"AUTO",
  init_video_mp4upload:function(src){
    if (src.indexOf("/video.mp4")>0 && src.indexOf("mp4upload.com")>0){
      console.log("NO-PARSE Mp4upload, no parse");
      pb.init_video_player_url(src);
      if (pb.pb_settings._s_quality){
        pb.pb_settings.P.removeChild(pb.pb_settings._s_quality);
        pb.pb_settings._s_quality=null;
      }
      return;
    }
    else if (src.indexOf("#FILEMOON")>0){
      console.log("NO-PARSE FILEMOON, no parse");
      pb.init_video_player_url(src);
      if (pb.pb_settings._s_quality){
        pb.pb_settings.P.removeChild(pb.pb_settings._s_quality);
        pb.pb_settings._s_quality=null;
      }
      return;
    }

    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
    pb.data.vsources=[
      {
        r:"Auto",
        u:src
      }
    ];

    /* Auto Quality */
    if (true || html5video() || (!__SD6 && pb.cfg_data.quality==0)){
      console.log("NO-PARSE AUTO M3u8 QUALITY="+pb.cfg_data.quality);
      pb.init_video_player_url(src);
      pb.cfg_update_el("quality");
      return;
    }

    console.log("PARSED-M3u8 QUALITY="+pb.cfg_data.quality);
    function getm3u8cb(r){
      if (r.ok){
        var addUrl='';
        if (__SD5){
          addUrl=src.substring(src.indexOf('?'));
        }
        if (__SD6){
          if (src.indexOf("#dash")>0){
            pb.dash_parse(src,r.responseText);
          }
          else{
            pb.m3u8_kaas_parse(src,r.responseText);
          }
        }
        else{
          pb.m3u8_parse_main(src,r.responseText,addUrl);
        }
        if (pb.cfg_data.quality<pb.data.vsources.length){
          var sl=pb.data.vsources[pb.cfg_data.quality];
          pb.sel_quality=sl.r;
          pb.init_video_player_url(sl.u);
          pb.cfg_update_el("quality");
          return;
        }
      }
      pb.sel_quality="AUTO";
      pb.init_video_player_url(src);
      pb.cfg_update_el("quality");
    }
    if (__SD5){
      $ap(src,getm3u8cb,__AFLIX.origin_dev);
    }
    else{
      var origin={};
      try{
        var host_src=src.split('/')[2];
        var host_g=host_src.split('.');
        var host=host_g[host_g.length-2]+'.'+host_g[host_g.length-1];
        origin={
          "X-Org-Prox":'https://'+host,
          "X-Ref-Prox":'https://'+host+'/'
        };
      }catch(e){}
      $ap(src,getm3u8cb,origin);
    }
  },
  init_video_mp4upload_html5:function(src){
    pb.data.mp4url=src;
    pb.pb_vid.innerHTML='';
    pb.vid=$n('video','',{'poster':(pb.data.banner?pb.data.banner:pb.data.poster)},pb.pb_vid,'');

    /* Command Handler */
    pb.vid_cmd_cb=function(c,v){
      if (c=='play'){
        pb.vid_stat.play=true;
        pb.vid.play();
      }
      else if (c=='pause'){
        pb.vid_stat.play=false;
        pb.vid.pause();
      }
      else if (c=='seek'){
        pb.vid_stat.pos=pb.vid.currentTime=v<0?0:v;
      }
    };

    /* Time Handler */
    pb.vid_get_time_cb=function(){
      return {
        position:pb.vid.currentTime,
        duration:pb.vid.duration
      };
    };
    
    pb.vid.addEventListener('ended',function(e) {
      if (!pb.state) return;
      pb.vid_event('complete',0);
    },false);

    pb.vid.addEventListener('durationchange',function(e) {
      if (!pb.state) return;
      pb.vid_event('time',{
        position:pb.vid.currentTime,
        duration:pb.vid.duration
      });
    },false);

    pb.vid.addEventListener('play',function(e) {
      if (!pb.state) return;
      pb.vid_event('play',0);
    },false);

    pb.vid.addEventListener('pause',function(e) {
      if (!pb.state) return;
      pb.vid_event('pause',0);
    },false);

    pb.vid.addEventListener('loadeddata',function(e) {
      if (!pb.state) return;
      pb.vid.play();
      pb.vid_event('ready',0);
    },false);

    pb.vid.addEventListener('timeupdate',function(e) {
      if (!pb.state) return;
      pb.vid_event('time',pb.vid_get_time());
    },false);

    if (pb.state){
      pb.vid.src=src;
    }
  },

  mediainfo_callback:function(d){
    try{
      pb.pb_track_pos.innerHTML='PREPARE VIDEO';
      _API.setVizPageCb(null);

      if ('keys' in d){
        wave.vidstream.keys=JSON.parse(JSON.stringify(d.keys));
      }

      var urivid="";
      try{
        if (d.data.media.sources){
          urivid=(d.data.media.sources.length>1)?d.data.media.sources[1].file:d.data.media.sources[0].file;
        }
      }catch(e){}
      if (!urivid){
        try{
          if (d.result.sources){
            urivid=(d.result.sources.length>1)?d.result.sources[1].file:d.result.sources[0].file;
          }
        }catch(e){}
      }

      if (!__SD3){
        pb.subtitles=[];
        window.__subtitle=pb.subtitles;
        vtt.clear();
        try{
          if (d.result.tracks){
            var n=d.result.tracks.length;
            for (var i=0;i<n;i++){
              var tk=d.result.tracks[i];
              if (tk.kind=='captions'){
                pb.subtitles.push({
                  u:tk.file,
                  d:tk.default?1:0,
                  l:(tk.label+'').toLowerCase().trim()
                });
              }
            }
            vtt.init(pb.subtitles);
          }
        }catch(e){}
      }
      if ((urivid /*&&!_ISELECTRON*/ /*&& !pb.cfg_data.html5player*/) || (__SD3)){
        if (urivid=="ERROR"){
          pb.playback_error(
            'PLAYBACK ERROR',
            "Loading video from failed. Try change stream server."
          );
          return false;
        }

        pb.data.vizm3u8=urivid;
        console.log("ATVLOG Got VizCB = "+urivid);
        if (pb.cfg('server')==0){
          pb.pb_vid.innerHTML='';
          pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
          _API.setMessage(null);
          pb.startpos_val=pb.video_tmp_start_pos;
          pb.init_video_mp4upload(urivid);
        }
      }
      else{
        pb.pb_track_pos.innerHTML='STREAMING VIDEO';
      }
      return true;
    }catch(e){
      pb.pb_track_pos.innerHTML='VIDEO ERROR: '+e;
    }
    return false;
  },

  video_tmp_start_pos:0,

  init_video_vidcloud:function(){
    if ((pb.cfg('server')==1)&&(pb.data.vizm3u8)){
      console.log("ATVLOG VIZCLOUD-M3U8 GOT_DATA => "+pb.startpos_val);
      pb.init_video_mp4upload(pb.data.vizm3u8);
      return;
    }

    console.log("ATVLOG VIDEO VIDCLOUD = "+pb.data.stream_vurl);
    pb.video_tmp_start_pos=pb.startpos_val;
    pb.data.vizm3u8=null;
    
    _API.setMessage(function(e){
      if (pb.preload_video_started){
        return;
      }
      if (e){
        try{
          console.log("ATVLOG messageVal = "+e.data);
          if (e.data=='player.error'){
            __VIDPAGELOADCB(3);
            return;
          }
          var pd=JSON.parse(e.data);
          if (pd){
            if ('vcmd' in pd)
              pb.vid_event(pd.vcmd,pd.val);
            else if ('event' in pd){
              if (pd.event=='PLAYER_READY'){
                pb.vid_event('ready',0);
                pb.vid_cmd_cb('ready',0);
                pb.vid.classList.add('ready');
              }
            }
          }
        }catch(x){
        }
      }
    });

    /* Command Handler */
    pb.vid_cmd_cb=function(c,v){
      pb.vid.contentWindow.postMessage(JSON.stringify({
          vcmd:c,
          val:v
      }),'*');
    };

    /* Time Handler */
    pb.vid_get_time_cb=function(){
      return {
        position:pb.vid_stat.pos,
        duration:pb.vid_stat.duration
      };
    };

    var mp3utrycount=0;

    if (!html5video()){
      _API.setMessage(function(e){
        if (e){
          // _API.showToast("Got Win Message "+e.data);
          // console.log("ATVLOG WinMSG = "+e.data);
          try{
            var pd=JSON.parse(e.data);
            if (pd){
              if ('vcmd' in pd){
                pb.vid_event(pd.vcmd,pd.val);
              }
            }
          }catch(x){
          }
        }
      });
    }

    _API.setVizPageCb(function(d){
      if (d==0)
        pb.pb_track_pos.innerHTML='INITIALIZING';
      else if (d==1)
        pb.pb_track_pos.innerHTML='LOADING STREAM DATA';
      else if ((d==2)&&(++mp3utrycount<3)){
        pb.pb_track_pos.innerHTML='RETRY LOADING';
        pb.pb_vid.innerHTML='';
        (function(){
          var iframe_src=pb.data.stream_vurl;
          // if (html5video()){
          //   iframe_src+='&autostart=true';
          // }
          // if (pb.cfg_data.html5player && __SD<3){
          //   iframe_src+='&autostart=true';
          // }
          pb.vid=$n('iframe','',{src:iframe_src,frameborder:'0'},pb.pb_vid,'');
        })();
      }
      else{
        pb.pb_track_pos.innerHTML='PLAYER ERROR';
        pb.pb_vid.innerHTML='';
      }
    });

    _API.setVizCb(pb.mediainfo_callback);

    pb.pb_vid.innerHTML='';
    (function(){
      console.log("INIT-VIDEO-IFRAME : "+pb.data.stream_vurl);
      if (pb.preload_episode_video!=null){
        if (pb.preload_episode_video.u==pb.url_value){
          if (_API.m3u8cb){
            console.log("preload_episode_video cb -> "+pb.url_value);
            _API.m3u8cb(pb.preload_episode_video.d);
            pb.preload_episode_video=null;
            return;
          }
        }
      }
      pb.preload_episode_video=null;

      var iframe_src=pb.data.stream_vurl;
      // if (pb.cfg_data.html5player && __SD<3){
      //   iframe_src+='&autostart=true';
      // }
      // if (html5video()){
      //   iframe_src+='&autostart=true';
      // }
      pb.vid=$n('iframe','',{src:iframe_src,frameborder:'0'},pb.pb_vid,'');
    })();
  },

  reinit_video_to:null,
  reinit_video_delay:function(ms, isquality){
    clearTimeout(pb.reinit_video_to);
    pb.reinit_video_to=setTimeout(function(){
      if (isquality&&html5video()){
        _API.videoPost('quality',pb.cfg_data.quality);
      }
      else if (isquality){
        _API.videoTrackQuality(pb.cfg_data.quality,true);
      }
      else{
        pb.startpos_val=pb.vid_stat.pos;
        pb.init_video();
        pb.cfg_update_el("hardsub");
        pb.cfg_update_el("softsub");
        pb.cfg_update_el("dub");
      }
    },ms);
  },

  init_video:function(){
    pb.pb_vid.innerHTML='';
    pb.vid=pb.vid_get_time_cb=pb.vid_cmd_cb=null;
    pb.vid_reset_stat();
    _API.setVideo('');
    pb.lastkey=$tick();
    _API.setMessage(null);
    requestAnimationFrame(function(){
      pb.state=1;
      pb.track_update_pos();
      pb.pb_track_ctl.innerHTML='progress_activity';
      pb.pb_touch_play.innerHTML='progress_activity';
      pb.pb_touch_actions.classList.add('hide');
      pb.pb_track_ctl.className='loader';
      pb.pb_track_pos.innerHTML='LOADING SERVER';
      pb.pb_track_dur.innerHTML='';

      if (__SD3){
        /* Get Servers - HIANIME */
        pb.hiLoadVideo(pb.data, true, function(){
          pb.updateStreamTypeInfo();
          pb.init_video_vidcloud();
        });
      }
      else if (__SD5){
        pb.flix_load_video(pb.data, true, function(){
          pb.updateStreamTypeInfo();
          pb.flix_play_video();
        });
      }
      else if (__SD7){
        gojo.loadVideo(pb.data, function(v){
          if (!v){
            pb.playback_error(
              'PLAYBACK ERROR',
              "Loading video from source failed.\nTry changing mirror or check source server."
            );
          }
          else{
            pb.updateStreamTypeInfo();
            console.warn(v);
            try{
              pb.data.skip=[[0,0],[0,0]];
              if (v.s && v.s[0]){
                try{
                  pb.data.skip[0]=[v.s[0].intro.start,v.s[0].intro.end];
                }catch(e){
                  pb.data.skip[0]=[0,0];
                }
                try{
                  pb.data.skip[1]=[v.s[0].outro.start,v.s[0].outro.end];
                }catch(e){
                  pb.data.skip[1]=[0,0];
                }
              }
              vtt.clear();
              pb.subtitles=[];
              if (v.d.subtitles){
                var n=v.d.subtitles.length;
                for (var i=0;i<n;i++){
                  var tk=v.d.subtitles[i];
                  pb.subtitles.push({
                    u:tk.url,
                    d:(i==0)?1:0,
                    l:(tk.lang+'').toLowerCase().trim(),
                    i:(tk.lang+'').toLowerCase().trim()
                  });
                }
              }
              vtt.init(pb.subtitles);
              pb.init_video_mp4upload(v.d.sources[0].url);
            }catch(e){
              pb.playback_error(
                'PLAYBACK ERROR',
                "Loading video from source failed.\nTry changing mirror or check source server."
              );
            }
          }
        });
      }
      else if (__SDKAI){
        kai.loadVideo(pb.data,function(v){
          if (!v){
            pb.playback_error(
              'PLAYBACK ERROR',
              "Loading video from source failed.\nTry changing mirror or check source server."
            );
            return;
          }

          /* init subtitle */
          vtt.clear();
          pb.subtitles=[];
          if ('tracks' in v){
            var stidx={};
            var n=v.tracks.length;
            var dfn=0;
            for (var i=0;i<n;i++){
              var tk=v.tracks[i];
              if (tk.kind=='captions'){
                var clab = (tk.label+'').toLowerCase().trim();
                if (clab==''){
                  var cll=tk.file.split('/');
                  cll=(cll[cll.length-1]).split("_");
                  clab=cll[0];
                }
                var sub=null;
                if (!(clab in stidx)){
                  stidx[clab]={
                    u:tk.file,
                    d:(dfn==0)?1:0,
                    l:clab,
                    i:clab
                  };
                  pb.subtitles.push(stidx[clab]);
                  dfn++;
                }
                sub = stidx[clab];
                sub.u=tk.file;
              }
            }
            console.log(pb.subtitles);
            vtt.init(pb.subtitles);
          }

          /* Load Video */
          pb.updateStreamTypeInfo();
          var srcvd=v.sources[0].file;
          pb.init_video_mp4upload(srcvd);
          pb.cfg_update_el();


          console.log("KAI LOAD VIDEO:");
          console.log(v);
        });
      }
      else if (__SD8){
        miruro.loadVideo(pb.data, function(v){
          console.log("LOAD VIDEO RESPONSE: ",v);
          if (!v){
            pb.playback_error(
              'PLAYBACK ERROR',
              "Loading video from source failed.\nTry changing mirror or check source server."
            );
          }
          else{
            vtt.clear();
            pb.subtitles=[];
            if ('subtitles' in v){
              var n=v.subtitles.length;
              for (var i=0;i<n;i++){
                var tk=v.subtitles[i];
                if (tk.kind=='captions'){
                  pb.subtitles.push({
                    u:tk.file,
                    d:(i==0)?1:0,
                    l:(tk.label+'').toLowerCase().trim(),
                    i:(tk.label+'').toLowerCase().trim()
                  });
                }
              }
              vtt.init(pb.subtitles);
            }
            pb.updateStreamTypeInfo();
            pb.init_video_mp4upload(v.url);
            pb.cfg_update_el();
          }
        });
      }
      else if (__SD6){
        kaas.selectServer(pb.data);
        function kaasLoadSkipInfo(b){
          if (b&&b.cues){
            if (pb.data.skip.length==0){
              pb.data.skip=[[0,0],[0,0]]
            }
            if (b.cues.intro){
              pb.data.skip[0]=[b.cues.intro.start_ms/1000.0,b.cues.intro.end_ms/1000.0];
            }
            if (b.cues.ending){
              pb.data.skip[1]=[b.cues.ending.start_ms/1000.0,b.cues.ending.end_ms/1000.0];
            }
          }
        }
        function kaasLoadSubtitle(b){
          try{
            if (b && b.subtitles){
              var n=b.subtitles.length;
              for (var i=0;i<n;i++){
                var tk=b.subtitles[i];
                var tksrc=tk.src;
                if ((!b.vttabs)&&(tksrc.indexOf("//")!=0)) {
                  var vurl=new URL(pb.data.stream_vurl);
                  tksrc="//"+vurl.host+tksrc;
                }
                pb.subtitles.push({
                  u:(!b.vttabs)?'https:'+tksrc:tksrc,
                  d:(i==0)?1:0,
                  l:(tk.name+'').toLowerCase().trim(),
                  i:(tk.language+'').toLowerCase().trim()
                });
              }
            }
          }catch(e){}
        }
        kaas.streamGet(
          pb.data.stream_vurl, 
          pb.data.stream_sname, function(b){
            pb.pb_vid.innerHTML='';
            pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
            _API.setMessage(null);
            if (!b){
              pb.playback_error(
                'PLAYBACK ERROR',
                "Loading video from source failed.\nTry changing mirror or check source server."
              );
              return;
            }
            
            /* Load Subtitle */
            vtt.clear();
            pb.subtitles=[];
            pb.data.skip=[];
            window.__subtitle=pb.subtitles;
            kaasLoadSubtitle(b);
            kaasLoadSkipInfo(b);
            var subLoaded=false;
            if (pb.data.stream_mirror_data){
              if (pb.data.stream_mirror_data.src!=pb.data.stream_vurl){
                kaas.streamGet(
                  pb.data.stream_mirror_data.src, 
                  pb.data.stream_mirror_data.name, function(b2){
                    console.log(["Second Load", b2]);
                    if (b2){
                      kaasLoadSubtitle(b2);
                      vtt.init(pb.subtitles);
                      kaasLoadSkipInfo(b2);
                    }
                  }
                );
                subLoaded=true;
              }
            }
            if (!subLoaded){
              vtt.init(pb.subtitles);
            }

            /* Load Videos */
            console.warn(["kaas.streamGet",b]);
            if (b.manifest){
              if (b.isDash){
                console.log("LOAD DASH: "+b.manifest+'#dash');
                pb.init_video_mp4upload(b.manifest+'#dash');
              }
              else{
                pb.init_video_mp4upload(b.manifest);
              }
            }
            else{
              pb.init_video_mp4upload('https:'+b.hls);
            }
          });
      }
      else{
        /* GET SERVER WAVE-ANIX */
        if (pb.preload_episode_video!=null){
          if (pb.preload_episode_video.u==pb.url_value){
            console.log("preload_episode_video cb -> "+pb.url_value);
            pb.mediainfo_callback(pb.preload_episode_video.d);
            pb.preload_episode_video=null;
            return;
          }
        }
        pb.preload_episode_video=null;

        pb.data.stream_vurl = pb.data.stream_url.hard;
        pb.data.streamtype="sub";
        var is_soft=false;
        if (_API.currentStreamType==2){
          if (pb.data.stream_url.dub){
            pb.data.stream_vurl = pb.data.stream_url.dub;
            pb.data.streamtype="dub";
          }
          else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
            is_soft=true;
          }
        }
        if (is_soft||_API.currentStreamType==1){
          if (pb.data.stream_url.soft){
            pb.data.stream_vurl = pb.data.stream_url.soft;
            pb.data.streamtype="softsub";
          }
        }
        pb.updateStreamTypeInfo();
        wave.vidplayGetData(pb.data.stream_vurl,function(r){
          if (r && r.result && r.result.sources){
            pb.video_tmp_start_pos=pb.startpos_val;
            if (pb.mediainfo_callback(r)){
              return;
            }
          }
          pb.init_video_vidcloud();
        });
      }
    });
  },

  flix_load_video_url:function(dd,loadss,cb){
    var u=dd.stream_vurl;
    if (!u){
      return;
    }
    /* Load Player */
    function videoLoaded(r){
      if (r.ok){
        var play_data={
          subs:[],
          pos:[[0,0],[0,0]]
        };

        // Parsing Player HTML
        var d=$n('div','',null,null,r.responseText);
        var srcscript=d.querySelectorAll('script')[1];
        if (!srcscript){
          console.log("Player HTML Failed = "+r.responseText);
          d.innerHTML='';
          return false;
        }
        var iscript = srcscript.innerText;
        
        // Load Subtitles:
        (function(){
          if (loadss){
            try{
              var subs=d.querySelectorAll('video#player track');
              var i,l=subs.length;
              for (i=0;i<l;i++){
                var sb=subs[i];
                var sd={};
                if (sb.getAttribute('kind')=='captions'){
                  sd.u=sb.getAttribute('id');
                  sd.l=sb.getAttribute('label');
                  sd.l=sd.l?(sd.l.toLowerCase().trim()):'';
                  sd.i=sb.getAttribute('srclang');
                  play_data.subs.push(sd);
                }
              }
            }catch(e){}
          }
        })();

        // Get M3U8 URL
        (function(){
          // console.log("RUN SCRIPT\n"+iscript);
          try{
            window.Hls=function(c){
              this.loadSource=function(x){
                if (c && ('xhrSetup' in c)){
                  var kv={
                    open:function(m,u,t){
                      play_data.url=u;
                      console.warn("GOT PLAY DATA XHRSETUP = "+play_data.url);
                    }
                  };
                  c.xhrSetup(kv,x);
                  return;
                }
                play_data.url=x;
                console.warn("GOT PLAY DATA = "+x);
              };
              this.on=function(a,b){};
              this.attachMedia=function(x){};
            }
            Hls.isSupported=function(){return true};
            Hls.Events={
              MANIFEST_PARSED:1,
              LEVEL_SWITCHED:2,
              ERROR:3
            };
            var abg=$('animebg');
            /* Create dummy video tag */
            var vid_tmp=$n('video','',{'id':'player'},abg,'');
            console.log(iscript);
            eval(iscript+`
            play_data.pos[0]=[introstart&&introend?introstart:0,introstart&&introend?introend:0];
            play_data.pos[1]=[outrostart&&outroend?outrostart:0,outrostart&&outroend?outroend:0];
            `);
            abg.removeChild(vid_tmp);
            delete window.Hls;
            delete window.hls;
          }catch(e){
            console.log("Error Eval : "+e);
          }
        })();

        // Cleanup
        d.innerHTML='';
        d=null;

        // Playing:
        if (play_data.url){
          // Set Skip Time
          dd.skip=JSON.parse(JSON.stringify(play_data.pos));

          // Loading Subtitle
          if (loadss){
            vtt.clear();
            pb.subtitles=JSON.parse(JSON.stringify(play_data.subs));
            vtt.init(pb.subtitles);
          }

          // Save Video Data
          dd.play_data=play_data;
          dd.vizm3u8=pb.data.play_data.url;

          // Run Callback
          cb();
          return true;
        }
      }
      pb.playback_error(
        'PLAYBACK ERROR',
        "Loading video from source failed.\tTry to restart it."
      );
      return false;
    }
    function reqPlayer(nc){
      __AFLIX.req(u,function(r){
        if (r.ok){
          if (!videoLoaded(r)){
            if (++nc<5){
              setTimeout(function(){
                reqPlayer(1);
              },500);
            }
            else{
              _API.showToast("Loading video failed...");
            }
          }
        }
      });
    }
    reqPlayer(0);
  },
  flix_play_video:function(){
    pb.pb_vid.innerHTML='';
    pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
    _API.setMessage(null);
    // _JSAPI._API(pb.data.play_data.url);
    pb.init_video_mp4upload(pb.data.play_data.url);
  },
  flix_load_video:function(dd,loadss,cb){
    dd.stream_vurl = dd.stream_sub_url;
    dd.streamtype="softsub";
    if (_API.currentStreamType==2){
      if (dd.stream_dub_url){
        dd.stream_vurl = dd.stream_dub_url;
        dd.streamtype="dub";
      }
    }
    pb.flix_load_video_url(dd,loadss,cb);
  },

  /* view data */
  data:null,
  ep_title:'',
  ep_num:'',
  ep_index:-1,
  lastkey:0,
  state:0,

  /* Preload Next Episode data & video */
  preload_episode:null,
  preload_episode_video:null,
  preload_started:0,
  preload_video_started:0,
  preload_ep:function(){
    if (pb.preload_started==0){
      pb.preload_started=1;
      if (pb.ep_index<pb.data.ep.length-1){
        var next_id=pb.ep_index+1;
        var sel_id=-1;
        if (pb.cfg('skipfiller')){
          for (var i=next_id;i<pb.data.ep.length;i++){
            if (!pb.data.ep[i].filler){
              sel_id=i;
              break;
            }
          }
        }else{
          sel_id=next_id;
        }
        if (sel_id>-1){
          var epd=pb.data.ep[sel_id];
          console.log('Preloading Episode = '+sel_id+' -> '+epd.url);
          var uid=_API.getView(epd.url,function(d,u){
            if (uid==u && d.status){
              pb.preload_episode_video=null;
              pb.preload_episode={
                'u':epd.url,
                'd':d
              };
              console.log('Next EP Preloaded = '+sel_id);
              if (/*!pb.cfg_data.html5player&&*/!__SD5&&!__SD6 &&!html5video() ){
                pb.preload_video_started=1;
                _API.setVizPageCb(null);
                _API.setMessage(null);

                function preloadVidCb(d2){
                  try{
                    _API.setVizCb(null);
                    pb.preload_episode_video={
                      'u':epd.url,
                      'd':d2
                    };
                    console.log('Next EP Video Preloaded = '+JSON.stringify(d2));
                    pb.pb_vid.innerHTML='';
                    setTimeout(function(){
                      pb.preload_video_started=0;
                    },500);
                    return true;
                  }catch(ee){}
                  return false;
                }
                
                pb.pb_vid.innerHTML='';
                if (__SD==1 || __SD==2){
                  wave.vidplayGetData(d.stream_vurl,function(r){
                    if (r && r.result && r.result.sources){
                      if (preloadVidCb(r)){
                        return;
                      }
                    }
                    _API.setVizCb(preloadVidCb);
                    $n('iframe','',{src:d.stream_vurl+(__SD5?"":""),frameborder:'0'},pb.pb_vid,'');
                  });
                  // $n('iframe','',{src:d.stream_vurl+(__SD5?"":"#NOPLAY"),frameborder:'0'},pb.pb_vid,'');
                }
                else if (__SD3){
                  _API.setVizCb(preloadVidCb);
                  pb.hiLoadVideo(d, false, function(){
                    $n('iframe','',{src:d.stream_vurl,frameborder:'0'},pb.pb_vid,'');
                  });
                }
              }
            }
          });
        }
      }
    }
  },

  hiLoadVideo:function(dt,loadSubtitle,cb){
    var st=_API.currentStreamType;
    var uid=0;
    var ut="sub";
    var valid=false;
    var subvalid=false;
    if (st==2||pb.cfg_data.dubaudio){
      if (dt.ep_servers.dub.length>0){
        ut="dub";
        dt.streamtype="dub";
        valid=true;
        subvalid=true;
      }
    }
    if (!valid || pb.cfg_data.dubaudio){
      if (dt.ep_servers.sub.length>0){
        ut="sub";
        dt.streamtype="softsub";
      }
      else if (dt.ep_servers.raw.length>0){
        ut="raw";
        dt.streamtype="softsub";
      }
      else{
        ut="dub";
        dt.streamtype="dub";
      }
    }

    if (dt.ep_servers[ut].length>0){
      for (var i=0;i<dt.ep_servers[ut].length;i++){
        var q=dt.ep_servers[ut][i];
        if (q.server==1||q.server==4){
          if (pb.server_selected(1) && uid!=0){
            uid=i;
          }
          else if (uid==0){
            uid=i;
          }
        }
      }
      var subuid=uid;
      var subut=ut;
      if (subvalid && (ut!="dub")){
        ut="dub";
        var dubuid=0;
        for (var i=0;i<dt.ep_servers[ut].length;i++){
          var q=dt.ep_servers[ut][i];
          if (q.server==1||q.server==4){
            if (pb.server_selected(1) && dubuid!=0){
              dubuid=i;
            }
            else if (uid==0){
              dubuid=i;
            }
          }
        }
        uid=dubuid;
      }

      var seld = dt.ep_servers[ut][uid];
      if (__SD_DOMAIN){
        dt.stream_vurl = "https://"+__SD_DOMAIN+"/__REDIRECT#"+seld.link;
      }
      else{
        dt.stream_vurl = seld.link;
      }
      dt.ep_stream_sel = seld;
      var subld = dt.ep_servers[subut][subuid];
      console.log("GOT-VIDEO-IFRAME-URL : "+seld.link);
      console.log("GOT-SUB-URL : "+subld.link+" LOAD SUB: "+loadSubtitle);

      // Get Video Data
      if (loadSubtitle){
        function initSubtitle(){
          $a('/__cache_subtitle?t='+$tick(),function(r){
            if (r.ok){
              if (r.responseText){
                try{
                  var jv=JSON.parse(r.responseText);
                  /* Load Intro / Outro */
                  try{
                    var st=jv.intro.start;
                    var en=jv.intro.end;
                    var sto=jv.outro.start;
                    var eno=jv.outro.end;
                    dt.skip=[
                      [st?st:0,en?en:0],
                      [sto?sto:0,eno?eno:0]
                    ];
                  }catch(e){}
                  
                  /* Load Subtitle */
                  vtt.clear();
                  pb.subtitles=[];
                  window.__subtitle=pb.subtitles;
                  try{
                    if (jv.tracks){
                      var n=jv.tracks.length;
                      for (var i=0;i<n;i++){
                        var tk=jv.tracks[i];
                        if (tk.kind=='captions'){
                          pb.subtitles.push({
                            u:tk.file,
                            d:tk.default?1:0,
                            l:(tk.label+'').toLowerCase().trim()
                          });
                        }
                      }
                      vtt.init(pb.subtitles);
                    }
                  }catch(e){}
                }catch(ee){}
              }
              else{
                setTimeout(initSubtitle,500);
              }
            }
          });
        }
        $a('/__cache_subtitle/clear?t='+$tick(),function(r){
          setTimeout(initSubtitle,500);
        });
        
      }
      cb();
      return;
    }
    pb.playback_error(
      'PLAYBACK ERROR',
      "Loading video from source failed.\tTry changing mirror or check source server."
    );
  },

  /* next ep */
  next_ep:function(fn){
    /* autonext */
    if (pb.cfg('autonext')||fn){
      if (!fn){
        fn=1;
      }
      var next_id = pb.ep_index + fn; 
      if (next_id>=0 && next_id<pb.data.ep.length){
        var sel_id=-1;
        /* skip filler */
        if (pb.cfg('skipfiller')){
          for (var i=next_id;(((fn<0)&&i>=0)||((fn>0)&&i<pb.data.ep.length));i+=fn){
            if (!pb.data.ep[i].filler){
              sel_id=i;
              break;
            }
          }
        }else{
          sel_id=next_id;
        }
        if (sel_id>-1){
          var epd=pb.data.ep[sel_id];
          action_value=epd.url;
          if (__SD3||__SD5||__SD6){
            action_value='>'+epd.url;
          }
          pb.action_handler(action_value,';1');
        }
      }
    }
  },

  /* action command handler */
  action_handler:function(action,arg){
    if (!action) return false;
    console.log("action_handler -> "+action+" / "+arg);
    if (action.startsWith("http")||action.startsWith(">")){
      var args=[0,0,0];
      if (arg)
        args=arg.split(';');
      var startpos=0;
      if (args.length>=3) startpos=parseInt(args[2]);
      var url=action;
      if (action.startsWith(">")){
        url=action.substring(1);
      }
      pb.open(url, args[0], parseInt(args[1]), startpos);
      return true;
    }
    else if (action.startsWith("!")){
      var src=action.substring(1);
      home.search.open({
        genre:src
      });
      pb.reset(1,0);
    }
    else if (action.startsWith("@")){
      var src=action.substring(1);
      home.search.open({
        genre:'_'+src
      });
      pb.reset(1,0);
    }
    else if (action.startsWith("#")){
      /* Mal Action */
      var id=action.substring(1);
      _MAL.action_handler(id);
    }
    else if (action.startsWith("$")){
      /* Preview Popup Action Handler */
      var data=action.substring(1);
      _MAL.prev_action_handler(data,arg);
    }
    else if (action.startsWith("*")){
      var key=action.substring(1);
      console.log("ACTION SETTINGS = "+key);
      if (key=="fav"){
        if (list.fav_exists(pb.data.animeid)){
          list.fav_del(pb.data.animeid);
        }
        else{
          list.fav_add(pb.data.animeid,pb.listobj(),true);
        }
        pb.cfg_update_el(key);
      }
      else if (key=="tracking"){
        pb.MAL_TRACK(true);
      }
      else if (key=='lang'){
        home.settings.lang_action();
      }
      else if (key=='theme'){
        var tl=[];
        for (var i=0;i<pb.cfgtheme_name.length;i++){
          var t=pb.cfgtheme_name[i];
          var c=_API.theme_list[i];
          var v=special(t)+
            '<span class="theme_preview '+c+'">'+
              '<b class="p1"></b><b class="p2"></b><b class="p3"></b><b class="a"></b>'
            '</span>';
            tl.push(v);
        }
        listOrder.showList(
          "Interface Color",
          tl, /*pb.cfgtheme_name,*/
          _API.theme_sel,
          function(chval){
            if (chval!=null){
              _API.theme_sel=toInt(chval);
              _JSAPI.storeSet(_API.user_prefix+"theme", _API.theme_list[_API.theme_sel]);
              _API.theme_update();
              pb.cfg_update_el(key);
            }
          },
          true
        );
      }
      else if (key=='settings'){
        home.settings.open(1);
      }
      else if (key=='donate'){
        if (home.onsettings){
          home.settings.open_donation(1);
        }
      }
      else if (key=='ytchannel'){
        if (home.onsettings){
          _JSAPI.openIntentUri('https://www.youtube.com/@amarullz');
        }
      }
      else if (key=='exportcsv'){
        if ('goToUrl' in _JSAPI){
          _JSAPI.goToUrl('https://aniwave.to/__view/export.html');
        }
        else{
          location='https://aniwave.to/__view/export.html';
        }
      }
      else if (key=='discord'){
        if (home.onsettings){
          home.settings.open_donation(0);
        }
      }
      else if (key=='checkupdate'){
        if (home.onsettings){
          _API.checkUpdate();
        }
      }
      else if (key=='checknightly'){
        if (home.onsettings){
          _API.checkNightly();
        }
      }
      else if (key=="miruroprovider"){
        var prev_provider = miruro.provider;
        miruro.beforeChangeSource(function(v){
          if (prev_provider!=miruro.provider){
            pb.cfg_update_el(key);
            pb.reloadPlayback(1000);
          }
        });
      }
      else if (key=="streamselect"){
        if (!__SD3&&!__SD5/*&&!__SD6*/){
          var lst=['Hardsub'];
          var lstVal=[0];
          var cCheck=0;
          if (pb.data.stream_url.soft){
            if (_API.currentStreamType==1){
              cCheck=lstVal.length;
            }
            lst.push('Softsub');
            lstVal.push(1);
          }
          if (pb.data.stream_url.dub){
            if (_API.currentStreamType==2){
              cCheck=lstVal.length;
            }
            lst.push('Dub');
            lstVal.push(2);
          }
          listOrder.showList(
            "Stream Type",
            lst,
            cCheck,
            function(chval){
              if (chval!=null){
                _API.setStreamTypeValue(lstVal[chval],1);
                pb.reinit_video_delay(100,false);
                pb.cfg_update_el(key);
              }
            }
          );
        }
      }
      else if (key=="hardsub" || key=="softsub"|| key=="dub"){
        var sel=0;
        if (key=="softsub") sel=1;
        else if (key=="dub") sel=2;
        if (_API.currentStreamType!=sel){
          _API.setStreamTypeValue(sel,1);
          pb.reinit_video_delay(100,false);
        }
      }
      else if (key=="speed"){
        var vlist=[];
        var flist=[];
        var fn=0;
        var vs=0;
        for (var i=0;i<10;i++){
          fn+=0.25;
          if (fn==_API.vidSpeed){
            vs=i;
          }
          flist.push(fn);
          vlist.push(fn+"x");
        }
        listOrder.showList(
          "Playback Speed",
          vlist,vs,
          function(chval){
            if (chval!==null){
              _API.vidSpeed=flist[toInt(chval)];
              if (html5video()/*||pb.cfg_data.html5player*/){
                pb.vid_cmd('speed',_API.vidSpeed);
              }
              else{
              _API.videoSpeed(_API.vidSpeed);
              }
              pb.cfg_update_el(key);
            }
          },
          true
        );
      }
      else if (key=="quality"){
        var vlist=[];
        for (var i=0;i<pb.cfgquality_name.length;i++){
          if (i!=0 && pb.state && pb.data.vsources && pb.data.vsources.length>i){
            vlist.push('<span class="label">'+special(pb.cfgquality_name[i]+'')+
              '</span><span class="value vinline">'+
              special(pb.data.vsources[i].r+'')+
              "</span>"
            );
          }
          else{
            vlist.push(special(pb.cfgquality_name[i]+''));
          }
        }
        listOrder.showList(
          "Video Quality",
          vlist,
          pb.cfg_data.quality,
          function(chval){
            if (chval!=null){
              pb.cfg_data.quality=toInt(chval);
              pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
              pb.cfg_update_el(key);
              pb.cfg_save();
              if (pb.state){
                pb.reinit_video_delay(1000,true);
              }
            }
          },
          true
        );
      }
      else if (key=="animation"){
        // pb.state=0;
        listOrder.showList(
          "Transition Animation",
          pb.cfganimation_name,
          pb.cfg_data.animation,
          function(chval){
            if (chval!=null){
              pb.cfg_data.animation=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
              pb.updateanimation();
            }
          },
          true
        );
      }
      else if (key=="trailer"){
        // pb.state=0;
        listOrder.showList(
          "Play Trailer",
          pb.cfgtrailer_name,
          pb.cfg_data.trailer,
          function(chval){
            if (chval!=null){
              pb.cfg_data.trailer=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
            }
          }
        );
      }
      else if (key=="closeconfirm"){
        // pb.state=0;
        listOrder.showList(
          "Close Confirmation",
          pb.cfgcloseconfirm_name,
          pb.cfg_data.closeconfirm,
          function(chval){
            if (chval!=null){
              pb.cfg_data.closeconfirm=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
            }
          }
        );
      }
      else if (key=="uifontsize"){
        // pb.state=0;
        listOrder.showList(
          "Font Size",
          pb.cfguifontsize_name,
          pb.cfg_data.uifontsize,
          function(chval){
            if (chval!=null){
              pb.cfg_data.uifontsize=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
              pb.updateanimation();
            }
          }
        );
      }
      else if (key=="seekvalue"){
        var lst=[];
        var lstx=[];
        var lsel=0;
        var n=0;
        for (var i=2;i<=20;i++){
          if (i==pb.cfg_data.seekvalue){
            lsel=n;
          }
          lstx.push(i+" seconds");
          lst.push(i);
          n++;
        }
        // pb.state=0;
        listOrder.showList(
          "Seek Value",
          lstx,
          lsel,
          function(chval){
            if (chval!==null){
              pb.cfg_data.seekvalue=toInt(lst[chval]);
              pb.cfg_update_el(key);
              pb.cfg_save();
            }
          }
        );
      }
      else if (key=="loginscreen"){
        var ls=toInt(_JSAPI.storeGet("loginstyle","1"));
        if (ls<0||ls>2){
          ls=1;
        }
        listOrder.showList(
          "Login Screen Style",
          pb.cfgloginscreen_name,
          ls,
          function(chval){
            if (chval!=null){
              ls=toInt(chval);
              _JSAPI.storeSet("loginstyle",ls+"");
              pb.cfg_update_el(key);
            }
          }
        );
      }
      else if (key=="exitmode"){
        var ls=toInt(_JSAPI.storeGet("exitmode","0"));
        if (ls<0||ls>4){
          ls=0;
        }
        listOrder.showList(
          "Exit Mode",
          pb.cfgexitmode_name,
          ls,
          function(chval){
            if (chval!=null){
              ls=toInt(chval);
              _JSAPI.storeSet("exitmode",ls+"");
              pb.cfg_update_el(key);
            }
          }
        );
      }
      else if (key=="initwinstate"){
        var ls=toInt(_JSAPI.varGet("initwinstate","0"));
        if (ls<0||ls>2){
          ls=0;
        }
        listOrder.showList(
          "Initial Window State",
          pb.cfginitwinstate_name,
          ls,
          function(chval){
            if (chval!=null){
              ls=toInt(chval);
              _JSAPI.storeSet("initwinstate",ls+"");
              _JSAPI.varSet("initwinstate",ls+"");
              pb.cfg_update_el(key);
            }
          }
        );
      }

      else if (key=="httpclient"){
        // pb.state=0;
        listOrder.showList(
          _ISELECTRON?"DoH Provider":"HTTP Client",
          _ISELECTRON?pb.cfghttpclient_electron_name:pb.cfghttpclient_name,
          pb.cfg_data.httpclient,
          function(chval){
            if (chval!=null){
              pb.cfg_data.httpclient=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_update_el('usedoh');
              pb.cfg_save();
              _JSAPI.setHttpClient(pb.cfg_data.httpclient);
            }
          }
        );
      }
      else if (key=="listprog"){
        // pb.state=0;
        listOrder.showList(
          "Update watch progress",
          pb.cfglistprog_name,
          pb.cfg_data.listprog,
          function(chval){
            if (chval!=null){
              pb.cfg_data.listprog=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
            }
          }
        );
      }
      else if (key=="maltrackdialog"){
        listOrder.showList(
          "Auto Tracking",
          pb.cfgmaltrackdialog_name,
          pb.cfg_data.maltrackdialog,
          function(chval){
            if (chval!=null){
              pb.cfg_data.maltrackdialog=toInt(chval);
              pb.cfg_update_el(key);
              pb.cfg_save();
            }
          }
        );
      }
      else if (key=="ccstyle"){
        vtt.changestyle();
      }
      else if (key=="alang"){
        listOrder.showList(
          "Audio Language",
          _API.audiolang_titles(pb.state?true:false),
          _API.audiolang_getindex(pb.cfg_data.alang),
          function(chval){
            if (chval!=null){
              pb.cfg_data.alang=_API.audiolang[chval][1];
              pb.cfg_update_el(key);
              pb.cfg_save();
              _API.videoAudioTrack(pb.cfg_data.alang,pb.state?true:false);
              //-- Should Set Audio Language
            }
          },
          true
        );
      }
      else if (key=="bgimg"){
        // pb.state=0;
        if (!_API.wallpaper_list_onload){
          _API.wallpaper_list_onload=true;
          listOrder.showImgPicker(
            "Select Wallpaper",
            function(page,cb){
              var n=2;
              var anilistRes=null;
              function start_list(){
                if (n<1){
                  requestAnimationFrame(function(){
                    var o={
                      havenext:false,
                      data:[{
                        src:"",
                        title:"No Wallpaper",
                        rsrc:""
                      }]
                    };
                    var have_active=false;
                    if (anilistRes!=null){
                      var vo={
                        src:anilistRes,
                        title:"AniList Banner",
                        rsrc:anilistRes
                      };
                      if (pb.cfg_data.bgimg.src && pb.cfg_data.bgimg.src==vo.src){
                        vo.active=true;
                        have_active=true;
                      }
                      o.data.push(vo);
                    }
                    for (var i=0;i<_API.wallpaper_data.length;i++){
                      var vo={
                        src:_API.wallpaper_base+"thumbs/"+_API.wallpaper_data[i].src,
                        title:_API.wallpaper_data[i].title,
                        rsrc:_API.wallpaper_data[i].src
                      };
                      if (pb.cfg_data.bgimg.src && pb.cfg_data.bgimg.src==_API.wallpaper_data[i].src){
                        vo.active=true;
                        have_active=true;
                      }
                      o.data.push(vo);
                    }
                    if (!have_active){
                      o.data[0].active=true;
                    }
                    cb(o);
                  });
                }
              }
              _API.wallpaper_list(function(){
                n--;
                start_list();
              });
              _MAL.getAlBanner(function(c){
                anilistRes=c;
                n--;
                start_list();
              });
              return true;
            },
            function(r){
              if (r!=null){
                pb.cfg_data.bgimg=JSON.parse(JSON.stringify({
                  "src":r.rsrc,
                  "title":r.title
                }));
                pb.cfg_update_el(key);
                pb.cfg_save();
                _API.bgimg_update();
              }
              _API.wallpaper_list_onload=false;
            }
          );
        }
      }
      else if (key=='nonjapan'){
        // Update Home
        pb.cfg_data.nonjapan=!pb.cfg_data.nonjapan;
        pb.cfg_update_el(key);
        pb.cfg_save();
        home.settings.needreload=true;
      }
      else if (key=='alisthomess'){
        // Update Home
        pb.cfg_data.alisthomess=!pb.cfg_data.alisthomess;
        pb.cfg_update_el(key);
        pb.cfg_save();
        home.settings.needreload=true;
      }
      else if (key=='alisthqbanner'){
        // Update Home
        pb.cfg_data.alisthqbanner=!pb.cfg_data.alisthqbanner;
        pb.cfg_update_el(key);
        pb.cfg_save();
        home.settings.needreload=true;
      }
      else if (key=='jptitle'){
        // Update Home
        pb.cfg_data.jptitle=!pb.cfg_data.jptitle;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='progcache'){
        // Update Home
        pb.cfg_data.progcache=!pb.cfg_data.progcache;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='usedoh'){
        // Update Home
        pb.cfg_data.usedoh=!pb.cfg_data.usedoh;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      // else if (key=='compactlist'){
      //   // Update Home
      //   pb.cfg_data.compactlist=!pb.cfg_data.compactlist;
      //   pb.cfg_update_el(key);
      //   pb.cfg_save();
      //   pb.updateanimation();
      // }
      else if (key=='largeui'){
        // Update Home
        pb.cfg_data.largeui=!pb.cfg_data.largeui;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='directsidebar'){
        // Update Home
        pb.cfg_data.directsidebar=!pb.cfg_data.directsidebar;
        pb.cfg_update_el(key);
        pb.cfg_save();
        home.init_sidebar_mode();
      }
      else if (key=='showclock'){
        // Update Home
        pb.cfg_data.showclock=!pb.cfg_data.showclock;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='useimgcdn'){
        // Update Home
        __IMGCDNL=(__IMGCDNL==1)?0:1;
        _JSAPI.storeSet("imgcdnl",__IMGCDNL+'');
        pb.cfg_update_el(key);
      }
      else if (key=='cachesz'){
        var csz=_JSAPI.getCacheSz();
        var sel=6;
        var opt=[
          5,10,20,30,50,80,100,120,150
        ];
        var opttxt=["Clear Cache"];
        for (var i=0;i<opt.length;i++){
          if (opt[i]==csz){
            sel=i+1;
          }
          opttxt.push((opt[i])+" MB");
        }
        // Update Home
        listOrder.showList(
          "Cache Size",
          opttxt,
          sel,
          function(chval){
            if (chval!=null){
              if (chval>0){
                var newsz=opt[chval-1]
                _JSAPI.setCacheSz(newsz);
                pb.cfg_update_el(key);
              }
              else{
                _API.confirm("Clear Cache","Clear AnimeTV Cache?",function(cnf){
                  if (cnf){
                    _JSAPI.clearCache();
                  }
                });
              }
            }
          }
        );
        try{
          listOrder.group.P.firstElementChild.firstElementChild.innerHTML='delete_forever';
          listOrder.group.P.firstElementChild.firstElementChild.classList.remove('radio');
        }catch(e){}
      }
      else if (key=='performance'){
        // pb.cfg_data.performance=!pb.cfg_data.performance;
        // pb.cfg_update_el(key);
        // pb.cfg_save();
        // pb.updateanimation();
        listOrder.showMulti(
          "Performance UI",
          pb.cfgperformance_name,
          pb.cfg_data.performance,
          function(chval){
            if (chval!=null){
              pb.cfg_data.performance=chval;
              pb.cfg_update_el(key);
              pb.cfg_save();
              pb.updateanimation();
            }
          },
          pb.cfgperformance_icon,
          true
        )
        // var chval=_API.listPrompt(
        //   "Performance UI",
        //   pb.cfgperformance_name,
        //   pb.cfg_data.performance
        // );
        // if (chval!=null){
        //   pb.cfg_data.performance=JSON.parse(chval);
        //   pb.cfg_update_el(key);
        //   pb.cfg_save();
        //   pb.updateanimation();
        // }
      }
      else if (key=='mirrorserver'){
        if (pb.server_ismulti()){
          var sv=[];
          pb.data.servers[pb.data.streamtype].sort(function(a,b){
            return toInt(a.p)-toInt(b.p)
          });
          var vr=pb.data.servers[pb.data.streamtype];
          var sel=0;
          for (var i=0;i<vr.length;i++){
            sv.push(vr[i].n);
            if (vr[i].p==pb.cfg_data.mirrorserver){
              sel=i;
            }
          }
          listOrder.showList(
            "Stream Server",
            sv,
            sel,
            function(chval){
              if (chval!=null){
                pb.cfg_data.mirrorserver=toInt(chval);
                pb.cfg_update_el(key);
                pb.cfg_save();
                if (pb.state){
                  pb.reloadPlayback(1000);
                }
              }
            }
          );
        }
        else{
          listOrder.showList(
            "Stream Server",
            ["Main","Mirror"],
            pb.cfg_data.mirrorserver?1:0,
            function(chval){
              if (chval!=null){
                pb.cfg_data.mirrorserver=toInt(chval);
                pb.cfg_update_el(key);
                pb.cfg_save();
                if (pb.state){
                  pb.reloadPlayback(1000);
                }
              }
            }
          );
        }
      }
      else if (key=='malaccount'){
        _MAL.login();
      }
      else if (key=='anilistaccount'){
        _MAL.login(1);
      }
      else if (key in pb.cfg_data){
        if (key=="server"){
          if (pb.state){
            pb.state=0;
            if (++pb.cfg_data.server>2) pb.cfg_data.server=0;
            pb.cfg_update_el(key);
            pb.cfg_save();
            pb.startpos_val=pb.vid_stat.pos;
            pb.init_video();
          }
        }
        else if (key=="scale"){
          listOrder.showList(
            "Video Scaling",
            pb.cfgscale_name,
            pb.cfg_data.scale,
            function(chval){
              if (chval!=null){
                pb.cfg_data.scale=toInt(chval);
                pb.cfg_update_el(key);
                pb.cfg_save();
                _API.videoScale(pb.cfg_data.scale);
                pb.vid_cmd('scale',pb.cfg_data.scale);
              }
            }
          );
        }
        else{
          pb.cfg_data[key]=!pb.cfg_data[key];
          pb.cfg_update_el(key);
          pb.cfg_save();

          /* check actions */
          if (key=='dubaudio'){
            if (pb.state){
              pb.reloadPlayback(1000);
            }
          }
          else if (key=='html5player'){
            if (!_ISELECTRON){
              try{
                _JSAPI.videoSetUrl("");
              }catch(e){}
              pb.pb_vid.innerHTML='';
              pb.reloadPlayback(1000);
            }
          }
        }
      }
    }
    else{
      /* Default */
      var args=[0,0,0];
      if (arg){
        args=arg.split(';');
      }
      var startpos=0;
      if (args.length>=3){
        startpos=parseInt(args[2]);
      }
      var url=action;
      pb.open(url, args[0], parseInt(args[1]), startpos);
      return true;
    }
    return true;
  },

  action_handler_el:function(el){
    try{
      var action=el.getAttribute('action');
      var arg=el.getAttribute('arg');
      return pb.action_handler(action,arg);
    }catch(e){}
    return false;
  },

  /* init menu */
  menu_clear:function(g){
    if ('P' in g){
      g.P.innerHTML='';
    }
    else{
      g.innerHTML='';
      g.P=$n('p','',0,g,'');
    }
  },

  /* menu selection */
  menu_select:function(g,n){
    if (n){
      var fc=g.P.firstElementChild;
      if (!fc) return false;
      if (!g._midx) g._midx=2;
      if (!g.__update){
        g.__update=function(){
          if (g._sel){
            g._sel.classList.remove('active');
            if (g._sel._activeCb){
              g._sel._activeCb(g._sel,false);
            }
            if (g._sel._n_pager){
              g._sel._n_pager.classList.remove('active');
            }
          }
          var n = g._target_n;
          if (n._n_pager){
            n._n_pager.classList.add('active');
          }
          n.classList.add('active');
          if (n._activeCb){
            n._activeCb(n, true);
          }
          if (g._midx>0 && !g._noscroll){
            var iw=0;
            iw=window.outerWidth/g._midx;
            var ow=(g._itemwidth)?g._itemwidth():n.offsetWidth;
            var xpos=n.offsetLeft+(ow/2);
            if (xpos>iw){
              g._margin=xpos-iw;
              g.classList.add('maskleft');
            }
            else{
              g._margin=0;
              g.classList.remove('maskleft');
            }
            if (_TOUCH){
              g.P.style.transform='';
              // if (g._margin)
              //   g.scrollLeft=g._margin;
              // else
              //   g.scrollLeft=0;
              if (g.classList.contains('active')){
                if (g._margin)
                  $scroll(g,g._margin,true);
                else
                  $scroll(g,0,true);
              }
            }
            else{
              if (g._margin)
                g.P.style.transform='translateX(-'+g._margin+'px)';
              else
                g.P.style.transform='translateX(0)';
            }
          }
          g._noscroll=false;
          g._sel=n;
        };
      }
      g._target_n=n;
      fc.ontransitionend=function(){
        requestAnimationFrame(g.__update);
        fc.ontransitionend=null;
      };
      requestAnimationFrame(g.__update);
      return true;
    }
    return false;
  },

  menu_arrow_click:function(){
    var g=this.parentElement.parentElement;
    if (this.classList.contains('right')){
      if (g.scrollLeft<g.scrollWidth){
        g._noscroll=true;
        $scroll(g,g.scrollLeft+window.outerWidth*0.5,1,100);
      }
    }
    else{
      if (g.scrollLeft>0){
        g._noscroll=true;
        $scroll(g,g.scrollLeft-window.outerWidth*0.5,1,100);
      }
    }
  },
  menu_arrow_wheel:function(ev){
    var g=this;
    if (!this.P){
      g=this.parentElement.parentElement;
    }
    if (ev.deltaY<0){
      $scroll(g,g.scrollLeft+ev.deltaY,1,-1);
    }
    else if (ev.deltaY>0){
      $scroll(g,g.scrollLeft+ev.deltaY,1,-1);
    }
    ev.preventDefault();
    ev.stopPropagation();
  },

  /* menu key handler */
  menu_init:function(g){
    g._keycb=pb.menu_keycb;
    g._scrollLast=0;
    g.___hover=0;
    g.onscrollend=function(){
      if (this.scrollLeft>=this.scrollWidth-(this.offsetWidth*1.2)){
        if (this._scrollLast!=this.scrollWidth){
          this._scrollLast=this.scrollWidth;
          if (this._edgecb){
            this._edgecb(this);
          }
        }
      }
      if (g.P.style.transform){
        g.P.style.transform='';
      }
    };
    g.onclick=function(e){
      var el=e.target;
      while(el){
        if (el.parentElement==this.P){
          break;
        }
        el=el.parentElement;
      }
      if (el){
        this._noscroll=true;
        this._target_n=el;
        this.__update();
        pb.menu_keycb(this,KENTER,2);
      }
    };
    g.onmouseover=function(){
      if (!this.___arrows){
        if (this.classList.contains('home_list')){
          this.___arrows=$n('div','home_list_arrows',null,null,'');
          this.insertBefore(this.___arrows,this.P);
          this.___arrows_right=$n('c','right',null,this.___arrows,'arrow_right');
          this.___arrows_left=$n('c','left',null,this.___arrows,'arrow_left');
          this.___arrows_right.onclick=this.___arrows_left.onclick=pb.menu_arrow_click;
          this.___arrows_right.addEventListener("wheel",pb.menu_arrow_wheel);
          this.___arrows_left.addEventListener("wheel",pb.menu_arrow_wheel);
          this.classList.add('onhover');
        }
        else if (_ISELECTRON && this.classList.contains('pb_menu')){
          this.addEventListener("wheel",pb.menu_arrow_wheel);
        }
      }
      else{
        this.classList.add('onhover');
      }
    };
    g.onmouseout=function(){
      if (this.___arrows){
        this.classList.remove('onhover');
      }
    };
  },
  menu_keycb:function(g,c,z){
    var n=null;
    if (!('_margin' in g)){
      g._margin=0;
      g._reset=function(){
        var aniSel=g._sel;
        g._sel=null;
        requestAnimationFrame(function(){
          g._margin=0;
          aniSel.classList.remove('active');
          g.classList.remove('maskleft');
          g.P.style.transform='translateX(0)';
        });
      };
    }
    if (!g.firstElementChild) return false;
    if (c==KENTER){
      if (g._sel){
        var ret=false;
        if (z==2){
          g._isclick=true;
        }
        if (g._enter_cb)
          ret=g._enter_cb(g,g._sel);
        else{
          if (g._sel._enter_cb)
            ret=g._sel._enter_cb(g,g._sel);
          else
            ret=pb.action_handler_el(g._sel);
        }
        if (ret){
          clk();
        }
        g._isclick=false;
        return ret;
      }
    }
    else if (c==KLEFT){
      if (g._sel){
        if (g._sel.previousElementSibling)
          n=g._sel.previousElementSibling;
        else if (g.__prev){
          clk();
          g.__prev();
          return true;
        }
        else if (g._should_clear)
          g._reset();
        else if (g._cyclic)
          n=g.P.lastElementChild;
      }
    }
    else if (c==KRIGHT){
      if (g._sel){
        if (g._sel.nextElementSibling)
          n=g._sel.nextElementSibling;
        else if (g.__next){
          clk();
          g.__next();
          return true;
        }
        else if (g._cyclic)
          n=g.P.firstElementChild;
      }
      else
        n=g.P.firstElementChild;
    }
    else if (c==KPGUP || c==KPREV){
      if (g.__prev){
        clk();
        g.__prev();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.firstElementChild;
      }
    }
    else if (c==KPGDOWN || c==KNEXT){
      if (g.__next){
        clk();
        g.__next();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.lastElementChild;
      }
    }
    if (n){
      clk();
      if (g.__selectcb){
        g.__selectcb(g,n);
      }
      pb.menu_select(g,n);
      return true;
    }
    return false;
  },

  /* Main Menu Handlers */
  menus:[],
  menusel:0,
  menu_autohide_to:null,
  menu_hide_tick:0,
  menu_autohide:function(){
    var autohide_duration=2500;
    if (pb.state>1&&pb.vid_stat.play){
      clearTimeout(pb.menu_autohide_to);
      if (pb.lastkey+autohide_duration<$tick()){
        pb.menu_hide();
      }
      else{
        pb.menu_autohide_to=setTimeout(pb.menu_autohide,100);
      }
    }
  },
  menu_hide:function(){
    clearTimeout(pb.menu_autohide_to);
    // pb.menu_hide_tick=$tick();
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=0;
    pb.menus[pb.menusel].classList.add('active');
    pb.pb_meta.classList.remove('active');
    $('pb_actions').classList.remove('active');
    pb.pb_iactions.style.transform='';
    pb.pb.classList.remove('menushow');
    pb.skipauto_update(1);
    body.classList.add('playback_menu_hide');
    pb.pb._nocursor=1;
    try{
      pb.pb.onmousemove();
    }catch(e){}
  },
  menu_show:function(pos){
    body.classList.remove('playback_menu_hide');
    pb.pb.classList.add('menushow');
    pb.pb.classList.remove('nocursor');
    pb.pb._nocursor=0;
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=(pos===undefined?2:pos);
    pb.pb_actions.classList.add('active');
    pb.menus[pb.menusel].classList.add('active');
    pb.menu_update();
    pb.menu_autohide();
    pb.skipauto_update(0);
  },
  menu_update:function(){
    if (pb.menusel==2){
      pb.pb_touch_actions.classList.add('active');
    }
    else{
      pb.pb_touch_actions.classList.remove('active');
    }

    if (pb.menusel<=1){
      pb.pb_meta.classList.add('active');
      pb.pb_iactions.style.transform='';
      pb.pb_list.classList.remove('nomask');
      return;
    }
    else{
      pb.pb_meta.classList.remove('active');
    }
    var vh=0;
    if (pb.menusel<pb.menus.length-1){
      vh=(pb.menusel<pb.menus.length-1)?window.outerHeight/13:0;
      for (var i=2;((i<=pb.menusel)&&(i<pb.menus.length));i++){
        vh+=pb.menus[i].offsetHeight;
      }
    }
    else{
      vh=pb.pb_iactions.offsetHeight;
    }
    pb.pb_iactions.style.transform='translateY('+(window.outerHeight-vh)+'px)';
    if (pb.menus[pb.menusel]._sel){
      pb.menu_select(pb.menus[pb.menusel],pb.menus[pb.menusel]._sel);
    }
  },

  /* Track & Timings */
  track_keycb:function(g,c){
    if (c==KLEFT||c==KRIGHT){
      var fw=(_API.last_key_source==1&&c==KLEFT)||(_API.last_key_source!=1&&c==KRIGHT);
      var sv=0;
      if (fw)
        sv=pb.vid_get_time().position+pb.cfg_data.seekvalue;
      else{
        sv=pb.vid_get_time().position-pb.cfg_data.seekvalue;
        vtt.set('');
      }
      if (sv<0){
        sv=0;
      }
      pb.vid_cmd('seek',sv);
      pb.track_update_pos();
      if (!pb.pb.classList.contains('menushow')){
        var vi=(fw)?'fast_forward':'fast_rewind';
        var d=pb.vid_get_time();
        if (d.duration>0){
          var dr=(d.position/d.duration)*100.0;
          pb.osd('<c>'+vi+'</c> '+sec2ts(d.position,d.duration<3600)+' of '+sec2ts(d.duration,d.duration<3600)+
          '<div class="progress"><b style="width:'+dr+'%"></b></div>');
        }
      }
    }
    else if (c==KENTER){
      if (!pb.vid_stat.play)
        pb.vid_cmd('play',0);
      else
        pb.vid_cmd('pause',0);
    }
  },

  /* update Track */
  track_update_pos:function(){
    var d=pb.vid_get_time();
    var dur=d.duration;
    var pos=d.position;

    if (dur>0){
        var dr=(pos/dur)*100.0;
        pb.pb_track_val.style.width=dr+"%";
        pb.pb_track_pos.innerHTML=sec2ts(pos,dur<3600);
        pb.pb_track_dur.innerHTML=sec2ts(dur,dur<3600);
        pb.update_malist_ep(dr);
        // if (pb.cfg_data.preloadep && (dr>80) && (pb.preload_started==0)){
          //  pb.preload_ep();
        // }
    }
    else{
      pb.pb_track_val.style.width="0%";
      pb.pb_track_dur.innerHTML="";
    }
  },
  osd:function(v){
    if (pb.motions.osdto){
      clearTimeout(pb.motions.osdto);
      pb.motions.osdto=null;
    }
    pb.motions.osd.classList.add('active');
    pb.motions.osdi.innerHTML=v;
    pb.motions.osdto=setTimeout(function(){
      pb.motions.osd.classList.remove('active');
    },1500);
  },
  motions:{
    osd:$('pb_osd'),
    osdi:$('pb_osd_inner'),
    osdto:null,
    initialized:false,
    scroll_initialized:false,
    seekindicator:function(r){
      var si=$n('div','playback_seek_indicator '+(r?' right':''),null,pb.pb,'&nbsp;');
      setTimeout(function(){
        si.ontransitionend=function(){
          try{
            si.parentElement.removeChild(si);
            si=null;
          }catch(ee){}
        };
        si.classList.add('hide');
      },50);
    },
    evtarget:function(g){
      var m=pb.pb.__ev_target;
      while(m){
        if (m==pb.pb){
          return false;
        }
        else if (m==g){
          return true;
        }
        m=m.parentElement;
      }
      return false;
    },
    track_action:function(ev){
      var x=-1;
      if (ev.touches && ev.touches.length>0){
        x=ev.touches[0].clientX;
      }
      else if ('clientX' in ev){
        x=ev.clientX;
      }
      else if (pb.pb.__ev_x){
        x=pb.pb.__ev_x;
      }
      if (x>-1){
        var pbl=pb.pb_track.offsetLeft;
        var pbw=pb.pb_track.offsetWidth;
        var px = x-pbl;
        if (px>pbw){
          px=pbw;
        }
        if (px>0){
          var d=pb.vid_get_time();
          if (d.duration>0){
            var pos = (px * d.duration) / pbw;
            pb.vid_cmd('seek',pos);
            vtt.set('');
            pb.track_update_pos();
            console.log("SEEK: "+pos);
          }
        }
      }
    },
    init_scroll:function(){
      if (pb.motions.scroll_initialized){
        return;
      }
      pb.pb.__wheel_val=0;
      pb.pb.__wheel_tick=0;
      pb.pb.addEventListener("wheel", event => {
        if (pb.pb.__wheel_tick<$tick()){
          pb.pb.__wheel_val=0;
        }
        pb.pb.__wheel_tick=$tick()+1000;
        pb.pb.__wheel_val+=event.deltaY;
        if (pb.pb.__wheel_val <= -100)
        {
          pb.pb.__wheel_val=0;
          pb.keycb(KUP,1);
        }
        else if (pb.pb.__wheel_val >= 100)
        {
          pb.pb.__wheel_val=0;
          pb.keycb(KDOWN,1);
        }
      });
      pb.motions.scroll_initialized=true;
    },
    init:function(){
      pb.motions.init_scroll();

      if (pb.motions.initialized){
        return;
      }
      var me=pb.motions;
      

      touchHelper.gestureReg(pb.pb,function(c,evt){
        if (c==KUP || c==KDOWN){
          if (pb.pb.classList.contains('menushow')){
            _KEYEV(c);
          }
          else if (_ISELECTRON || pb.cfg_data.disablegesture){
            _KEYEV(c);
          }
          else{
            var x=pb.pb.__ev_x;
            var w=window.outerWidth;
            var w4=w/5;
            if (x<w4){
              var v=_JSAPI.setBrightness((c==KUP)?-10:10);
              var bv = Math.floor((v / 255.0) * 100);
              pb.osd('<c>light_mode</c> Brightness<div class="progress"><b style="width:'+bv+'%"></b></div>');
              pb.pb._minmove=window.outerWidth*0.01;
            }
            else if (x>w-w4){
              var v=_JSAPI.setVolume((c==KUP)?-10:10);
              var vi='volume_up';
              if (v==0){
                vi='volume_off';
              }
              else if (v<40){
                vi='volume_mute';
              }
              else if (v<70){
                vi='volume_down';
              }
              pb.osd('<c>'+vi+'</c> Volume<div class="progress"><b style="width:'+v+'%"></b></div>');
              pb.pb._minmove=window.outerWidth*0.01;
            }
            else{
              _KEYEV(c);
            }
          }
        }
        else if(c==KLEFT||c==KRIGHT){
          if (!pb.pb.classList.contains('menushow') && !pb.cfg_data.disablegesture){
            _API.last_key_source=1;
            pb.track_keycb(pb.pb_tracks,c);
            pb.pb._minmove=window.outerWidth*0.01;
          }
          else if (pb.motions.evtarget(pb.pb_tracks)){
            pb.motions.track_action(evt);
            pb.pb._minmove=2;
          }
        }
        else if (c==KENTER){
          var prevent=true;
          if (!pb.pb.classList.contains('menushow')){
            if (pb.pb.__ev_target==pb.pb){
              var x=pb.pb.__ev_x;
              var w=window.outerWidth;
              var w4=w/5;
              var t=(x<w4)?1:((x>w-w4)?2:0);
              if (pb.motions.smenuto){
                clearTimeout(pb.motions.smenuto);
                pb.motions.smenuto=null;
              }
              if (t>0){
                if (pb.motions.smenutick>$tick()-280){
                  _API.last_key_source=0;
                  pb.motions.smenutick=$tick();
                  if (t==1){
                    pb.track_keycb(pb.pb_tracks,KLEFT);
                    pb.motions.seekindicator(0);
                  }
                  else{
                    pb.track_keycb(pb.pb_tracks,KRIGHT);
                    pb.motions.seekindicator(1);
                  }
                }
                else{
                  pb.motions.smenutick=$tick();
                  pb.motions.smenuto=setTimeout(function(){
                    pb.motions.smenuto=null;
                    pb.lastkey=$tick();
                    pb.menu_show(2);
                  },300);
                }
              }
              else {
                pb.lastkey=$tick();
                pb.menu_show(2);
              }
            }
            else{
              prevent=false;
            }
          }
          else if (pb.motions.evtarget(pb.pb_tracks)){
            pb.motions.track_action(evt);
          }
          else if (pb.pb.__ev_target==pb.pb || pb.pb.__ev_target==pb.pb_meta){
            pb.menu_hide();
          }
          else{
            prevent=false;
          }

          if (prevent){
            evt.preventDefault();
            evt.stopImmediatePropagation();
          }
        }
      },null,null,true);

      pb.pb.lastmove=0;
      pb.pb._nocursor=0;
      pb.pb.onmousemove=function(){
        if (pb.pb.__hidecursor_to){
          clearTimeout(pb.pb.__hidecursor_to);
          pb.pb.__hidecursor_to=null;
        }
        if (pb.pb._nocursor==1){
          pb.pb.__hidecursor_to=setTimeout(
            function(){
              pb.pb.__hidecursor_to=null;
              pb.pb._nocursor=2;
              pb.pb.classList.add('nocursor');
            },
            1000
          );
        }
        else if (pb.pb._nocursor==2){
          pb.pb._nocursor=1;
          pb.pb.classList.remove('nocursor');
          pb.pb.onmousemove();
        }
      };
      pb.pb.ontouchmove=function(){
        if (pb.pb.classList.contains('menushow')){
          pb.lastkey=$tick();
        }
        return true;
      };

      pb.pb_touch_play.onclick=function(){
        if (!pb.vid_stat.play){
          pb.vid_cmd('play',0);
          pb.menu_hide();
        }
        else
          pb.vid_cmd('pause',0);
      };
      pb.pb_touch_prev.onclick=function(){
        if (!this.classList.contains('hide')){
          pb.next_ep(-1);
        }
      };
      pb.pb_touch_next.onclick=function(){
        if (!this.classList.contains('hide')){
          pb.next_ep(1);
        }
      };
      pb.pb_touch_close.onclick=function(){
        clk();
        if (!pb.close_confirm()){
          pb.reset(1,0);
        }
      }
      pb.pb_event_skip.onclick=function(){
        if (pb.onskip){
          if (pb.skip_val>0){
            clk();
            pb.vid_cmd('seek',pb.skip_val);
            return true;
          }
        }
      };

      pb.motions.initialized=true;
    },

    smenutick:0,
    smenuto:null
  },

  /* Root Key Callback */
  keycb:function(c,isvirt){
    if (listOrder.onpopup){
      return listOrder.keycb(c);
    }
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }
    if (home.onsettings){
      return home.settings_keycb(c);
    }

    pb.lastkey=$tick();

    if (c==KPLAY||c==32){ /* space */
      if (pb.state){
        if (!pb.vid_stat.play)
          pb.vid_cmd('play',0);
        else{
          pb.vid_cmd('pause',0);
          if (!pb.pb_actions.classList.contains('active')){
            pb.menu_show(2);
          }
        }
        return true;
      }
      // pb.menu_show(c==KUP?1:2);
    }
    else if (c==KNEXT||c==KPREV||c==KPGUP||c==KPGDOWN){
      if (pb.state){
        if (!pb.pb_actions.classList.contains('active') || (pb.menusel==2)){
          pb.menu_show(3);
          if (c==KNEXT||c==KPGUP){
            pb.next_ep(1);
          }
          else{
            pb.next_ep(-1);
          }
          return true;
        }
      }
    }

    if (pb.pb_actions.classList.contains('active')){
      if (c==KBACK){
        clk();
        pb.menu_hide();
      }
      else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN||c==KNEXT||c==KPREV){
        if (pb.menus[pb.menusel]._keycb)
          pb.menus[pb.menusel]._keycb(pb.menus[pb.menusel],c);
      }
      else if (c==KUP){
        clk();
        pb.menus[pb.menusel].classList.remove('active');
        if (--pb.menusel<0){
          pb.menusel=0;
          if (!isvirt){
            pb.menu_hide();
            return;
          }
        }
        pb.menus[pb.menusel].classList.add('active');
        pb.menu_update();
      }
      else if (c==KDOWN){
        clk();
        pb.menus[pb.menusel].classList.remove('active');
        if (++pb.menusel>=pb.menus.length) pb.menusel=pb.menus.length-1;
        pb.menus[pb.menusel].classList.add('active');
        pb.menu_update();
      }
    }
    else{
      if (c==KENTER){
        if (pb.onskip){
          if (pb.skip_val>0){
            clk();
            pb.vid_cmd('seek',pb.skip_val);
            return true;
          }
        }
        else{
          clk();
          if (!pb.vid_stat.play)
            pb.vid_cmd('play',0);
          else{
            pb.vid_cmd('pause',0);
            if (!pb.pb_actions.classList.contains('active')){
              pb.menu_show(2);
            }
          }
          return true;
        }
      }
      else if (c==KLEFT||c==KRIGHT){
        _API.last_key_source=0;
        pb.track_keycb(pb.pb_tracks,c);
      }
      else if (c==KUP||c==KDOWN||c==KENTER){
        clk();
        pb.menu_show(c==KUP?1:2);
      }
      else if (c==KBACK){
        if (!pb.close_confirm()){
          if (pb.menu_hide_tick>$tick()){
            /* prevent accidential back */
            clk();
            pb.reset(1,0);
          }
          else{
            clk();
            _API.showToast("Press back again to close playback...");
            pb.menu_hide_tick=$tick()+1000;
          }
        }
      }
    }
  },

  init_episode_title:function(d,idx){
    if (d.active){
      pb.ep_index=idx;
      pb.ep_val=d.ep+'';
      pb.ep_title='EPISODE '+(d.ep);
      if (pb.data.ep.length>1)
        pb.ep_num='EP.'+(d.ep);
      else
        pb.ep_num='';
      if (d.title)
        pb.ep_title+='. '+(d.title.toUpperCase());
      pb.pb_track_title.innerHTML=special(pb.ep_title);
    }
  },

  init_episode:function(start, spos){
    var paging_sz=50;
    pb.menu_clear(pb.pb_episodes);
    if (pb.data.ep&&pb.data.ep.length){
      if (start<0){
        start=0;
        if (pb.data.ep.length>paging_sz){
          for (var i=0;i<pb.data.ep.length;i++){
            if (pb.data.ep[i].active){
              pb.init_episode_title(pb.data.ep[i],i);
              start=Math.floor(i/paging_sz)*paging_sz;
              break;
            }
          }
        }
      }
      var act=null;
      var first_ep='';
      var last_ep='';
      for (var i=start;((i<pb.data.ep.length)&&(i<start+paging_sz));i++){
        var d=pb.data.ep[i];
        var adh='';
        var action_value=d.url;
        if (__SD3||__SD5||__SD6){
          action_value='>'+d.url;
        }
        var hl=$n('div',d.active?'playing':'',{action:action_value,arg:pb.tip_value+';1'},pb.pb_episodes.P,special(d.ep)+adh);
        if (d.img){
          hl.style.backgroundImage='linear-gradient(180deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, .6)), url('+$img(d.img)+')';
          hl.classList.add('hasbg');
        }
        if (d.title)
          hl.setAttribute('data-title',d.title);
        if (d.active){
          act=hl;
          pb.init_episode_title(d,i);
        }
        if (d.filler){
          hl.classList.add('filler');
          hl.innerHTML+='<i>FILLER</i>';
        }
        if (d.dub){
          hl.classList.add('havedub');
          hl.innerHTML+='<c class="dubinfo">mic</c>';
        }
        if (!first_ep) first_ep=d.ep;
        last_ep=d.ep;
      }

      if (first_ep!=last_ep&&pb.data.ep.length>paging_sz)
        pb.pb_episodes.setAttribute('data-eps','Episodes: '+first_ep+' - '+last_ep+' / '+pb.data.ep.length);
      else
        pb.pb_episodes.removeAttribute('data-eps');
      if (start+paging_sz<pb.data.ep.length){
        pb.pb_episodes.__next_start=start+paging_sz;
        if (pb.pb_episodes.__next_start>=pb.data.ep.length) pb.pb_episodes.__next_start=pb.data.ep.length-1;
        pb.pb_episodes.__next=function(){
          pb.init_episode(pb.pb_episodes.__next_start, 1);
        };
      }
      else
        pb.pb_episodes.__next=null;
      if (start>0){
        pb.pb_episodes.__prev_start=start-paging_sz;
        if (pb.pb_episodes.__prev_start<0) pb.pb_episodes.__prev_start=0;
        pb.pb_episodes.__prev=function(){
          pb.init_episode(pb.pb_episodes.__prev_start, 2);
        };
      }
      else
        pb.pb_episodes.__prev=null;
      if (act&&!spos){
        pb.menu_select(pb.pb_episodes,act);
      }
      else if (spos==1){
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.P.firstElementChild);
      }
      else if (spos==2){
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.P.lastElementChild);
      }
    }

    var next_id = pb.ep_index + 1;
    if (next_id>=0 && next_id<pb.data.ep.length){
      pb.pb_touch_next.classList.remove('hide');
    }
    else{
      pb.pb_touch_next.classList.add('hide');
    }
    next_id = pb.ep_index - 1; 
    if (next_id>=0 && next_id<pb.data.ep.length){
      pb.pb_touch_prev.classList.remove('hide');
    }
    else{
      pb.pb_touch_prev.classList.add('hide');
    }
  },

  init_settings:function(){
    pb.cfg_load();
    pb.menu_clear(pb.pb_settings);

    // if (!pb.cfg_data.html5player){
    _API.videoSpeed(_API.vidSpeed);
    // }

    // $n('div','',{action:'-prev'},pb.pb_settings,'<c>skip_previous</c> PREV');
    // $n('div','',{action:'-next'},pb.pb_settings,'NEXT <c>skip_next</c>');
    pb.pb_settings._s_settings=$n('div','',{action:'*settings'},pb.pb_settings.P,'<c>settings</c> Settings');
    // pb.pb_settings._s_fav=$n('div','',{action:'*fav'},pb.pb_settings.P,'');

    if (_JSAPI.videoSupportSpeed()){
      pb.pb_settings._s_speed=$n('div','',{action:'*speed'},pb.pb_settings.P,'<c>speed</c> <span>Speed 1.0x</span>');
    }

    if (!__SD5){
      pb.pb_settings._s_mirrorserver=$n(
        'div','',{
          action:'*mirrorserver'
        },
        pb.pb_settings.P,
        '<c>cloud</c> <span>Main</span>'
      );
    }

    //if (/*!pb.cfg_data.html5player&&*/!__SD6){
      pb.pb_settings._s_quality=$n('div','',{action:'*quality'},pb.pb_settings.P,'<c>hd</c> <span>Auto</span>');
    //}

    if (!__SD3&&!__SD5/*&&!__SD6*/){
      // pb.pb_settings._s_hardsub=$n('div','',{action:'*hardsub'},pb.pb_settings.P,'<c>clear</c> HARD');
      // if (pb.data.stream_url.soft){
      //   pb.pb_settings._s_softsub=$n('div','',{action:'*softsub'},pb.pb_settings.P,'<c>clear</c> SOFT');
      // }
      // if (pb.data.stream_url.dub){
      //   pb.pb_settings._s_dub=$n('div','',{action:'*dub'},pb.pb_settings.P,'<c>clear</c> DUB');
      // }
      pb.pb_settings._s_streamselect=$n('div','',{action:'*streamselect'},pb.pb_settings.P,'<c>subtitles</c>');
    }

    if (__SD8){
      pb.pb_settings._s_miruroprovider=$n(
        'div','',{action:'*miruroprovider'},pb.pb_settings.P,
        '<c>storefront</c> '+miruro.providers_name[miruro.provider]
      );
    }

    pb.pb_settings._s_alang=$n('div','',{action:'*alang'},pb.pb_settings.P,'<c>text_to_speech</c> <span>Original</span>');
    
    /*
    sub, softsub, dub
    */


    pb.menu_select(pb.pb_settings,pb.pb_settings.P.firstElementChild);
    pb.pb_settings._midx=1.5;
    pb.cfg_update_el();
    _API.videoScale(pb.cfg_data.scale);
  },

  updateStreamTypeInfo:function(){
    var txtadd='';
    var translate=false;
    if (pb.data.streamtype=="dub"){
      pb.curr_stream_type=2;
    }
    else if (pb.data.streamtype=="softsub"){
      pb.curr_stream_type=1;
      txtadd+=' <b class="softsub_lang">'+pb.cfg_data.lang.toUpperCase()+'</b>';
      translate=vtt.substyle?true:false;
    }
    else{
      pb.curr_stream_type=0;
    }
    pb.pb_action_streamtype.innerHTML='<c>'+(translate?"g_translate":pb.cfgstreamtype_ico[pb.curr_stream_type])+'</c> '+
      (translate?"TRANSLATE":pb.cfgstreamtype_name[pb.curr_stream_type])+txtadd;
    pb.pb_action_streamtype.classList.add('active');
    pb.cfg_update_el("mirrorserver");
  },

  update_malist_ep:function(dr){
    if (dr<((pb.cfg_data.listprog * 24)+1)){
      return;
    }
    if (pb.MAL.set){
      var cep=toInt(pb.ep_val);
      if (pb.MAL.myanilist){
        if (pb.MAL.myanilist.progress<cep){
          pb.MAL.myanilist.progress=cep;
          _MAL.update_epel(pb.MAL.myanilist.id,pb.MAL.myanilist.vid,cep,true);
        }
      }
      if (pb.MAL.mymal){
        if (pb.MAL.mymal.progress<cep){
          pb.MAL.mymal.progress=cep;
          _MAL.update_epel(pb.MAL.mymal.id,pb.MAL.mymal.vid,cep,false);
        }
      }
    }
  },

  MAL:{
    set:false
  },
  MAL_NO_TRACKS:[],
  MAL_TRACKABLE:function(trackable){
    if ((_MAL.alauth&&pb.MAL.anilist)||(_MAL.auth&&pb.MAL.mal)){
      if (!pb.MAL.mymal && !pb.MAL.myanilist){
        return true;
      }
      if (trackable){
        return true;
      }
    }
    return false;
  },
  MAL_TRACK:function(trackable){
    if (!pb.state){
      return;
    }
    if (pb.MAL_TRACKABLE(trackable)){
      // no on the list yet
      console.log("ATVLOG: NOT ON THE LIST");

      var list=[];
      if (!trackable){
        list.push({
          icon:'close',
          title:"Don't Track",
          id:'notrack'
        });
      }
      if (_MAL.alauth&&_MAL.auth&&pb.MAL.anilist&&pb.MAL.mal&&!pb.MAL.mymal&&!pb.MAL.myanilist){
        list.push({
          icon:'done_all',
          title:'Track on AniList and MAL',
          id:'trackall',
          msg:'Saved to AniList and MAL'
        });
      }
      if (_MAL.alauth&&pb.MAL.anilist&&!pb.MAL.myanilist){
        list.push({
          icon:'bookmark_add',
          title:'Track on AniList',
          id:'anilist',
          msg:'Saved to AniList'
        });
      }
      if (_MAL.auth&&pb.MAL.mal&&!pb.MAL.mymal){
        list.push({
          icon:'bookmark_add',
          title:'Track on MAL',
          id:'mal',
          msg:'Saved to MAL'
        });
      }
      if (_MAL.alauth&&pb.MAL.myanilist){
        list.push({
          icon:'cancel',
          title:'Remove from AniList',
          id:'delanilist',
          msg:'Removed from AniList'
        });
      }
      if (_MAL.auth&&pb.MAL.mymal){
        list.push({
          icon:'cancel',
          title:'Remove from MAL',
          id:'delmal',
          msg:'Removed from MAL'
        });
      }
      var list_n=0;
      var list_ok_n=0;
      function list_save_finish(v){
        home.init_mylist(true);
        if (list_ok_n==0){
          _API.showToast(list[v].msg);
        }
        pb.MAL_LOAD(true,true);
      }
      listOrder.showMenu('Tracking Anime',list,0,function(v){
        if (v!=null){
          list_n=0;
          list_ok_n=0;
          if (list[v].id=="notrack"){
            pb.MAL_NO_TRACKS.push(pb.tip_value);
            return;
          }
          else if (list[v].id=="delanilist"){
            _API.confirm("Remove AniList",
              "Remove this anime from your AniList?",function(cnf){
              if (cnf){
                _MAL.alset_del(pb.MAL.myanilist.id, function(n){
                  if (n){
                    list_save_finish(v);
                  }
                  else{
                    _API.showToast("Remove from AniList failed...");
                  }
                });
              }
            });
            return;
          }
          else if (list[v].id=="delmal"){
            _API.confirm("Remove MAL",
              "Remove this anime from your MAL?",function(cnf){
              if (cnf){
                _MAL.set_del(pb.MAL.mal.id, function(n){
                  if (n){
                    list_save_finish(v);
                  }
                  else{
                    _API.showToast("Remove from MAL failed...");
                  }
                });
              }
            });
            return;
          }
          if (list[v].id=='trackall'||list[v].id=='anilist'){
            list_n++;
            list_ok_n++;
            _MAL.alset_list(pb.MAL.anilist.id,"CURRENT",function(n){
              list_n--;
              if (n){
                list_ok_n--;
              }
              else{
                _API.showToast("Track on AniList failed...");
              }
              list_save_finish(v);
            });
          }
          if (list[v].id=='trackall'||list[v].id=='mal'){
            list_n++;
            list_ok_n++;
            _MAL.set_list(pb.MAL.mal.id,"watching",function(n){
              list_n--;
              if (n){
                list_ok_n--;
              }
              else{
                _API.showToast("Track on MAL failed...");
              }
              list_save_finish(v);
            });
          }
        }
      });
    }
    else if (trackable){
      if (!_MAL.alauth && _MAL.auth){
        _API.showToast("Please login to AniList or MAL first...");
      }
      else{
        _API.showToast("Anime Untrackable...");
      }
    }
  },
  MAL_RELREC:function(id){
    /* Send Thumbnails to server cache */
    /*
    if (__SD<=2){
      if (pb.data.banner){
        bannerCacher.get(id+'',function(b1){
          if (!b1 || (b1!=pb.data.banner)){
            bannerCacher.set(id+'',
              pb.data.banner,
              function(b2){
                console.warn("Save Thumbnail("+id+"): "+b2+" = "+pb.data.banner);
              }
            );
          }
        });
      }
    }
    */

    /* load ep images */
    if (id){
      bannerCacher.aniApi(id,function(r){
        if ('episodes' in r){
          var rep=r.episodes;
          for (var i=0;i<pb.data.ep.length;i++){
            var d=pb.data.ep[i];
            if (d.ep in rep){
              var rp=rep[d.ep];
              if (!d.img && rp.image){
                d.img=rp.image;
              }
              if (rp.title){
                if (('en' in rp.title) && (rp.title['en'])){
                  d.title=rp.title['en'];
                }
                else if ((!d.title) && ('x-jat' in rp.title) && (rp.title['x-jat'])){
                  d.title=rp.title['x-jat'];
                }
              }
            }
          }
          pb.init_episode(-1, 0);
        }
      });
    }

    if (!id || (!__SD5 && !__SD6 && !__SD7 && !__SD8 && !__SDKAI)){
      return;
    }

    /* Fetch Related Anime */
    _MAL.allist_related(id,function(dm){
      if (dm && dm.n>0){
        try{
          var elm=[
            [dm.rel,pb.pb_related],
            [dm.rec,pb.pb_recs]
          ];
          for (var jj=0;jj<elm.length;jj++){
            var ldm=elm[jj][0];
            var g=elm[jj][1];
            pb.menu_clear(g);
            if (ldm.length>0){
              pb.menus.push(g);
              for (var i=0;i<ldm.length;i++){
                var d=ldm[i];
                var malid="anilistmedia_"+d.id;
                _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
                var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
                hl._img=$n('img','',{loading:'lazy',src:$img($aimg(d.coverImage))},hl,'');
                hl._title=$n('b','',{
                  jp:d.title.romaji?d.title.romaji:d.title.english
                },hl,tspecial(
                  d.title.english?d.title.english:d.title.romaji
                ));
                var infotxt='';
                var mtp=d.format;
                if (mtp=='TV_SHORT'){
                  mtp='TV';
                }
                if (mtp){
                  infotxt+='<span class="info_type">'+special(mtp)+'</span>';
                }
                if (d.episodes){
                  infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(d.episodes)+'</span>';
                }
                if (infotxt){
                  hl._ep=$n('span','info',null,hl,infotxt);
                }
              }
              pb.menu_select(g,g.P.firstElementChild);
              g.style.display='';
            }
            else{
              g.style.display='none';
            }
          }
        }catch(ee){
          console.warn(ee);
        }
      }
    });
  },
  MAL_LOAD:function(force, notrack){
    /* Find Playback Meta */
    if (!pb.MAL.set||force){
      if (force){
        pb.MAL={set:false};
      }
      console.log("Searching AniList Match: "+pb.data.title);
      var load_n=0;
      function track_popup(){
        if (notrack){
          return;
        }
        if (pb.cfg_data.maltrackdialog!=1){
          var list_n=0;
          var list_ok_n=0;
          function auto_list_save_finish(){
            home.init_mylist(true);
            if (list_ok_n==0){
              if (pb.cfg_data.maltrackdialog==4){
                _API.showToast('Saved to AniList and MAL');
              }
              else if (pb.cfg_data.maltrackdialog==2){
                _API.showToast('Saved to AniList');
              }
              else if (pb.cfg_data.maltrackdialog==3){
                _API.showToast('Saved to MAL');
              }
            }
            pb.MAL_LOAD(true,true);
          }
          if (pb.cfg_data.maltrackdialog==4||pb.cfg_data.maltrackdialog==2){
            // Auto Add to AniList
            if (_MAL.alauth&&pb.MAL.anilist&&!pb.MAL.myanilist){
              list_n++;
              list_ok_n++;
              _MAL.alset_list(pb.MAL.anilist.id,"CURRENT",function(n){
                list_n--;
                if (n){
                  list_ok_n--;
                }
                else{
                  _API.showToast("Track on AniList failed...");
                }
                auto_list_save_finish();
              });
            }
          }
          if (pb.cfg_data.maltrackdialog==4||pb.cfg_data.maltrackdialog==3){
            // Auto Add to MAL
            if (_MAL.auth&&pb.MAL.mal&&!pb.MAL.mymal){
              list_n++;
              list_ok_n++;
              _MAL.set_list(pb.MAL.mal.id,"watching",function(n){
                list_n--;
                if (n){
                  list_ok_n--;
                }
                else{
                  _API.showToast("Track on MAL failed...");
                }
                auto_list_save_finish();
              });
            }
          }
          return;
        }
        if (load_n>0){
          return;
        }
        if (pb.MAL_NO_TRACKS.indexOf(pb.tip_value)>=0){
          return;
        }
        pb.MAL_TRACK();
      }

      var srcQuery = pb.data.title;
      if (pb.data.anilistId){
        srcQuery = '#'+pb.data.anilistId;
      }
      _MAL.allist_search(srcQuery,function(v){
        pb.MAL.set=true;
        if (!v){
          return;
        }
        if (v.match){
          pb.MAL.anilist=JSON.parse(JSON.stringify(v.match));
          if (v.match.idMal){
            load_n++;
            _MAL.mal_detail(v.match.idMal,function(r){
              if (r.ok){
                try{
                  var ms=JSON.parse(r.responseText);
                  pb.MAL.mal=ms;
                  if (ms.my_list_status){
                    var vid = 'mal_'+ms.id;
                    pb.MAL.mymal={
                      id:ms.id,
                      vid:vid,
                      progress:ms.my_list_status.num_episodes_watched
                    };
                  }
                }catch(e){}
              }
              load_n--;
              track_popup();
            }, true);
          }
          if (!notrack){
            pb.MAL_RELREC(v.match.id);
          }
        }
        if (v.match.mediaListEntry){
          var vid = 'anilist_'+v.match.mediaListEntry.id;
          pb.MAL.myanilist={
            id:v.match.mediaListEntry.id,
            vid:vid,
            progress:v.match.mediaListEntry.progress
          };
        }
        track_popup();
      },1,10,true, true);
    }
    else if (!notrack){
      if (pb.MAL.anilist && pb.MAL.anilist.id){
        pb.MAL_RELREC(pb.MAL.anilist.id);
      }
    }
  },
  init:function(){
    if (!ratingSystem.checkRating(pb.data.info.rating)){
      pb.reset(1,0);
      ratingSystem.blockMessage();
      return;
    }

    _API.videoAudioTrack(pb.cfg_data.alang,false);
    _API.videoTrackQuality(pb.cfg_data.quality,false);

    pb.init_video();

    pb.motions.init();

    pb.preload_started=0;
    pb.preload_video_started=0;

    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];

    $('home').style.display=$('search').style.display='none';
    pb.setskip_track(0);
    pb.updateStreamTypeInfo();

    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+')';
    //, url('+(pb.data.banner?pb.data.banner:pb.data.poster)+')';

    /* META */
    pb.ep_num='';
    pb.ep_title='';
    pb.pb_title.innerHTML=tspecial(pb.data.title);
    pb.pb_title.setAttribute('jp',pb.data.title_jp?pb.data.title_jp:pb.data.title);

    pb.MAL_LOAD(false);

    var addb='';
    try{
      var bb='';
      if (pb.data.info.type){
        bb+='<span>'+special(pb.data.info.type.name)+'</span>';
      }
      if (pb.data.info.quality){
        bb+='<span>'+special(pb.data.info.quality)+'</span>';
      }
      if (pb.data.info.rating){
        bb+='<span>'+special(pb.data.info.rating)+'</span>';
      }
      if (pb.data.seasons){
        if (pb.data.seasons.length>0){
          bb+='<span>'+pb.data.seasons.length+' SEASONS</span>';
        }
      }
      if (pb.data.ep){
        if (pb.data.ep.length>1){
          bb+='<span>'+pb.data.ep.length+' EPISODES</span>';
        }
      }
      if(bb){
        addb='<b>'+bb+'</b>';
      }
    }catch(e){}
    
    // pb.pb_desc.innerHTML=addb+special(pb.data.synopsis);

    var translate_desc=null;
    if (pb.cfg_data.lang!='en' && 
          pb.cfg_data.lang!='hard' && 
          pb.cfg_data.lang!='dub' && 
          pb.cfg_data.lang!=''){
            translate_desc=pb.cfg_data.lang;
    }
    if (translate_desc){
      /* Already Translated */
      if ('_translated' in pb){
        if (pb._translated[0]==pb.data.synopsis){
          pb.pb_desc.innerHTML=addb+special(pb._translated[1]);
          translate_desc=false;
        }
      }

      /* Not Translated Yet! */
      if (translate_desc){
        vtt.translate_text(pb.data.synopsis,translate_desc,function(txts){
          if (!txts){
            /* fallback if translate failed */
            txts=pb.data.synopsis;
          }
          pb._translated=[
            pb.data.synopsis,
            txts
          ];
          pb.pb_desc.innerHTML=addb+special(txts);
        });
      }
    }
    else{
      pb.pb_desc.innerHTML=addb+special(pb.data.synopsis);
    }


    /* Genres */
    pb.menu_clear(pb.pb_genres);
    if (pb.data.genres||pb.data.info.type){
      pb.pb_settings._s_fav=$n('div','',{action:'*fav'},pb.pb_genres.P,'');
      pb.pb_settings._s_tracking=$n('div','',{action:'*tracking'},pb.pb_genres.P,'<c>data_exploration</c> Tracking');

      if (pb.data.info.type){
        $n('div','',{action:'@'+pb.data.info.type.val},pb.pb_genres.P,special(pb.data.info.type.name));
      }
      if (pb.data.genres){
        for (var i=0;i<pb.data.genres.length;i++){
          $n('div','',{action:'!'+pb.data.genres[i].val},pb.pb_genres.P,special(pb.data.genres[i].name));
        }
      }
      pb.menu_select(pb.pb_genres,pb.pb_genres.P.firstElementChild);
    }
    
    /* Episode */
    pb.menu_clear(pb.pb_episodes);
    if (pb.data.ep&&pb.data.ep.length){
      pb.menus.push(pb.pb_episodes);
      pb.init_episode(-1, 0);
      pb.pb_episodes.style.display='';
    }
    else{
      pb.pb_episodes.style.display='none';
    }

    /* Media MetaData */
    try{
      _JSAPI.videoSetMeta(
        (pb.cfg_data.jptitle?(pb.data.title_jp?pb.data.title_jp:pb.data.title):(pb.data.title?pb.data.title:pb.data.title_jp)),
        pb.ep_title,
        pb.data.poster?pb.data.poster:pb.data.banner);

      _JSAPI.videoHaveNP(false,false);
    }catch(e){
      console.log("JSAPI videoSetMeta Err="+e);
    }
    try{
      _JSAPI.videoHaveNP((pb.ep_index + 1)<pb.data.ep.length,(pb.ep_index - 1)>=0);
    }catch(e){
      console.log("JSAPI videoHaveNP Err="+e);
    }

    /* Init Anime ID - Fav & History */
    var animeid=_API.animeId(pb.data.url);
    if (animeid){
      pb.data.animeid=animeid;
      if (pb.data.animeid){
        list.history_add(pb.data.animeid,pb.listobj(),true);
        if (list.fav_exists(pb.data.animeid)){
          list.fav_add(pb.data.animeid,pb.listobj(),false);
        }
      }
    }

    /* settings */
    pb.init_settings();
    // console.log(pb.data);

    /* season */
    pb.menu_clear(pb.pb_seasons);
    if (pb.data.seasons&&pb.data.seasons.length){
      pb.menus.push(pb.pb_seasons);
      var act=null;
      for (var i=0;i<pb.data.seasons.length;i++){
        var d=pb.data.seasons[i];
        var action_value=d.url;
        // if (__SD3||__SD5||__SD6){
        //   action_value='>'+d.url;
        // }
        // var hl=$n('div',d.active?'playing':'',{action:action_value},pb.pb_seasons.P,'');
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:0,
          title:d.title
        };
        var hl=$n('div',d.active?'playing':'',
          {action:"$"+JSON.stringify(argv),arg:""},pb.pb_seasons.P,'');

        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
        if (d.active) act=hl;
      }
      if (act){
        pb.menu_select(pb.pb_seasons,act);
      }
      pb.pb_seasons.style.display='';
    }
    else{
      pb.pb_seasons.style.display='none';
    }

    /* related */
    pb.menu_clear(pb.pb_related);
    if (pb.data.related&&pb.data.related.length){
      pb.menus.push(pb.pb_related);
      for (var i=0;i<pb.data.related.length;i++){
        var d=pb.data.related[i];
        try{
          d.poster=$imgcdn(d.poster);
        }catch(e4){}
        // var action_value=d.url;
        // if (__SD3||__SD5||__SD6){
        //   action_value='>'+d.url;
        // }
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:0,
          title:d.title
        };
        var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:""},pb.pb_related.P,'');

        // var hl=$n('div','',{action:action_value,arg:(d.tip?d.tip:'')+';0'},pb.pb_related.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
      }
      pb.menu_select(pb.pb_related,pb.pb_related.P.firstElementChild);
      pb.pb_related.style.display='';
    }
    else{
      pb.pb_related.style.display='none';
    }

    /* recommendations */
    pb.menu_clear(pb.pb_recs);
    if (pb.data.recs&&pb.data.recs.length){
      pb.menus.push(pb.pb_recs);
      for (var i=0;i<pb.data.recs.length;i++){
        var d=pb.data.recs[i];
        try{
          d.poster=$imgcdn(d.poster);
        }catch(e4){}
        // var action_value=d.url;
        // if (__SD3||__SD5||__SD6){
        //   action_value='>'+d.url;
        // }
        // var hl=$n('div','',{action:action_value,arg:(d.tip?d.tip:'')+';0'},pb.pb_recs.P,'');
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:0,
          title:d.title
        };
        var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:""},pb.pb_recs.P,'');

        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
      }
      pb.menu_select(pb.pb_recs,pb.pb_recs.P.firstElementChild);
      pb.pb_recs.style.display='';
    }
    else{
      pb.pb_recs.style.display='none';
    }

    /* playNext */
    try{
      pb.playnext_last_tick=$tick()+2000;
      var bannerUrl=pb.data.banner?pb.data.banner:pb.data.poster;
      if (bannerUrl.indexOf("https://")!=0){
        bannerUrl="https://"+__DNS+""+bannerUrl;
      }
      _JSAPI.playNextMeta(
        pb.data.title+(pb.ep_num?(" ("+pb.ep_num+")"):''),
        pb.ep_title, 
        bannerUrl, 
        pb.open_uri,
        pb.tip_value,
        __SD
      );
    }catch(e){}

    // pb.init_video();

    /* ACTIONS */
    pb.pb_genres._midx=4;

    pb.menu_init(pb.pb_settings);
    pb.menu_init(pb.pb_genres);
    pb.menu_init(pb.pb_episodes);
    pb.menu_init(pb.pb_seasons);
    pb.menu_init(pb.pb_related);
    pb.menu_init(pb.pb_recs);
    

    pb.pb_tracks._keycb=pb.track_keycb;
    pb.menusel=1;
    
    pb.pb_track_title.innerHTML=special(pb.ep_title);
    pb.pb_loading.classList.remove('active');
    requestAnimationFrame(function(){
      pb.menu_show(1);
      _API.setKey(pb.keycb);
    });
  },
  close_confirm:function(){
    if (pb.cfg_data.closeconfirm==1){
      _API.confirm(false,"Close the playback?",function(cnf){
        if (cnf){
          pb.reset(1,0);
        }
      });
      return true;
    }
    else if (pb.cfg_data.closeconfirm==2){
      requestAnimationFrame(function(){pb.reset(1,0);});
      return true;
    }
    return false;
  },
  load_open_stat:0,
  open_uri:"",
  open:function(uri, ttid, noclean, startpos){
    console.log("ATVLOG pb.open -> "+noclean+" / "+ttid+" / "+startpos+" -> "+uri);
    _JSAPI.setLandscape(true);

    pb.video_tmp_start_pos=0;
    pb.pb_action_streamtype.classList.remove('active');
    pb.load_open_stat=0;
    // _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
    pb.open_uri=uri;
    pb.pb_touch_actions.classList.add('hide');

    if (noclean){
      pb.pb_meta.classList.add('active');
    }
    else{
      pb.MAL={
        set:false
      };
      pb.pb.style.backgroundImage='';
      pb.pb_meta.classList.remove('active');
    }

    /* Init Preloaded Data */
    if (pb.preload_episode!=null){
      try{
        if (pb.preload_episode.u==uri){
          pb.menu_clear(pb.pb_settings);
          pb.url_value=uri;
          pb.startpos_val=0;

          pb.reset(0,noclean);

          console.log("Preload Opened ="+uri);

          pb.data=pb.preload_episode.d;
          pb.preload_episode=null;

          _API.setUri(uri);
          
          pb.init();
          return;
        }
      }catch(e){
        console.log("Open Preload Error -> "+e);
      }
    }

    pb.preload_episode=null;
    var uid=_API.getView(uri,function(d,u){
      pb.load_open_stat=1;
      if (uid==u && d.status){
        // console.log("GETVIEW: "+JSON.stringify(d,null,'\t'));
        console.warn(d);
        pb.data=d;
        _API.setUri(uri);
        pb.init();
      }
      else if (uid==u){
        if (!noclean){
          pb.reset(1);
        }
        console.log("ATVLOG ERROR GETVIEW: "+JSON.stringify(d));
        _API.showToast("Playing episode failed. Please try again...");
      }
    });
    if (uid){
      pb.menu_clear(pb.pb_settings);
      pb.tip_value=ttid?ttid:'';
      pb.url_value=uri;
      pb.startpos_val=(startpos!==undefined)?(startpos?parseInt(startpos):0):0;
      console.log("ATVLOG OPENPB => POS="+pb.startpos_val);
      if (!noclean && (!__SD3) &&(!__SD5) &&(!__SD6) &&(!__SD7) && (!__SD8)){
        _API.getTooltip(ttid,pb.open_ttip, uri);
      }
      pb.reset(0,((__SD3||__SD5))?2:noclean);
      _API.setKey(function(ke){
        if (ke==KBACK){
          uid=-1;
          pb.load_open_stat=3;
          pb.reset(1,0);
          // _JSAPI.appQuit();
        }
      });
    }
    return uid;
  },
  open_ttip:function(d){
    if (d){
      if (!pb.tip_value){
        pb.tip_value=d.ttid;
      }
      if (pb.load_open_stat==0){
        pb.pb_title.innerHTML=tspecial(d.title);
        pb.pb_title.setAttribute('jp',d.title_jp?d.title_jp:d.title)
        pb.pb_meta.classList.add('active');
        var addb='';
        try{
          var bb='';
          if (d.quality){
            bb+='<span>'+special(d.quality)+'</span>';
          }
          if (d.rating){
            bb+='<span>'+special(d.rating)+'</span>';
          }
          if(bb){
            addb='<b>'+bb+'</b>';
          }
        }catch(e){}
        pb.pb_desc.innerHTML=addb+special(d.synopsis);
        try{
          pb.menu_clear(pb.pb_genres);
          for (var i=0;i<d.genres.length;i++){
            $n('div','',0,pb.pb_genres.P,special(d.genres[i].name));
          }
        }catch(e){}
        if (d.banner){
          pb.pb.style.backgroundImage='url('+(d.banner)+')';
        }
        else if (d.poster){
          pb.pb.style.backgroundImage='url('+(d.poster)+')';
        }
      }
    }
  }
};

const home={
  home_onload:false,
  home:$('home'),
  home_scroll_mask:$('home_scroll_mask'),
  home_scroll:$('home_scroll'),
  home_slide:$('home_slide'),

  // Enable hide previous non visible item list
  withspre:false, // home.withspre

  // home_recent:$('home_recent'),
  // home_dub:$('home_dub'),
  // home_trending:$('home_trending'),
  // home_random:$('home_random'),
  // home_chinese:$('home_chinese'),


  // home_mal:$('home_mal'),
  // home_anilist:$('home_anilist'),
  // home_history:$('home_history'),
  // home_fav:$('home_fav'),

  home_header:$('home_header'),
  bgimg:null,

  hi_tipurl:function(u){
    var ur=(u+'').split('#');
    ur=ur[0].split('?');
    return ur[0];
  },
  hi_animeid:function(u){
    var ur=home.hi_tipurl(u+'').split('-');
    return ur[ur.length-1];
  },
  hi_parse:function(v){
    var hd=$n('d','','',null,v);
    var rd=[];
    var it=hd.querySelectorAll('section div.film_list-wrap div.flw-item');
    for (var i=0;i<it.length;i++){
      var t=it[i];
      var ttl='';
      try{
        var d={};
        var at=t.querySelector('.film-name a');
        d.url=at.getAttribute('href');

        if (d.url.indexOf("?")>=0){
          d.url=d.url.substring(0,d.url.indexOf('?'));
        }
        // qtip = /ajax/movie/qtip/100
        
        ttl=d.title=at.getAttribute('title');
        try{
          d.title_jp=at.getAttribute('data-jname');
        }catch(ee){}

        d.tip=home.hi_tipurl(d.url);

        d.poster=t.querySelector('img').getAttribute('data-src');
        if (!d.poster){
          console.log("Not Found Image: "+d.title);
        }

        // Episode
        var epl=t.querySelector('.tick-sub');
        var epld=t.querySelector('.tick-dub');
        if (!epl){
          epl=epld;
        }
        if (epl){
          d.epsub=d.epavail=d.ep=epl.textContent.trim()
        }
        if (epld){
          d.epdub=epld.textContent.trim()
        }
        d.eptotal=0;

        // Rate
        d.adult=false;
        if (t.querySelector('.tick.tick-rate')){
          d.adult=true;
        }

        d.type=(t.querySelector('.fd-infor .fdi-item').textContent+'').replace('(? eps)','').trim();
        var dur=t.querySelector('.fd-infor .fdi-item.fdi-duration').textContent+'';
        if (dur && (dur.charAt(dur.length-1)=='m')){
          d.duration=dur+'in';
        }
        if (d.duration){
          d.duration=d.duration.replace('min','').trim();
          if (d.duration){
            d.duration+=' min';
          }
        }

        rd.push(d);
      }catch(e){
        console.log(ttl+' -> '+e);
      }
    }
    hd.innerHTML='';
    return rd;
  },

  flix_parse:function(v){
    var rd=[];
    try{
      var t=JSON.parse(v);
      // asr.sort(function(a,b){
      //   return b.airingTime-a.airingTime
      // })
      if ('trending' in t){
        t=t.trending;
      }
      else{
        /* Schedule */
        if (Array.isArray(t)){
          if (t[0].animes && t[0].title){
            var scd=t;
            t=[];
            for (var i=0;i<scd.length;i++){
                for (var j=0;j<scd[i].animes.length;j++){
                    t.push(scd[i].animes[j]);
                }
            }
            t.sort(function(a,b){
              var aa=(a.nextAiringEpisode)?a.nextAiringEpisode.airingAt:0;
              var bb=(b.nextAiringEpisode)?b.nextAiringEpisode.airingAt:0;
              return bb-aa;
            });
            console.log(["SORTED: ",t]);
          }
        }
      }

      var l=t.length;
      for (var i=0;i<l;i++){
        try{
          var d={};
          var u=t[i];
          __AFLIX.setCache(u);
          d.url=__AFLIX.setUrl(u.slug,u.anilistID);
          d.title=__AFLIX.getTitle(u);
          d.title_jp=__AFLIX.getTitle(u,1);
          d.tip=u.anilistID;
          d.malid=u.malID;
          d.poster=u.images.medium;
          d.epavail=d.ep=u.episodeNum;
          if (u.nextAiringEpisode){
            if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
              d.ep=d.epavail=u.nextAiringEpisode.episode-1;
            }
          }
          d.type=u.type;
          if (u.duration){
            d.duration=u.duration+' min';
          }
          if (u.status!='NOT_YET_RELEASED'){
            rd.push(d);
          }
        }catch(e2){}
      }
    }catch(e){
      console.log("ERR: "+e);
    }
    return rd;
  },

  recent_parse:function(g,v){
    var rd=[];

    if (__SD3){
      // Hi Anime
      rd=home.hi_parse(v);
    }
    else if (__SD7){
      // gojo
      rd=gojo.recent_parse(v);
    }
    else if (__SD8){
      rd=miruro.recent_parse(v);
    }
    else if (__SD5){
      // Hi Anime
      rd=home.flix_parse(v);
    }
    else if (__SD6){
      // Kickass
      rd=kaas.recentParse(v);
    }
    else if (__SD==1){
      // wave
      var hd=$n('d','','',null,v);
      var it=hd.querySelectorAll('div.aitem');
      for (var i=0;i<it.length;i++){
        var t=it[i];
        try{
          var d={};
          var ttip = t.querySelector('[data-tip]').getAttribute('data-tip');
          d.url=ttip;
          d.tip=ttip;
          var at=t.querySelector('a.title[title]');
          d.title_jp=d.title=at.getAttribute('title');
          try{
            d.title_jp=at.getAttribute('data-jp');
          }catch(ee){}
          d.poster=t.querySelector('img').getAttribute('data-src');

          try{
            d.type=t.querySelector('div.info span:last-child').textContent.trim();
          }catch(e){}
          try{
            d.epdub=t.querySelector('div.info span.dub').textContent.trim();
          }catch(ee){}
          try{
            d.epsub=d.ep=t.querySelector('div.info span.sub').textContent.trim();
          }catch(ee){}
          try{
            d.eptotal=t.querySelector('div.info span:not(:last-child):not(.sub):not(.dub)').textContent.trim();
          }catch(ee){}
          
          // d.adult=t.querySelector('div.adult')?true:false;
          rd.push(d);
        }catch(e){
          // console.log(e);
        }
      }
      hd.innerHTML='';
    }
    else{
      // anix
      var hd=$n('d','','',null,v);
      var it=hd.querySelectorAll('div.piece div.inner');
      for (var i=0;i<it.length;i++){
        var t=it[i];
        try{
          var d={};
          var at=t.querySelector('a.poster');
          d.url=at.href;
          d.tip=at.getAttribute('data-tip');
          d.poster=t.querySelector('a.poster img').src;
          at=t.querySelector('div.ani-name a');
          d.title=at.textContent.trim();
          try{
            d.title_jp=at.getAttribute('data-jp');
          }catch(ee){}

          d.type=t.querySelector('div.abs-info span.type').textContent.trim();

          try{
            d.epdub=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
          }catch(e2){}
          try{
            d.epsub=d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
          }catch(e){
            d.ep=d.epdub;
          }
          try{
            d.eptotal=t.querySelector('div.sub-dub-total span.total').textContent.trim();
          }catch(e2){}

          try{
            d.adult=false;
            var anir=t.querySelector('div.abs-info div.ani-rating');
            if (anir){
              if (anir.textContent.trim()=='18+'){
                d.adult=true;
              }
            }
          }catch(e3){}

          d.duration=t.querySelector('div.abs-info span.time').textContent.trim();
          rd.push(d);
        }catch(e){
          // console.log(e);
        }
      }
      hd.innerHTML='';
    }
    
    if (rd&&rd.length){
      for (var i=0;i<rd.length;i++){
        var d=rd[i];
        if (!ratingSystem.checkAdult(d.adult,d.title,d.title_jp)){
          continue;
        }
        if (g._lid=='dub') {
          if (d.epdub){
            d.ep=d.epdub;
          }
        }
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:d.ep,
          title:d.title
        };
        var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:"ep"},g.P,'');
        // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
        var infotxt='';
        var binfotxt='';
        if (d.adult){
          binfotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
        }
        else if (d.rating){
          binfotxt+='<span class="info_ep">'+d.rating+'</span>';
        }

        if (d.duration){
          binfotxt+='<span class="info_duration">'+special((d.duration+"").toLowerCase())+'</span>';
        }
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.eptotal||d.epdub||d.epsub){
          var haveep=0;
          if (d.epsub){
            infotxt+='<span class="info_ep info_epsub"><c>closed_caption</c>'+special(d.epsub)+'</span>';
            haveep++;
          }
          if (d.epdub){
            infotxt+='<span class="info_ep info_epdub"><c>mic</c>'+special(d.epdub)+'</span>';
            haveep++;
          }
          if (!haveep && d.ep){
            infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
          }
          if (d.eptotal && (haveep<2)){
            infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(d.eptotal)+'</span>';
          }
        }
        else if (d.ep){
          infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl,infotxt);
        }
        if (binfotxt){
          hl._ep=$n('span','info info_bottom',null,hl,binfotxt);
        }
      }
      if (home.withspre){
        var PGSZ=(__SD3||__SD5||__SD6)?60:30;
        while (g.P.childElementCount>PGSZ){
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        }
        g.__update_pre();
      }

      if (!g._sel)
        pb.menu_select(g,g.P.firstElementChild);
      else
        pb.menu_select(g,g._sel);
    }
  },
  recent_load:function(g){
    g._onload=1;
    var load_page=g._page;
    if (__SD5){
      load_page--;
      if (g._ajaxurl.indexOf('schedule')>0){
        if (load_page>0){
          return;
        }
        load_page='';
      }
    }
    $a(g._ajaxurl+''+load_page,function(r){
      if (r.ok){
        try{
          if (__SD3||__SD5||__SD6||__SD7||__SD8){
            home.recent_parse(g,r.responseText);
          }
          else{
            var v=JSON.parse(r.responseText);
            home.recent_parse(g,v.result);
          }
        }catch(e){}
        g._onload=0;
      }
    },__SD5?__AFLIX.origin:null);
  },
  recent_init:function(rc, loader){
    if (rc.P){
      delete rc.P;
      delete rc._sel;
    }
    rc.innerHTML='';

    rc._page=1;
    pb.menu_clear(rc);
    rc._nojump=home.withspre;
    // rc._keycb=pb.menu_keycb;
    pb.menu_init(rc);

    rc._spre=[];
    rc._spost=[];
    rc.__update_pre=function(){
      if (home.withspre){
        rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
      }
    };
    rc.__selectcb=function(g,c){
      if (!c) return;
      var PGSZ=7;
      var k=c;
      var n=0;
      while(k){
        k=k.previousElementSibling;
        if (++n>PGSZ) break;
      }
      if (n<=PGSZ-1){
        if (g._spre.length>0 && home.withspre){
          g.P.insertBefore(g._spre.pop(), g.P.firstElementChild.nextElementSibling);
          g._spost.push(g.P.lastElementChild);
          g.P.removeChild(g.P.lastElementChild);
          g.__update_pre();
          pb.menu_select(g,g._sel);
        }
        return;
      }
      if (g._onload!=0) return;
      n=0;
      while(c){
        c=c.nextElementSibling;
        if (++n>4) return;
      }
      if (g._spost.length>0 && home.withspre){
        g.P.appendChild(g._spost.pop());
        g._spre.push(g.P.firstElementChild.nextElementSibling);
        g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        g.__update_pre();
        pb.menu_select(g,g._sel);
        return;
      }
      if (g._page>60) return;
      g._page++;
      if (loader){
        loader(rc);
      }
      else{
        home.recent_load(rc);
      }
    };
    rc._edgecb=function(g){
      if (g._onload!=0) return;
      if (g._page>60) return;
      g._page++;
      // g._sel=g.P.lastElementChild;
      // pb.menu_select(g,g._sel);
      g._noscroll=true;
      if (loader){
        loader(rc);
      }
      else{
        home.recent_load(rc);
      }
    };


    if (loader){
      loader(rc);
    }
    else{
      home.recent_load(rc);
    }
  },

  ttip_desc:function(hl,ttip,url,ddat){
    _API.getTooltip(ttip,function(d){
      if (d){
        hl._desc.innerHTML=special(d.synopsis);
      }
    }, url);
  },

  home_parser:function(v){
    var h=$n('div','','',null,v);
    var td=[];
    
    try{
      home.home_slide._midx=-1;

      // home.home_slide._midx=(__SD==2)?2:2.5;
      if (__SDKAI){
        td=kai.parseHomeSlideshow(h);
      }
      else if (__SD3){
        // hianime
        var tops=h.querySelectorAll('#slider .swiper-wrapper .swiper-slide');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          var tt=t.querySelector('.deslide-item-content .desi-head-title');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jname');
          d.url=t.querySelector('.deslide-item-content .desi-buttons .btn-secondary').getAttribute('href');
          d.synopsis=t.querySelector('.deslide-item-content .desi-description').textContent.trim();
          d.tip=home.hi_tipurl(d.url);
          d.poster=t.querySelector('.deslide-cover img').getAttribute('data-src');
          try{
            var epel=t.querySelector('.deslide-item-content .sc-detail .tick-item.tick-sub');
            if (!epel)
              t.querySelector('.deslide-item-content .sc-detail .tick-item.tick-eps');
            d.ep=(epel.textContent+'').trim();
          }catch(e){
          }
          try{
            d.type=(t.querySelector('.deslide-item-content .sc-detail .fa-play-circle').parentElement.textContent+'').trim();
          }catch(e){
          }
          try{
            d.duration=(t.querySelector('.deslide-item-content .sc-detail .fa-clock').parentElement.textContent+'').trim()+"IN";
          }catch(e){
          }
          td.push(d);
        }
      }
      else if (__SD5){
        try{
          var t=JSON.parse(v);
          var l=t.length;
          for (var i=0;i<l;i++){
            try{
              var d={};
              var u=t[i];
              __AFLIX.setCache(u);
              d.url=__AFLIX.setUrl(u.slug,u.anilistID);
              d.title=__AFLIX.getTitle(u);
              d.title_jp=__AFLIX.getTitle(u,1);
              d.tip=u.anilistID;
              d.synopsis=stripHtml(u.description);
              d.poster=u.images.medium;
              if (u.bannerart){
                if (u.bannerart.medium){
                  d.poster=u.bannerart.medium;
                }
                else if (u.bannerart.large){
                  d.poster=u.bannerart.large;
                }
              }
              else if(u.bannerImage){
                d.poster=u.bannerImage;
              }
              d.epavail=d.ep=u.episodeNum;
              if (u.nextAiringEpisode){
                if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
                  d.ep=d.epavail=u.nextAiringEpisode.episode-1;
                }
              }
              d.type=u.type;
              if (u.duration){
                d.duration=u.duration+'MIN';
              }
              if (u.status!='NOT_YET_RELEASED'){
                td.push(d);
              }
            }catch(e2){
              console.log("ERR2-SD5-HOMEPARSE: "+e);
            }
          }
        }catch(e){
          console.log("ERR2-SD1-HOMEPARSE: "+e);
        }
      }
      else if (__SD==1){
        td=wave.parseHomeSlideshow(h);
      }
      else{
        // anix
        var tops=h.querySelectorAll('main aside.sidebar div.tab-content[data-name=day]>a.piece');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          d.url=t.href;
          d.tip=t.querySelector('div[data-tip]').getAttribute('data-tip');

          var tt=t.querySelector('div.ani-detail div.ani-name');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jp');
          d.poster=t.querySelector('.poster img').src;
          d.adult=t.querySelector('div.adult')?true:false;
          try{
            d.ep=t.querySelector('div.ani-detail div.sub-dub-total span.sub').textContent.trim();
          }catch(e){
          }
          try{
            d.type=t.querySelector('div.ani-detail div span.text-muted').textContent.trim();
          }catch(e){
          }
          td.push(d);
        }
      }
    }catch(e){}
    h.innerHTML='';

    home.home_slide.innerHTML='';
    home.home_pager.innerHTML='';
    pb.menu_clear(home.home_slide);
    pb.menu_init(home.home_slide);
    if (td.length>0){
      for (var i=0;i<td.length;i++){
        try{
        var d=td[i];

        if (!ratingSystem.checkAdult(d.adult,d.title,d.title_jp)){
          continue;
        }
        
        if (!__SD3&&!__SD5){
          d.poster=$imgcdn(d.poster);
        }

        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:toInt(d.ep?d.ep:0),
          title:d.title
        };

        var hl=$n('div',(__SD!=2)?'fullimg':'',{action:"$"+JSON.stringify(argv),arg:"ep"},home.home_slide.P,'');
        home.home_add_pager(hl);
        hl._imgh=$n('content','img_holder',null,hl,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.banner?d.banner:d.poster)},hl._imgh,'');
        hl._viewbox=$n('span','infobox',null,hl,'');
        hl._view=$n('span','infovalue',null,hl._viewbox,'');
        hl._title=$n('h4','',{jp:d.title_jp?d.title_jp:d.title},hl._view,tspecial(d.title));
        if (__SD!=2){
          hl._desc=$n('span','desc',null,hl._view,special(d.synopsis));
        }
        else{
          hl._desc=$n('span','desc',null,hl._view,'');
          home.ttip_desc(hl, d.tip, d.url, d);
        }
        var infotxt='';
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.adult){
          infotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
        }
        if (d.duration){
          infotxt+='<span class="info_duration">'+special((d.duration+"").toUpperCase())+'</span>';
        }
        if (d.ep){
          infotxt+='<span class="info_ep">'+special(d.ep)+' Episodes</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl._view,infotxt);
        }

        }catch(ee){}
      }
      requestAnimationFrame(function(){
        pb.menu_select(home.home_slide,home.home_slide.P.firstElementChild);
      });
      home.home_list_autoslide();
    }
  },

  home_list_autoslide:function(){
    var g=home.home_slide;
    if (g._slide_interval){
      clearInterval(g._slide_interval);
      g._slide_interval=null;
    }
    g._slide_interval=setInterval(function(){
      var hs=$('home_slide_holder');
      if (
        !g.classList.contains('active') &&
        !hs.classList.contains('ontouch') &&
        (hs.__last_touch<$tick())){
        var curr = g._target_n;
        var next = null;
        if (!curr || !(next=curr.nextElementSibling)){
          next=g.P.firstElementChild;
        }
        pb.menu_select(g,next);
      }
    }, 10000);
  },

  home_pager:$('home_slide_pager'),
  home_add_pager:function(g){
    g._n_pager=$n('div','',{},home.home_pager,'');
  },

  yt_init:function(ytid, doloop){
    // var yturl='https://www.youtube.com/embed/'+ytid+'?';
    var yturl='https://www.youtube-nocookie.com/embed/'+ytid+'?';
    yturl+='autoplay=1&';
    yturl+='*rel=0&showinfo=0&modestbranding=1&playsinline=1&start=0&widgetid=1';
    if (!doloop && pb.cfg_data.trailer<2){
      yturl+='&mute=1';
    }
    yturl+='&controls=0&disablekb=1';
    yturl+='&fs=0';
    if (doloop){
      yturl+='&loop=1';
    }
    yturl+='&origin='+enc('https://'+__DNS);
    return yturl;
  },

  anilist_yt:{
    initialized:false,
    cleanup:function(actvg){
      if (!actvg){
        actvg=home.anilist_yt.activeg;
        home.anilist_yt.activeg=null;
      }
      if (home.anilist_trailer_to){
        clearTimeout(home.anilist_trailer_to);
        home.anilist_trailer_to=null;
      }
      if (actvg){
        actvg.classList.remove('yt-playing');
        actvg._iframe_holder.innerHTML='';
        actvg._ytiframe=null;
        actvg=null;
      }
    },
    init:function(){
      if (home.anilist_yt.initialized){
        return;
      }
      home.anilist_yt.initialized=true;
      window.addEventListener('message',function(e) {
        // console.warn(e.data);
        if (_MAL.pop.var.ondetail){
          var pd=JSON.parse(e.data);
          if (pd){
            if ('vcmd' in pd){
              _MAL.pop_detail_youtube_cb(pd.vcmd);
            }
          }
          return;
        }

        if (home.anilist_yt.activeg){
          try{
            var pd=JSON.parse(e.data);
            if (pd){
              if ('vcmd' in pd){
                if (pd.vcmd=='yt-play'){
                  home.anilist_yt.activeg.classList.add('yt-playing');
                }
                else if (pd.vcmd=='yt-pause' || pd.vcmd=='yt-end'){
                  home.anilist_yt.cleanup();
                }
              }
            }
          }catch(x){}
        }
      });
    },
    activeg:null
  },
  anilist_trailer_to:null,
  anilist_trailer_cb:function(g,active){
    if (!g._iframe_holder || (pb.cfg_data.trailer<1)){
      return;
    }
    home.anilist_yt.init();
    home.anilist_yt.cleanup(g);
    if (active){
      if (home.home_slide.classList.contains('active')){
        home.anilist_yt.activeg=g;
        home.anilist_trailer_to=setTimeout(function(){
          requestAnimationFrame(function(){
            if (home.anilist_yt.activeg==g){
              g._ytiframe=
                $n('iframe','',{
                    src:home.yt_init(g._ytid),
                    frameborder:'0',
                    loading:'lazy'
                  },
                  g._iframe_holder,''
                );
            }
          });
        },600);
      }
    }
  },

  anilist_trailer_topcb:function(g,active){
    if (active){
      if (g._sel){
        if (g._sel._activeCb){
          g._sel._activeCb(g._sel,true);
        }
      }
    }
    else{
      home.anilist_yt.cleanup();
    }
  },

  anilist_play_cb:function(g,s){
    clk();
    home.anilist_yt.cleanup();
    pb.action_handler_el(s);
  },

  home_anilist_parse_infobox:function(d, hl, withSeason){
    var vep=0;
    if (d.nextAiringEpisode){
      vep=d.nextAiringEpisode.episode-1;
      if (vep<1){
        vep=0;
      }
    }
    var sumep=d.episodes;
    var mtp=d.format;
    if (mtp=='TV_SHORT'){
      mtp='TV';
    }
    var infotxt='';
    if (d.averageScore){
      infotxt+='<span class="info_score"><u><b style="width:'+d.averageScore+'%">⭐⭐⭐⭐⭐</b><b>⭐⭐⭐⭐⭐</b></u></span>';
    }
    if (d.isAdult){
      infotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
    }
    if (d.seasonYear){
      if (mtp&&(mtp!='unknown')){
        mtp+=" &middot; "+d.seasonYear;
      }
      else{
        mtp=d.seasonYear;
      }
    }
    if (mtp){
      infotxt+='<span class="info_type">'+(mtp)+'</span>';
    }
    if (withSeason){
      if (d.status){
        infotxt+='<span class="info_status">'+((d.status+'').replace(/_/g,' '))+'</span>';
      }
    }
    if (d.duration){
      infotxt+='<span class="info_duration">'+(d.duration)+' min</span>';
    }
    if (withSeason){
      if (vep&&sumep){
        vep=vep+" of "+sumep;
      }
    }
    if (vep){
      infotxt+='<span class="info_ep">'+special(vep+"")+' Episodes</span>';
      d.ep=vep;
    }
    else if (sumep){
      infotxt+='<span class="info_ep">'+special(sumep+"")+' Episodes</span>';
      d.ep=sumep;
    }
    if (infotxt){
      hl._ep=$n('span','info',null,hl._view,infotxt);
    }
  },
  home_anilist_parse:function(g,v){
    home.home_slide.innerHTML='';
    home.home_pager.innerHTML='';
    pb.menu_clear(home.home_slide);
    pb.menu_init(home.home_slide);

    function loadBannerImage(me, id, fallback){
      if (!pb.cfg_data.alisthqbanner || !bannerCacher.enable){
        me.onload=function(){
          this.classList.add('loaded');
        };
        me.src=fallback;
        return;
      }
      bannerCacher.get(id+'',function(im){
        me.onload=function(){
          this.classList.add('loaded');
        };
        if (im){
          me.onerror=function(){
            this.onerror=null;
            me.src=fallback;
          };
          me.src=im;
        }
        else{
          me.src=fallback;
        }
      });
    }

    if (v.data.Page.media.length>0){
      var has_trailer=false;
      for (var i=0;i<v.data.Page.media.length;i++){
        try{
          var d=v.data.Page.media[i];
          if (!d.bannerImage && !d.trailer){
            continue;
          }
          var malid="anilistmedia_"+d.id;

          var hl=$n('div','fullimg',{action:"#"+malid,arg:''},g.P,'');
          home.home_add_pager(hl);
          hl._imgh=$n('content','img_holder',null,hl,'');
          if (d.trailer){
            if (d.trailer.site=="youtube"){
              hl._iframe_holder=$n('framediv','iframe_holder',null,hl,'');
              hl._ytid=d.trailer.id;
              hl._activeCb=home.anilist_trailer_cb;
              has_trailer=true;
              if (!d.bannerImage){
                d.bannerImage=d.trailer.thumbnail;
                d.bannerImageIsThumb=true;
              }
            }
          }

          hl._img=$n('img',d.bannerImageIsThumb?'isthumb':'',{loading:'lazy',src:''},hl._imgh,'');
          loadBannerImage(hl._img, d.id, $img(d.bannerImage?d.bannerImage:$aimg(d.coverImage)));

          hl._viewbox=$n('span','infobox',null,hl,'');
          hl._view=$n('span','infovalue',null,hl._viewbox,'');
          hl._title=$n('h4','',{jp:d.title.romaji?d.title.romaji:d.title.english},hl._view,tspecial(d.title.english?d.title.english:d.title.romaji));
          hl._desc=$n('span','desc',null,hl._view,(d.description));

          var descval=hl._desc.textContent.trim();
          descval=descval.replace(/\n\n/g,'\n').replace(/\n\n/g,'\n').replace(/\n\n/g,'\n');
          hl._desc.innerHTML=nlbr(special(descval));

          home.home_anilist_parse_infobox(d,hl);

          _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
        }catch(ee){}
      }
      requestAnimationFrame(function(){
        pb.menu_select(g,g.P.firstElementChild);
      });
      home.home_list_autoslide();
    }
    if (has_trailer){
      home.home_slide._activeCb=home.anilist_trailer_topcb;
      home.home_slide._enter_cb=home.anilist_play_cb;
    }
  },
  home_anilist_load:function(){
    home.home_onload=1;
    home.home_slide.setAttribute('list-title','AniList Trending');
    var addj='';
    // ' countryOfOrigin: "JP",';
    // if (pb.cfg_data.nonjapan){
    //   addj='';
    // }
    _MAL.alreq(`query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        media(sort:TRENDING_DESC, isAdult:false, status:RELEASING,`+addj+` type: ANIME){
          id
          title{
            romaji
            english
          }
          coverImage{
            large
            medium
            color
          }
          trailer {
            id
            site
            thumbnail
          }
          status
          duration
          format
          seasonYear
          season
          isAdult
          nextAiringEpisode {
            episode
          }
          averageScore
          episodes
          description
          bannerImage
          averageScore
        }
      }
    }`,{
      page:1,
      perPage:10
    },function(v){
      if (v){
        try{
          home.home_anilist_parse(home.home_slide,v);
          return;
        }catch(e){}
        home.home_onload=0;
      }
    },true);
  },

  home_load:function(){
    if (home.home_slide.P){
      delete home.home_slide.P;
      delete home.home_slide._sel;
    }
    home.home_slide.innerHTML='<div class="home_list_loader"><span class="z-loader"></span></div>';
    home.home_slide._page=1;
    home.home_slide._cyclic=1;
    var hs=$('home_slide_holder');
    hs.__last_touch=0;
    touchHelper.gestureReg(hs,function(v,evt){
      if (v==KENTER){
        if (this._lockDirection==0){
          evt.preventDefault();
          evt.stopImmediatePropagation();
          pb.menu_keycb(home.home_slide,v);
        }
      }
    }, window.outerWidth*0.01, 'ontouch', true, function(evt,el,pos){
      if (el._lockDirection==1){
        var sel=home.home_slide._sel;
        var x=pos.clientX-el.__ev_x;
        var n;
        var f=0;
        if (x>0){
          n=sel.previousElementSibling;
          n=n?n:sel.parentElement.lastElementChild;
          f=0-window.outerWidth;
        }
        else{
          n=sel.nextElementSibling;
          n=n?n:sel.parentElement.firstElementChild;
          f=window.outerWidth;
        }
        if (el.__pnel!=n){
          if (el.__pnel){
            el.__pnel.style.opacity='';
            el.__pnel.style.transform='';
          }
          el.__pnel=n;
        }
        el.__mvx=Math.abs(x);
        var opa=el.__mvx/(window.outerWidth*0.3);
        opa=(opa>1)?1:opa;
        n.style.opacity=opa;
        sel.style.transform='translateX('+Math.floor(x)+'px)';
        n.style.transform='translateX('+Math.ceil(f+x)+'px)';
      }
    },
    function(evt,el){
      home.home_slide._sel.style.transform='';
      home.home_slide._sel.style.opacity='';
      if (el.__pnel){
        el.__pnel.style.opacity='';
        el.__pnel.style.transform='';
        if (el.__mvx>window.outerWidth*0.15){
          pb.menu_select(home.home_slide,el.__pnel);
        }
        el.__pnel=null;
      }
      el.__mvx=0;
      el.__last_touch=$tick()+5000;
    });

    if (__SD6||pb.cfg_data.alisthomess||(__SD==2)||__SD7||__SD8){
      home.home_anilist_load();
      return;
    }
    home.home_onload=1;
    $a(__SD5?('/__proxy/'+__AFLIX.ns+'/airing'):'/home',function(r){
      if (r.ok){
        try{
          home.home_parser(r.responseText);
        }catch(e){}
        home.home_onload=0;
      }
    },__SD5?__AFLIX.origin:null);
  },
  
  menus:[[],[],[]],
  list_init_name:function(o, h){
    if (!h){
      return;
    }
    pb.menu_clear(h);
    if (o.list.length>0){
      for (var i=0;i<o.list.length;i++){
        var id=o.list[o.list.length-(i+1)];
        var d=o.detail[id];
        if (d){
          var addarg='';
          var vplay=null;
          var arg={
            url:d.url,
            img:d.poster,
            ttip:d.tip,
            sp:0,
            tp:0,
            ep:0,
            title:d.title
          };
          if (d.play&&(d.play.length==2)){
            vplay=d.play;
            addarg=';'+d.play[0];
            arg.sp=toInt(d.play[0]);
            arg.tp=toInt(d.play[1]);
          }
          var infotxt='';
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.ep){
            infotxt+='<span class="info_ep"><c>avg_pace</c>'+special(d.ep)+'</span>';
            arg.ep=toInt(d.ep);
          }
          var hl=$n('div','',{action:"$"+JSON.stringify(arg),arg:""},h.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
          hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
          
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          if (vplay){
            if (vplay[1]>0){
              var pct=(parseFloat(vplay[0])/parseFloat(vplay[1]))*100.0;
              hl._prog=$n('i','progress',null,hl,'<em style="width:'+pct+'%"></em>');
            }
          }
        }
      }
      pb.menu_select(h,h.P.firstElementChild);
    }
    pb.menu_init(h);
  },
  list_init:function(){
    if (home.mylist_el.fav){
      home.list_init_name(list.fav,home.mylist_el.fav);
    }
    if (home.mylist_el.history){
      home.list_init_name(list.history,home.mylist_el.history);
    }
  },
  header_items_selected:0,
  header_items:[
    $('home_search'),
    $('home_homepage'),
    $('home_mylist'),
    $('home_schedule'),
    $('home_settings'),
    $('home_logo')
    
  ],
  home_time:$('home_time'),
  header_timeupdate:function(){
    var xs=new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    if (home.home_time._time!=xs){
      home.home_time._time=xs;
      home.home_time.innerHTML=xs;
    }
    setTimeout(home.header_timeupdate,2000);
  },
  listOrder:{
    home:[],
    mylist:[]
  },
  tabbed_list:function(el, list_title, atype, atitle, listmenu, loader){
    var par=el.parentElement;
    el.setAttribute("list-title","");
    el.classList.remove('home_list');
    el.classList.remove('pb_menu');
    var h=$n('div','pb_menu home_tabs', null, null, '');
    par.insertBefore(h,el);
    h._holder=el;
    el.innerHTML='';

    // home_list_notitle

    h._midx=-1;
    listmenu.push(h);
    pb.menu_clear(h);
    pb.menu_init(h);
    h.P.setAttribute("list-title",list_title);
    for (var i=0;i<atype.length;i++){
      var title=atitle[i];
      var gn=$n('div','',null,h.P,special(title));
      var hp=$n('div',
        'home_list pb_menu home_list_notitle',
        null,
        el,''
      );
      hp.style.display='none';
      hp._atype=atype[i];
      hp._page=1;
      hp._intz=false;
      gn._ctn=hp;
      if (i==0){
        h._sel=gn;
      }
    }
    h._prev_sel=null;
    el._keycb=function(g,c){
      if (h._prev_sel){
        return h._prev_sel._ctn._keycb(h._prev_sel._ctn,c);
      }
      return false;
    };
    el._activeCb=function(g,x){
      var v=(x?'add':'remove');
      h.classList[v]('active');
      h.classList[v]('active_content');
      for (var i=0;i<el.childElementCount;i++){
        el.children[i].classList[v]('active');
      }
    };
    h.__load=function(hels, force){
      if (hels){
        if (h._prev_sel){
          h._prev_sel.classList.remove('tab_active');
          h._prev_sel._ctn.style.display='none';
        }
        h._prev_sel=hels;
        hels.classList.add('tab_active');
        hels._ctn.style.display='';
        if (!hels._ctn._intz || force){
          hels._ctn._intz=true;
          pb.menu_clear(hels._ctn);
          pb.menu_init(hels._ctn);
          home.recent_init(hels._ctn, loader);
        }
        return true;
      }
      return false;
    };
    h.__selectcb=function(hel,hels){
      return h.__load(hels, 0);
    };
    h._enter_cb=function(hel,hels){
      return h.__load(hels, !hel._isclick);
    };
    pb.menu_select(h,h._sel);
    h.__selectcb(h,h._sel);
  },
  mylist_el:{},
  mylist_initialized:false,
  init_mylist:function(force){
    if (home.mylist_initialized&&!force){
      return;
    }
    home.mylist_initialized=true;
    var mylist=[];
    if (_MAL.islogin()){
      mylist.push(
        [
          "maltab",
          function(el){
            home.tabbed_list(
              el,
              "MAL "+_MAL.auth.user,
              [
                'watching',
                'plan_to_watch',
                'completed',
                'dropped',
                'on_hold'
              ],
              [
                'Watching',
                'Planning',
                'Completed',
                'Dropped',
                'On Hold'
              ],
              home.menus[1],
              _MAL.home_loader
            );
          },
          "MAL Tabbed "+_MAL.auth.user,
          true,
          null,
          ["mal"]
        ]
      );
      mylist.push(
        [
          "mal",
          function(el){
            el._atype='watching';
            home.recent_init(el, _MAL.home_loader);
          },
          "MAL "+_MAL.auth.user,
          false,
          null,
          ["maltab"]
        ]
      );
      mylist.push(
        [
          "malplan",
          function(el){
            el._atype='plan_to_watch';
            home.recent_init(el, _MAL.home_loader);
          },
          "MAL Plan to Watch "+_MAL.auth.user,
          false,
          null
        ]
      );
    }
    if (_MAL.islogin(true)){
      mylist.push(
        [
          "anilisttab",
          function(el){
            home.tabbed_list(
              el,
              "AniList "+_MAL.alauth.user,
              [
                'CURRENT',
                'PLANNING',
                'COMPLETED',
                'DROPPED',
                'PAUSED',
                'REPEATING'
              ],
              [
                'Current',
                'Planning',
                'Completed',
                'Dropped',
                'Paused',
                'Repeating'
              ],
              home.menus[1],
              _MAL.alhome_loader
            );
          },
          "AniList Tabbed "+_MAL.alauth.user,
          true,
          null,
          ["anilist"]
        ]
      );

      mylist.push(
        [
          "anilist",
          function(el){
            el._atype='CURRENT';
            home.recent_init(el, _MAL.alhome_loader);
          },
          "AniList "+_MAL.alauth.user,
          false,
          null,
          ["anilisttab"]
        ]
      );
      

      mylist.push(
        [
          "anilistplan",
          function(el){
            el._atype='PLANNING';
            home.recent_init(el, _MAL.alhome_loader);
          },
          "AniList Plan to Watch "+_MAL.alauth.user,
          false,
          null
        ]
      );
    }
    mylist.push(
      [
        "fav",
        function(el){
          el.classList.add('home_fav');
          home.list_init_name(list.fav,el);
        },
        "Watchlist",
        true
      ]
    );
    mylist.push(
      [
        "history",
        function(el){
          el.classList.add('home_history');
          home.list_init_name(list.history,el);
        },
        "History",
        true
      ]
    );

    var listSaved = listOrder.store.load("mylist",true);
    var list_order=[];
    var list_ids={};
    for (var i=0;i<mylist.length;i++){
      mylist[i][4]=false;
      list_ids[mylist[i][0]]=mylist[i];
    }

    if (listSaved!=null){
      var disabling_ids=[];
      for (var i=0;i<listSaved.length;i++){
        var hs=listSaved[i];
        if (hs[0] in list_ids){
          if (disabling_ids.indexOf(hs[0])==-1){
            if (hs[1]){
              if (list_ids[hs[0]][5]){
                disabling_ids=disabling_ids.concat(list_ids[hs[0]][5]);
              }
            }
          }
          else{
            hs[1]=false;
          }
          list_ids[hs[0]][4]=true;
          list_order.push([hs[0],hs[1]]);
        }
      }
    }

    for (var i=0;i<mylist.length;i++){
      var hs=mylist[i];
      if (!hs[4]){
        hs[4]=true;
        list_order.push([hs[0],hs[3]]);
      }
    }

    home.menus[1]=[];
    home.mylist_el={};
    var lholder=$('home_pagelist');
    lholder.innerHTML='';

    home.listOrder.mylist=[];
    for (var i=0;i<list_order.length;i++){
      var ho=list_order[i];
      var hd=list_ids[ho[0]];
      if (hd){
        if (ho[1]){
          var h=$n('div','home_list pb_menu', {"list-title":hd[2]}, lholder, '');
          h._lid=ho[0];
          home.mylist_el[hd[0]]=h;
          hd[1](h);
          home.menus[1].push(h);
        }
        home.listOrder.mylist.push(
          {
            id:hd[0],
            active:ho[1],
            title:hd[2],
            disabling:hd[5]?hd[5]:null
          }
        );
      }
    }

    /* Reinit active class */
    if (force){
      if ((home.row_selected>0) && (home.col_selected==1)){
        var activeItem=home.list_select(home.col_selected,home.row_selected);
        activeItem.classList.add('active');
        if (activeItem._activeCb){
          activeItem._activeCb(activeItem,true);
        }
      }
    }
  },
  homepage_initialized:false,
  init_homepage:function(force){
    if (home.homepage_initialized&&!force){
      return;
    }
    home.homepage_initialized=true;

    var homepage=[];
    if (__SD3){
      // hianime
      homepage=[
        ["recent","/recently-updated?page=", "Recently Updated", true],
        ["dub","/dubbed-anime?page=", "Latest Dub", true],
        ["top","/top-airing?page=", "Top Airing", true],
        ["movies","/movie?page=", "Movies", false]
      ];
    }
    else if (__SD5){
      // flix
      homepage=[
        ["airing",'/__proxy/'+__AFLIX.ns+'/schedule', "Airing", true],
        ["popular",'/__proxy/'+__AFLIX.ns+'/popular?page=', "Popular", false],
        ["trending",'/__proxy/'+__AFLIX.ns+'/trending?page=', "Trending", true],
        ["movies",'/__proxy/'+__AFLIX.ns+'/movies?page=', "Movies", true]
      ];
    }
    else if (__SD6){
      // kickass
      homepage=[
        ["recent",'/api/show/recent?type=sub&page=', "Recently Updated", true],
        ["dub",'/api/show/recent?type=dub&page=', "Latest Dub", true],
        ["trending",'/api/show/trending?page=', "Trending", true],
        ["popular",'/api/show/popular?page=', "Popular", false],
        ["chinese",'/api/show/recent?type=chinese&page=', "Chinese Update", false]
      ];
    }
    else if (__SD7){
      // gojo
      homepage=[
        ["recent",'/recent-eps?type=anime&perPage=16&page=', "Recently Updated", true]
      ];
    }
    else if (__SD8){
      miruro.provider=miruro.getProvider();
      // miruro
      homepage=[
        // ["recent",'/recent-eps?type=anime&perPage=16&page=', "Recently Updated", true]
      ];
    }
    else{
      // wave & anix
      homepage=[
        ["recent",'/ajax/home/items?name=sub-updates&page=', "Recently Updated", true],
        ["dub",'/ajax/home/items?name=dub-updates&page=', "Latest Dub", true],
        ["all",'/ajax/home/items?name=all-updates&page=', "All Updated", false],
        ["chinese",'/ajax/home/items?name=china-updates&page=', "Chinese Update", false]
      ];
    }

    homepage.push(
      ["alrecent",function(el){
        el._atype='recently';
        home.recent_init(el, _MAL.allist_list_loader);
      }, __SD8?"Recently Released":"Recently Released - AniList", __SD8]
    );

    homepage.push(
      [
        "altab",
        function(el){
          home.tabbed_list(
            el,
            "AniList",
            [
              'top',
              'popular',
              'year',
              'upcomming'
            ],
            [
              'Top Anime',
              'All Time Popular',
              'Top '+_MAL.allist_year(),
              'Upcoming'
            ],
            home.menus[0],
            _MAL.allist_list_loader
          );
        },
        "AniList Tabbed List",
        __SD7||__SD8
      ]
    );
    homepage.push(
      ["altop",function(el){
        el._atype='top';
        home.recent_init(el, _MAL.allist_list_loader);
      }, "Top Anime - AniList", false]
    );
    homepage.push(
      ["alpopular",function(el){
        el._atype='popular';
        home.recent_init(el, _MAL.allist_list_loader);
      }, "All Time Popular - AniList", false]
    );
    homepage.push(
      ["alyear",function(el){
        el._atype='year';
        home.recent_init(el, _MAL.allist_list_loader);
      }, "Top "+_MAL.allist_year()+" - AniList", false]
    );
    homepage.push(
      ["alupcoming",function(el){
        el._atype='upcomming';
        home.recent_init(el, _MAL.allist_list_loader);
      }, "Upcoming - AniList", false]
    );

    var homeSaved = listOrder.store.load("home",false);
    var homepage_order=[];
    var homepage_ids={};
    for (var i=0;i<homepage.length;i++){
      homepage[i][4]=false;
      homepage_ids[homepage[i][0]]=homepage[i];
    }
    if (homeSaved!=null){
      for (var i=0;i<homeSaved.length;i++){
        var hs=homeSaved[i];
        if (hs[0] in homepage_ids){
          homepage_ids[hs[0]][4]=true;
          homepage_order.push([hs[0],hs[1]]);
        }
      }
    }
    for (var i=0;i<homepage.length;i++){
      var hs=homepage[i];
      if (!hs[4]){
        hs[4]=true;
        homepage_order.push([hs[0],hs[3]]);
      }
    }
    home.menus[0]=[home.home_slide];
    var lholder=$('home_lists');
    lholder.innerHTML='';
    
    home.listOrder.home=[];
    for (var i=0;i<homepage_order.length;i++){
      var ho=homepage_order[i];
      var hd=homepage_ids[ho[0]];
      if (hd){
        if (ho[1]){
          var h=$n('div','home_list pb_menu', {"list-title":hd[2]}, lholder, '');
          h._lid=ho[0];
          if (typeof hd[1] === "function"){
            hd[1](h);
          }
          else{
            h._ajaxurl=hd[1];
            home.recent_init(h);
          }
          home.menus[0].push(h);
        }
        home.listOrder.home.push(
          {
            id:hd[0],
            active:ho[1],
            title:hd[2],
            disabling: null
          }
        );
      }
    }
    home.home_load();
  },
  sidebar:{
    contents:$('sidebar_contents'),
    sel:0,
    opentype:0,
    onsidebar:false,
    profile:null,
    items:[],
    itemAction:function(elm,c){
      function changeSourceFn(){
        _JSAPI.storeSet(_API.user_prefix+"sd",elm._arg+"");
        _JSAPI.setSd(elm._arg);
        setTimeout(function(){
          _API.reload();
        },10);
      }

      if (c=='source_domain'){
        if (elm._arg==8){
          miruro.beforeChangeSource(changeSourceFn);
        }
        else{
          SD_SETTINGS(elm._arg,function(newdomain){
            if (newdomain){
              if (elm._checked){
                setTimeout(function(){
                  _API.reload();
                },10);
              }
              else{
                elm._domain.innerHTML='@'+newdomain;
              }
            }
          });
        }
      }
      else if (c=='source'){
        if (elm._arg==8){
          miruro.beforeChangeSource(changeSourceFn);
        }
        else{
          changeSourceFn();
        }
      }
      else if (c=='profile'){
        home.profiles.open(_API.user_prefix,0);
      }
      else if (c=='playlist'){
        _API.showToast("Under constructions...");
      }
      // else if (c=='castplayer'){
      //   _JSAPI.castConnect();
      // }
      else{
        return false;
      }
      return true;
    },
    itemclick:function(ev){
      var c=this._action;
      var elm=this;
      console.warn(elm);

      if (c=='source_domain'){
        clk();
        home.sidebar.itemAction(this.parentElement,c);
        return false;
      }
      var pc=home.sidebar.items.indexOf(elm);
      var isactive=false;
      if (pc>-1){
        if (pc>-1){
          if (pc!=home.sidebar.sel){
            clk();
            home.sidebar.items[home.sidebar.sel].classList.remove('active');
            elm.classList.add('active');
            home.sidebar.sel=pc;
          }
          else{
            isactive=true;
          }
        }
      }
      if (c=='source'){
        if (!isactive || ev.target==elm._items){
          return false;
        }
      }
      clk();
      home.sidebar.itemAction(elm,c);
      return false;
    },
    update_items:function(pc){
      if (pc!=home.sidebar.sel){
        var elm=home.sidebar.items[home.sidebar.sel];
        elm.classList.remove('active');
        elm=home.sidebar.items[pc];
        elm.classList.add('active');
        if (elm._items){
          if (!elm._checked){
            elm._items.classList.remove('active');
          }
        }
        home.sidebar.sel=pc;
        return true;
      }
      return false;
    },
    keycb:function(c){
      var pc=home.sidebar.sel;
      var elm=home.sidebar.items[pc];
      if (c==KBACK || c==KMENU){
        if (home.sidebar.opentype==2 || home.sidebar.opentype==3){
          /* Back to sidebar */
          if (pc!=0 || (c==KMENU)){
            // close + reset
            clk();
            home.sidebar.update_items(0);
            $('sidebar').classList.remove('active');
            home.sidebar.opentype=0;
            home.sidebar.onsidebar=false;
          }
          else if (c==KBACK){
            if (home.sidebar.opentype==3){
              if ((home.profiles.users.length>1)||(home.profiles.me.p)){
                // logout
                clk();
                home.profiles.logout();
                return true;
              }
            }
            // exit
            clk();
            _JSAPI.appQuit();
          }
          return true;
        }
        else if (home.sidebar.opentype==1){
          /* Click logo / menu key */
          if (pc==0 || c==KMENU){
            // close + reset
            clk();
            home.sidebar.update_items(0);
            $('sidebar').classList.remove('active');
            home.sidebar.opentype=0;
            home.sidebar.onsidebar=false;
          }
          else{
            clk();
            home.sidebar.update_items(0);
          }
          return true;
        }
        else if (home.sidebar.opentype==0){
          /* Direct open */
          if (pc==0){
            // close + reset
            clk();
            home.sidebar.update_items(0);
            $('sidebar').classList.remove('active');
            home.sidebar.opentype=0;
            home.sidebar.onsidebar=false;
            return false; 
          }
          else{
            clk();
            home.sidebar.update_items(0);
          }
          return true;
        }
        return true;
      }
      else if (c==KUP){
        if (--pc<0) pc=0;
      }
      else if (c==KDOWN){
        if (++pc>=home.sidebar.items.length) pc=home.sidebar.items.length-1;
      }
      else if (c==KLEFT||c==KRIGHT){
        if (elm._items){
          if (c==KLEFT){
            if (!elm._items.classList.contains('active')){
              clk();
              elm._items.classList.add('active');
              return true;
            }
          }
          else if (c==KRIGHT){
            if (elm._items.classList.contains('active') && !elm._checked){
              clk();
              elm._items.classList.remove('active');
              return true;
            }
          }
        }
        
        clk();
        home.sidebar.update_items(0);
        $('sidebar').classList.remove('active');
        home.sidebar.onsidebar=false;
        var ot=home.sidebar.opentype;
        home.sidebar.opentype=0;
        return (ot==0)?false:true;
      }
      else if (c==KENTER){
        if (elm._action=='source'){
          clk();
          if (elm._items.classList.contains('active')){
            home.sidebar.itemAction(elm,'source_domain');
          }
          else{
            home.sidebar.itemAction(elm,'source');
          }
          return true;
        }
        else{
          clk();
          home.sidebar.itemAction(elm,elm._action);
        }
        return true;
      }
      if (pc!=home.sidebar.sel){
        clk();
        home.sidebar.update_items(pc);
      }
      return true;
    }
  },
  profiles:{
    isadmin:function(){
      return (_API.user_prefix=="");
    },
    user_row:function(prefix,name,pp,pin){
      return {
        u:prefix,
        n:name,
        i:pp,
        p:pin,
        it:"Anymoe",
        x:6
      };
    },
    find:function(prefix, retidx){
      for (var i=0;i<home.profiles.users.length;i++){
        if (home.profiles.users[i].u==prefix){
          return retidx?i:home.profiles.users[i];
        }
      }
      return retidx?-1:null;
    },
    save:function(){
      _JSAPI.storeSet("users",JSON.stringify(home.profiles.users));
    },
    logout:function(){
      var cprof=_JSAPI.profileGetSel();
      _JSAPI.profileSetSel(-1);
      _JSAPI.profileSetPrefix("");
      location='/__view/login/login.html'+(cprof>=0?"#pp="+cprof:"");
    },
    init:function(){
      if (_JSAPI.profileGetSel()==-1){
        home.profiles.logout();
        return false;
      }
      _API.user_prefix=_JSAPI.profileGetPrefix();

      var userdata=_JSAPI.storeGet("users","");
      var defuser=[home.profiles.user_row('','Default User',0,'')];
      if (userdata){
        try{
          var ud=JSON.parse(userdata);
          defuser=ud;
        }catch(e){}
      }
      home.profiles.users=defuser;
      home.profiles.me=home.profiles.find(_API.user_prefix,false);
      ratingSystem.setCurrentRating(home.profiles.me.x);
      return true;
    },
    users:[],
    me:null,
    ppimgv:function(uid){
      var usr=home.profiles.find(uid,false);
      if (usr){
        if (usr.im){
          return usr.im;
        }
        return _API.ppic_base+'pic/'+(usr.i)+'.png';
      }
      return _API.ppic_base+"pic/0.png";
    },
    ppimg:function(uid){
      var pp=home.profiles.ppimgv(uid);
      if (pp.indexOf(_API.ppic_base)>-1){
        return $imgnl(pp,128);
      }
      return pp;
    },
    ppname:function(uid){
      var usr=home.profiles.find(uid,false);
      if (usr){
        return usr.n;
      }
      return 'Default User';
    },
    ratename:function(uid){
      var usr=home.profiles.find(uid,false);
      if (usr){
        if (usr.x<6 && usr.x>=0){
          return ratingSystem.ratingName(usr.x);
        }
      }
      return '';
    },
    set_pp:function(uid, cb){
      var usr=home.profiles.find(uid,false);
      if (!usr){
        cb();
        return false;
      }
      listOrder.showImgPicker(
        "Set Profile Picture",
        function(page,fcb){
          var res={
            anilist:null,
            mal:null
          };
          var n=3;
          function start_list(){
            if (n<1){
              requestAnimationFrame(function(){
                var o={
                  havenext:false,
                  data:[]
                };
                var have_active=false;
                if (res.anilist){
                  var vo={
                    src:res.anilist,
                    title:"AniList Avatar",
                    rsrc:"-anilist"
                  };
                  if (usr.i==vo.rsrc || usr.im==vo.src){
                    vo.active=true;
                    have_active=true;
                  }
                  o.data.push(vo);
                }
                if (res.mal){
                  var vo={
                    src:res.mal,
                    title:"MAL Avatar",
                    rsrc:"-mal"
                  };
                  if (usr.i==vo.rsrc || usr.im==vo.src){
                    vo.active=true;
                    have_active=true;
                  }
                  o.data.push(vo);
                }
                for (var i=0;i<_API.ppic_data.length;i++){
                  var vo={
                    src:_API.ppic_base+"pic/"+_API.ppic_data[i].src+".png",
                    title:_API.ppic_data[i].title,
                    rsrc:_API.ppic_data[i].src
                  };
                  if (usr.i==vo.rsrc || usr.im==vo.src){
                    vo.active=true;
                    have_active=true;
                  }
                  o.data.push(vo);
                }
                if (!have_active){
                  o.data[0].active=true;
                }
                fcb(o);
              });
            }
          }
          if (uid==_API.user_prefix){
            // with anilist/MAL
            _MAL.getAvatar(true,function(c){
              res.anilist=c;
              n--;
              start_list();
            });
            _MAL.getAvatar(false,function(c){
              res.mal=c;
              n--;
              start_list();
            });
          }
          else{
            // without anilist/MAL
            n=1;
          }
          
          _API.ppic_list(function(){
            n--;
            start_list();
          });
          return true;
        },
        function(r){
          if (r!=null){
            usr.i=r.rsrc;
            usr.im=r.src;
            usr.it=r.title;
            if (uid==_API.user_prefix){
              if (home.sidebar.profile){
                home.sidebar.profile._img.src=home.profiles.ppimg(uid);
              }
            }
            home.profiles.save();
          }
          cb();
        }
      );

      return true;
    },
    set_name:function(uid, cb){
      var usr=home.profiles.find(uid,false);
      if (!usr){
        cb();
        return false;
      }
      _API.textPrompt(
        "Set Display Name","Please insert new <b>Display Name</b>",
        false, 18, usr.n,
        function(v){
          if (v){
            if (v.value.trim()){
              usr.n=v.value.trim();
              if (uid==_API.user_prefix){
                if (home.sidebar.profile){
                  home.sidebar.profile._displayname.innerHTML=special(home.profiles.ppname(uid));
                }
              }
              home.profiles.save();
            }
          }
          cb();
        }
      );
      return true;
    },
    parental:function(uid,cb){
      var usr=home.profiles.find(uid,false);
      if (!usr){
        cb();
        return false;
      }
      if (uid==_API.user_prefix){
        cb();
        return false;
      }
      var rc=ratingSystem.toRatingId(usr.x);
      listOrder.showList(
        "Parental Control",ratingSystem.ratings_withdesc,rc,
        function(v){
          if (v!=null){
            usr.x=v;
            home.profiles.save();
          }
          cb();
        }
      );
    },
    set_pin:function(uid, cb, pinok){
      var usr=home.profiles.find(uid,false);
      if (!usr){
        cb();
        return false;
      }
      if (uid==_API.user_prefix && !pinok){
        if (usr.p){
          _API.textPrompt(
            "Input your current PIN",undefined,
            true, 4, '',function(cp){
              if (cp && cp.value!=usr.p){
                _API.showToast("PIN is Invalid");
                cb();
                return false;
              }
              home.profiles.set_pin(uid,cb,1);
              return true;
            }
          );
          return true;
        }
      }
      _API.textPrompt(
        "Set Pin","&bull; Use <b>4 Numeric</b> as PIN<br>&bull; Leave <b>empty</b> to clear pin",
        true, 4, '', function(vr){
          if (vr){
            var v=vr.value;
            if (v){
              if (v.length==4){
                _API.textPrompt(
                  "Confirm Pin","&bull; Input PIN again to confirm",
                  true, 4, '', function(vr2){
                    if (vr2 && vr2.value==v){
                      usr.p=v;
                      home.profiles.save();
                      _API.showToast("PIN has been changed");
                    }
                    else{
                      _API.confirm("Change PIN Failed",
                        "PIN Confirmation not match<br>Try Again?",
                        function(cnf){
                          if (cnf){
                            home.profiles.set_pin(uid,cb,1);
                            return;
                          }
                          cb();
                      });
                      return;
                    }
                    cb();
                  }
                );
                return;
              }
              else{
                _API.confirm("Change PIN Failed",
                  "Please use 4 numeric for pin<br>Try Again?",
                  function(cnf){
                    if (cnf){
                      home.profiles.set_pin(uid,cb,1);
                      return;
                    }
                    cb();
                });
                return;
              }
            }
            else if (usr.p){
              _API.confirm("Remove PIN",
                "Are you sure you want to remove user PIN?",
                function(cnf){
                  if (cnf){
                    usr.p='';
                    home.profiles.save();
                    _API.showToast("PIN has been removed");
                  }
                  cb();
              });
              return;
            }
          }
          cb();
        }
      );
      return true;
    },
    open:function(uid,sel,endcb){
      var menu=[];
      if (uid==_API.user_prefix){
        if (home.profiles.users.length>1){
          menu.push({
            icon:'swap_horiz',
            title:'Switch User',
            id:'switch'
          });
        }
      }
      var pretitle='';
      var usr=home.profiles.find(uid,false);
      if (!usr){
        return false;
      }
      menu.push({
        icon:'badge',
        title:'<span class="label">Display Name</span>'+
          '<span class="value vinline">'+special(usr.n)+'</span>',
        id:'name'
      });
      menu.push({
        icon:'account_box',
        title:'<span class="label">Profile Picture</span>'+
          '<span class="value vinline">'+special(usr.it?usr.it:usr.i)+'</span>',
        id:'avatar'
      });
      menu.push({
        icon:'lock',
        title:'<span class="label">PIN</span>'+
          '<span class="value vinline">'+special(usr.p?'Have PIN':'No PIN')+'</span>',
        id:'pin'
      });

      if (!sel){
        sel=0;
      }
      if ((uid=='') && (_API.user_prefix=='')){
        menu.push({
          icon:'construction',
          title:'Manage Users',
          id:'manage'
        });
      }
      else if (_API.user_prefix==''){
        var rc = ratingSystem.toRatingId(usr.x);
        var rv = ratingSystem.ratingName(rc);
        menu.push({
          icon:'escalator_warning',
          title:'<span class="label">Parental Control</span>'+
          '<span class="value vinline">'+special(rv)+'</span>',
          id:'parental'
        });

        menu.push({
          icon:'delete',
          title:'Delete User',
          id:'delete'
        });
        pretitle='<c>build</c>';
      }
      // _API.listPrompt(
      //   pretitle+usr.n,
      //   menu, undefined, false, false, sel,
      listOrder.showMenu('',menu,sel,
        function(v){
          if (v!=null){
            if (menu[v].id=="switch"){
              home.profiles.logout();
              return;
            }
            else if (menu[v].id=="avatar"){
              home.profiles.set_pp(uid,function(){
                home.profiles.open(uid,v,endcb);
              });
              return;
            }
            else if (menu[v].id=="name"){
              home.profiles.set_name(uid,function(){
                home.profiles.open(uid,v,endcb);
              });
              return;
            }
            else if (menu[v].id=="pin"){
              requestAnimationFrame(function(){
                home.profiles.set_pin(uid,function(){
                  home.profiles.open(uid,v,endcb);
                });
              });
              return;
            }
            else if (menu[v].id=="manage"){
              home.profiles.manage(0,function(){
                home.profiles.open(uid,v,endcb);
              });
              return;
            }
            else if (menu[v].id=="parental"){
              home.profiles.parental(uid,function(){
                home.profiles.open(uid,v,endcb);
              });
              return;
            }
            else if (menu[v].id=="delete"){
              _API.confirm("Delete User",
                "Are you sure you want to delete user <b>"+usr.n+"</b>?",function(cnf){
                if (cnf){
                  var un=home.profiles.find(uid,true);
                  if ((un>0)&&(uid!='')){
                    home.profiles.users.splice(un,1);
                    home.profiles.save();
                    _API.showToast("User has been deleted");

                    /* delete all pref */
                    try{
                      _JSAPI.storeDel(uid+"pb_cfg");
                      _JSAPI.storeDel(uid+"mal_auth");
                      _JSAPI.storeDel(uid+"anilist_auth");
                      _JSAPI.storeDel(uid+"theme");
                      _JSAPI.storeDel(uid+"list_history");
                      _JSAPI.storeDel(uid+"list_fav");
                      _JSAPI.storeDel(uid+"_anix_list_history");
                      _JSAPI.storeDel(uid+"_anix_list_fav");
                      _JSAPI.storeDel(uid+"search_history");
                      _JSAPI.storeDel(uid+"search_config");
                      _JSAPI.storeDel(uid+"_listorder_mylist");

                      /* SD */
                      _JSAPI.storeDel(uid+"sd");
                      for (var i=1;i<=6;i++){
                        _JSAPI.storeDel(uid+"sdomain_"+i);
                      }
                    }catch(e){}
                    if (endcb){
                      endcb(true);
                      return;
                    }
                  }
                  home.profiles.open(uid,v,endcb);
                }
                else{
                  home.profiles.open(uid,v,endcb);
                }
              });
              return;
            }
          }
          if (endcb){
            endcb();
          }
        }
      );
      listOrder.title_el.classList.add('profile');
      listOrder.title_el.innerHTML=
        '<img src="'+home.profiles.ppimg(usr.u)+'" class="listimg" /> '+
        special(usr.n)+pretitle;
    },
    default_user:function(endcb){
      var dusr=_JSAPI.storeGet("default_user","");
      var sme=home.profiles.find(dusr,false);
      var sel=0;
      var usrs=["Always show login screen"];
      for (var i=1;i<home.profiles.users.length;i++){
        usrs.push(home.profiles.users[i].n);
        if (sme && home.profiles.users[i].u==sme.u){
          sel=i;
        }
      }

      listOrder.showList(
        "Set Default User",
        usrs,sel,
        function(v){
          if (v!=null){
            _JSAPI.storeSet("default_user",home.profiles.users[v].u+"")
          }
          endcb();
        }
      );
    },
    manage:function(sel,endcb){
      var usrs=[];
      var start_u=0;
      var can_add_new=false;
      if (home.profiles.users.length<5){
        usrs.push({
          icon:'add',
          title:"Add New User",
          id:'addnew'
        });
        start_u++;
        can_add_new=true;
      }
      if (home.profiles.users.length>1){
        var dusr=_JSAPI.storeGet("default_user","");
        var sme=home.profiles.find(dusr,false);
        usrs.push({
          icon:'check',
          title:'<span class="label">Default User</span>'+
            '<span class="value vinline">'+special((dusr&&sme)?sme.n:"")+'</span>',
          id:'default'
        });
        start_u++;
      }
      for (var i=1;i<home.profiles.users.length;i++){
        usrs.push({
          icon:'account_circle',
          image:home.profiles.ppimg(home.profiles.users[i].u),
          title:special(home.profiles.users[i].n),
          id:i
        });
      }
      // _API.listPrompt(
      //   "Manage Users",
      //   usrs, undefined, false, false, sel,
      listOrder.showMenu("Manage Users",usrs,sel,
        function(v){
          if (v!=null){
            if (v==0 && can_add_new){
              var un="u"+$tick();
              var nu=home.profiles.user_row(un,'User '+(home.profiles.users.length+1),0,'');
              home.profiles.users.push(nu);
              home.profiles.save();
              _API.showToast("New user has been created");
              requestAnimationFrame(function(){
                home.profiles.manage(0,endcb);
              });
            }
            else if (usrs[v].id=="default"){
              home.profiles.default_user(function(){
                requestAnimationFrame(function(){
                  home.profiles.manage(v,endcb);
                });
              });
            }
            else{
              var selu=(v-start_u)+1;
              if (start_u==0){
                selu++;
              }
              home.profiles.open(home.profiles.users[selu].u,0,function(isdel){
                home.profiles.manage(isdel?0:v,endcb);
              });
            }
          }
          else{
            if (endcb){
              endcb();
            }
          }
        }
      );
    }
  },
  init_sidebar_mode:function(){
    home.sidebar.onsidebar=false;
    home.sidebar.opentype=0;
    if (pb.cfg_data.directsidebar){
      $('sidebar').classList.remove('active');
      home.header_items[5]=$('sidebar');
    }
    else{
      $('home_logo').classList.remove("active");
      home.header_items[5]=$('home_logo');
    }
  },
  init_sidebar:function(){
    home.init_sidebar_mode();
    home.sidebar.contents.innerHTML='';
    home.sidebar.sel=0;

    // $n('div','animetv_logo',null,home.sidebar.contents,'AnimeTV');

    /* Init Profile */
    var profile=$n('div','sidebar_profile',null,home.sidebar.contents,'');
    profile._action='profile';
    profile._img=$n('img','',{src:home.profiles.ppimg(_API.user_prefix)},profile,'');
    profile._txt=$n('span','',null,profile,'');
    profile._displayname=$n('b','',null,profile._txt,special(home.profiles.ppname(_API.user_prefix)));
    var rn=home.profiles.ratename(_API.user_prefix);
    profile._username=$n('i','',null,profile._txt,(_API.user_prefix=='')?'admin':'user'+(rn?" - "+rn:""));
    profile.classList.add('active');
    home.sidebar.profile=profile;
    profile.onclick=home.sidebar.itemclick;
    home.sidebar.items=[profile];

    /* Init Sources */
    var sources=$n('div','sidebar_source sidebar_group',{title:'Sources'},home.sidebar.contents,'');
    for (var i=0;i<__SOURCE_NAME.length;i++){
      var active=(__SD==i+1);
      var seldomain=_JSAPI.storeGet(SD_CFGNAME(i+1),"");
      if (!seldomain){
        seldomain=__SOURCE_DOMAINS[i][0];
      }
      if ((i==4)||(i==1)||(i==3)) {
        /* Parental will not work on source 5 */
        continue;
      }
      if (i==7){
        /* miruro */
        seldomain=miruro.providers_name[miruro.getProvider()];
      }
      // if (!ratingSystem.allSource){
      //   if (i==4){
      //     /* Parental will not work on source 5 */
      //     continue;
      //   }
      // }
      var hl=$n('div',active?'sidebar_item checked':'sidebar_item',null,sources,'');
      hl.onclick=home.sidebar.itemclick;
      hl._action='source';
      hl._arg=i+1;
      hl._checked=active;
      hl._icon=$n('c','',null,hl,'cloud');
      hl._items=$n('c',active?'items active':'items',null,hl,'settings');
      hl._items._action='source_domain';
      hl._items.onclick=home.sidebar.itemclick;
      hl._txt=$n('span','',null,hl,special(__SOURCE_NAME[i]));
      hl._domain=$n('i','',null,hl._txt,'@'+seldomain);
      home.sidebar.items.push(hl);

      home.sidebar.contents.onclick=
      $('sidebar').onclick=function(ev){
        if (ev.target==this){
          clk();
          home.sidebar.update_items(0);
          $('sidebar').classList.remove('active');
          home.sidebar.opentype=0;
          home.sidebar.onsidebar=false;
        }
        return false;
      };
    }

    /* Playlist */
    // var tools=$n('div','sidebar_group',{title:'Tools'},home.sidebar.contents,'');
    // var playlist=$n('div','sidebar_item',null,tools,'<c>playlist_play</c>Playlist');
    // playlist._action='playlist';
    // playlist.onclick=home.sidebar.itemclick;
    // home.sidebar.items.push(playlist); 

    // if (_TOUCH){
    //   var castplayer=$n('div','sidebar_item',null,tools,'<c>cast</c>Cast');
    //   castplayer._action='castplayer';
    //   castplayer.onclick=home.sidebar.itemclick;
    //   home._cast_sidebar=castplayer;
    //   home.sidebar.items.push(castplayer);    
    // }
  },
  init:function(){
    pb.cfg_load();
    _API.setUri("/home");
    list.load();
    home.header_timeupdate();

    if (pb.cfg_data.homylist){
      home.init_mylist(true);
      home.update_homepages(1,1);
    }
    else{
      home.init_homepage(true);
      home.update_homepages(0,1);
    }

    _API.setKey(home.keycb);
    home.col_selected=0;
    home.row_selected=0;
    home.home_header._keycb=home.header_keycb;
    home.home_header.classList.add('active');

    home.header_items[0].classList.add('active');
    try{
      if (_JSAPI.haveMic(true)){
        home.header_items.push($('home_voice'));
        $('home_voice').classList.remove('hide');
      }
    }catch(e){}

    home.update_homepages(pb.cfg_data.homylist?1:0);
    home.init_discord_message();
    home.init_sidebar();

    home.home_scroll_mask.onscroll=function(){
      if (this.scrollTop>window.outerWidth*0.05){
        if (!home.home_header.classList.contains('scrolled')){
          home.home_header.classList.add('scrolled');
        }
      }
      else{
        if (home.home_header.classList.contains('scrolled')){
          home.home_header.classList.remove('scrolled');
        }
      }
    };

    home.home_scroll_mask.__pull=$('home_pull_refresh');
    /* Pull to Refresh */
    touchHelper.gestureReg(home.home_scroll_mask,
      function(c,e){
        if (c==KUP){
          if (this.scrollTop==0){
            if (!this.__ispull && !pb.pb.classList.contains('active') && !home.search.search.classList.contains('active')){
              const firstTouch = touchHelper.getTouch(e);
              this.__ispull=true;
              this.__last_y=0;
              this.__first_y=firstTouch.clientY;
              this._minmove=1;
              this.__pull.style.transform='';
              this.__pull.style.opacity='';
              this.__pull.innerHTML='refresh';
              this.__pull.classList.remove('refreshing');
              this.__pull.classList.remove('cancel_refresh');
              this.__pulled=false;
            }
          }
        }
      },window.outerHeight*0.05,null,true,
      function(e,g,m){
        if (this.__ispull){
          this.__last_y=m.clientY-this.__first_y;
          var max=window.outerHeight * 0.24;
          var maxrot=window.outerHeight * 0.4;
          var min=window.outerHeight * 0.1;
          var cv=this.__last_y * 1.5;
          var rot=cv;
          if (rot>maxrot){
            rot=maxrot;
          }
          if (cv>max){
            cv=max;
            this.__pulled=true;
          }
          else{
            this.__pulled=false;
          }
          var pc = (rot*360)/max;
          var opa = cv/parseFloat(max);
          this.__pull.style.opacity=opa;
          this.__pull.style.transform='translateY('+(cv-min)+'px) rotate('+(pc-360)+'deg)';
        }
      },function(e,g){
        if (this.__ispull){
          if (this.__pulled){
            this.__pull.classList.add('refreshing');
            this.__pull.innerHTML='progress_activity';
            g.__pull.style.transform='';
            this.__pull.style.opacity='';

            var sel=0;
            for (var i=0;i<home.homepages.length;i++){
              if (home.homepages[i].classList.contains('active')){
                sel=i;
                break;
              }
            }
            if (sel==0){
              home.init_homepage(true);
            }
            else if (sel==1){
              home.init_mylist(true);
            }
            else if (sel==2){
              home.schedule_init(true);
            }
          }
          else{
            this.__pull.innerHTML='refresh';
            this.__pull.style.transform='';
            this.__pull.style.opacity='';
            this.__pull.classList.add('cancel_refresh');
          }
        }
        this.__last_y=0;
        this.__pulled=false;
        this.__ispull=false;
      }
    );

    // container click
    $('popupcontainer').onclick=function(ev){
      if (ev.target==this){
        window._KEYEV(KBACK,1);
      }
    };
    // header item click
    for (var i=0;i<home.header_items.length;i++){
      if (home.header_items[i]!=$('sidebar')){
        home.header_items[i].onclick=home.header_item_click;
      }
    }
    $('home_logo').onclick=home.header_item_click;
  },
  init_discord_message:function(){
    // Discord Info & Announchments
    var iv=$('home_discord_info_value');
    iv.innerHTML='';
    iv._msg=[];
    iv._msg_pos=-1;
    function start_discord_message(){
      if (iv._msg_pos>=0){
        iv._msg[iv._msg_pos].className='';
      }
      if (++iv._msg_pos>=iv._msg.length){
        iv._msg_pos=0;
      }
      iv._msg[iv._msg_pos].className='active';
    }
    _API.discordFetch(function(r){  
      if (r.ok){
        try{
          var j=JSON.parse(r.responseText);
          for (var i=0;i<j.length;i++){
            var m=j[i];
            if (m.content){
              var g=document.createElement('div');
              g.innerHTML=
                '<span><c>info</c> '+((new Date(m.timestamp)).toLocaleString())+'</span>'+
                '<p>'+md2html(m.content)+'</p>';
              iv._msg.push(g);
              iv.appendChild(g);
            }
          }
          start_discord_message();
          setInterval(start_discord_message,10000);
        }catch(e){
          console.log("ERROR "+e);
          iv.innerHTML='';
        }
      }
    });
  },

  settings:{
    sel:0,
    subsel:0,
    needreload:false,
    settings:$('settings'),
    sscroll:$('settings_scroll'),
    more:$('settings_more'),
    integration:$('settings_integration'),
    networks:$('settings_networks'),
    video:$('settings_video'),
    slang:$('settings_lang'),
    styling:$('settings_style'),
    performance:$('settings_performance'),
    about:$('settings_about'),
    tools:{},
    isplayback:0,
    menus:[],
    initmore_done:false,
    initmore:function(){
      if (!home.settings.initmore_done){
        pb.menu_clear(home.settings.slang);
        pb.menu_clear(home.settings.video);
        pb.menu_clear(home.settings.styling);
        pb.menu_clear(home.settings.performance);
        pb.menu_clear(home.settings.more);
        pb.menu_clear(home.settings.networks);
        pb.menu_clear(home.settings.integration);
        pb.menu_clear(home.settings.about);

        home.settings.tools={};

        home.settings.tools._s_lang=$n(
          'div','',{
            action:'*lang',
            s_desc:"Select language priority for video subtitle and audio"
          },
          home.settings.slang.P,
          '<c>closed_caption</c> Subtitle Language<span class="value"></span>'
        );
        home.settings.tools._s_ccstyle=$n(
          'div','',{
            action:'*ccstyle'
          },
          home.settings.slang.P,
          '<c>brand_family</c> Subtitle Style <span class="value">Style 1</span>'
        );
        home.settings.tools._s_dubaudio=$n(
          'div','',{
            action:'*dubaudio',
            s_desc:"Always use DUB stream when available"
          },
          home.settings.slang.P,
          '<c class="check">check</c><c>speech_to_text</c> Prefer DUB Stream'
        );
        home.settings.tools._s_alang=$n(
          'div','',{
            action:'*alang',
            s_desc:"Select prefered stream audio language (only for supported source only)"
          },
          home.settings.slang.P,
          '<c>text_to_speech</c> Audio Language<span class="value"></span>'
        );

        /* Video */
        home.settings.tools._s_autonext=$n(
          'div','',{
            action:'*autonext'
          },
          home.settings.video.P,
          '<c class="check">check</c><c>step_over</c> Auto Next'
        );
        home.settings.tools._s_autoskip=$n(
          'div','',{
            action:'*autoskip'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>footprint</c> Auto Skip Intro'
        );

        home.settings.tools._s_skipfiller=$n(
          'div','',{
            action:'*skipfiller'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>move_selection_left</c> Skip Filler'
        );
        home.settings.tools._s_scale=$n(
          'div','',{
            action:'*scale'
          },
          home.settings.video.P,
          '<c>aspect_ratio</c> Video Scaling<span class="value">-</span>'
        );
        home.settings.tools._s_quality=$n(
          'div','',{
            action:'*quality',
            s_desc:'Select preferred streaming quality'
          },
          home.settings.video.P,
          '<c>hd</c> Video Quality<span class="value">-</span>'
        );
        home.settings.tools._s_seekvalue=$n(
          'div','',{
            action:'*seekvalue'
          },
          home.settings.video.P,
          '<c>fast_forward</c> Seek Value<span class="value"></span>'
        );
        home.settings.tools._s_closeconfirm=$n(
          'div','',{
            action:'*closeconfirm',
            s_desc:'Action to close the playback'
          },
          home.settings.video.P,
          '<c>cancel_presentation</c> Close Confirmation<span class="value">-</span>'
        );

        if (_TOUCH){
          home.settings.tools._s_disablegesture=$n(
            'div','',{
              action:'*disablegesture'
            },
            home.settings.video.P,
            '<c class="check">clear</c><c>do_not_touch</c> Disable Touch Gesture'
          );
        }

        home.settings.tools._s_preloadep=$n(
          'div','',{
            action:'*preloadep',
            s_desc:'Prepare episode data before video finished for faster next episode load'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>cloud_download</c> Preload Next Episode'
        );

        if (!_ISELECTRON){
          home.settings.tools._s_html5player=$n(
            'div','',{
              action:'*html5player',
              s_desc:"Enable if you have a problem with stuttering playback, some features may disabled"
            },
            home.settings.video.P,
            '<c class="check">check</c><c>live_tv</c> Use HTML5 Video Player'
          );
        }
        

        /* Style */
        home.settings.tools._s_uifontsize=$n(
          'div','',{
            action:'*uifontsize'
          },
          home.settings.styling.P,
          '<c>format_size</c> Font Size<span class="value">Normal</span>'
        );
        home.settings.tools._s_theme=$n(
          'div','',{
            action:'*theme'
          },
          home.settings.styling.P,
          '<c>palette</c> Interface Color <span class="value">-</span>'
        );
        home.settings.tools._s_bgimg=$n(
          'div','',{
            action:'*bgimg'
          },
          home.settings.styling.P,
          '<c>wallpaper</c> Wallpaper<span class="value">Wallpaper-1</span>'
        );
        home.settings.tools._s_largeui=$n(
          'div','',{
            action:'*largeui',
            s_desc:"Use bigger UI on anime list"
          },
          home.settings.styling.P,
          '<c class="check">clear</c><c>settings_overscan</c> Large UI'
        );

        if (home.profiles.isadmin()){
          home.settings.tools._s_loginscreen=$n(
            'div','',{
              action:'*loginscreen',
              s_desc:"Change Who's Watching screen style"
            },
            home.settings.styling.P,
            '<c>shield_person</c> Login Style<span class="value"></span>'
          );
        }
        
        /* Performance */
        home.settings.tools._s_animation=$n(
          'div','',{
            action:'*animation'
          },
          home.settings.performance.P,
          '<c>animation</c> Transition Animation<span class="value">Normal</span>'
        );
        home.settings.tools._s_performance=$n(
          'div','',{
            action:'*performance',
            s_desc:"Enable/disable some effects for better performance gain"
          },
          home.settings.performance.P,
          '<c>readiness_score</c> Performance UI<span class="value">Normal</span>'
          // '<c class="check">clear</c><c>readiness_score</c> Performance UI'
        );
        home.settings.tools._s_clksound=$n(
          'div','',{
            action:'*clksound',
            s_desc:"Enable navigation audio, only for supported devices"
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>brand_awareness</c> Navigation Sound'
        );


        if (_ISELECTRON){
          if (home.profiles.isadmin()){
            home.settings.tools._s_initwinstate=$n(
              'div','',{
                action:'*initwinstate',
                s_desc:"Set initial window state when app is launching"
              },
              home.settings.performance.P,
              '<c>fullscreen</c> Initial Window State<span class="value"></span>'
            );
          }
        }
        

        home.settings.tools._s_homylist=$n(
          'div','',{
            action:'*homylist',
            s_desc:'Set MyList as main page when AnimeTV started'
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>dvr</c> MyList Main Page'
        );

        // home.settings.tools._s_compactlist=$n(
        //   'div','',{
        //     action:'*compactlist',
        //     s_desc:"Use old compact anime list"
        //   },
        //   home.settings.performance.P,
        //   '<c class="check">clear</c><c>unfold_less</c> Compact List'
        // );
        
        home.settings.tools._s_showclock=$n(
          'div','',{
            action:'*showclock',
            s_desc:"Show clock in homescreen"
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>nest_clock_farsight_digital</c> Show Clock'
        );

        home.settings.tools._s_directpage=$n(
          'div','',{
            action:'*directpage',
            s_desc:"No need to press ok to switch page"
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>switch_access_2</c> Switch page on select'
        );

        home.settings.tools._s_directsidebar=$n(
          'div','',{
            action:'*directsidebar',
            s_desc:"No need to press ok key to show sidebar"
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>thumbnail_bar</c> Show sidebar directly'
        );

        

        if (home.profiles.isadmin()){
          home.settings.tools._s_exitmode=$n(
            'div','',{
              action:'*exitmode',
              s_desc:"Set back key to exit behavior"
            },
            home.settings.performance.P,
            '<c>door_open</c> Exit Mode<span class="value"></span>'
          );
        }

        


        /* Others */
        home.settings.tools._s_alisthomess=$n(
          'div','',{
            action:'*alisthomess',
            s_desc:"Use AniList trending now anime list on home slideshow"
          },
          home.settings.more.P,
          '<c class="check">clear</c><c>playlist_add_check_circle</c> AniList Slideshow'
        );

        if (bannerCacher.enable){
          home.settings.tools._s_alisthqbanner=$n(
            'div','',{
              action:'*alisthqbanner',
              s_desc:"Get higher quality AniList banner image for slideshow and more info"
            },
            home.settings.more.P,
            '<c class="check">clear</c><c>high_res</c> HiRes AniList Banner'
          );
        }

        home.settings.tools._s_trailer=$n(
          'div','',{
            action:'*trailer',
            s_desc:"Play trailer on AniList slideshow"
          },
          home.settings.more.P,
          '<c>movie</c> Play Trailer<span class="value"></span>'
        );

        home.settings.tools._s_nonjapan=$n(
          'div','',{
            action:'*nonjapan',
            s_desc:"Also show and search chinese anime"
          },
          home.settings.more.P,
          '<c class="check">clear</c><c>emoji_nature</c> Chinese Anime'
        );
        home.settings.tools._s_jptitle=$n(
          'div','',{
            action:'*jptitle',
            s_desc:"Show anime titles in japanese name"
          },
          home.settings.more.P,
          '<c class="check">clear</c><c>language_japanese_kana</c> Japanese Titles'
        );

        /* Networks */
        if (_ISELECTRON){
          home.settings.tools._s_httpclient=$n(
            'div','',{
              action:'*httpclient',
              s_desc:"Select secure domain provider"
            },
            home.settings.networks.P,
            '<c>encrypted</c> DoH Provider<span class="value"></span>'
          );
        }
        else{
          home.settings.tools._s_httpclient=$n(
            'div','',{
              action:'*httpclient',
              s_desc:"Select HTTP Client that works for your connection"
            },
            home.settings.networks.P,
            '<c>public</c> HTTP Client<span class="value"></span>'
          );

          home.settings.tools._s_usedoh=$n(
            'div','',{
              action:'*usedoh',
              s_desc:"Use dns over https for securely resolving domain name. Enable if your ISP blocked source domain (Only works with OkHttp)"
            },
            home.settings.networks.P,
            '<c class="check">clear</c><c>encrypted</c> Use DoH'
          );

          if (home.profiles.isadmin()){
            home.settings.tools._s_cachesz=$n(
              'div','',{
                action:'*cachesz',
                s_desc:"Set maximum disk cache size for HTTP Client. Only works for okHttp and Cronet"
              },
              home.settings.networks.P,
              '<c>disc_full</c> Cache Size<span class="value"></span>'
            );
          }

          home.settings.tools._s_progcache=$n(
            'div','',{
              action:'*progcache',
              s_desc:"Cache content progressively for better performance. Turn off if image or playback not working"
            },
            home.settings.networks.P,
            '<c class="check">clear</c><c>fact_check</c> Progressive Cache'
          );
        }
        if (home.profiles.isadmin()){
          home.settings.tools._s_useimgcdn=$n(
            'div','',{
              action:'*useimgcdn',
              s_desc:"Use image CDN from wsrv.nl to improve cache and performance"
            },
            home.settings.networks.P,
            '<c class="check">clear</c><c>cleaning_bucket</c> Use Image CDN'
          );
        }
        home.settings.tools._s_hlsproxy=$n(
          'div','',{
            action:'*hlsproxy',
            s_desc:'Use hls streaming proxy if you have a problem with streaming'
          },
          home.settings.networks.P,
          '<c class="check">clear</c><c>bolt</c> HLS Stream Proxy'
        );

        

        /* Integrations */
        home.settings.tools._s_malaccount=$n(
          'div','',{
            action:'*malaccount',
            s_desc:
            _MAL.islogin()?"Disconnect MyAnimeList account":
            "Connect to MyAnimeList account"
          },
          home.settings.integration.P,
          _MAL.islogin()?
          '<c>lock_open</c> MAL Logout<span class="value">'+special(_MAL.auth.user)+'</span>':
          '<c>list_alt</c> MAL Login'
        );

        home.settings.tools._s_anilistaccount=$n(
          'div','',{
            action:'*anilistaccount',
            s_desc:
            _MAL.islogin(1)?"Disconnect AniList account":
            "Connect to AniList account"
          },
          home.settings.integration.P,
          _MAL.islogin(1)?
          '<c>lock_open</c> AniList Logout<span class="value">'+special(_MAL.alauth.user)+'</span>':
          '<c>hub</c> AniList Login'
        );

        home.settings.tools._s_listprog=$n(
          'div','',{
            action:'*listprog',
            s_desc:"Set on what state it should update MAL/AniList watch progress"
          },
          home.settings.integration.P,
          '<c>cloud_sync</c> Update watch progress<span class="value"></span>'
        );
        home.settings.tools._s_maltrackdialog=$n(
          'div','',{
            action:'*maltrackdialog',
            s_desc:"Action to do when playing untracked anime"
          },
          home.settings.integration.P,
          '<c>data_exploration</c> Auto Tracking<span class="value"></span>'
        );
        

        /* About */
        home.settings.tools._s_donation=$n(
          'div','',{
            action:'*donate'
          },
          home.settings.about.P,
          "<c>volunteer_activism</c> Donation"
        );
        home.settings.tools._s_ytchannel=$n(
          'div','',{
            action:'*ytchannel'
          },
          home.settings.about.P,
          "<c>youtube_activity</c> Youtube Channel"
        );
        home.settings.tools._s_discord=$n(
          'div','',{
            action:'*discord'
          },
          home.settings.about.P,
          "<c>sports_esports</c> Discord Server"
        );

        // home.settings.tools._s_exportcsv=$n(
        //   'div','',{
        //     action:'*exportcsv'
        //   },
        //   home.settings.about.P,
        //   "<c>export_notes</c> Export CSV List"
        // );

        if (/*!_ISELECTRON &&*/ home.profiles.isadmin()){
          home.settings.tools._s_checknightly=$n(
            'div','',{
              action:'*checknightly'
            },
            home.settings.about.P,
            "<c>partly_cloudy_night</c> Check for Nightly Build"
          );


          home.settings.tools._s_checkupdate=$n(
            'div','',{
              action:'*checkupdate'
            },
            home.settings.about.P,
            "<c>update</c> Check for Update"
          );
        }
      }
      home.settings.initmore_done=true;
      pb.cfg_update_el();
    },
    lang_action:function(){
      var selid=_API.tlangs_id(pb.cfg_data.lang,1);
      listOrder.showList(
        "Subtitle Language",
        _API.lang_titles,
        selid,
        function(chval){
          if (chval!=null){
            var prevstype=_API.currentStreamType;

            var sel=toInt(chval);
            var nlg=_API.tlangs[sel][1];
            console.log("Change Language = "+nlg);
            pb.cfg_data.lang=nlg;
            pb.cfg_save();
            pb.cfg_update_el('lang');

            var nst=_API.streamTypeById(nlg);
            if (nst!=prevstype){
              _API.setStreamTypeValue(-1,home.settings.isplayback?1:0);
              if (home.settings.isplayback){
                pb.startpos_val=pb.vid_stat.pos;
                pb.init_video();
              }
            }
            if (nst==1 && prevstype==1){
              /* Reinit subtitle */
              try{
                vtt.init(pb.subtitles);
              }catch(e){}
            }
          }
        }
      );
    },
    open:function(arg){
      home.settings.isplayback=arg;
      home.settings.needreload=false;
      home.settings.sel=0;
      home.settings.subsel=0;
      home.settings.menus=[
        home.settings.slang,
        home.settings.video,
        home.settings.styling,
        home.settings.performance,
        home.settings.more,
        home.settings.networks,
        home.settings.integration,home.settings.about
      ];
      for (var i=0;i<home.settings.menus.length;i++){
        home.settings.menus[i].classList.remove('active');
      }
      home.onsettings=true;
      home.settings.initmore();
      home.settings.update(0,0);
      pb.pb.classList.add('onsettings');
      home.settings.settings.classList.add('active');
      var settings_back=$('settings_title_back');
      home.settings.settings.onclick=function(e){
        var el=e.target;
        if (el==this || el==settings_back){
          window._KEYEV(KBACK,1);
          return;
        }
        while(el){
          if (el.parentElement==home.settings.settings){
            el=null;
            break;
          }
          if (el.getAttribute("action")){
            break;
          }
          el=el.parentElement;
        }
        if (el){
          try{
            if (el.classList.contains('disabled')){
              return;
            }
            clk();
            var action=el.getAttribute('action');
            var arg=el.getAttribute('arg');
            pb.action_handler(action,arg);
          }catch(e){}
        }
      };
    },
    close:function(){
      if (home.settings.needreload){
        home.settings.needreload=false;
        if (!home.settings.isplayback){
          _API.reload();
        }
      }
      home.onsettings=false;
      pb.pb.classList.remove('onsettings');
      home.settings.settings.classList.remove('active');
    },
    update:function(pc,spc){
      home.settings.menus[home.settings.sel].classList.remove('active');
      home.settings.sel=pc;
      home.settings.menus[home.settings.sel].classList.add('active');

      var fel=null;
      var gel=home.settings.menus[pc].P;
      if (spc==-1){
        spc=gel.childElementCount-1;
      }
      home.settings.subsel=spc;
      fel=gel;
      for (var i=0;i<gel.childElementCount;i++){
        var xch=gel.children[i];
        if (i==spc){
          xch.classList.add('active');
          fel=xch;
        }
        else{
          xch.classList.remove('active');
        }
      }
      var ot=0;
      var oh=fel.offsetHeight* 1.25;
      while(fel && fel!=home.settings.sscroll){
        ot+=fel.offsetTop;
        fel=fel.offsetParent;
      }
      if (pc==0 && spc==0){
        ot=0;
      }
      var ob=ot+oh;
      var st=home.settings.sscroll.scrollTop;
      var sh=home.settings.sscroll.offsetHeight;
      var sb=st+sh;
      var hdrHeight=Math.floor(window.outerWidth*0.05);
      if (ot>hdrHeight){
        ot-=hdrHeight;
      }
      if (ot<st){ 
        home.settings.sscroll.scrollTop=ot;
      }
      else if (ob>sb){
        home.settings.sscroll.scrollTop=ob-sh;
      }
    },
    open_donation:function(ispaypal){
      if (ispaypal){
        home.settings.open_qrcode(
          "Donate Project<br>https://paypal.me/amarullz",
          "https://paypal.me/amarullz"
        );
      }
      else{
        home.settings.open_qrcode(
          "Join Discord Server<br>https://discord.gg/syYkTDZ9",
          "https://discord.gg/syYkTDZ9"
        );
      }
    },
    open_qrcode:function(title, uri, shouldback){
      if (home.onsettings){
        home.ondonate=shouldback?2:true;
        $('popupcontainer').className='active';
        $('aboutpopup').className='active'; 
        if (uri){
          var qrurl='https://api.qrserver.com/v1/create-qr-code/?size=256x256&data='+encodeURIComponent(uri);
          $('popup_qrcode').innerHTML='<div id="qr_holder_value"><img src="'+qrurl+'"></div>'+title;
          // var h='<div id="qr_holder_value"></div>'+title;
          // $('popup_qrcode').innerHTML=h;
          // new QRCode("qr_holder_value", {
          //   text: uri,
          //   width: 256,
          //   height: 256,
          //   colorDark : "#000000",
          //   colorLight : "#ffffff",
          //   correctLevel : QRCode.CorrectLevel.H
          // });
          if (shouldback && _ISELECTRON){
            _JSAPI.openIntentUri(uri);
          }
          else{
            $('popup_qrcode').onclick=function(){
              clk();
              _JSAPI.openIntentUri(uri);
              if (home.ondonate==2){
                return false;
              }
              else{
                home.settings.close_qrcode();
                return true;
              }
            };
          }
        }
        else{
          $('popup_qrcode').innerHTML=title;
        }
        $('popup_qrcode').style.display='';
      }
    },
    close_qrcode:function(){
      $('aboutpopup').className='';
      $('popupcontainer').className='';
      home.ondonate=false;
    }
  },
  settings_keycb:function(c){
    if (home.ondonate){
      if (c==KBACK || (c==KENTER && home.ondonate!=2)){
        clk();
        home.settings.close_qrcode();
      }
      return;
    }

    var pc=home.settings.sel;
    var spc=home.settings.subsel;
    if (c==KBACK){
      clk();
      home.settings.close();
    }
    else if (c==KENTER){
      var gel=home.settings.menus[pc].P;
      var el=gel.children[spc];
      try{
        if (el.classList.contains('disabled')){
          return;
        }
        clk();
        var action=el.getAttribute('action');
        var arg=el.getAttribute('arg');
        pb.action_handler(action,arg);
      }catch(e){}
      home.settings.update(pc,spc);
      return;
    }
    else if (c==KUP){
      var doNext=true;
      doNext=(--spc<0)?true:false;
      if (doNext){
        if (--pc<0){
          pc=home.settings.menus.length-1;
        }
        spc=-1;
      }
    }
    else if (c==KDOWN){
      var doNext=true;
      doNext=(++spc>=home.settings.menus[pc].P.childElementCount)?true:false;
      if (doNext){
        if (++pc>=home.settings.menus.length){
          pc=0;
        }
        spc=0;
      }
    }
    else if (c==KLEFT||c==KPGUP){
      if (--pc<0){
        pc=home.settings.menus.length-1;
      }
      spc=-1;
      home.settings.update(pc,spc);
      spc=0;
    }
    else if (c==KRIGHT||c==KPGDOWN){
      if (++pc>=home.settings.menus.length){
        pc=0;
      }
      spc=-1;
      home.settings.update(pc,spc);
      spc=0;
    }
    if (home.settings.sel!=pc || home.settings.subsel!=spc){
      clk();
      home.settings.update(pc,spc);
    }
  },
  onsettings:false,
  ondonate:false,

  search:{
    search:$('search'),
    kw:$('search_kw'),
    genres:$('search_genre'),
    res:$('search_result'),
    // update:function(pc){
    //   home.search.menus[home.search.sel].classList.remove('active');
    //   home.search.sel=pc;
    //   home.search.menus[home.search.sel].classList.add('active');
    //   if (pc==0){
    //     home.search.kw.focus();
    //     _API.showIme(true);
    //   }
    //   else{
    //     home.search.kw.blur();
    //     _API.showIme(false);
    //   }
    // },
    close:function(){
      home.onsearch=false;
      home.search.search.classList.remove('active');
      _API.showIme(false);
      _API.setUri("/home");
    },
    parse:function(v){
      var rd=[];
      if (__SD3){
        rd=home.hi_parse(v);
      }
      else if (__SD5){
        rd=home.flix_parse(v);
      }
      else if (__SD6){
        console.log(["KAAS SEARCH",v]);
        rd=kaas.recentParse(v);
        console.log(["KAAS SEARCH RES",rd]);
      }
      else if (__SD==1){
        var h=$n('div','','',null,v);
        // window._kaisrc=h;
        // animekai
        var it=h.querySelectorAll('main section div.aitem');
        for (var i=0;i<it.length;i++){
          var t=it[i];
          try{
            var d={};
            d.tip=d.url=t.querySelector('[data-tip]').getAttribute('data-tip');
            var at=t.querySelector('a.title');
            d.title=at.textContent.trim();
            try{
              d.title_jp=at.getAttribute('data-jp');
            }catch(ee){}
            d.poster=t.querySelector('img[data-src]').getAttribute('data-src');
            try{
              d.type=t.querySelector('div.info span:last-child').textContent.trim();
            }catch(e){}
            try{
              d.epdub=t.querySelector('div.info span.dub').textContent.trim();
            }catch(ee){}
            try{
              d.epsub=d.ep=t.querySelector('div.info span.sub').textContent.trim();
            }catch(ee){}
            try{
              d.eptotal=t.querySelector('div.info span:not(:last-child):not(.sub):not(.dub)').textContent.trim();
            }catch(ee){}
            rd.push(d);
          }catch(e){}
        }
        h.innerHTML='';
      }
      else{
        var h=$n('div','','',null,v);
        // anix
        var it=h.querySelectorAll('section.s-content div.content-item div.piece div.inner');
        for (var i=0;i<it.length;i++){
          var t=it[i];
          try{
            var d={};
            var at=t.querySelector('a.poster');
            d.url=at.href;
            d.tip=at.getAttribute('data-tip');
            d.poster=t.querySelector('a.poster img').src;
            at=t.querySelector('div.ani-name a');
            d.title=at.textContent.trim();
            try{
              d.title_jp=at.getAttribute('data-jp');
            }catch(ex){}
  
            d.type=t.querySelector('div.abs-info span.type').textContent.trim();
            try{
              d.epdub=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
            }catch(e2){}
            try{
              d.epsub=d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
            }catch(e){
              d.ep=d.epdub;
            }
            try{
              d.eptotal=t.querySelector('div.sub-dub-total span.total').textContent.trim();
            }catch(e2){}

            d.epavail=toInt(d.ep?d.ep:d.eptotal);
            try{
              d.adult=false;
              var anir=t.querySelector('div.abs-info div.ani-rating');
              if (anir){
                if (anir.textContent.trim()=='18+'){
                  d.adult=true;
                }
              }
            }catch(e3){}
  
            d.duration=t.querySelector('div.abs-info span.time').textContent.trim();
            rd.push(d);
          }catch(e){
            // console.log(e);
          }
        }
        h.innerHTML='';
      }
      return rd;
    },
    dosearch_parse:function(v){
      var rd=home.search.parse(v);
      var g=home.search.res;
      g._havenext=false;
      if (rd&&rd.length){
        g._havenext=(rd.length>=28);
        for (var i=0;i<rd.length;i++){
          var d=rd[i];
          if (!ratingSystem.checkAdult(d.adult,d.title,d.title_jp)){
            continue;
          }
          var argv={
            url:d.url,
            img:d.poster,
            ttip:d.tip,
            sp:0,
            tp:0,
            ep:0,
            title:d.title
          };
          var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:"ep"},g.P,'');
          // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
          hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
          var infotxt='';
          var binfotxt='';
          if (d.adult){
            binfotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
          }
          else if (d.rating){
            binfotxt+='<span class="info_ep">'+d.rating+'</span>';
          }
          if (d.duration){
            binfotxt+='<span class="info_duration">'+special((d.duration+"").toLowerCase())+'</span>';
          }
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.eptotal||d.epdub||d.epsub){
            var haveep=0;
            if (d.epsub){
              infotxt+='<span class="info_ep info_epsub"><c>closed_caption</c>'+special(d.epsub)+'</span>';
              haveep++;
            }
            if (d.epdub){
              infotxt+='<span class="info_ep info_epdub"><c>mic</c>'+special(d.epdub)+'</span>';
              haveep++;
            }
            if (!haveep && d.ep){
              infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
            }
            if (d.eptotal && (haveep<2)){
              infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(d.eptotal)+'</span>';
            }
          }
          else if (d.ep){
            infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
          }
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          if (binfotxt){
            hl._ep=$n('span','info info_bottom',null,hl,binfotxt);
          }
        }

        if (home.withspre){
          while (g.P.childElementCount>60){
            g._spre.push(g.P.firstElementChild.nextElementSibling);
            g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          }
          g.__update_pre();
        }
  
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);
        
        // Add to history
        if (home.search.history.add(home.search.src.keyword.value)){
          home.search.src.init_search_history();
        }
      }
      _API.showIme(false);
    },
    
    dosearch:function(getpage){
      home.search.src.kwclean();
      home.search.kw.value=home.search.kw.value.trim();

      if (home.search.kw.value!=''||home.search.genreval.length>0){
        if ((home.search.src.cfg.anilist&&!home.search.noanilist) || __SD7 || __SD8){
          home.search.res.setAttribute('list-title','AniList Search Result');
          var kw=home.search.kw.value;
          var gnr=[];
          var tpe=[];
          for (var i=0;i<home.search.genreval.length;i++){
            var vl=home.search.genreval[i];
            if (vl.charAt(0)=='_'){
              tpe.push(_MAL.anilist.genres[vl]);
            }
            else{
              gnr.push(_MAL.anilist.genres[vl]);
            }
          }
          var qgenre=(gnr.length>0)?(", genre_in:"+JSON.stringify(gnr)+""):'';
          var qformat=(tpe.length>0)?(", format_in:["+(tpe.join(','))+"]"):"";
          var qsearch=kw?", search: $search":"";
          var qvars=kw?", $search: String":"";
          var vars={
            page:getpage?getpage:1,
            perPage:12
          };
          if (kw){
            vars.search=kw;
          }
          if (!getpage||(getpage<=1)){
            var rc=home.search.res;
            rc._page=1;
            rc._havenext=false;
            pb.menu_clear(rc);
            rc._nojump=true;
            pb.menu_init(rc);
            rc._spre=[];
            rc._spost=[];
            rc._onload=0;
            rc._sel=null;
          }
          var query=
`query ($page: Int, $perPage: Int`+qvars+`) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      perPage
      hasNextPage
      currentPage
    }
    media(sort: SEARCH_MATCH, isAdult:false, type: ANIME`+qsearch+qformat+qgenre+`){
      id
      title{
        romaji
        english
      }
      coverImage{
        large
        medium
      }
      startDate {
        year
        month
        day
      }
      status
      duration
      format
      seasonYear
      season
      isAdult
      averageScore
      nextAiringEpisode {
        episode
        airingAt
        timeUntilAiring
      }
      episodes
    }
  }
}`;
          home.search.res.classList.add('searching');
          home.search.res._onload=1;
          _MAL.alreq(query,vars,function(v){
            try{
              if (_MAL.allist_list_parser(home.search.res,v,true)>0){
                if (home.search.history.add(home.search.src.keyword.value)){
                  home.search.src.init_search_history();
                }
              }
            }catch(e){
              console.warn(["dosearch_parse_anilist",e,v]);
            }
            home.search.res.classList.remove('searching');
            home.search.res._onload=0;
          },true);
          return true;
        }

        home.search.res.setAttribute('list-title','Search Result');
        var uri=_API.filterurl(
          home.search.kw.value,
          home.search.genreval,
          (home.search.kw.value=='')?2:0,
          getpage
        );
        if (!getpage||(getpage<=1)){
          var rc=home.search.res;
          rc._page=1;
          rc._havenext=false;
          pb.menu_clear(rc);
          rc._nojump=true;
          pb.menu_init(rc);
          rc._spre=[];
          rc._spost=[];
          rc._onload=0;
          rc._sel=null;
        }

        if (uri){
          home.search.res.classList.add('searching');
          home.search.res._onload=1;
          $a(uri,function(r){
            if (r.ok){
              home.search.dosearch_parse(r.responseText);
            }
            home.search.res.classList.remove('searching');
            home.search.res._onload=0;
          },_API.filterorigin());
        }
        return true;
      }
      return false;
    },
    initresult:function(rc){
      var rc=home.search.res;
      rc._page=1;
      rc._havenext=false;
      pb.menu_clear(rc);
      rc._nojump=true;
      // rc._keycb=pb.menu_keycb;
      pb.menu_init(rc);
      rc._spre=[];
      rc._spost=[];
      rc._onload=0;
      rc._sel=null;
      rc.__update_pre=function(){
        if (home.withspre){
          rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
        }
      };
      rc.__selectcb=function(g,c){
        if (!c) return;
        var k=c;
        var n=0;
        while(k){
          k=k.previousElementSibling;
          if (++n>7) break;
        }
        if (n<=6){
          if (g._spre.length>0 && home.withspre){
            g.P.insertBefore(g._spre.pop(), g.P.firstElementChild.nextElementSibling);
            g._spost.push(g.P.lastElementChild);
            g.P.removeChild(g.P.lastElementChild);
            g.__update_pre();
            pb.menu_select(g,g._sel);
          }
          return;
        }
        if (g._onload!=0) return;
        n=0;
        while(c){
          c=c.nextElementSibling;
          if (++n>4) return;
        }
        if (g._spost.length>0 && home.withspre){
          g.P.appendChild(g._spost.pop());
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          g.__update_pre();
          pb.menu_select(g,g._sel);
          return;
        }
        
        if (g._havenext){
          g._page++;
          home.search.dosearch(g._page);
        }
      };
      rc._edgecb=function(g){
        if (g._onload!=0) return;
        if (g._page>60) return;
        g._page++;
        g._noscroll=true;
        home.search.dosearch(g._page);
      };
    },
    kwcb:function(g,c){
      if (c==KENTER){
        _API.showIme(true);
        home.search.dosearch();
      }
    },
    genreval:[],
    genresel:function(g,s){
      var i=s._key;
      var t=s._title;
      var gpos=home.search.genreval.indexOf(i);
      if (gpos>-1){
        home.search.genreval.splice(gpos,1);
        s.innerHTML=special(t);
      }
      else{
        home.search.genreval.push(i);
        s.innerHTML='<c>check</c> '+special(t);
      }
      home.search.dosearch();
    },
    history:{
      data:null,
      save:function(){
        _JSAPI.storeSet(_API.user_prefix+'search_history',JSON.stringify(home.search.history.data));
      },
      clear:function(){
        home.search.history.data=[];
        home.search.history.save();
      },
      del:function(kw){
        var fnd=home.search.history.data.indexOf(kw);
        if (fnd>=-1){
          home.search.history.data.splice(fnd,1);
          home.search.history.save();
        }
      },
      add:function(v){
        if (!v){
          return false;
        }
        var s=home.search.history;
        v=v.toLowerCase().trim();
        var found=s.data.indexOf(v);
        if (found==-1){
          if (s.data.length>200){
            /* remove last element */
            s.data.pop();
          }
          s.data.unshift(v);
          s.save();
        }
        else if (found>0){
          s.data.splice(found,1);
          s.data.unshift(v);
          s.save();
        }
        return true;
      },
      cfgsave:function(){
        _JSAPI.storeSet(_API.user_prefix+'search_config',JSON.stringify(home.search.src.cfg));
      },
      cfgload:function(){
        var tcfg=_JSAPI.storeGet(_API.user_prefix+'search_config',"");
        var cfg={
          mute:false,
          anilist:false
        };
        if (tcfg){
          try{
            cfg=JSON.parse(tcfg);
          }catch(e){}
        }
        home.search.src.cfg=cfg;  
      },
      load:function(){
        if (home.search.history.data!==null){
          return;
        }
        // home.search.history.muteload();
        home.search.history.cfgload();
        home.search.history.data=[];
        var search_history=_JSAPI.storeGet(_API.user_prefix+'search_history',"");
        if (search_history){
          home.search.history.data=JSON.parse(search_history);
        }
      }
    },
    src:{
      cfg:{
        mute:false,
        anilist:false
      },
      keyword:$('search_kw'),
      keyboard:$('search_keyboard'),
      keypad:$('search_keypad'),
      history:$('search_history'),
      keyboard_keys:[
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L","'"],
        ["Z","X","C","V","B","N","M",",",".","backspace"],
        ["clear","space","search"]
      ],
      keypad_keys:[
        ["7","8","9"],
        ["4","5","6"],
        ["1","2","3"],
        ["0","?","mute"]
      ],
      special_keys:{
        "backspace":["backspace",'',1],
        "clear":["cancel",'double clear_search',2],
        "space":["space_bar",'spacebar',6],
        "search":["search",'double do_search',2],
        "mute":["volume_off",'clear_search',1],
      },
      order_sel:0,
      order:[
        $('search_header'),
        $('search_tools'),
        $('search_genre'),
        $('search_result')
      ],
      order_notouch:[
        $('search_header'),
        $('search_tools'),
        $('search_genre'),
        $('search_result')
      ],
      order_touch:[
        $('search_header'),
        $('search_genre'),
        $('search_result')
      ],
      kwclean:function(ret){
        var s=home.search.src.keyword;
        if (s.value.charAt(s.value.length-1)=='_'){
          if (ret){
            return s.value.substring(0,s.value.length-1);
          }
          s._noinput=true;
          s.value=s.value.substring(0,s.value.length-1);
          s._noinput=false;
        }
        if (ret){
          return s.value;
        }
      },
      container_keycb:function(p,g,c){
        if (g._sel){
          if (g._sel._keycb){
            if (g._sel._keycb(g,g._sel,c)){
              return true;
            }
          }
        }
        var pkey=KLEFT;
        var nkey=KRIGHT;
        var ukey=KLEFT;
        var dkey=KRIGHT;
        if (g._isrow){
          pkey=KUP;
          nkey=KDOWN;
          ukey=KLEFT;
          dkey=KRIGHT;
        }
        if (c==pkey||c==nkey){
          if (g._sel){
            var next=null;
            if (c==pkey){
              next=g._sel.previousElementSibling;
            }
            else{
              next=g._sel.nextElementSibling;
            }
            if (next){
              clk();
              g._sel.classList.remove('active');
              next.classList.add('active');
              g._sel=next;
              return true;
            }
          }
        }
        else if (c==ukey||c==dkey){
          if (p._sel){
            var next=null;
            if (c==ukey){
              next=p._sel.previousElementSibling;
              if (g._isloop && !next){
                next=p._sel.parentElement.lastElementChild;
              }
            }
            else{
              next=p._sel.nextElementSibling;
              if (g._isloop && !next){
                next=p._sel.parentElement.firstElementChild;
              }
            }
            if (next){
              clk();
              p._sel.classList.remove('active');
              next.classList.add('active');
              p._sel=next;
              return true;
            }
          }
        }
        return false;
      },
      pad_callback:function(p,g,c){
        var s=home.search.src;
        var pr=g._rsel;
        var pc=g._csel;
        var ps=g._csize;
        var rf=false;
        var nextEl=null;
        if (c==KLEFT){
          if (g._rows[pr]._cols_length==ps){
            if (--pc<0) pc=0;
          }
          else{
            nextEl=g._rows[pr]._sel.previousElementSibling;
          }
        }
        else if (c==KRIGHT){
          if (g._rows[pr]._cols_length==ps){
            if (++pc>=g._csize) pc=g._csize-1;
          }
          else{
            nextEl=g._rows[pr]._sel.nextElementSibling;
          }
        }
        else if (c==KUP){
          if (--pr<0) pr=0;
        }
        else if (c==KDOWN){
          if (++pr>=g._rows_length) pr=g._rows_length-1;
        }
        else if (c==KENTER){
          if (g._rows[pr]){
            if (g._rows[pr]._sel){
              clk();
              var sel=g._rows[pr]._sel;
              var k=sel.getAttribute('key');
              if (k=='mute'){
                s.cfg.muted=!s.cfg.muted;
                if (s.cfg.muted){
                  sel.firstElementChild.innerHTML='volume_off';
                }
                else{
                  sel.firstElementChild.innerHTML='brand_awareness';
                }
                home.search.history.cfgsave();
                return true;
              }

              
              s.kwclean();
              s._noinput=true;
              if (k=='space'){
                s.keyword.value+=' ';
              }
              else if (k=='backspace'){
                if (s.keyword.value.length>0){
                  s.keyword.value=s.keyword.value.substring(0,s.keyword.value.length-1);
                  s.update_history();
                }
              }
              else if (k=='search'){
                home.search.dosearch();
                s.select_result();
                return true;
              }
              else if (k=='clear'){
                if (s.keyword.value!=''){
                  s.keyword.value='';
                  s.update_history();
                }
              }
              else{
                s.keyword.value+=k.toLowerCase();
                s.update_history();
              }
              s.keyword.value+='_';
              s._noinput=false;
              return true;
            }
          }
          return false;
        }
        else{
          return false;
        }
        if (pr!=g._rsel){
          g._rows[g._rsel].classList.remove('active');
          if (g._rows[g._rsel]._cols_length==ps){
            g._rows[g._rsel]._cols[pc].classList.remove('active');
          }
          g._rows[pr].classList.add('active');
          g._rsel=pr;
          if (g._rows[pr]._cols_length!=ps){
            g._rows[pr]._sel.classList.remove('active');
            if (pc<2){
              g._rows[pr]._sel=g._rows[pr]._cols[0];
            }
            else if (pc>7){
              g._rows[pr]._sel=g._rows[pr]._cols[2];
            }
            else{
              g._rows[pr]._sel=g._rows[pr]._cols[1];
            }
            g._rows[pr]._sel.classList.add('active');
            if (!s.cfg.muted){
              clk();
            }
            return true;
          }
          rf=true;
        }
        if (rf || pc!=g._csel){
          if (g._rows[pr]._cols_length==ps){
            if (!rf){
              g._rows[pr]._cols[g._csel].classList.remove('active');
            }
            g._csel=pc;
            g._rows[pr]._cols[pc].classList.add('active');
            g._rows[pr]._sel=g._rows[pr]._cols[pc];
          }
          if (!s.cfg.muted){
            clk();
          }
          return true;
        }
        if (nextEl){
          g._rows[pr]._sel.classList.remove('active');
          nextEl.classList.add('active');
          g._rows[pr]._sel=nextEl;
          if (nextEl==g._rows[pr]._cols[0]){
            g._csel=0;
          }
          else if (nextEl==g._rows[pr]._cols[2]){
            g._csel=9;
          }
          else{
            g._csel=4;
          }
          if (!s.cfg.muted){
            clk();
          }
          return true;
        }

        if (c==KLEFT||c==KRIGHT){
          var next=null;
          if (c==KLEFT){
            next=g.previousElementSibling;
            if (!next){
              next=g.parentElement.lastElementChild;
            }
          }
          else{
            next=g.nextElementSibling;
            if (!next){
              next=g.parentElement.firstElementChild;
            }
          }
          if (next){
            p._sel.classList.remove('active');
            next.classList.add('active');
            p._sel=next;
            if (!s.cfg.muted){
              clk();
            }
            return true;
          }
        }
        return false;
      },
      initkeys:function(g, k, sel_row){
        var s=home.search.src;
        g.innerHTML='';
        g._rsel=sel_row;
        g._csel=0;
        g._csize=0;
        g._rows=[];
        g._keycb=s.pad_callback;
        for (var r=0;r<k.length;r++){
          var rd=k[r];
          var row=$n('div','',null,g,'');
          if (r==sel_row){
            row.classList.add('active');
          }
          row._isrow=true;
          g._rows.push(row);
          row._cols=[];
          if (g._csize<rd.length){
            g._csize=rd.length;
          }
          for (var c=0;c<rd.length;c++){
            var kd=rd[c];
            var txt='';
            var cn='';
            var sz=1;
            if (kd in s.special_keys){
              if (kd=='mute'){
                s.special_keys[kd][0]=s.cfg.muted?'volume_off':'brand_awareness';
              }
              txt='<c>'+(s.special_keys[kd][0])+'</c>';
              cn=s.special_keys[kd][1];
              sz=s.special_keys[kd][2];
            }
            else{
              txt=kd;
            }
            var pad=$n('div',cn,{"key":kd},row,txt);
            pad._sz=sz;
            if (c==g._csel && r==sel_row){
              pad.classList.add('active');
              row._sel=pad;
            }
            if (kd=='space'){
              if (row._sel){
                row._sel.classList.remove('active');
              }
              pad.classList.add('active');
              row._sel=pad;
            }
            row._cols.push(pad);
          }
          row._cols_length=row._cols.length;
        }
        g._rows_length=g._rows.length;
      },
      history_item_keycb:function(p,g,c){
        var s=home.search.src;
        if (c==KENTER){
          var kw=g.getAttribute("val");
          if (kw){
            if (g._isclear){
              clk();
              _API.confirm("Clear Search History",
                "Are you sure you want to <b>clear all</b> search history?",function(cnf){
                if (cnf){
                  home.search.history.clear();
                  home.search.src.init_search_history();
                }
              });
              return true;
            }
            else{
              clk();
              if (g._isdel){
                _API.confirm("Delete History",
                  "Delete <b>"+kw+"</b> from search history?",function(cnf){
                  if (cnf){
                    home.search.history.del(kw);
                    home.search.src.init_search_history();
                  }
                });
              }
              else{
                s.keyword.value=kw;
                home.search.dosearch();
                s.select_result();
              }
              return true;
            }
          }
        }
        else if (c==KLEFT){
          if (!g._isclear){
            if (!g._isdel){
              g._isdel=true;
              g._ico.classList.add('clear');
              g._ico.innerHTML='clear';
              clk();
              return true;
            }
          }
        }
        if (c==KLEFT || c==KRIGHT || c==KUP || c==KDOWN){
          if (!g._isclear){
            if (g._isdel){
              g._isdel=false;
              g._ico.classList.remove('clear');
              g._ico.innerHTML='history';
            }
          }
        }
        return false;
      },
      update_history_to:null,
      update_history:function(){
        if (home.search.src.update_history_to){
          clearTimeout(home.search.src.update_history_to);
          home.search.src.update_history_to=null;
        }
        home.search.src.update_history_to=setTimeout(function(){
          if (home.onsearch){
            home.search.src.init_search_history();
          }
          clearTimeout(home.search.src.update_history_to);
          home.search.src.update_history_to=null;
        },200);
      },
      item_history_click:function(ev){
        if (ev.target==this._ico && !this._isclear){
          this._isdel=true;
        }
        else{
          this._isdel=false;
        }
        this._keycb(null,this,KENTER);
      },
      item_history_contextmenu:function(ev){
        this._isdel=true;
        this._keycb(null,this,KENTER);
      },
      init_search_history:function(){
        var s=home.search.src;
        var hist=home.search.history.data;
        s.history._keycb=s.container_keycb;
        s.history._isloop=true;
        s.history._isrow=true;
        s.history.innerHTML='';
        function addh(id,t,ic){
          var h=$n('div','',{"val":id},s.history,'');
          var u=$n('span','',null,h,'');
          h._ico=$n('c','',null,u,ic);
          $n('b','',null,u,special(t));
          h._ico._ori_ic=ic;
          h._ico.onmouseover=function(){
            this.innerHTML='clear';
          };
          h._ico.onmouseout=function(){
            this.innerHTML=this._ori_ic;
          };
          h.onclick=home.search.src.item_history_click;
          h.oncontextmenu=home.search.src.item_history_contextmenu;
          return h;
        }
        var fkw=slugString(s.kwclean(1));
        var n=0;
        var found=[];
        if (fkw){
          if (_TOUCH){
            var rsts=addh("---","Reset",'clear');
            rsts._isclear=true;
            rsts.classList.add('clear_history');
            rsts._keycb=function(x,y,z){
              clk();
              home.search.src.keyword.value='';
              home.search.src.update_history();
              home.search.src.keyword.focus();
            };
          }
          for (var i=0;i<hist.length;i++){
            var io=slugString(hist[i]).indexOf(fkw);
            if (io>=0){
              found.push([hist[i],io]);
            }
          }
          found.sort(function(a, b) {
            return a[1] - b[1];
          });
        }
        else{
          found=hist;
        }
        var max_show=fkw?5:4;
        for (var i=0;(i<found.length) && (n<max_show);i++){
          var kv=fkw?found[i][0]:found[i];
          var h=addh(kv,kv,'history');
          if (n==0){
            s.history._sel=h;
            h.classList.add('active');
          }
          h._keycb=s.history_item_keycb;
          n++;
        }
        if (!fkw && hist.length>0){
          var clr=addh("---","Clear search history",'delete_forever');
          clr._isclear=true;
          clr.classList.add('clear_history');
          clr._keycb=s.history_item_keycb;
        }
      },
      select_result:function(){
        var s=home.search.src;
        s.order[s.order_sel].classList.remove('active');
        s.order[_TOUCH?2:3].classList.add('active');
        s.order_sel=_TOUCH?2:3;
      },
      header_items:[],
      header_cb:function(g,c){
        var s=home.search.src;
        var pc=g._sel;
        if (c==KLEFT||c==KRIGHT){
          if (c==KLEFT){
            if (--pc<0) pc=s.header_items.length-1;
          }
          else if (c==KRIGHT){
            if (++pc>=s.header_items.length) pc=0;
          }
          if (g._sel!=pc){
            clk();
            s.header_items[g._sel].classList.remove('active');
            s.header_items[pc].classList.add('active');
            g._sel=pc;
            if (g._sel!=$('search_kbd')){
              s.clean_kbfocus();
            }
            return true;
          }
        }
        else if (c==KENTER){
          var el=s.header_items[pc];
          if (el==$('search_voice')){
            home.search.voiceSearch(0);
            return true;
          }
          else if (el==$('search_kbd')){
            if (!s._kw_focused){
              home.search.kw.focus();
              _API.showIme(true);
              s._kw_focused=true;
              clk();
            }
            else{
              clk();
              if (home.search.dosearch()){
                s.clean_kbfocus();
                s.select_result();
              }
            }
            return true;
          }
          else if (el==$('search_anilist')){
            home.search.src.cfg.anilist=!home.search.src.cfg.anilist;
            home.search.noanilist=false;
            home.search.history.cfgsave();
            clk();
            home.search.init_search();
            return true;
          }
        }
        return false;
      },
      clean_kbfocus:function(){
        if (home.search.src._kw_focused){
          home.search.src._kw_focused=false;
          home.search.kw.blur();
          _API.showIme(false);
        }
      }
    },
    kwinput:function(){
      var s=home.search.src.keyword;
      var uu=s.value;
      uu=uu.toLowerCase();
      if (uu!=s.value){
        s.value=uu;
      }
      if (!s._noinput && !_TOUCH){
        s.value=s.value.toLowerCase()
        .replace(/[^\w]+/g, " ")
        .replace(/  /g, "  ")
        .replace(/  /g, " ")
        .replace(/  /g, " ")
        .replace(/  /g, " ");
        home.search.src.update_history();
      }
      else{
        home.search.src.update_history();
      }
    },
    kwfocus:function(){
      if (_TOUCH){
        home.search.headerselect($('search_kbd'));
        if (!home.search.src._kw_focused){
          _API.showIme(true);
          home.search.src._kw_focused=true;
        }
      }
    },
    headerselect:function(el){
      var s=home.search.src;
      var g=$('search_header');
      if (s.order_sel!=0){
        s.order[s.order_sel].classList.remove('active');
        s.order[0].classList.add('active');
        s.order_sel=0;
      }
      var pc=s.header_items.indexOf(el);
      if (pc>-1){
        if (g._sel!=pc){
          s.header_items[g._sel].classList.remove('active');
          s.header_items[pc].classList.add('active');
          g._sel=pc;
        }
      }
    },
    headerclick:function(){
      home.search.headerselect(this);
      if ($('search_logo')==this){
        clk();
        home.search.close();
        return true;
      }
      home.search.src.header_cb($('search_header'),KENTER);
      return true;
    },
    init_search:function(){
      home.search.kw.oninput=home.search.kwinput;
      home.search.kw.onfocus=home.search.kwfocus;

      var s=home.search.src;
      var isAnilist = s.cfg.anilist || __SD7 || __SD8;
      var anilist_el = $('search_anilist');
      if (!isAnilist||home.search.noanilist){
        anilist_el.firstElementChild.innerHTML='close';
      }
      else{
        anilist_el.firstElementChild.innerHTML='check';
      }

      if (!s.history.__wheelinit){
        s.history.__wheelinit=true;
        s.history.addEventListener("wheel",function(ev){
          var g=s.history;
          if (ev.deltaY<0){
            $scroll(g,g.scrollLeft+ev.deltaY,1,-1);
          }
          else if (ev.deltaY>0){
            $scroll(g,g.scrollLeft+ev.deltaY,1,-1);
          }
          ev.preventDefault();
          ev.stopPropagation();
        });
      }

      pb.menu_clear(home.search.genres);
      home.search.genreval=[];
      pb.menu_init(home.search.genres);
      home.search.genres._enter_cb=home.search.genresel;
      home.search.genres._els={};
      var vsel=null;
      var genrelist=_API.genres;
      if (isAnilist){
        genrelist=_MAL.anilist.genres;
      }
      else if (__SD3){
        genrelist=_API.genres_hi;
      }
      else if (__SD6){
        genrelist=kaas.genres;
      }
      else if (__SD5){
        genrelist=_API.genres_flix;
      }
      for (var i in genrelist){
        var title=i.replace(/_/g," ").toUpperCase().trim();
        var gn=$n('div','',{
          action:'!'+i,'gid':genrelist[i]
        },
        home.search.genres.P,special(title));
        gn._title=title;
        gn._key=i;
        if (home.search.srcgenre){
          if (home.search.srcgenre.toLowerCase()==i.toLowerCase()){
            vsel=gn;
            gn.innerHTML='<c>check</c> '+special(title);
            home.search.genreval.push(i);
          }
        }
        home.search.genres._els[i]=gn;
      }
      if (vsel){
        pb.menu_select(home.search.genres,vsel);
      }
      else{
        pb.menu_select(home.search.genres,home.search.genres.P.firstElementChild);
      }
      return vsel;
    },
    srcgenre:'',
    noanilist:false,
    open:function(arg){
      var s=home.search.src;
      s.order=_TOUCH?s.order_touch:s.order_notouch;

      home.search.history.load();
      home.search.initresult(home.search.res);
      _API.setUri((__SD3||__SD5)?"/search":"/browser");
      home.onsearch=true;
      home.search.search.classList.add('active');
      home.search.kw._keycb=home.search.kwcb;
      home.search.kw.value='';
      home.search.srcgenre='';

      var havekw=false;
      home.search.noanilist=false;
      if (arg){
        if (arg.kw){
          home.search.kw.value=arg.kw;
          havekw=true;
        }
        else if (arg.genre){
          home.search.srcgenre=arg.genre;
          home.search.noanilist=__SD7||__SD8?false:true;
        }
      }

      /* Init genres & types */
      var vsel=home.search.init_search();

      /* Init tools */
      s.initkeys(s.keyboard,s.keyboard_keys, 1);
      s.initkeys(s.keypad,s.keypad_keys, 2);
      s.init_search_history();
      s.order[0]._keycb=s.header_cb;

      /* Init headers */
      s.header_items=[];
      if (_JSAPI.haveMic(true)){
        s.header_items.push($('search_voice'));
        $('search_voice').classList.remove('hide');
      }
      else{
        $('search_voice').classList.add('hide');
      }
      s.header_items.push($('search_kbd'));
      s.header_items.push($('search_anilist'));
      s.order[0]._sel=0;
      for (var i=0;i<s.header_items.length;i++){
        s.header_items[i].classList[i==0?'add':'remove']('active');
      }

      /* Init navigation order */
      for (var i=0;i<s.order.length;i++){
        s.order[i].classList.remove('active');
      }
      s.keyboard.classList.add('active');
      s.keypad.classList.remove('active');
      s.history.classList.remove('active');
      s.order[1]._sel=s.keyboard;
      s.order_sel=_TOUCH?0:1;

      for (var i=0;i<s.header_items.length;i++){
        s.header_items[i].onclick=home.search.headerclick;
      }
      $('search_logo').onclick=home.search.headerclick;

      /* Init arguments behavior */
      if (vsel){
        s.order_sel=_TOUCH?1:2;
      }
      else{
        if (havekw){
          s.order_sel=_TOUCH?2:3;
        }
      }

      s.order[s.order_sel].classList.add('active');

      if (s.order_sel==0 && _TOUCH){
        setTimeout(function(){
          home.search.kw.focus();
        },50);
      }
      else{
        setTimeout(function(){
          home.search.kw.blur();
        },50);
      }
      home.search.dosearch();
    },
    onvoicesearch:false,
    voiceSearchClose:function(){
      if (home.search.onvoicesearch){
        _JSAPI.voiceClose();
      }
    },
    voiceSearch:function(ishome){
      home.search.onvoicesearch=true;
      var hvoice=ishome?$('home_voice'):$('search_voice');
      // haveMic
      hvoice.setAttribute('vtext','...');
      hvoice.classList.add('onvoice');
      _API.voiceSearch(function(v){
        if (v && ('status' in v)){
          if ((v.status==4) && v.value){
            var pt=v.value;
            if (pt.length>24){
              pt=pt.substring(pt.length-24);
            }
            hvoice.setAttribute('vtext',pt);
            home.search.open({kw:v.value});
          }
          else if(v.status==3){
            var pt=v.value;
            if (pt.length>24){
              pt=pt.substring(pt.length-24);
            }
            hvoice.setAttribute('vtext',pt+'...');
          }
          else if(v.status==1){
            hvoice.setAttribute('vtext','.....');
          }
          else if(v.status==2){
            hvoice.setAttribute('vtext','Speak Now...');
          }
          else if(v.status==7){
            var vt=toFloat(v.value)-3.0;
            if (vt<0) vt=0;
            vt=vt/8.0;
            console.log("RMS: "+vt);
            hvoice.firstElementChild.style.backgroundColor='rgba(180,200,220,'+vt+')';
          }
          /* close */
          if ((v.status==4)||(v.status==6)){
            _API.voiceSearch(null);
            home.search.onvoicesearch=false;
            requestAnimationFrame(function(){
              hvoice.classList.remove('onvoice');
              hvoice.firstElementChild.style.backgroundColor='';
            });
          }
        }
      });
    }
  },
  onsearch:false,
  search_keycb:function(c){
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }

    var s=home.search.src;
    if (c==KBACK){
      clk();
      home.search.close();
      return true;
    }

    /* Keyboard keys auto type */
    if (((c>=65)&&(c<=90))||((c>=48)&&(c<=57))||(c==32)||(c==8)||(c==9)){
      try{
        if (!s._kw_focused || (document.activeElement!=home.search.kw)){
          s._noinput=true;
          clk();
          var ch=1;
          if (((c>=65)&&(c<=90))||((c>=48)&&(c<=57))){
            home.search.kw.value=s.kwclean(true)+String.fromCharCode(c).toLowerCase();
          }
          else if (c==32){
            home.search.kw.value=s.kwclean(true)+' ';
          }
          else if (c==8){
            var kv=s.kwclean(true);
            if (kv.length>0){
              home.search.kw.value=kv.substring(0,kv.length-1);
              s.update_history();
            }
          }
          else{
            ch=0;
          }
          if (ch){
            home.search.src.update_history();
            s.keyword.value+='_';

            if (!_TOUCH){
              if (s.order_sel==1){
                if (s.order[1]._sel==s.keyboard){
                  if ((s.keyboard._rsel!=3) || (s.keyboard._rows[3]._sel!=s.keyboard._rows[3]._cols[2])){
                    /* auto select search button */
                    if (s.keyboard._rsel!=3){
                      s.keyboard._rows[s.keyboard._rsel].classList.remove('active');
                      s.keyboard._rows[s.keyboard._rsel]._sel.classList.remove('active');
                      s.keyboard._rows[3].classList.add('active');
                      s.keyboard._rsel=3;
                    }
                    s.keyboard._rows[3]._sel.classList.remove('active');
                    s.keyboard._rows[3]._sel=s.keyboard._rows[3]._cols[2];
                    s.keyboard._rows[3]._sel.classList.add('active');
                  }
                }
              }
            }
          }
          s._noinput=false;
          return true;
        }
      }catch(e){}
    }

    if (!_TOUCH && s.order_sel==1){
      // tools
      if (s.order[1]._sel){
        if (s.order[1]._sel._keycb){
          if (s.order[1]._sel._keycb(s.order[1],s.order[1]._sel,c)){
            return true;
          }
        }
      }
    }
    else{
      // list, genres, headers
      if (s.order[s.order_sel]){
        if (s.order[s.order_sel]._keycb){
          if (s.order[s.order_sel]._keycb(s.order[s.order_sel],c)){
            return true;
          }
        }
      }
    }
    var cs=s.order_sel;
    if (c==KUP){
      if (--cs<0) cs=0;
    }
    else if (c==KDOWN){
      if (++cs>s.order.length-1) cs=s.order.length-1;
    }
    if (cs!=s.order_sel){
      s.clean_kbfocus();
      clk();
      s.order[s.order_sel].classList.remove('active');
      s.order[cs].classList.add('active');
      s.order_sel=cs;
      s.kwclean();
      return true;
    }

    return false;

    // var pc=home.search.sel;
    // if (c==KBACK){
    //   clk();
    //   home.search.close();
    // }
    // else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
    //   home.search.menus[pc]._keycb(home.search.menus[pc],c);
    // }
    // else if (c==KUP){
    //   if (--pc<0) pc=0;
    // }
    // else if (c==KDOWN){
    //   if (++pc>=home.search.menus.length) pc=home.search.menus.length-1;
    // }
    // if (home.search.sel!=pc){
    //   clk();
    //   home.search.update(pc);
    // }
  },

  homepages:[
    $('home_page'),
    $('home_pagelist'),
    $('home_pageschedule')
  ],

  update_homepages:function(n,force){
    if (!force && home.col_selected==n){
      return false;
    }
    for (var i=0;i<home.homepages.length;i++){
      if (n==i){
        home.header_items[i+1].classList.add('selected');
        home.homepages[i].classList.add('active');
      }
      else{
        home.header_items[i+1].classList.remove('selected');
        home.homepages[i].classList.remove('active');
      }
    }
    home.col_selected=n;
    if (n==2){
      home.schedule_init();
    }
    else if (n==1){
      home.init_mylist(false);
    }
    else if (n==0){
      home.init_homepage(false);
    }
    return true;
  },
  header_item_click:function(c){
    var me=this;
    var pc=home.header_items.indexOf(me);
    if (pc>-1){
      var hsel=home.header_items_selected;
      var psel=hsel;
      home.header_items[hsel].classList.remove('active');
      hsel=pc;
      home.header_items[hsel].classList.add('active');
      home.header_items_selected=hsel;
      if (hsel>=1 && hsel<=3){
        if (psel!=hsel){
          clk();
          home.update_homepages(hsel-1);
        }
        else{
          home.header_keycb(home.home_header,KENTER);  
        }
      }
      else if (hsel==5){
        clk();
        $('sidebar').classList.add('active');
        home.sidebar.onsidebar=true;
        home.sidebar.opentype=1;
      }
      else{
        home.header_keycb(home.home_header,KENTER);
      }
    }
    else if (me==$('home_logo')){
      clk();
      $('sidebar').classList.add('active');
      home.sidebar.onsidebar=true;
      home.sidebar.opentype=1;
    }
  },
  header_keycb:function(g,c){
    if (c==KLEFT||c==KRIGHT||c==-1){
      clk();
      var hsel=home.header_items_selected;
      home.header_items[hsel].classList.remove('active');
      if (c==KRIGHT) hsel++;
      else if (c==KLEFT) hsel--;
      else if (c==-1) hsel=0;
      if (hsel>=home.header_items.length){
        hsel=0;
      }
      else if (hsel<0){
        hsel=home.header_items.length-1;
      }
      home.header_items[hsel].classList.add('active');
      if (hsel>=1 && hsel<=3){
        if (pb.cfg_data.directpage){
          home.update_homepages(hsel-1);
        }
      }
      if (pb.cfg_data.directsidebar){
        home.sidebar.onsidebar=(hsel==5);
        home.sidebar.opentype=0;
      }
      home.header_items_selected=hsel;
    }
    else if (c==KENTER){
      clk();
      var sel=home.header_items_selected;
      if (sel==0){
        home.search.open({});
      }
      else if (sel==1){
        if (!pb.cfg_data.directpage && home.update_homepages(0)){
          return true;
        }
        listOrder.showMenu(
          undefined,
          [
            {icon:'refresh',title:"Refresh Home"},
            {icon:'tune',title:"Customize Home"},
            {icon:'cycle',title:"Reload AnimeTV"}
          ],
          0,
          function(chval){
            if (chval!==null){
              if (chval==0){
                home.init_homepage(true);
              }
              else if (chval==1){
                listOrder.show(
                  "Customize Home - Source "+__SD_NAME,
                  home.listOrder.home,
                  function(v){
                    if (v!=null){
                      var homeSaved = [];
                      for (var i=0;i<v.length;i++){
                        homeSaved.push([v[i].id,v[i].active]);
                      }
                      listOrder.store.save("home",homeSaved,false);
                      home.init_homepage(true);
                    }
                  }
                );
              }
              else if (chval==2){
                _API.reload();
              }
            }
          }
        );
      }
      else if (sel==2){
        if (!pb.cfg_data.directpage && home.update_homepages(1)){
          return true;
        }
        listOrder.showMenu(
          undefined,
          [
            {icon:'refresh',title:"Refresh MyList"},
            {icon:'tune',title:"Customize MyList"},
            {icon:'delete_forever',title:"Clear Watch History"}
          ],
          0,
          function(chval){
            if (chval!==null){
              if (chval==0){
                home.init_mylist(true);
              }
              else if (chval==1){
                listOrder.show(
                  "Customize MyList",
                  home.listOrder.mylist,
                  function(v){
                    if (v!=null){
                      var listSaved = [];
                      for (var i=0;i<v.length;i++){
                        listSaved.push([v[i].id,v[i].active]);
                      }
                      listOrder.store.save("mylist",listSaved,true);
                      home.init_mylist(true);
                    }
                  }
                );
              }
              else if (chval==2){
                _API.confirm("Clear Watch History",
                  "<h6><c>warning</c> WARNING!!!</h6>"+
                  "This action will clear your watch history, and <b>can't be restored</b>.<br>"+
                  "<b>You want to continue?</b>",
                  function(cnf1){
                    if (cnf1){
                      _API.confirm("Confirm Watch History",
                        "<h6><c>warning</c> WARNING!!!</h6>"+
                        "You Have <b>"+(list.history.list.length)+"</b> anime in your watch history.<br>"+
                        "<b>Clear it now?</b>",
                        function(cnf){
                          if (cnf){
                            list.history={detail:{},list:[]};
                            list.save(list.history,'list_history');
                            home.init_mylist(true);          
                          }
                      });
                    }
                });
              }
            }
          }
        );
      }
      else if (sel==3){
        if (!pb.cfg_data.directpage && home.update_homepages(2)){
          return true;
        }
        home.schedule_init(true);
      }
      else if (sel==4){
        home.settings.open(0);
      }
      else if (sel==5){
        if (!pb.cfg_data.directsidebar){
          $('sidebar').classList.add('active');
          home.sidebar.onsidebar=true;
          home.sidebar.opentype=1;
        }
      }
      else if (sel==6){
        home.search.voiceSearch(1);
      }
    }
  },

  schedule_init:function(force){
    var page=$('home_pageschedule');
    if ((!force && page._initialized)|| page._oninit){
      return;
    }
    page.innerHTML='<div class="home_list_loader"><span class="z-loader"></span></div>';
    page._initialized=true;
    page._oninit=true;
    home.menus[2]=[];
    var schedules={
      data:[],
      ids:[],
      days:[
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      days_el:[]
    };
    window.__schd=schedules;
    function loaded(){
      window._sch=schedules;
      console.log(schedules);
      var nowd=new Date();
      var now=(nowd.getDay());
      for (var i=0;i<schedules.days.length;i++){
        addstr=(i==now)?" (Today)":"";
        var newEl=$n('div','home_list pb_menu',{"list-title":schedules.days[i]+addstr}, null, '');
        schedules.days_el.push(newEl);
        pb.menu_clear(newEl);
        pb.menu_init(newEl);
      }
      page.innerHTML='';
      for (var i=0;i<schedules.days.length;i++){
        var dn=now+i;
        if (dn>6){
          dn-=7;
        }
        var el=schedules.days_el[dn];
        page.appendChild(el);
        home.menus[2].push(el);
      }
      var unairToday=null;
      for (var i=0;i<schedules.data.length;i++){
        var d=schedules.data[i];
        if (!ratingSystem.checkAdult(d.isAdult,d.title.english,d.title.romaji)){
          continue;
        }
        var malid="anilistmedia_"+d.id;
        var animeDay = d.airDate.getDay();

        var isToday=(nowd.getDate()==d.airDate.getDate());
        var isAired=(d.airIn<0);

        var hl=$n('div','',{action:"#"+malid,arg:''},schedules.days_el[animeDay].P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img($aimg(d.coverImage))},hl,'');
        hl._title=$n('b','',{jp:d.title.romaji?d.title.romaji:d.title.english},hl,tspecial(d.title.english?d.title.english:d.title.romaji));

        var airTime=d.airDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        hl._ep=$n('span','info_bottom info',null,
          hl,'<span class="info_airtime'+(isAired?' schedule_aired':'')+'"><c>'+(isAired?'done':'schedule')+'</c>'+airTime+'</span>'
        );

        var infotxt='';
        var mtp=d.format;
        if (mtp=='TV_SHORT'){
          mtp='TV';
        }
        if (d.isAdult){
          infotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
        }
        if (mtp&&(mtp!='unknown')){
          infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
        }
        var vep=d.airEp;
        var sumep=d.episodes;
        if (vep){
          infotxt+='<span class="info_ep"><c>movie</c>'+special(vep+"")+'</span>';
          d.ep=isAired?vep:(vep-1);
        }
        if (sumep){
          infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(sumep+"")+'</span>';
          if (!d.ep){
            d.ep=sumep;
          }
        }
        hl._ep=$n('span','info',null,hl,infotxt);
        if (isToday && !isAired && unairToday==null){
          unairToday=hl;
        }
        _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
      }
      for (var i=0;i<schedules.days_el.length;i++){
        if (i==now && unairToday!=null){
          pb.menu_select(schedules.days_el[i],unairToday);
        }
        else{
          if (schedules.days_el[i].P.firstElementChild){
            pb.menu_select(schedules.days_el[i],schedules.days_el[i].P.firstElementChild);
          }
        }
      }
      page._oninit=false;
    }
    function load(_ctm, _etm, page){
      _MAL.allist_schedule(_ctm, page,function(r){
        if (r){
          try{
            var isEnd=false;
            for (var i=0;i<r.data.Page.airingSchedules.length;i++){
              var a=r.data.Page.airingSchedules[i];
              var m=a.media;
              if (m.isAdult){
                continue;
              }
              if (!pb.cfg_data.nonjapan){
                if (m.countryOfOrigin!="JP"){
                  continue;
                }
              }
              if (schedules.ids.indexOf(m.id)==-1){
                if (a.airingAt){
                  if (a.airingAt>=_etm){
                    isEnd=true;
                    break;
                  }
                  schedules.ids.push(m.id);
                  m.airAt=a.airingAt;
                  m.airEp=a.episode;
                  m.airIn=a.timeUntilAiring;
                  var d=new Date(m.airAt*1000);
                  m.airDate=d;
                  m.airSort=(d.getDay()*5000)+(d.getHours()*1000)+d.getMinutes();
                  schedules.data.push(m);
                }
              }
            }
            if (!isEnd && r.data.Page.pageInfo.hasNextPage && (page<10)){
              load(_ctm, _etm, page+1);
              return;
            }
          }catch(e){
            console.log("Err Schedule: "+e);
          }
        }
        loaded();
      });
    }

    var dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    var startDate = Math.floor(dateNow.getTime() / 1000);
    var endDate = startDate + 604800;
    load(startDate, endDate, 1);
  },

  col_selected:0,
  row_selected:0,

  /* Root Key Callback */
  list_select:function(col, row){
    if (row>0){
      return home.menus[col][row-1];
    }
    return home.home_header;
  },
  keycb:function(c){
    if (home.search.onvoicesearch){
      if (c==KENTER || c==KBACK){
        clk();
        home.search.voiceSearchClose();
      }
      return;
    }
    if (listOrder.onpopup){
      return listOrder.keycb(c);
    }
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }
    if (home.onsearch){
      return home.search_keycb(c);
    }
    if (home.onsettings){
      return home.settings_keycb(c);
    }

    if (home.sidebar.onsidebar){
      // if (!pb.cfg_data.directsidebar){
      //   return home.sidebar.keycb(c);
      // }
      // else 
      if (home.sidebar.keycb(c)){
        return true;
      }
    }
    
    var pc=home.col_selected;
    var pr=home.row_selected;

    if (c==KBACK){
      if (pr==0){
        if (home.header_items_selected==0){
          // EXIT MODE
          var em=toInt(_JSAPI.storeGet("exitmode","0"));
          clk();
          if (em==0){
            _JSAPI.appQuit();
          }
          else if (em==1){
            _API.confirm(false,
              "<b><c>door_open</c> Exit AnimeTV?</b>",
              function(cnf){
                if (cnf){
                  _JSAPI.appQuit();
                }
            });
          }
          else if (em==2){
            if ((home.profiles.users.length>1)||(home.profiles.me.p)){
              home.profiles.logout();
            }
            else{
              _JSAPI.appQuit();
            }
          }
          else if (em==3 || em==4){
            $('sidebar').classList.add('active');
            home.sidebar.onsidebar=true;
            home.sidebar.opentype=(em==4)?3:2;
          }
          return true;
        }
        else{
          home.header_keycb(home.home_header,-1);
        }
      }
      else{
        pr=0;
      }
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      var el=home.list_select(pc,pr);
      el._keycb(el,c);
    }
    else if (c==KUP){
      if (--pr<0) pr=0;
    }
    else if (c==KDOWN){
      if (++pr>home.menus[pc].length) pr=home.menus[pc].length;
    }
    else if (c==KMENU){
      clk();
      $('sidebar').classList.add('active');
      home.sidebar.onsidebar=true;
      home.sidebar.opentype=1;
      return true;
    }

    if (home.row_selected!=pr){
      clk();
      var ac=home.row_selected;
      var nc=pr;
      home.row_selected=pr;
      var inactiveItem=home.list_select(pc,ac);
      inactiveItem.classList.remove('active');
      if (inactiveItem._activeCb){
        inactiveItem._activeCb(inactiveItem,false);
      }
      var activeItem=home.list_select(pc,nc);
      activeItem.classList.add('active');
      if (activeItem._activeCb){
        activeItem._activeCb(activeItem,true);
      }
      var itop=0;
      if (pr>1){
        var els=home.menus[pc][pr-1];
        if (els.classList.contains('home_tabs')){
          els=home.menus[pc][pr];
        }
        itop=els.offsetTop+els.offsetHeight;
      }
      var oheight = Math.floor(window.outerHeight / 1.2);
      if (itop>oheight){
        home.home_header.classList.add('scrolled');
        var ty = itop-oheight;
        if ((pr==home.menus[pc].length) || (ty>(home.home_scroll.offsetHeight-window.outerHeight))) {
          ty=home.home_scroll.offsetHeight-window.outerHeight;
        }
        if (_TOUCH){
          home.home_scroll.style.transform="";
          $scroll(home.home_scroll_mask,ty,0);
          // home.home_scroll_mask.scrollTop=ty;
        }
        else{
          home.home_scroll.style.transform="translateY("+(0-ty)+"px)";
        }
      }
      else{
        home.home_header.classList.remove('scrolled');
        if (_TOUCH){
          home.home_scroll.style.transform="";
          $scroll(home.home_scroll_mask,0,0);
          // home.home_scroll_mask.scrollTop=0;
        }
        else{
          home.home_scroll.style.transform="";
        }
      }
      return true;
    }
    return false;
  },

};


/* Argument Update */
window.__ARGUPDATE=function(){
    var uri=_JSAPI.getArg("url");
    if (uri){
      var vid=_JSAPI.getArg("tip");
      _MAL.alreq(`query ($id: Int) {
        Media(id:$id, type:ANIME, isAdult:false){
          id
          idMal
          title{
            romaji
            english
          }
          coverImage{
            large
            medium
            color
          }
          trailer {
            id
            site
            thumbnail
          }
          status
          duration
          format
          seasonYear
          season
          isAdult
          nextAiringEpisode {
            episode
          }
          averageScore
          episodes
          description
          bannerImage
          averageScore
        }
      }`,{
        "id":vid
      },function(r){
        if (r){
          var d=r.data.Media;
          var malid="anilistmedia_"+d.id;
          _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
          _MAL.action_handler(malid);
        }
      },1);
      /*
      var tip=_JSAPI.getArg("tip");
      var pos=_JSAPI.getArg("pos");
      var ssd=_JSAPI.getArg("sd");
      var sd=toInt(ssd);
      if (sd==0){
        sd=1;
      }
      if (sd!=__SD){
        console.log("ATVLOG ARGUPDATE -> CHANGE SD: "+sd+" / "+ssd);
        if (sd>=1 && sd<=6){
          _JSAPI.setSd(sd);
          setTimeout(function(){
            _API.reload();
          },1);
        }
        return;
      }
      console.log("ATVLOG ARGUPDATE -> "+uri+" / "+pos+" / "+tip+" / SD="+sd);
      pb.open(uri, tip,undefined,toInt(pos));
      */
      _JSAPI.clearArg();
    }
};

/* MAL API */
const _MAL={
  anilist:{
    genres:{
      "_tv":"TV","_tv_short":"TV_SHORT","_movie":"MOVIE","_special":"SPECIAL","_ova":"OVA","_ona":"ONA",
      "Action":"Action","Adventure":"Adventure","Comedy":"Comedy","Drama":"Drama","Ecchi":"Ecchi",
      "Fantasy":"Fantasy","Horror":"Horror","Mahou Shoujo":"Mahou Shoujo","Mecha":"Mecha",
      "Music":"Music","Mystery":"Mystery","Psychological":"Psychological","Romance":"Romance","Sci-Fi":"Sci-Fi",
      "Slice of Life":"Slice of Life","Sports":"Sports","Supernatural":"Supernatural","Thriller":"Thriller"
    }
  },
  token:"",
  altoken:"",
  auth:null,
  alauth:null,
  limit:12,
  data:{},
  aldata:{},
  islogin:function(isanilist){
    if (isanilist){
      return (_MAL.altoken?true:false);
    }
    return (_MAL.token?true:false);
  },
  init:function(){
    var maldata=_JSAPI.storeGet(_API.user_prefix+"mal_auth","");
    if (maldata==""){
        maldata=localStorage.getItem(_API.user_prefix+"mal_auth");
        if (maldata){
            _JSAPI.storeSet(_API.user_prefix+"mal_auth",maldata);
            localStorage.removeItem(_API.user_prefix+"mal_auth");
        }
    }
    // console.log("MAL-INIT: "+maldata);
    if (maldata){
      try{
        _MAL.auth = JSON.parse(maldata);
        if ('access_token' in _MAL.auth){
          _MAL.token=_MAL.auth.access_token;
          if (_MAL.auth.exp<$time()){
            // Expire
            _MAL.token="";
            _MAL.auth=null;
          }
        }
      }catch(ee){
        _MAL.token="";
        _MAL.auth=null;
      }
    }
    // console.log("MAL-TOKEN: "+_MAL.token);

    var aldata=_JSAPI.storeGet(_API.user_prefix+"anilist_auth","");
    // console.log("ANILIST-INIT: "+aldata);
    if (aldata){
      try{
        _MAL.alauth = JSON.parse(aldata);
        if ('access_token' in _MAL.alauth){
          _MAL.altoken=_MAL.alauth.access_token;
          if (_MAL.alauth.exp<$time()){
            // Expire
            _MAL.token="";
            _MAL.auth=null;
          }
        }
      }catch(ee){
        _MAL.altoken="";
        _MAL.alauth=null;
      }
    }
    // console.log("ANILIST-TOKEN: "+_MAL.altoken);
  },
  req:function(uri, method, cb, dat){
    if (!_MAL.token){
      cb({ok:false,responseText:''});
      return;
    }
    if (dat){
      if (!_ISELECTRON){
        uri+='?'+dat;
      }
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        xhttp.ok=true;
        cb(xhttp);
    };
    xhttp.onerror = function() {
        xhttp.ok=false;
        cb(xhttp);
    };
    xhttp.open(method, "/__proxy/https://api.myanimelist.net"+uri, true);
    xhttp.setRequestHeader('Accept', 'application/json' );
    xhttp.setRequestHeader("Authorization", "Bearer "+_MAL.token);
    if (_ISELECTRON && dat){
      xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      xhttp.send(dat);
    }
    xhttp.send();
  },
  alreq:function(q, vars, cb, notoken, retry){
    if (!retry){
      retry=0;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        xhttp.ok=true;
        try{
          var v=JSON.parse(xhttp.responseText);
          if (v && v.error && v.error.status==500){
            // retry
            if (retry<4){
              setTimeout(function(){
                _MAL.alreq(q,vars,cb,notoken,retry+1);
              },50);
            }
            else{
              try{
                cb(null);
              }catch(e){}
            }
            return;
          }
          try{
            cb(v);
          }catch(e){}
          return;
        }catch(e){}
        cb(null);
    };
    xhttp.onerror = function() {
        xhttp.ok=false;
        cb(null);
    };
    xhttp.open("POST", "/__proxy/https://graphql.anilist.co/", true);
    xhttp.setRequestHeader('Accept', 'application/json' );
    xhttp.setRequestHeader('Content-Type', 'application/json' );
    if (!notoken && _MAL.altoken){
      xhttp.setRequestHeader("Authorization", "Bearer "+_MAL.altoken);
    }
    xhttp.setRequestHeader("X-Org-Prox", "https://anilist.co");
    xhttp.setRequestHeader("X-Ref-Prox", "https://anilist.co/graphiql");
    if (_ISELECTRON){
      xhttp.send(JSON.stringify({
        query: q,
        variables: vars
      }));
    }
    else{
      xhttp.setRequestHeader("Post-Body", encodeURIComponent(JSON.stringify({
        query: q,
        variables: vars
      })));
      xhttp.send();
    }
  },
  alset_list:function(id, stat, cb){
    _MAL.alreq(`mutation($id: Int){
      SaveMediaListEntry(mediaId:$id, status:`+stat+`){
        id
        mediaId
        status
      }
    }`,{"id":id},function(c){ cb(c); });
  },
  alset_del:function(id, cb){
    _MAL.alreq(`mutation($id: Int){
      DeleteMediaListEntry(id:$id){
        deleted
      }
    }`,{"id":id},function(c){ cb(c); });
  },
  alset_ep:function(animeid, ep, cb){
    _MAL.alreq(`mutation($id: Int, $progress:Int){
      SaveMediaListEntry(id:$id, progress:$progress){
        progress
      }
    }`,{
      id:animeid,
      progress:ep
    },cb);
  },
  allist_search:function(qval,cb,page,perpage,minimal,mywatch){
    q=utfascii(qval);
    var srcType = 'String';
    var srcField = 'search';
    var srcId = false;
    console.log('Anilist Search: '+qval);
    if (qval.startsWith('#')){
      q=toInt(qval.substring(1));
      srcType = 'Int';
      srcField = 'id';
      srcId = true;
    }
    _MAL.alreq((minimal?`query ($search: `+srcType+`, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        media(sort: SEARCH_MATCH, isAdult:false, type: ANIME, `+srcField+`: $search){
          id
          idMal
          status
          title{
            romaji
            english
          }
          episodes
          mediaListEntry{
            id,
            progress,
            status
          }
        }
      }
    }`:
    `query ($search: `+srcType+`, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        media(sort: SEARCH_MATCH, isAdult:false, type: ANIME, `+srcField+`: $search){
          id
          idMal
          title{
            romaji
            english
          }
          coverImage{
            large
            medium
            color
          }
          status
          duration
          format
          seasonYear
          season
          isAdult
          nextAiringEpisode {
            episode
          }
          episodes
          description
          bannerImage
          averageScore
          favourites
          popularity
          trending
          genres
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          studios {
            edges{
              isMain
              node{
                name
              }
            }
          }
          mediaListEntry{
            id,
            progress,
            status
          }
          synonyms
          source
          countryOfOrigin
          reviews {
            edges {
              node {
                id
                summary
                rating
                score
              }
            }
          }
          trailer {
            id
            site
            thumbnail
          }
        }
      }
    }`),{
      "page":page?page:1,
      "perPage":perpage?perpage:10,
      "search":q
    },function(v){
      if (v){
        if (v.data.Page.media){
          if (srcId){
            if (v.data.Page.media.length>0){
              v.match=JSON.parse(JSON.stringify(v.data.Page.media[0]));
            }
          }
          else{
            var srcq=[
              utfascii(q),
              slugString(q)
            ];
            var srcf=[
              utfascii,
              slugString
            ];
            for (var j=0;j<2 && !v.match;j++){
              for (var i=0;i<v.data.Page.media.length;i++){
                var med=v.data.Page.media[i];
                var s1=med.title.english;
                var s2=med.title.romaji;
                var ms=med.status;
                if (ms=="FINISHED" || ms=="RELEASING" || ms=="HIATUS" || (mywatch&&(ms=="NOT_YET_RELEASED")) ){
                  if (s1 && (srcf[j](s1)==srcq[j])){
                    v.match=JSON.parse(JSON.stringify(med));
                    break;
                  }
                  else if (s2 && (srcf[j](s2)==srcq[j])){
                    v.match=JSON.parse(JSON.stringify(med));
                    break;
                  }
                }
              }
            }
            /* force first result */
            if (!v.match && mywatch && (v.data.Page.media.length>0)){
              v.match=JSON.parse(JSON.stringify(v.data.Page.media[0]));
            }
          }
        }
        cb(v);
        return;
      }
      cb(null);
    });
  },
  allist_schedule:function(tm,page,cb){
    var addj=''
    //  countryOfOrigin: "JP",';
    // if (pb.cfg_data.nonjapan){
    //   addj='';
    // }
    _MAL.alreq(`query ($tm: Int, $page: Int, $perPage: Int){
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        airingSchedules(airingAt_greater:$tm,sort:TIME){
          airingAt
          episode
          timeUntilAiring
          media{
            id
            title{
              romaji
              english
            }
            coverImage{
              large
              medium
            }
            status
            duration
            format
            seasonYear
            season
            isAdult
            episodes
            countryOfOrigin
          }
        }
      }
    }`,{
      "page":page?page:1,
      "perPage":50,
      "tm":tm
    },function(v){
      if (v){
        cb(v);
        return;
      }
      cb(null);
    }, true);
  },
  allist_list_parser:function(g,v,isSearch){
    try{
      g._havenext=true;
      if (!v || v.error || !v.data || !v.data.Page || !v.data.Page.pageInfo){
        if (isSearch){
          g._havenext=false;
        }
        else{
          g._page=100;
        }
        return;
      }
      if (!v.data.Page.pageInfo.hasNextPage || (v.data.Page.media.length<12)){
        if (isSearch){
          g._havenext=false;
        }
        else{
          g._page=100;
        }
      }
      if (v.data.Page.media.length>0){
        for (var i=0;i<v.data.Page.media.length;i++){
          var d=v.data.Page.media[i];
          if (!ratingSystem.checkAdult(d.isAdult,d.title.english,d.title.romaji)){
            continue;
          }
          var malid="anilistmedia_"+d.id;
          
          var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
          
          hl._img=$n('img','',{loading:'lazy',src:$img($aimg(d.coverImage))},hl,'');
          hl._title=$n('b','',{
              jp:d.title.romaji?d.title.romaji:d.title.english
            },hl,tspecial(
              d.title.english?d.title.english:d.title.romaji
            ));

          var infotxt='';
          var binfotxt='';
          if (d.averageScore){
            binfotxt+='<span class="info_score"><c>star</c>'+d.averageScore+'</span>';
          }
          if (d.isAdult){
            binfotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
          }
          var isplan=false;
          if (d.status=='NOT_YET_RELEASED'){
            if (d.startDate && d.startDate.year){
              if (d.startDate.month){
                var m='Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Des'.split(',');
                binfotxt+='<span class="info_year"><c>event_upcoming</c>'+special(m[d.startDate.month-1]+' '+d.startDate.year)+'</span>';
              }
              else{
                binfotxt+='<span class="info_year"><c>event_upcoming</c>'+special(d.startDate.year)+'</span>';
              }
              isplan=true;
            }
          }
          if (!isplan && d.seasonYear){
            binfotxt+='<span class="info_year">'+special(d.seasonYear)+'</span>';
          }
          if (d.duration){
            binfotxt+='<span class="info_duration">'+special((d.duration+"").toLowerCase())+' min</span>';
          }
          

          var mtp=d.format;
          if (mtp=='TV_SHORT'){
            mtp='TV';
          }
          if (mtp){
            infotxt+='<span class="info_type">'+special(mtp)+'</span>';
          }
          var vep=0;
          var sumep=d.episodes;
          if ('airEp' in d){
            vep=d.airEp;
          }
          else if (d.nextAiringEpisode){
            vep=d.nextAiringEpisode.episode-1;
            if (vep<1){
              vep=0;
            }
          }
          
          d.eptotal=sumep;
          d.ep=vep;

          if (d.eptotal){
            if (d.ep){
              infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
            }
            infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(d.eptotal)+'</span>';
          }
          else if (d.ep){
            infotxt+='<span class="info_ep"><c>movie</c>'+special(d.ep)+'</span>';
          }
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          if (binfotxt){
            hl._ep=$n('span','info info_bottom',null,hl,binfotxt);
          }

          _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
        }
        if (home.withspre){
          while (g.P.childElementCount>30){
            g._spre.push(g.P.firstElementChild.nextElementSibling);
            g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          }
          g.__update_pre();
        }
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);

        return v.data.Page.media.length;
      }
    }catch(e){
      console.log("ANILIST - LIST_PARSER : "+e);
    }
    return 0;
  },
  allist_list_loader:function(g){
    g._onload=1;
    _MAL.allist_list(g._atype,g._page,12,function(v){
      if (v){
        try{
          _MAL.allist_list_parser(g,v);
        }catch(e){}
        g._onload=0;
      }
    });
  },
  allist_year:function(){
    return (new Date(new Date().getTime()-2592000000)).getFullYear();
  },
  getAvatar:function(isAnilist,cb){
    if (isAnilist){
      if (_MAL.alauth){
        _MAL.alreq(`query($usr: String){
          User(name:$usr){
            avatar {
              large
            }
          }
        }`,{
          "usr":_MAL.alauth.user
        },function(v){
          if (v){
            try{
              if (v.data.User.avatar.large){
                try{
                  cb(v.data.User.avatar.large);
                }catch(e2){}
                return;
              }
            }catch(e){}
          }
          cb(null);
        }, true);
        return;
      }
    }else{
      if (_MAL.auth){
        var uri='/v2/users/@me?fields=picture';
        _MAL.req(uri,"GET",function(v){
          if (v.ok){
            try{
              var k=JSON.parse(v.responseText);
              if ('picture' in k){
                try{
                  if (k.picture){
                    cb(k.picture);
                  }
                }catch(e){}
                return;
              }
              else{
                cb(null);
              }
            }catch(e){}
            return;
          }
          cb(null);
        });
        return;
      }
    }
    requestAnimationFrame(function(){
      cb(null);
    });
  },
  getAlBanner:function(cb){
    if (_MAL.alauth){
      _MAL.alreq(`query($usr: String){
        User(name:$usr){
          bannerImage
        }
      }`,{
        "usr":_MAL.alauth.user
      },function(v){
        if (v){
          try{
            if (v.data.User.bannerImage){
              try{
                cb(v.data.User.bannerImage);
              }catch(e2){}
              return;
            }
          }catch(e){}
        }
        cb(null);
      }, true);
      return;
    }
    requestAnimationFrame(function(){
      cb(null);
    });
  },
  allist_related:function(id,cb){
    _MAL.alreq(`query($id:Int) {
      Media(isAdult:false, type: ANIME, id:$id){
        id
        idMal
        relations{
          nodes{
            id
            idMal
            title{
              romaji
              english
            }
            coverImage{
              large
              medium
            }
            episodes
            status
            duration
            format
            type
            isAdult
            averageScore
          }
        }
        recommendations{
          nodes{
            mediaRecommendation{
              id
              idMal
              title{
                romaji
                english
              }
              coverImage{
                large
                medium
              }
              episodes
              status
              duration
              format
              type
              isAdult
              averageScore
            }
          }
        }
      }
    }`,{
      "id":id
    },function(v){
      if (v){
        var out={
          rel:[],
          rec:[],
          n:0
        };
        try{
          var nd=v.data.Media.relations.nodes;
          for (var i=0;i<nd.length;i++){
            var vd=nd[i];
            if (vd.type=="ANIME"){
              out.rel.push(vd);
              out.n++;
            }
          }
        }catch(e){}
        try{
          var nd=v.data.Media.recommendations.nodes;
          for (var i=0;i<nd.length;i++){
            var vd=nd[i].mediaRecommendation;
            if (vd.type=="ANIME"){
              out.rec.push(vd);
              out.n++;
            }
          }
        }catch(e){}
        try{
          cb(out);
        }catch(e){}
        return;
      }
      cb(null);
    }, true);
  },
  allist_recent:function(page,perpage,cb){
    _MAL.alreq(`fragment media on Media {
  type
  countryOfOrigin
  id
  title{
    romaji
    english
  }
  coverImage{
    large
    medium
  }
  startDate {
    year
    month
    day
  }
  status
  duration
  format
  seasonYear
  season
  isAdult
  averageScore
  nextAiringEpisode {
    episode
    airingAt
    timeUntilAiring
  }
  episodes
}

fragment airingSchedules on AiringSchedule {
  id
  episode
  airingAt
  mediaId
  media {
    ...media
  }
}

fragment pageInfo on Page {
  pageInfo {
    perPage
    hasNextPage
    currentPage
  }
  airingSchedules(
    airingAt_greater: $weekStart
    airingAt_lesser: $weekEnd
    sort: TIME_DESC
    notYetAired:false
  ) {
    ...airingSchedules
  }
}

query ($weekStart: Int, $weekEnd: Int, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    ...pageInfo
  }
}`,{
    "page":page?page:1,
    "perPage":50,
    "weekStart":0,
    "weekEnd":$time()
  },function(v){
    if (v){
      v.data.Page.media=[];
      for (var i=0;i<v.data.Page.airingSchedules.length;i++){
        var md=v.data.Page.airingSchedules[i].media;
        if (md.countryOfOrigin=="JP" && md.type=="ANIME" && md.format!="TV_SHORT" && md.format!="ONA" && !md.isAdult && md.episodes){
          var ob=JSON.parse(JSON.stringify(md))
          ob.airEp=v.data.Page.airingSchedules[i].episode;
          v.data.Page.media.push(ob);
        }
      }
      console.log(v);
      cb(v);
      return;
    }
    cb(null);
  }, true);

  },
  allist_list:function(sort,page,perpage,cb){
    var sr='POPULARITY_DESC';
    var blk='status_not_in:[HIATUS,CANCELLED,NOT_YET_RELEASED]';
    if (sort=='recently'){
      return _MAL.allist_recent(page,perpage,cb);
    }
    else if (sort=='top'){
      sr='SCORE_DESC';
    }
    else if (sort=='year'){
      sr='SCORE_DESC, seasonYear: '+(_MAL.allist_year());
    }
    else if (sort=='upcomming'){
      var nd=new Date();
      var fd=nd.getFullYear()+''+pad2(nd.getMonth()+1)+''+pad2(nd.getDate());
      blk='status:NOT_YET_RELEASED,startDate_greater:'+fd;
      sr='START_DATE';
    }
    var addj='';
    //  countryOfOrigin: "JP",';
    // if (pb.cfg_data.nonjapan){
    //   addj='';
    // }
    _MAL.alreq(`query ($page: Int, $perPage: Int){
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        media(sort:`+sr+`,isAdult:false, type: ANIME,`+addj+` `+blk+`) {
          id
          title{
            romaji
            english
          }
          coverImage{
            large
            medium
          }
          startDate {
            year
            month
            day
          }
          status
          duration
          format
          seasonYear
          season
          isAdult
          averageScore
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
          episodes
        }
      }
    }`,{
      "page":page?page:1,
      "perPage":perpage
    },function(v){
      if (v){
        cb(v);
        return;
      }
      cb(null);
    }, true);
  },
  allist:function(stype,page,cb){
    if (!stype){
      stype='CURRENT';
    }
    var sortv="ADDED_TIME_DESC";
    sortv="UPDATED_TIME_DESC";
    _MAL.alreq(`query ($user: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        mediaList(userName:$user,type:ANIME,status:`+stype+`,sort:`+sortv+`){
          id
          progress
          media{
            id
            title{
              romaji
              english
            }
            coverImage{
              large
              medium
              color
            }
            status
            format
            seasonYear
            season
            isAdult
            nextAiringEpisode {
              episode
            }
            averageScore
            episodes
          }
        }
      }
    }`,{
      user:_MAL.alauth.user,
      page:page,
      perPage:_MAL.limit
    },cb);
  },
  mal_detail:function(id,cb,minimal){
    // 56731
    var uri='/v2/anime/'+id+'?nsfw=false&'+
      (minimal?
        'fields=my_list_status,num_episodes,alternative_titles&':
        'fields=my_list_status,start_season,num_episodes,media_type,mean,alternative_titles,studios&')+
      'limit=10';
    _MAL.req(uri,"GET",cb);
  },
  list:function(type,offset,cb){
    var sortv="&sort=list_updated_at";
    var uri='/v2/users/@me/animelist?nsfw=false&'+
      'fields=list_status,start_season,num_episodes,media_type,mean,alternative_titles,studios&'+
      'status='+enc(type)+sortv+'&'+
      'limit='+_MAL.limit;
    if (offset){
      uri+='&offset='+offset;
    }
    _MAL.req(uri,"GET",cb);
  },
  set_ep:function(animeid, ep, cb){
    var uri='/v2/anime/'+animeid+'/my_list_status';
    _MAL.req(uri,"PUT",cb,'num_watched_episodes='+ep);
  },
  set_del:function(animeid, cb){
    var uri='/v2/anime/'+animeid+'/my_list_status';
    _MAL.req(uri,"DELETE",cb);
  },
  set_list:function(animeid, stat, cb){
    var uri='/v2/anime/'+animeid+'/my_list_status';
    _MAL.req(uri,"PUT",cb,'status='+enc(stat));
  },
  login:function(isanilist,logintype){
    if (_MAL.token && !isanilist){
      _API.confirm("Logout MAL",
        "Are you sure you want to logout MyAnimeList integration?",
        function(cnf){
          if (cnf){
            _JSAPI.storeDel(_API.user_prefix+"mal_auth");
            _API.showToast("MyAnimeList logout sucessfull...");
            _API.reload();
          }
      });
    }
    else if (_MAL.altoken && isanilist){
      _API.confirm("Logout AniList",
        "Are you sure you want to logout AniList integration?",
        function(cnf){
          if (cnf){
            _JSAPI.storeDel(_API.user_prefix+"anilist_auth");
            _API.showToast("AniList logout sucessfull...");
            _API.reload();
          }
      });
    }
    else{
      if (!isanilist && !logintype){
        if (_ISELECTRON){
          logintype=1;
        }
        else{
          listOrder.showMenu(
            "MyAnimeList Login Type",
            [
              {icon:'qr_code_scanner',title:"QRCode Web Authorization"},
              {icon:'key',title:"Username + Password"}
            ],
            0,
            function(chval){
              if (chval===null){
                return;
              }
              if (chval==1){
                _JSAPI.malLogin();
                return;
              }
              else{
                _MAL.login(0,1);
              }
            }
          );
          return;
        }
      }

      home.settings.open_qrcode(
        '<span class="z-loader z-small"></span><br>Please Wait..',
        null,
        true
      );
      var lid='';
      var lstate=0;
      var root_url=isanilist?'https://animetv.amarullz.com/anilist':'https://animetv.amarullz.com/mal';
      function delLid(){
        var uriv=root_url+'/check?lid='+lid+"&del="+$tick();
        $ap(uriv, function(r){});
      }
      function waitLogin(){
        var uriv=root_url+'/check?lid='+lid+"&"+$tick();
        $ap(uriv, function(r){
          if (home.ondonate){
            if (r.ok){
              try{
                var k=JSON.parse(r.responseText);
                console.log("MAL RECHECK = "+r.responseText+" / "+uriv);
                if ((k.st==1)&&(lstate==0)){
                  lstate=1;
                  home.settings.open_qrcode(
                    '<span class="z-loader z-small"></span><br>'+
                    (isanilist?'Please finish AniList authorization':'Please finish MAL authorization'),
                    null,
                    true
                  );
                }
                else if (k.st==2){
                  home.settings.close_qrcode();
                  _MAL.onlogin(JSON.parse(r.responseText),isanilist?2:1);
                  return;
                }
              }catch(e){}
            }
            /* retry */
            setTimeout(waitLogin,2000);
          }
          else{
            delLid();
          }
        });
      }
      function showQr(){
        lstate=0;
        home.settings.open_qrcode(
          isanilist?'Scan QR and login to AniList in your phone':'Scan QR and login to MAL in your phone',
          root_url+"/login?lid="+lid,
          true
        );
        waitLogin();
      }
      function genLid(){
        if (isanilist){
          lid='AL'+$tick()+'Y';
        }
        else{
          lid='MAL'+$tick()+'L';
        }
        var uri=root_url+'/check?lid='+lid+"&"+$tick();
        $ap(uri, function(r){
          if (home.ondonate){
            if (r.ok){
              try{
                var k=JSON.parse(r.responseText);
                console.log("MAL CHECK = "+r.responseText);
                if (k.st==0){
                  showQr();
                  return;
                }
              }catch(e){}
            }
            /* retry */
            setTimeout(genLid,2000);
          }else{
            delLid();
          }
        });
      }
      genLid();
    }
  },
  onlogin:function(d,tp){
    if (d){
      if (!tp){
        d.tk=d.access_token;
        d.ex=d.expires_in;
      }
      if (('tk' in d) && ('ex' in d) && d.tk && d.ex){
        var dt={
          access_token:d.tk,
          exp:d.ex+$time(),
          expires_in:d.ex,
          user:d.user
        };

        if (tp==2){
          _JSAPI.storeSet(_API.user_prefix+"anilist_auth",JSON.stringify(dt));
          console.log("ANILIST-ONLOGIN: "+JSON.stringify(dt));
          _API.showToast("AniList login sucessfull...");
          _API.reload();
        }
        else{
          _JSAPI.storeSet(_API.user_prefix+"mal_auth",JSON.stringify(dt));
          console.log("MAL-ONLOGIN: "+JSON.stringify(dt));
          _API.showToast("MyAnimeList login sucessfull...");
          _API.reload();
        }
      }
      else if (tp==2){
        _API.showToast("AniList Login Failed");
      }
      else{
        _API.showToast("MyAnimeList Login Failed"+(('message' in d)?": "+d.message:""));
      }
    }
  },
  home_loader:function(g){
    g._onload=1;
    g.classList.remove('nodata');
    var load_page=(g._page-1)*_MAL.limit;
    _MAL.list(g._atype,load_page, function(r){
      if (r.ok){
        try{
          var v=JSON.parse(r.responseText);
          _MAL.list_parse(g,v);
        }catch(e){
        }
        g._onload=0;
      }
    });
  },
  alhome_loader:function(g){
    g._onload=1;
    g.classList.remove('nodata');
    _MAL.allist(g._atype,g._page,function(v){
      if (v){
        try{
          _MAL.allist_parse(g,v);
        }catch(e){}
        g._onload=0;
      }
    });
  },
  update_epel:function(id,vid,cep,isanilist){
    var d=null;
    if (isanilist){
      _MAL.alset_ep(id,cep,function(r){
        console.log("AniList #Update-Resp: "+JSON.stringify(r));
      });
      if (vid in _MAL.aldata){
        d=_MAL.aldata[vid];
        d.progress=cep;
      }
    }
    else{
      _MAL.set_ep(id,cep,function(r){
        console.log("MAL #Update-Resp: "+r.responseText);
      });
      if (vid in _MAL.data){
        d=_MAL.data[vid];
        d.list_status.num_episodes_watched=cep;
      }
    }

    if (d){
      if (true){
        if (_MAL.uepto){
          clearTimeout(_MAL.uepto);
        }
        _MAL.uepto=setTimeout(
          function(){
            home.init_mylist(true);
          },1000
        );
        return;
      }
    }
  },
  allist_parse:function(g,v){
    try{
      if (!v.data.Page.pageInfo.hasNextPage){
        g._page=100;
      }
      if (v.data.Page.mediaList.length>0){
        g.classList.remove('nodata');
        for (var i=0;i<v.data.Page.mediaList.length;i++){
          var d=v.data.Page.mediaList[i];
          if (d.media.isAdult){
            continue;
          }
          var malid="anilist_"+d.id;
          _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
          var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img($aimg(d.media.coverImage))},hl,'');
          _MAL.aldata[malid]._elm=hl;
          hl._title=$n('b','',{jp:d.media.title.romaji?d.media.title.romaji:d.media.title.english},hl,tspecial(d.media.title.english?d.media.title.english:d.media.title.romaji));
          var infotxt='';
          var numep=d.progress;
          var mtp=d.media.format;
          if (mtp=='TV_SHORT'){
            mtp='TV';
          }
          if (d.media.isAdult){
            infotxt+='<span class="info_adult">'+_API.rplustxt+'</span>';
          }
          if (mtp&&(mtp!='unknown')){
            infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
          }
          var vep=0;
          if (d.media.nextAiringEpisode){
            vep=d.media.nextAiringEpisode.episode-1;
            if (vep<1){
              vep=0;
            }
          }
          var sumep=d.media.episodes;
          if (vep){
            infotxt+='<span class="info_sumep"><c>movie</c>'+special(vep+"")+'</span>';
          }
          else if (sumep){
            infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(sumep+"")+'</span>';
          }
          // infotxt+='<span class="info_ep'+((numep<vep)?' info_ep_havenext':'')+'"><c>avg_pace</c>'+
          //   special((numep?numep:"-")+"")+'</span>';
          infotxt+='<span class="info_ep"><c>avg_pace</c>'+special((numep?numep:"-")+"")+'</span>';
          hl._ep=$n('span','info',null,hl,infotxt);
          if (numep<vep){
            hl._ep=$n('span','info_ep_havenext',null,hl,'');
          }
        }
        if (home.withspre){
          while (g.P.childElementCount>30){
            g._spre.push(g.P.firstElementChild.nextElementSibling);
            g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          }
          g.__update_pre();
        }
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);
      }
      else{
        g.classList.add('nodata');
      }
    }catch(e){
      console.log("ANILIST - ERR : "+e);
    }
  },
  list_parse:function(g,v){
    if ('paging' in v){
      if (!('next' in v.paging)){
        g._page=100;
      }
    }
    else{
      g._page=100;
    }
    g.classList.add('nodata');
    if ('data' in v){
      try{
        if (v.data.length>0){
          g.classList.remove('nodata');
          for (var i=0;i<v.data.length;i++){
            var d=v.data[i];
            var malid="mal_"+d.node.id;
            _MAL.data[malid]=JSON.parse(JSON.stringify(d));
            var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
            hl._img=$n('img','',{loading:'lazy',src:$img(d.node.main_picture.medium)},hl,'');
            var title=d.node.title;
            _MAL.data[malid]._elm=hl;
            if ('alternative_titles' in d.node){
              if ('en' in d.node.alternative_titles){
                if (d.node.alternative_titles.en.trim()){
                  title=d.node.alternative_titles.en;
                }
              }
            }
            hl._title=$n('b','',{jp:d.node.title},hl,tspecial(title)); /* d.node.title */
            var infotxt='';
            var numep=d.list_status.num_episodes_watched;
            var sumep=d.node.num_episodes;
            var mtp=d.node.media_type;
            if (mtp&&(mtp!='unknown')){
              infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
            }
            if (sumep){
              infotxt+='<span class="info_sumep"><c>bookmark</c>'+special(sumep+"")+'</span>';
            }
            infotxt+='<span class="info_ep"><c>avg_pace</c>'+special((numep?numep:"-")+"")+'</span>'; 
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          if (home.withspre){
            while (g.P.childElementCount>30){
              g._spre.push(g.P.firstElementChild.nextElementSibling);
              g.P.removeChild(g.P.firstElementChild.nextElementSibling);
            }
            g.__update_pre();
          }
    
          if (!g._sel)
            pb.menu_select(g,g.P.firstElementChild);
          else
            pb.menu_select(g,g._sel);
        }
      }catch(e){}
    }
  },
  srcanime:function(d,cb,isanilist,cnt){
    if ('srcanime' in d){
      cb(d.srcanime);
      return;
    }
    if (!cnt){
      cnt=0;
    }
    var uri='';
    var id='';
    var kw='';
    var kw2='';
    if (isanilist){
      id=d.id;
      var dmedia=null;
      if (isanilist==2){
        dmedia=d;
      }
      else{
        dmedia=d.media;
        d.status=dmedia.status;
      }

      if (__SD5){
        _API.getTooltip(dmedia.id+'',function(r){
          if (r){
            d.srcanime=[r];
            cb(d.srcanime);
            return;
          }
          d.srcanime=[];
          cb(d.srcanime);
        });
        return;
      }
      else if (__SD7||__SD8){
        console.warn(dmedia);
        requestAnimationFrame(function(){
          var o=[{
            url:dmedia.id+'',
            tip:dmedia.id+'',
            title:dmedia.title.english,
            title_jp:dmedia.title.romaji,
            poster:dmedia.coverImage.medium,
            ep:dmedia.episodes
          }];
          cb(o);
        });
        return;
      }
      
      
      kw=dmedia.title.romaji;
      if (__SD3||__SD6){
        kw2=kw;
        kw=dmedia.title.english;
        if (!kw){
          kw=dmedia.title.romaji;
        }
      }
      var ses=dmedia.season;
      var y=dmedia.seasonYear;
      console.log("FILTER URL = "+uri);
      console.log(JSON.stringify(d));
    }
    else{
      if (__SD7||__SD8){
        gojo.getFromMAL(d.node.id,function(r){
          if (r && r.data && r.data.Media){
            var dm=r.data.Media;
            var o=[{
              url:dm.id+'',
              tip:dm.id+'',
              title:dm.title.english?dm.title.english:dm.title.romaji,
              title_jp:dm.title.romaji?dm.title.romaji:dm.title.english,
              poster:dm.coverImage.medium,
              ep:dm.episodes
            }];
            cb(o);
            return;
          }
          cb([]);
        });
        return;
      }

      id=d.node.id;
      kw=d.node.title;
      kw2=kw; 
      try{
        kw=d.node.alternative_titles.en;
      }catch(ee){}
      if (!kw){
        kw=d.node.title;
      }
      var ses=d.node.start_season.season;
      var y=d.node.start_season.year;
    }
    // uri='/filter?keyword='+enc(kw)+'&sort=most_relevance';
    var year=null;
    var season=null;
    if (cnt<2){
      season=ses;
    }
    if (cnt<1){
      year=y;
    }
    if (cnt>0 && __SD6){
      kw=kw2;
    }
    kw=utfascii(kw);
    uri=_API.filterurl(
      kw,null,1,0,season,year
    );

    var ntype='';
    if (!isanilist){
      ntype=(d.node.media_type+'').toLowerCase();
    }
    else{
      ntype=(dmedia.format+'').toLowerCase();
    }
    ntype=ntype.trim();

    $a(uri,function(r){
      if (r.ok){
        var rd=home.search.parse(r.responseText);
        if (rd.length>0){
          var sel=null; // rd[0];
          if (d.status!='NOT_YET_RELEASED'){
            sel=rd[0];
          }
          var slkw=slugString(kw,'');
          console.log(window.__srcanimev=[
            'ANIMESRC',id,
            JSON.parse(JSON.stringify(rd)),
            kw,
            slkw
          ]);
          for (var i=0;i<rd.length;i++){
            if (__SD5||__SD7||__SD8){
              if (isanilist){
                var ndmedia=null;
                if (isanilist==2){
                  ndmedia=d;
                }
                else{
                  ndmedia=d.media;
                }
                if (ndmedia.id==rd[i].tip){
                  sel=rd[i];
                  break;
                }
              }
              else{
                if (d.id==rd[i].malid){
                  console.log("MAL MATCH = "+rd[i].malid+" -> "+d.id);
                  sel=rd[i];
                  break;
                }
              }
            }
            else{
              if ((slugString(rd[i].title,'')==slkw)||(slugString(rd[i].title_jp,'')==slkw)){
                sel=rd[i];
                if (!ntype){
                  break;
                }
                else if (ntype && rd[i].type && rd[i].type.toLowerCase()==ntype){
                  break;
                }
              }
            }
          }

          if (sel){
            d.srcanime=[sel];
          }
          else{
            if (cnt<2 && (d.status!='NOT_YET_RELEASED')) {
              if (__SD6){
                cnt++;
              }
              console.log('ANIMESRC RETRY ['+id+'] = '+cnt);
              _MAL.srcanime(d,cb,isanilist,cnt+1);
              return;
            }
            d.srcanime=[];
          }
          cb(d.srcanime);
          return;
        }
        else if (cnt<2){
          if (__SD6){
            cnt++;
          }
          console.log('ANIMESRC RETRY ['+id+'] = '+cnt);
          _MAL.srcanime(d,cb,isanilist,cnt+1);
          return;
        }
      }
      d.srcanime=[];
      cb(d.srcanime);
    },_API.filterorigin());
  },
  action_handler:function(id){
    try{
      _MAL.pop.mv.className='active loading';
      $('popupcontainer').className='active';
      _MAL.pop.var.ready=false;
      _MAL.onpopup=true;

      if (id in _MAL.data){
        var d=_MAL.data[id];
        _MAL.srcanime(d,function(r){
          if (r && r.length>0){
            if (_MAL.onpopup){
              console.log("MAL ACTION START...");
              // pb.open(r[0].url, r[0].tip);
              _MAL.preview(
                r[0].url, r[0].poster, r[0].title, r[0].tip, 
                d.list_status.num_episodes_watched, 0, 0, 
                '', d.node.id
              );
            }
            return;
          }
          var kw=d.node.title;
          _MAL.pop_opendetail(kw, true);
          // _MAL.popup_close();
          _API.showToast("Matching anime not found...");
        });
      }
      else if (id in _MAL.aldata){
        var d=_MAL.aldata[id];
        var isMedia=(id.indexOf("anilistmedia_")==0);
        _MAL.srcanime(d,function(r){
          if (r && r.length>0){
            if (_MAL.onpopup){
              console.log("ANILIST ACTION START...");
              _MAL.preview(
                r[0].url, r[0].poster, r[0].title, r[0].tip, 
                isMedia?d.ep:d.progress, 0, 0, 
                isMedia?'ep':'', (isMedia?"":"L"+d.id)
              );
            }
            return;
          }
          var dmedia=null;
          if (isMedia){
            dmedia=d;
          }
          else{
            dmedia=d.media;
          }
          var kw=dmedia.title.romaji?dmedia.title.romaji:dmedia.title.english;
          _MAL.pop_opendetail(kw, true);
          if (dmedia.status && dmedia.status!='NOT_YET_RELEASED'){
            _API.showToast("Matching anime not found...");
          }
        },isMedia?2:1);
      }
    }catch(e){
      console.log("Error MAL Action : "+e);
      _MAL.popup_close();
    }
  },
  pop:{
    detail_button:$('malview_info_detail_button'),
    detail_holder:$('anilist_detail'),
    mv:$('malview'),
    title:$('malview_title'),
    img:$('malview_img'),
    begin:$('malplay_begin'),
    resume:$('malplay_resume'),
    next:$('malplay_next'),
    ep:$('malplay_ep'),
    epval:$('malplay_ep_val'),
    resume_ep:$('malplay_resume_ep'),
    resume_text:$('malplay_resume_text'),
    next_ep:$('malplay_next_ep'),
    watchlist:$('malplay_watchlist'),
    history:$('malplay_history'),
    progh:$('malplay_resume_progh'),
    prog:$('malplay_resume_prog'),
    rating:$('malview_rating'),
    menu:[],
    menusel:0,
    var:{
      ondetail_directclose:false,
      ondetail:false,
      next:0,
      resume:0,
      ep:1,
      num:0,
      url:'',
      ttip:'',
      malid:0,
      play:{
        c:0,
        d:0,
        e:0
      },
      infav:false,
      animeid:'',
      ready:false,
      title:'',
      title_jp:'',
      img:''
    },
    setEp:function(){
      if (_MAL.pop.var.num>0){
        _MAL.pop.epval.innerHTML='Episode '+_MAL.pop.var.ep+' / '+_MAL.pop.var.num;
        _MAL.pop.ep.classList.remove('disable');
      }
      else{
        _MAL.pop.epval.innerHTML='-';
        _MAL.pop.ep.className='disable';
      }
    }
  },
  onpopup:false,
  pop_opendetail:function(kw, directclose){
    //_MAL.pop.detail_holder
    _MAL.pop.var.ondetail_directclose=directclose;
    _MAL.pop.var.ondetail=true;
    _MAL.pop.mv.classList.add('loading');
    _MAL.pop.detail_holder.scrollTop=0;
    _MAL.pop.detail_holder.innerHTML='';
    _MAL.pop.detail_holder._el=null;
    home.anilist_yt.init();
    _MAL.allist_search(kw,function(v){
      if (!_MAL.pop.var.ondetail){
        _MAL.pop.mv.classList.remove('loading');
        if (_MAL.pop.var.ondetail_directclose){
          _MAL.pop.mv.classList.remove('active');
          _MAL.popup_close();
        }
        return;
      }
      if (!v || !v.match){
        _MAL.pop.mv.classList.remove('loading');
        _MAL.pop.var.ondetail=false;
        if (_MAL.pop.var.ondetail_directclose){
          _MAL.pop.mv.classList.remove('active');
          _MAL.popup_close();
        }
        _API.showToast("Matching AniList Not Found.");
        return;
      }
      console.log(["pop_opendetail", v]);
      _MAL.pop.detail_holder.innerHTML='';
      var d=v.match;
      var hl=$n('div','alsd_container',null,_MAL.pop.detail_holder,'');
      hl._vleft=$n('div','alsd_left_container alsd_keyval',null,hl,'');
      hl._img=$n('img','alsd_poster',{loading:'lazy',src:$img($aimg(d.coverImage))},hl._vleft,'');

      hl._tools=$n('div','alsd_tools',null,_MAL.pop.detail_holder,'');
      hl._btn=[];

      hl._content=$n('div','alsd_content',null,hl,'');
      var trailer_avail=false;
      if (d.trailer){
        if (d.trailer.site=="youtube"){
          hl._initTrailer=function(){
            if (!hl._trailer){
              hl._trailer=$n('iframe','alsd_youtube',{
                  src:home.yt_init(d.trailer.id,1),
                  frameborder:'0',
                  loading:'lazy'
                },
                null,''
              );
              hl._content.insertBefore(hl._trailer,hl._content.firstElementChild);
              if (hl._banner){
                hl._banner.classList.add('hide');
              }
            }
          }
          trailer_avail=true;
          if (!d.bannerImage){
            d.bannerImage=d.trailer.thumbnail;
          }
        }
      }
      var banner_div=hl._banner=$n('div','alsd_banner',null,hl._content,'');
      hl._banner.style.display='none';
      if (!pb.cfg_data.alisthqbanner || !bannerCacher.enable){
        if (d.bannerImage){
          banner_div.style.backgroundImage='url('+$img(d.bannerImage)+')';
          banner_div.style.display='';
        }
      }
      else{
        bannerCacher.get(d.id+'',function(im){
          var vimg=d.bannerImage?$img(d.bannerImage):'';
          if (im){
            vimg=im;
          }
          if (vimg){
            banner_div.style.backgroundImage='url('+vimg+')';
            banner_div.style.display='';
          }
        });
      }

      if (trailer_avail){
        hl._playtrailer=$n('div','alsd_button',null,hl._tools,'<c>play_arrow</c> <l>Play</l> Trailer');
      }
      hl._addmal=$n('div','alsd_button alsd_button_right',null,hl._tools,'');
      hl._addmal._mid=d.idMal;
      hl._addmal._update=function(){
        var x=hl._addmal;
        x._curr='';
        if (x._dat && x._dat.my_list_status && x._dat.my_list_status.status){
          x.innerHTML='<c>bookmark</c> MAL '+ucfirst(x._dat.my_list_status.status.replace(/_/g,' '),1);
          x._curr=x._dat.my_list_status.status;
        }
        else{
          x.innerHTML='<c>bookmark_add</c> <l>Add to</l> MAL';
        }
      };
      hl._addmal._update();
      _MAL.mal_detail(d.idMal,function(r){
        if (r.ok){
          try{
            var ms=JSON.parse(r.responseText);
            hl._addmal._dat={
              my_list_status:{status:''}
            };
            if (ms.my_list_status){
              hl._addmal._dat=ms;
              hl._addmal._update();
            }
          }catch(e){}
        }
      }, true);


      hl._addal=$n('div','alsd_button alsd_button_right',null,hl._tools,'');
      if (d.mediaListEntry){
        hl._addal._curr=d.mediaListEntry.status;
        hl._addal._mid=d.mediaListEntry.id;
        hl._addal._aid=d.id;
        hl._addal.innerHTML='<c>bookmark</c> <l>AniList</l> '+ucfirst(d.mediaListEntry.status,true);
        hl._addal._myinfo=$n('div','alsd_button alsd_button_full',null,hl._vleft,ucfirst(d.mediaListEntry.status,true));
      }
      else{
        hl._addal._curr='';
        hl._addal._mid=0;
        hl._addal._aid=d.id;
        hl._addal.innerHTML='<c>bookmark_add</c><l>Add to</l> AniList';
        hl._addal._myinfo=$n('div','alsd_button alsd_button_full',null,hl._vleft,"Not on your list");
      }
      if (trailer_avail){
        hl._btn.push(hl._playtrailer);
        hl._ytfpaused=true;
      }
      hl._btn.push(hl._addal);
      hl._btn.push(hl._addmal);

      hl._btn_sel=0;
      hl._btn[hl._btn_sel].classList.add('active');

      hl._title=$n('h4','',{
        jp:d.title.romaji?d.title.romaji:d.title.english
      },hl._content,tspecial(
        d.title.english?d.title.english:d.title.romaji
      ));
      hl._view=$n('div','alsd_infobox',null,hl._content,'');
      home.home_anilist_parse_infobox(d,hl,true);
      hl._desc=$n('p','alsd_desc',null,hl._content,d.description);
      hl._kval=$n('p','alsd_keyval alsd_keyval_def',null,hl._content,'');

      function kv(c,k,v,ac,isleft){
        var z=$n('div','alsd_keyval_item'+(ac?(' '+ac):''),null,isleft?hl._vleft:hl._kval,'');
        $n('label','',null,z,'<c>'+c+'</c>'+k);
        return $n('b','',null,z,v);
      }
      function fuzD(f){
        if (!f) return '-';
        var m='Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Des'.split(',');
        var o='';
        if (f.month){
          o+=m[f.month-1];
        }
        if (f.day){
          o+=' '+f.day;
        }
        if (f.year){
          o+=' '+f.year;
        }
        o=o.trim();
        return o?o:'-';
      }
      
      kv('interests','Genres',nlbr(special(d.genres.join(', '))),'',1);
      kv('calendar_clock','Start Date',fuzD(d.startDate),'',1);
      kv('event_available','End Date',fuzD(d.endDate),'',1);
      kv('menu_book','Source',special(((d.source?d.source:'')+'').replace(/_/g,' ')),'',1);
      kv('captive_portal','Country',special(d.countryOfOrigin?d.countryOfOrigin:'-'),'',1);
      kv('routine','Season',special(d.season?d.season:'-'),'',1);
      kv('calendar_month','Year',special(d.seasonYear?d.seasonYear:'-'),'',1);
      // kv('calendar_today','Year',special(d.seasonYear?d.seasonYear:'-'),'',1);

      var stud='-';
      if (d.studios){
        if (d.studios.edges){
          var stda=[];
          for (var i=0;i<d.studios.edges.length;i++){
            stda.push(d.studios.edges[i].node.name);
          }
          if (stda.length>0){
            stud=stda.join("\n");
          }
        }
      }
      
      

      kv('star','Score',special(d.averageScore?d.averageScore:'-')+" / 100");
      kv('celebration','Popularity',special(d.popularity?d.popularity:'-'));
      kv('favorite','Favorites',special(d.favourites?d.favourites:'-'));
      kv('trending_up','Trend',special(d.trending?d.trending:'-'));

      

      var othername=kv('shoppingmode','Other Name',tspecial(d.title.romaji?d.title.romaji:d.title.english),'fullwidth alsd_clear');
      othername.setAttribute('jp',d.title.english?d.title.english:d.title.romaji);

      kv('package','Synonyms',d.synonyms?nlbr(special(d.synonyms.join('\n'))):"-",'alsd_clear alsd_half');
      kv('source_environment','Studios',nlbr(special(stud)),'alsd_half');
      

      $n('div','alsd_clear',null,hl._kval,'');


      if (d.reviews && d.reviews.edges && d.reviews.edges.length>0){
        hl._revt=$n('h5','',null,hl._content,'Reviews');
        hl._rev=$n('ul','alsd_revs',null,hl._content,'');
        for (var i=0;i<d.reviews.edges.length;i++){
          var rv=d.reviews.edges[i];
          $n('li','',null,hl._rev,'<b>'+special(rv.node.score)+'</b> '+special(rv.node.summary));
        }
      }
      else{
        $n('div','alsd_noavail',null,hl._content,'No review available...');
      }
      
      $n('div','alsd_clear',null,hl._vleft,'');
      $n('div','alsd_clear',null,hl,'');
      _MAL.pop.detail_holder._el=hl;
      _MAL.pop.detail_holder.scrollTop=0;
      _MAL.pop.mv.classList.remove('loading');
      _MAL.pop.mv.classList.add('anilist_detail');

      for (var i=0;i<hl._btn.length;i++){
        hl._btn[i].onclick=_MAL.buttonClickDetail;
      }
    },1,2,false,true);
  },
  pop_detail_youtube_cb:function(vcmd){
    var hl=_MAL.pop.detail_holder._el;
    console.warn(['pop_detail_youtube_cb',vcmd]);
    if (vcmd=='yt-play'){
      if (hl && hl._trailer){
        console.warn("Play YT");
        hl._ytfpaused=true;
        hl._ytferror=false;
        hl._playtrailer.innerHTML='<c>pause</c> Pause <l>Trailer</l>';
      }
    }
    else if (vcmd=='yt-pause' || vcmd=='yt-end'){
      if (hl && hl._trailer){
        console.warn("Pause YT");
        hl._ytfpaused=false;
        hl._ytferror=false;
        hl._playtrailer.innerHTML='<c>play_arrow</c> <l>Play</l> Trailer';
      }
    }
    else if (vcmd=='yt-error'){
      if (hl && hl._trailer){
        console.warn("Error YT");
        hl._ytfpaused=true;
        hl._ytferror=true;
        hl._playtrailer.innerHTML='<c>close</c> Close <l>Trailer</l>';
      }
    }
  },
  pop_detail_youtube_send:function(c){
    var hl=_MAL.pop.detail_holder._el;
    if (hl){
      if (hl._trailer){
        try{
          hl._trailer.contentWindow.postMessage(JSON.stringify({
            vcmd:c,
            val:''
          }),'*');
        }catch(e){
          console.warn('Send YT Msg: '+e);
        }
      }
    }
  },
  pop_detail_keycb:function(c){
    var pp=_MAL.pop.detail_holder;
    var hl=pp._el;
    if (!hl){
      return;
    }

    if (c==KUP || c==KDOWN){
      var ss = (window.outerHeight / 5);
      var st=hl.scrollTop;
      var sh=hl.scrollHeight;
      if (c==KUP){
        st-=ss;
        if (st<0){
          st=0;
        }
      }
      else if (c==KDOWN){
        st+=ss;
        if (st>sh){
          st=sh;
        }
      }
      if (st!=hl.scrollTop){
        var pt=hl.scrollTop;
        hl.scrollTop=st;
        if (pt!=st){
          clk();
        }
      }
    }
    else if (c==KLEFT || c==KRIGHT){
      var pc=hl._btn_sel;
      pc+=(c==KLEFT)?-1:1;
      if (pc<0) pc=hl._btn.length-1;
      else if (pc>hl._btn.length-1) pc=0;
      else clk();
      hl._btn[hl._btn_sel].classList.remove('active');
      hl._btn[pc].classList.add('active');
      hl._btn_sel=pc;
    }
    else if (c==KENTER){
      if (hl._btn[hl._btn_sel]==hl._playtrailer){
        clk();
        if (hl._ytferror){
          hl._ytferror=false;
          if (hl._banner){
            hl._banner.classList.remove('hide');
          }
          hl._content.removeChild(hl._trailer);
          hl._trailer=null;
          hl._playtrailer.innerHTML='<c>play_arrow</c> Play Trailer';
        }
        else{
          hl._initTrailer();
          _MAL.pop_detail_youtube_send('toggle');
        }
      }
      else if (hl._btn[hl._btn_sel]==hl._addal){
        clk();
        if (!_MAL.altoken){
          _API.showToast("Please login to AniList first...");
          return;
        }
        var x=hl._addal._curr;
        var st=[
          'CURRENT',
          'PLANNING',
          'COMPLETED',
          'DROPPED',
          'PAUSED',
          'REPEATING'
        ];
        var sn=[];
        var sl=-1;
        for (var i=0;i<st.length;i++){
          sn.push("Add to "+ucfirst(st[i],1));
          if (st[i]==x){
            sl=i;
          }
        }
        var havedel=false;
        if (st.indexOf(x)>-1){
          sn.push('Remove from '+ucfirst(x,1));
          havedel=true;
        }
        listOrder.showList(
          "AniList",
          sn,
          (sl>-1)?sl:-1,
          function(chval){
            $('popupcontainer').className='active';
            if (chval!=null){
              if (chval==6){
                _API.confirm("Remove from AniList",
                  "Are you sure you want to remove it from AniList?",
                  function(cnf){
                    $('popupcontainer').className='active';
                    if (cnf){
                      _MAL.alset_del(hl._addal._mid, function(v){
                        if (v){
                          hl._addal._curr='';
                          hl._addal.innerHTML='<c>bookmark_add</c><l>Add to</l> AniList';
                          hl._addal._myinfo.innerHTML="Not on your list";
                          home.init_mylist(true);
                          _API.showToast("Deleted from AniList...");
                        }
                        else{
                          _API.showToast("Deleting AniList failed...");
                        }
                      });
                    }
                });
              }
              else{
                var ssel = st[chval];
                _MAL.alset_list(hl._addal._aid, ssel, function(v){
                  if (v){
                    hl._addal._curr=ssel;
                    hl._addal.innerHTML='<c>bookmark</c> <l>AniList</l> '+ucfirst(ssel,1);
                    hl._addal._myinfo.innerHTML=ucfirst(ssel,1);
                    home.init_mylist(true);
                    _API.showToast("Saved to AniList "+ucfirst(ssel,1));
                  }
                  else{
                    _API.showToast("Saving AniList failed...");
                  }
                });
              }
            }
          }
        );
        if (havedel){
          listOrder.group.P.lastElementChild.firstElementChild.classList.remove('radio');
          listOrder.group.P.lastElementChild.firstElementChild.innerHTML='delete_forever';
        }
      }
      else if (hl._btn[hl._btn_sel]==hl._addmal){
        clk();
        if (!_MAL.token){
          _API.showToast("Please login to MAL first...");
          return;
        }
        var st=[
          'watching',
          'completed',
          'on_hold',
          'dropped',
          'plan_to_watch'
        ];
        hl._addmal._update();
        var x=hl._addmal._curr;
        var sn=[];
        var sl=-1;
        for (var i=0;i<st.length;i++){
          sn.push("Add to "+ucfirst(st[i].replace(/_/g,' '),1));
          if (st[i]==x){
            sl=i;
          }
        }
        var havedel=false;
        if (st.indexOf(x)>-1){
          sn.push('Remove from '+ucfirst(x.replace(/_/g,' '),1));
          havedel=true;
        }
        listOrder.showList(
          "MAL",
          sn,
          (sl>-1)?sl:-1,
          function(chval){
            $('popupcontainer').className='active';
            if (chval!=null){
              if (chval==5){
                /* delete */
                _API.confirm("Remove from MAL",
                  "Are you sure you want to remove it from MAL?",
                  function(cnf){
                    $('popupcontainer').className='active';
                    if (cnf){
                      _MAL.set_del(hl._addmal._mid, function(v){
                        if (v){
                          hl._addmal._dat.my_list_status.status='';
                          hl._addmal._update();
                          home.init_mylist(true);
                          _API.showToast("Deleted from MAL...");
                        }
                        else{
                          _API.showToast("Deleting MAL failed...");
                        }
                      });
                    }
                });
              }
              else{
                var ssel = st[chval];
                _MAL.set_list(hl._addmal._mid, ssel, function(v){
                  if (v){
                    hl._addmal._dat.my_list_status.status=ssel;
                    hl._addmal._update();
                    home.init_mylist(true);
                    _API.showToast("Saved to MAL "+ucfirst(ssel.replace(/_/g,' '),1));
                  }
                  else{
                    _API.showToast("Saving MAL failed...");
                  }
                });
              }
            }
          }
        );
        if (havedel){
          listOrder.group.P.lastElementChild.firstElementChild.classList.remove('radio');
          listOrder.group.P.lastElementChild.firstElementChild.innerHTML='delete_forever';
        }
      }
    }
  },
  pop_keycb:function(c){
    if (_MAL.pop.var.ondetail){
      if (c==KBACK){
        clk();
        _MAL.pop.var.ondetail=false;
        _MAL.pop.mv.classList.remove('anilist_detail');
        _MAL.pop.mv.classList.remove('loading');
        _MAL.pop.detail_holder.innerHTML='';
        if (_MAL.pop.var.ondetail_directclose){
          _MAL.pop.mv.classList.remove('active');
          _MAL.popup_close();
        }
      }
      else{
        _MAL.pop_detail_keycb(c);
      }
      return;
    }
    if (!_MAL.pop.var.ready){
      if (c==KBACK){
        clk();
        _MAL.popup_close();
      }
      return;
    }
    var pc=_MAL.pop.menusel;
    if (c==KBACK){
      clk();
      _MAL.pop.detail_holder.innerHTML='';
      _MAL.popup_close();
    }
    else if (c==KENTER){
      clk();
      var openurl=_MAL.pop.var.url;
      var el=_MAL.pop.menu[pc];
      var epsel=1;

      /* Watchlist & History */
      if (el==_MAL.pop.watchlist){
        if (_MAL.pop.var.animeid){
          if (_MAL.pop.var.infav){
            /* Delete from Fav */
            list.fav_del(_MAL.pop.var.animeid);
          }
          else{
            /* Add to fav */
            var obep=1; /*_MAL.pop.var.resume?_MAL.pop.var.resume:1;*/
            var ob={
              'url':openurl,
              'title':_MAL.pop.var.title,
              'title_jp':_MAL.pop.var.title_jp,
              'poster':_MAL.pop.var.img,
              'ep':obep,
              'episode':"EPISODE-"+obep,
              'tip':_MAL.pop.var.ttip
            };
            list.fav_add(_MAL.pop.var.animeid,ob,true);
          }
        }
        _MAL.pop_initlist(openurl);
        if (_MAL.pop.menusel>=_MAL.pop.menu.length){
          _MAL.pop.menusel=_MAL.pop.menu.length-1;
        }
        _MAL.popup_update();
        home.list_init_name(list.fav,home.mylist_el.fav);
        return;
      }
      else if (el==_MAL.pop.detail_button){
        var kw=_MAL.pop.var.title?_MAL.pop.var.title:_MAL.pop.var.title_jp;
        if (_MAL.pop.var.anilistId){
          kw='#'+_MAL.pop.var.anilistId;
        }
        _MAL.pop_opendetail(kw, false);
        return;
      }
      else if (el==_MAL.pop.history){
        if (_MAL.pop.var.animeid){
          /* Delete from History */
          list.history_del(_MAL.pop.var.animeid);
        }
        _MAL.pop_initlist(openurl);
        if (_MAL.pop.menusel>=_MAL.pop.menu.length){
          _MAL.pop.menusel=_MAL.pop.menu.length-1;
        }
        _MAL.popup_update();
        home.list_init_name(list.history,home.mylist_el.history);
        return;
      }

      if (el==_MAL.pop.next){
        epsel=_MAL.pop.var.next;
      }
      else if (el==_MAL.pop.resume){
        epsel=_MAL.pop.var.resume;
      }
      else if (el==_MAL.pop.ep){
        epsel=_MAL.pop.var.ep;
      }

      openurl+=(__SDKAI||__SD3||__SD5||__SD6||__SD7||__SD8)?('#'+epsel):('/ep-'+epsel);

      console.log("MAL Open Anime = "+openurl);
      _MAL.popup_close();
      
      var currtime=null;
      if (toInt(epsel)==_MAL.pop.var.play.e){
        currtime=_MAL.pop.var.play.c;
      }
      pb.open(openurl, _MAL.pop.var.ttip, undefined, currtime);
    }
    else if (c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      if (_MAL.pop.ep==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          if (--_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
          else{
            clk();
          }
        }
        else if (c==KRIGHT){
          if (++_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
          else{
            clk();
          }
        }
        else if (c==KPGUP){
          _MAL.pop.var.ep-=10;
          if (_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
          else{
            clk();
          }
        }
        else if (c==KPGDOWN){
          _MAL.pop.var.ep+=10;
          if (_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
          else{
            clk();
          }
        }
        _MAL.pop.setEp();
        return;
      }
      else if (_MAL.pop.watchlist==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          pc=0;
        }
        else if (c==KRIGHT){
          _MAL.pop_keycb(KDOWN);
          return;
        }
      }
      else if (_MAL.pop.history==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          _MAL.pop_keycb(KUP);
          return;
        }
        else if (c==KRIGHT){
          pc=0;
        }
      }
      else if (_MAL.pop.detail_button==_MAL.pop.menu[pc]){
        if (c==KRIGHT){
          _MAL.pop_keycb(KDOWN);
        }
        else if (c==KLEFT){
          _MAL.pop_keycb(KUP);
        }
        return;
      }
      else{
        if ((c==KRIGHT)||(c==KLEFT)){
          pc=0;
        }
      }
    }
    else if (c==KUP){
      if (--pc<0){
        pc=_MAL.pop.menu.length-1;
      }
    }
    else if (c==KDOWN){
      if (++pc>=_MAL.pop.menu.length){
        pc=0;
      }
    }
    if (_MAL.pop.menusel!=pc){
      clk();
      _MAL.pop.menusel=pc;
      _MAL.popup_update();
    }
  },
  popup_close:function(){
    _MAL.pop.mv.className='loading';
    $('popupcontainer').className='';
    _MAL.pop.var.ondetail=false;
    _MAL.pop.var.ready=false;
    _MAL.onpopup=false;
  },
  popup_update:function(){
    for (var i=0;i<_MAL.pop.menu.length;i++){
      if (i==_MAL.pop.menusel)
        _MAL.pop.menu[i].classList.add('active');
      else
        _MAL.pop.menu[i].classList.remove('active');
    }
  },
  pop_initlist:function(url){
    /* Remove watchlist&history from menu */
    
    while (_MAL.pop.menu.length>0){
      var elast=_MAL.pop.menu[_MAL.pop.menu.length-1];
      if (elast==_MAL.pop.watchlist||elast==_MAL.pop.history){
        _MAL.pop.menu.pop();
      }
      else{
        break;
      }
    }

    _MAL.pop.var.animeid='';
    var animeid=_API.animeId(url);
    console.log("pop_initlist : "+url+" / "+animeid);
    if (animeid){
      _MAL.pop.var.animeid=animeid;
      var fav=list.fav;
      var hist=list.history;
      _MAL.pop.watchlist.className='';
      if (animeid in fav.detail){
        _MAL.pop.watchlist.firstElementChild.innerHTML='close';
        _MAL.pop.var.infav=true;
      }
      else{
        _MAL.pop.watchlist.className='add';
        _MAL.pop.watchlist.firstElementChild.innerHTML='bookmark_add';
        _MAL.pop.var.infav=false;
      }
      _MAL.pop.menu.push(_MAL.pop.watchlist);

      if (animeid in hist.detail){
        _MAL.pop.history.className='';
        _MAL.pop.menu.push(_MAL.pop.history);
      }
      else{
        _MAL.pop.history.className='disable';
      }
      return;
    }
    _MAL.pop.watchlist.className=
    _MAL.pop.history.className='disable';
    _MAL.pop.watchlist.firstElementChild.innerHTML='add';
  },
  popuprating:function(v){
    if (v=='R+'){
      _MAL.pop.rating.innerHTML=_API.rplustxt;
      _MAL.pop.rating.className='adult';
    }
    else{
      _MAL.pop.rating.className='';
      _MAL.pop.rating.innerHTML=v;
    }
  },
  preview_detail:function(d){
    $('malview_synopsys').innerHTML=d.synopsis?special(d.synopsis):"&nbsp;"
    
    var vd='';
    var vt='';
    if (d.duration){
      vd=special(d.duration);
      vt="Duration:";
    }
    else if (d.type){
      vd=special(d.type);
      vt="Type:";
    }
    $('malview_info_duration_t').innerHTML=vt;
    $('malview_info_duration').innerHTML=vd;

    $('malview_info_status').innerHTML=d.status?special(d.status):"-";
    $('malview_info_genre').innerHTML=d.genre?special(d.genre):"-";
  },
  preview_do:function(url, img, ttid, currep, tcurr, tdur,d,arg,malid){
    home.anilist_yt.cleanup();
    if (!_MAL.onpopup){
      return;
    }
    if (!ratingSystem.checkRating(d.rating)){
      _MAL.popup_close();
      ratingSystem.blockMessage();
      return;
    }

    if (d.anilistId){
      _MAL.pop.var.anilistId=d.anilistId;
    }
    else{
      _MAL.pop.var.anilistId=null;
    }

    console.log("Popup Preview Do: AnilistId = "+_MAL.pop.var.anilistId);

    // console.log("PreviewDo = "+JSON.stringify([url, img, ttid, currep, tcurr, tdur,d,arg,malid]));
    try{
      var numep=toInt(d.ep);
      currep=toInt(currep);
      if (currep>numep){
        currep=numep;
      }

      _MAL.pop.title.innerHTML=tspecial(d.title);
      _MAL.pop.title.setAttribute('jp',d.title_jp?d.title_jp:d.title);

      _MAL.pop.img.src=$img(img);
      _MAL.pop.menu=[
        _MAL.pop.detail_button,
        _MAL.pop.begin
      ];
      _MAL.pop.var.url=url;
      _MAL.pop.var.ttip=ttid;
      _MAL.pop.var.malid=malid?malid:null;
      _MAL.pop.menusel=1;

      _MAL.pop.var.title=d.title;
      _MAL.pop.var.title_jp=d.title_jp;
      _MAL.pop.var.img=img;

      _MAL.pop.var.play.c=tcurr;
      _MAL.pop.var.play.d=tdur;
      _MAL.pop.var.play.e=currep;

      // headimg
      // $('malview_info').style.backgroundImage=((d&&d.logoimg)?('url('+d.logoimg+')'):'');

      _MAL.preview_detail(d);

      _MAL.popuprating(d.rating);

      _MAL.pop.progh.className='';
      if (tcurr>0 && tdur>0){
        _MAL.pop.progh.className='active';
        var pct=(parseFloat(tcurr)/parseFloat(tdur))*100.0;
        _MAL.pop.prog.style.width=pct+"%";
      }

      _MAL.pop.var.resume=0;
      _MAL.pop.var.next=0;

      if (currep>0){
        _MAL.pop.menu.push(_MAL.pop.resume);
        if (numep>currep){
          _MAL.pop.menu.push(_MAL.pop.next);
          _MAL.pop.next_ep.innerHTML='EP-'+(currep+1);
          _MAL.pop.next.className='';
          _MAL.pop.var.next=currep+1;
        }
        else{
          _MAL.pop.next_ep.innerHTML='';
          _MAL.pop.next.className='disable';
        }
        _MAL.pop.resume_ep.innerHTML='EP-'+(currep);
        _MAL.pop.resume.className='';
        _MAL.pop.var.resume=currep;
        _MAL.pop.menusel=2;
      }
      else{
        _MAL.pop.next_ep.innerHTML=
        _MAL.pop.resume_ep.innerHTML='';
        _MAL.pop.next.className=
        _MAL.pop.resume.className='disable';
      }

      if (arg=="ep"){
        _MAL.pop.resume_text.innerHTML='Play Episode';
      }
      else{
        _MAL.pop.resume_text.innerHTML='Resume';
      }

      _MAL.pop.var.num=numep;
      _MAL.pop.var.ep=(currep>0)?currep:1;
      _MAL.pop.setEp();
      if (_MAL.pop.var.num>0){
        _MAL.pop.menu.push(_MAL.pop.ep);
      }
      _MAL.popup_update();
      _MAL.pop.mv.className='active';
      $('popupcontainer').className='active';

      _MAL.pop_initlist(url);

      _MAL.pop.var.ready=true;
      _MAL.pop.var.ondetail=false;

      _MAL.buttonRegister();

    }catch(e){
      console.log(e);
      console.log("PDO = "+e);
    }
  },
  buttonClickDetail:function(ev){
    var pp=_MAL.pop.detail_holder;
    var hl=pp._el;
    if (hl){
      var pc=hl._btn.indexOf(this);
      if (pc>-1){
        hl._btn[hl._btn_sel].classList.remove('active');
        hl._btn[pc].classList.add('active');
        hl._btn_sel=pc;
        _MAL.pop_detail_keycb(KENTER);
      }
    }
  },
  buttonClick:function(ev){
    var pc=_MAL.pop.menu.indexOf(this);
    if (pc>-1){
      _MAL.pop.menusel=pc;
      _MAL.popup_update();
      if (this==_MAL.pop.ep){
        if (ev.target.tagName=='C'){
          var iscontext=(ev.type!='click');
          if (ev.target.classList.contains("right")){
            _MAL.pop_keycb(iscontext?KPGDOWN:KRIGHT);
          }
          else{
            _MAL.pop_keycb(iscontext?KPGUP:KLEFT);
          }
          return;
        }
      }
      _MAL.pop_keycb(KENTER);
    }
    return false;
  },
  buttonRegister:function(){
    for (var i=0;i<_MAL.pop.menu.length;i++){
      _MAL.pop.menu[i].onclick=_MAL.buttonClick;
      if (_MAL.pop.menu[i]==_MAL.pop.ep){
        _MAL.pop.menu[i].oncontextmenu=_MAL.buttonClick;
      }
    }
  },

  preview:function(url, img, titl, ttid, ep, tcurr, tdur,arg,malid){
    // var url_parse=url.split('/');
    var defdat={
      title:titl,
      title_jp:titl,
      ep:0,
      rating:''
    };
    console.log("Popup = "+JSON.stringify([url, img, titl, ttid, ep, tcurr, tdur,arg,malid]));
    // if ((url_parse.length>=5)||__SD3||__SD5||__SD6||__SD7||__SD8||__SDKAI){
      // if((url_parse.length==6)&&(!__SDKAI)&&(!__SD3)&&(!__SD5)&&(!__SD6)&&(!__SD7)&&(!__SD8)){
      //   url_parse.pop();
      //   url=url_parse.join('/');
      // }
      _MAL.pop.mv.className='active loading';
      $('popupcontainer').className='active';
      _MAL.pop.var.ready=false;
      _MAL.onpopup=true;
      _API.getTooltip(ttid,function(d){
        if (d){
          console.log(d);
          if (!ttid){
            console.log("New TTID = "+d.ttid);
            ttid=d.ttid;
          }
          if (d.poster){
            img=d.poster;
          }
          if (d.url){
            url=d.url;
          }
          _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,d,arg,malid);
          return;
        }
        _MAL.preview_do(url, img, ttid, ep, tcurr, tdur, defdat,arg,malid);
        return;
      },url);
    //   return;
    // }
    // pb.open(url, ttid, 0, tcurr);
    // try{
    //   _MAL.pop.mv.className='active';
    //     $('popupcontainer').className='active';
    //   _MAL.onpopup=true;
    //   _MAL.pop.var.ready=false;
    //   console.log("PREV DMP = "+JSON.stringify([url, img, ttid, ep, tcurr, tdur,defdat,arg,malid]));
    //   _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,defdat,arg,malid);
    // }catch(e){
    //   console.log("PREV ERR = "+err);
    // }
  },
  prev_action_handler:function(data,arg){
    try{
      var j=JSON.parse(data);
      _MAL.preview(j.url, j.img, j.title, j.ttip, j.ep, j.sp, j.tp,arg);
    }catch(e){
    }
  },
};

const listOrder={
  store:{
    name:function(name){
      return _API.user_prefix+"_listorder_"+name;
    },
    load:function(name,isglobal){
      var itm="";
      if (isglobal){
        itm=_JSAPI.storeGet(listOrder.store.name(name),"")
      }
      else{
        itm=localStorage.getItem(listOrder.store.name(name));
      }
      if (itm){
        try{
          var j=JSON.parse(itm);
          return j;
        }catch(e){}
      }
      return null;
    },
    save:function(name,val,isglobal){
      if (isglobal){
        _JSAPI.storeSet(listOrder.store.name(name),JSON.stringify(val));
      }
      else{
        localStorage.setItem(listOrder.store.name(name),JSON.stringify(val));
      }
    }
  },
  onpopup:false,
  popuptype:0,
  holder:$('listorder'),
  win:$('listorder_window'),
  group:null,
  cb:null,
  changed:false,
  title_el:null,
  list_sel:-1,
  regclick:function(){
    listOrder.holder.onclick=function(e){
      var el=e.target;
      if (el==this){
        window._KEYEV(KBACK,1);
        return;
      }
      if (listOrder.popuptype==6){
        return;
      }
      if (listOrder.popuptype==5){
        listOrder.group.focus();
        return;
      }
      while(el){
        if (el.parentElement==this){
          el=null;
          break;
        }
        if (listOrder.popuptype==1){
          if (el.parentElement==listOrder.group){
            break;
          }
        }
        else if (el.parentElement==listOrder.group.P){
          break;
        }
        el=el.parentElement;
      }
      if (el){
        try{
          if (listOrder.popuptype==1){
            if (listOrder.imgSel>-1){
              listOrder.imglist[listOrder.imgSel].classList.remove('active');
            }
            var pc=listOrder.imglist.indexOf(el);
            if (pc>-1){
              listOrder.imglist[pc].classList.add('active');
              listOrder.imgSel=pc;
              listOrder.changed=true;
              listOrder.close();
            }
          }
          else{
            if (listOrder.group._sel!=el){
              if (listOrder.group._sel){
                listOrder.group._sel.classList.remove('active');
              }
              listOrder.group._sel=el;
              el.classList.add('active');
            }
            listOrder.keycb(KENTER);
          }
        }catch(e){}
      }
    };
    if (listOrder.popuptype==0){
      var dr=listOrder.group.P.querySelectorAll("c[drag]");
      for (var i=0;i<dr.length;i++){
        touchHelper.gestureReg(dr[i], function(r){
          if (r==KDOWN || r==KUP){
            var el=this.parentElement;
            if (el){
              if (listOrder.group._sel){
                listOrder.group._sel.classList.remove('active');
              }
              listOrder.group._sel=el;
              el.classList.add('active');
              listOrder.keycb(r==KUP?KRIGHT:KLEFT);
            }
          }
        }, dr[i].parentElement.offsetHeight, 'active');
      }
    }
  },
  show:function(winTitle,list,cb){
    listOrder.popuptype=0;
    listOrder.list_sel=-1;
    listOrder.cb=cb;
    listOrder.win.className='';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.changed=false;
    listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(winTitle));
    listOrder.group=$n('div','settings_group active',null,listOrder.win,'');
    $n('div','listorder_tips',null,listOrder.win,'Use left/right to move order');
    
    listOrder.group.P=$n('p','',null,listOrder.group,'');
    for (var i=0;i<list.length;i++){
      var li=list[i];
      var tx =
        '<c class="check'+(li.active?' checked':'')+'">check</c>'+
        '<c drag="'+i+'">drag_indicator</c> '+
        special(li.title);
      var el=$n('div',(i==0?'active':''),null,listOrder.group.P,tx);
      el._data={
        id:li.id,
        active:li.active,
        title:li.title,
        disabling:li.disabling
      };
    }
    listOrder.group._sel = listOrder.group.P.firstElementChild;
    listOrder.group._sel.classList.add('active');
    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.autoScroll(listOrder.group,listOrder.group._sel);
    listOrder.regclick();
  },
  multilist:[],
  showMulti:function(winTitle,list,sel,cb,icons,rev){
    listOrder.popuptype=3;
    listOrder.list_sel=-1;
    listOrder.multilist=[];
    listOrder.cb=cb;
    listOrder.win.className='';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.changed=false;
    if (winTitle!==undefined){
      listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(winTitle));
    }
    listOrder.group=$n('div','settings_group active',null,listOrder.win,'');
    listOrder.group.P=$n('p','',null,listOrder.group,'');
    for (var i=0;i<list.length;i++){
      var li=list[i];
      var active=sel[i]?true:false;
      if (rev){
        active=active?false:true;
      }
      var tx =
        '<c class="check'+(active?' checked':'')+'">check</c>'+
        '<c>'+((icons&&icons[i])?icons[i]:'arrow_right')+'</c> '+
        special(li);
      var el=$n('div',(i==0?'active':''),null,listOrder.group.P,tx);
      el._id=i;
      el._active=active;
      listOrder.multilist.push(sel[i]?true:false);
    }
    listOrder.group._sel = listOrder.group.P.firstElementChild;
    listOrder.group._sel.classList.add('active');
    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.autoScroll(listOrder.group,listOrder.group._sel);
    listOrder.regclick();
  },
  inputKeyCb:function(c){
    if (c==KBACK){
      clk();
      listOrder.currInputValue=null;
      listOrder.close();
      return true;
    }
    else if (c==KENTER){
      clk();
      listOrder.currInputValue=listOrder.group.value;
      listOrder.close();
      return true;
    }
    else if (c==KLEFT||c==KRIGHT){
      var p=listOrder.group.selectionStart;
      p+=(c==KLEFT)?-1:1;
      if (p>=0 && p<=listOrder.group.value.length){
        listOrder.group.selectionEnd=listOrder.group.selectionStart=p;
      }
      listOrder.group.focus();
      return true;
    }
    return false;
  },
  currInputValue:null,
  showInput:function(title,message,ispin,maxlen,dv,cb,nohtml){
    listOrder.popuptype=5;
    listOrder.cb=cb;
    listOrder.win.className='inputdialog';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.currInputValue=dv?dv:null;
    listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(title));
    listOrder.title_el._msg=$n('div','listorder_message',null,listOrder.win,nohtml?special(message):message);
    var inp=$n('input','listorder_input',{
        type:ispin?'password':'text',
        maxlength:maxlen?maxlen:10,
        value:dv?dv:'',
        spellcheck:"false",
        autocomplete:"off"
      },listOrder.win,''
    );
    listOrder.group=inp;

    if (ispin){
      inp.oninput=function(){
        var cv=this.value;
        var rv=cv.replace(/\D/g,'');
        if (rv!=cv){
          this.value=rv;
        }
      };
    }

    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.regclick();
    setTimeout(function(){
      inp.focus();
      var l=inp.value.length;
      inp.selectionStart = l;
      inp.selectionEnd = l;
    },10);
  },
  confirmKeyCb:function(c){
    if (c==KBACK){
      clk();
      listOrder.changed=false;
      listOrder.close();
      return true;
    }
    else if (c==KENTER){
      clk();
      listOrder.close();
      return true;
    }
    else if (c==KLEFT||c==KRIGHT){
      if (listOrder.title_el._btnno){
        clk();
        if (listOrder.title_el._btnno.classList.contains('active')){
          listOrder.title_el._btnyes.classList.add('active');
          listOrder.title_el._btnno.classList.remove('active');
          listOrder.changed=true;
        }
        else{
          listOrder.title_el._btnyes.classList.remove('active');
          listOrder.title_el._btnno.classList.add('active');
          listOrder.changed=false;
        }
      }
      return true;
    }
    return false;
  },
  showConfirm:function(title,message,cb,isalert,nohtml){
    listOrder.popuptype=6;
    listOrder.cb=cb;
    listOrder.win.className='inputdialog';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.changed=true;
    var msg_class='listorder_message';
    if (title){
      listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(title));
    }
    else{
      listOrder.title_el={};
      msg_class+=' list_center';
    }
    listOrder.title_el._msg=$n('div',msg_class,null,listOrder.win,nohtml?special(message):message);
    listOrder.group=$n('div','listorder_dialog_holder',null,listOrder.win,'');
    if (isalert){
      listOrder.title_el._btnyes=$n('div','listorder_dialog_button active',
        null,listOrder.group,"OK"
      );
      listOrder.title_el._btnno=null;
    }
    else{
      listOrder.title_el._btnyes=$n('div','listorder_dialog_button active',
        null,listOrder.group,"YES"
      );
      listOrder.title_el._btnno=$n('div','listorder_dialog_button',
        null,listOrder.group,"NO"
      );
      listOrder.title_el._btnno.onclick=function(){
        listOrder.changed=false;
        clk();
        listOrder.close();
        return true;
      };
    }
    listOrder.title_el._btnyes.onclick=function(){
      listOrder.changed=true;
      clk();
      listOrder.close();
      return true;
    };
    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.regclick();
  },
  showList:function(winTitle,list,sel,cb,ishtml,deficon,forcesel){
    listOrder.list_sel=sel;
    if (sel===undefined || forcesel){
      listOrder.list_sel=-1;
    }
    listOrder.popuptype=2;
    listOrder.cb=cb;
    listOrder.win.className='';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.changed=false;
    if (winTitle!==undefined){
      listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(winTitle));
    }
    listOrder.group=$n('div','settings_group active',null,listOrder.win,'');
    listOrder.group.P=$n('p','',null,listOrder.group,'');
    for (var i=0;i<list.length;i++){
      var li=list[i];
      var tx = '';
      var active=false;
      if (sel==undefined){
        active=(i==0);
        tx='<c>'+(deficon?deficon:'arrow_right')+'</c>';
      }
      else{
        active=(i==sel)?true:false;
        tx='<c class="radio'+(active?' active':'')+'">'+
          (active?'radio_button_checked':'radio_button_unchecked')+
          '</c>';
      }
      if (ishtml){
        tx+=li;
      }
      else{
        tx+=special(li);
      }
      var el=$n('div',(active?'active':''),null,listOrder.group.P,tx);
      el._id=i;
      if (active){
        listOrder.group._sel=el;
      }
    }
    if (!listOrder.group._sel){
      listOrder.group._sel=listOrder.group.P.firstElementChild;
      listOrder.group._sel.classList.add('active');
    }
    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.autoScroll(listOrder.group,listOrder.group._sel);
    listOrder.regclick();
  },
  showMenu:function(winTitle,list,sel,cb){
    listOrder.list_sel=-1;
    listOrder.popuptype=2;
    listOrder.cb=cb;
    listOrder.win.className='';
    listOrder.onpopup=true;
    listOrder.win.innerHTML='';
    listOrder.changed=false;
    if (winTitle!==undefined){
      listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(winTitle));
    }
    listOrder.group=$n('div','settings_group active',null,listOrder.win,'');
    listOrder.group.P=$n('p','',null,listOrder.group,'');
    for (var i=0;i<list.length;i++){
      var li=list[i];
      var tx = '<c>'+(li.icon?li.icon:'arrow_right')+'</c> '+li.title;
      if (li.image){
        tx = '<img src="'+li.image+'" class="listimg" /> '+li.title;
      }
      var el=$n('div',(i==sel?'active':''),null,listOrder.group.P,tx);
      el._id=i;
      if (i==sel){
        listOrder.group._sel=el;
      }
    }
    if (!listOrder.group._sel){
      listOrder.group._sel=listOrder.group.P.firstElementChild;
      listOrder.group._sel.classList.add('active');
    }
    $('popupcontainer').className='active onpopup';
    listOrder.holder.classList.add('active');
    listOrder.autoScroll(listOrder.group,listOrder.group._sel);
    listOrder.regclick();
  },
  imglist:[],
  imgSel:-1,
  imgFetchCb:null,
  imgFetchPage:1,
  imgHasNextPage:true,
  imgOnLoad:false,
  imgKeyCb:function(k){
    if (k==KBACK){
      clk();
      listOrder.changed=false;
      listOrder.close();
      return true;
    }
    /* Not Ready */
    if (listOrder.imgSel<0){
      return false;
    }

    var pc = listOrder.imgSel;
    if (k==KLEFT){
      if (pc%4>0)
          pc--;
      if (pc<0) pc=0;
    }
    else if (k==KRIGHT){
      if (pc%4<3)
          pc++;
      if (pc>=listOrder.imglist.length){
        pc=listOrder.imglist.length-1;
      }
    }
    else if (k==KUP){
      if (pc-4>=0){
        pc-=4;
      }
    }
    else if (k==KDOWN){
      if (pc+4<listOrder.imglist.length){
        pc+=4;
      }
      else{
        pc=listOrder.imglist.length-1;
      }
    }
    else if (k==KENTER){
      clk();
      listOrder.changed=true;
      listOrder.close();
      return true;
    }
    
    if (pc!=listOrder.imgSel){
      clk();
      listOrder.imgSelUpdate(pc);
      return true;
    }
    return false;
  },
  autoScroll:function(par, sel){
    // scroll
    var ot=sel.offsetTop;
    var oh=sel.offsetHeight;
    var ob=ot+oh;
    var st=par.scrollTop;
    var sh=par.offsetHeight;
    var sb=st+sh;
    if (ot<st){
      par.scrollTop=ot;
    }
    else if (ob>sb){
      par.scrollTop=ob-sh;
    }
  },
  imgSelUpdate:function(pc){
    if (pc!=listOrder.imgSel){
      if (listOrder.imgSel>-1){
        listOrder.imglist[listOrder.imgSel].classList.remove('active');
      }
      listOrder.imglist[pc].classList.add('active');
      listOrder.imgSel=pc;
      listOrder.autoScroll(listOrder.group,listOrder.imglist[pc]);
    }
  },
  imgLoadNext:function(){
    if (!listOrder.imgOnLoad && listOrder.imgHasNextPage){
      listOrder.imgOnLoad=true;
      listOrder.group.classList.add('loading');
      if (listOrder.imgFetchCb){
        if (listOrder.imgFetchCb(listOrder.imgFetchPage,function(d){
          listOrder.imgOnLoad=false;
          listOrder.group.classList.remove('loading');
          if (d){
            if (d.data){
              var l=d.data;
              var got_active=-1;
              for (var i=0;i<l.length;i++){
                var dt=l[i];
                var hl=$n('div','imgpicker_item',null,listOrder.group,'');
                hl._data=JSON.parse(JSON.stringify(dt));
                if (dt.src){
                  hl._img=$n('img','',{src:dt.src,title:dt.title,loading:'lazy'},hl,'');
                }
                else{
                  hl._img=$n('c','',null,hl,'block');
                }
                if (dt.active){
                  got_active=listOrder.imglist.length;
                  hl.classList.add('checked');
                }
                hl._title=$n('b','',null,hl,special(dt.title));
                listOrder.imglist.push(hl);
              }
              if (got_active>-1){
                listOrder.imgSel=-1;
                listOrder.imgSelUpdate(got_active);
              }
              if (listOrder.imgSel==-1){
                listOrder.imgSelUpdate(0);
              }
            }
            listOrder.imgHasNextPage=d.havenext?true:false;
            return;
          }
          listOrder.imgOnLoad=false;
          listOrder.group.classList.remove('loading');
          listOrder.imgHasNextPage=false;
        })){
          return true;
        }
      }
      listOrder.imgOnLoad=false;
      listOrder.group.classList.remove('loading');
      listOrder.imgHasNextPage=false;
    }
  },
  showImgPicker:function(winTitle, list, cb){
    listOrder.popuptype=1;
    listOrder.cb=cb;
    listOrder.onpopup=true;
    listOrder.win.className='imgpicker';
    listOrder.win.innerHTML='';
    listOrder.imgFetchCb=list;
    listOrder.imglist=[];
    listOrder.imgFetchPage=1;
    listOrder.imgHasNextPage=true;
    listOrder.imgOnLoad=false;
    listOrder.changed=false;
    listOrder.title_el=$n('div','listorder_title',null,listOrder.win,special(winTitle));
    listOrder.group=$n('div','imgpicker_group',null,listOrder.win,'');
    $('popupcontainer').className='active';
    listOrder.holder.classList.add('active');
    listOrder.imgLoadNext();
    listOrder.regclick();
  },
  close:function(){
    var rcb=listOrder.cb;
    listOrder.holder.onclick=null;
    var tmpcb=function(v){
      requestAnimationFrame(function(){
        rcb(v);
        rcb=null;
      });
    };
    var ptype=listOrder.popuptype;

    $('popupcontainer').className='';
    listOrder.holder.classList.remove('active');
    // listOrder.win.innerHTML='';
    listOrder.onpopup=false;
    listOrder.popuptype=0;
    setTimeout(function(){
      if (!listOrder.onpopup){
        if (listOrder.win.innerHTML){
          listOrder.win.innerHTML='';
        }
      }
    },300);
    
    if (tmpcb){
      if (ptype==6){
        tmpcb(listOrder.changed);
        listOrder.changed=false;
      }
      else if (ptype==5){
        if (listOrder.currInputValue!=null){
          tmpcb({
            value:listOrder.currInputValue
          });
        }
        else{
          tmpcb(null);
        }
        listOrder.currInputValue=null;
      }
      else if (ptype==2){
        if (listOrder.group._sel && (listOrder.list_sel!=listOrder.group._sel._id)){
          tmpcb(listOrder.group._sel._id);
        }
        else{
          tmpcb(null);
        }
      }
      else if (ptype==3){
        if (listOrder.changed){
          tmpcb(JSON.parse(JSON.stringify(listOrder.multilist)));
        }
        else{
          tmpcb(null);
        }
      }
      else if (ptype==1){
        /* imagepicker */
        if (listOrder.changed){
          if (listOrder.imgSel>-1){
            tmpcb(
              listOrder.imglist[listOrder.imgSel]._data
            );
          }
        }
        else{
          tmpcb(null);
        }
        listOrder.imglist=[];
      }
      else{
        if (listOrder.changed){
          var data=[];
          for (var i=0;i<listOrder.group.P.childElementCount;i++){
            var c=listOrder.group.P.children[i];
            data.push(
              {
                id:c._data.id,
                active:c._data.active,
                title:c._data.title
              }
            );
          }
          tmpcb(data);
        }
        else{
          tmpcb(null);
        }
      }
    }
    tmpcb=null;
  },
  keycb:function(c){
    if (listOrder.popuptype==1){
      return listOrder.imgKeyCb(c);
    }
    else if (listOrder.popuptype==5){
      return listOrder.inputKeyCb(c);
    }
    else if (listOrder.popuptype==6){
      return listOrder.confirmKeyCb(c);
    }
    if (c==KBACK){
      clk();
      if (listOrder.popuptype==2){
        listOrder.group._sel=null;
      }
      listOrder.close();
      return true;
    }
    if (c==KUP||c==KDOWN){
      var next = null;
      if (c==KDOWN){
        next = listOrder.group._sel.nextElementSibling;
      }
      else if (c==KUP){
        next = listOrder.group._sel.previousElementSibling;
      }
      if (next){
        clk();
        listOrder.group._sel.classList.remove('active');
        listOrder.group._sel=next;
        next.classList.add('active');
        listOrder.autoScroll(listOrder.group,listOrder.group._sel);
      }
      return true;
    }
    else if (c==KENTER){
      clk();
      if (listOrder.popuptype==2){
        listOrder.close();
        return true;
      }
      else if (listOrder.popuptype==3){
        listOrder.group._sel._active=!listOrder.group._sel._active;
        listOrder.group._sel.firstElementChild.classList[listOrder.group._sel._active?'add':'remove']('checked');
        listOrder.multilist[listOrder.group._sel._id]=!listOrder.multilist[listOrder.group._sel._id];
        listOrder.changed=true;
        return true;  
      }

      listOrder.group._sel._data.active=!listOrder.group._sel._data.active;
      if (listOrder.group._sel._data.active){
        listOrder.group._sel.firstElementChild.classList.add('checked');
        if (listOrder.group._sel._data.disabling){
          var dsb=listOrder.group._sel._data.disabling;
          for (var j=0;j<dsb.length;j++){
            for (var i=0;i<listOrder.group.P.childElementCount;i++){
              var c=listOrder.group.P.children[i];
              if (c._data.id==dsb[j]){
                c._data.active=false;
                c.firstElementChild.classList.remove('checked');
              }
            }
          }
        }
      }
      else{
        listOrder.group._sel.firstElementChild.classList.remove('checked');
      }
      listOrder.changed=true;
      return true;
    }
    else if (c==KLEFT||c==KRIGHT){
      if ((listOrder.popuptype==2)||(listOrder.popuptype==3)) {
        var next = null;
        if (c==KRIGHT){
          next=listOrder.group._sel.nextElementSibling;
          if (next){
            for (var i=0;i<4;i++){
              if (!next.nextElementSibling){
                break;
              }
              else{
                next=next.nextElementSibling;
              }
            }
          }
        }
        else if (c==KLEFT){
          next = listOrder.group._sel.previousElementSibling;
          if (next){
            for (var i=0;i<4;i++){
              if (!next.previousElementSibling){
                break;
              }
              else{
                next=next.previousElementSibling;
              }
            }
          }
        }
        if (next){
          clk();
          listOrder.group._sel.classList.remove('active');
          listOrder.group._sel=next;
          next.classList.add('active');
          listOrder.autoScroll(listOrder.group,listOrder.group._sel);
        }
        return true;
      }

      var before=null;
      if (c==KLEFT){
        before=listOrder.group._sel.previousElementSibling;
      }
      else{
        before=listOrder.group._sel.nextElementSibling;
      }
      if (!before){
        return;
      }
      clk();
      if (c==KRIGHT){
        before=before.nextElementSibling;
      }
      listOrder.group.P.removeChild(listOrder.group._sel);
      if (before){
        listOrder.group.P.insertBefore(listOrder.group._sel,before);
      }
      else{
        listOrder.group.P.appendChild(listOrder.group._sel);
      }
      listOrder.changed=true;
      listOrder.autoScroll(listOrder.group,listOrder.group._sel);
      return true;
    }
    return false;
  }
};

(function(){
  if (_USE_TOUCH){
    if (_JSAPI.getHaveTouchscreen()){
      _TOUCH=true;
      body.classList.add('istouch');
    }
    else{
      function regtouch_global(){
        _TOUCH=true;
        body.classList.add('istouch');
        document.removeEventListener("touchstart", regtouch_global, false);
        return true;
      }
      document.addEventListener('touchstart', regtouch_global, false);
    }
    return;
  }

  var xDown = null;
  var yDown = null;
  var tIsMove=false;
  function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }
  function handleTouchStart(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      tIsMove=false;
  }
  function handleTouchMove(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
      if ( ! xDown || ! yDown ) {
          return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      var minMove=window.outerWidth*0.07;
      var minCancel=window.outerWidth*0.02;
      if ( Math.abs( xDiff ) < Math.abs( yDiff ) ) {
        if (Math.abs( yDiff )>minMove){
          if ( yDiff > 0 ) {
            /* down swipe */
            window._KEYEV(KDOWN,1);
          } else {
            /* up swipe */
            window._KEYEV(KUP,1);
          }
          /* Update Values */
          xDown = xUp;
          yDown = yUp;
        }
        if (!tIsMove&&Math.abs( yDiff )>minCancel){
          tIsMove=true;
        }
      }
      else{
        if (Math.abs( xDiff )>minMove){
          if ( xDiff > 0 ) {
            window._KEYEV(KRIGHT,1);
          } else {
            window._KEYEV(KLEFT,1);
          }
          /* Update Values */
          xDown = xUp;
          yDown = yUp;
        }
      }
      if (!tIsMove){
        if (Math.abs(xDiff)+Math.abs(yDiff)>minCancel){
          tIsMove=true;
        }
      }
  }
  function handleTouchEnd(evt){
    evt.preventDefault();
    evt.stopImmediatePropagation();
    if (!tIsMove){
      window._KEYEV(KENTER,1);
    }
    tIsMove=false;
  }
  document.addEventListener('touchstart', handleTouchStart, true);
  document.addEventListener('touchmove', handleTouchMove, true);
  document.addEventListener('touchend', handleTouchEnd, true);
})();


const touchHelper={
  getTouch:function(evt) {
    if (evt.touches){
      return evt.touches[0];
    }
    return {clientX:evt.clientX,clientY:evt.clientY};
  },
  tend:function(evt){
    if (!this._tIsMove){
      if (this._cb){
        this._cb(KENTER, evt);
      }
    }
    const endT = touchHelper.getTouch(evt);
    this._tIsMove=false;
    this._tIsDown=false;
    this._lockDirection=0;
    if (this._activeclass){
      this.classList.remove(this._activeclass);
    }
    if (this._endcb){
      try{
        this._endcb(evt,this);
      }catch(e){}
    }
    if (!this._nocancel){
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  },
  start:function(evt) {
    const firstTouch = touchHelper.getTouch(evt);
    this._minmove=this._minmove_main;
    this.__ev_target=evt.target;
    this._xDown = this.__ev_x = firstTouch.clientX;
    this._yDown = this.__ev_y = firstTouch.clientY;
    this._tIsMove=false;
    this._tIsDown=true;
    this._lockDirection=0;
    if (this._activeclass){
      this.classList.add(this._activeclass);
    }
    if (!this._nocancel){
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  },
  move:function(evt) {
    if (!this._tIsDown){
      return;
    }
    if ( ! this._xDown || ! this._yDown ) {
        return;
    }
    if (!this._nocancel){
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
    const moveT = touchHelper.getTouch(evt);
    var xUp = moveT.clientX;
    var yUp = moveT.clientY;
    var xDiff = this._xDown - xUp;
    var yDiff = this._yDown - yUp;
    var minCancel=window.outerWidth*0.02;
    if (this._movecb){
      try{
        this._movecb(evt,this,moveT);
      }catch(e){}
    }
    if ((this._lockDirection!=1) && (Math.abs( xDiff ) < Math.abs( yDiff ))) {
      if (Math.abs( yDiff )>this._minmove){
        if ( yDiff > 0 ) {
          /* down swipe */
          if (this._cb){
            this._cb(KDOWN, evt);
          }
        } else {
          /* up swipe */
          if (this._cb){
            this._cb(KUP, evt);
          }
        }
        this._lockDirection=2;
        /* Update Values */
        this._xDown = xUp;
        this._yDown = yUp;
      }
      if (!this._tIsMove&&Math.abs( yDiff )>minCancel){
        this._tIsMove=true;
      }
    }
    else if (this._lockDirection!=2){
      if (Math.abs( xDiff )>this._minmove){
        if ( xDiff > 0 ) {
          if (this._cb){
            this._cb(KRIGHT, evt);
          }
        } else {
          if (this._cb){
            this._cb(KLEFT, evt);
          }
        }
        this._lockDirection=1;
        /* Update Values */
        this._xDown = xUp;
        this._yDown = yUp;
      }
    }
    if (!this._tIsMove){
      if (Math.abs(xDiff)+Math.abs(yDiff)>minCancel){
        this._tIsMove=true;
      }
    }
  },
  gestureReg:function(el,cb,minmove,activeclass,nocancel,movecb,endcb){
    // console.warn(["register touch", el]);
    try{
      touchHelper.gestureUnreg(el);
    }catch(e){}
    if (!minmove){
      minmove=window.outerWidth*0.07;
    }
    el._nocancel=nocancel;
    el._minmove_main=minmove;
    el._cb=cb;
    el._xDown = null;
    el._yDown = null;
    el._tIsMove=false;
    el._activeclass=activeclass;
    el._movecb=movecb;
    el._endcb=endcb;
    el.addEventListener('touchstart', touchHelper.start, true);
    el.addEventListener('touchmove', touchHelper.move, true);
    el.addEventListener('touchend', touchHelper.tend, true);

    /* Mouse Handler */
    el.__mousedown=function(ev){
      document.addEventListener('mousemove', el.__mousemove, true);
      document.addEventListener('mouseup', el.__mouseup, true);
      return el.___MD(ev);
    };
    el.__mousemove=function(ev){
      return el.___MM(ev);
    };
    el.__mouseup=function(ev){
      document.removeEventListener('mousemove', el.__mousemove, true);
      document.removeEventListener('mouseup', el.__mouseup, true);
      return el.___MU(ev);
    };
    el.___MD=touchHelper.start;
    el.___MM=touchHelper.move;
    el.___MU=touchHelper.tend;
    el.addEventListener('mousedown', el.__mousedown, true);
  },
  gestureUnreg:function(el){
    el._cb=null;
    el.removeEventListener('touchstart', touchHelper.start, true);
    el.removeEventListener('touchmove', touchHelper.move, true);
    el.removeEventListener('touchend', touchHelper.tend, true);

    el.removeEventListener('mousedown', el.__mousedown, true);
    document.removeEventListener('mousemove', el.__mousemove, true);
    document.removeEventListener('mouseup', el.__mouseup, true);
  }
};

/* START */
(function(){
  if (home.profiles.init()){
    SD_LOAD_DOMAIN();
    window.__ARGUPDATE();
    _MAL.init();
    home.init();
    _API.bgimg_update();
    body.classList.remove('notready');
    _API.electronInitFullscreen();
  }
})();

/* PC AUTOUPDATE */
(function(){
  if (_ISELECTRON){
    function remindLater(){
      _API.confirm("Remind Me Again",
        md2html("Check for update again next time."),function(isok){
          if (!isok){
            _JSAPI.storeSet('__noautoupdate','1');
          }
          else{
            _JSAPI.storeSet('__noautoupdate','0');
          }
      });
    }
    window._ELECTRON_CHECK_UPDATE=function(ismenu){
      _JSAPI.storeSet('__noautoupdate','0');
      $ap('https://raw.githubusercontent.com/amarullz/AnimeTV/refs/heads/master/server.json',function(r){
        if (r.ok){
          try{
            var update=JSON.parse(r.responseText);
            console.log(update);
            var bv=Number(_JSAPI.getVersion(2));
            if (bv<update.pcnum){
              var ctxt=
                "Version: **"+update.pcver+"** ("+update.pcsize+")\n\n"+
                update.pcnote.trim();
              ctxt=md2html(ctxt,true);
              _API.confirm("New Update Available",ctxt,function(isok){
                if (!isok){
                  remindLater();
                  return;
                }
                _API.showToast(
                  "Downloading Update..."
                );
                _JSAPI.installApk(update.pcurl,1);
                return;
              });
            }
            else{
              if (ismenu){
                _API.showToast(
                  "Already up to date..."
                );
              }
            }
          }catch(e){}
        }
      });
    };
    var noAutoupdate=toInt(_JSAPI.storeGet('__noautoupdate','0'));
    if (!noAutoupdate){
      window._ELECTRON_CHECK_UPDATE(0);
    }
  }
})();

/* CHROMECAST */
(function(){
  /* reset */
  _API.setVideo('');

  // if (!('castConnect' in _JSAPI)){
  //   /* No Cast API */
  //   return;
  // }
  // console.log("ATVLOG - VIDSTREAM CASTMSG: API Available");
  // window.__CASTMSG=function(m,a){
  //   if (m=='connected'){
  //     if (a=="1"){
  //       _API.showToast("Cast Connected...");
  //       if (home._cast_sidebar){
  //         home._cast_sidebar.innerHTML='<c>cast_connected</c>Close Cast';
  //       }
  //       if (pb._cast){
  //         pb._cast.innerHTML='cast_connected';
  //       }
  //     }
  //     else{
  //       if (home._cast_sidebar){
  //         home._cast_sidebar.innerHTML='<c>cast</c>Cast';
  //       }
  //       if (pb._cast){
  //         pb._cast.innerHTML='cast';
  //       }
  //     }
  //     if (pb.state){
  //       _JSAPI.videoSetUrl("");
  //       pb.startpos_val=pb.vid_stat.pos;
  //       pb.init_video();
  //     }
  //   }
  // };

  // if (_TOUCH){
  //   pb._cast=$('pb_touch_cast');
  //   pb._cast.classList.add('supported');
  //   pb._cast.onclick=function(){
  //     _JSAPI.castConnect();
  //   };
  // }
})();