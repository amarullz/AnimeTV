function $(i){
  return document.getElementById(i);
}
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
function $n(t,c,a,p,h){
  var l=document.createElement(t);
  if (a!=undefined&&a){
    for (var i in a)
      l.setAttribute(i,a[i]);
  }
  if (c!=undefined&&c) l.className=c;
  if (h!=undefined) l.innerHTML=h;
  if (p!=undefined) p.appendChild(l);
  return l;
}
function special(str){
  return str.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function trim(s){
  var l = s.length;
  var w = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  for (var i = 0; i < l; i++) {
      if (w.indexOf(s.charAt(i)) === -1) {
          s = s.substr(i);
          break;
      }
  }
  l = s.length;
  for (var i=l-1;i>=0;i--){
      if (w.indexOf(s.charAt(i)) === -1) {
          s = s.substr(0, i + 1);
          break;
      }
  }
  return w.indexOf(s.charAt(0)) === -1 ? s : '';
}
function touch(x,y){
  console.log("VLOG: TOUCH "+x);
  if ('_JSAPI' in window){
    _JSAPI.tapEmulate(x,y);
    return true;
  }
  return false;
}
function enc(s){
  return encodeURIComponent(s);
}
function $tick() {
  var dt = new Date();
  return dt.getTime();
}
function query(r){
  var v=[];
  for (var i in r){
    v.push(i+'='+enc(r[i]));
  }
  return v.join('&');
}
function absY(v){
  var rect = v.getBoundingClientRect();
  return rect.y+window.scrollY;
}
var _LANG=false;
var body=document.body;
var keyHandler=null;
function _KEYEV(key){
  if (keyHandler){
    if (keyHandler(key)){
      return true;
    }
  }
  return false;
}
document.addEventListener('keydown', function(e) { 
  var key = e.keyCode || e.which;
  if (_KEYEV(key)){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  return true;
});
var messageHandler=null;
window.addEventListener('message',function(e) {
  // console.log(["POSTMESSAGE",e]);
  if (messageHandler){
    messageHandler(e);
  }
});
var videoEventHandler=null;
function _VIDEO_EVENT(el,tag,ev){
  if (videoEventHandler) videoEventHandler(el,tag,ev);
}
var getViewCb=null;
function __GETVIEWCB(d){
    if(getViewCb) getViewCb(d);
}
var mp4vidCb=null;
function __MP4CB(d){
    if(mp4vidCb) mp4vidCb(d);
}

/* GENRES */
const _GENRES={"action":"1","adventure":"2","avant_garde":"2262888","boys_love":"2262603","comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9","girls_love":"2263743","gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552","josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18","mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25","reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31","shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38","supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"};

/* KEYCODES */
const KUP=38;
const KDOWN=40;
const KLEFT=37;
const KRIGHT=39;
const KBACK=27;
const KENTER=13;

var bgimg=null;
var bgimgid=null;

/* START */
(function(){
  /* PLAYBACK */
  var playback={
    onplayback:false,
    uri:'',
    holder:$('playback'),
    menu:$('playback_menu'),
    title:$('playback_title'),
    vid:$('playback_video'),
    v:null,
    vt:false,
    state:$('playback_state'),
    skip:$('playback_skip'),
    track:$('playback_track'),
    trackpos:$('playback_track_pos'),
    trackshow:false,
    prevKey:null,
    show:false,
    tick:0,
    data:null,
    el:[],
    sel_el:null,
    sel:-1,
    play_sel:-1,
    onskip:false,
    skip_val:0
  };

  function playback_setskip(v){
    if (v&&!playback.onskip){
        playback.onskip=true;
        playback.skip.style.visibility='visible';
    }
    else if (!v&&playback.onskip){
        playback.skip_val=0;
        playback.onskip=false;
        playback.skip.style.visibility='hidden';
    }
  }
  
  function isplayback(){
    // return playback.holder.className=='active';
    return playback.onplayback;
  }
  function playback_close(){
    mp4vidCb=null;
    playback.onplayback=false;
    getViewCb=null;
    messageHandler=null;
    videoEventHandler=null;
    playback.holder.className='';
    playback_setskip(false);
    keyHandler=playback.prevKey;
    // playback.vid.src='/__view/blank.html';
    playback_stat_reset();
    playback.vid.innerHTML='';
    playback.vid.className='';
    window.focus();
  }
  function playback_autohide(){
    if (isplayback()){
      if (playback.tick<$tick()-2000){
        playback.show=false;
        playback.state.className='';
      }
      else{
        setTimeout(playback_autohide,500);
      }
    }
  }
  function playback_menu(){
    if (!playback.show){
      playback.show=true;
      playback.state.className='show';
      playback.tick=$tick();
      playback_autohide();
    }
  }
  function playback_update_sel(){
    var s=playback.sel;
    if (playback.sel_el)
      playback.sel_el.className='';
    playback.sel_el='';
    if (s>=0&&s<playback.el.length){
      playback.sel_el=playback.el[s];
      playback.sel_el.className='sel';
      playback.sel_el.scrollIntoView();
    }
  }
  var _pbsto=null;
  function playback_hide_track(){
    clearTimeout(_pbsto);
    _pbsto=setTimeout(function(){
        if (playback.trackshow){
            playback.trackshow=false;
            playback.track.className='';
        }
    },5000)
  }
  function playback_show_track(){
    playback.trackshow=true;
    playback.track.className='show';
    playback_hide_track();
  }
  function playback_keyhandler(k){
    var cs=playback.sel;
    if (k==KBACK){
      if (playback.show){
        playback.tick=0;
      }
      else{
        playback_close();
      }
      return true;
    }
    else if (k==KENTER){
      if (playback.show){
        if (playback.sel_el){
          var c=playback.sel_el._action;
          if (c=='-back'){
          }
          else{
            playback_close();
            playback_init(c);
          }
        }
      }
      else{
        if (playback.onskip){
            if (playback.skip_val>0){
                playback_cmd('seek',playback.skip_val);
            }
        }
        else{
            if (playback.vid._stat.play)
              playback_cmd('pause',null);
            else
              playback_cmd('play',null);
        }
      }
      return true;
    }
    else if (k==KRIGHT){
      playback_show_track();
      playback_cmd('seek',playback.vid._stat.pos+10);
      playback_updatepos();
    }
    else if (k==KLEFT){
      playback_show_track();
      playback_cmd('seek',playback.vid._stat.pos-10);
      playback_updatepos();
    }
    else if (k==KUP){
      if (playback.show) cs--;
      playback.tick=$tick();
      playback_menu();
    }
    else if (k==KDOWN){
      if (playback.show) cs++;
      playback.tick=$tick();
      playback_menu();
    }
    if (cs<0) cs=0;
    if (cs>=playback.el.length) cs=playback.el.length-1;
    if (cs!=playback.sel){
      console.log('current cs='+cs);
      playback.sel=cs;
      playback_update_sel();
      return true;
    }
    return false;
  }
  function playback_init_ep(){
    var d=playback.data;
    playback.menu.innerHTML='';
    playback.el=[];
    playback.play_sel=-1;
    for (var i=0;i<d.ep.length;i++){
      var w=d.ep[i];
      var m=$n('div');
      m._title=$n('b',0,0,m,special(w.ep+" "+w.title));
      m._action=w.url;
      playback.el.push(m);
      playback.menu.appendChild(m);
      if (w.url==playback.uri){
        playback.sel=i;
        playback.play_sel=i;
        m._played=$n('span',0,0,m,'<c>play_circle_filled</c>');
      }
    }
    console.log(playback);
    playback_update_sel();
  }
  function playback_updatepos(){
    var dur=(playback.vt==2)?playback.vid._stat.duration:playback.v.duration;
    var pos=(playback.vt==2)?playback.vid._stat.pos:playback.v.currentTime;

    if (dur>0){
        var dr=(pos/dur)*100.0;
        playback.trackpos.style.width=dr+"%";
    }
  }
  function playback_stat_reset(){
    playback.vid._stat={
      ready:false,
      pos:0,
      duration:0,
      play:false
    };
  }
  function playback_handler(j){
    try{
      if ('vcmd' in j){
        if (j.vcmd=='complete'){
          console.log("ATVLOG vidmsg complete");
          if (playback.play_sel+1<playback.el.length){
            try{
              var c=playback.el[playback.play_sel+1]._action;
              playback_close();
              playback_init(c);
            }catch(e){}
          }
        }
        else if (j.vcmd=='pause'){
          playback.vid._stat.play=false;
        }
        else if (j.vcmd=='ready'){
          playback_player_ready();
        }
        else if (j.vcmd=='play'){
          playback.vid._stat.play=true;
          playback_player_ready();
        }
        else if (j.vcmd=='seek'){
          console.log("ATVLOG vidmsg seek");
        }
        else if (j.vcmd=='time'){
          playback.vid._stat.pos=j.val.position;
          playback.vid._stat.duration=j.val.duration;

          var sk=0;
          var ct=playback.vid._stat.pos;
          for (var i=0;i<playback.data.skip.length;i++){
              if ((playback.data.skip[i][0]<ct)&&(playback.data.skip[i][1]>ct)){
                  sk=playback.data.skip[i][1];
              }
          }
          if (sk>0){
              if (!playback.onskip){
                  playback.skip_val=sk;
                  playback_setskip(true);
              }
          }else if (playback.onskip){
              playback_setskip(false);
          }
          playback_updatepos();
        }
      }
      else if ('event' in j){
        if (j.event=='PLAYER_READY'){
          playback_player_ready();
        }
      }
    }catch(e){}
  }
  function playback_message(c, v){
    playback_handler({vcmd:c,val:v});
  }
  function playback_message_handler(e){
    try{
      if (!playback.onplayback) return;
      playback_handler(JSON.parse(e.data));
    }catch(e){}
  }
  function playback_player_ready(){
    if (!playback.vid._stat.ready){
      playback_cmd('ready',playback.data.banner?playback.data.banner:playback.data.poster);
      playback.vid._stat.ready=true;
      playback.title.innerHTML=playback.title._readyHTML;
      playback.state.className='';
      playback.vid.className='ready';
    }
  }
  function playback_cmd(c,d){
    try{
      if (!playback.onplayback) return;
      if (playback.vt==2){
        console.log("ATVLOG PostMessage "+c+" => "+d);
        playback.v.contentWindow.postMessage(JSON.stringify({
                vcmd:c,
                val:d
        }),'*');
      }
      else{
        if (c=='seek'){
          playback.vid._stat.pos=playback.v.currentTime=d;
        }
        else if (c=='play'){
          playback.v.play();
        }
        else if (c=='seek'){
          playback.v.pause();
        }
      }
    }catch(e){};
  }
  function playback_init_vidcloud(){
    var d=playback.data;
    if (d.stream_vurl){
      console.log("ATVLOG VIDEO VIDCLOUD = "+d.stream_vurl);

      /* vidcloud */
      messageHandler=playback_message_handler;
      playback.vt=2;
      playback.v=document.createElement('iframe')
      playback.vid.innerHTML='';
      playback.vid.appendChild(playback.v);
      playback.v.src=d.stream_vurl;
    }
  }
  function playback_init_mp4upload(vidurl){
    console.log("ATVLOG VIDEO MP4UPLOAD = "+vidurl);
    playback.vt=1;
    playback.v=document.createElement('video');
    var _vid=playback.v;
    _vid.setAttribute('poster',playback.data.banner?playback.data.banner:playback.data.poster);
    playback.vid.innerHTML='';
    playback.vid.appendChild(playback.v);

    _vid.addEventListener('ended',function(e) {
      playback_message('complete',0);
    },false);
    _vid.addEventListener('durationchange',function(e) {
      playback_message('time',{
        position:playback.v.currentTime,
        duration:playback.v.duration
      });
    },false);

    _vid.addEventListener('play',function(e) {
      playback_message('play',0);
    },false);

    _vid.addEventListener('pause',function(e) {
      playback_message('pause',0);
    },false);

    _vid.addEventListener('loadeddata',function(e) {
      playback.v.play();
      playback_message('ready',0);
    },false);

    _vid.addEventListener('timeupdate',function(e) {
      playback_message('time',{
        position:playback.v.currentTime,
        duration:playback.v.duration
      });
    },false);
    playback.v.src=vidurl;
  }

  function playback_draw(d){
    playback.data=d;
    playback_stat_reset();
    playback_init_ep();
    playback.title.innerHTML='<c class="loader">stream</c> Streaming...';
    playback.title._readyHTML=special(d.title);

    if (d.mp4&&d.stream_url){
      mp4vidCb=function(mp4){
        try{
          if (mp4&&mp4.src){
            playback_init_mp4upload(mp4.src);
            mp4vidCb=null;
            return;
          }
        }catch(e){}
        playback_init_vidcloud();
        mp4vidCb=null;
      };
      _JSAPI.getmp4vid(d.stream_url);
    }
    else{
      playback_init_vidcloud();
    }
  }
  function playback_init(u){
    playback.menu.innerHTML='';
    playback.el=[];
    playback.sel=-1;
    playback.sel_el=null;


    playback.show=false;
    playback.state.className='loading';
    playback.holder.style.display='';
    playback.onplayback=true;
    playback.holder.className='active';
    playback.prevKey=keyHandler;
    keyHandler=playback_keyhandler;
    playback.title.innerHTML='<c class="loader">donut_large</c> Loading...';
    playback.uri=u;

    getViewCb=function(r){
        if (r.status)
            playback_draw(r);
        else
            playback_close();
        getViewCb=null;
    };
    _JSAPI.getview(u);
  }

  var home={
    page:1,
    data:[],
    elm:[],
    sel_el:null,
    sel:-2,
    src:$('home_search'),
    next:$('homenext'),
    prev:$('homeprev'),
    paging:$('homepage'),
    lang:$('homelang'),
    scroll:0
  };
  home.src._action='-search';
  home.next._action='-next';
  home.prev._action='-prev';
  home.lang._action='-lang';
  function home_scroll(y){
    ypos=Math.floor(y);
    if (Math.abs(ypos-home.scroll)>20){
      home.scroll=ypos;
      window.scrollTo(0,ypos);
    }
  }
  function home_updatesel(){
    var s=home.sel;
    if (home.sel_el)
      home.sel_el.className='';
    if (s>=0&&s<home.elm.length){
      home.sel_el=home.elm[s];
      home.sel_el.className='sel';
      var y=absY(home.sel_el);
      home_scroll(y-(window.innerWidth/5));
      body.className='home_item';
    }
    else if (s==-1){
      home.sel_el=home.lang;
      home.sel_el.className='sel';
      home_scroll(0);
      body.className='';
    }
    else if (s<-1){
      home.sel_el=home.src;
      home.sel_el.className='sel';
      home_scroll(0);
      body.className='';
    }
    else{
      home_scroll(document.body.scrollHeight);
      body.className='home_bottom';
      var t=0;
      if (s==home.elm.length+1) t=1;
      else if (home.page==1) t=1;
      if (t){
        home.sel_el=home.next;
        home.sel_el.className='sel';
      }
      else{
        home.sel_el=home.prev;
        home.sel_el.className='sel';
      }
    }
  }
  function home_handler(k){
    var s=home.sel;
    if (k==KUP){
      if (s<0) s--;
      else s-=4;
    }
    else if (k==KDOWN){
      if (s<0) s=0;
      else s+=4;
    }
    else if (k==KLEFT)
      s--;
    else if (k==KRIGHT)
      s++;
    else if (k==KENTER){
      if (home.sel_el&&home.sel_el._action){
        var c=home.sel_el._action;
        if (c=='-next'){
          if (home.page<98){
            home.page++;
            home_load();
          }
        }
        else if (c=='-prev'){
          if (home.page>1){
            home.page--;
            home_load();
          }
        }
        else if (c=='-lang'){
          _LANG=!_LANG;
          if (_LANG){
            home.lang.innerHTML='ID';
            bgimgid.className='mainbgimage';
            bgimg.className='mainbgimage nonactive';
          }
          else{
            home.lang.innerHTML='EN';
            bgimg.className='mainbgimage';
            bgimgid.className='mainbgimage nonactive';
          }
          home.page=1;
          home_load();
        }
        else if (c.indexOf('http')===0){
            // try{
            //     playback.vid.setAttribute('poster',home.sel_el._img.src);
            // }catch(e){}
            playback_init(c);
        }
      }
      return true;
    }
    else if (k==KBACK){
      if (home.page>1){
        home.page--;
        home_load();
      }
      else if ('_JSAPI' in window){
        _JSAPI.appQuit();
      }
      else{
        location.reload();
      }
      return true;
    }
    if (s<-2) s=-2;
    else if (s>home.elm.length) s=home.elm.length+1;
    if (home.page==1&&s==home.elm.length+1) s=home.elm.length;
    if (s!=home.sel){
      home.sel=s;
      home_updatesel();
    }
    return true;
  }
  function home_redraw(){
    var g=$('homelist');
    if (home.sel_el)
      home.sel_el.className='';
    home.elm=[];
    home.sel=-2;
    home.sel_el=null;
    g.innerHTML='';
    for (var i=0;i<home.data.length;i++){
      var d=home.data[i];
      var m=$n('div');
      m._img=new Image();
      m._img.src=d[2];
      m._img._p=m;
      m._img.onload=function(){
        this._p.appendChild(this);
      };
      var title=d[0];
      var posEp=title.lastIndexOf('Episode');
      if (posEp>0){
        title=title.substring(0,posEp);
      }
      m._title=$n('b',0,0,m,special(trim(title)));
      if (d[3])
        m._ep=$n('span',0,0,m,special(d[3]));
      m._action=d[1];
      home.elm.push(m);
      g.appendChild(m);
    }
    keyHandler=home_handler;
    home.next.style.visibility='';
    home.prev.style.visibility=home.page==1?'hidden':'';
    home.paging.innerHTML='Page '+home.page;
    home_updatesel();
  }
  function home_parse_list(v,v2){
    var hd=document.createElement('div');
    hd.innerHTML=v.result+(v2?v2.result:'');
    var items=hd.getElementsByClassName("item");
    home.data=[];
    for (var i=0;i<items.length;i++){
        try{
            var dx=[];
            var bn=items[i].firstElementChild;
            var tx=bn.nextElementSibling;
            dx.push(tx.textContent.trim());
            var ba=bn.firstElementChild;
            dx.push(ba.href);
            var bi=ba.firstElementChild;
            dx.push(bi?bi.src:'');
            var epinfo='';
            try{
                epinfo="EP-"+ba.getElementsByClassName('ep-status')[0].textContent.trim();
            }catch(e){}
            dx.push(epinfo);
            home.data.push(dx);
        }catch(e){}
    }
    console.log("ATVLOG="+JSON.stringify(home.data));
    hd.innerHTML='';
    home_redraw();
  }
  function home_load(){
    home_scroll(0);
    keyHandler=null;
    home.next.style.visibility='hidden';
    home.prev.style.visibility='hidden';
    home.paging.innerHTML='<c class="loader">donut_large</c> Loading...';
    var load_page=(home.page-1)*2;
    $a('/ajax/home/widget/updated-sub?page='+(load_page+1),function(r){
      if (r.ok){
        $a('/ajax/home/widget/updated-sub?page='+(load_page+2),function(r2){
            if (r2.ok){
                home_parse_list(JSON.parse(r.responseText),JSON.parse(r2.responseText));
            }
            else{
                home_parse_list(JSON.parse(r.responseText),null);
            }
        });
      }
      else{
        setTimeout(home_load,2000);
      }
    });
  }
  home_load();
  (function(){
    bgimgid=new Image();
    bgimgid.className='mainbgimage mainbgidimage';
    bgimgid.onload=function(){
      body.appendChild(bgimgid);
    };
    bgimgid.src='bgid.webp';

    bgimg=new Image();
    bgimg.className='mainbgimage nonactive';
    bgimg.onload=function(){
      body.appendChild(bgimg);
      setTimeout(function(){
        bgimg.className='mainbgimage';
      },10);
    };
    bgimg.src='bg.webp';
    bgimg.style.zIndex='1';
  })();
})();
