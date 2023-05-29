package com.amarullz.androidtv.animetvjmto;

import android.os.Bundle;
import android.util.Log;

import androidx.fragment.app.FragmentActivity;

/*
 * Main Activity class that loads {@link MainFragment}.
 */
public class MainActivity extends FragmentActivity {
  private AnimeApi aApi;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    aApi=new AnimeApi(this);
    // https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-entertainment-district-arc.vpml/ep-1
    aApi.getData("https://9anime.to/watch/munou-na-nana-mini-anime-yaminabe-party.9o1q0/ep-1",result -> {
      Log.d("ATVLOG","Result View = "+result.Text);
    });
  }

}