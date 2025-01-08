package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.media.AudioManager;
import android.media.session.PlaybackState;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.text.Html;
import android.text.InputFilter;
import android.text.InputType;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
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
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.media3.common.C;
import androidx.media3.common.Format;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MediaMetadata;
import androidx.media3.common.PlaybackParameters;
import androidx.media3.common.TrackGroup;
import androidx.media3.common.Tracks;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.DefaultLoadControl;
import androidx.media3.exoplayer.analytics.AnalyticsListener;
import androidx.media3.exoplayer.dash.DashMediaSource;
import androidx.media3.exoplayer.source.LoadEventInfo;
import androidx.media3.exoplayer.source.MediaLoadData;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.exoplayer.source.ProgressiveMediaSource;
import androidx.media3.exoplayer.source.TrackGroupArray;

import com.devbrackets.android.exomedia.core.renderer.RendererType;
import com.devbrackets.android.exomedia.core.source.data.DataSourceFactoryProvider;
import com.devbrackets.android.exomedia.core.video.scale.MatrixManager;
import com.devbrackets.android.exomedia.core.video.scale.ScaleType;
import com.devbrackets.android.exomedia.core.video.surface.SurfaceEnvelope;
import com.devbrackets.android.exomedia.core.video.surface.SurfaceViewSurfaceEnvelope;
import com.devbrackets.android.exomedia.nmp.ExoMediaPlayerImpl;
import com.devbrackets.android.exomedia.nmp.config.PlayerConfig;
import com.devbrackets.android.exomedia.nmp.config.PlayerConfigBuilder;
import com.devbrackets.android.exomedia.nmp.manager.track.TrackManager;
import com.google.common.base.Charsets;
import com.google.common.io.CharStreams;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@UnstableApi public class AnimeView extends WebViewClient {
  private static final String _TAG="ATVLOG-VIEW";
  private final Activity activity;
  public final WebView webView;
//  public final WebView webView2;
  public SurfaceView videoView=null;
  public ExoMediaPlayerImpl videoPlayer=null;
//  public LinearLayout cfProgress;
  public final ImageView splash;
  public final FrameLayout videoLayout;
  public final AnimeApi aApi;
  public String playerInjectString;
  public boolean webViewReady=false;
  public static boolean USE_WEB_VIEW_ASSETS=false;

  public String sourceCacheString = "";

  public AudioManager audioManager;

  public int sysBrightness;
  public void initSysConfig(){
    try{
      sysBrightness = Settings.System.getInt(
              activity.getContentResolver(), "screen_brightness"
      );
    }
    catch(Exception ignored){
      sysBrightness=127;
    }
    Log.d(_TAG,"ATVLOG Current Sys Brightness = "+sysBrightness);
  }

  public int sysheightNav=0;
  public int sysheightStat=0;

  @SuppressLint({"InternalInsetResource", "DiscouragedApi"})
  public void updateInsets(){
    sysheightStat=0;
    sysheightNav=0;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
      WindowInsets insets =
          activity.getWindowManager().getCurrentWindowMetrics().getWindowInsets();
      sysheightStat =
          px2dp(insets.getInsets(WindowInsetsCompat.Type.statusBars()).top);
      sysheightNav =
          px2dp(insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom);
    }
    else {
      Resources resources = activity.getResources();
      int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
      if (resourceId > 0) {
        sysheightNav = px2dp(resources.getDimensionPixelSize(resourceId));
      }
      resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
      if (resourceId > 0) {
        sysheightStat = px2dp(resources.getDimensionPixelSize(resourceId));
      }
    }
    Log.d(_TAG,"SYS-BAR Size: "+sysheightStat+" / "+sysheightNav);
  }

  public void setFullscreen(int orientation){
    if (orientation==0) {
      orientation = activity.getResources().getConfiguration().orientation;
    }

    if (orientation == Configuration.ORIENTATION_PORTRAIT) {
      activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
      activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
      View decorView = activity.getWindow().getDecorView();
      int uiOptions = View.SYSTEM_UI_FLAG_LOW_PROFILE
          | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      decorView.setSystemUiVisibility(uiOptions);
    } else {
      activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
      activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
      activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
//      activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
//          WindowManager.LayoutParams.FLAG_FULLSCREEN);


      View decorView = activity.getWindow().getDecorView();
      int uiOptions =
          View.SYSTEM_UI_FLAG_IMMERSIVE
              | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
              | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_FULLSCREEN
              | WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN;

//          View.SYSTEM_UI_FLAG_FULLSCREEN
//          | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
//          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
//          | View.SYSTEM_UI_FLAG_IMMERSIVE
//          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
//          | View.SYSTEM_UI_FLAG_LOW_PROFILE
//          | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      decorView.setSystemUiVisibility(uiOptions);
      activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
          WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
    }
    if (webView!=null){
      updateInsets();
      AsyncTask.execute(() ->activity.runOnUiThread(() -> {
          if (webView != null) {
            webView.evaluateJavascript(
                "try{__INSETCHANGE(_JSAPI.getSysHeight(false),_JSAPI.getSysHeight(true));}catch(e)" +
                    "{}",
                null);
          }
        }
      ));
    }
  }

  @SuppressLint("SetJavaScriptEnabled")
  public void webviewInitConfig(WebView wv){
    WebSettings webSettings = wv.getSettings();

    webSettings.setJavaScriptEnabled(true);
    webSettings.setMediaPlaybackRequiresUserGesture(false);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
    webSettings.setSupportMultipleWindows(false);
    webSettings.setAllowFileAccess(true);
    webSettings.setAllowContentAccess(true);
    webSettings.setDomStorageEnabled(true);
    webSettings.setUseWideViewPort(false);

    /* UAG */
    webSettings.setUserAgentString(Conf.USER_AGENT);

    /* performance tweaks */
    //noinspection deprecation
    webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
    webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      webSettings.setOffscreenPreRaster(true);
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      webSettings.setAlgorithmicDarkeningAllowed(false);
    }
    webSettings.setGeolocationEnabled(false);

    wv.addJavascriptInterface(new JSViewApi(), "_JSAPI");
    wv.setWebViewClient(this);
    wv.setLayerType(View.LAYER_TYPE_HARDWARE, null);
  }

  public WebChromeClient chromeClient=null;
  public interface ChromePromptCallback {
    void confirm(String res);
    void cancel();
  }

  public int dp2px(float dpValue) {
    final float scale = activity.getResources().getDisplayMetrics().density;
    return (int) (dpValue * scale + 0.5f);
  }
  public int px2dp(float px){
    return (int) (px / ((float) activity.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT));
  }
  public boolean listPrompt(String message, ChromePromptCallback result){
    try{
      JSONObject jo=new JSONObject(message);
      Log.d(_TAG,"PROMPT: "+jo);
      String type=jo.getString("type");
      String title=jo.getString("title");

      if (type.equals("list")){
        int selPos=0;
        JSONArray ja=jo.getJSONArray("list");
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle(title);
        String[] list = new String[ja.length()];
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          for (int i = 0; i < ja.length(); i++) {
            list[i] = ja.getString(i);
          }
        }
        else {
          for (int i = 0; i < ja.length(); i++) {
            list[i] = ja.getString(i).replaceAll("\t", " ");
          }
        }
        if (jo.has("sel")) {
          final int selVal=jo.getInt("sel");
          final int selCurr=jo.has("allowsel")?-1:selVal;
          selPos=selVal;
          builder.setSingleChoiceItems(list, selVal,
                  (dialog, which) -> {
                    if (which!=selCurr) {
                      result.confirm(String.valueOf(which));
                      dialog.cancel();
                    }
                    else{
                      result.cancel();
                      dialog.cancel();
                    }
                  }
          );
          builder.setOnDismissListener(dialogInterface -> result.cancel());
        }
        else if (jo.has("multi")) {
          JSONArray jm=jo.getJSONArray("multi");
          final boolean[] multisel = new boolean[ja.length()];
          final boolean[] firstval = new boolean[ja.length()];
          for (int i = 0; i < ja.length(); i++) {
            if (jm.length()>i) {
              multisel[i] = jm.getBoolean(i);
              firstval[i] = multisel[i];
            }
            else{
              firstval[i] = multisel[i] = false;
            }
          }
          builder.setMultiChoiceItems(list, multisel, (dialog, which, isChecked) -> {
            multisel[which]=isChecked;
          });
          builder.setOnDismissListener(dialogInterface -> {
            boolean changed=false;
            String out="";
            try {
              JSONArray outarr=new JSONArray("[]");
              for (int i=0;i<firstval.length;i++){
                if (firstval[i]!=multisel[i]){
                  changed=true;
                }
                outarr.put(i,multisel[i]);
              }
              out=outarr.toString();
            } catch (JSONException ignored) {
              changed=false;
            }
            if (changed){
              result.confirm(out);
            }
            else{
              result.cancel();
            }
          });
        }
        else {
          builder.setItems(list, (dialog, which) -> result.confirm(String.valueOf(which)));
          builder.setOnDismissListener(dialogInterface -> result.cancel());
        }
        AlertDialog dialog = builder.create();
        if (jo.has("nodim")) {
          Objects.requireNonNull(dialog.getWindow()).clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
        }
        dialog.show();
        if (jo.has("selpos")) {
          selPos=jo.getInt("selpos");
        }
        dialog.getListView().setSelection(selPos);
      }
      else if (type.equals("text")){
        final EditText input = new EditText(activity);
        input.setSingleLine(true);
        input.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
        input.setImeOptions(EditorInfo.IME_ACTION_DONE);

        if (jo.has("deval")){
          input.setText(jo.getString("deval"));
        }
        if (jo.has("ispin")) {
          input.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
          input.setFilters(new InputFilter[]{new InputFilter.LengthFilter(4)});
        }
        else if (jo.has("maxlen")){
          input.setFilters(new InputFilter[]{new InputFilter.LengthFilter(jo.getInt("maxlen"))});
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle(title);
        if (jo.has("message")){
          String msg=jo.getString("message");
          if (jo.has("html")){
            builder.setMessage(Html.fromHtml(msg));
          }
          else {
            builder.setMessage(msg);
          }
        }

        FrameLayout container = new FrameLayout(activity);
        FrameLayout.LayoutParams params = new  FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.leftMargin = dp2px(24);
        params.rightMargin = dp2px(24);
        input.setLayoutParams(params);
        container.addView(input);
        builder.setView(container);

        builder.setPositiveButton("OK", (dialog, whichButton) -> {
          dialog.cancel();
          try {
            JSONObject out = new JSONObject("{}");
            out.put("value",input.getText().toString());
            result.confirm(out.toString());
          } catch (JSONException ignored) {
            result.cancel();
          }
        });
        builder.setOnDismissListener(dialogInterface -> result.cancel());
        builder.show();
        input.requestFocus();
      }
      return true;
    }catch(Exception ignored){}
    return false;
  }

  @SuppressLint("SetJavaScriptEnabled")
  public AnimeView(Activity mainActivity) {
    activity = mainActivity;

    initSysConfig();

    if (BuildConfig.DEBUG) {
      WebView.setWebContentsDebuggingEnabled(true);
    }
    else{
      USE_WEB_VIEW_ASSETS=false;
    }

    VERSION_INIT();

//    cfProgress=activity.findViewById(R.id.cfprogress);
    splash=activity.findViewById(R.id.splash);
    videoLayout= activity.findViewById(R.id.video_layout);
//    webView2 = activity.findViewById(R.id.webview2);
    webView = activity.findViewById(R.id.webview);
    webView.requestFocus();
    webView.setBackgroundColor(Color.TRANSPARENT);
    webviewInitConfig(webView);
//    webviewInitConfig(webView2);

    setFullscreen(0);

    audioManager =
        (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);

    chromeClient=new WebChromeClient() {
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
          boolean isHtml= jo.has("html");
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
        if (listPrompt(message, new ChromePromptCallback() {
          @Override
          public void confirm(String res) {
            result.confirm(res);
          }

          @Override
          public void cancel() {
            result.cancel();
          }
        })){
          return true;
        }
        return super.onJsPrompt(view,url,message,defaultValue,result);
      }
    };

    webView.setWebChromeClient(chromeClient);

    webView.setVerticalScrollBarEnabled(false);
    webView.setBackgroundColor(Color.TRANSPARENT);

    initVideoView();
    videoViewSetScale(videoStatScaleType);

    aApi=new AnimeApi(activity);
    playerInjectString=aApi.assetsString("inject/view_player.html");
