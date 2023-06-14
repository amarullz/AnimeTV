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
  viewid:0,
  genres:{"action":"1","adventure":"2","avant_garde":"2262888","boys_love":"2262603","comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9","girls_love":"2263743","gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552","josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18","mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25","reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31","shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38","supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"},
  
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
  pb_tracks:$('pb_tracks'),
  pb_episodes:$('pb_episodes'),
  pb_seasons:$('pb_seasons'),
  pb_related:$('pb_related'),
  pb_recs:$('pb_recs'),
  pb_settings:$('pb_settings'),

  pb_vid:$('pb_vid'),

  pb_track_val:$('pb_track_val'),
  pb_track_pos:$('pb_track_pos'),
  pb_track_dur:$('pb_track_dur'),
  pb_track_ctl:$('pb_track_ctl'),

  /* meta elements */
  pb_title:$('pb_title'),
  pb_desc:$('pb_desc'),

  /* view data */
  data:null,
  lastkey:0,
  state:0,

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
    if (c==KLEFT){
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
    var autohide_duration=4000;
    if (pb.state>1){
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
    pb.pb_list.style.height="0px";
  },
  menu_show:function(pos){
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=(pos===undefined?2:pos);
    pb.pb_actions.classList.add('active');
    pb.menus[pb.menusel].classList.add('active');
    pb.menu_update();
    pb.menu_autohide();
  },
  menu_update:function(){
    if (pb.menusel<=1){
      pb.pb_meta.classList.add('active');
      pb.pb_list.style.height="0";
      pb.pb_list.classList.remove('nomask');
      return;
    }
    else{
      pb.pb_meta.classList.remove('active');
    }
    var vh=(pb.menusel<pb.menus.length-1)?window.innerHeight/15:0;
    for (var i=3;((i<=pb.menusel)&&(i<pb.menus.length));i++){
      vh+=pb.menus[i].offsetHeight;
    }
    if (pb.menusel==pb.menus.length-1)
      pb.pb_list.classList.add('nomask');
    else
      pb.pb_list.classList.remove('nomask');
    pb.pb_list.style.height=vh+"px";
    if (pb.menus[pb.menusel]._sel){
      pb.menu_select(pb.menus[pb.menusel],pb.menus[pb.menusel]._sel);
    }
  },

  /* Track & Timings */
  track_keycb:function(g,c){
    if (!('_cp' in g)) g._cp=50;
    if (c==KLEFT){
      g._cp-=5;
      if (g._cp<0) g._cp=0;
    }
    else if (c==KRIGHT){
      g._cp+=5;
      if (g._cp>100) g._cp=100;
    }
    pb.pb_track_val.style.width=g._cp+"%";
  },

  /* Root Key Callback */
  keycb:function(c){
    pb.lastkey=$tick();
    if (pb.pb_actions.classList.contains('active')){
      if (c==KENTER){
      }
      else if (c==KBACK){
        pb.menu_hide();
      }
      else if (c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
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
      if (c==KUP||c==KDOWN){
        pb.menu_show(c==KUP?1:2);
      }
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
        var hl=$n('div',d.active?'playing':'',{url:d.url},pb.pb_episodes,special(d.ep)+adh);
        if (i==start){
          if (pb.pb_episodes._margin){
            hl.style.marginLeft="-"+pb.pb_episodes._margin+"px";
          }
        }
        if (d.title)
          hl.setAttribute('data-title',d.title);
        if (d.active) act=hl;
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

  init:function(){
    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'), url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'-w100)';

    /* META */
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
        $n('div','',{val:'!'+pb.data.info.type.val},pb.pb_genres,special(pb.data.info.type.name));
      }
      if (pb.data.genres){
        for (var i=0;i<pb.data.genres.length;i++){
          $n('div','',{val:pb.data.genres[i].val},pb.pb_genres,special(pb.data.genres[i].name));
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
        var hl=$n('div',d.active?'playing':'',{url:d.url},pb.pb_seasons,'');
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
        var hl=$n('div','',{url:d.url},pb.pb_related,'');
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
        var hl=$n('div','',{url:d.url},pb.pb_recs,'');
        hl._img=$n('img','',{loading:'lazy',src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(pb.pb_recs,pb.pb_recs.firstElementChild);
      pb.pb_recs.style.display='';
    }
    else{
      pb.pb_recs.style.display='none';
    }

    // pb_recs

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
    _API.setKey(pb.keycb);

    pb.pb_track_ctl.innerHTML='change_circle';
    pb.pb_track_ctl.className='loader';
    pb.pb_track_pos.innerHTML='STREAMING VIDEO';
    pb.pb_track_dur.innerHTML='';
    pb.pb_loading.classList.remove('active');

    pb.lastkey=$tick();
    pb.state=1;
    pb.menu_show(1);
  },

  open:function(uri, ttid, fresh){
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
      if (ttid){
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
              console.log('DRAWED...');
            }
          }
        });
      }
      pb.state=0;
      if (fresh){
        pb.pb.style.backgroundImage='';
        pb.pb_meta.classList.remove('active');
      }
      pb.pb_vid.innerHTML='';
      pb.pb_loading.classList.add('active');
      pb.pb_actions.classList.remove('active');
      pb.pb.classList.add('active');
      _API.setKey(function(ke){
        if (ke==KBACK){
          uid=-1;
          pb.state=2;
          pb.pb.style.backgroundImage='';
          pb.pb_loading.classList.remove('active');
          pb.pb_meta.classList.remove('active');
          pb.pb_actions.classList.remove('active');
          pb.pb.classList.remove('active');
        }
      });
    }
    return uid;
  }
};

// pb.open('https://9anime.to/watch/one-piece.ov8/ep-52',177,1);
pb.open('https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc.3r7p6/ep-1',15065,1);
// pb.open('https://9anime.to/watch/insomniacs-after-school.522om/ep-10', 14891,1);
//pb.open('https://9anime.to/watch/vinland-saga-season-2.kwo44/ep-1', 14049,1);
