package com.amarullz.androidtv.animetvjmto;

import android.app.Service;
import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class ChannelService extends JobService {
    public ChannelService() {
    }

    @Override
    public boolean onStartJob(JobParameters params) {
        AnimeProvider.executeJob(this);
        return false;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
    }
}