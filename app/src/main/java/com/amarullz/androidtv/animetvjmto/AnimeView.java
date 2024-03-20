package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.text.Html;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.datasource.DefaultHttpDataSource;
import androidx.media3.exoplayer.dash.DashMediaSource;
import androidx.media3.exoplayer.source.MediaSource;

import com.devbrackets.android.exomedia.core.source.data.DataSourceFactoryProvider;
import com.devbrackets.android.exomedia.core.video.scale.MatrixManager;
import com.devbrackets.android.exomedia.core.video.scale.ScaleType;
import com.devbrackets.android.exomedia.core.video.surface.SurfaceEnvelope;
import com.devbrackets.android.exomedia.core.video.surface.SurfaceViewSurfaceEnvelope;
import com.devbrackets.android.exomedia.nmp.ExoMediaPlayerImpl;
import com.devbrackets.android.exomedia.nmp.config.PlayerConfig;
import com.devbrackets.android.exomedia.nmp.config.PlayerConfigBuilder;
import com.google.common.base.Charsets;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@UnstableApi public class AnimeView extends WebViewClient {
  private static final String _TAG="ATVLOG-VIEW";
  private final Activity activity;
  public final WebView webView;
  public final WebView webView2;
  public SurfaceView videoView=null;
  public ExoMediaPlayerImpl videoPlayer=null;
  public LinearLayout cfProgress;
  public final ImageView splash;
  public final FrameLayout videoLayout;
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
              | View.SYSTEM_UI_FLAG_LOW_PROFILE
              | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      decorView.setSystemUiVisibility(uiOptions);
      activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
  }

  @SuppressLint("SetJavaScriptEnabled")
  public void webviewInitConfig(WebView wv){
    WebSettings webSettings = wv.getSettings();

    webSettings.setJavaScriptEnabled(true);
    webSettings.setMediaPlaybackRequiresUserGesture(false);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//      webSettings.setSafeBrowsingEnabled(true);
//    }
    webSettings.setSupportMultipleWindows(false);
    webSettings.setAllowFileAccess(true);
    webSettings.setAllowContentAccess(true);
    webSettings.setDomStorageEnabled(true);

    /* UAG */
    webSettings.setUserAgentString(Conf.USER_AGENT);

    /* performance tweaks */
    //noinspection deprecation
    webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
    webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);

    wv.addJavascriptInterface(new JSViewApi(), "_JSAPI");
    wv.setWebViewClient(this);
    wv.setLayerType(View.LAYER_TYPE_HARDWARE, null);
  }

  @SuppressLint("SetJavaScriptEnabled")
  public AnimeView(Activity mainActivity) {
    activity = mainActivity;

    WebView.setWebContentsDebuggingEnabled(true);

    setFullscreen();
    VERSION_INIT();

    cfProgress=activity.findViewById(R.id.cfprogress);
    splash=activity.findViewById(R.id.splash);
    videoLayout= activity.findViewById(R.id.video_layout);
    webView2 = activity.findViewById(R.id.webview2);
    webView = activity.findViewById(R.id.webview);
    webView.requestFocus();
    webView.setBackgroundColor(Color.TRANSPARENT);
    webviewInitConfig(webView);
    webviewInitConfig(webView2);

    webView.setWebChromeClient(new WebChromeClient() {
      @Override public Bitmap getDefaultVideoPoster() {
        final Bitmap bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawARGB(255, 0, 0, 0);
        return bitmap;
      }

      @Override
      public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
        CharSequence msg=message;
        String title="AnimeTV";
        try{
          JSONObject jo=new JSONObject(message);
          if (jo.has("title")){
            title=jo.getString("title");
          }
          boolean isHtml=false;
          if (jo.has("html")){
            isHtml=true;
          }
          if (jo.has("message")){
            if (isHtml){
              msg= Html.fromHtml(jo.getString("message"));
            }
            else {
              msg = jo.getString("message");
            }
          }
        }catch(Exception ignored){}
        new AlertDialog.Builder(activity)
            .setTitle(title)
            .setMessage(msg)
            .setPositiveButton("Yes",
                (dialog, which) -> result.confirm())
            .setNegativeButton("No",
                (dialog, which) -> result.cancel())
                .setOnDismissListener(dialogInterface -> result.cancel())
            .create()
            .show();
        return true;
      }
      @Override
      public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        AlertDialog.Builder builder = new AlertDialog.Builder(
            activity);
        builder.setMessage(message)
            .setNeutralButton(android.R.string.ok, (dialog, arg1) -> dialog.dismiss()).show();
        result.cancel();
        return true;
      }

      @Override
      public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        try{
          JSONObject jo=new JSONObject(message);
          String type=jo.getString("type");
          String title=jo.getString("title");
          if (type.equals("list")){
            JSONArray ja=jo.getJSONArray("list");
            AlertDialog.Builder builder = new AlertDialog.Builder(activity);
            builder.setTitle(title);
            String[] list = new String[ja.length()];
            for (int i=0;i<ja.length();i++){
              list[i]=ja.getString(i);
            }
            if (jo.has("sel")) {
              final int selVal=jo.getInt("sel");
              builder.setSingleChoiceItems(list, selVal,
                      (dialog, which) -> {
                        if (which!=selVal) {
                          result.confirm(String.valueOf(which));
                          dialog.cancel();
                        }
                        else{
                          result.cancel();
                          dialog.cancel();
                        }
                      }
              );
            }
            else {
              builder.setItems(list, (dialog, which) -> result.confirm(String.valueOf(which)));
            }
            builder.setOnDismissListener(dialogInterface -> result.cancel());
            AlertDialog dialog = builder.create();
            dialog.show();

          }
          return true;
        }catch(Exception ignored){}
        return super.onJsPrompt(view,url,message,defaultValue,result);
      }
    });
    webView.setVerticalScrollBarEnabled(false);
    webView.setBackgroundColor(Color.TRANSPARENT);

    initVideoView();
    videoViewSetScale(videoStatScaleType);

    aApi=new AnimeApi(activity);
    playerInjectString=aApi.assetsString("inject/view_player.html");
    webView.loadUrl("https://"+Conf.getDomain()+"/__view/main.html");
