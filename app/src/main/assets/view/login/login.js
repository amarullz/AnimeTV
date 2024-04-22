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
    h: $('animetv'),
    users: [],
    usersel: [],
    sel: 0,
    stat: 0,
    ppimg: function (id) {
        var usr = login.users[id];
        if (usr) {
            return '/__view/profile/' + (usr.i) + '.png';
        }
        return '/__view/profile/0.png';
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
        login.start();
    },
    user_select_click: function (el) {
        el.classList.add('clicked');
        _JSAPI.profileSetSel(el._id);
        _JSAPI.profileSetPrefix(el._data.u);
        _JSAPI.reloadHome();
    },
    user_select_setpc:function(pc){
        if (pc!=login.sel){
            login.usersel[login.sel].classList.remove('active');
            login.usersel[pc].classList.add('active');
            login.sel=pc;
        }
    },
    user_select_keycb: function (k) {
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
    user_select: function () {
        login.h.innerHTML = '';
        var flexhold = $n('div', 'flexhold', null, login.h, '');
        var hold = $n('div', 'user_sel', null, flexhold, '');
        var logo = $n('img', 'login_logo', {src:'/__view/logo.svg'}, login.h, '');
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
        }
        login.sel=0;
        login.usersel[0].classList.add('active');
        _KEY_CB = login.user_select_keycb;
    },
    start: function () {
        if (login.users.length > 1) {
            login.stat = 2;
            login.user_select();
        }
        else if (login.users[0].p) {
            login.stat = 2;
            login.user_select();
        }
        else {
            _JSAPI.profileSetSel(0);
            _JSAPI.profileSetPrefix("");
            _JSAPI.reloadHome();
        }
    }
};

login.init();