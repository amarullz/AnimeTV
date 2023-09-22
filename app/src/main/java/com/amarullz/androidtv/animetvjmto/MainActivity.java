package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

/*
 * Main Activity class that loads {@link MainFragment}.
 */
public class MainActivity extends FragmentActivity {
  public AnimeView aView;
  public static String ARG_URL=null;
  public static String ARG_TIP=null;
  public static String ARG_POS=null;

  public void updateInstance(Bundle savedInstanceState){
    /* Load Arguments */
    if (savedInstanceState == null) {
      Bundle extras = getIntent().getExtras();
      if(extras != null) {
        ARG_URL= extras.getString("viewurl");
        ARG_TIP= extras.getString("viewtip");
        ARG_POS=extras.getString("viewpos");
      }
      else{
        ARG_URL=null;
        ARG_TIP=null;
        ARG_POS=null;
      }
    } else {
      ARG_URL= (String) savedInstanceState.getSerializable("viewurl");
      ARG_TIP= (String) savedInstanceState.getSerializable("viewtip");
      ARG_POS= (String) savedInstanceState.getSerializable("viewpos");
    }
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    setContentView(R.layout.activity_main);

    updateInstance(savedInstanceState);
    aView=new AnimeView(this);
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if ((keyCode == KeyEvent.KEYCODE_BACK) && aView.webView.canGoBack()) {
      aView.webView.goBack();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }
  private boolean sendKeyEvent(int code, boolean send){
    int c=0;
//    RED = 183
//    GREEN = 184
//    YELLOW = 185
//    BLUE = 186
//    PROG UP = 166
//    PROG DOWN = 167
//    EXIT = 4
//    0-9 = 7 - 16
//    INFO = 165
//    TTX = 233
//    EPG = 172
    switch(code){
      case KeyEvent.KEYCODE_ESCAPE:
      case KeyEvent.KEYCODE_BACK: c=27; break;
      case KeyEvent.KEYCODE_DPAD_UP: c=38; break;
      case KeyEvent.KEYCODE_DPAD_DOWN: c=40; break;
      case KeyEvent.KEYCODE_DPAD_LEFT: c=37; break;
      case KeyEvent.KEYCODE_DPAD_RIGHT: c=39; break;
      case KeyEvent.KEYCODE_ENTER:
      case KeyEvent.KEYCODE_DPAD_CENTER: c=13; break;
      case 166: /* PROG UP */
      case KeyEvent.KEYCODE_PAGE_UP: c=33; break;
      case 167: /* PROG DOWN */
      case KeyEvent.KEYCODE_PAGE_DOWN: c=34; break;
      case 183: /* red */
      case KeyEvent.KEYCODE_F5:
        if (send){
          aView.reloadView();
        }
        break;
    }
    if (c>0&&aView.webViewReady) {
      if (send) {
        aView.webView.evaluateJavascript("_KEYEV(" + c + ")", null);
      }
      return true;
    }
    return false;
  }

  @SuppressLint("RestrictedApi")
  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    if (sendKeyEvent(event.getKeyCode(),event.getAction() == KeyEvent.ACTION_DOWN)){
      return false;
    }
    return super.dispatchKeyEvent(event);
  }

  @Override
  protected void onStop() {
    aView.updatePlayNext();
    super.onStop();
  }

  @Override
  protected void onStart() {
    super.onStart();
    aView.onStartPause(true);
  }

  @Override
  protected void onPause() {
    aView.onStartPause(false);
    super.onPause();
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState)
  {
    aView.onSaveRestore(true,outState);
    super.onSaveInstanceState(outState);
  }
  @Override
  protected void onRestoreInstanceState(Bundle savedInstanceState)
  {
    aView.onSaveRestore(false,savedInstanceState);
    super.onRestoreInstanceState(savedInstanceState);
  }

  @Override
  protected void onNewIntent(Intent intent){
    super.onNewIntent(intent);
    ARG_URL= intent.getStringExtra("viewurl");
    ARG_TIP= intent.getStringExtra("viewtip");
    ARG_POS= intent.getStringExtra("viewpos");
    aView.updateArgs();
  }

}