//    webView2.loadUrl("https://"+Conf.getDomain()+"/");
//    webView2.setVisibility(View.VISIBLE);
//    webView.setBackgroundColor(Color.WHITE);
//    webView.loadUrl("https://"+Conf.getDomain()+"/");

//    webView.loadUrl("https://www.reddit.com/");
//    splash.setVisibility(View.GONE);
//    videoLayout.setVisibility(View.VISIBLE);
//    webView.setVisibility(View.VISIBLE);
    //
    // https://aniwave.to/ajax/home/widget/updated-sub?page=1

    // Init Channel Provider
    AnimeProvider.executeJob(activity);
  }

  public void reloadView(){
    aApi.cleanWebView();
    webView.clearCache(true);
    webView.loadUrl("https://"+Conf.getDomain()+"/__view/main.html");
  }

  public void videoScaling(){
    if (videoStatScaleType == 0)
      videoViewEnvelope.setScaleType(ScaleType.FIT_CENTER);
    else if (videoStatScaleType == 1)
      videoViewEnvelope.setScaleType(ScaleType.CENTER_CROP);
    else if (videoStatScaleType == 2)
      videoViewEnvelope.setScaleType(ScaleType.FIT_XY);
  }

  public void videoViewSetScale(int type){
    videoStatScaleType=type;
    activity.runOnUiThread(()-> {
      try {
        videoScaling();
      }catch (Exception ignored){}
    });
  }
  public SurfaceEnvelope videoViewEnvelope;
  public PlayerConfig videoPlayerConfig;
  public DataSourceFactoryProvider videoDataSourceFactory=null;

  @SuppressLint("UnsafeOptInUsageError")
  @NonNull
  public void initVideoView(){
    if (videoView!=null){
      videoLayout.removeAllViews();
      videoView=null;
    }
    videoDataSourceFactory= (s, transferListener) -> {
      Map<String, String> settings = new HashMap();
      if (Conf.SOURCE_DOMAIN==5) {
        settings.put("Origin", "https://" + Conf.SOURCE_DOMAIN5_API);
      }
      else{
        try {
          URL vurl=new URL(videoStatCurrentUrl);
          String host=vurl.getHost();
          if (host.contains(Conf.STREAM_DOMAIN1)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN1);
          }
          else if (host.contains(Conf.STREAM_DOMAIN2)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN2);
            settings.put("Referer", "https://" + Conf.STREAM_DOMAIN2+"/");
          }
          else if (host.contains(Conf.STREAM_DOMAIN)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN);
          }
          else if (host.contains(Conf.STREAM_DOMAIN3)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN3);
          }
          else{
            String[] h=host.split("\\.");
            String h2=h[h.length-2]+"."+h[h.length-1];
            settings.put("Origin", "https://" +h2);
          }
        } catch (MalformedURLException ignored) {}
      }
      Log.d(_TAG,"VIDEO-DATA-SOURCE : "+videoStatCurrentUrl+" / ORIGIN : "+settings.get("Origin"));
      return new DefaultHttpDataSource.Factory()
          .setUserAgent(Conf.USER_AGENT)
          .setDefaultRequestProperties(settings)
          .setAllowCrossProtocolRedirects(true);
    };
    videoPlayerConfig=
        new PlayerConfigBuilder(activity).setDataSourceFactoryProvider(videoDataSourceFactory).build();

    videoView=new SurfaceView(activity);
    videoViewEnvelope=new SurfaceViewSurfaceEnvelope(videoView,new MatrixManager());
    videoView.setLayoutParams(
        new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT)
    );
    videoLayout.addView(videoView);

    // Create Video
    videoPlayer=new ExoMediaPlayerImpl(videoPlayerConfig);
    videoPlayer.setSurface(videoView.getHolder().getSurface());
    videoPlayer.setVideoSizeListener(videoSize -> videoViewEnvelope.setVideoSize(videoSize.width, videoSize.height,
        videoSize.pixelWidthHeightRatio));
  }

  public void videoSetSource(String url){
    try {
      if (url.equals("")) {
        videoPlayer.setMediaUri((Uri) null);
      } else {
        if (url.endsWith("#dash")) {
          Log.d(_TAG,"VIDEO-SET-SOURCE (DASH) : "+url);
          MediaSource mediaSource =
              new DashMediaSource.Factory(videoDataSourceFactory.provide(""
                  , null))
                  .createMediaSource(MediaItem.fromUri(url));
          videoPlayer.setMediaSource(mediaSource);
        }
        else {
          Log.d(_TAG,"VIDEO-SET-SOURCE (HLS) : "+url);
          videoPlayer.setMediaUri(Uri.parse(url));
        }
      }
    }catch(Exception ignored){}
  }

  public void videoPlayerPlay(){
    videoPlayer.start();
    videoView.setKeepScreenOn(true);
  }
  public void videoPlayerPause(){
    videoView.setKeepScreenOn(false);
    videoPlayer.pause();
  }
  public void videoPlayerStop(){
    videoView.setKeepScreenOn(false);
    videoPlayer.stop();
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
    String url = request.getUrl().toString();
    return (
        !url.startsWith("https://"+Conf.SOURCE_DOMAINS[1]+"/")&&
            !url.startsWith("https://"+Conf.SOURCE_DOMAINS[2]+"/")
    );
  }

  public boolean isSourceDomain(String host){
    for (int i=1;i<Conf.SOURCE_DOMAINS.length;i++){
      if (host.equals(Conf.SOURCE_DOMAINS[i])){
        return true;
      }
    }
    return false;
  }

  @Override
  public WebResourceResponse shouldInterceptRequest(final WebView view,
                                                    WebResourceRequest request) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    String host = uri.getHost();
    String accept = request.getRequestHeaders().get("Accept");

    if (host==null||accept==null) return aApi.badRequest;
    if (isSourceDomain(host)) {
      String path=uri.getPath();
      if (path==null)
        path="/";
      if (path.startsWith("/__view/")){
        if (USE_WEB_VIEW_ASSETS){
          if (!path.endsWith(".woff2") && !path.endsWith(".ttf")) {
            /* dev web */
            try {
              Log.d(_TAG, "VIEW GET " + url + " = " + accept);
              String newurl = url.replace("https://"+host,"http://192" +
                  ".168.100.245");
              AnimeApi.Http http=new AnimeApi.Http(newurl);
              for (Map.Entry<String, String> entry :
                      request.getRequestHeaders().entrySet()) {
                http.addHeader(entry.getKey(), entry.getValue());
              }
              http.execute();
              InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
              return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
            } catch (Exception ignored) {}
            return aApi.badRequest;
          }
        }
        return aApi.assetsRequest(uri.getPath().substring(3));
      }
      else if (path.startsWith("/__proxy/")){
        /* Proxy */
        try {
          String proxy_url=url.replace("https://"+host+"/__proxy/","");
          String method=request.getMethod();
          boolean isPost=method.equals("POST")||method.equals("PUT");
          boolean isPostBody=false;
          String queryData=request.getUrl().getQuery();
          if (queryData==null){
            queryData="";
          }
          String bodyData = request.getRequestHeaders().get("Post-Body");

          if (isPost){
            if (bodyData!=null) {
              Log.d(_TAG, "PROXY-" + method + " POSTBODY = " +
                      proxy_url + " >> " + bodyData);
              isPostBody=true;
            }
            else {
              int queryLength = queryData.length();
              if (queryLength > 0) {
                proxy_url = proxy_url.substring(0,
                        proxy_url.length() - (queryLength + 1)
                );
              }
              Log.d(_TAG, "PROXY-" + method + " = " +
                      proxy_url + " >> " + queryData);
            }
          }
          else{
            Log.d(_TAG, "PROXY-GET = " + proxy_url);
          }

          String proxyOrigin = request.getRequestHeaders().get("X-Org-Prox");
          String proxyReferer = request.getRequestHeaders().get("X-Ref-Prox");
          String noHeaderProxy = request.getRequestHeaders().get("X-NoH-Proxy");

          AnimeApi.Http http=new AnimeApi.Http(proxy_url);
          if (noHeaderProxy!=null){
            if (proxyOrigin!=null) {
              http.addHeader("Origin", proxyOrigin);
            }
            if (proxyReferer!=null) {
              http.addHeader("Referer", proxyOrigin);
            }
            http.addHeader("User-Agent", Conf.USER_AGENT);
          }
          else {
            for (Map.Entry<String, String> entry :
                    request.getRequestHeaders().entrySet()) {
              String k = entry.getKey();
              boolean sent = false;
              if (k.equalsIgnoreCase("origin") && proxyOrigin != null) {
                http.addHeader("Origin", proxyOrigin);
                sent = true;
              } else if (k.equalsIgnoreCase("referer") && proxyReferer != null) {
                http.addHeader("Referer", proxyReferer);
                sent = true;
              } else if (k.equalsIgnoreCase("X-Org-Prox") || k.equalsIgnoreCase("X-Ref-Prox")) {
                sent = true;
              }
              if (!sent && !k.equals("Post-Body") && !k.equals(
                      "Referer")) {
                http.addHeader(k, entry.getValue());
              }
            }
          }
          if (isPost){
            if (isPostBody){
              http.setMethod(method,bodyData,request.getRequestHeaders().get(
                  "Content-Type"));
            }
            else {
              http.setMethod(method,queryData,"application/x-www-form-urlencoded");
            }
          }
          http.execute();
          InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
          return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
        } catch (Exception ignored) {}
        return aApi.badRequest;
      }
//      if (Conf.HTTP_CLIENT==1 && Conf.SOURCE_DOMAIN<3) {
//        return super.shouldInterceptRequest(view, request);
//      }
      WebResourceResponse wr=aApi.defaultRequest(view,request);
      if (wr!=null){
        return wr;
      }
      return super.shouldInterceptRequest(view, request);
    }
    else if (host.contains(Conf.STREAM_DOMAIN3)){
      if (accept.startsWith("text/css")||accept.startsWith("image/")){
        return aApi.badRequest;
      }
      return aApi.defaultRequest(view,request);
//      return super.shouldInterceptRequest(view, request);
    }
    else if (host.equals(Conf.SOURCE_DOMAIN5_API)){
      try {
        AnimeApi.Http http=new AnimeApi.Http(url);
        http.addHeader("Referer", "https://"+Conf.SOURCE_DOMAIN5_API);
        http.addHeader("Origin", "https://"+Conf.SOURCE_DOMAIN5_API);
        for (Map.Entry<String, String> entry :
            request.getRequestHeaders().entrySet()) {
          String k=entry.getKey();
          boolean sent=false;
          if (k.equalsIgnoreCase("origin")||
              k.equalsIgnoreCase("referer")||
              k.equalsIgnoreCase("X-Org-Prox")||
              k.equalsIgnoreCase("X-Ref-Prox")){
            sent=true;
          }
          if (!sent) {
            http.addHeader(k, entry.getValue());
          }
        }
        http.execute();
        InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
        return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
      } catch (Exception e) {
        Log.e(_TAG, "AFLIX-API ERR =" + url, e);
      }
      return super.shouldInterceptRequest(view, request);
    }
    else if (host.contains(Conf.STREAM_DOMAIN)
            ||host.contains(Conf.STREAM_DOMAIN1)
            ||host.contains(Conf.STREAM_DOMAIN2)){
      if (accept.startsWith("text/html")||
          url.startsWith("https://"+host+"/mediainfo")) {
        Log.d(_TAG,"VIEW PLAYER REQ = "+url);
        if (!accept.startsWith("text/html"))
          sendVidpageLoaded(1);
        try {
          AnimeApi.Http http=new AnimeApi.Http(url);
          for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
            http.addHeader(entry.getKey(), entry.getValue());
          }
          http.execute();

          if (http.code()==200) {
            if (accept.startsWith("text/html")) {
              try {
                aApi.injectString(http.body, playerInjectString);
              }catch(Exception ignored){}
              sendVidpageLoaded(0);
            } else {
              Log.d(_TAG, "sendM3U8Req = " + http.body.toString("UTF-8"));
              sendM3U8Req(http.body.toString("UTF-8"));
              try {
                Thread.sleep(200);
              }catch(Exception ignored){}
              Log.d(_TAG, "sendM3U8Req Wait = " + http.body.toString("UTF-8"));
            }
            InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
            return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
          }
        } catch (Exception ignored) {}
        if (!accept.startsWith("text/html"))
          sendVidpageLoaded(2);
        else {
          sendVidpageLoaded(3);
          return null;
        }
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
        host.contains("megastatics.com")||
      host.contains("ontosocietyweary.com")
    ){
      /* BLOCK DNS */
      return aApi.badRequest;
    }
    else if (Conf.SOURCE_DOMAIN==3||Conf.SOURCE_DOMAIN==4){
      String path = uri.getPath();
      if (path.endsWith("/master.m3u8")) {
        Log.d(_TAG, "GOT-MASTER-M3U8 = " + url);
        String m3u8data="{}";
        try{
          JSONObject j=
              new JSONObject("{\"result\":{\"sources\":[{}]}}");
          j.getJSONObject("result")
              .getJSONArray("sources")
              .getJSONObject(0)
              .put("file",url);
          m3u8data=j.toString();
        }catch (Exception ignored){}
        Log.d(_TAG, "sendM3U8Req = " + m3u8data);
        sendM3U8Req(m3u8data);
        return aApi.badRequest;
      }
    }
    if (Conf.PROGRESSIVE_CACHE) {
      return super.shouldInterceptRequest(view, request);
    }
    return aApi.defaultRequest(view,request);
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

  @UnstableApi public class JSViewApi{
    private String lastResultText="";
    private String lastResultUrl="";
    @JavascriptInterface
    public boolean getViewAvailable(){
      return aApi.resData.status != 1;
    }
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
      AsyncTask.execute(() -> simulateClick(x,y,false));
    }

    @JavascriptInterface
    public void tapEmulateFix(float x, float y) {
      AsyncTask.execute(() -> simulateClick(x,y,true));
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
    public void checkUpdate(){
      aApi.updateServerVar(true);
    }

    @JavascriptInterface
    public void getmp4vid(String url) {
      AsyncTask.execute(() -> {
        final String out=aApi.getMp4Video(url);
        activity.runOnUiThread(() -> webView.evaluateJavascript("__MP4CB("+out+");",null));
      });
    }

    @JavascriptInterface
    public void reloadHome() {
      runOnUiThreadWait(()->
          webView.loadUrl("https://"+Conf.getDomain()+"/__view/main.html")
      );
//      AsyncTask.execute(AnimeView.this::reloadView);
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
            videoPlayerStop();
            videoSetSource("");
          } else {
            videoSetSource(url);
            videoPlayerPlay();
          }
        }catch(Exception ignored){}
      });
    }

    @JavascriptInterface
    public void videoSetSpeed(float speed){
      activity.runOnUiThread(()-> {
        try {
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            videoPlayer.setPlaybackSpeed(speed);
          }
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
    public void setStreamServer(int mirror, int clean){
      Log.d(_TAG,"[X] setStreamServer = "+mirror+" / clean="+clean);
      if (clean==1) {
        lastResultUrl = "";
        aApi.cleanWebView();
      }
      Conf.STREAM_SERVER=mirror;
    }

    @JavascriptInterface
    public int getStreamType(){
      return Conf.STREAM_TYPE;
    }

    @JavascriptInterface
    public void videoSetPosition(int pos){
      activity.runOnUiThread(()-> {
        try {
          videoPlayer.seekTo(pos);
        }catch(Exception ignored){}
      });
    }
    @JavascriptInterface
    public int videoGetDuration(){
      runOnUiThreadWait(()-> {
        try {
          videoDuration =
              (int) Math.floor(videoPlayer.getDuration());
        }catch(Exception ignored){}
      });
      return videoDuration;
    }

    @JavascriptInterface
    public void malLogin(){
      runOnUiThreadWait(()-> {
        try {
          malLoginDialog();
        }catch(Exception ignored){}
      });
    }

    @JavascriptInterface
    public void setProgCache(boolean val){
      Conf.PROGRESSIVE_CACHE=val;
    }

    @JavascriptInterface
    public void setDOH(boolean val){
      Conf.USE_DOH=val;
//      AnimeApi.initHttpEngine();
    }

    // setHttpClient
    @JavascriptInterface
    public void setHttpClient(int val){
      Conf.HTTP_CLIENT=val;
      AnimeApi.initHttpEngine(activity);
    }

    // startUpdateApk(String url, boolean isNightly)
    @JavascriptInterface
    public void installApk(String url, boolean isNightly){
      aApi.startUpdateApk(url, isNightly);
    }
    @JavascriptInterface
    public boolean isOnUpdate(){
      return aApi.updateIsInProgress;
    }
    @JavascriptInterface
    public boolean videoIsPlaying(){
      runOnUiThreadWait(()->{
        try {
          videoIsPlaying = videoPlayer.getPlaying();
        }catch(Exception ignored){}
      });
      return videoIsPlaying;
    }
    @JavascriptInterface
    public int videoGetPosition(){
      runOnUiThreadWait(()->{
        try {
          videoPosition =
              (int) Math.ceil(videoPlayer.getCurrentPosition());
        }catch (Exception ignored){}
      });
      return videoPosition;
    }
    @JavascriptInterface
    public void videoPlay(boolean play){
      activity.runOnUiThread(()->{
        try {
          if (play)
            videoPlayerPlay();
          else
            videoPlayerPause();
        }catch (Exception ignored){}
      });
    }

    @JavascriptInterface
    public String dns(){
      return Conf.getDomain();
    }

    @JavascriptInterface
    public String flix_dns(){
      return Conf.SOURCE_DOMAIN5_API;
    }

    @JavascriptInterface
    public int getSd(){
      return Conf.SOURCE_DOMAIN;
    }
    @JavascriptInterface
    public void setSd(int s){
      aApi.setSourceDomain(s);
      activity.runOnUiThread(AnimeView.this::initVideoView);
    }

    @JavascriptInterface
    public String dnsver(){
      return Conf.SERVER_VER;
    }

    @JavascriptInterface
    public String storeGet(String key, String def){
      return aApi.pref.getString("viewstorage_"+key,def);
    }

    @JavascriptInterface
    public void storeSet(String key, String value){
      SharedPreferences.Editor ed = aApi.pref.edit();
      ed.putString("viewstorage_"+key, value);
      ed.apply();
    }

    @JavascriptInterface
    public void storeDel(String key){
      SharedPreferences.Editor ed = aApi.pref.edit();
      ed.remove("viewstorage_"+key);
      ed.apply();
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
      else if (type==2)
        return BuildConfig.VERSION_CODE+"";
      return BUILD_VERSION;
    }

    @JavascriptInterface
    public void rayOk() {
      if (cfOnCheck) {
        cfOnCheck=false;
        runOnUiThreadWait(() -> {
          webView2.loadData(
              "<html><body>Finish</body></html>","text/html",
              null
          );
          webView.evaluateJavascript(
              "__CFRAYOK()", null);
          webView2.setVisibility(View.GONE);
          Toast.makeText(activity,"Validation successful...",
              Toast.LENGTH_SHORT).show();
          cfProgress.setVisibility(View.INVISIBLE);
          webView.requestFocus();
        });
      }
    }

    @JavascriptInterface
    public void cfCheck() {
      cfRayCheck();
    }


    @JavascriptInterface
    public String sha1sum(String value) {
      try {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] bytes = md.digest(value.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
          sb.append(String.format("%02x", b));
        }
        return sb.toString();
      } catch (Exception ignored) {
      }
      return "";
    }

    @JavascriptInterface
    public String aesDec(String cipherText, String key, String ivhex) {
      return aesDecrypt(cipherText, key, ivhex);
    }

    @JavascriptInterface
    public String vidEncode(String vid, String k1, String k2) {
      try {
        return vidIdEncode(vid, k1, k2);
      } catch (Exception e) {
        return "";
      }
    }
  }

  public boolean cfOnCheck=false;

  public void cfRayCheck(){
    if (cfOnCheck) return;
    runOnUiThreadWait(()-> {
      cfProgress.setVisibility(View.VISIBLE);
      cfOnCheck=true;
      webView2.loadUrl("https://"+Conf.getDomain()+"/");
      webView2.reload();
    });
  }

  @Override
  public void onPageFinished(WebView view, String url) {
    Log.d(_TAG,"ATVLOG-API --> "+url);
    if (!url.contains("/__view/")){
      if (cfOnCheck) {
        webView2.setVisibility(View.VISIBLE);
        view.evaluateJavascript(
            "if (document.getElementById('i-wrapper')||document.querySelector('a.btn[href=home]')){ " +
                "setTimeout(function(){_JSAPI.rayOk();},1000);" +
                " }", null);
        String ijs=
            "function t1(){" +
                "var a=document.querySelector('div#turnstile-wrapper');" +
                "if (a){" +
                "var h2=Math.floor(a.offsetHeight/2.5);"+
                "var x=a.offsetLeft+h2;"+
                "var y=a.offsetTop+h2;"+
                "setTimeout(function(){_JSAPI.tapEmulateFix(x,y);" +
                "setTimeout(t1,1000);},1000);" +
                "}" +
                "else " +
                "setTimeout(t1,500);}" +
                "t1();";
        view.evaluateJavascript(ijs,null);
      }
    }

    if (view.equals(webView2)){
      return;
    }

    splash.setVisibility(View.GONE);
    videoLayout.setVisibility(View.VISIBLE);
    webView.setVisibility(View.VISIBLE);
    activity.runOnUiThread(webView::requestFocus);
    webViewReady=true;
    // i-wrapper
  }

  public float convertDpToPixel(float dp){
    return dp * ((float) activity.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT);
  }

  private void simulateClick(float xx, float yy, boolean fixed) {
    int x=(int) ((webView.getMeasuredWidth()*xx)/100.0);
    int y=(int) ((webView.getMeasuredHeight()*yy)/100.0);
    if (fixed){
      x=(int) convertDpToPixel(xx);
      y=(int) convertDpToPixel(yy);
    }
    Log.d(_TAG,"TAP: ("+x+", "+y+") -> "+xx+"%, "+yy+"%");
    long downTime = SystemClock.uptimeMillis();
    long eventTime = SystemClock.uptimeMillis() + 245;
    int metaState = 0;
    MotionEvent me = MotionEvent.obtain(
        downTime,
        eventTime,
        MotionEvent.ACTION_DOWN,
        x,
        y,
        metaState
    );
    webView2.dispatchTouchEvent(me);
    me = MotionEvent.obtain(
        downTime,
        eventTime,
        MotionEvent.ACTION_UP,
        x+1,
        y-2,
        metaState
    );
    webView2.dispatchTouchEvent(me);
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
        videoSetSource(videoStatCurrentUrl);
        if (videoStatCurrentPosition>0) {
          videoPlayer.seekTo(videoStatCurrentPosition);
          if (videoStatIsPlaying)
            videoPlayerPlay();
        }
      }
      Log.d(_TAG,"ONSTART -> "+videoStatCurrentPosition);
    }
    else{
      if (videoPlayer.getDuration()>0) {
        videoStatCurrentPosition = (int) videoPlayer.getCurrentPosition();
        videoStatIsPlaying = videoPlayer.getPlaying();
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
      if (videoPlayer.getDuration()>0)
        bundle.putInt("VIDEO_CURRPOS", (int) videoPlayer.getCurrentPosition());
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
      if (saveUrl==null) saveUrl="";
      if (!saveUrl.equals("")) {
        if (savedPos > 0) {
          try {
            videoPlayer.seekTo(savedPos);
            videoPlayerPlay();
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

  public void malCallback(String data){
    activity.runOnUiThread(() -> webView.evaluateJavascript(
        "_MAL.onlogin("+data+");",null)
    );
  }

  /* MAL Functions */
  public void malStartLogin(String username, String password){
    Log.d(_TAG,
        "Login Mal -> "+username+":"+password);
    final ProgressDialog loginProgress = new ProgressDialog(activity);
    loginProgress.setMessage("Login to MyAnimeList..");
    loginProgress.show();

    AsyncTask.execute(() -> {
      try {
        /* Get Server Data from Github */
        AnimeApi.Http http=new AnimeApi.Http("https://api.myanimelist.net/v2/auth/token");
        http.addHeader("X-MAL-Client-ID",Conf.MAL_CLIENT_ID);
        http.addHeader("Accept","application/json");
        String userenc= URLEncoder.encode(username, Charsets.UTF_8.name());
        String passenc= URLEncoder.encode(password, Charsets.UTF_8.name());
        String data="client_id="+Conf.MAL_CLIENT_ID+"&grant_type" +
            "=password&password="+passenc+"&username="+userenc;
        http.setMethod("POST",data,"application/x-www-form-urlencoded");
        http.execute();
        Log.d(_TAG,
            "Login Mal -> RESPONSE_CODE = "+http.code());
        String serverjson = http.body.toString();
        JSONObject j = new JSONObject(serverjson);
        j.put("user",username);
        Log.d(_TAG,
            "Login Mal -> RESULT = "+serverjson);
        malCallback(j.toString());
      }catch (Exception ermal){
        malCallback("null");
        Log.d(_TAG,
            "Login Mal -> ERROR = "+ermal);
      }
      loginProgress.dismiss();
    });
  }
  public void malLoginDialog() {
    Context c=activity;
    LayoutInflater factory = LayoutInflater.from(c);
    final View textEntryView = factory.inflate(R.layout.mal_login_dialog, null);
    final EditText usernameInput = textEntryView.findViewById(R.id.user);
    final EditText passwordInput = textEntryView.findViewById(R.id.password);
    AlertDialog.Builder alert =
        new AlertDialog.Builder(c).setTitle("MyAnimeList Login")
            .setView(textEntryView)
            .setPositiveButton("Login", (dialog, whichButton) -> malStartLogin(usernameInput.getText().toString(),
                passwordInput.getText().toString())).setNegativeButton("Cancel", (dialog, whichButton) -> {
            });
    alert.show();
  }


  /* KICKASS UTILS */
  private final static String HASH_CIPHER = "AES/CBC/PKCS7PADDING";
  private final static String HASH_CIPHER_FALLBACK = "AES/CBC/PKCS5PADDING";
  private static String decryptAES(byte[] cipherTextBytes, byte[] keyBytes, byte[] ivBytes) {
    try {
      Cipher cipher;
      try {
        cipher = Cipher.getInstance(HASH_CIPHER);
      } catch (Throwable e) {
        cipher = Cipher.getInstance(HASH_CIPHER_FALLBACK);
      }
      SecretKeySpec keyS = new SecretKeySpec(keyBytes, "AES");
      cipher.init(Cipher.DECRYPT_MODE, keyS, new IvParameterSpec(ivBytes));
      return new String(cipher.doFinal(cipherTextBytes), Charsets.UTF_8);
    } catch (Exception e) {
      return "";
    }
  }
  public String aesDecrypt(String cipherText, String key, String ivhex) {
    byte[] iv = hexStringToByteArray(ivhex);
    byte[] keyBytes = key.getBytes();
    try {
      byte[] cipherTextBytes = Base64.decode(cipherText,Base64.DEFAULT);
      return decryptAES(cipherTextBytes, keyBytes, iv);
    } catch (Exception e) {
      return "";
    }
  }

  private static byte[] hexStringToByteArray(String hex) {
    int len = hex.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
              + Character.digit(hex.charAt(i + 1), 16));
    }
    return data;
  }

  private static String vidIdEncode(String videoID, String k1, String k2) throws Exception {
    SecretKeySpec rc4Key1 = new SecretKeySpec(k1.getBytes(), "RC4");
    SecretKeySpec rc4Key2 = new SecretKeySpec(k2.getBytes(), "RC4");
    Cipher cipher1 = Cipher.getInstance("RC4");
    Cipher cipher2 = Cipher.getInstance("RC4");
    cipher1.init(Cipher.DECRYPT_MODE, rc4Key1, cipher1.getParameters());
    cipher2.init(Cipher.DECRYPT_MODE, rc4Key2, cipher2.getParameters());
    byte[] encoded = videoID.getBytes();
    encoded = cipher1.doFinal(encoded);
    encoded = cipher2.doFinal(encoded);
    encoded = Base64.encode(encoded, Base64.DEFAULT);
    return new String(encoded, "UTF-8").replace("/", "_").trim();
  }

}
