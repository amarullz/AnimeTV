(function(){
if (window.__hooked9){
    return;
}
window.__hooked9=true;
function $(i){
  return document.getElementById(i);
}
/* PLAYER INJECT */
function ___PLAYER(player){
    var _SERVER_ID=_JSAPI.streamServer();;
    var dbg=document.createElement('textarea');
    dbg.style.position='absolute';
    dbg.style.zIndex='9999999';
    dbg.style.width='50%';
    dbg.style.height='100%';
    dbg.style.top='0';
    dbg.style.right='0';
    dbg.setAttribute('readonly','readonly');
    document.body.appendChild(dbg);

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
        /* Get Banner */
        try{
            data.banner=player.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        }catch(e){}

        /* info */
        var info=$('w-info');
        if (info){
            var poster=info.getElementsByTagName('img');
            var title=info.getElementsByTagName('h1');
            var content=info.getElementsByClassName('content');
            if (poster[0]) data.poster=poster[0].src;
            if (title[0]){
                data.title=title[0].textContent;
                data.title_jp=title[0].getAttribute('data-jp');
            }
            if (content[0]) data.synopsis=content[0].textContent;

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
        var ses=$('w-seasons');
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
        var rel=$('w-related');
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
        var ws=document.getElementById('watch-second');
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

        data.ep=[];
        episode_el=[];
        data.url=location+'';

        /* get episodes */
        var ep=$('w-episodes').getElementsByTagName('li');
        for (var i=0;i<ep.length;i++){
            var p=ep[i];
            var s={};
            var a=p.firstElementChild;
            s.url=a.href;
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
            if (a.className.indexOf("active")>=0)
                s.active=true;
            if (a.className.indexOf("filler")>=0)
                s.filler=true;
            data.ep.push(s);
            episode_el.push(a);
        }
        // dbg.value=JSON.stringify(data,null,4);
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
        var wsvr=$('w-servers');
        var svr=wsvr.querySelector("div[data-type=sub]");
        if (!svr){
            svr=wsvr.querySelector("div[data-type=softsub]");
        }
        if (!svr){
            svr=wsvr.querySelector("div[data-type=dub]");
        }
        if (svr){
            var server=svr.getElementsByTagName('li');
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
        var wsvr=$('w-servers');
        var svr=wsvr.querySelector("div[data-type=sub]");
        if (!svr){
            svr=wsvr.querySelector("div[data-type=softsub]");
        }
        if (!svr){
            svr=wsvr.querySelector("div[data-type=dub]");
        }
        if (svr){
            var server=svr.getElementsByTagName('li');
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
        var wsvr=$('w-servers');
        
        server_state++;
        var n=server_state-2;
        if (n<=1){
            var svr=wsvr.querySelector(srcquery[n]);
            if (svr){
                var server=svr.getElementsByTagName('li');
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