/* Body */
const body=document.body;
/* const _DNS="9anime.to"; */
const __DNS=('_JSAPI' in window)?_JSAPI.dns():"aniwave.to";
const __SD=('_JSAPI' in window)?_JSAPI.getSd():1;
/* getId */
function $(i){
  return document.getElementById(i);
}

/* ajax request */
function $a(uri, cb){
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
      if (xhttp.status==403){
        if (((uri.indexOf("https://")==-1)||(uri.indexOf("https://"+__DNS)==0)) 
          && (uri.indexOf("/__proxy/")!=0)){
          _JSAPI.cfCheck();
          setTimeout(function(){
            $a(uri, cb);
          },2500);
          return;
        }
      }
      xhttp.ok=true;
      cb(xhttp);
  };
  xhttp.onerror = function() {
      xhttp.ok=false;
      cb(xhttp);
  };
  xhttp.open("GET", uri, true);
  xhttp.send();
}

/* proxy ajax */
function $ap(uri, cb){
  $a("/__proxy/"+uri,cb);
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

/* trim */
function trim(s){
  return (s+"").trim();
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

function md2html(text){
  return nlbr(special(text))
    .replace(/(?:\*\*)([^*<\n]+)(?:\*\*)/g, "<strong>$1</strong>")
    .replace(/(?:__)([^_<\n]+)(?:__)/g, "<u>$1</u>")
    .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<i>$1</i>")
    .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:`)([^`<\n]+)(?:`)/g, "<t>$1</t>")
}

/**************************** GLOBAL LISTENERS ***************************/
/* Key event handler */
window._KEYEV=function(key, evSource){
  if (!evSource) evSource=0;
  _API.last_key_source=evSource;
  if (_API.keycb){
    if (_API.keycb(key))
      return true;
  }
  return false;
};

/**** NON KEY GESTURES ******/
(function(){
  window.addEventListener("wheel", event => {
    if (event.deltaY < 0)
    {
      _KEYEV(KUP);
    }
    else if (event.deltaY > 0)
    {
      _KEYEV(KDOWN);
    }
  });
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
window.__GETVIEWCB=function(d,u){
  if(_API.viewcb)
    _API.viewcb(d,u);
};

window.__M3U8CB=function(d){
  if(_API.m3u8cb)
    _API.m3u8cb(d);
}
window.__VIDPAGELOADCB=function(d){
  if(_API.vidpageload)
    _API.vidpageload(d);
}

/* mp4upload url callback */
window.__MP4CB=function(d){
  if(_API.mp4cb) 
  _API.mp4cb(d);
};

/* Number of bgimage */
const BGIMG_NUM=9;

/* Key codes */
const KUP=38;
const KDOWN=40;
const KLEFT=37;
const KRIGHT=39;
const KBACK=27;
const KENTER=13;
const KPGUP=33;
const KPGDOWN=34;
const KPLAY=402;
const KNEXT=403;
const KPREV=401;

/***************************** API HANDLERS *****************************/
const _API={
  /* USER-MANAGEMENT */
  user:'', /* current user prefix _API.user */
  user_prefix:'', /* current localStorage user prefix _API.user_prefix */
  
  html_class:'',

  /*** THEMES ***/
  theme_list:[
    '',
    'theme_blue',
    'theme_teal',
    'theme_green',
    'theme_brown',
    'theme_red',
    'theme_grey'
  ],
  theme_sel:0,
  theme_update:function(){
    var itm=_JSAPI.storeGet(_API.user_prefix+"theme","");
    if (itm){
      document.documentElement.className=itm+' '+_API.html_class;
      _API.theme_sel=_API.theme_list.indexOf(itm);
      if (_API.theme_sel<0) _API.theme_sel=0;
    }
    else{
      document.documentElement.className=_API.html_class;
    }
  },
  theme_next:function(){
    if (++_API.theme_sel>=_API.theme_list.length)
      _API.theme_sel=0;
    _JSAPI.storeSet(_API.user_prefix+"theme", _API.theme_list[_API.theme_sel]);
    _API.theme_update();
  },

  bgimg_update:function(){
    $('animebg').className='bg'+pb.cfg_data.bgimg;
  },

  /*** GENRES ***/
  genres:{
    "_tv":"tv","_movie":"movie",
    "_ova":"ova","_ona":"ona",
    "_special":"special",

    "action":"1","adventure":"2","avant_garde":"2262888",
    "comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9",
    "gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552",
    "josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18",
    "mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25",
    "reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31",
    "shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38",
    "supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"
  },

  /*** TRANSLATE LANGUAGES ***/
  tlangs:[
    ["Hardsub","hard"],
    ["Dub","dub"],
    ["English","en"],
    /* sources */
    ["Arabic","ar"],["German","de"], ["French","fr"], ["Italian","it"], ["Portuguese","pt"], ["Russian","ru"], ["Spanish","es"],
    /* translates - start=10 */
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

  /*** URL API ***/
  setUri:function(u){
    try{
      history.pushState({}, "", u);
    }catch(e){}
  },

  reload:function(){
    try{
      // _JSAPI.reloadHome();
      var rloc="https://"+_JSAPI.dns()+"/__view/main.html";
      console.log("RELOAD HOME = "+rloc);
      location=rloc;
    }catch(e){}
  },
  
  checkUpdate(){
    _JSAPI.checkUpdate();
  },

  /*** JSAPI CALLBACKS ***/
  keycb:null,
  messagecb:null,
  mp4cb:null,
  viewcb:null,
  m3u8cb:null,
  vidpageload:null,
  viewid:0,

  last_key_source:0,

  clearCb:function(){
    _API.keycb=null;
    _API.messagecb=null;
    _API.mp4cb=null;
    _API.viewcb=null;
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
    _API.viewcb=f;
    var uid=++_API.viewid;
    if (_JSAPI.getViewAvailable()){
      $a(url,function(r){
        _JSAPI.getview(url,uid);
      });
      return uid;
    }
    return false;
  },

  /* get mp4upload mp4-video url */
  getMp4:function(url, f){
    _API.mp4cb=f;
    _JSAPI.getmp4vid(url);
  },

  currentStreamType:0,
  currentStreamTypeValue:0,
  streamTypeById:function(l){
    t=1;
    if (l=='dub'){
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
  showToast:function(txt){
    _JSAPI.showToast(txt);
  },

  /*** FETCH AJAX ***/
  getTooltip:function(id, cb){
    // https://anix.to/ajax/anime/tooltip/13452?/cache3d23f0
    $a("https://"+__DNS+"/ajax/anime/tooltip/"+id+"?"+$tick(),function(r){
      if (r.ok){
        var d=$n('div','',0,0,r.responseText);
        var o={
          title:'',
          title_jp:'',
          synopsis:'',
          genres:[],
          rating:null,
          quality:null,
          ep:0,
          rating:''
        };

        if (__SD==1){
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
        }

        d=null;
        cb(o);
      }
      else
        cb(null);
    });
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
  setVideo:function(src, cb){
    clearInterval(_API.vidInterval);
    if (src){
      _JSAPI.videoSetUrl(src);
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
              cb('complete',0);
            }
          }
        }
      },50);
    }
    else{
      body.classList.remove('playback_on_video');
      _JSAPI.videoSetUrl("");
    }
  },

  /* Fetch animetv-info last message */
  discord_info_url:"https://amarullz.com/animetv-discord-info.txt",
  discordFetch:function(cb){
    $ap(_API.discord_info_url+"?"+$tick(), cb);
  }
};


(function(){
  /* VERSION INFO */
  try{
    var verel=$('home_version');
    if (_JSAPI){
      verel.innerHTML="<b>AnimeTV "+_JSAPI.getVersion(0)+" "+
        "&copy; 2023-2024 amarullz.com</b><br />Build "+_JSAPI.getVersion(1)
        +" - Server "+_JSAPI.dnsver()+" - Source "+__SD+"/"+(__SD==1?"WAVE":"ANIX");
    }
  }catch(e){}

  /* INITIALIZING */
  _API.setVideo('');
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
    if (o.list.length>30){
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
    vtt.h.className=(n?("vtt_style_"+n):"");
  },
  sel:0,
  substyle:0,
  listdef:[
    'english','portuguese (brazil)','spanish (latin_america)',
    'Spanish','Arabic','French','German','Italian','Russian'
  ],
  init:function(subs){
    if (subs.length>0){
      if (pb.cfg_data.lang!='' && pb.cfg_data.lang!='en'){
        var ffind = vtt.find_match(subs, pb.cfg_data.lang);
        // console.log("SUBTITLES SOFT = "+pb.cfg_data.lang+" => "+ffind+" // "+JSON.stringify(subs,null,'\t'));
        if (ffind>-1){
          // console.log("SUBTITLES FIND = "+ffind+" -> "+JSON.stringify(subs[ffind],null,'\t'));
          vtt.load(subs[ffind], 1);
          return;
        }
      }

      // console.error(JSON.stringify(subs));
      for (var i=0;i<subs.length;i++){
        if (subs[i].d){
          vtt.load(subs[i]);
          return;
        }
      }
      for (var i=0;i<subs.length;i++){
        if (subs[i].l.indexOf("eng")>-1){
          vtt.load(subs[i]);
          return;
        }
      }
      vtt.load(subs[0]);
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
          t[p].tx+='\n'+ln;
          t[p].tx=t[p].tx.trim();
        }
      }
    }catch(e){
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
        chunks[d].t+="  A2Q7R  "+timelines[i].tx;
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
          cb(txts);
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
          txts=txts.split("A2Q7R");
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
  load:function(sub,n){
    vtt.set('');
    vtt.playback.sub=null;
    vtt.playback.pos=0;
    vtt.playback.posid=0;
    vtt.substyle=0;
    vtt.playback.show=false;
    $ap(sub.u,function(r){
      if (r.ok){
        sub.v=r.responseText;
        sub.p=vtt.parse(sub.v);

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
    });
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
    sub:null,
    pos:0,
    posid:0,
    prevs:'',
    show:false,
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
            v.push(vt);
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

    /* Delete later */
    monitor_old:function(){
      if (!vtt.playback.sub||!vtt.playback.sub.p){
        return;
      }
      var p=pb.vid_stat.pos;
      var o=vtt.playback.sub.p;
      var d=vtt.playback.posid;
      var c=o[d];
      if (!c){
        for (var i=0;i<o.length;i++){ 
          if (p>=o[i].ts&&p<=o[i].te){
            if (vtt.playback.posid!=i||!vtt.playback.show){
              vtt.playback.posid=i;
              vtt.playback.show=true;
              vtt.setobj(o[i]);
            }
            return;
          }
        }
      }
      else if (p>=c.ts){
        if (p>=c.te){
          for (var i=d+1;i<o.length;i++){ 
            if (p<o[i].ts){
              if (vtt.playback.show){
                vtt.playback.show=false;
                vtt.set('');
              }
              vtt.playback.posid=i;
              return;
            }
            else if (p>=o[i].ts&&p<=o[i].te){
              vtt.playback.posid=i;
              vtt.playback.show=true;
              vtt.setobj(o[i]);
              return;
            }
          }
        }
        else if (!vtt.playback.show){
          vtt.playback.show=true;
          vtt.setobj(c);
        }
      }
      else{
        for (var i=d-1;i>=0;i--){
          if (p>o[i].te){
            if (vtt.playback.show){
              vtt.playback.show=false;
              vtt.set('');
            }
            vtt.playback.posid=i;
            return;
          }
          else if (p>=o[i].ts&&p<=o[i].te){
            vtt.playback.posid=i;
            vtt.playback.show=true;
            vtt.setobj(o[i]);
            return;
          }
        }
      }
    },
    play:function(){
      vtt.playback.intv=setInterval(vtt.playback.monitor,50);
    },
    pause:function(){
      vtt.playback.show=false;
      clearInterval(vtt.playback.intv);
    }
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

  pb_vid:$('pb_vid'),

  pb_tracks:$('pb_tracks'),
  pb_track:$('pb_track'),
  pb_track_val:$('pb_track_val'),
  pb_track_skip1:$('pb_track_skip1'),
  pb_track_skip2:$('pb_track_skip2'),

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

  curr_stream_type:0,

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
    try{
      list.history.detail[pb.data.animeid].play=[pos,dur];
    }catch(e){}
    try{
      if (pb.data.animeid in list.fav.detail)
        list.fav.detail[pb.data.animeid].play=[pos,dur];
    }catch(e){}
    try{
      _JSAPI.playNextPos(pos,dur);
      pb.playnext_last_tick=$tick()+2000;
    }catch(e){}
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
      default:
        _API.html_class='';
        break;
    }
    if (pb.cfg_data.performance){
      _API.html_class+=' ui_performance'
    }
    switch(pb.cfg_data.uifontsize){
      case 1:
        _API.html_class+=' view-bigfont';
        break;
      case 2:
        _API.html_class+=' view-bigfont view-biggerfont';
        break;
    }
    
    _API.theme_update();
    if (pb.cfg_data.jptitle){
      document.body.classList.add('japan-title');
    }
    else{
      document.body.classList.remove('japan-title');
    }
    if (pb.cfg_data.compactlist){
      document.body.classList.remove('view-informative');
    }
    else{
      document.body.classList.add('view-informative');
    }


    
  },

  cfg_data:{
    animation:0,
    performance:true,
    autoskip:false,
    autonext:true,
    skipfiller:false,
    jptitle:false,
    compactlist:false,
    nonjapan:false,
    server:0,
    scale:0,
    lang:'',
    ccstyle:0,
    bgimg:BGIMG_NUM-1,
    quality:0,
    uifontsize:0,
    mirrorserver:false
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
        pb.cfg_data.autonext=('autonext' in j)?(j.autonext?true:false):true;
        pb.cfg_data.skipfiller=('skipfiller' in j)?(j.skipfiller?true:false):false;
        pb.cfg_data.jptitle=('jptitle' in j)?(j.jptitle?true:false):false;
        pb.cfg_data.compactlist=('compactlist' in j)?(j.compactlist?true:false):false;
        pb.cfg_data.nonjapan=('nonjapan' in j)?(j.nonjapan?true:false):false;
        pb.cfg_data.performance=('performance' in j)?(j.performance?true:false):true;
        pb.cfg_data.mirrorserver=('mirrorserver' in j)?(j.mirrorserver?true:false):false;

        _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
        
        
        pb.cfg_data.lang=('lang' in j)?j.lang:'';
        _API.setStreamType(0,0);

        pb.cfg_data.server=0;


        pb.cfg_data.ccstyle=('ccstyle' in j)?j.ccstyle:'';
        vtt.set_style(pb.cfg_data.ccstyle);

        pb.cfg_data.bgimg=('bgimg' in j)?j.bgimg:BGIMG_NUM-1;
        _API.bgimg_update();

        /*
        if ('server' in j){
          var sv=parseInt(j.server);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.server=sv;
        }*/

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
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.animation=sv;
        }

        if ('uifontsize' in j){
          var sv=parseInt(j.uifontsize);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.uifontsize=sv;
        }

        
        pb.updateanimation();
        return;
      }
    }
    pb.cfg_data.autoskip=false;
    pb.cfg_data.autonext=true;
    pb.cfg_data.skipfiller=false;
    pb.cfg_data.jptitle=false;
    pb.cfg_data.compactlist=false;
    
    pb.cfg_data.nonjapan=false;
    pb.cfg_data.performance=true;
    pb.cfg_data.mirrorserver=false;
    
    pb.cfg_data.server=0;
    pb.cfg_data.animation=0;
    pb.cfg_data.uifontsize=0;
    pb.cfg_data.scale=0;
    pb.cfg_data.lang='';
    pb.cfg_data.ccstyle=0;
    pb.cfg_data.bgimg=BGIMG_NUM-1;
    pb.cfg_data.quality=0;
  },
  cfgserver_name:[
    'VIZCLOUD M3U8',
    'VIZCLOUD HTML5',
    'MP4UPLOAD'
  ],
  cfganimation_name:[
    'NORMAL ANIMATION',
    'FAST ANIMATION',
    'FASTER ANIMATION'
  ],
  cfguifontsize_name:[
    'SMALL FONT',
    'BIG FONT',
    'BIGGER FONT'
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
    'NORMAL SCALE',
    'COVER',
    'STRETCH'
  ],
  cfgquality_name:[
    "AUTO",
    "HIGH",
    "MEDIUM",
    "LOW"
  ],
  cfg_save:function(){
    var savingjs=JSON.stringify(pb.cfg_data);
    _JSAPI.storeSet(_API.user_prefix+'pb_cfg',JSON.stringify(pb.cfg_data));
//    localStorage.setItem(_API.user_prefix+'pb_cfg',JSON.stringify(pb.cfg_data));
    // console.log('ATVLOG STORAGE SAVE = '+savingjs);
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
        el.lastElementChild.innerHTML="SPEED "+_API.vidSpeed.toFixed(2)+"x";
      }
      else if (key=='ccstyle'){
        el.lastElementChild.innerHTML="CC STYLE "+(pb.cfg_data.ccstyle+1);
      }
      else if (key=='bgimg'){
        el.lastElementChild.innerHTML="WALLPAPER "+(pb.cfg_data.bgimg+1);
      }
      else if (key=='quality'){
        el.lastElementChild.innerHTML=pb.sel_quality;
      }
      else if (key=='sourcesvr'){
        el.lastElementChild.innerHTML="SOURCE "+__SD;
      }
      else if (key=='fav'){
        if (pb.data.animeid){
          if (list.fav_exists(pb.data.animeid)){
            el.innerHTML='<c>clear</c> REMOVE FROM WATCHLIST';
          }
          else{
            el.innerHTML='<c>bookmark_border</c> ADD TO WATCHLIST';
          }
        }
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
        if (key=='server'){
          el.lastElementChild.innerHTML=pb.cfgserver_name[pb.cfg_data[key]];
        }
        else if (key=='animation'){
          el.lastElementChild.innerHTML=pb.cfganimation_name[pb.cfg_data[key]];
        }
        else if (key=='uifontsize'){
          el.lastElementChild.innerHTML=pb.cfguifontsize_name[pb.cfg_data[key]];
        }
        else if (key=='scale'){
          el.lastElementChild.innerHTML=pb.cfgscale_name[pb.cfg_data[key]];
        }
        else{
          if (el){
            el.firstElementChild.innerHTML=pb.cfg_data[key]?'check':'clear';
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
      pb.cfg_update_el('autonext');
      pb.cfg_update_el('skipfiller');
      pb.cfg_update_el('nonjapan');
      pb.cfg_update_el('sourcesvr');
      
      pb.cfg_update_el('performance');
      pb.cfg_update_el('mirrorserver');
      pb.cfg_update_el('jptitle');
      pb.cfg_update_el('compactlist');
      pb.cfg_update_el('uifontsize');
      
      pb.cfg_update_el('server');
      pb.cfg_update_el('scale');
      pb.cfg_update_el('fav');
      pb.cfg_update_el('speed');
      pb.cfg_update_el('ccstyle');
      pb.cfg_update_el('bgimg');

      pb.cfg_update_el('quality');

      pb.cfg_update_el('hardsub');
      pb.cfg_update_el('softsub');
      pb.cfg_update_el('dub');
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
  setskip:function(v){
    if (v&&!pb.onskip){
      pb.onskip=true;
      pb.pb_event_skip.classList.add('active');
      pb.skipauto_update(1);
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
      for (var i=0;(i<pb.data.skip.length) && (i<2);i++){
        var l=(pb.data.skip[i][0] / cd) * 100.0;
        var r=(pb.data.skip[i][1] / cd) * 100.0;
        tsk[i].style.left=l+"%";
        tsk[i].style.width=(r-l)+"%";
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
    pb.state=0;
    pb.vid=null;
    pb.vid_reset_stat();
    pb.pb_vid.innerHTML='';
    _API.setVideo('');
    pb.pb_track_val.style.width="0%";
    pb.pb_iactions.style.transform='';

    pb.setskip(false);
    pb.skipauto_update(0);

    _API.setMessage(null);
    _API.setKey(null);

    vtt.clear();

    if (noclean){
      pb.pb_meta.classList.add('active');
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
      _API.clearCb();
      _API.setKey(home.keycb);
      home.list_init();
      _API.setUri("/home");
    }
    else{
      pb.pb_loading.classList.add('active');
      pb.pb.classList.add('active');
    }
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
    if (pb.vid_get_time_cb) return pb.vid_get_time_cb();
    return {position:0,duration:0};
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
    if (c=='complete'){
      pb.vid_stat.play=false;
      pb.pb_track_ctl.innerHTML='replay';
      try{
        _JSAPI.playNextClear();
      }catch(e){}
      pb.menu_show(1);
      pb.next_ep(0);
    }
    else if (c=='ready'){
      pb.state=2;
      pb.pb_track_ctl.innerHTML='play_circle';
      pb.pb_track_ctl.className='';
      console.log("EVENT VID READY");
      if (pb.startpos_val>0){
        pb.vid_startpos_init();
      }
    }
    else if (c=='play'){
      pb.vid_stat.play=true;
      pb.pb_track_ctl.innerHTML='play_circle';
      pb.menu_autohide();
      pb.setskip_track(1);
      vtt.playback.play();
    }
    else if (c=='pause'){
      vtt.playback.pause();
      pb.vid_stat.play=false;
      pb.pb_track_ctl.innerHTML='pause';
    }
    else if (c=='time'){
      pb.vid_stat.pos=v.position;
      pb.vid_stat.duration=v.duration;
      pb.track_update_pos();

      /* Check Skip Data */
      var sk=0;
      var ct=pb.vid_stat.pos;
      for (var i=0;i<pb.data.skip.length;i++){
          if ((pb.data.skip[i][0]<ct)&&(pb.data.skip[i][1]>ct)){
              sk=pb.data.skip[i][1]+1;
          }
      }
      if (sk>0){
        if (!pb.onskip){
          pb.skip_val=sk;
            pb.setskip(true);
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
  init_video_player_url:function(src){
    pb.pb_track_pos.innerHTML='STREAMING VIDEO';
    pb.vid_get_time_cb=function(){
      return _API.videoGetPos();
    };
    pb.vid_cmd_cb=function(c,v){
      if (c=='play'){
        pb.vid_stat.play=true;
        _API.videoPlay();
      }
      else if (c=='pause'){
        pb.vid_stat.play=false;
        _API.videoPause();
      }
      else if (c=='seek'){
        pb.vid_stat.pos=v<0?0:v;
        _API.videoSeek(pb.vid_stat.pos);
      }
    };
    _API.setVideo(src,function(c,v){
      pb.vid_event(c,v);
    });
  },
  m3u8_parse_main:function(src,dt){
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
              r=(n[1]+"").trim();
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
          u:nsrc["p"+(t[i])]
        }
      );
    }
    // console.log("PARSED-M3u8="+JSON.stringify(pb.data.vsources,null,'\t'));
  },
  sel_quality:"AUTO",
  init_video_mp4upload:function(src){
    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
    pb.data.vsources=[
      {
        r:"AUTO",
        u:src
      }
    ];
    console.log("PARSED-M3u8 QUALITY="+pb.cfg_data.quality);
    $ap(src,function(r){
      if (r.ok){
        pb.m3u8_parse_main(src,r.responseText);
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
    });
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

  init_video_vidcloud:function(){
    if ((pb.cfg('server')==1)&&(pb.data.vizm3u8)){
      console.log("ATVLOG VIZCLOUD-M3U8 GOT_DATA => "+pb.startpos_val);
      pb.init_video_mp4upload(pb.data.vizm3u8);
      return;
    }

    console.log("ATVLOG VIDEO VIDCLOUD = "+pb.data.stream_vurl);
    var _tmp_start_pos=pb.startpos_val;
    pb.data.vizm3u8=null;
    
    _API.setMessage(function(e){
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

    _API.setVizPageCb(function(d){
      if (d==0)
        pb.pb_track_pos.innerHTML='INITIALIZING';
      else if (d==1)
        pb.pb_track_pos.innerHTML='LOADING STREAM DATA';
      else if ((d==2)&&(++mp3utrycount<3)){
        pb.pb_track_pos.innerHTML='RETRY LOADING';
        pb.pb_vid.innerHTML='';
        (function(){
          pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
        })();
      }
      else{
        pb.pb_track_pos.innerHTML='PLAYER ERROR';
        pb.pb_vid.innerHTML='';
      }
    });

    _API.setVizCb(function(d){
      try{
        pb.pb_track_pos.innerHTML='PREPARE VIDEO';
        _API.setVizPageCb(null);

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
                  l:(tk.label+'').toLowerCase()
                });
              }
            }
            vtt.init(pb.subtitles);
          }
        }catch(e){}

        if (urivid){
          pb.data.vizm3u8=urivid;
          console.log("ATVLOG Got VizCB = "+urivid);
          if (pb.cfg('server')==0){
            pb.pb_vid.innerHTML='';
            pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
            _API.setMessage(null);
            pb.startpos_val=_tmp_start_pos;
            pb.init_video_mp4upload(urivid);
          }
        }
      }catch(e){
        pb.pb_track_pos.innerHTML='VIDEO ERROR: '+e;
      }
    });

    pb.pb_vid.innerHTML='';
    (function(){
      pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
    })();
  },

  reinit_video_to:null,
  reinit_video_delay:function(ms){
    clearTimeout(pb.reinit_video_to);
    pb.reinit_video_to=setTimeout(function(){
      pb.startpos_val=pb.vid_stat.pos;
      pb.init_video();
      pb.cfg_update_el("hardsub");
      pb.cfg_update_el("softsub");
      pb.cfg_update_el("dub");
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
      pb.pb_track_ctl.innerHTML='change_circle';
      pb.pb_track_ctl.className='loader';
      pb.pb_track_pos.innerHTML='LOADING SERVER';
      pb.pb_track_dur.innerHTML='';

      pb.data.stream_vurl = pb.data.stream_url.hard;
      pb.data.streamtype="sub";
      if (_API.currentStreamType==1){
        if (pb.data.stream_url.soft){
          pb.data.stream_vurl = pb.data.stream_url.soft;
          pb.data.streamtype="softsub";
        }
      }
      else if (_API.currentStreamType==2){
        if (pb.data.stream_url.dub){
          pb.data.stream_vurl = pb.data.stream_url.dub;
          pb.data.streamtype="dub";
        }
      }
      pb.updateStreamTypeInfo();

      pb.init_video_vidcloud();
    });
  },

  /* view data */
  data:null,
  ep_title:'',
  ep_num:'',
  ep_index:-1,
  lastkey:0,
  state:0,

  /* next ep */
  next_ep:function(fn){
    /* autonext */
    if (pb.cfg('autonext')||fn){
      if (pb.ep_index<pb.data.ep.length-1){
        var next_id=pb.ep_index+1;
        var sel_id=-1;
        /* skip filler */
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
          pb.action_handler(epd.url,';1');
        }
      }
    }
  },

  /* action command handler */
  action_handler:function(action,arg){
    if (!action) return false;
    console.log("action_handler -> "+action+" / "+arg);
    if (action.startsWith("http")){
      var args=[0,0,0];
      if (arg)
        args=arg.split(';');
      var startpos=0;
      if (args.length>=3) startpos=parseInt(args[2]);
      pb.open(action, args[0], parseInt(args[1]), startpos);
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
      else if (key=='theme'){
        _API.theme_next();
      }
      else if (key=='settings'){
        home.settings.open(1);
      }
      else if (key=='donate'){
        if (home.onsettings){
          home.settings.open_donation(1);
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
      else if (key=="hardsub" || key=="softsub"|| key=="dub"){
        var sel=0;
        if (key=="softsub") sel=1;
        else if (key=="dub") sel=2;
        if (_API.currentStreamType!=sel){
          _API.setStreamTypeValue(sel,1);
          pb.reinit_video_delay(100);
        }
      }
      else if (key=="speed"){
        _API.vidSpeed+=0.25;
        if (_API.vidSpeed>2.0){
          _API.vidSpeed=0.5;
        }
        _API.videoSpeed(_API.vidSpeed);
        pb.cfg_update_el(key);
      }
      else if (key=="quality"){
        if (pb.state==2){
          if (++pb.cfg_data.quality>3) pb.cfg_data.quality=0;
          pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
          pb.cfg_update_el(key);
          pb.cfg_save();
          pb.reinit_video_delay(1000);
        }
      }
      else if (key=="animation"){
        pb.state=0;
        if (++pb.cfg_data.animation>2) pb.cfg_data.animation=0;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=="uifontsize"){
        pb.state=0;
        if (++pb.cfg_data.uifontsize>2) pb.cfg_data.uifontsize=0;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=="ccstyle"){
        if (++pb.cfg_data.ccstyle>15) pb.cfg_data.ccstyle=0;
        pb.cfg_update_el(key);
        pb.cfg_save();
        vtt.set_style(pb.cfg_data.ccstyle);
      }
      else if (key=="bgimg"){
        if (++pb.cfg_data.bgimg>=BGIMG_NUM) pb.cfg_data.bgimg=0;
        pb.cfg_update_el(key);
        pb.cfg_save();
        _API.bgimg_update();
      }
      else if (key=='nonjapan'){
        // Update Home
        pb.cfg_data.nonjapan=!pb.cfg_data.nonjapan;
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
      else if (key=='compactlist'){
        // Update Home
        pb.cfg_data.compactlist=!pb.cfg_data.compactlist;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='sourcesvr'){
        // Update Home
        var chval=(__SD==2)?1:2;
        if (confirm("You are about to change the source server.\n"+
          "SOURCE SERVER TARGET : "+chval+". "+(chval==2?"ANIX":"WAVE")+"\n\n"+
          "NOTE: Watchlist & history contents will be changed...\n\n"+
          "Are you sure??")){
          _JSAPI.setSd((__SD==2)?1:2);
          if (pb.status){
            pb.reset(1,0);
          }
          setTimeout(function(){
            _API.reload();
          },200);
        }
      }
      else if (key=='performance'){
        pb.cfg_data.performance=!pb.cfg_data.performance;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='mirrorserver'){
        pb.cfg_data.mirrorserver=!pb.cfg_data.mirrorserver;
        pb.cfg_update_el(key);
        pb.cfg_save();
        _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,pb.state?1:0);
        if (pb.state){
          pb.reloadPlayback(1000);
        }
      }
      else if (key=='malaccount'){
        _MAL.login();
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
          if (++pb.cfg_data.scale>2) pb.cfg_data.scale=0;
          pb.cfg_update_el(key);
          pb.cfg_save();
          _API.videoScale(pb.cfg_data.scale);
        }
        else{
          pb.cfg_data[key]=!pb.cfg_data[key];
          pb.cfg_update_el(key);
          pb.cfg_save();
        }
      }
    }
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
          if (g._sel)
            g._sel.classList.remove('active');
          var n = g._target_n;
          n.classList.add('active');
          var iw=window.innerWidth/g._midx;
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
          if (g._margin)
            g.P.style.transform='translateX(-'+g._margin+'px)';
          else
            g.P.style.transform='translateX(0)';
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

  /* menu key handler */
  gestures:{
    pos:function(ev){
      var pX=0;
      var pY=0;
      if (ev.touches){
        if (ev.touches.length>0){
          pX=ev.touches[0].screenX;
          pY=ev.touches[0].screenY;
        }
      }
      else{
        pX=ev.screenX;
        pY=ev.screenY;
      }
      return [pX,pY];
    },
    start:function(ev){
      var p=pb.gestures.pos(ev);
      if (p[0]&&p[1])
        this.__gesture_start=p;
      else
        this.__gesture_start=null;
      this.__gesture_moved=false;
      ev.preventDefault();
    },
    move:function(ev){
      var s=this.__gesture_start;
      if (s){
        var p=pb.gestures.pos(ev);
        var xmove=p[0]-s[0];
        if (this.P){
          if (Math.abs(xmove)<(window.innerWidth*0.06)){
            this.P.style.marginLeft=(xmove/1.5)+'px';
          }
          else{
            this.P.style.marginLeft='';
            this.__gesture_start=p;
            this.__gesture_moved=true;
            if (xmove<0){
              this._keycb(this,KRIGHT);
            }
            else{
              this._keycb(this,KLEFT);
            }
          }
        }
      }
    },
    end:function(ev){
      this.P.style.marginLeft='';
      this.__gesture_start=null;
      if (!this.__gesture_moved){
        var tp=ev.target;
        while(tp){
          if (tp.parentNode==this.P){
            break;
          }
          else if (tp==this){
            tp=null;
            break;
          }
          tp=tp.parentNode;
        }
        if (tp){
          if (tp.classList.contains('active')){
            this._keycb(this,KENTER);
          }
          else{
            pb.menu_select(this,tp);
          }
        }
      }
      this.__gesture_moved=false;
      // console.log([this,ev]);
    },
  },
  menu_gesture_init:function(g){
    g.ontouchstart=pb.gestures.start;
    g.ontouchmove=pb.gestures.move;
    g.ontouchend=pb.gestures.end;
  },

  menu_init:function(g){
    g._keycb=pb.menu_keycb;
    // pb.menu_gesture_init(g);
  },
  menu_keycb:function(g,c,z){
    var n=null;
    if (!('_margin' in g)){
      g._margin=0;
      g._reset=function(){
        g._sel.classList.remove('active');
        g._sel=null;
        g._margin=0;
        g.classList.remove('maskleft');
        g.P.style.transform='translateX(0)';
      };
    }
    if (!g.firstElementChild) return false;
    if (c==KENTER){
      if (g._sel){
        if (g._enter_cb)
          return g._enter_cb(g,g._sel);
        else{
          if (g._sel._enter_cb)
            return g._sel._enter_cb(g,g._sel);
          else
            return pb.action_handler_el(g._sel);
        }
      }
    }
    else if (c==KLEFT){
      if (g._sel){
        if (g._sel.previousElementSibling)
          n=g._sel.previousElementSibling;
        else if (g.__prev){
          g.__prev();
          return true;
        }
        else if (g._should_clear)
          g._reset();
      }
    }
    else if (c==KRIGHT){
      if (g._sel){
        if (g._sel.nextElementSibling)
          n=g._sel.nextElementSibling;
        else if (g.__next){
          g.__next();
          return true;
        }
      }
      else
        n=g.P.firstElementChild;
    }
    else if (c==KPGUP || c==KPREV){
      if (g.__prev){
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
        g.__next();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.lastElementChild;
      }
    }
    if (n){
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
    pb.menu_hide_tick=$tick();
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=0;
    pb.menus[pb.menusel].classList.add('active');
    pb.pb_meta.classList.remove('active');
    $('pb_actions').classList.remove('active');
    pb.pb_iactions.style.transform='';
    pb.pb.classList.remove('menushow');
    pb.skipauto_update(1);
  },
  menu_show:function(pos){
    pb.pb.classList.add('menushow');
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=(pos===undefined?2:pos);
    pb.pb_actions.classList.add('active');
    pb.menus[pb.menusel].classList.add('active');
    pb.menu_update();
    pb.menu_autohide();
    pb.skipauto_update(0);
  },
  menu_update:function(){
    if (pb.menusel<=1){
      pb.pb_meta.classList.add('active');
      pb.pb_iactions.style.transform='';
      pb.pb_list.classList.remove('nomask');
      return;
    }
    else{
      pb.pb_meta.classList.remove('active');
    }
    var vh=(pb.menusel<pb.menus.length-1)?window.innerHeight/13:0;
    for (var i=2;((i<=pb.menusel)&&(i<pb.menus.length));i++){
      vh+=pb.menus[i].offsetHeight;
    }
    pb.pb_iactions.style.transform='translateY('+(window.innerHeight-vh)+'px)';
    if (pb.menus[pb.menusel]._sel){
      pb.menu_select(pb.menus[pb.menusel],pb.menus[pb.menusel]._sel);
    }
  },

  /* Track & Timings */
  track_keycb:function(g,c){
    if (c==KLEFT||c==KRIGHT){
      if ((_API.last_key_source==1&&c==KLEFT)||(_API.last_key_source!=1&&c==KRIGHT))
        pb.vid_cmd('seek',pb.vid_get_time().position+10);
      else
        pb.vid_cmd('seek',pb.vid_get_time().position-10);
      pb.track_update_pos();
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
    }
    else{
      pb.pb_track_val.style.width="0%";
      pb.pb_track_dur.innerHTML="";
    }
  },

  /* Root Key Callback */
  keycb:function(c){
    if (home.onsettings){
      return home.settings_keycb(c);
    }

    pb.lastkey=$tick();

    if (c==KPLAY){
      if (pb.state){
        if (!pb.vid_stat.play)
          pb.vid_cmd('play',0);
        else{
          pb.vid_cmd('pause',0);
          if (!pb.pb_actions.classList.contains('active')){
            pb.menu_show(2);
          }
        }
      }
      // pb.menu_show(c==KUP?1:2);
    }
    else if (c==KNEXT||c==KPREV){
      if (pb.state){
        if (!pb.pb_actions.classList.contains('active')){
          pb.menu_show(3);
          var vl=pb.menus[3];
          if (c==KNEXT){
            vl._keycb(vl,KRIGHT);
          }
          else{
            vl._keycb(vl,KLEFT);
          }
          return;
        }
      }
    }

    if (pb.pb_actions.classList.contains('active')){
      if (c==KBACK){
        pb.menu_hide();
      }
      else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN||c==KNEXT||c==KPREV){
        if (pb.menus[pb.menusel]._keycb)
          pb.menus[pb.menusel]._keycb(pb.menus[pb.menusel],c);
      }
      else if (c==KUP){
        pb.menus[pb.menusel].classList.remove('active');
        if (--pb.menusel<0){
          pb.menusel=0;
          pb.menu_hide();
          return;
        }
        pb.menus[pb.menusel].classList.add('active');
        pb.menu_update();
      }
      else if (c==KDOWN){
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
            pb.vid_cmd('seek',pb.skip_val);
            return true;
          }
        }
      }
      if (c==KLEFT||c==KRIGHT||c==KUP||c==KDOWN||c==KENTER){
        pb.menu_show(c==KUP?1:2);
      }
      else if (c==KBACK){
        if (pb.menu_hide_tick+1000<$tick()){
          /* prevent accidential back */
          pb.reset(1,0);
        }
        else{
          _API.showToast("Press back again to close watching...");
          pb.menu_hide_tick=0;
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
        var hl=$n('div',d.active?'playing':'',{action:d.url,arg:';1'},pb.pb_episodes.P,special(d.ep)+adh);
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
  },

  init_settings:function(){
    pb.cfg_load();
    pb.menu_clear(pb.pb_settings);
    _API.videoSpeed(_API.vidSpeed);

    // $n('div','',{action:'-prev'},pb.pb_settings,'<c>skip_previous</c> PREV');
    // $n('div','',{action:'-next'},pb.pb_settings,'NEXT <c>skip_next</c>');
    //fav_exists
    
    pb.pb_settings._s_settings=$n('div','',{action:'*settings'},pb.pb_settings.P,'<c>settings</c> SETTINGS');
    pb.pb_settings._s_fav=$n('div','',{action:'*fav'},pb.pb_settings.P,'');
    pb.pb_settings._s_speed=$n('div','',{action:'*speed'},pb.pb_settings.P,'<c>speed</c> <span>SPEED 1.0x</span>');

    pb.pb_settings._s_quality=$n('div','',{action:'*quality'},pb.pb_settings.P,'<c>hd</c> <span>AUTO</span>');

    

    /*
    pb.pb_settings._s_autonext=$n('div','',{action:'*autonext'},pb.pb_settings.P,'<c>check</c> AUTO NEXT');
    pb.pb_settings._s_autoskip=$n('div','',{action:'*autoskip'},pb.pb_settings.P,'<c>clear</c> AUTO SKIP INTRO');
    pb.pb_settings._s_skipfiller=$n('div','',{action:'*skipfiller'},pb.pb_settings.P,'<c>clear</c> SKIP FILLER');
    pb.pb_settings._s_scale=$n('div','',{action:'*scale'},pb.pb_settings.P,'<c>aspect_ratio</c> <span>SCALE</span>');
    pb.pb_settings._s_server=$n('div','',{action:'*server'},pb.pb_settings.P,'<c>cloud_done</c> <span>SERVER</span>');
    */

    pb.pb_settings._s_hardsub=$n('div','',{action:'*hardsub'},pb.pb_settings.P,'<c>clear</c> HARDSUB');
    if (pb.data.stream_url.soft){
      pb.pb_settings._s_softsub=$n('div','',{action:'*softsub'},pb.pb_settings.P,'<c>clear</c> SOFTSUB');
    }
    if (pb.data.stream_url.dub){
      pb.pb_settings._s_dub=$n('div','',{action:'*dub'},pb.pb_settings.P,'<c>clear</c> DUB');
    }

    pb.pb_settings._s_mirrorserver=$n(
      'div','',{
        action:'*mirrorserver'
      },
      pb.pb_settings.P,
      '<c>clear</c> MIRROR SERVER'
    );
    
    /*
    sub, softsub, dub
    */


    pb.menu_select(pb.pb_settings,pb.pb_settings.P.firstElementChild);
    pb.pb_settings._midx=2;
    pb.cfg_update_el();
    _API.videoScale(pb.cfg_data.scale);
  },

  updateStreamTypeInfo:function(){
    var txtadd='';
    if (pb.data.streamtype=="dub"){
      pb.curr_stream_type=2;
    }
    else if (pb.data.streamtype=="softsub"){
      pb.curr_stream_type=1;
      txtadd+=(vtt.substyle?' <c>g_translate</c>':'')+' <b class="softsub_lang">'+pb.cfg_data.lang.toUpperCase()+'</b>';
    }
    else{
      pb.curr_stream_type=0;
    }
    pb.pb_action_streamtype.innerHTML='<c>'+pb.cfgstreamtype_ico[pb.curr_stream_type]+'</c> '+pb.cfgstreamtype_name[pb.curr_stream_type]+txtadd;
    pb.pb_action_streamtype.classList.add('active');
  },

  init:function(){
    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];

    $('home').style.display=$('search').style.display='none';
    pb.setskip_track(0);
    pb.updateStreamTypeInfo();

    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'), url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'-w100)';

    /* META */
    pb.ep_num='';
    pb.ep_title='';
    pb.pb_title.innerHTML=tspecial(pb.data.title);
    pb.pb_title.setAttribute('jp',pb.data.title_jp?pb.data.title_jp:dpb.data.title);

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

    /* Init Anime ID - Fav & History */
    var url_parse=pb.data.url.split('/');
    if (url_parse.length>=5){
      pb.data.animeid=url_parse[4];
      if (pb.data.animeid){
        list.history_add(pb.data.animeid,pb.listobj(),true);
        if (list.fav_exists(pb.data.animeid)){
          list.fav_add(pb.data.animeid,pb.listobj(),false);
        }
      }
    }

    /* MAL Init */
    if (pb.malidreq){
      if (pb.data.animeid){
        pb.malidanime=pb.data.animeid;
        pb.malidsave=pb.malidreq;
      }
      pb.malidreq=null;
    }

    /* MAL Update Watched Episode */
    if (pb.malidsave && (pb.malidanime==pb.data.animeid)){
      console.log("MAL-PLAY #"+pb.malidsave+" / animeid="+pb.data.animeid);
      var malid="mal_"+pb.malidsave;
      if (malid in _MAL.data){
        var d=_MAL.data[malid];
        var cep=toInt(pb.ep_val);
        if (cep>d.list_status.num_episodes_watched){
          console.log("MAL-PLAY #Update-Watched -> "+d.list_status.num_episodes_watched+" / Play="+pb.ep_val);
          d.list_status.num_episodes_watched=cep;
          _MAL.set_ep(pb.malidsave, cep, function(r){
            console.log("MAL-PLAY #Update-Resp: "+r.responseText);
          });
          if (d._elm && d._elm._ep){
            var sp=d._elm._ep.querySelector("span.info_ep");
            if (!sp){
              d._elm._ep.innerHTML+='<span class="info_ep">'+special(cep+"")+'</span>';
            }
            else{
              sp.innerHTML=special(cep+"");
            }
          }
        }
      }
      else{
        pb.malidanime=null;
        pb.malidsave=null;  
        console.log("MAL-PLAY #RESET-NOTFOUND");
      }
    }
    else{
      if (pb.malidsave){
        console.log("MAL-PLAY #RESET");
      }
      pb.malidanime=null;
      pb.malidsave=null;
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
        var hl=$n('div',d.active?'playing':'',{action:d.url},pb.pb_seasons.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
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
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},pb.pb_related.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
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
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},pb.pb_recs.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
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
      _JSAPI.playNextMeta(
        pb.data.title+(pb.ep_num?(" ("+pb.ep_num+")"):''),
        pb.ep_title, 
        pb.data.banner?pb.data.banner:pb.data.poster, 
        pb.url_value.substring(("https://"+__DNS).length),
        pb.tip_value
      );
    }catch(e){}

    pb.init_video();

    /* ACTIONS */
    pb.pb_genres._midx=4;
    // pb.pb_settings._keycb=
    // pb.pb_genres._keycb=
    // pb.pb_episodes._keycb=
    // pb.pb_seasons._keycb=
    // pb.pb_related._keycb=
    // pb.pb_recs._keycb=pb.menu_keycb;

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

  malidreq:null,
  malidsave:null,
  malidanime:null,

  open:function(uri, ttid, noclean, startpos, malid){
    console.log("ATVLOG pb.open -> "+noclean+" / "+ttid+" / "+startpos);
    pb.pb_action_streamtype.classList.remove('active');
    var open_stat=0;
    _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
    pb.malidreq=malid?malid:null;

    var uid=_API.getView(uri,function(d,u){
      open_stat=1;
      if (uid==u && d.status){
        console.log("GETVIEW: "+JSON.stringify(d,null,'\t'));
        pb.data=d;
        _API.setUri(uri);
        pb.init();
      }
    });
    if (uid){
      pb.menu_clear(pb.pb_settings);
      pb.tip_value=ttid?ttid:'';
      pb.url_value=uri;
      pb.startpos_val=(startpos!==undefined)?(startpos?parseInt(startpos):0):0;
      console.log("ATVLOG OPENPB => POS="+pb.startpos_val);
      if (ttid&&!noclean){
        _API.getTooltip(ttid,function(d){
          if (d){
            if (open_stat==0){
              pb.pb_title.innerHTML=tspecial(d.title);
              pb.pb_title.setAttribute('jp',d.title_jp?d.title_jp:d.title)
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
              pb.pb_meta.classList.add('active');
              try{
                pb.menu_clear(pb.pb_genres);
                for (var i=0;i<d.genres.length;i++){
                  $n('div','',0,pb.pb_genres.P,special(d.genres[i].name));
                }
              }catch(e){}
            }
          }
        });
      }
      pb.reset(0,noclean);
      _API.setKey(function(ke){
        if (ke==KBACK){
          uid=-1;
          open_stat=3;
          pb.reset(1,0);
          // _JSAPI.appQuit();
        }
      });
    }
    return uid;
  }
};

const home={
  home_onload:false,
  home:$('home'),
  home_scroll_mask:$('home_scroll_mask'),
  home_scroll:$('home_scroll'),
  home_slide:$('home_slide'),
  home_recent:$('home_recent'),
  home_mal:$('home_mal'),
  home_dub:$('home_dub'),
  home_trending:$('home_trending'),
  home_random:$('home_random'),
  home_chinese:$('home_chinese'),

  home_history:$('home_history'),
  home_fav:$('home_fav'),

  home_header:$('home_header'),
  home_search:$('home_search'),
  home_settings:$('home_settings'),
  bgimg:null,

  recent_parse:function(g,v){
    var hd=$n('d','','',null,v);
    var rd=[];

    if (__SD==1){
      // wave
      var it=hd.querySelectorAll('div.item');
      for (var i=0;i<it.length;i++){
        var t=it[i];
        try{
          var d={};
          var at=t.querySelector('a.d-title');
          d.url=at.href;
          d.poster=t.querySelector('img').src;
          d.title=at.textContent.trim();
          try{
            d.title_jp=at.getAttribute('data-jp');
          }catch(ee){}
          d.type=t.querySelector('div.right').textContent;
          d.ep=t.querySelector('span.ep-status').textContent.trim();
          d.tip=t.firstElementChild.getAttribute('data-tip');
          d.adult=t.querySelector('div.adult')?true:false;
          rd.push(d);
        }catch(e){
          // console.log(e);
        }
      }
    }
    else{
      // anix
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
            d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
          }catch(e){
            try{
              d.ep=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
            }catch(e2){}
          }

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
    }

    hd.innerHTML='';
    if (rd&&rd.length){
      for (var i=0;i<rd.length;i++){
        var d=rd[i];
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
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
        var infotxt='';
        if (d.adult){
          infotxt+='<span class="info_adult">18+</span>';
        }
        if (d.duration){
          infotxt+='<span class="info_duration">'+special((d.duration+"").toUpperCase())+'</span>';
        }
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.ep){
          infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl,infotxt);
        }
      }
      while (g.P.childElementCount>30){
        g._spre.push(g.P.firstElementChild.nextElementSibling);
        g.P.removeChild(g.P.firstElementChild.nextElementSibling);
      }
      g.__update_pre();

      if (!g._sel)
        pb.menu_select(g,g.P.firstElementChild);
      else
        pb.menu_select(g,g._sel);
    }
  },
  recent_load:function(g){
    g._onload=1;
    var load_page=g._page;
    $a(g._ajaxurl+''+load_page,function(r){
      if (r.ok){
        try{
          var v=JSON.parse(r.responseText);
          home.recent_parse(g,v.result);
        }catch(e){}
        g._onload=0;
      }
      else
        setTimeout(function(){home.recent_load(g)},2000);
    });
  },
  recent_init:function(rc, loader){
    rc._page=1;
    pb.menu_clear(rc);
    rc._nojump=true;
    // rc._keycb=pb.menu_keycb;
    pb.menu_init(rc);

    rc._spre=[];
    rc._spost=[];
    rc.__update_pre=function(){
      rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
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
        if (g._spre.length>0){
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
      if (g._spost.length>0){
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
    if (loader){
      loader(rc);
    }
    else{
      home.recent_load(rc);
    }
  },

  ttip_desc:function(el,ttip){
    _API.getTooltip(ttip,function(d){
      if (d){
        el.innerHTML=special(d.synopsis);
      }
    });
  },

  home_parser:function(v){
    var h=$n('div','','',null,v);
    var td=[];
    try{
      if (__SD==1){
        // wave
        var tops=h.querySelector('section#top-anime').querySelector('div.tab-content[data-name=day]').querySelectorAll('a.item');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          var tt=t.querySelector('div.d-title');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jp');
          d.url=t.href;
          d.tip=t.querySelector('div.poster').getAttribute('data-tip');
          d.poster=t.querySelector('img').src;
          d.adult=t.querySelector('div.adult')?true:false;
          try{
            d.ep=(t.querySelector('span.ep-status.sub').textContent+'').trim()
          }catch(e){
          }
          try{
            d.type=(t.querySelector('div.info .meta span.dot:not(.ep-wrap)').textContent+'').trim();
          }catch(e){
          }
          td.push(d);
        }
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

    if (td.length>0){
      for (var i=0;i<td.length;i++){
        try{
        var d=td[i];
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:toInt(d.ep?d.ep:0),
          title:d.title
        };
        var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:"ep"},home.home_slide.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._viewbox=$n('span','infobox',null,hl,'');
        hl._view=$n('span','infovalue',null,hl._viewbox,'');
        hl._title=$n('h4','',{jp:d.title_jp?d.title_jp:d.title},hl._view,tspecial(d.title));
        hl._desc=$n('span','desc',null,hl._view,'');
        home.ttip_desc(hl._desc, d.tip);
        var infotxt='';
        if (d.adult){
          infotxt+='<span class="info_adult">18+</span>';
        }
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.ep){
          infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl,infotxt);
        }
        }catch(ee){}
      }
      pb.menu_select(home.home_slide,home.home_slide.P.firstElementChild);
    }
  },

  home_load:function(){
    home.home_onload=1;
    $a('/home',function(r){
      if (r.ok){
        try{
          home.home_parser(r.responseText);
        }catch(e){}
        home.home_onload=0;
      }
      else
        setTimeout(home.home_load,2000);
    });
  },
  
  menus:[],
  menu_sel:0,
  list_init_name:function(o, h){
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
            infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
            arg.ep=toInt(d.ep);
          }
          // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'+addarg},h.P,'');
          var hl=$n('div','',{action:"$"+JSON.stringify(arg),arg:""},h.P,'');
          var ps=d.poster.split('-w100');
          d.poster=ps[0];
          hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
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
    // h._keycb=pb.menu_keycb;
    pb.menu_init(h);
  },
  list_init:function(){
    // console.log(home);
    // console.log(home.home_history);
    home.list_init_name(list.fav,home.home_fav);
    home.list_init_name(list.history,home.home_history);
  },
  init:function(){
    pb.cfg_load();
    _API.setUri("/home");
    list.load();

    home.home_recent._ajaxurl='/ajax/home/widget/updated-sub?page=';
    home.home_dub._ajaxurl='/ajax/home/widget/updated-dub?page=';
    home.home_trending._ajaxurl='/ajax/home/widget/trending?page=';
    home.home_random._ajaxurl='/ajax/home/widget/random?page=';
    home.recent_init(home.home_recent);
    home.recent_init(home.home_dub);
    home.recent_init(home.home_trending);
    home.recent_init(home.home_random);

    home.home_load();

    _API.setKey(home.keycb);

    home.menus=[
      home.home_header,
      home.home_slide,
      home.home_recent
    ];

    if (_MAL.islogin()){
      home.home_mal.className='home_list pb_menu';
      home.home_mal.style.display=''; 
      home.recent_init(home.home_mal, _MAL.home_loader);
      home.menus.push(home.home_mal);
      home.home_mal.setAttribute("list-title","🎫 MyAnimeList Currently Watching 🧑 "+special(_MAL.auth.user));
    }

    home.menus.push(home.home_dub);
    home.menus.push(home.home_trending);
    home.menus.push(home.home_random);

    if (pb.cfg_data.nonjapan){
      home.home_chinese.className='home_list pb_menu';
      home.home_chinese.style.display='';
      home.home_chinese._ajaxurl='/ajax/home/widget/updated-china?page=';
      home.recent_init(home.home_chinese);
      home.menus.push(home.home_chinese);
    }
    else{
      home.home_chinese.style.display='none !important';
      home.home_chinese.innerHTML='';
      home.home_chinese.className='';
    }

    home.menus.push(home.home_fav);
    home.menus.push(home.home_history);

    home.list_init();

    pb.menu_clear(home.home_slide);

    home.home_slide._itemwidth=function(){
      return (window.innerWidth * 0.3);
    };
    pb.menu_init(home.home_slide);
    home.menus[home.menu_sel].classList.add('active');

    home.home_header._keycb=home.header_keycb;
    home.home_search.classList.add('active');

    home.init_discord_message();
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
    needreload:false,
    settings:$('settings'),
    tlang:$('settings_lang'),
    more:$('settings_more'),
    video:$('settings_video'),
    styling:$('settings_style'),
    performance:$('settings_performance'),
    about:$('settings_about'),
    tools:{},
    isplayback:0,
    menus:[],
    langsel:function(g,s){
      var prevlang=pb.cfg_data.lang;
      var prevstype=_API.currentStreamType;
      var i=s._key;
      var t=s._title;
      if (i=='hard'){
        i='';
      }
      
      if (prevlang!=i){
        console.log("ATVLOG Changelang = "+i);
        pb.cfg_data.lang=i;
        pb.cfg_save();
        var nst=_API.streamTypeById(i);
        if (nst!=prevstype){
          _API.setStreamTypeValue(-1,home.settings.isplayback?1:0);
          if (home.settings.isplayback){
            // pb.reloadPlayback(2000);
            pb.startpos_val=pb.vid_stat.pos;
            pb.init_video();
          }
        }

        if (nst==1 && prevstype==1){
          /* If auto translate */
          try{
            // vtt.translate(vtt.playback.sub.p, i);
            vtt.init(pb.subtitles);
          }catch(e){}
        }

        home.settings.refreshlang();
      }
    },
    initmore_done:false,
    initmore:function(){
      if (!home.settings.initmore_done){
        pb.menu_clear(home.settings.video);
        pb.menu_init(home.settings.video);

        pb.menu_clear(home.settings.styling);
        pb.menu_init(home.settings.styling);

        pb.menu_clear(home.settings.performance);
        pb.menu_init(home.settings.performance);

        pb.menu_clear(home.settings.more);
        pb.menu_init(home.settings.more);

        pb.menu_clear(home.settings.about);
        pb.menu_init(home.settings.about);

        home.settings.tools={};

        /* Video */
        home.settings.tools._s_autonext=$n(
          'div','',{
            action:'*autonext'
          },
          home.settings.video.P,
          '<c>check</c> AUTO NEXT'
        );
        home.settings.tools._s_autoskip=$n(
          'div','',{
            action:'*autoskip'
          },
          home.settings.video.P,
          '<c>clear</c> AUTO SKIP INTRO'
        );
        home.settings.tools._s_skipfiller=$n(
          'div','',{
            action:'*skipfiller'
          },
          home.settings.video.P,
          '<c>clear</c> SKIP FILLER'
        );
        home.settings.tools._s_scale=$n(
          'div','',{
            action:'*scale'
          },
          home.settings.video.P,
          '<c>aspect_ratio</c> <span>SCALE</span>'
        );


        /* Style */
        home.settings.tools._s_ccstyle=$n(
          'div','',{
            action:'*ccstyle'
          },
          home.settings.styling.P,
          "<c>closed_caption</c> <span>CC STYLE 1</span>"
        );

        home.settings.tools._s_theme=$n(
          'div','',{
            action:'*theme'
          },
          home.settings.styling.P,
          "<c>palette</c> CHANGE COLOR"
        );
        
        home.settings.tools._s_bgimg=$n(
          'div','',{
            action:'*bgimg'
          },
          home.settings.styling.P,
          "<c>wallpaper</c> <span>WALLPAPER 1</span>"
        );

        home.settings.tools._s_compactlist=$n(
          'div','',{
            action:'*compactlist'
          },
          home.settings.styling.P,
          "<c>clear</c> COMPACT LIST"
        );

        home.settings.tools._s_uifontsize=$n(
          'div','',{
            action:'*uifontsize'
          },
          home.settings.styling.P,
          "<c>format_size</c> <span>NORMAL FONT</span>"
        );

        
        /* Performance */
        home.settings.tools._s_animation=$n(
          'div','',{
            action:'*animation'
          },
          home.settings.performance.P,
          "<c>animation</c> <span>FAST ANIMATION</span>"
        );
        home.settings.tools._s_performance=$n(
          'div','',{
            action:'*performance'
          },
          home.settings.performance.P,
          '<c>clear</c> 🚀 PERFORMANCE-UI'
        );
        home.settings.tools._s_jptitle=$n(
          'div','',{
            action:'*jptitle'
          },
          home.settings.performance.P,
          "<c>clear</c> 🇯🇵 JAPANESE TITLES"
        );


        /* Others */
        home.settings.tools._s_malaccount=$n(
          'div','',{
            action:'*malaccount'
          },
          home.settings.more.P,
          _MAL.islogin()?'<c>lock_open</c> MAL LOGOUT ('+special(_MAL.auth.user)+')':'<c>list_alt</c> MAL LOGIN'
        );

        home.settings.tools._s_nonjapan=$n(
          'div','',{
            action:'*nonjapan'
          },
          home.settings.more.P,
          '<c>clear</c> 🇨🇳 CHINESE ANIME'
        );

        home.settings.tools._s_sourcesvr=$n(
          'div','',{
            action:'*sourcesvr'
          },
          home.settings.more.P,
          "<c>database</c> <span>SOURCE "+__SD+"</span>"
        );

        

        /* About */
        home.settings.tools._s_donation=$n(
          'div','',{
            action:'*donate'
          },
          home.settings.about.P,
          "<c>volunteer_activism</c> DONATE"
        );
        home.settings.tools._s_discord=$n(
          'div','',{
            action:'*discord'
          },
          home.settings.about.P,
          "<c>sports_esports</c> DISCORD"
        );
        home.settings.tools._s_checkupdate=$n(
          'div','',{
            action:'*checkupdate'
          },
          home.settings.about.P,
          "<c>update</c> CHECK FOR UPDATE"
        );
      }
      home.settings.initmore_done=true;
      pb.menu_select(home.settings.video,home.settings.tools._s_autonext);
      pb.menu_select(home.settings.styling,home.settings.tools._s_ccstyle);
      pb.menu_select(home.settings.performance,home.settings.tools._s_animation);
      pb.menu_select(home.settings.more,home.settings.tools._s_malaccount);
      pb.menu_select(home.settings.about,home.settings.tools._s_donation);
      pb.cfg_update_el();
    },
    refreshlang:function(){
      /* Init Langs */
      pb.menu_clear(home.settings.tlang);
      pb.menu_init(home.settings.tlang);
      
      home.settings.tlang._enter_cb=home.settings.langsel;
      home.settings.tlang._els=[];
      var vsel=null;
      for (var i=0;i<_API.tlangs.length;i++){
        var lid=_API.tlangs[i][1];
        var title=special(_API.tlangs[i][0]);
        if (lid=='hard'){
          title='<c>subtitles</c> '+title;
        }
        else if (lid=='dub'){
          title='<c>keyboard_voice</c> '+title;
        }
        else{
          if (i>=10){
            title='<c>g_translate</c> '+title;
          }
          else{
            title='<c>closed_caption</c> '+title;
          }
          title+=' <b>'+special(lid.toUpperCase())+'</b>';
        }

        var gn=$n('div','',{
          action:'@'+lid,'gid':lid
        },
        home.settings.tlang.P,(title));
        gn._title=title;
        gn._key=lid;

        home.settings.tlang._els[i]=gn;

        if (lid==pb.cfg_data.lang){
          vsel=gn;
          gn.innerHTML='<c>check</c> '+(title);
        }
      }
      if (!vsel){
        vsel=home.settings.tlang._els[0];
        vsel.innerHTML='<c>check</c> '+vsel._title;
      }
      if (vsel){
        pb.menu_select(home.settings.tlang,vsel);
      }
    },
    open:function(arg){
      home.settings.isplayback=arg;
      home.settings.needreload=false;
      home.settings.sel=0;
      home.settings.menus=[
        home.settings.tlang,
        home.settings.video,
        home.settings.styling,
        home.settings.performance,
        home.settings.more,
        home.settings.about
      ];

      for (var i=0;i<home.settings.menus.length;i++){
        home.settings.menus[i].classList.remove('active');
      }

      home.settings.tlang._midx=
      home.settings.video._midx=
      home.settings.styling._midx=
      home.settings.performance._midx=
      home.settings.more._midx=
      home.settings.about._midx=2.3;

      home.onsettings=true;
      home.settings.update(0);
      home.settings.refreshlang();
      home.settings.initmore();
      pb.pb.classList.add('onsettings');
      requestAnimationFrame(function(){
        home.settings.settings.classList.add('active');
      });
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
    update:function(pc){
      home.settings.menus[home.settings.sel].classList.remove('active');
      home.settings.sel=pc;
      home.settings.menus[home.settings.sel].classList.add('active');
    },
    open_donation:function(ispaypal){
      if (home.onsettings){
        home.ondonate=true;
        $('popupcontainer').className='active';
        $('aboutpopup').className='active';
        var v1=ispaypal?'':'none';
        var v2=ispaypal?'none':'';
        $('popup_paypal').style.display=v1;
        $('popup_discord').style.display=v2;
      }
    }
  },
  settings_keycb:function(c){
    if (home.ondonate){
      if (c==KBACK || c==KENTER){
        $('aboutpopup').className='';
        $('popupcontainer').className='';
        home.ondonate=false;
      }
      return;
    }

    var pc=home.settings.sel;
    if (c==KBACK){
      home.settings.close();
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      home.settings.menus[pc]._keycb(home.settings.menus[pc],c);
    }
    else if (c==KUP){
      if (--pc<0){
        // home.settings.close();
        // return;
        pc=home.settings.menus.length-1;
      }
    }
    else if (c==KDOWN){
      if (++pc>=home.settings.menus.length){
        // pc=home.settings.menus.length-1;
        // home.settings.close();
        // return;
        pc=0;
      }
    }
    if (home.settings.sel!=pc){
      home.settings.update(pc);
    }
  },
  onsettings:false,
  ondonate:false,

  search:{
    sel:0,
    search:$('search'),
    kw:$('search_keyword'),
    genres:$('search_genre'),
    res:$('search_result'),
    menus:[],
    update:function(pc){
      home.search.menus[home.search.sel].classList.remove('active');
      home.search.sel=pc;
      home.search.menus[home.search.sel].classList.add('active');
      if (pc==0){
        home.search.kw.focus();
        _API.showIme(true);
      }
      else{
        home.search.kw.blur();
        _API.showIme(false);
      }
    },
    close:function(){
      home.onsearch=false;
      home.search.search.classList.remove('active');
      _API.showIme(false);
      _API.setUri("/home");
    },
    parse:function(v){
      var h=$n('div','','',null,v);
      var rd=[];
      if (__SD==1){
        // wave
        var ls=h.querySelector('#list-items');
        if (ls){
          var it=ls.querySelectorAll('div.item');
          for (var i=0;i<it.length;i++){
            var im=it[i];
            var d={};
            var tt=im.querySelector('a.d-title');
            d.url=tt.href;
            d.title=tt.textContent.trim();
            try{
              d.title_jp=tt.getAttribute('data-jp');
            }catch(ex){}
            d.poster=im.querySelector('img').src;
            d.tip=im.querySelector('div.poster.tip').getAttribute('data-tip');
            var epel=im.querySelector('span.ep-status.sub');
            if (!epel){
              epel=im.querySelector('span.ep-status.total');
              d.epavail=0;
            }
            else{
              d.epavail=toInt((epel.textContent+'').trim());
            }
            if (epel){
              d.ep=(epel.textContent+'').trim();
            }
            epel=im.querySelector('span.ep-status.total');
            if (epel){
              d.eptotal=toInt((epel.textContent+'').trim());
            }
            else{
              d.eptotal=0;
            }

            d.adult=false;
            try{
              d.adult=im.querySelector('div.adult')?true:false;
            }catch(e){}

            try{
              d.type=im.querySelector('div.right').textContent.trim();
            }catch(e){}
            rd.push(d);
          }
        }
      }
      else{
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
              d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
            }catch(e){
              try{
                d.ep=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
              }catch(e2){}
            }
            try{
              d.eptotal=toInt(t.querySelector('div.sub-dub-total span.total').textContent.trim());
            }catch(e4){
              d.eptotal=0;
            }
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
      }
      h.innerHTML='';
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
          hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
          hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
          var infotxt='';
          if (d.adult){
            infotxt+='<span class="info_adult">18+</span>';
          }
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.ep){
            infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
          }
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
        }
        while (g.P.childElementCount>60){
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        }
        g.__update_pre();
  
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);
      }
      _API.showIme(false);
    },
    
    dosearch:function(getpage){
      if (home.search.kw.value!=''||home.search.genreval.length>0){
        var qv=[];
        qv.push('keyword='+enc(home.search.kw.value));
        for (var i=0;i<home.search.genreval.length;i++){
          var vl=home.search.genreval[i];
          if (vl.charAt(0)=='_'){
            qv.push(enc('type[]')+'='+enc(_API.genres[vl]));
          }
          else{
            qv.push(enc('genre[]')+'='+enc(_API.genres[vl]));
          }
        }
        qv.push('genre_mode=and');
        if (!pb.cfg_data.nonjapan){
          qv.push(enc('country[]')+'=120822');
        }
        qv.push(enc('language[]')+'=sub');
        if (home.search.kw.value==''){
          qv.push('sort=recently_updated');
        }
        if (getpage&&(getpage>1)){
          qv.push('page='+getpage);
        }
        else{
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
        }
        console.log(qv.join('&'));
        home.search.res.classList.add('searching');
        home.search.res._onload=1;
        $a('/filter?'+qv.join('&'),function(r){
          if (r.ok){
            home.search.dosearch_parse(r.responseText);
          }
          home.search.res.classList.remove('searching');
          home.search.res._onload=0;
        });
      }
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
        rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
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
          if (g._spre.length>0){
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
        if (g._spost.length>0){
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
    open:function(arg){
      home.search.sel=0;
      home.search.menus=[
        home.search.kw,
        home.search.genres,
        home.search.res
      ];
      home.search.initresult(home.search.res);

      _API.setUri("/filter");

      home.onsearch=true;
      home.search.search.classList.add('active');
      home.search.sel=0;
      home.search.kw._keycb=home.search.kwcb;
      home.search.kw.value='';
      var srcgenre='';

      home.search.kw.classList.remove('active');
      home.search.genres.classList.remove('active');
      home.search.res.classList.remove('active');

      if (arg){
        if (arg.kw){
          home.search.kw.value=arg.kw;
        }
        else if (arg.genre){
          srcgenre=arg.genre;
        }
      }

      pb.menu_clear(home.search.genres);
      home.search.genreval=[];
      //home.search.genres._keycb=pb.menu_keycb;
      pb.menu_init(home.search.genres);
      home.search.genres._enter_cb=home.search.genresel;
      home.search.genres._els={};
      var vsel=null;
      for (var i in _API.genres){
        var title=i.replace(/_/g," ").toUpperCase().trim();
        var gn=$n('div','',{
          action:'!'+i,'gid':_API.genres[i]
        },
        home.search.genres.P,special(title));
        gn._title=title;
        gn._key=i;
        if (srcgenre){
          if (srcgenre==i){
            vsel=gn;
            gn.innerHTML='<c>check</c> '+special(title);
            home.search.genreval.push(i);
          }
        }
        home.search.genres._els[i]=gn;
      }
      if (vsel){
        pb.menu_select(home.search.genres,vsel);
        home.search.sel=1;
      }
      else{
        pb.menu_select(home.search.genres,home.search.genres.P.firstElementChild);
      }

      setTimeout(function(){
        home.search.update(home.search.sel);
      },500);
      home.search.dosearch();
    }
  },
  onsearch:false,
  search_keycb:function(c){
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }

    var pc=home.search.sel;
    if (c==KBACK){
      home.search.close();
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      home.search.menus[pc]._keycb(home.search.menus[pc],c);
    }
    else if (c==KUP){
      if (--pc<0) pc=0;
    }
    else if (c==KDOWN){
      if (++pc>=home.search.menus.length) pc=home.search.menus.length-1;
    }
    if (home.search.sel!=pc){
      home.search.update(pc);
    }
  },

  header_keycb:function(g,c){
    var ca=home.home_search.classList.contains('active');
    if (c==KLEFT||c==KRIGHT){
      if (ca){
        home.home_settings.classList.add('active');
        home.home_search.classList.remove('active');
      }
      else{
        home.home_settings.classList.remove('active');
        home.home_search.classList.add('active');
      }
    }
    else if (c==KENTER){
      if (ca){
        home.search.open({
          // genre:'romance'
        });
      }
      else{
        // OPEN SETTINGS
        home.settings.open(0);
        // _API.theme_next();
      }
    }
  },

  /* Root Key Callback */
  keycb:function(c){
    if (home.onsearch){
      return home.search_keycb(c);
    }
    if (home.onsettings){
      return home.settings_keycb(c);
    }
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }
    var pc=home.menu_sel;
    if (c==KBACK){
      if (home.menu_sel==0){
        _JSAPI.appQuit();
      }
      else{
        pc=0;
      }
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      home.menus[home.menu_sel]._keycb(home.menus[home.menu_sel],c);
    }
    else if (c==KUP){
      if (--pc<0) pc=0;
    }
    else if (c==KDOWN){
      if (++pc>=home.menus.length) pc=home.menus.length-1;
    }

    if (home.menu_sel!=pc){
      home.menus[home.menu_sel].classList.remove('active');
      home.menu_sel=pc;
      home.menus[home.menu_sel].classList.add('active');
      if (home.menu_sel>1){
        var ty=(home.menus[2].offsetTop+(home.menus[2].offsetHeight*(home.menu_sel))) - (window.innerHeight + (window.innerWidth*0.06));
        if (ty<0) ty=0;
        home.home_scroll.style.transform="translateY("+(0-ty)+"px)";
      }
      else
        home.home_scroll.style.transform="translateY(0)";
      if (home.menu_sel>1)
        home.home_header.classList.add('scrolled');
      else
        home.home_header.classList.remove('scrolled');
    }
  },
};


/* Argument Update */
window.__ARGUPDATE=function(){
    var uri=_JSAPI.getArg("url");
    var tip=_JSAPI.getArg("tip");
    var pos=_JSAPI.getArg("pos");
    if (uri){
        console.log("ATVLOG ARGUPDATE -> "+uri+" / "+pos+" / "+tip);
        pb.open("https://"+__DNS+uri, tip,0,pos);
    }
};

/* MAL API */
const _MAL={
  token:"",
  auth:null,
  limit:12,
  data:{},
  islogin:function(){
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
    console.log("MAL-INIT: "+maldata);
    if (maldata){
      try{
        _MAL.auth = JSON.parse(maldata);
        if ('access_token' in _MAL.auth){
          _MAL.token=_MAL.auth.access_token;
          if (_MAL.exp<$time()){
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
    console.log("MAL-TOKEN: "+_MAL.token);
  },
  req:function(uri, method, cb){
    if (!_MAL.token){
      cb({ok:false,responseText:''});
      return;
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
    xhttp.send();
  },
  list:function(offset,cb){
    var uri='/v2/users/@me/animelist?nsfw=true&'+
      'fields=list_status,start_season,num_episodes,media_type,mean,alternative_titles,studios&'+
      'status=watching&'+
      'limit='+_MAL.limit;
    if (offset){
      uri+='&offset='+offset;
    }
    _MAL.req(uri,"GET",cb);
  },
  set_ep:function(animeid, ep, cb){
    var uri='/v2/anime/'+animeid+'/my_list_status?num_watched_episodes='+ep;
    _MAL.req(uri,"PUT",cb);
  },
  login:function(){
    if (_MAL.token){
      if (confirm('Are you sure you want to logout MyAnimeList integration?')){
//        localStorage.removeItem(_API.user_prefix+"mal_auth");
        _JSAPI.storeDel(_API.user_prefix+"mal_auth");
        _API.showToast("MyAnimeList logout sucessfull...");
        _API.reload();
      }
    }
    else{
      _JSAPI.malLogin();
    }
  },
  onlogin:function(d){
    if (d){
      if (('access_token' in d) && ('expires_in' in d)){
        var dt={
          access_token:d.access_token,
          exp:d.expires_in+$time(),
          expires_in:d.expires_in,
          refresh_token:d.refresh_token,
          user:d.user
        };
//        localStorage.setItem(_API.user_prefix+"mal_auth",JSON.stringify(dt));
        _JSAPI.storeSet(_API.user_prefix+"mal_auth",JSON.stringify(dt));
        console.log("MAL-ONLOGIN: "+JSON.stringify(dt));
        _API.showToast("MyAnimeList login sucessfull...");
        _API.reload();
      }
      else{
        _API.showToast("MyAnimeList Login Failed"+(('message' in d)?": "+d.message:""));
      }
    }
  },
  home_loader:function(g){
    g._onload=1;
    var load_page=(g._page-1)*_MAL.limit;
    _MAL.list(load_page, function(r){
      if (r.ok){
        console.log("MAL-LIST: "+r.responseText);
        try{
          var v=JSON.parse(r.responseText);
          _MAL.list_parse(g,v);
        }catch(e){
        }
        g._onload=0;
      }
      else{
        setTimeout(function(){_MAL.home_loader(g)},10000);
        console.log("MAL-LIST: ERROR");
      }
    });
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
    if ('data' in v){
      try{
        if (v.data.length>0){
          for (var i=0;i<v.data.length;i++){
            var d=v.data[i];
            var malid="mal_"+d.node.id;
            _MAL.data[malid]=JSON.parse(JSON.stringify(d));
            var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
            hl._img=$n('img','',{loading:'lazy',src:d.node.main_picture.medium},hl,'');
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
            var mtp=d.node.media_type;
            if (mtp&&(mtp!='unknown')){
              infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
            }
            if (numep){
              infotxt+='<span class="info_ep">'+special(numep+"")+'</span>';
            }
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          while (g.P.childElementCount>30){
            g._spre.push(g.P.firstElementChild.nextElementSibling);
            g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          }
          g.__update_pre();
    
          if (!g._sel)
            pb.menu_select(g,g.P.firstElementChild);
          else
            pb.menu_select(g,g._sel);
        }
      }catch(e){}
    }
  },
  srcanime:function(d,cb){
    if ('srcanime' in d){
      cb(d.srcanime);
      return;
    }
    var id=d.node.id;
    var kw=d.node.title;
    var ses=d.node.start_season.season;
    var y=d.node.start_season.year;
    var uri='/filter?keyword='+enc(kw)+'&season='+enc(ses)+'&year='+enc(y+'')+'&sort=most_relevance';
    $a(uri,function(r){
      if (r.ok){
        var rd=home.search.parse(r.responseText);
        console.log('ANIMESRC ['+id+'] = '+JSON.stringify(rd));
        d.srcanime=rd;
        cb(d.srcanime);
        return;
      }
      d.srcanime=[];
      cb(d.srcanime);
    });
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
          if (r.length>0){
            if (_MAL.onpopup){
              console.log("MAL ACTION START...");
              // pb.open(r[0].url, r[0].tip);
              _MAL.preview(
                r[0].url, r[0].poster, r[0].title, r[0].tip, 
                d.list_status.num_episodes_watched, 0, 0, 
                ''
              );
            }
            // _MAL.popup(
            //   r[0].url,
            //   r[0].tip,
            //   r[0].title,
            //   r[0].poster,
            //   r[0].epavail,
            //   d.list_status.num_episodes_watched,
            //   d.node.id,
            //   r[0].adult?'R+':''
            // );
            return;
          }
          _MAL.popup_close();
          _API.showToast("Matching anime not found...");
        });
      }
    }catch(e){
      console.log("Error MAL Action : "+e);
      _MAL.popup_close();
    }
  },
  pop:{
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
  pop_keycb:function(c){
    if (!_MAL.pop.var.ready){
      if (c==KBACK){
        _MAL.popup_close();
      }
      return;
    }
    var pc=_MAL.pop.menusel;
    if (c==KBACK){
      _MAL.popup_close();
    }
    else if (c==KENTER){
      var openurl=_MAL.pop.var.url;
      var el=_MAL.pop.menu[pc];
      var epsel=0;

      /* Watchlist & History */
      if (el==_MAL.pop.watchlist){
        if (_MAL.pop.var.animeid){
          if (_MAL.pop.var.infav){
            /* Delete from Fav */
            list.fav_del(_MAL.pop.var.animeid);
          }
          else{
            /* Add to fav */
            var obep=_MAL.pop.var.resume?_MAL.pop.var.resume:1;
            var ob={
              'url':openurl,
              'title':_MAL.pop.var.title,
              'title':_MAL.pop.var.title_jp,
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
        home.list_init_name(list.fav,home.home_fav);
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
        home.list_init_name(list.history,home.home_history);
        return;
      }

      if (el==_MAL.pop.next){
        openurl+='/ep-'+_MAL.pop.var.next;
        epsel=_MAL.pop.var.next;
      }
      else if (el==_MAL.pop.resume){
        openurl+='/ep-'+_MAL.pop.var.resume;
        epsel=_MAL.pop.var.resume;
      }
      else if (el==_MAL.pop.ep){
        openurl+='/ep-'+_MAL.pop.var.ep;
        epsel=_MAL.pop.var.ep;
      }
      console.log("MAL Open Anime = "+openurl);
      _MAL.popup_close();
      
      var currtime=null;
      if (toInt(epsel)==_MAL.pop.var.play.e){
        currtime=_MAL.pop.var.play.c;
      }
      pb.open(openurl, _MAL.pop.var.ttip, undefined, currtime, _MAL.pop.var.malid);
    }
    else if (c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      if (_MAL.pop.ep==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          if (--_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
        }
        else if (c==KRIGHT){
          if (++_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
        }
        else if (c==KPGUP){
          _MAL.pop.var.ep-=10;
          if (_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
        }
        else if (c==KPGDOWN){
          _MAL.pop.var.ep+=10;
          if (_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
        }
        _MAL.pop.setEp();
      }
      else if (_MAL.pop.watchlist==_MAL.pop.menu[pc]){
        if (c==KRIGHT){
          _MAL.pop_keycb(KDOWN);
        }
        return;
      }
      else if (_MAL.pop.history==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          _MAL.pop_keycb(KUP);
        }
        return;
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
      _MAL.pop.menusel=pc;
      _MAL.popup_update();
    }
  },
  popup_close:function(){
    _MAL.pop.mv.className='';
    $('popupcontainer').className='';
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
    var url_parse=url.split('/');
    if (url_parse.length>=5){
      var animeid=_MAL.pop.var.animeid=url_parse[4];
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
      _MAL.pop.rating.innerHTML='18+';
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
  preview_do:function(url, img, ttid, currep, tcurr, tdur,d,arg){
    if (!_MAL.onpopup){
      return;
    }
    var numep=toInt(d.ep);
    currep=toInt(currep);
    _MAL.pop.title.innerHTML=tspecial(d.title);
    _MAL.pop.title.setAttribute('jp',d.title_jp?d.title_jp:d.title);

    _MAL.pop.img.src=img;
    _MAL.pop.menu=[
      _MAL.pop.begin
    ];
    _MAL.pop.var.url=url;
    _MAL.pop.var.ttip=ttid;
    _MAL.pop.var.malid=null;
    _MAL.pop.menusel=0;

    _MAL.pop.var.title=d.title;
    _MAL.pop.var.title_jp=d.title_jp;
    _MAL.pop.var.img=img;

    _MAL.pop.var.play.c=tcurr;
    _MAL.pop.var.play.d=tdur;
    _MAL.pop.var.play.e=currep;

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
      _MAL.pop.menusel=1;
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
  },
  preview:function(url, img, titl, ttid, ep, tcurr, tdur,arg){
    var url_parse=url.split('/');
    var defdat={
      title:titl,
      ep:0,
      rating:''
    };
    if (url_parse.length>=5){
      if (ttid){
        if(url_parse.length==6){
          url_parse.pop();
          url=url_parse.join('/');
        }
        _MAL.pop.mv.className='active loading';
        $('popupcontainer').className='active';
        _MAL.pop.var.ready=false;
        _MAL.onpopup=true;
        _API.getTooltip(ttid,function(d){
          if (d){
            _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,d,arg);
            return;
          }
          _MAL.preview_do(url, img, ttid, ep, tcurr, tdur, defdat,arg);
          return;
        });
        return;
      }
    }
    // pb.open(url, ttid, 0, tcurr);
    _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,defdat,arg);
  },
  prev_action_handler:function(data,arg){
    try{
      var j=JSON.parse(data);
      _MAL.preview(j.url, j.img, j.title, j.ttip, j.ep, j.sp, j.tp,arg);
    }catch(e){
    }
  },
};

window.__ARGUPDATE();
_MAL.init();
home.init();
_API.bgimg_update();

(function(){
  var xDown = null;
  var yDown = null;
  var tIsMove=false;
  function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }
  function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      tIsMove=false;
  }
  function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
          return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      var minMove=window.innerWidth*0.07;
      var minCancel=window.innerWidth*0.02;
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
    if (!tIsMove){
      window._KEYEV(KENTER,1);
    }
    tIsMove=false;
  }
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);
})();