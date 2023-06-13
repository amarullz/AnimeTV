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
  if (h!=undefined) l.innerHTML=h;
  if (p!=undefined) p.appendChild(l);
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
  pb_track_val:$('pb_track_val'),
  pb_track_pos:$('pb_track_pos'),
  pb_track_dur:$('pb_track_dur'),

  /* meta elements */
  pb_title:$('pb_title'),
  pb_desc:$('pb_desc'),

  /* view data */
  data:null,

  /* menu selection */
  menu_select:function(g,n){
    if (n){
      var fc=g.firstElementChild;
      if (!fc) return false;
      if (!g._midx) g._midx=1.1;
      if (!g.__update){
        g.__update=function(){
          if (g._sel)
            g._sel.classList.remove('active');
          var n = g._target_n;
          n.classList.add('active');
          var iw=window.innerWidth/g._midx;
          var ol=n.offsetLeft+n.offsetWidth;
          var xpos = ol-parseInt(getComputedStyle(fc).marginLeft); //g._margin;
          if (xpos>iw){
            g._margin= xpos-iw; 
            g.classList.add('maskleft');
          }
          else{
            g._margin=0;
            g.classList.remove('maskleft');
          }
          fc.style.marginLeft="-"+g._margin+"px";
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
        else if (g._should_clear)
          g._reset();
      }
    }
    else if (c==KRIGHT){
      if (g._sel){
        if (g._sel.nextElementSibling)
          n=g._sel.nextElementSibling;
      }
      else
        n=g.firstElementChild;
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
  menu_hide:function(){
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=0;
    $('pb_actions').classList.remove('active');
    $('pb_meta').classList.remove('active');
    pb.menus[pb.menusel].classList.add('active');
  },
  menu_show:function(pos){
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=(pos===undefined?1:pos);
    $('pb_actions').classList.add('active');
    pb.menus[pb.menusel].classList.add('active');
    pb.menu_update();
  },
  menu_update:function(){
    if (pb.menusel==0){
      pb.pb_meta.classList.add('active');
      pb.pb_list.style.height="0";
      pb.pb_list.classList.remove('nomask');
      return;
    }
    else{
      pb.pb_meta.classList.remove('active');
    }
    var vh=window.innerHeight/15;
    for (var i=2;((i<=pb.menusel)&&(i<pb.menus.length));i++){
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
    if (pb.pb_actions.classList.contains('active')){
      if (c==KENTER){
      }
      else if (c==KBACK){
        pb.menu_hide();
      }
      else if (c==KLEFT||c==KRIGHT){
        if (pb.menus[pb.menusel]._keycb)
          pb.menus[pb.menusel]._keycb(pb.menus[pb.menusel],c);
      }
      else if (c==KUP){
        pb.menus[pb.menusel].classList.remove('active');
        if (--pb.menusel<0){
          pb.menusel=0;
          pb.menu_hide();
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
        pb.menu_show();
      }
    }
  },

  init:function(){
    pb.menus=[
      pb.pb_genres,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+')';

    /* META */
    pb.pb_title.innerHTML=special(pb.data.title);
    pb.pb_desc.innerHTML=special(pb.data.synopsis);

    /* Genres */
    pb.pb_genres.innerHTML='';
    if (pb.data.genres){
      for (var i=0;i<pb.data.genres.length;i++){
        $n('div','',{val:pb.data.genres[i].val},pb.pb_genres,special(pb.data.genres[i].name));
      }
      pb.menu_select(pb.pb_genres,pb.pb_genres.firstElementChild);
    }

    /* Episode */
    pb.pb_episodes.innerHTML='';
    if (pb.data.ep&&pb.data.ep.length){
      pb.menus.push(pb.pb_episodes);
      var act=null;
      for (var i=0;i<pb.data.ep.length;i++){
        var d=pb.data.ep[i];
        var adh='';
        // if (d.title)
        //   adh='<span>'+special(d.title)+'</span>';
        var hl=$n('div',d.active?'playing':'',{url:d.url},pb.pb_episodes,special(d.ep)+adh);
        if (d.active) act=hl;
      }
      if (act){
        pb.menu_select(pb.pb_episodes,act);
      }
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
        hl._img=$n('img','',{src:d.poster},hl,'');
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
        hl._img=$n('img','',{src:d.poster},hl,'');
        hl._title=$n('b','',null,hl,special(d.title));
      }
      pb.menu_select(pb.pb_related,pb.pb_related.firstElementChild);
      pb.pb_related.style.display='';
    }
    else{
      pb.pb_related.style.display='none';
    }

    /* ACTIONS */
    pb.pb_genres._midx=4;
    pb.pb_genres._keycb=
    pb.pb_episodes._keycb=
    pb.pb_seasons._keycb=
    pb.pb_related._keycb=pb.menu_keycb;
    pb.pb_tracks._keycb=pb.track_keycb;
    pb.menusel=1;
    _API.setKey(pb.keycb);

    pb.pb_track_pos.innerHTML='<c class="loader">stream</c> STREAMING';
    pb.pb_track_dur.innerHTML='';
    pb.pb_loading.classList.remove('active');

    pb.menu_show(0);
  },

  open:function(uri){
    pb.pb.style.backgroundImage='';
    pb.pb_load.innerHTML='LOADING DATA';
    pb.pb_loading.classList.add('active');
    pb.pb.classList.add('active');
    
    var uid=_API.getView(uri,function(d,u){
      if (uid==u && d.status){
        console.log(d);
        pb.data=d;
        pb.init();
      }
    });
  }
};

// pb.open('https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc.3r7p6/ep-1');
// pb.open('https://9anime.to/watch/insomniacs-after-school.522om/ep-10');
pb.open('https://9anime.to/watch/vinland-saga-season-2.kwo44/ep-1');