//    webView.loadUrl("https://"+Conf.getDomain()+"/__view/main.html");
    webView.loadUrl("https://"+Conf.getDomain()+"/__view/login/login" +
        ".html#appstart");

    // Init Channel Provider
    AnimeProvider.executeJob(activity);
  }

  public void audioPlayClick(){
    runOnUiThreadWait(()->{
      try {
        audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK, 0.5f);
      }catch (Exception ignored){}
    });
  }
  public void reloadView(){
//    aApi.cleanWebView();
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

  public int videoSizeWidth=0;
  public int videoSizeHeight=0;
  public void setVideoSize(int w,int h){
    videoSizeWidth=w;
    videoSizeHeight=h;
    Log.d(_TAG,"VIDEO SIZE "+w+"x"+h);
    AsyncTask.execute(() ->activity.runOnUiThread(() ->
        webView.evaluateJavascript(
            "try{__VIDRESCB("+videoSizeWidth+","+videoSizeHeight+");}catch(e)" +
                "{}",
            null)
    ));
  }

  public String videoAudioLanguage="";
  public int videoSelectedQuality=0; /* auto */
  public TrackManager videoTrackManager=null;

  public int arrayFindInt(int[] a, int f){
    for (int i=0;i<a.length;i++){
      if (a[i]==f){
        return i;
      }
    }
    return -1;
  }

  public void initVideoTracks(){
    if (videoView==null){
      return;
    }

    Map<RendererType, TrackGroupArray> tracks =
        videoPlayer.getAvailableTracks();
    if (tracks==null){
      return;
    }

    boolean audioSelected=false;
    int[] resList=null;
    int[] resListSorted=null;
    String availLang="";
    int qualityGroupIndex=0;

    for (RendererType rendererType : tracks.keySet()) {
      TrackGroupArray trackGroupArray = tracks.get(rendererType);
      for (int i = 0; i < trackGroupArray.length; i++) {
        TrackGroup tr=trackGroupArray.get(i);
        if (tr.type== C.TRACK_TYPE_AUDIO) {
          Format fr = tr.getFormat(0);
          if (!audioSelected &&
              fr.label!=null &&
              !videoAudioLanguage.equals("") &&
              fr.label.toLowerCase().startsWith(videoAudioLanguage.toLowerCase())){
            Log.d(_TAG,"[TRACK] Audio Select("+i+", "+fr.label+")");
            videoPlayer.setSelectedTrack(rendererType, i, 0);
            audioSelected=true;
          }
          else{
            Log.d(_TAG,"[TRACK] Audio Available("+i+", "+fr.label+")");
          }
          if (i>0 && fr.label!=null){
            availLang+=","+fr.label.toLowerCase().substring(0,3);
          }
        }
        else if (tr.type== C.TRACK_TYPE_VIDEO) {
          qualityGroupIndex=i;
          resList=new int[tr.length];
          resListSorted=new int[tr.length];
          for (int j=0;j<tr.length;j++){
            Format fr=tr.getFormat(j);
            resList[j]=resListSorted[j]=0;
            if (fr.roleFlags==0) {
              resList[j]=resListSorted[j]=fr.height;
            }
          }
          Arrays.sort(resListSorted);
        }
      }
    }
    if (!audioSelected) {
      Log.d(_TAG,"[TRACK] Audio Select Default");
      videoPlayer.setSelectedTrack(RendererType.AUDIO, 0, 0);
    }
    if (resList!=null){
      int rl=resList.length;
      int sel_id=-1;
      for (int i=0;i<rl;i++){
        int fi=rl-(i+1);
        if (i==videoSelectedQuality-1){
          sel_id=arrayFindInt(resList,resListSorted[fi]);
//          if (sel_id>=0) {
//            break;
//          }
        }
        Log.d(_TAG, "[TRACK] Sorted: "+i+" => "+resListSorted[fi]);
      }
      if (sel_id!=-1) {
        Log.d(_TAG, "[TRACK] Quality Selected: "+sel_id+" => "+resList[sel_id]);
        videoPlayer.setSelectedTrack(RendererType.VIDEO, qualityGroupIndex, sel_id);
      }
      else{
        Log.d(_TAG, "[TRACK] Quality Selected: Auto - RES");
        videoTrackManager.clearSelectedTracks(RendererType.VIDEO);
      }
    }
    else{
      Log.d(_TAG, "[TRACK] Quality Selected: Auto - NORES");
      videoTrackManager.clearSelectedTracks(RendererType.VIDEO);
    }
    Log.d(_TAG, "[TRACK] Avail-Langs = "+availLang);
    final String availLangVal=availLang;
    activity.runOnUiThread(() -> {
      if (webView != null) {
        webView.evaluateJavascript(
            "try{__VIDLANGAVAIL(\"" + availLangVal + "\");}catch(e){}",
            null
        );
      }
    });
  }

  @SuppressLint("UnsafeOptInUsageError")
  public void initVideoView(){
    if (videoView!=null){
      videoLayout.removeAllViews();
      videoView=null;
    }
    setVideoSize(0,0);
    videoDataSourceFactory= (s, transferListener) -> {
      AnimeDataSource.sd5query="";
      Map<String, String> settings = new HashMap();
      try{
        URL vurl=new URL(videoStatCurrentUrl);
        String host=vurl.getHost();

        if (Conf.SOURCE_DOMAIN==5) {
          AnimeDataSource.sd5query=videoStatCurrentUrl;
          settings.put("Origin", "https://" + Conf.SOURCE_DOMAIN5_API);
        }
        else{
          if (host.contains(Conf.STREAM_DOMAIN2)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN2);
            settings.put("Referer", "https://" + Conf.STREAM_DOMAIN2+"/");
          }
          else if (host.contains("mp4upload.com")){
            settings.put("Origin", "https://"+host);
            settings.put("Referer", "https://www.mp4upload.com/");
          }
          else if (host.contains(Conf.STREAM_DOMAIN)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN);
          }
          else if (host.contains(Conf.STREAM_DOMAIN1) || Conf.SOURCE_DOMAIN<3){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN1);
            settings.put("Referer", "https://" + Conf.STREAM_DOMAIN1+"/");
          }
          else if (host.contains(Conf.STREAM_DOMAIN3)){
            settings.put("Origin", "https://" + Conf.STREAM_DOMAIN3);
          }
          else if (host.contains(Conf.STREAM_DOMAIN4)){
            settings.put("Origin", "https://"+Conf.STREAM_DOMAIN4);
          }
          else{
            String[] h=host.split("\\.");
            String h2=h[h.length-2]+"."+h[h.length-1];
            settings.put("Origin", "https://" +h2);
          }
        }
      } catch (MalformedURLException ignored) {}
      Log.d(_TAG,"VIDEO-DATA-SOURCE : "+videoStatCurrentUrl+" / ORIGIN : "+settings.get("Origin"));
      return new AnimeDataSource.Factory()
          .setUserAgent(Conf.USER_AGENT)
          .setDefaultRequestProperties(settings)
          .setAllowCrossProtocolRedirects(true);
    };

    videoTrackManager=new TrackManager(activity);

    DefaultLoadControl loadControl=new DefaultLoadControl.Builder()
        .setBackBuffer(1000 * 60 * 2, true)
        .setBufferDurationsMs(
            600000,
            600000,
            2500,
            5000
        )
        .build();

    // trackManager.
    videoPlayerConfig=
        new PlayerConfigBuilder(activity)
            .setDataSourceFactoryProvider(videoDataSourceFactory)
            .setTrackManager(videoTrackManager)
            .setLoadControl(loadControl)
            .build();
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
    videoPlayer.setVideoSizeListener(videoSize -> {
      videoViewEnvelope.setVideoSize(videoSize.width, videoSize.height,
          videoSize.pixelWidthHeightRatio);
      setVideoSize(videoSize.width,videoSize.height);
    });

    videoPlayer.addAnalyticsListener(new AnalyticsListener() {
      @Override
      public void onPlaybackStateChanged(EventTime eventTime, int state) {
        AnalyticsListener.super.onPlaybackStateChanged(eventTime, state);
        Log.d(_TAG, "ANL: onPlaybackStateChanged="+state);
        me().mediaSetDuration(videoPlayer.getDuration());
        me().mediaSetPosition(eventTime.currentPlaybackPositionMs);
      }

      @Override
      public void onRenderedFirstFrame(EventTime eventTime, Object output,
                                       long renderTimeMs) {
        AnalyticsListener.super.onRenderedFirstFrame(eventTime, output,
            renderTimeMs);
        initVideoTracks();
      }

      @Override
      public void onIsPlayingChanged(EventTime eventTime, boolean isPlaying) {
        AnalyticsListener.super.onIsPlayingChanged(eventTime, isPlaying);
        me().mediaSetState(isPlaying?PlaybackState.STATE_PLAYING:
            PlaybackState.STATE_PAUSED,eventTime.currentPlaybackPositionMs);
      }

      @Override
      public void onPlaybackParametersChanged(EventTime eventTime, PlaybackParameters playbackParameters) {
        AnalyticsListener.super.onPlaybackParametersChanged(eventTime,
            playbackParameters);
        me().mediaSetSpeed(playbackParameters.speed);
        me().mediaSetPosition(eventTime.currentPlaybackPositionMs);
      }


    });
  }

  public MainActivity me(){
    return (MainActivity) activity;
  }

  public void videoSetSource(String url){
    try {
//      if (me().castMediaConnected){
//        if (url.equals("")) {
//          me().castMediaUrl("","");
//        }
//        else {
//          videoPlayer.setMediaUri(null);
//          String ctype="application/x-mpegURL";
//          if (url.contains("#dash")){
//            ctype="application/dash+xml";
//          }
//          else if (url.contains("mp4upload.com")){
//            ctype="video/mp4";
//          }
//          me().castMediaUrl(url, ctype);
//          return;
//        }
//      }

      if (url.equals("")) {
        videoPlayer.setMediaUri(null);
        me().mSession.setActive(false);
      } else {
        if (url.endsWith("#dash")) {
          Log.d(_TAG,"VIDEO-SET-SOURCE (DASH) : "+url);
          MediaSource mediaSource =
              new DashMediaSource.Factory(videoDataSourceFactory.provide(""
                  , null))
                  .createMediaSource(MediaItem.fromUri(url));
          videoPlayer.setMediaSource(mediaSource);
        }
        else if (url.endsWith(".mkv")) {
          Log.d(_TAG,"VIDEO-SET-SOURCE (MKV) : "+url);
          MediaSource mediaSource =
                  new ProgressiveMediaSource.Factory(videoDataSourceFactory.provide(""
                          , null))
                          .createMediaSource(MediaItem.fromUri(url));
          videoPlayer.setMediaSource(mediaSource);
        }
        else {
          Log.d(_TAG,"VIDEO-SET-SOURCE (HLS) : "+url);
          videoPlayer.setMediaUri(Uri.parse(url));
        }
        me().mSession.setActive(true);
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
        !url.startsWith("https://"+Conf.getDomain()+"/")
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
    String path=uri.getPath();
    if (path==null) {
      path = "/";
    }

    if (host==null||accept==null) return aApi.badRequest;
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
            http.nocache=true;
            http.execute();
            InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
            return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
          } catch (Exception ignored) {
          }
        }
      }
      return aApi.assetsRequest(uri.getPath().substring(3));
    }
    else if (path.startsWith("/__cache_subtitle")){
      String out="";
      if (path.startsWith("/__cache_subtitle/clear")) {
        out = "OK";
        sourceCacheString = "";
      }
      else{
        out=sourceCacheString;
      }
      InputStream stream =
          new ByteArrayInputStream(out.getBytes(StandardCharsets.UTF_8));
      return new WebResourceResponse("text/plain", "UTF-8", stream);
    }
    else if (path.startsWith("/__proxy/")){
      /* Proxy */
      try {
        String proxy_url="";
        String hostStream=request.getRequestHeaders().get("X-Stream-Prox");
        proxy_url = url.replace("https://" + host + "/__proxy/", "");
        String fixdomain = request.getRequestHeaders().get("X-Fixdomain-Prox");
        if (!Conf.SOURCE_DOMAIN_USED.isEmpty() && (fixdomain==null)) {
          proxy_url=proxy_url.replace("://"+host,"://"+Conf.SOURCE_DOMAIN_USED);
          Log.d(_TAG,"CH-PROXY: "+proxy_url);
        }

        String method=request.getMethod();
        boolean isPost=method.equals("POST")||method.equals("PUT");
        boolean isPostBody=false;
        boolean isPostType=false;
        String queryData=request.getUrl().getQuery();
        if (queryData==null){
          queryData="";
        }
        String bodyData = request.getRequestHeaders().get("Post-Body");
        if (bodyData!=null){
          bodyData = URLDecoder.decode(bodyData,"UTF-8");
        }
        String postType = request.getRequestHeaders().get("X-Post-Prox");

        if (postType!=null){
          isPost=true;
          isPostType=true;
          method="POST";
        }

        if (isPost){
          if (bodyData!=null) {
            Log.d(_TAG, "PROXY-" + method + " POSTBODY = " +
                proxy_url + " >> " + bodyData);
            isPostBody=true;
          }
          else {
            if (proxy_url.contains("?")) {
              proxy_url = proxy_url.substring(0, proxy_url.indexOf("?"));
            }
            if (isPostType){
              queryData= URLDecoder.decode(queryData,"UTF-8");
            }
            Log.d(_TAG, "PROXY-" + method +": "+
                proxy_url + " >> " + queryData);
          }
        }
        else{
          Log.d(_TAG, "PROXY-"+method+" = " + proxy_url);
        }

        String proxyOrigin = request.getRequestHeaders().get("X-Org-Prox");
        String proxyReferer = request.getRequestHeaders().get("X-Ref-Prox");
        String noHeaderProxy = request.getRequestHeaders().get("X-NoH-Proxy");

        AnimeApi.Http http=new AnimeApi.Http(proxy_url);
        if (hostStream!=null){
          String[] h=hostStream.split("\\.");
          String hostProx = h[h.length-2]+"."+h[h.length-1];
          http.addHeader("Origin", "https://"+hostProx);
          if (request.getRequestHeaders().get("X-Dash-Prox")==null) {
            http.addHeader("Referer", "https://" + hostProx + "/");
            http.addHeader("X-Requested-With", "XMLHttpRequest");
            request.getRequestHeaders().remove("X-Requested-With");
          }
          http.addHeader("User-Agent", Conf.USER_AGENT);
          /* send rest headers */
          for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
            String k = entry.getKey();
            if (!k.equalsIgnoreCase("Referer") &&
                !k.equalsIgnoreCase("User-Agent") &&
                !k.equalsIgnoreCase("Origin") &&
                !k.equalsIgnoreCase("X-Stream-Prox")&&
                !k.equalsIgnoreCase("X-Org-Prox")&&
                !k.equalsIgnoreCase("X-Ref-Prox")&&
                !k.equalsIgnoreCase("X-NoH-Proxy")
            ) {
              http.addHeader(k, entry.getValue());
            }
          }
        }
        else if (noHeaderProxy!=null){
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
            if (isPostType && k.equalsIgnoreCase("content-type")){
              sent=true;
            }
            else if (k.equalsIgnoreCase("origin") && proxyOrigin != null) {
              http.addHeader("Origin", proxyOrigin);
              sent = true;
            } else if (k.equalsIgnoreCase("referer") && proxyReferer != null) {
              http.addHeader("Referer", proxyReferer);
              sent = true;
            } else if (k.equalsIgnoreCase("X-Org-Prox")
                || k.equalsIgnoreCase("X-Ref-Prox")
                || k.equalsIgnoreCase("X-Post-Prox")) {
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
            http.setMethod(method,queryData,
                isPostType?postType:"application/x-www-form-urlencoded");
          }
        }
        else if (method.equalsIgnoreCase("DELETE")){
          http.setMethod("DELETE",null,null);
        }
        http.execute();
        InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
        return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
      } catch (Exception ignored) {}
      return aApi.badRequest;
    }
    else if (url.startsWith("https://www.youtube.com/embed/")||url.startsWith(
        "https://www.youtube-nocookie.com/embed/")){
      return aApi.defaultRequest(view,request,
          aApi.assetsString("inject/yt.html"),"inject-html"
      );
    }
    else if (host.contains("youtube.com")||host.contains("youtube-nocookie.com")||
        host.contains("googlevideo.com")){
      if (accept!=null && (accept.contains("text/css")||accept.contains(
          "image/"))){
        return aApi.badRequest;
      }
      if (url.endsWith("/endscreen.js")||
          url.endsWith("/captions.js")||
          url.endsWith("/embed.js")||
          url.contains("/log_event?alt=json")||
          url.contains(".com/ptracking")||
          url.contains(".com/api/stats/")){
        return aApi.badRequest;
      }
      return super.shouldInterceptRequest(view, request);
    }
    else if (Objects.equals(path, "/__REDIRECT")){
      return aApi.assetsRequest("inject/redirect.html");
    }
    else if (isSourceDomain(host)) {
      WebResourceResponse wr=null;
      if (!Conf.SOURCE_DOMAIN_USED.isEmpty()){
        wr = aApi.defaultRequest(view, request,null,null,
                Conf.SOURCE_DOMAIN_USED);
      }
      else {
        wr = aApi.defaultRequest(view, request);
      }
      if (wr!=null){
        return wr;
      }
      return super.shouldInterceptRequest(view, request);
    }
    else if (host.contains(Conf.STREAM_DOMAIN3)||host.contains(Conf.STREAM_DOMAIN4)){
      if (accept.startsWith("text/css")){ // ||accept.startsWith("image/")){
        return aApi.badRequest;
      }

      // sourceCacheString
      if (path.contains("/getSources")){
        WebResourceResponse res = aApi.defaultRequest(view,request);
        String result = "";
        try {
          result = CharStreams.toString(new InputStreamReader(res.getData(),Charsets.UTF_8));
          sourceCacheString=result;
        } catch (Exception ignored) {}
        Log.d(_TAG, "CACHE VALUE =" + result);
        InputStream stream =
            new ByteArrayInputStream(result.getBytes(StandardCharsets.UTF_8));
        res.setData(stream);
        return res;
      }
      return aApi.defaultRequest(view,request);
    }
    else if (host.equals(Conf.SOURCE_DOMAIN5_API)){
      try {
        AnimeApi.Http http=new AnimeApi.Http(url);
        http.addHeader("Referer", "https://"+Conf.SOURCE_DOMAIN5_API);
        http.addHeader("Origin", "https://"+Conf.SOURCE_DOMAIN5_API);
        for (Map.Entry<String, String> entry :
            request.getRequestHeaders().entrySet()) {
          String k=entry.getKey();
          boolean sent= k.equalsIgnoreCase("origin") ||
              k.equalsIgnoreCase("referer") ||
              k.equalsIgnoreCase("X-Org-Prox") ||
              k.equalsIgnoreCase("X-Ref-Prox");
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
          url.startsWith("https://"+host+"/assets/mcloud/min/embed.js")
        /*||
          url.startsWith("https://"+host+"/mediainfo")*/
      ) {
        Log.d(_TAG,"VIEW PLAYER REQ = "+url);
//        if (!accept.startsWith("text/html"))
//          sendVidpageLoaded(1);

        boolean isJs=url.startsWith("https://"+host+
            "/assets/mcloud/min/embed.js");
        try {
          AnimeApi.Http http=new AnimeApi.Http(url);
          for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
            http.addHeader(entry.getKey(), entry.getValue());
          }
          http.execute();

          if (http.code()==200) {
            if (isJs){
              aApi.replaceString(http.body,
                  "function Q(){",
                  "function Q(){ "+
                      "try{console.log(arguments);"+
                      "if (!('__QKEYS' in window)) "+
                        "window.__QKEYS=[]; "+
                        "window.__QKEYS.push(arguments[0]);}catch(e){}"
              );
            }
            else if (accept.startsWith("text/html")) {
              try {
                aApi.injectString(http.body, playerInjectString);
                sendVidpageLoaded(1);
              }catch(Exception ignored){}
//              sendVidpageLoaded(0);
            }
//            else {
//              Log.d(_TAG, "sendM3U8Req = " + http.body.toString("UTF-8"));
//              sendM3U8Req(http.body.toString("UTF-8"));
//              try {
//                Thread.sleep(200);
//              }catch(Exception ignored){}
//              Log.d(_TAG, "sendM3U8Req Wait = " + http.body.toString("UTF-8"));
//            }
            InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
            return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
          }
        } catch (Exception ignored) {}
//        if (!accept.startsWith("text/html"))
//          sendVidpageLoaded(2);
//        else {
//          sendVidpageLoaded(3);
//          return null;
//        }
        return aApi.badRequest;
      }else if (accept.startsWith("text/css")||accept.startsWith("image/")){
        Log.d(_TAG,"BLOCK CSS/IMG = "+url);
        return aApi.badRequest;
      }
    }
    else if (host.contains("mp4upload.com")&&url.endsWith("video.mp4")){
      Log.d(_TAG, "GOT-MASTER-M3U8 mp4upload = " + url);
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
    }
    else if (host.contains("fonts.gstatic.com")||
        host.contains("fonts.googleapis.com")){
      if (Conf.PROGRESSIVE_CACHE) {
        return super.shouldInterceptRequest(view, request);
      }
      return aApi.defaultRequest(view,request);
    }
    else if (host.contains("rosebudemphasizelesson.com")||
            host.contains("simplewebanalysis.com")||
      host.contains("addthis.com")||
      host.contains("amung.us")||
      host.contains("www.googletagmanager.com")||
        host.contains("megastatics.com")||
      host.contains("ontosocietyweary.com")||
        host.contains("doubleclick.net")||
        host.contains("ggpht.com")||
        host.contains("play.google.com")||
        host.contains("www.google.com")||
        host.contains("googleapis.com")||
        host.contains("precedelaxative.com")
    ){
      /* BLOCK DNS */
      return aApi.badRequest;
    }
    else if (Conf.SOURCE_DOMAIN==3||Conf.SOURCE_DOMAIN==4){
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
    if (Conf.PROGRESSIVE_CACHE || request.getMethod().equalsIgnoreCase("POST")) {
      return super.shouldInterceptRequest(view, request);
    }
    return aApi.defaultRequest(view,request);
  }

