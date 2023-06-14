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
  keycb:null,
  messagecb:null,
  mp4cb:null,
  viewcb:null,
  m3u8cb:null,
  viewid:0,
  genres:{"action":"1","adventure":"2","avant_garde":"2262888","boys_love":"2262603","comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9","girls_love":"2263743","gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552","josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18","mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25","reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31","shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38","supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"},
  
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

  cfg:function(v){
    if (v=='autoskip'){
      return true;
    }
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
      pb.pb_loading.classList.remove('active');
      pb.pb.classList.remove('active');
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
  vid_event:function(c,v){
    if (c=='complete'){
    }
    else if (c=='ready'){
      pb.state=2;
      pb.pb_track_ctl.innerHTML='play_circle';
      pb.pb_track_ctl.className='';
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
              sk=pb.data.skip[i][1];
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
    }
  },
  vid_reset_stat:function(){
    pb.vid_stat.ready=false;
    pb.vid_stat.pos=0;
    pb.vid_stat.duration=0;
    pb.vid_stat.play=false;
  },

  /* view data */
  data:null,
  ep_title:'',
  ep_index:-1,
  lastkey:0,
  state:0,

  /* action command handler */
  action_handler:function(action,arg){
    if (!action) return false;
    console.log("action_handler -> "+action+" / "+arg);
    if (action.startsWith("http")){
      var args=[0,0];
      if (arg)
        args=arg.split(';');
      pb.open(action, args[0], parseInt(args[1]));
      return true;
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

  /* menu selection */
  menu_select:function(g,n){
    if (n){
      var fc=g.firstElementChild;
      if (!fc) return false;
      if (!g._midx) g._midx=2;
      if (!g.__update){
        g.__update=function(){
          if (g._sel)
            g._sel.classList.remove('active');
          var n = g._target_n;
          n.classList.add('active');
          var iw=window.innerWidth/g._midx;
          var ol=n.offsetLeft+(n.offsetWidth/2);
          var xpos = ol-parseInt(getComputedStyle(g.firstElementChild).marginLeft); //g._margin;
          if (xpos>iw){
            g._margin= xpos-iw; 
            g.classList.add('maskleft');
          }
          else{
            g._margin=0;
            g.classList.remove('maskleft');
          }
          g.firstElementChild.style.marginLeft="-"+g._margin+"px";
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
  menu_keycb:function(g,c,z){
    var n=null;
    if (!('_margin' in g)){
      g._margin=0;
      g._reset=function(){
        g._sel.classList.remove('active');
        g._sel=null;
        g._margin=0;
        g.classList.remove('maskleft');
        if (g.firstElementChild)
          g.firstElementChild.style.marginLeft="-"+g._margin+"px";
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
        n=g.firstElementChild;
    }
    else if (c==KPGUP){
      if (g.__prev){
        g.__prev();
        return true;
      }
      else{
        n=g.firstElementChild;
      }
    }
    else if (c==KPGDOWN){
      if (g.__next){
        g.__next();
        return true;
      }
      else{
        n=g.lastElementChild;
      }
    }
    if (n){
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
        _JSAPI.appQuit();
      }
    }
  },

  init_episode_title:function(d,idx){
    if (d.active){
      pb.ep_index=idx;
      pb.ep_title='EPISODE '+(d.ep);
      if (d.title)
        pb.ep_title+='. '+(d.title.toUpperCase());
    }
  },

  init_episode:function(start, spos){
    var paging_sz=50;
    pb.pb_episodes.innerHTML='';
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
        var hl=$n('div',d.active?'playing':'',{action:d.url,arg:';1'},pb.pb_episodes,special(d.ep)+adh);
        if (i==start){
          if (pb.pb_episodes._margin){
            hl.style.marginLeft="-"+pb.pb_episodes._margin+"px";
          }
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
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.firstElementChild);
      }
      else if (spos==2){
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.lastElementChild);
      }
    }
  },

  init_settings:function(){
    pb.pb_settings.innerHTML='';
    $n('div','',{url:'-prev'},pb.pb_settings,'<c>skip_previous</c> PREV');
    $n('div','',{url:'-next'},pb.pb_settings,'NEXT <c>skip_next</c>');
    $n('div','',{url:'-fav'},pb.pb_settings,'<c>bookmark_border</c> ADD TO WATCHLIST');
    $n('div','',{url:'-autonext'},pb.pb_settings,'<c>check</c> AUTO NEXT');
    $n('div','',{url:'-autoskip'},pb.pb_settings,'<c>clear</c> AUTO SKIP INTRO');
    $n('div','',{url:'-skipfiller'},pb.pb_settings,'<c>clear</c> SKIP FILLER');
    pb.menu_select(pb.pb_settings,pb.pb_settings.firstElementChild.nextElementSibling);
    pb.pb_settings._midx=2;
  },

  init_video_mp4upload:function(src){
    
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

    if (pb.state)
      pb.vid.src=src;
  },

  init_video_vidcloud:function(){
    console.log("ATVLOG VIDEO VIDCLOUD = "+pb.data.stream_vurl);

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
      // try{
      //   if (d.data.media.sources){
      //     var urivid=d.data.media.sources[0].file;
      //     console.log("ATVLOG Got VizCB = "+urivid);
      //     pb.pb_vid.innerHTML='';
      //     pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
      //     _API.setMessage(null);
      //     pb.init_video_mp4upload(urivid);
      //   }
      // }catch(e){}
    });

    pb.pb_vid.innerHTML='';
    requestAnimationFrame(function(){
      pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
    });
  },

  init:function(){
    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'), url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'-w100)';

    /* META */
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
    pb.pb_genres.innerHTML='';
    if (pb.data.genres||pb.data.info.type){
      if (pb.data.info.type){
        $n('div','',{action:'@'+pb.data.info.type.val},pb.pb_genres,special(pb.data.info.type.name));
      }
      if (pb.data.genres){
        for (var i=0;i<pb.data.genres.length;i++){
          $n('div','',{action:'!'+pb.data.genres[i].val},pb.pb_genres,special(pb.data.genres[i].name));
        }
      }
      pb.menu_select(pb.pb_genres,pb.pb_genres.firstElementChild);
    }

    /* settings */
    pb.init_settings();
    
    /* Episode */
    pb.pb_episodes.innerHTML='';
    if (pb.data.ep&&pb.data.ep.length){
      pb.menus.push(pb.pb_episodes);
      pb.init_episode(-1, 0);
      pb.pb_episodes.style.display='';
    }
    else{
      pb.pb_episodes.style.display='none';
    }

    /* season */
    pb.pb_seasons.innerHTML='';
    if (pb.data.seasons&&pb.data.seasons.length){
      pb.menus.push(pb.pb_seasons);
      var act=null;
      for (var i=0;i<pb.data.seasons.length;i++){
        var d=pb.data.seasons[i];
        var hl=$n('div',d.active?'playing':'',{action:d.url},pb.pb_seasons,'');
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
    pb.pb_related.innerHTML='';
    if (pb.data.related&&pb.data.related.length){
      pb.menus.push(pb.pb_related);
      for (var i=0;i<pb.data.related.length;i++){
        var d=pb.data.related[i];
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},pb.pb_related,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(pb.pb_related,pb.pb_related.firstElementChild);
      pb.pb_related.style.display='';
    }
    else{
      pb.pb_related.style.display='none';
    }

    /* recommendations */
    pb.pb_recs.innerHTML='';
    if (pb.data.recs&&pb.data.recs.length){
      pb.menus.push(pb.pb_recs);
      for (var i=0;i<pb.data.recs.length;i++){
        var d=pb.data.recs[i];
        var ps=d.poster.split('-w100');
        d.poster=ps[0];
        var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},pb.pb_recs,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(pb.pb_recs,pb.pb_recs.firstElementChild);
      pb.pb_recs.style.display='';
    }
    else{
      pb.pb_recs.style.display='none';
    }

    if (!pb.data.mp4){
      console.log("GOT STREAM MP4");
      _API.getMp4(pb.data.stream_url,function(d){
        try{
          if (d&&d.src){
            pb.init_video_mp4upload(d.src);
            return;
          }
        }catch(e){}
        pb.init_video_vidcloud();
      });
    }
    else{
      pb.init_video_vidcloud();
    }

    /* ACTIONS */
    pb.pb_genres._midx=4;
    pb.pb_settings._keycb=
    pb.pb_genres._keycb=
    pb.pb_episodes._keycb=
    pb.pb_seasons._keycb=
    pb.pb_related._keycb=
    pb.pb_recs._keycb=pb.menu_keycb;
    pb.pb_tracks._keycb=pb.track_keycb;
    pb.menusel=1;
    pb.pb_track_ctl.innerHTML='change_circle';
    pb.pb_track_ctl.className='loader';
    pb.pb_track_pos.innerHTML='STREAMING VIDEO';
    pb.pb_track_dur.innerHTML='';
    pb.pb_track_title.innerHTML=special(pb.ep_title);
    pb.pb_loading.classList.remove('active');
    requestAnimationFrame(function(){
      pb.lastkey=$tick();
      pb.state=1;
      pb.menu_show(1);
      _API.setKey(pb.keycb);
    });
  },

  open:function(uri, ttid, noclean){
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
                pb.pb_genres.innerHTML='';
                for (var i=0;i<d.genres.length;i++){
                  $n('div','',0,pb.pb_genres,special(d.genres[i].name));
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
          _JSAPI.appQuit();
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
pb.open('https://9anime.to/watch/gamers.47rx/ep-4','',0);
// pb.open('https://9anime.to/watch/the-pet-girl-of-sakurasou.rxm/ep-1','',0);

/*
Blacklist domain:
rosebudemphasizelesson.com
simplewebanalysis.com
rosebudemphasizelesson.com
rosebudemphasizelesson.com

*/