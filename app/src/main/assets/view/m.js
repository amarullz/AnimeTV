/* Body */
const body=document.body;

/* getId */
function $(i){
  return document.getElementById(i);
}

/* ajax request */
function $a(uri, cb){
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
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
  return str.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

/* make search query url from object */
function query(r){
  var v=[];
  for (var i in r){
    v.push(i+'='+enc(r[i]));
  }
  return v.join('&');
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

/**************************** GLOBAL LISTENERS ***************************/
/* Key event handler */
window._KEYEV=function(key){
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

/* mp4upload url callback */
window.__MP4CB=function(d){
  if(_API.mp4cb) 
  _API.mp4cb(d);
};

/* Key codes */
const KUP=38;
const KDOWN=40;
const KLEFT=37;
const KRIGHT=39;
const KBACK=27;
const KENTER=13;
const KPGUP=33;
const KPGDOWN=34;

/***************************** API HANDLERS *****************************/
const _API={
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
    var itm=localStorage.getItem("theme");
    if (itm){
      document.documentElement.className=itm;
      _API.theme_sel=_API.theme_list.indexOf(itm);
      if (_API.theme_sel<0) _API.theme_sel=0;
    }
    else{
      document.documentElement.className='';
    }
  },
  theme_next:function(){
    if (++_API.theme_sel>=_API.theme_list.length)
      _API.theme_sel=0;
    localStorage.setItem("theme", _API.theme_list[_API.theme_sel]);
    _API.theme_update();
  },
  keycb:null,
  messagecb:null,
  mp4cb:null,
  viewcb:null,
  m3u8cb:null,
  viewid:0,
  genres:{
  "_tv":"tv","_movie":"movie",
  "_ova":"ova","_ona":"ona",
  "_special":"special",

  "action":"1","adventure":"2","avant_garde":"2262888",
  /*"boys_love":"2262603",*/
  "comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9",
  /*"girls_love":"2263743",*/
  "gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552","josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18","mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25","reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31","shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38","supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"},
  
  showIme:function(show){
    _JSAPI.showIme(show);
  },

  clearCb:function(){
    _API.keycb=null;
    _API.messagecb=null;
    _API.mp4cb=null;
    _API.viewcb=null;
    _API.m3u8cb=null;
  },

  /* set vizcloud m3u8 callback */
  setVizCb:function(f){
    _API.m3u8cb=f;
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
    if (_JSAPI.getview(url,uid))
      return uid;
    return false;
  },

  /* get mp4upload mp4-video url */
  getMp4:function(url, f){
    _API.mp4cb=f;
    _JSAPI.getmp4vid(url);
  },

  getTooltip:function(id, cb){
    $a("https://9anime.to/ajax/anime/tooltip/"+id+"?"+$tick(),function(r){
      if (r.ok){
        var d=$n('div','',0,0,r.responseText);
        var o={
          title:'',
          title_jp:'',
          synopsis:'',
          genres:[],
          rating:null,
          quality:null
        };
        var tt=d.querySelector('div.title.d-title');
        if (tt){
          o.title=tt.textContent.trim();
          o.title_jp=tt.getAttribute('data-jp');
        }
        try{
          o.synopsis=d.querySelector('div.synopsis').textContent.trim();
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
        d=null;
        cb(o);
      }
      else
        cb(null);
    });
  },

  vidInterval:null,
  videoGetPos:function(){
    return {
      position:_JSAPI.videoGetPosition()/1000.0,
      duration:_JSAPI.videoGetDuration()/1000.0
    };
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
      },100);
    }
    else{
      body.classList.remove('playback_on_video');
      _JSAPI.videoSetUrl("");
    }
  }
};
_API.setVideo('');
_API.theme_update();