//  public void getViewCallback(int u){
//    webView.evaluateJavascript("__GETVIEWCB(JSON.parse(_JSAPI.lastResult()),"+u+");",null);
//  }

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
//    private String lastResultText="";
//    private String lastResultUrl="";
//    @JavascriptInterface
//    public boolean getViewAvailable(){
//      return aApi.resData.status != 1;
//    }
//    @JavascriptInterface
//    public boolean getview(String url, int zid) {
//      if (aApi.resData.status==1) return false;
//      if (lastResultUrl.equals(url)){
//        AsyncTask.execute(() ->activity.runOnUiThread(() ->getViewCallback(zid)));
//        return true;
//      }
//      AsyncTask.execute(() -> activity.runOnUiThread(() -> aApi.getData(url, result -> {
//        lastResultUrl=url;
//        lastResultText=result.Text;
//        getViewCallback(zid);
//      })));
//      return true;
//    }

//    @JavascriptInterface
//    public String lastResult() {
//      return lastResultText;
//    }

//    @JavascriptInterface
//    public void clearView() {
//      aApi.cleanWebView();
//    }

//    @JavascriptInterface
//    public void tapEmulate(float x, float y) {
//      AsyncTask.execute(() -> simulateClick(x,y,false));
//    }

//    @JavascriptInterface
//    public void tapEmulateFix(float x, float y) {
//      AsyncTask.execute(() -> simulateClick(x,y,true));
//    }

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
        case "sd":
          if (MainActivity.ARG_SD != null)
            return MainActivity.ARG_SD;
          break;
      }
      return "";
    }

    @JavascriptInterface
    public void clearArg(){
      MainActivity.ARG_URL=null;
      MainActivity.ARG_TIP=null;
      MainActivity.ARG_POS=null;
      MainActivity.ARG_SD=null;
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

//    @JavascriptInterface
//    public void getmp4vid(String url) {
//      AsyncTask.execute(() -> {
//        final String out=aApi.getMp4Video(url);
//        activity.runOnUiThread(() -> webView.evaluateJavascript("__MP4CB("+out+");",null));
//      });
//    }

    @JavascriptInterface
    public void reloadHome() {
      runOnUiThreadWait(()->
          webView.loadUrl("https://"+Conf.getDomain()+"/__view/main.html")
      );
    }

    @JavascriptInterface
    public void goToUrl(String url) {
      runOnUiThreadWait(()->
          webView.loadUrl(url)
      );
    }

    @JavascriptInterface
    public void playNextMeta(String t, String d, String p, String u, String i
        , int sd){
      pnUpdated=false;
      pnTitle=t;
      pnDesc=d;
      pnPoster=p;
      pnUri=u;
      pnTip=i;
      pnSd=sd;
      Log.d(_TAG,"Update Meta ("+u+"; "+t+"; "+d+"; "+i+"; "+sd+"; Poster="+p+
          ")");
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

    public int videoLastBufferPercent=0;
    @JavascriptInterface
    public int videoBufferPercent() {
      if (videoStatCurrentUrl.equals("")){
        videoLastBufferPercent=0;
        return -1;
      }
      activity.runOnUiThread(()-> {
        try {
          videoLastBufferPercent=videoPlayer.getBufferedPercent();
        }catch(Exception ignored){}
      });
      return videoLastBufferPercent;
    }

    @JavascriptInterface
    public void videoTracks() {
      Log.d(_TAG,"Tracks = "+videoPlayer.getAvailableTracks());
    }

    @JavascriptInterface
    public void videoAudioTrack(String id, boolean updatenow) {
      videoAudioLanguage=id;
      if (updatenow) {
        activity.runOnUiThread(() -> {
          try {
            initVideoTracks();
          } catch (Exception ignored) {
          }
        });
      }
    }

    @JavascriptInterface
    public void videoTrackQuality(int id, boolean updatenow) {
      videoSelectedQuality=id;
      if (updatenow) {
        activity.runOnUiThread(() -> {
          try {
            initVideoTracks();
          } catch (Exception ignored) {
          }
        });
      }
    }

    @JavascriptInterface
    public void videoSetSpeed(float speed){
      activity.runOnUiThread(()-> {
        try {
          if (videoSupportSpeed()) {
            videoPlayer.setPlaybackSpeed(speed);
          }
        }catch(Exception ignored){}
      });
    }

    @JavascriptInterface
    public boolean videoSupportSpeed() {
      return (Build.VERSION.SDK_INT > Build.VERSION_CODES.O);
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
//      if (clean==1) {
//        lastResultUrl = "";
//        aApi.cleanWebView();
//      }
      Conf.STREAM_TYPE=type;
    }

    @JavascriptInterface
    public void setStreamServer(int mirror, int clean){
      Log.d(_TAG,"[X] setStreamServer = "+mirror+" / clean="+clean);
//      if (clean==1) {
//        lastResultUrl = "";
//        aApi.cleanWebView();
//      }
      Conf.STREAM_SERVER=mirror;
    }

    @JavascriptInterface
    public int getStreamType(){
      return Conf.STREAM_TYPE;
    }

    @JavascriptInterface
    public void openIntentUri(String s){
      activity.runOnUiThread(()-> {
        try {
          activity.startActivity(
                  new Intent(
                          Intent.ACTION_VIEW,
                          Uri.parse(s)
                  )
          );
        }catch(Exception ignored){}
      });
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

    @JavascriptInterface
    public boolean installApk(String url, boolean isNightly){
      return aApi.startUpdateApk(url, isNightly);
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
    public void videoSetMeta(String title, String artist, String poster){
      me().mediaSetMeta(title,artist,poster);
    }

    @JavascriptInterface
    public void videoHaveNP(boolean n, boolean p){
      me().mediaSetPrevNext(n,p);
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
    public void setSdomain(String s){
      Conf.SOURCE_DOMAIN_USED=s;
      Log.d(_TAG,"Change Source Domain: "+s);
    }
    @JavascriptInterface
    public String getSdomain(){
      return Conf.SOURCE_DOMAIN_USED;
    }

    @JavascriptInterface
    public int getCacheSz(){
      return Conf.CACHE_SIZE_MB;
    }
    @JavascriptInterface
    public void setCacheSz(int s){
      aApi.setCacheSize(s);
    }

    @JavascriptInterface
    public void clearCache(){
      activity.runOnUiThread(()->{
        webView.clearCache(true);
      });
      aApi.clearCache();
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

//    @JavascriptInterface
//    public void rayOk() {
//      if (cfOnCheck) {
//        cfOnCheck=false;
//        runOnUiThreadWait(() -> {
//          webView2.loadData(
//              "<html><body>Finish</body></html>","text/html",
//              null
//          );
//          webView.evaluateJavascript(
//              "__CFRAYOK()", null);
//          webView2.setVisibility(View.GONE);
//          Toast.makeText(activity,"Validation successful...",
//              Toast.LENGTH_SHORT).show();
//          cfProgress.setVisibility(View.INVISIBLE);
//          webView.requestFocus();
//        });
//      }
//    }

//    @JavascriptInterface
//    public void cfCheck() {
//      cfRayCheck();
//    }

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

    @JavascriptInterface
    public void playClick(){
      audioPlayClick();
    }

    @JavascriptInterface
    public void voiceSearch(){
      activity.runOnUiThread(()->{
        voiceSearchOpen();
      });
    }
    @JavascriptInterface
    public void voiceClose(){
      activity.runOnUiThread(()->{
        voiceSearchClose();
      });
    }

    @JavascriptInterface
    public void asyncPrompt(String message, int cbnum){
      activity.runOnUiThread(()-> {
        listPrompt(message, new ChromePromptCallback() {
          @Override
          public void confirm(String res) {
            webView.evaluateJavascript(
                    "_API.asyncPrompCb("+cbnum+","+res+");",null);
          }

          @Override
          public void cancel() {
            webView.evaluateJavascript(
                    "_API.asyncPrompCb("+cbnum+",null);",null);
          }
        });
      });
    }

    @JavascriptInterface
    public boolean haveMic(boolean checkSpeech){
      return voiceHaveMic(checkSpeech);
    }

    @JavascriptInterface
    public int profileGetSel(){
      return profile_sel;
    }
    @JavascriptInterface
    public String profileGetPrefix(){
      return profile_prefix;
    }

    @JavascriptInterface
    public void profileSetSel(int v){
      profile_sel=v;
    }
    @JavascriptInterface
    public void profileSetPrefix(String v){
      profile_prefix=v;
    }

    @JavascriptInterface
    public int setBrightness(int b){
      sysBrightness+=b;
      if (sysBrightness<0){
        sysBrightness=0;
      }
      else if (sysBrightness>255){
        sysBrightness=255;
      }
      activity.runOnUiThread(()->{
        if (b!=0) {
          WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
          lp.screenBrightness = (sysBrightness / (float) 255);
          activity.getWindow().setAttributes(lp);
        }
      });

      return sysBrightness;
    }
    @JavascriptInterface
    public int setVolume(int b){
      int v=audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
      int m=audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
      float vl=(v*100f)/m;
      if (b!=0) {
        vl+=b;
        if (vl<0) vl=0;
        else if(vl>100) vl=100;
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC,
            (int) ((vl*m)/100),
            0);
      }
      return (int) vl;
    }


    @JavascriptInterface
    public void setLandscape(boolean stat){
      activity.runOnUiThread(()->{
        if (stat){
          activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }
        else{
          activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_USER);
        }
      });
    }
    //

    @JavascriptInterface
    public int getSysHeight(boolean nav){
      updateInsets();
      if (nav){
        return sysheightNav;
      }
      return sysheightStat;
    }

    @JavascriptInterface
    public boolean getHaveTouchscreen(){
      if (activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_TOUCHSCREEN)) {
        return true;
      }
      return false;
    }


//    @JavascriptInterface
//    public void castConnect(){
//      activity.runOnUiThread(() ->me().castMediaSearch());
//    }
//
//    @JavascriptInterface
//    public void castSubtitle(String url){
//      me().castSubtitleUrl=url;
//    }
//
//    @JavascriptInterface
//    public boolean castConnected(){
//      return me().castMediaConnected;
//    }
//
//    @JavascriptInterface
//    public void castSubtitleIndex(int idx){
//      Log.d("ATVLOG","CAST REQ IDX: "+idx);
//      me().castSubtitleIndex=idx;
//      activity.runOnUiThread(() ->me().castUpdateSubtitle());
//    }
  }

  public int profile_sel=-1;
  public String profile_prefix="";

  public SpeechRecognizer voiceRecognizer=null;
  public RecognitionListener voiceListener=new RecognitionListener() {
    @Override
    public void onReadyForSpeech(Bundle bundle) {
      voiceSearchCallback(2, "");
    }
    @Override
    public void onBeginningOfSpeech() {
    }
    @Override
    public void onRmsChanged(float v) {
      voiceSearchCallback(7,v+"");
    }
    @Override
    public void onBufferReceived(byte[] bytes) {
    }
    @Override
    public void onEndOfSpeech() {
      voiceSearchCallback(5, "");
    }
    @Override
    public void onError(int i) {
      voiceSearchCallback(6, "");
      if (voiceRecognizer!=null) {
        voiceRecognizer.cancel();
        voiceRecognizer.destroy();
      }
      voiceRecognizer=null;
    }
    @Override
    public void onResults(Bundle bundle) {
      ArrayList<String> results = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
      voiceSearchCallback(4,results.get(0));
      if (voiceRecognizer!=null) {
        voiceRecognizer.stopListening();
        voiceRecognizer.cancel();
        voiceRecognizer.destroy();
      }
      voiceRecognizer=null;
    }
    @Override
    public void onPartialResults(Bundle bundle) {
      ArrayList<String> results = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
      voiceSearchCallback(3,results.get(0));
    }
    @Override
    public void onEvent(int i, Bundle bundle) {
    }
  };
  public void voiceSearchClose(){
    if (voiceRecognizer!=null){
      voiceSearchCallback(6, "");
      voiceRecognizer.stopListening();
      voiceRecognizer.cancel();
      voiceRecognizer.destroy();
      voiceRecognizer=null;
    }
    else{
      voiceSearchCallback(6, "");
    }
  }

  public boolean voiceHaveMic(boolean checkSpeech){
//    PackageManager pm = activity.getPackageManager();
//    boolean micPresent = pm.hasSystemFeature(PackageManager.FEATURE_MICROPHONE);
//    Log.d(_TAG,"Microphone: "+micPresent);
//    if (micPresent&&checkSpeech) {
      if (SpeechRecognizer.isRecognitionAvailable(activity)) {
        Log.d(_TAG,"Speech available");
        return true;
      }
      Log.d(_TAG,"Speech not available");
      return false;
//    }
//    return micPresent;
  }
  public void voiceSearchOpen(){
    if(ContextCompat.checkSelfPermission(activity,"android.permission.RECORD_AUDIO") != PackageManager.PERMISSION_GRANTED){
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        ActivityCompat.requestPermissions(activity,new String[]{"android" +
            ".permission.RECORD_AUDIO"},500);
      }
      voiceSearchCallback(6, "");
      return;
    }
    voiceRecognizer = SpeechRecognizer.createSpeechRecognizer(activity);
    voiceRecognizer.setRecognitionListener(voiceListener);
    Intent recognizerIntent =
        new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
    recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
    recognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE,
        activity.getPackageName());
    recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
    recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
    voiceSearchCallback(1, "");
    voiceRecognizer.startListening(recognizerIntent);
    /*
    1. Start
    2. Ready to speak
    3. Partial
    4. Finish
    5. End of Speak
    6. Error / close
    7. RMS
    */
  }

  public void voiceSearchCallback(int status, String text){
    Log.d(_TAG,"Voice Search ("+status+"): "+text);
    activity.runOnUiThread(() ->{
      try {
        JSONObject j = new JSONObject("{}");
        j.put("status", status);
        j.put("value", text);
        webView.evaluateJavascript(
            "__VOICESEARCH("+j.toString()+");",
            null
        );
      }catch (Exception ignored){}
    });
  }

