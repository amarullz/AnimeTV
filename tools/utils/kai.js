const KAICODEX = {
  /* ANIMEKAI CODEX */
  enc(n) {
    var u = KAICODEX.safeBtoa;
    var a = KAICODEX.rc4;
    var s = KAICODEX.replaceChars;
    var r = KAICODEX.reverseString;
    n = u(
      s(
        u(
          a(
            'sXmH96C4vhRrgi8',
            r(
              r(
                u(
                  a('kOCJnByYmfI', s(
                    s(
                      r(
                        u(
                          a('0DU8ksIVlFcia2', n)
                        )
                      ),
                      '1wctXeHqb2', '1tecHq2Xbw'
                    ),
                    '48KbrZx1ml', 'Km8Zb4lxr1'
                  )
                  )
                )
              )
            )
          )
        ), 'hTn79AMjduR5', 'djn5uT7AMR9h')
    );
    return encodeURIComponent(n);
  },
  encPlain(n) {
    return KAICODEX.safeBtoa(KAICODEX.rc4(
      'n1PEbDBiipbJZvZc',
      encodeURIComponent(n)
    ));
  },
  dec(n) {
    var u = KAICODEX.safeAtob;
    var a = KAICODEX.rc4;
    var s = KAICODEX.replaceChars;
    var r = KAICODEX.reverseString;
    n = a(
      '0DU8ksIVlFcia2',
      u(
        r(
          s(
            s(
              a('kOCJnByYmfI',
                u(
                  r(
                    r(
                      a(
                        'sXmH96C4vhRrgi8',
                        u(
                          s(
                            u(n),
                            'djn5uT7AMR9h',
                            'hTn79AMjduR5'
                          )
                        )
                      )
                    )
                  )
                )
              ), 'Km8Zb4lxr1', '48KbrZx1ml'
            ),
            '1tecHq2Xbw', '1wctXeHqb2'
          )
        )
      )
    )
    return decodeURIComponent(n);
  },
  decPlain(n) {
    return decodeURIComponent(
      KAICODEX.rc4(
        'n1PEbDBiipbJZvZc',
        KAICODEX.safeAtob(n)
      )
    );
  },
  decMega(n) {
    var base64_url_decode = KAICODEX.safeAtob;
    var transform = KAICODEX.rc4;
    var substitute = KAICODEX.replaceChars;
    var reverse_it = KAICODEX.reverseString;

    n =substitute(
                reverse_it(
                    transform(
                        "3U8XtHJfgam02k",
                        base64_url_decode(
                            transform(
                                "PgiY5eIZWn",
                                base64_url_decode(
                                    substitute(
                                        reverse_it(
                                            substitute(
                                                transform(
                                                    "QKbVomcBHysCW9",
                                                    base64_url_decode(
                                                        reverse_it(
                                                            base64_url_decode(n)
                                                        )
                                                    )
                                                ),
                                                "0GsO8otUi21aY", "Go1UiY82st0Oa"
                                            )
                                        ),
                                        "rXjnhU3SsbEd", "rXEsS3nbjhUd"
                                    )
                                )
                            )
                        )
                    )
                ),
                "7DtY4mHcMA2yIL", "IM7Am4D2yYHctL"
            
        );
    return decodeURIComponent(n);
  },

  /* Helper */
  rc4: function (key, str) {
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
  safeBtoa: function (s) {
    return btoa(s).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
  },
  safeAtob: function (s) {
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'));
  },
  reverseString: function (s) {
    return s.split('').reverse().join('');
  },
  replaceChars: function (s, f, r) {
    let i = f.length;
    let m = {};
    while (i-- && (m[f[i]] = r[i])) { }
    return s.split("").map(v => m[v] || v).join('');
  }
};

