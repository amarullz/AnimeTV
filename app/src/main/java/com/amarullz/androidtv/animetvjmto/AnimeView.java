package com.amarullz.androidtv.animetvjmto;

import android.app.Activity;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.SystemClock;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.Map;

public class AnimeView extends WebViewClient {
  private Activity activity;
  public WebView webView;
  public AnimeApi aApi;

  public static boolean USE_WEB_VIEW_ASSETS=true;

  public AnimeView(Activity mainActivity) {
    activity = mainActivity;
    webView = activity.findViewById(R.id.webview);
    webView.setBackgroundColor(0xffffffff);
    WebSettings webSettings = webView.getSettings();
    webSettings.setJavaScriptEnabled(true);
    webSettings.setMediaPlaybackRequiresUserGesture(false);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
    webSettings.setSafeBrowsingEnabled(false);
    webSettings.setSupportMultipleWindows(false);
    webView.addJavascriptInterface(new JSViewApi(), "_JSAPI");
    webView.setWebViewClient(this);

    aApi=new AnimeApi(activity);

    webView.loadUrl("https://9anime.to/__view/main.html");
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
    String url = request.getUrl().toString();
    if (url.startsWith("https://9anime.to/")) {
      return false;
    }
    return true;
  }

  @Override
  public WebResourceResponse shouldInterceptRequest(final WebView view,
                                                    WebResourceRequest request) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    String host = uri.getHost();
    String accept = request.getRequestHeaders().get("Accept");
    if (host.contains("9anime.to")) {
      String path=uri.getPath();
      if (path.startsWith("/__view/")){
        if (USE_WEB_VIEW_ASSETS){
          if (!path.endsWith(".woff2") && !path.endsWith(".ttf")&& !accept.startsWith("image/")) {
            /* dev web */
            try {
              Log.d("ATVLOG", "VIEW GET " + url + " = " + accept);
              String newurl = url.replace("https://9anime.to", "https://pc.jmiot.org");
              HttpURLConnection conn = aApi.initQuic(newurl, request.getMethod());
              for (Map.Entry<String, String> entry :
                      request.getRequestHeaders().entrySet()) {
                conn.setRequestProperty(entry.getKey(), entry.getValue());
              }
              String[] cType = aApi.parseContentType(conn.getContentType());
              ByteArrayOutputStream buffer = aApi.getBody(conn, null);
              InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
              return new WebResourceResponse(cType[0], cType[1], stream);
            } catch (Exception e) {}
            return aApi.badRequest;
          }
        }
        return aApi.assetsRequest(uri.getPath().substring(3));
      }
      try {
        HttpURLConnection conn = aApi.initQuic(url, request.getMethod());
        for (Map.Entry<String, String> entry :
            request.getRequestHeaders().entrySet()) {
          conn.setRequestProperty(entry.getKey(), entry.getValue());
        }
        String[] cType = aApi.parseContentType(conn.getContentType());
        ByteArrayOutputStream buffer = aApi.getBody(conn, null);
        InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
        return new WebResourceResponse(cType[0], cType[1], stream);
      } catch (Exception e) {}
      return aApi.badRequest;
    }
    return super.shouldInterceptRequest(view, request);
  }

  public void getViewCallback(String d){
    webView.evaluateJavascript("__GETVIEWCB("+d+");",null);
  }

  public class JSViewApi{
    @JavascriptInterface
    public void getview(String url) {
      activity.runOnUiThread(() -> {
        aApi.getData(url,result -> {
          getViewCallback(result.Text);
        });
      });
    }
    @JavascriptInterface
    public void tapEmulate(float x, float y) {
      simulateClick(x,y);
    }

    @JavascriptInterface
    public void appQuit() {
      activity.finish();
    }

    @JavascriptInterface
    public void getmp4vid(String url) {
      AsyncTask.execute(new Runnable() {
        @Override
        public void run() {
          final String out=aApi.getMp4Video(url);
          activity.runOnUiThread(() -> {
            webView.evaluateJavascript("__MP4CB("+out+");",null);
          });
        }
      });
    }
  }

  @Override
  public void onPageFinished(WebView view, String url) {
    webView.setVisibility(View.VISIBLE);
  }

  private void simulateClick(float xx, float yy) {
    int x=(int) ((webView.getMeasuredWidth()*xx)/100.0);
    int y=(int) ((webView.getMeasuredHeight()*yy)/100.0);
    Log.d("VLOG","TAP: ("+x+", "+y+") -> "+xx+"%, "+yy+"%");
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
}