//  public boolean cfOnCheck=false;

//  public void cfRayCheck(){
//    if (cfOnCheck) return;
//    runOnUiThreadWait(()-> {
//      cfProgress.setVisibility(View.VISIBLE);
//      cfOnCheck=true;
//      webView2.loadUrl("https://"+Conf.getDomain()+"/");
//      webView2.reload();
//    });
//  }

  @Override
  public void onPageFinished(WebView view, String url) {
    Log.d(_TAG,"ATVLOG-API --> "+url);
//    if (!url.contains("/__view/")){
//      if (cfOnCheck) {
//        webView2.setVisibility(View.VISIBLE);
//        view.evaluateJavascript(
//            "if (document.getElementById('i-wrapper')||document.querySelector('a.btn[href=home]')){ " +
//                "setTimeout(function(){_JSAPI.rayOk();},1000);" +
//                " }", null);
//        String ijs=
//            "function t1(){" +
//                "var a=document.querySelector('div#turnstile-wrapper');" +
//                "if (a){" +
//                "var h2=Math.floor(a.offsetHeight/2.5);"+
//                "var x=a.offsetLeft+h2;"+
//                "var y=a.offsetTop+h2;"+
//                "setTimeout(function(){_JSAPI.tapEmulateFix(x,y);" +
//                "setTimeout(t1,1000);},1000);" +
//                "}" +
//                "else " +
//                "setTimeout(t1,500);}" +
//                "t1();";
//        view.evaluateJavascript(ijs,null);
//      }
//    }

//    if (view.equals(webView2)){
//      return;
//    }

    splash.setVisibility(View.GONE);
    videoLayout.setVisibility(View.VISIBLE);
    webView.setVisibility(View.VISIBLE);
    activity.runOnUiThread(webView::requestFocus);
    webViewReady=true;
    // i-wrapper
  }

