(function(){
function $(i){
  return document.getElementById(i);
}

/* PLAYER INJECT */
function ___PLAYER(player){
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
    var data={
        status:true,
        stream_mp4:'',
        title:'-',
        poster:'',
        synopsis:'',
        skip:[],
        stream_url:'',
        banner:null,
        ep:[],
        mp4:false,
        url:location+""
    };
    try{
        data.banner=player.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
    }catch(e){}
    function startFetch(){
        console.log("ATVLOG --> Fetch Data");
        data.stream_mp4=player.firstElementChild.src;
        console.log("ATVLOG --> MP4STREAMURL = "+data.stream_mp4);

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
            if (a.className.trim()=='active')
                s.active=true;
            data.ep.push(s);
        }

        /* info */
        var info=$('w-info');
        var poster=info.getElementsByTagName('img');
        var title=info.getElementsByTagName('h1');
        var content=info.getElementsByClassName('content');
        if (poster[0]) data.poster=poster[0].src;
        if (title[0]) data.title=title[0].textContent;
        if (content[0]) data.synopsis=content[0].textContent;

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
                data.seasons.push(sv);
            }
        }
        dbg.value+=JSON.stringify(data,null,4);
        _JSAPI.result(JSON.stringify(data));
    }
    function startFetchTimeout(ms){
        clearTimeout(fetchTo);
        fetchTo=setTimeout(startFetch,ms);
    }
    function clickServer(){
        var svr=$('w-servers');
        if (svr){
            var server=svr.getElementsByTagName('li');
            if (server.length>0){
                console.log("ATVLOG --> Click Server");
                server[0].click();
                startFetchTimeout(4000);
                return;
            }
        }
        setTimeout(clickServer,10);
    }
    clickServer();
    window.addEventListener('message',function(e) {
        try{
            var j=JSON.parse(e.data);
            if (j.cmd=='HOOK_READY'){
                console.log("ATVLOG --> Hook Ready");
                data.skip=j.val.value;
                data.stream_url=player.firstElementChild.src;
                try{
                    var svr=$('w-servers');
                    var server=svr.getElementsByTagName('li');
                    var mp4upload=server[0].parentNode.lastElementChild;
                    if (mp4upload.textContent.toLowerCase()=='mp4upload'){
                        mp4upload.click();
                        startFetchTimeout(1000);
                        return;
                    }
                }catch(e){}
                startFetchTimeout(2);
            }
            else if (j.cmd=='MP4UPLOAD'){
//                console.log("ATVLOG --> Got MP4");
//                data.mp4=j.value;
                startFetchTimeout(1);
            }
        }catch(e){
        }
    });
}

/* CHECK FOR PAGE */
var player=$('player');
if (player){
    ___PLAYER(player);
}

})();