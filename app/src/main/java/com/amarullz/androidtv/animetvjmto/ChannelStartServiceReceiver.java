package com.amarullz.androidtv.animetvjmto;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class ChannelStartServiceReceiver  extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        AnimeProvider.scheduleJob(context);
    }
}
