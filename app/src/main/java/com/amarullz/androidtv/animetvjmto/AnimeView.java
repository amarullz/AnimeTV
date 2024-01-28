package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.devbrackets.android.exomedia.core.video.scale.ScaleType;
import com.devbrackets.android.exomedia.ui.widget.VideoView;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.Date;
import java.util.Map;

public class AnimeView extends WebViewClient {
  private static final String _TAG="ATVLOG-VIEW";
  private final Activity activity;
  public final WebView webView;
  public VideoView videoView=null;
  public final ImageView splash;
  public final RelativeLayout videoLayout;
  public final AnimeApi aApi;
  public String playerInjectString;
  public boolean webViewReady=false;
  public static boolean USE_WEB_VIEW_ASSETS=false;

  private void setFullscreen(){
      activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
              WindowManager.LayoutParams.FLAG_FULLSCREEN);

      View decorView = activity.getWindow().getDecorView();
      int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN
              | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_IMMERSIVE
              | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
              | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      decorView.setSystemUiVisibility(uiOptions);
      activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
  }

  @SuppressLint("SetJavaScriptEnabled")
  public AnimeView(Activity mainActivity) {
    activity = mainActivity;
    WebView.setWebContentsDebuggingEnabled(true);

    setFullscreen();
    VERSION_INIT();

    splash=activity.findViewById(R.id.splash);
    videoLayout= activity.findViewById(R.id.video_layout);
    webView = activity.findViewById(R.id.webview);
    webView.requestFocus();
    webView.setBackgroundColor(Color.TRANSPARENT);
    WebSettings webSettings = webView.getSettings();

    webSettings.setJavaScriptEnabled(true);
    webSettings.setMediaPlaybackRequiresUserGesture(false);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
    webSettings.setSafeBrowsingEnabled(false);
    webSettings.setSupportMultipleWindows(false);
    webSettings.setAllowFileAccess(true);
    webSettings.setAllowContentAccess(true);
    webSettings.setDomStorageEnabled(true);

    /* UAG */
    webSettings.setUserAgentString(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"+
            " (KHTML, like Gecko) Chrome/116.0.0.0 "+"" +
            "Safari/537.36 Edg/116.0.1938.69"
    );

    /* performance tweaks */
    //noinspection deprecation
    webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
    webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);

    webView.addJavascriptInterface(new JSViewApi(), "_JSAPI");
    webView.setWebViewClient(this);
    webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

    webView.setWebChromeClient(new WebChromeClient() {
      @Override public Bitmap getDefaultVideoPoster() {
        final Bitmap bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawARGB(255, 0, 0, 0);
        return bitmap;
      }
    });
    webView.setVerticalScrollBarEnabled(false);
    webView.setBackgroundColor(Color.TRANSPARENT);

    initVideoView();
    videoViewSetScale(videoStatScaleType);

    aApi=new AnimeApi(activity);
    playerInjectString=aApi.assetsString("inject/view_player.html");
    webView.loadUrl("https://"+Conf.DOMAIN+"/__view/main.html");

    // Init Channel Provider
    AnimeProvider.executeJob(activity);
  }

  public void reloadView(){
    aApi.cleanWebView();
    webView.clearCache(true);
    webView.loadUrl("https://"+Conf.DOMAIN+"/__view/main.html");
  }

  public void videoViewSetScale(int type){
    videoStatScaleType=type;
    activity.runOnUiThread(()-> {
      try {
        if (type == 0)
          videoView.setScaleType(ScaleType.FIT_CENTER);
        else if (type == 1)
          videoView.setScaleType(ScaleType.CENTER_CROP);
        else if (type == 2)
          videoView.setScaleType(ScaleType.FIT_XY);
      }catch (Exception ignored){}
    });
  }

  public void initVideoView(){
    if (videoView!=null){
      videoLayout.removeAllViews();
      videoView=null;
    }
    videoView = new VideoView(activity);
    videoView.setLayoutParams(
        new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT)
    );
    videoLayout.addView(videoView);
    videoView.setVideoControls(null);
    videoView.setOnPreparedListener(videoView::start);
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
    String url = request.getUrl().toString();
    return !url.startsWith("https://"+Conf.DOMAIN+"/");
  }

  @Override
  public WebResourceResponse shouldInterceptRequest(final WebView view,
                                                    WebResourceRequest request) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    String host = uri.getHost();
    String accept = request.getRequestHeaders().get("Accept");
    if (host==null||accept==null) return aApi.badRequest;
    if (host.contains(Conf.DOMAIN)) {
      String path=uri.getPath();
      if (path.startsWith("/__view/")){
        if (USE_WEB_VIEW_ASSETS){
          if (!path.endsWith(".woff2") && !path.endsWith(".ttf")) {
            /* dev web */
            try {
              Log.d(_TAG, "VIEW GET " + url + " = " + accept);
              String newurl = url.replace("https://"+Conf.DOMAIN, "http://192" +
                  ".168.100.245");
              HttpURLConnection conn = aApi.initQuic(newurl, request.getMethod());
              for (Map.Entry<String, String> entry :
                      request.getRequestHeaders().entrySet()) {
                conn.setRequestProperty(entry.getKey(), entry.getValue());
              }
              String[] cType = aApi.parseContentType(conn.getContentType());
              ByteArrayOutputStream buffer = AnimeApi.getBody(conn, null);
              InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
              return new WebResourceResponse(cType[0], cType[1], stream);
            } catch (Exception ignored) {}
            return aApi.badRequest;
          }
        }
        return aApi.assetsRequest(uri.getPath().substring(3));
      }
      else if (path.startsWith("/__proxy/")){
        try {
          String proxy_url=url.replace("https://"+Conf.DOMAIN+"/__proxy/","");
          Log.d(_TAG, "PROXY-GET = " + proxy_url);
          HttpURLConnection conn = aApi.initQuic(proxy_url, request.getMethod());
          for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
            conn.setRequestProperty(entry.getKey(), entry.getValue());
          }
          String[] cType = aApi.parseContentType(conn.getContentType());
          ByteArrayOutputStream buffer = AnimeApi.getBody(conn, null);
          InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
          return new WebResourceResponse(cType[0], cType[1], stream);
        } catch (Exception ignored) {}
        return aApi.badRequest;
      }
      try {
        HttpURLConnection conn = aApi.initQuic(url, request.getMethod());
        for (Map.Entry<String, String> entry :
            request.getRequestHeaders().entrySet()) {
          conn.setRequestProperty(entry.getKey(), entry.getValue());
        }
        String[] cType = aApi.parseContentType(conn.getContentType());
        ByteArrayOutputStream buffer = AnimeApi.getBody(conn, null);
        InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
        return new WebResourceResponse(cType[0], cType[1], stream);
      } catch (Exception ignored) {
        Log.e(_TAG, "VIEW-GET-DOMAIN-ERR: " + url,ignored);
      }
      return aApi.badRequest;
    }
    else if (host.contains(Conf.STREAM_DOMAIN)||host.contains("vidstream" +
        ".pro")||host.contains("vizcloud.co")||host.contains("mcloud.to")){
      if (accept.startsWith("text/html")||
          url.startsWith("https://"+Conf.STREAM_DOMAIN+"/mediainfo")||
          url.startsWith("https://vizcloud.co/mediainfo")||
          url.startsWith("https://mcloud.to/mediainfo")||
          url.startsWith("https://vidstream.pro/mediainfo")) {
        Log.d(_TAG,"VIEW PLAYER REQ = "+url);
        if (!accept.startsWith("text/html"))
          sendVidpageLoaded(1);
        try {
          HttpURLConnection conn = aApi.initQuic(url, request.getMethod());
          for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
            conn.setRequestProperty(entry.getKey(), entry.getValue());
          }
          String[] cType = aApi.parseContentType(conn.getContentType());
          if (conn.getResponseCode()==200) {
            ByteArrayOutputStream buffer = AnimeApi.getBody(conn, null);
            if (accept.startsWith("text/html")) {
              aApi.injectString(buffer, playerInjectString);
              sendVidpageLoaded(0);
            } else {
              Log.d(_TAG, "sendM3U8Req = " + buffer.toString("UTF-8"));
              sendM3U8Req(buffer.toString("UTF-8"));
              try {
                Thread.sleep(500);
              }catch(Exception ignored){}
              Log.d(_TAG, "sendM3U8Req Wait = " + buffer.toString("UTF-8"));
            }
            InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
            return new WebResourceResponse(cType[0], cType[1], stream);
          }
        } catch (Exception ignored) {}
        if (!accept.startsWith("text/html"))
          sendVidpageLoaded(2);
        else
          sendVidpageLoaded(3);
        return aApi.badRequest;
      }else if (accept.startsWith("text/css")||accept.startsWith("image/")){
        Log.d(_TAG,"BLOCK CSS/IMG = "+url);
        return aApi.badRequest;
      }
    }
    else if (host.contains("rosebudemphasizelesson.com")||
            host.contains("simplewebanalysis.com")||
      host.contains("addthis.com")||
      host.contains("amung.us")||
      host.contains("www.googletagmanager.com")||
      host.contains("ontosocietyweary.com")
    ){
      /* BLOCK DNS */
      return aApi.badRequest;
    }
    return super.shouldInterceptRequest(view, request);
  }

  public void getViewCallback(int u){
    webView.evaluateJavascript("__GETVIEWCB(JSON.parse(_JSAPI.lastResult()),"+u+");",null);
  }

  public void sendM3U8Req(String data){
    AsyncTask.execute(() ->activity.runOnUiThread(() ->
            webView.evaluateJavascript(
                    "__M3U8CB("+data+");",null)
    ));
  }

  public void sendVidpageLoaded(int v){
    Log.d(_TAG,"sendVidpageLoaded --> "+v);
    AsyncTask.execute(() ->activity.runOnUiThread(() ->
        webView.evaluateJavascript(
            "__VIDPAGELOADCB("+v+");",null)
    ));
  }

  public void runOnUiThreadWait(Runnable r){
    final Runnable rw=new Runnable() {
      @Override
      public void run() {
        synchronized(this)
        {
          r.run();
          this.notify();
        }
      }
    };
    //noinspection SynchronizationOnLocalVariableOrMethodParameter
    synchronized(rw) {
      activity.runOnUiThread(rw);
      try {
        rw.wait();
      } catch (InterruptedException ignored) {
      }
    }
  }

  public class JSViewApi{
    private String lastResultText="";
    private String lastResultUrl="";

    @JavascriptInterface
    public boolean getview(String url, int zid) {
      if (aApi.resData.status==1) return false;
      if (lastResultUrl.equals(url)){
        AsyncTask.execute(() ->activity.runOnUiThread(() ->getViewCallback(zid)));
        return true;
      }
      AsyncTask.execute(() -> activity.runOnUiThread(() -> aApi.getData(url, result -> {
        lastResultUrl=url;
        lastResultText=result.Text;
        getViewCallback(zid);
      })));
      return true;
    }

    @JavascriptInterface
    public String lastResult() {
      return lastResultText;
    }

    @JavascriptInterface
    public void clearView() {
      aApi.cleanWebView();
    }

    @JavascriptInterface
    public void tapEmulate(float x, float y) {
      AsyncTask.execute(() -> simulateClick(x,y));
    }

    @JavascriptInterface
    public void appQuit() {
      activity.finish();
    }

    @JavascriptInterface
    public void showIme(boolean show){
      Log.d(_TAG,"SHOW IME = "+show);
      activity.runOnUiThread(()->{
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        if (show){
          imm.showSoftInput(webView, 0);
        }
        else{
          imm.hideSoftInputFromWindow(webView.getWindowToken(), 0);
        }
      });
    }

    @JavascriptInterface
    public String getArg(String name){
      switch (name) {
        case "url":
          if (MainActivity.ARG_URL != null)
            return MainActivity.ARG_URL;
          break;
        case "tip":
          if (MainActivity.ARG_TIP != null)
            return MainActivity.ARG_TIP;
          break;
        case "pos":
          if (MainActivity.ARG_POS != null)
            return MainActivity.ARG_POS;
          break;
      }
      return "";
    }

    @JavascriptInterface
    public void showToast(String txt){
      activity.runOnUiThread(() ->
          Toast.makeText(activity,txt,Toast.LENGTH_SHORT).show()
      );
    }

    @JavascriptInterface
    public void getmp4vid(String url) {
      AsyncTask.execute(() -> {
        final String out=aApi.getMp4Video(url);
        activity.runOnUiThread(() -> webView.evaluateJavascript("__MP4CB("+out+");",null));
      });
    }

    @JavascriptInterface
    public void playNextMeta(String t, String d, String p, String u, String i){
      pnUpdated=false;
      pnTitle=t;
      pnDesc=d;
      pnPoster=p;
      pnUri=u;
      pnTip=i;
      Log.d(_TAG,"Update Meta ("+u+"; "+t+"; "+d+"; "+i+")");
    }

    @JavascriptInterface
    public void videoSetUrl(String url){
      Log.d(_TAG,"Video Set URL = "+url);
      videoIsPlaying=false;
      videoDuration=0;
      videoPosition=0;
      videoStatCurrentUrl=url;
      activity.runOnUiThread(()->{
        try {
          if (url.equals("")) {
            videoView.stop();
            videoView.setMedia((Uri) null);
            videoView.reset();
          } else {
            videoView.setMedia(Uri.parse(url));
            videoView.start();
          }
        }catch(Exception ignored){}
      });
    }

    @JavascriptInterface
    public void videoSetSpeed(float speed){
      activity.runOnUiThread(()-> {
        try {
          videoView.setPlaybackSpeed(speed);
        }catch(Exception ignored){}
      });
    }

    private boolean videoIsPlaying=false;
    private int videoDuration=0;
    private int videoPosition=0;
    @JavascriptInterface
    public void videoSetScale(int type){
      activity.runOnUiThread(()-> {
        try {
          videoViewSetScale(type);
        }catch(Exception ignored){}
      });
    }

    @JavascriptInterface
    public void setStreamType(int type, int clean){
      Log.d(_TAG,"[X] setStreamType = "+type+" / clean="+clean);
      if (clean==1) {
        lastResultUrl = "";
        aApi.cleanWebView();
      }
      Conf.STREAM_TYPE=type;
    }

    @JavascriptInterface
    public int getStreamType(){
      return Conf.STREAM_TYPE;
    }

    @JavascriptInterface
    public void videoSetPosition(int pos){
      activity.runOnUiThread(()-> {
        try {
          videoView.seekTo(pos);
        }catch(Exception ignored){}
      });
    }
    @JavascriptInterface
    public int videoGetDuration(){
      runOnUiThreadWait(()-> {
        try {
          videoDuration =
              (int) Math.floor(videoView.getDuration());
        }catch(Exception ignored){}
      });
      return videoDuration;
    }
    @JavascriptInterface
    public boolean videoIsPlaying(){
      runOnUiThreadWait(()->{
        try {
          videoIsPlaying = videoView.isPlaying();
        }catch(Exception ignored){}
      });
      return videoIsPlaying;
    }
    @JavascriptInterface
    public int videoGetPosition(){
      runOnUiThreadWait(()->{
        try {
          videoPosition =
              (int) Math.ceil(videoView.getCurrentPosition());
        }catch (Exception ignored){}
      });
      return videoPosition;
    }
    @JavascriptInterface
    public void videoPlay(boolean play){
      activity.runOnUiThread(()->{
        try {
          if (play)
            videoView.start();
          else
            videoView.pause();
        }catch (Exception ignored){}
      });
    }

    @JavascriptInterface
    public String dns(){
      return Conf.DOMAIN;
    }

    @JavascriptInterface
    public String dnsver(){
      return Conf.SERVER_VER;
    }

    @JavascriptInterface
    public void playNextPos(int pos, int duration){
      pnUpdated=true;
      pnPos=pos;
      pnDuration=duration;
    }
    @JavascriptInterface
    public void playNextClear(){
      pnUpdated=false;
      AsyncTask.execute(() -> {
        try {
          AnimeProvider.clearPlayNext(activity);
        } catch (Exception ignored) {
        }
      });
    }
    @JavascriptInterface
    public void playNextRegister(){
      updatePlayNext();
    }
    @JavascriptInterface
    public String getVersion(int type){
      if (type==0)
        return APP_VERSION;
      return BUILD_VERSION;
    }

  }

  @Override
  public void onPageFinished(WebView view, String url) {
    splash.setVisibility(View.GONE);
    videoLayout.setVisibility(View.VISIBLE);
    webView.setVisibility(View.VISIBLE);
    activity.runOnUiThread(webView::requestFocus);
    webViewReady=true;
  }

  private void simulateClick(float xx, float yy) {
    int x=(int) ((webView.getMeasuredWidth()*xx)/100.0);
    int y=(int) ((webView.getMeasuredHeight()*yy)/100.0);
    Log.d(_TAG,"TAP: ("+x+", "+y+") -> "+xx+"%, "+yy+"%");
    long downTime = SystemClock.uptimeMillis();
    long eventTime = SystemClock.uptimeMillis() + 150;
    int metaState = 0;
    MotionEvent me = MotionEvent.obtain(
        downTime,
        eventTime,
        MotionEvent.ACTION_DOWN,
        x,
        y,
        metaState
    );
    webView.dispatchTouchEvent(me);
    me = MotionEvent.obtain(
        downTime,
        eventTime,
        MotionEvent.ACTION_UP,
        x,
        y,
        metaState
    );
    webView.dispatchTouchEvent(me);
  }

  public void updateArgs(){
    activity.runOnUiThread(() -> webView.evaluateJavascript("__ARGUPDATE();",null));
  }

  public boolean pnUpdated=false;
  public String pnTitle="";
  public String pnDesc="";
  public String pnPoster="";
  public String pnUri="";
  public String pnTip="";
  public int pnPos=0;
  public int pnDuration=0;
  public void updatePlayNext(){
    AsyncTask.execute(() -> {
      if (pnUpdated){
        pnUpdated=false;
        if (pnPos>10&&(pnDuration-pnPos>10)) {

            try {
              AnimeProvider.setPlayNext(
                      activity, pnTitle, pnDesc,
                      pnPoster, pnUri, pnTip,
                      pnPos, pnDuration
              );
            } catch (Exception ignored) {
            }
        }
      }
    });
  }

  private int videoStatCurrentPosition=0;
  private boolean videoStatIsPlaying=false;
  private int videoStatScaleType=0;
  private String videoStatCurrentUrl="";

  public void onStartPause(boolean isStart){
    if (isStart){
      initVideoView();
      videoViewSetScale(videoStatScaleType);
      if (!videoStatCurrentUrl.equals("")){
        videoView.setMedia(Uri.parse(videoStatCurrentUrl));
        if (videoStatCurrentPosition>0) {
          videoView.seekTo(videoStatCurrentPosition);
          if (videoStatIsPlaying)
            videoView.start();
        }
      }
      Log.d(_TAG,"ONSTART -> "+videoStatCurrentPosition);
    }
    else{
      if (videoView.getDuration()>0) {
        videoStatCurrentPosition = (int) videoView.getCurrentPosition();
        videoStatIsPlaying = videoView.isPlaying();
      }
      else {
        videoStatCurrentPosition = 0;
        videoStatIsPlaying = false;
      }
      Log.d(_TAG,"ONPAUSE -> "+videoStatCurrentPosition);
    }
  }
  public void onSaveRestore(boolean isSave, Bundle bundle)
  {
    if (isSave){
      webView.saveState(bundle);
      aApi.webView.saveState(bundle);
      if (videoView.getDuration()>0)
        bundle.putInt("VIDEO_CURRPOS", (int) videoView.getCurrentPosition());
      else
        bundle.putInt("VIDEO_CURRPOS", 0);
      bundle.putString("VIDEO_CURR_URL", videoStatCurrentUrl);
      bundle.putInt("VIDEO_SCALETYPE", videoStatScaleType);
//      Log.d(_TAG,"onSaveInstanceState -> "+videoView.getCurrentPosition());
    }
    else{
      webView.restoreState(bundle);
      aApi.webView.restoreState(bundle);
      int savedPos=bundle.getInt("VIDEO_CURRPOS",0);
      videoStatScaleType=bundle.getInt("VIDEO_SCALETYPE",0);
      String saveUrl=bundle.getString("VIDEO_CURR_URL");
      Log.d(_TAG,"ONRESTORE -> "+savedPos);

      initVideoView();
      videoViewSetScale(videoStatScaleType);
      if (!saveUrl.equals("")) {
        if (savedPos > 0) {
          try {
            videoView.seekTo(savedPos);
            videoView.start();
          }catch (Exception ignored){}
        }
      }
    }
  }

  /* Init & Versioning */
  public static String APP_VERSION=BuildConfig.VERSION_NAME;
  public static String BUILD_VERSION="2307210136";
  public static void VERSION_INIT(){
    BUILD_VERSION = (String) android.text.format.DateFormat.format(
        "yyMMddHHmm", new Date(BuildConfig.TIMESTAMP)
    );
  }
}
