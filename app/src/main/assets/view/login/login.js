function $(i) {
    return document.getElementById(i);
}
function $n(t, c, a, p, h) {
    var l = document.createElement(t);
    if (a != undefined && a) {
        for (var i in a)
            l.setAttribute(i, a[i]);
    }
    if (c != undefined && c) l.className = c;
    if (h != undefined && h) l.innerHTML = h;
    if (p != undefined && p) p.appendChild(l);
    return l;
}
function special(str) {
    return (str + "").replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function $tick() {
    var dt = new Date();
    return dt.getTime();
}
var ___lclk = 0;
function clk() {
    if (___lclk < $tick()) {
        ___lclk = $tick() + 100;
        _JSAPI.playClick();
    }
}
/* proxy image */
var __IMGCDNL=_JSAPI.storeGet("imgcdnl","1");
function $imgnl(src, maxw){
    if (__IMGCDNL!="1" || src.indexOf("anilist.co")){
        return src;
    }
    return 'https://wsrv.nl/?url='+encodeURIComponent(src)+'&w='+maxw+'&we';
}

/* Key codes */
const KUP = 38;
const KDOWN = 40;
const KLEFT = 37;
const KRIGHT = 39;
const KBACK = 27;
const KENTER = 13;
const KENTER_UP = 1013;
const KPGUP = 33;
const KPGDOWN = 34;
const KPLAY = 402;
const KNEXT = 403;
const KPREV = 401;
var _KEY_CB = null;
window._KEYEV = function (key) {
    if (_KEY_CB) {
        if (_KEY_CB(key)) {
            return true;
        }
    }
    return false;
};

/* JS default key event listener */
document.addEventListener('keydown', function (e) {
    var key = e.keyCode || e.which;
    if (window._KEYEV(key)) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    return true;
});


const login = {
    default_user:null,
    ppic_base:'https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/ppic/',
    wallpaper_base:'https://raw.githubusercontent.com/amarullz/AnimeTV/master/tools/wallpaper/',
    dynamic_wallpaper: 2,
    h: $('animetv'),
    users: [],
    usersel: [],
    sel: 0,
    stat: 0,
    pin:null,
    onpin:false,
    pin_user:null,
    pin_uid:0,
    usel:null,
    currbg:null,
    update_theme:function(){
        if (login.dynamic_wallpaper>0){
            document.documentElement.className=login.usersel[login.sel]._data.theme;
        }
        if (login.dynamic_wallpaper>1){
            if (login.currbg){
                login.currbg.classList.remove('active');
            }
            login.currbg=null;
            if (login.usersel[login.sel]._data.wp){
                login.currbg=login.usersel[login.sel]._data.wp;
                login.currbg.classList.add('active');
            }
        }
    },
    find:function(prefix, retidx){
        for (var i=0;i<login.users.length;i++){
            if (login.users[i].u==prefix){
                return retidx?i:login.users[i];
            }
        }
        return retidx?0:null;
    },
    ppimgv: function (id) {
        var usr = login.users[id];
        if (usr){
            if (usr.im){
                return usr.im;
            }
            return login.ppic_base+'pic/'+(usr.i)+'.png';
        }
        return login.ppic_base+"pic/0.png";
    },
    ppimg:function(uid){
        var pp=login.ppimgv(uid);
        if (pp.indexOf(login.ppic_base)>-1){
            return $imgnl(pp,256);
        }
        return pp;
    },
    ppname: function (id) {
        var usr = login.users[id];
        if (usr) {
            return usr.n;
        }
        return 'Default User';
    },
    user_row: function (prefix, name, pp, pin) {
        return {
            u: prefix,
            n: name,
            i: pp,
            p: pin
        };
    },
    init: function () {
        var userdata = _JSAPI.storeGet("users", "");
        var defuser = [login.user_row('', 'Default User', 0, '')];
        if (userdata) {
            try {
                var ud = JSON.parse(userdata);
                defuser = ud;
            } catch (e) { }
        }
        login.users = defuser;
        login.default_user = login.find(_JSAPI.storeGet("default_user",""),true);
        login.start();
    },
    user_select_click: function (el) {
        if (el._data.p.length==4){
            login.openpin(el._id);
        }
        else{
            login.go(el._id,el._data.u);
        }
    },
    user_select_setpc:function(pc){
        if (pc!=login.sel){
            login.usersel[login.sel].classList.remove('active');
            login.usersel[pc].classList.add('active');
            login.sel=pc;
            login.update_theme();
        }
    },
    openpin:function(uid){
        login.pin_user=login.users[uid];
        login.pin_uid=uid;
        if (login.pin_user){
            login.pin_value='';
            login.pin_value_update();   
            login.pin._pin._img.src=login.ppimg(uid);
            login.pin._pin._dn.innerHTML=special(login.ppname(uid));
            login.pin.classList.add('active');
            login.onpin=true;
        }
    },
    pin_value:'',
    pin_value_update:function(){
        var o=[];
        for (var i=0;i<4;i++){
            if (login.pin_value.length>i){
                o.push('<b>&#11044;</b>');  
            }
            else{
              o.push('<b></b>');  
            }
        }
        login.pin._pin._pinvalue.classList.remove('error');
        login.pin._pin._pinvalue.innerHTML=o.join('');
    },
    pin_setpc:function(pc){
        var pin=login.pin._pin;
        if (pc!=pin._keysel){
            pin._keys[pin._keysel].classList.remove('active');
            pin._keys[pc].classList.add('active');
            pin._keysel=pc;
        }
    },
    pin_number:function(v){
        if (login.pin_value.length<4){
            login.pin_value+=v;
            login.pin_value_update();
            if (login.pin_value.length==4){
                if (login.pin_value==login.pin_user.p){
                    /* OK AND LOGIN */
                    login.pin.classList.remove('active');
                    login.go(login.pin_uid,login.pin_user.u);
                }
                else{
                    login.pin._pin._pinvalue.classList.add('error');
                    login.pin_setpc(login.pin._pin._keys.length-3);
                }
            }
            return true;
        }
        return false;
    },
    pin_click:function(el){
        var v=el._val;
        if (v=='backspace'){
            if (login.pin_value.length>0){
                login.pin_value=login.pin_value.substring(0,login.pin_value.length-1);
                login.pin_value_update();
                return true;
            }
        }
        else if (v=='clear'){
            if (login.pin_value.length>0){
                login.pin_value='';
                login.pin_value_update();
                return true;
            }
        }
        else{
            return login.pin_number(v);
        }
        return false;
    },
    pin_keycb:function(k){
        if (k == KBACK) {
            if (login.pin_value.length>0){
                login.pin_value='';
                login.pin_value_update();
                return true;
            }
            clk();
            login.pin.classList.remove('active');
            login.onpin=false;
            return true;
        }
        var pin=login.pin._pin;
        var pc=pin._keysel;
        if (k==KLEFT){
            if (pc%3-1<0)
                pc+=2;
            else
                pc--;
        }
        else if (k==KRIGHT){
            if (pc%3+1>2)
                pc-=2;
            else
                pc++;
        }
        else if (k==KUP){
            pc-=3;
            if (pc<0){
                pc+=pin._keys.length;
            }
        }
        else if (k==KDOWN){
            pc+=3;
            if (pc>=pin._keys.length){
                pc-=pin._keys.length;
            }
        }
        else if(k==KENTER){
            if (login.pin_click(pin._keys[pc])){
                clk();
            }
            return true;
        }
        else if (k>=48 && k<=57){
            /* keypad */
            if (login.pin_number(String.fromCharCode(('0'.charCodeAt(0))+(k-48)))){
                clk();
            }
            return true;
        }
        else if(k==8){
            /* backspace */
            if (login.pin_click(pin._keys[pin._keys.length-1])){
                clk();
            }
            return true;
        }
        if (pc!=pin._keysel){
            clk();
            login.pin_setpc(pc);
            return true;
        }
        return false;
    },
    user_select_keycb: function (k) {
        if (login.onpin){
            return login.pin_keycb(k);
        }
        if (k == KBACK) {
            clk();
            _JSAPI.appQuit();
            return true;
        }
        var pc = login.sel;
        if (k == KLEFT || k == KUP) {
            if (--pc < 0) pc = login.usersel.length-1;
        }
        else if (k == KRIGHT || k == KDOWN) {
            if (++pc >= login.usersel.length) pc = 0;
        }
        else if (k==KENTER){
            clk();
            login.user_select_click(login.usersel[pc]);
            return true;
        }
        if (pc!=login.sel){
            clk();
            login.user_select_setpc(pc);
            return true;
        }
        return false;
    },
    load_user_config:function(u){
        u.bg='';
        u.theme='';
        u.wp=null;
        if (login.dynamic_wallpaper>1){
            try{
                var itm=_JSAPI.storeGet(u.u+'pb_cfg',"");
                if (itm){
                    var j=JSON.parse(itm);
                    if (j){
                        if ('bgimg' in j){
                            if ('src' in j.bgimg){
                                u.bg=j.bgimg.src;
                                if (u.bg){
                                    var bgurl = login.wallpaper_base+u.bg;
                                    if (u.bg.startsWith("https://")){
                                        bgurl=u.bg;
                                    }
                                    u.wp=$n('img', 'usr_wallpaper hide', {src:$imgnl(bgurl,screen.width>screen.height?screen.width:screen.height)}, login.h, '');
                                    u.wp.onload=function(){
                                        this.classList.remove('hide');
                                    };
                                }
                            }
                        }
                    }
                }
            }catch(e){}
        }
        try{
            var itm=_JSAPI.storeGet(u.u+'theme',"theme_dark");
            if (itm){
                u.theme=itm;
            }
        }catch(e){}
    },
    user_select: function () {
        var ls=parseInt(_JSAPI.storeGet("loginstyle","1"));
        if (isNaN(ls)||ls<0||ls>2){
          ls=1;
        }
        login.dynamic_wallpaper=ls;

        login.h.innerHTML = '';
        var flexhold = $n('div', 'flexhold usersel', null, login.h, '');
        login.usel=flexhold;
        var pinhold = $n('div', 'flexhold pinhold', null, login.h, '');

        var hold = $n('div', 'user_sel', null, flexhold, '');
        $n('img', 'login_logo', {src:'/__view/logo.svg'}, login.h, '');
        login.usersel = [];
        for (var i = 0; i < login.users.length; i++) {
            var hl = $n('div', 'user_item', null, hold, '');
            hl._data = login.users[i];
            hl._id=i;
            hl._img = $n('img', '', { src: login.ppimg(i) }, hl, '');
            hl._dn = $n('div', 'user_name', null, hl, special(login.ppname(i)));
            hl.onclick = function () {
                login.user_select_click(this);
            };
            hl.ontouchstart=
            hl.onmouseover=function(){
                login.user_select_setpc(this._id);
            };
            login.usersel.push(hl);
            login.load_user_config(login.users[i]);
        }

        login.sel=0;
        if (login.default_user<login.users.length){
            login.sel=login.default_user;
        }
        if (location.hash.indexOf("#pp=")>-1){
            try{
                var ss=parseInt(location.hash.substring(4));
                if (!isNaN(ss) && ss>=0 && ss<login.users.length){
                    login.sel=ss;
                }
            }catch(e){}
        }
        login.usersel[login.sel].classList.add('active');
        login.update_theme();

        _KEY_CB = login.user_select_keycb;

        /* PIN KEYPAD */
        var pin=$n('div', 'pin', null, pinhold, '');
        login.pin=pinhold;
        pinhold.onclick=function(ev){
            if (ev.target==this){
                _KEYEV(KBACK);
            }
        }
        pinhold._pin=pin;
        pin._usr = $n('div', 'user_item active', null, pin, '');
        pin._img = $n('img', '', { src: login.ppimg(0) }, pin._usr, '');
        pin._dn = $n('div', 'user_name', null, pin._usr, special(login.ppname(0)));
        pin._keypad = $n('div', 'pin_keypad', null, pin, '');
        pin._pinvalue = $n('div', 'pin_value', null, pin._keypad, '');
        pin._keys=[];
        pin._keysel=0;
        var keys=[
            ['7','8','9'],
            ['4','5','6'],
            ['1','2','3'],
            ['clear','0','backspace']
        ];
        var ks={
            'clear':'clear',
            'backspace':'backspace'
        };
        for (var i=0;i<4;i++){
            for (var j=0;j<3;j++){
                var k=keys[i][j];
                var t=k;
                var c='';
                if (k in ks){
                    t='<c>'+ks[k]+'</c>';
                    c=' pin_key_fn';
                }
                var l=$n('div','pin_key'+c,null,pin._keypad,t);
                if (k=='0'){
                    l.classList.add('active');
                    pin._keysel=pin._keys.length;
                }
                l._val=k;
                l._id=pin._keys.length;
                l.onclick = function () {
                    login.pin_click(this);
                };
                l.ontouchstart=
                l.onmouseover=function(){
                    login.pin_setpc(this._id);
                };
                pin._keys.push(l);
            }
        }
        /* PIN */
        requestAnimationFrame(function(){
            login.h.className='';
        });
    },
    go:function(id,prefix){
        _JSAPI.profileSetSel(id);
        _JSAPI.profileSetPrefix(prefix);
        var sdval = parseInt(_JSAPI.storeGet(prefix+"sd","1"));
        sdval=isNaN(sdval)?1:sdval;
        _JSAPI.setSd(sdval);
        setTimeout(function(){
            _JSAPI.reloadHome();
        },1);
    },
    start: function () {
        if ((location.hash=='#appstart') && (login.default_user>0)){
            if (!login.users[login.default_user].p){
                login.go(login.default_user,login.users[login.default_user].u);
                return;
            }
        }
        if (login.users.length > 1) {
            login.stat = 1;
            login.user_select();
        }
        else if (login.users[0].p) {
            login.stat = 2;
            login.user_select();
        }
        else {
            login.go(0,"");
        }
    }
};

login.init();