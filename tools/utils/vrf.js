const VRF={
  server_ids:[
    'vidplay','megaf','mp4u','moonf'
  ],
  server_titles:[
    'VidPlay','MegaF','Mp4Upload','Filemoon'
  ],

  vskeys:[
    'BvxAphQAmWO9BIJ8',

    'dawQCziL2v',
    'E1KyOcIMf9v7XHg', 'gMvO97yE1cfKIXH', 

    'thDz4uPKGSYW', 
    'ZSsbx4NtMpOoCh', 'ZCo4MthpsNxSOb',
    
    'QIP5jcuvYEKdG', 
    'fH0n3GZDeKCE6', '0GCn6e3ZfDKEH', 
  ],

  /* VIDSTREAM DECODER */
  vidstreamMakeUrl:function(vidHost, vidSearch, n){
    console.warn([vidHost, vidSearch, n]);
    let x=n;

    var u=VRF.safeBtoa;
    var a=VRF.rc4;
    var s=VRF.replaceChars;
    var C=VRF.reverseString;

    x=u(a(VRF.vskeys[1],C(s(x,VRF.vskeys[2],VRF.vskeys[3]))));
    x=u(a(VRF.vskeys[4],s(C(x),VRF.vskeys[5],VRF.vskeys[6])));
    x=u(s(C(u(a(VRF.vskeys[7],x))),VRF.vskeys[8],VRF.vskeys[9]));

    /* 
    n=btoa(VRF.rc4(VRF.vskeys[0],n));
    return 'https://'+vidHost+'/mediainfo/'+x+vidSearch+'&h='+n;
    */
    return 'https://'+vidHost+'/mediainfo/'+x+vidSearch;
  },
  
  vidstreamDecode:function(x){
    var u=VRF.safeAtob;
    var a=VRF.rc4;
    var s=VRF.replaceChars;
    var C=VRF.reverseString;

    x=a(VRF.vskeys[7],u(C(s(u(x),VRF.vskeys[9],VRF.vskeys[8]))));
    x=C(s(a(VRF.vskeys[4],u(x)),VRF.vskeys[6],VRF.vskeys[5]));
    x=s(C(a(VRF.vskeys[1],u(x))),VRF.vskeys[3],VRF.vskeys[2]);
    return x;
  },

  /* VRF */
  rc4:function(key, str) {
    var s = [], j = 0, x, res = '';
    for (var i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (i = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
  },
  safeBtoa:function(s){
    return btoa(s).replace(/\//g, '_').replace(/\+/g, '-');
  },
  safeAtob:function(s){
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'))
  },

  /* NEW VRF */
  reverseString:function(s) {
    return s.split('').reverse().join('');
  },
  replaceChars:function(s,f,r){
    let i = f.length;
    let m = {};
    while (i-- && (m[f[i]] = r[i])){}
    return s.split("").map(v=>m[v]||v).join('');
  },
  vrfEncrypt:function(x){
    x = VRF.replaceChars(
      x,
      'AP6GeR8H0lwUz1', 
      'UAz8Gwl10P6ReH'
    );
    x = btoa(VRF.rc4('ItFKjuWokn4ZpB', x));
    x = VRF.reverseString(x);
  
    x = VRF.reverseString(x);
    x = btoa(VRF.rc4('fOyt97QWFB3',x));
    x = VRF.replaceChars(
      x,
      '1majSlPQd2M5',
      'da1l2jSmP5QM'
    );
  
    x = VRF.replaceChars(
      x,
      'CPYvHj09Au3',
      '0jHA9CPYu3v'
    );
    x = VRF.reverseString(x);
    x = btoa(
      VRF.rc4(
        "736y1uTJpBLUX",
        x
      )
    );
    x=btoa(x);
    return x;
  },
  vrfDecrypt:function(x){
    return x = VRF.safeAtob(x = '' + x),
    x = VRF.replaceChars(x = VRF.reverseString(
      x = VRF.rc4('736y1uTJpBLUX', VRF.safeAtob(x))
    ), '0jHA9CPYu3v', 'CPYvHj09Au3'),
    x = VRF.reverseString(
      x = VRF.rc4(
        'fOyt97QWFB3',
        VRF.safeAtob(
          x = VRF.replaceChars(
            x, 'da1l2jSmP5QM', '1majSlPQd2M5')
        )
      )
    ),
    x = VRF.replaceChars(
      x = VRF.rc4(
        'ItFKjuWokn4ZpB',
        VRF.safeAtob(x = VRF.reverseString(x))
      ),
      'UAz8Gwl10P6ReH', 'AP6GeR8H0lwUz1'
    );
  }
};
