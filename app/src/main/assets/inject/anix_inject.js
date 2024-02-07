(function(){
  if (window.__hookedAnix){
      return;
  }
  window.__hookedAnix=true;
  function $(i){
    return document.getElementById(i);
  }
  /* PLAYER INJECT */
  function ___PLAYER(player){
      var _SERVER_ID=_JSAPI.streamServer();

      /*
      "banner": "",
      "genres": [],
      "type": null,
      */
  
      var fetchTo=null;
      var episode_el=[];
      var server_state = 0;
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
          mp4:false,
          poster:'',
          banner:null,
          url:'',
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
  
      /* Get Episode */
      window.__EPGET=function(u){
          for (var i=0;i<episode_el.length;i++){
              if (u==episode_el[i].href){
                  server_state=1;
                  episode_el[i].click();
                  return true;
              }
          }
          return false;
      };
  
      function fetchInfo(){
          data.related=[];
          data.genres=[];

          var ply=$('ani-player-section');

          /* Get Banner */
          try{
              data.banner=ply.querySelector('div.player-bg').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
          }catch(e){}
  
          /* info */
          var info=$('ani-detail-info');
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
          var ri=document.querySelectorAll('section.sidebar-set.related div.sidebar-item a');
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

          var ws=document.querySelectorAll('section.sidebar-set:not(.related) div.sidebar-item a');
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
      }
      function startFetch(){
          /* URL Selection */
          var STREAM_TYPE=_JSAPI.streamType();
          data.streamtype="sub";
          if (STREAM_TYPE==1){
              if (data.stream_url.soft){
                  data.stream_vurl=data.stream_url.soft;
                  data.streamtype="softsub";
              }
          }
          else if (STREAM_TYPE==2){
              if (data.stream_url.dub){
                  data.stream_vurl=data.stream_url.dub;
                  data.streamtype="dub";
              }
          }

          console.log("ATVLOG --> HOOK STATE 1");
  
          data.ep=[];
          episode_el=[];
          data.url=location+'';
  
          /* get episodes */
          var ep=document.querySelectorAll('#ani-episode div.range-wrap a');
          for (var i=0;i<ep.length;i++){
              var p=ep[i];
              var s={};
              s.url=p.href;
              s.ep=(p.textContent+"").trim();
              s.title="EPISODE "+s.ep;
              if (p.classList.contains('active')){
                  s.active=true;
              }
              if (p.classList.contains('filler')){
                s.filler=true;
              }
              data.ep.push(s);
              episode_el.push(p);
          }
          console.log("ATVLOG --> HOOK STATE 2 = "+JSON.stringify(data,null,'\t'));

          _JSAPI.result(JSON.stringify(data));
      }
      function startFetchTimeout(ms){
          clearTimeout(fetchTo);
          fetchTo=setTimeout(startFetch,ms);
      }
      function clickServerId(server){
          if (_SERVER_ID<server.length){
              try{
                  if (server[_SERVER_ID].innerText.toLowerCase()=='mycloud'){
                      server[_SERVER_ID].click();
                      return;
                  }
              }catch(ee){
              }
          }
          server[0].click();
      }
      function clickServer(){
          var wsvr=$('ani-servers');
          var svr=wsvr.querySelector("div[data-type=sub]");
          if (!svr){
              svr=wsvr.querySelector("div[data-type=softsub]");
          }
          if (!svr){
              svr=wsvr.querySelector("div[data-type=dub]");
          }
          if (svr){
              var server=svr.querySelectorAll('div.server');
              if (server.length>0){
                  server_state=1;
                  clickServerId(server);
                  startFetchTimeout(4000);
                  return;
              }
          }
          setTimeout(clickServer,5);
      }
      function clickLastServer(){
          var wsvr=$('ani-servers');
          var svr=wsvr.querySelector("div[data-type=sub]");
          if (!svr){
              svr=wsvr.querySelector("div[data-type=softsub]");
          }
          if (!svr){
              svr=wsvr.querySelector("div[data-type=dub]");
          }
          if (svr){
            var server=svr.querySelectorAll('div.server');
              if (server.length>0){
                  server_state++;
                  clickServerId(server);
              }
          }
          startFetchTimeout(1);
      }
      function clickNextServer(){
          var srcquery=[
              "div[data-type=softsub]",
              "div[data-type=dub]"
          ];
          var wsvr=$('ani-servers');
          
          server_state++;
          var n=server_state-2;
          if (n<=1){
              var svr=wsvr.querySelector(srcquery[n]);
              if (svr){
                var server=svr.querySelectorAll('div.server');
                  if (server.length>0){
                      clickServerId(server);
                      startFetchTimeout(2000);
                      return;
                  }
              }
          }
          else{
              clickLastServer();
              return;
              
          }
          clickNextServer();
      }
      window.addEventListener('message',function(e) {
          try{
              if (server_state==1){
                  var j=JSON.parse(e.data);
                  if (j.cmd=='HOOK_READY'){
                      data.skip=j.val.value;
                      data.stream_url.hard=
                      data.stream_vurl=player.firstElementChild.src;
                      console.log("ATVLOG-VIDURL [HARD] = "+data.stream_vurl);
                      clickNextServer();
                  }
              }
              else if (server_state==2){
                  data.stream_url.soft=player.firstElementChild.src;
                  console.log("ATVLOG-VIDURL [SOFT] = "+data.stream_url.soft);
                  clickNextServer();
              }
              else if(server_state==3){
                  console.log("ATVLOG-VIDURL [DUB] = "+data.stream_url.soft);
                  data.stream_url.dub=player.firstElementChild.src;
                  clickLastServer();
              }
          }catch(e){}
      });
      clickServer();
      fetchInfo();
  }
  
  /* CHECK FOR PAGE */
  var player=$('player');
  console.log("ATVLOG --> HOOK LOADED");
  if (player){
      ___PLAYER(player);
  }
  
  })();