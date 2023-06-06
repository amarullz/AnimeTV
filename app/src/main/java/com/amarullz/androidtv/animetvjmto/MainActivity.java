package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import androidx.fragment.app.FragmentActivity;

/*
 * Main Activity class that loads {@link MainFragment}.
 */
public class MainActivity extends FragmentActivity {
  public AnimeView aView;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    aView=new AnimeView(this);

//    AnimeApi aApi=new AnimeApi(this);
//    // https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-entertainment-district-arc.vpml/ep-1
//    aApi.getData("https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-entertainment-district-arc.vpml/ep-1",result -> {
//      Log.d("ATVLOG","Result View = "+result.Text);
//      aApi.getData("https://9anime.to/watch/kizuna-no-allele.vvq72/ep-10",result2 -> {
//        Log.d("ATVLOG","Result View 2 = "+result2.Text);
//      });
//    });
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
    switch(code){
      case KeyEvent.KEYCODE_BACK: c=27; break;
      case KeyEvent.KEYCODE_DPAD_UP: c=38; break;
      case KeyEvent.KEYCODE_DPAD_DOWN: c=40; break;
      case KeyEvent.KEYCODE_DPAD_LEFT: c=37; break;
      case KeyEvent.KEYCODE_DPAD_RIGHT: c=39; break;
      case KeyEvent.KEYCODE_DPAD_CENTER: c=13; break;
    }
    if (c>0) {
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
      return true;
    }
    return super.dispatchKeyEvent(event);
  }

}