/****************************** HISTORY & WATCHLIST ******************************/
const list={
  history:{detail:{},list:[]},
  fav:{detail:{},list:[]},
  load_storage:function(name){
    var itm=localStorage.getItem(name);
    if (itm){
      var j=JSON.parse(itm);
      if (('detail' in j)&&('list' in j)){
        return {detail:j.detail,list:j.list};
      }
    }
    return {detail:{},list:[]};
  },
  save:function(o,name){
    localStorage.setItem(name,JSON.stringify(o));
    console.log(o);
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
  history_del:function(id,val){
    list.del(list.history,id,val);
    list.history_save();
  },
  fav_save:function(){
    list.save(list.fav,'list_fav');
  },
  fav_add:function(id,val){
    list.add(list.fav,id,val);
    list.fav_save();
  },
  fav_del:function(id,val){
    list.del(list.fav,id,val);
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
    console.log(list.history);
    console.log(list.fav);
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
  pb_track_pos:$('pb_track_pos'),
  pb_track_dur:$('pb_track_dur'),
  pb_track_ctl:$('pb_track_ctl'),
  pb_track_title:$('pb_track_title'),

  /* meta elements */
  pb_title:$('pb_title'),
  pb_desc:$('pb_desc'),

  pb_event_skip:$('pb_event_skip'),

  listobj:function(){
    var ob={
      'url':pb.data.url,
      'title':pb.data.title,
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

  cfg_data:{
    autoskip:false,
    autonext:true,
    skipfiller:false,
    server:0
  },
  cfg_load:function(){
    var itm=localStorage.getItem('pb_cfg');
    if (itm){
      var j=JSON.parse(itm);
      if (j){
        pb.cfg_data.autoskip=('autoskip' in j)?(j.autoskip?true:false):false;
        pb.cfg_data.autonext=('autonext' in j)?(j.autonext?true:false):true;
        pb.cfg_data.skipfiller=('skipfiller' in j)?(j.skipfiller?true:false):false;

        pb.cfg_data.server=0;
        if ('server' in j){
          var sv=parseInt(j.server);
          if (sv&&sv>0&&sv<=2)
          pb.cfg_data.server=sv;
        }
        return;
      }
    }
    pb.cfg_data.autoskip=false;
    pb.cfg_data.autonext=true;
    pb.cfg_data.skipfiller=false;
    pb.cfg_data.server=0;
  },
  cfgserver_name:[
    'VIZCLOUD M3U8',
    'VIZCLOUD HTML5',
    'MP4UPLOAD'
  ],
  cfg_save:function(){
    localStorage.setItem('pb_cfg',JSON.stringify(pb.cfg_data));
  },
  cfg_update_el:function(key){
    if (key){
      if (key=='fav'){
        var el=pb.pb_settings['_s_'+key];
        if (pb.data.animeid){
          if (list.fav_exists(pb.data.animeid)){
            el.innerHTML='<c>clear</c> REMOVE FROM WATCHLIST';
          }
          else{
            el.innerHTML='<c>bookmark_border</c> ADD TO WATCHLIST';
          }
        }
      }
      else if (key in pb.cfg_data){
        var el=pb.pb_settings['_s_'+key];
        if (key=='server'){
          el.lastElementChild.innerHTML=pb.cfgserver_name[pb.cfg_data[key]];
        }
        else{
          if (el){
            el.firstElementChild.innerHTML=pb.cfg_data[key]?'check':'clear';
          }
        }
      }
    }
    else{
      pb.cfg_update_el('autoskip');
      pb.cfg_update_el('autonext');
      pb.cfg_update_el('skipfiller');
      pb.cfg_update_el('server');
      pb.cfg_update_el('fav');
    }
  },
  cfg:function(v){
    if (v=='server') return pb.cfg_data.server;
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

      pb.pb_loading.classList.remove('active');
      pb.pb.classList.remove('active');
      _API.clearCb();
      _API.setKey(home.keycb);
      home.list_init();
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
    }
    else if (c=='pause'){
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
  init_video_mp4upload:function(src){
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

    _API.setVizCb(function(d){
      try{
        if (d.data.media.sources){
          var urivid=(d.data.media.sources.length>1)?d.data.media.sources[1].file:d.data.media.sources[0].file;
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
      }catch(e){}
    });

    pb.pb_vid.innerHTML='';
    requestAnimationFrame(function(){
      pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
    });
  },

  init_video:function(){
    pb.pb_vid.innerHTML='';
    pb.vid=pb.vid_get_time_cb=pb.vid_cmd_cb=null;
    pb.vid_reset_stat();
    
    pb.lastkey=$tick();
    _API.setMessage(null);
    
    requestAnimationFrame(function(){
      pb.state=1;
      pb.track_update_pos();
      pb.pb_track_ctl.innerHTML='change_circle';
      pb.pb_track_ctl.className='loader';
      pb.pb_track_pos.innerHTML='STREAMING VIDEO';
      pb.pb_track_dur.innerHTML='';

      if (pb.data.mp4&&(pb.cfg('server')==2)){
        if (pb.data.__mp4uploadurl){
          pb.init_video_mp4upload(pb.data.__mp4uploadurl);
        }
        else{
          console.log("GOT STREAM MP4");
          _API.getMp4(pb.data.stream_url,function(d){
            try{
              if (d&&d.src){
                pb.data.__mp4uploadurl=d.src;
                pb.init_video_mp4upload(d.src);
                return;
              }
            }catch(e){}
            pb.init_video_vidcloud();
          });
        }
      }
      else{
        pb.init_video_vidcloud();
      }
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
      console.log([this,ev]);
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
    else if (c==KPGUP){
      if (g.__prev){
        g.__prev();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.firstElementChild;
      }
    }
    else if (c==KPGDOWN){
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
    if (c==KLEFT){
      pb.vid_cmd('seek',pb.vid_get_time().position-10);
      pb.track_update_pos();
    }
    else if (c==KRIGHT){
      pb.vid_cmd('seek',pb.vid_get_time().position+10);
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
    pb.lastkey=$tick();
    if (pb.pb_actions.classList.contains('active')){
      if (c==KBACK){
        pb.menu_hide();
      }
      else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
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
        pb.reset(1,0);
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
    // $n('div','',{action:'-prev'},pb.pb_settings,'<c>skip_previous</c> PREV');
    // $n('div','',{action:'-next'},pb.pb_settings,'NEXT <c>skip_next</c>');
    //fav_exists
    pb.pb_settings._s_fav=$n('div','',{action:'*fav'},pb.pb_settings.P,'');
    pb.pb_settings._s_autonext=$n('div','',{action:'*autonext'},pb.pb_settings.P,'<c>check</c> AUTO NEXT');
    pb.pb_settings._s_autoskip=$n('div','',{action:'*autoskip'},pb.pb_settings.P,'<c>clear</c> AUTO SKIP INTRO');
    pb.pb_settings._s_skipfiller=$n('div','',{action:'*skipfiller'},pb.pb_settings.P,'<c>clear</c> SKIP FILLER');
    pb.pb_settings._s_server=$n('div','',{action:'*server'},pb.pb_settings.P,'<c>cloud_done</c> <span>SERVER</span>');
    pb.menu_select(pb.pb_settings,pb.pb_settings.P.firstElementChild);
    pb.pb_settings._midx=2;
    pb.cfg_update_el();
  },

  init:function(){
    $('home').style.display=$('search').style.display='none';

    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'), url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'-w100)';

    /* META */
    pb.ep_num='';
    pb.ep_title='';
    pb.pb_title.innerHTML=special(pb.data.title);
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
    pb.pb_desc.innerHTML=addb+special(pb.data.synopsis);

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
    /* settings */
    pb.init_settings();
    console.log(pb.data);

    /* season */
    pb.menu_clear(pb.pb_seasons);
    if (pb.data.seasons&&pb.data.seasons.length){
      pb.menus.push(pb.pb_seasons);
      var act=null;
      for (var i=0;i<pb.data.seasons.length;i++){
        var d=pb.data.seasons[i];
        var hl=$n('div',d.active?'playing':'',{action:d.url},pb.pb_seasons.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
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
        hl._title=$n('b','',null,hl,special(d.title));
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
        hl._title=$n('b','',null,hl,special(d.title));
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
        pb.url_value.substring("https://9anime.to".length),
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

  open:function(uri, ttid, noclean, startpos){
    console.log("pb.open -> "+noclean+" / "+ttid);
    var open_stat=0;
    var uid=_API.getView(uri,function(d,u){
      open_stat=1;
      if (uid==u && d.status){
        console.log(d);
        pb.data=d;
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
              pb.pb_title.innerHTML=special(d.title);
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

// pb.open('https://9anime.to/watch/one-piece.ov8/ep-52',177,0);
// pb.open('https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc.3r7p6/ep-1',15065,0);
// pb.open('https://9anime.to/watch/insomniacs-after-school.522om/ep-10', '14891?/4324324',0);
//pb.open('https://9anime.to/watch/vinland-saga-season-2.kwo44/ep-1', 14049,0);
// pb.open('https://9anime.to/watch/gamers.47rx/ep-4','',0);
// pb.open('https://9anime.to/watch/the-pet-girl-of-sakurasou.rxm/ep-1','',0);

/*
Blacklist domain:
rosebudemphasizelesson.com
simplewebanalysis.com
rosebudemphasizelesson.com
rosebudemphasizelesson.com

*/

const home={
  home_onload:false,
  home:$('home'),
  home_scroll_mask:$('home_scroll_mask'),
  home_scroll:$('home_scroll'),
  home_slide:$('home_slide'),
  home_recent:$('home_recent'),
  home_trending:$('home_trending'),
  home_random:$('home_random'),
  home_top:$('home_top'),

  home_history:$('home_history'),
  home_fav:$('home_fav'),

  home_header:$('home_header'),
  home_search:$('home_search'),
  home_theme:$('home_theme'),
  bgimg:null,

  recent_parse:function(g,v){
    var hd=$n('d','','',null,v);
    var it=hd.querySelectorAll('div.item');
    var rd=[];
    for (var i=0;i<it.length;i++){
      var t=it[i];
      try{
        var d={};
        var at=t.querySelector('a.d-title');
        d.url=at.href;
        d.poster=t.querySelector('img').src;
        d.title=at.textContent.trim();
        d.type=t.querySelector('div.right').textContent;
        d.ep=t.querySelector('span.ep-status').textContent.trim();
        d.tip=t.firstElementChild.getAttribute('data-tip');
        rd.push(d);
      }catch(e){
        console.log(e);
      }
    }
    hd.innerHTML='';
    if (rd&&rd.length){
      for (var i=0;i<rd.length;i++){
        var d=rd[i];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
        var infotxt='';
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
  recent_init:function(rc){
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
      home.recent_load(rc);
    };
    home.recent_load(rc);
  },

  home_parser:function(v){
    var h=$n('div','','',null,v);
    hd=[];
    td=[];
    window.h=h;
    try{
      /* hottest */
      var hots=h.querySelector('div#hotest').querySelectorAll('div.swiper-slide.item');
      for (var i=0;i<hots.length;i++){
        var t=hots[i];
        var d={};
        var tt=t.querySelector('h2.d-title');
        d.title=tt.textContent.trim();
        d.title_jp=tt.getAttribute('data-jp');
        d.rating=t.querySelector('i.rating').textContent;
        d.quality=t.querySelector('i.quality').textContent;
        d.synopsis=t.querySelector('div.synopsis').textContent;
        d.url=t.querySelector('a').href;
        d.poster=t.querySelector('div.image div').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        hd.push(d);
      }
    }catch(e){}

    try{
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
        td.push(d);
      }
    }catch(e){}

    if (hd.length>0){
      for (var i=0;i<hd.length;i++){
        var d=hd[i];
        var hl=$n('div','',{action:d.url,arg:';0'},home.home_slide.P,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(home.home_slide,home.home_slide.P.firstElementChild);
    }

    if (td.length>0){
      for (var i=0;i<td.length;i++){
        var d=td[i];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},home.home_top.P,'');
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(home.home_top,home.home_top.P.firstElementChild);
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
          if (d.play&&(d.play.length==2)){
            vplay=d.play;
            addarg=';'+d.play[0];
          }
          var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'+addarg},h.P,'');
          var ps=d.poster.split('-w100');
          d.poster=ps[0];
          hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
          hl._title=$n('b','',null,hl,special(d.title));
          var infotxt='';
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.ep){
            infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
          }
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
    console.log(home);
    console.log(home.home_history);
    home.list_init_name(list.fav,home.home_fav);
    home.list_init_name(list.history,home.home_history);
  },
  init:function(){
    list.load();

    home.home_recent._ajaxurl='/ajax/home/widget/updated-sub?page=';
    home.home_trending._ajaxurl='/ajax/home/widget/trending?page=';
    home.home_random._ajaxurl='/ajax/home/widget/random?page=';
    home.recent_init(home.home_recent);
    home.recent_init(home.home_trending);
    home.recent_init(home.home_random);
    

    home.home_load();

    _API.setKey(home.keycb);

    home.menus=[
      home.home_header,
      home.home_slide,
      home.home_recent,
      home.home_top,
      home.home_trending,
      home.home_random,
      home.home_fav,
      home.home_history
    ];

    home.list_init();

    pb.menu_clear(home.home_slide);
    pb.menu_clear(home.home_top);

    home.home_slide._itemwidth=function(){
      return (window.innerWidth * 0.3);
    };
    // home.home_slide._keycb=pb.menu_keycb;
    // home.home_top._keycb=pb.menu_keycb;
    pb.menu_init(home.home_slide);
    pb.menu_init(home.home_top);
    home.menus[home.menu_sel].classList.add('active');

    // home.bgimg=new Image();
    // home.bgimg.className='mainbgimage nonactive';
    // home.bgimg.onload=function(){
    //   body.appendChild(home.bgimg);
    //   setTimeout(function(){
    //     home.bgimg.className='mainbgimage';
    //   },10);
    // };
    // home.bgimg.src='bg.webp';
    // home.bgimg.style.zIndex='1';

    home.home_header._keycb=home.header_keycb;
    home.home_search.classList.add('active');
  },

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
    },
    dosearch_parse:function(v){
      var h=$n('div','','',null,v);
      var rd=[];
      var ls=h.querySelector('#list-items');
      window._ls=ls;
      if (ls){
        var it=ls.querySelectorAll('div.item');
        for (var i=0;i<it.length;i++){
          var im=it[i];
          var d={};
          var tt=im.querySelector('a.d-title');
          d.url=tt.href;
          d.title=tt.textContent.trim();
          d.poster=im.querySelector('img').src;
          d.tip=im.querySelector('div.poster.tip').getAttribute('data-tip');
          var epel=im.querySelector('span.ep-status.total');
          if (!epel)
            epel=im.querySelector('span.ep-status.sub');
          if (epel){
            d.ep=(epel.textContent+'').trim();
          }
          try{
            d.type=im.querySelector('div.right').textContent.trim();
          }catch(e){}
          rd.push(d);
        }
      }
      h.innerHTML='';

      var g=home.search.res;
      g._havenext=false;
      if (rd&&rd.length){
        g._havenext=(rd.length>=28);
        for (var i=0;i<rd.length;i++){
          var d=rd[i];
          var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
          hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
          hl._title=$n('b','',null,hl,special(d.title));
          var infotxt='';
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
        qv.push(enc('country[]')+'=120822');
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
        home.home_theme.classList.add('active');
        home.home_search.classList.remove('active');
      }
      else{
        home.home_theme.classList.remove('active');
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
        _API.theme_next();
      }
    }
  },

  /* Root Key Callback */
  keycb:function(c){
    if (home.onsearch){
      return home.search_keycb(c);
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
      if (home.menu_sel>1)
        home.home_scroll.style.transform="translateY("+(18-(21.65*(home.menu_sel-1)))+"vw)";
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
        pb.open("https://9anime.to"+uri, tip,0,pos);
    }
};

window.__ARGUPDATE();
home.init();

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
            window._KEYEV(KDOWN);
          } else {
            /* up swipe */
            window._KEYEV(KUP);
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
            window._KEYEV(KRIGHT);
          } else {
            window._KEYEV(KLEFT);
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
      window._KEYEV(KENTER);
    }
    tIsMove=false;
  }
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);
})();