//  public float convertDpToPixel(float dp){
//    return dp * ((float) activity.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT);
//  }

//  private void simulateClick(float xx, float yy, boolean fixed) {
//    int x=(int) ((webView.getMeasuredWidth()*xx)/100.0);
//    int y=(int) ((webView.getMeasuredHeight()*yy)/100.0);
//    if (fixed){
//      x=(int) convertDpToPixel(xx);
//      y=(int) convertDpToPixel(yy);
//    }
//    Log.d(_TAG,"TAP: ("+x+", "+y+") -> "+xx+"%, "+yy+"%");
//    long downTime = SystemClock.uptimeMillis();
//    long eventTime = SystemClock.uptimeMillis() + 245;
//    int metaState = 0;
//    MotionEvent me = MotionEvent.obtain(
//        downTime,
//        eventTime,
//        MotionEvent.ACTION_DOWN,
//        x,
//        y,
//        metaState
//    );
//    webView2.dispatchTouchEvent(me);
//    me = MotionEvent.obtain(
//        downTime,
//        eventTime,
//        MotionEvent.ACTION_UP,
//        x+1,
//        y-2,
//        metaState
//    );
//    webView2.dispatchTouchEvent(me);
//  }

  public void updateArgs(){
    activity.runOnUiThread(() -> webView.evaluateJavascript("__ARGUPDATE();",null));
  }

  public boolean pnUpdated=false;
  public String pnTitle="";
  public String pnDesc="";
  public String pnPoster="";
  public String pnUri="";
  public String pnTip="";
  public int pnSd=1;
  public int pnPos=0;
  public int pnDuration=0;
  public void updatePlayNext(){
    AsyncTask.execute(() -> {
      if (pnUpdated){
        pnUpdated=false;
        if (pnPos>2&&(pnDuration-pnPos>5)) {
            try {
              AnimeProvider.setPlayNext(
                      activity, pnTitle, pnDesc,
                      pnPoster, pnUri, pnTip,
                      pnPos, pnDuration, pnSd
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
//      aApi.webView.saveState(bundle);
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
//      aApi.webView.restoreState(bundle);
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
    return new String(encoded, StandardCharsets.UTF_8).replace("/", "_").trim();
  }

}
