/*jshint esversion:6*/

//video variables

var $video_player_wrapper = $('#video_player-wrapper');
var $main_video_player = $('.main_video-player');
var $video = $('#main_video').get(0);
var $video_content = $('.video_content');
var $video_controllers = $('.video_controllers');

var video_duration;
var currentTime;
var syncProgress;

//volume_bar variables

var $volume_slider = $('.volume_slider');
var $volume_bar = $('.volume_bar');

var volume_value = parseInt($volume_slider.val());

$volume_bar.css({
  width: volume_value + "%"
});

$video.volume = volume_value/100;

// Progress Bar variables

var $progress_bar = $('.progress_bar');
var $slider = $('.slider');

var progress_value = $slider.val()/2;
$progress_bar.css({
  width: progress_value + "%"
});

// done and remain duration variables

var $duration_done = $('.duration_done');
var $duration_remain = $('.duration_remain');

var duration_done;
var duration_remain;
var hours, minutes, seconds;
var doneTimeFormat;
var remainTimeFormat;
var hrs, mns, sec;

$video.addEventListener('durationchange',function() {
  video_duration = $video.duration;
  $video.currentTime = (progress_value * video_duration)/100;
});

$video.addEventListener('loadeddata', function() {
   updateRemainDuration();
}, false);

$video_content.on('click', function() {
  if($video.paused)
    $video.play();
  else
    $video.pause();
});

function getTimeFormat(temp) {

  minutes = parseInt(temp/60);
  seconds = parseInt(temp%60);
  hours = parseInt(minutes/60);
  minutes = parseInt(minutes%60);
  if(hours<10)
  hrs = "0"+hours;
  else
  hrs = hours;
  if(minutes<10)
  mns = "0"+minutes;
  else
  mns = minutes;
  if(seconds<10)
  sec = "0"+seconds;
  else
  sec = seconds;

  return `${hrs}:${mns}:${sec}`;
}

function updateRemainDuration(check) {
  duration_done = $video.currentTime;
  duration_remain = video_duration-$video.currentTime;
  var temp;
  for(var i=0;i<2;i++)
  {
    if(i == 0) {
      temp = duration_done;
      doneTimeFormat = getTimeFormat(temp);
    } else {
      temp = duration_remain;
      remainTimeFormat = getTimeFormat(temp);
    }
  }
  $duration_done.text(doneTimeFormat);
  if(remainTimeFormat == "00:00:00")
    $duration_remain.text(remainTimeFormat);
  else
    $duration_remain.text("-"+remainTimeFormat);
}

function update_progress(value) {
  if(value>=0 && value<=100)
  {
    $progress_bar.css({
      width: value + "%"
    });
    progress_value = value;
    $slider.val(progress_value*2);
    updateRemainDuration();
  }
}

function updateCurrentTime(value) {
  if(value>=0 && value<=100){
    update_progress(value);
    $video.currentTime = Number(((value * video_duration)/100).toFixed(2));
  }
}

$slider.on('input', function() {
  progress_value = $slider.val()/2;
  updateCurrentTime(progress_value);
  update_progress(progress_value);
});

$slider.onmousedown = function() {
  $slider.onmousemove = function() {
    progress_value = $slider.val()/2;
    updateCurrentTime(progress_value);
    update_progress(progress_value);
  };
};

$slider.onmouseup = function() {
  $slider.onmousemove = null;
};

var $flash_icon = $('.flash_icon');

var $autoplayInput = $('#playlist_autoplay');
var $autoplayLabel = $('.autoplay');
var $shuffleInput = $('#playlist_shuffler');
var $shuffleLabel = $('.shuffler');
var $shuffleSVG = $('.shuffler svg path');
var $loopInput = $('#video_looper');
var $loopLabel = $('.looper');
var $loopSVG = $('.looper svg path');
var autoplayChecker = 0;
var shuffleChecker = 0;
var loopChecker = 0;

$loopLabel.on('click', function(e) {
  if(!$loopInput.is(':checked')) {
    loopChecker = 1;
    $loopSVG.attr('fill', '#FF3031');
  }
  else {
    loopChecker = 0;
    $loopSVG.attr('fill', '#EAF0F1');
  }
})

$autoplayLabel.on('click', function(e) {
  if(!$autoplayInput.is(':checked'))
    autoplayChecker = 1;
  else
    autoplayChecker = 0;
})

$shuffleLabel.on('click', function(e) {
  if(!$shuffleInput.is(':checked')) {
    shuffleChecker = 1;
    $shuffleSVG.attr('fill', '#FF3031');
  }
  else{
    shuffleChecker = 0;
    $shuffleSVG.attr('fill', '#EAF0F1')
  }
})

var $next_track_icon = $('.next_track_icon');
var $previous_track_icon = $('.previous_track_icon');
var $video_list = $('video source');
var currentSrc = $video.src;

getCurrentVideoIndex();

function getCurrentVideoIndex() {
  for(let i=0; i<$video_list.length;i++) {
    if($video_list[i].src == $video.src) {
      return i;
    }

  }
}

function getSubstring(currentSrc) {
  return currentSrc.substring(currentSrc.lastIndexOf('/')+1, currentSrc.length);
}

function getNextVideo() {
  for(let i=0; i<$video_list.length; i++) {
    if( $($video_list[i]).attr('src') == "./videos/" + getSubstring($video.src)) {
      if(i != $video_list.length-1)
        return $video_list[i+1].src;
      else
        return $video_list[0].src;
    }
  }
}

function getPreviousVideo() {
  for(let i=0; i<$video_list.length; i++) {
    if( $($video_list[i]).attr('src') == "./videos/" + getSubstring($video.src)) {
      if(i != 0)
        return $video_list[i-1].src;
      else
        return $video_list[$video_list.length-1].src;
    }
  }
}

$next_track_icon.on('click', function() {
  playNextVideo();
});

$previous_track_icon.on('click', function() {
  playPreviousVideo();
});

function playNextVideo() {
  let source = getNextVideo();
  $video.src = source;
  $video.load();
  $video.play();
  let index = getCurrentVideoIndex();
  showSelectedVideo(index);
}

function playPreviousVideo() {
  let source = getPreviousVideo();
  $video.src = source;
  $video.load();
  $video.play();
  let index = getCurrentVideoIndex();
  showSelectedVideo(index);
}

var currentRandomNumber;

function shufflePlaylist() {
  let random = Math.floor(Math.random()*$video_list.length);
  while(currentRandomNumber == random)
  {
    random = Math.floor(Math.random()*$video_list.length);
  }
  currentRandomNumber = random;
  $video.src = $video_list[random].src;
  $video.load();
  $video.play();
  let index = getCurrentVideoIndex();
  showSelectedVideo(index);
}

$video.addEventListener('play', function() {
  $flash_icon.clearQueue().stop().fadeIn(1000).clearQueue().stop().fadeOut(1000);
  jQuery.each($play_icon, function(index, value) {
    if(index == 0)
    {
      $($play_icon.get(index)).clearQueue().stop().hide(500);
    } else {
      $($play_icon.get(index)).clearQueue().stop().hide();
    }
  });
  jQuery.each($pause_icon, function(index, value) {
    if(index == 0)
    {
      $($pause_icon.get(index)).clearQueue().stop().show(500);
    } else {
      $($pause_icon.get(index)).clearQueue().stop().show();
    }
  });
  clearInterval(syncProgress);
  syncProgress = setInterval(function() {
    currentTime = (($video.currentTime)/video_duration)*100;
    if($video.currentTime == video_duration) {

        if(loopChecker == 1)
        {
          $video.play();
        }
        else if(shuffleChecker == 1)
        {
          shufflePlaylist();
        }
        else if(autoplayChecker == 1) {
          playNextVideo();
        } else {
          $video.pause();
        }
    }
    update_progress(Number(currentTime.toFixed(2)));
    updateRemainDuration();
  },10);
}, false);

$video.addEventListener('pause', function() {
  $flash_icon.clearQueue().stop().fadeIn(1000);
  jQuery.each($play_icon, function(index, value) {
    if(index == 0)
    {
      $($play_icon.get(index)).clearQueue().stop().show(500);
    } else {
      $($play_icon.get(index)).clearQueue().stop().show();
    }
  });
  jQuery.each($pause_icon, function(index, value) {
    if(index == 0)
    {
      $($pause_icon.get(index)).clearQueue().stop().hide(500);
    } else {
      $($pause_icon.get(index)).clearQueue().stop().hide();
    }
  });
  clearInterval(syncProgress);
}, false);

// video play

$play_icon = $('.play_icon');
$pause_icon = $('.pause_icon');
$play_pause = $('.play_pause');

$play_icon.css({
  marginLeft:"7px"
});

$pause_icon.css({
  marginLeft:"5px"
}).hide();

$play_icon.on('click', function(event) {
  $video.play();
});

$pause_icon.on('click', function(event) {
  $video.pause();
});

//update progress_bar and currentTime

var $fast_forward = $('.fast_forward_icon');
var $fast_backward = $('.fast_backward_icon');
var $forward5 = $('.forward5 .spinner_icon');
var $backward5 = $('.forward5 .undo_icon');
var $forwardSeconds = $('.forward5 span h2');
var timeoutId = 0;

$forward5.hide();
$backward5.hide();
$forwardSeconds.hide();

$fast_forward.on('mousedown',function() {
  $forwardSeconds.text("5");
  $forwardSeconds.clearQueue().stop().fadeIn();
  $forward5.clearQueue().stop().fadeIn();
  timeoutId = setInterval(function() {
    if($video.readyState == 4)
    {
      $video.currentTime = $video.currentTime+5;
      currentTime = (($video.currentTime)/video_duration)*100;
      update_progress(Number(currentTime.toFixed(2)));
      updateRemainDuration();
    }
  }, 10);
}).on('mouseup mouseleave', function() {
  clearInterval(timeoutId);
  $forwardSeconds.fadeOut(1000);
  $forward5.fadeOut(1000);
});

$fast_backward.on('mousedown',function() {
  console.log("hello");
  if($video.currentTime <= 5)
    $forwardSeconds.text("0");
  else
    $forwardSeconds.text("5");
  $forwardSeconds.clearQueue().stop().fadeIn().fadeOut(1000);
  $backward5.clearQueue().stop().fadeIn();
  timeoutId = setInterval(function() {
    if($video.readyState == 4)
    {
      $video.currentTime = $video.currentTime-5;
      currentTime = (($video.currentTime)/video_duration)*100;
      update_progress(Number(currentTime.toFixed(2)));
      updateRemainDuration();
    }
  }, 10);
}).on('mouseup mouseleave', function() {
      clearInterval(timeoutId);
      $backward5.fadeOut(1000);
      $forwardSeconds.fadeOut(1000);
});

//video volume

var $volume_icon_wrapper = $('.volume_icon');
var $vol_off = $('.vol_off');
var $vol_level_1 = $('.vol_level-1');
var $vol_level_2 = $('.vol_level-2');
var $vol_max = $('.vol_max');

var currentVolume;
var vol_icon_array = [$vol_off, $vol_level_1, $vol_level_2, $vol_max];
var vol_checker;

function update_volume(value) {
  if(value>=0 && value<=100)
  {
    $volume_bar.css({
      width: value + "%"
    });
    volume_value = value;
    $volume_slider.val(volume_value);
  }
}

function updateCurrentVolume(value) {
  if(value>=0 && value<=100)
  {
    volume_value = value;
    $video.volume = volume_value/100;
    update_vol_icon();
  }
}

update_vol_icon();

function update_vol_icon() {
  if($video.volume <= 0.01){
    vol_checker = 0;
    $video.volume = 0;
  }
  else if($video.volume>=0.01 && $video.volume<0.5)
  vol_checker = 1;
  else if($video.volume>=0.5 && $video.volume<0.99)
  vol_checker = 2;
  else
  vol_checker = 3;

  vol_icon_array.map(function(vol, index) {
    if(vol_checker == index)
    vol.show();
    else
    vol.hide();
  });
}

$volume_icon_wrapper.on('click', function(){
  if($video.volume>0.01)
  {
    currentVolume = $video.volume;
    $video.volume = 0.01;
    update_volume(0);
    update_vol_icon();
  } else {
    $video.volume = currentVolume;
    update_volume($video.volume*100);
    update_vol_icon();
  }
});

$volume_slider.on('input', function() {
  volume_value = $volume_slider.val();
  updateCurrentVolume(volume_value);
  update_volume(volume_value);
});

$volume_slider.onmousedown = function() {
  $volume_slider.onmousemove = function() {
    volume_value = $volume_slider.val();
    updateCurrentVolume(volume_value);
    update_volume(volume_value);
  };
};

$volume_slider.onmouseup = function() {
  $volume_slider.onmousemove = null;
};

$video_player_wrapper.on('keydown', function(e) {
  e.preventDefault();
  switch(e.keyCode) {
    case 32:
      if($video.paused == false)
        $video.pause();
      else
        $video.play();
      break;
    case 39:
    updateCurrentTime((progress_value + 0.5));
    update_progress((progress_value + 0.5));
    break;
    case 37:
    updateCurrentTime((progress_value - 0.5));
    update_progress((progress_value - 0.5));
    break;
    case 38:
    updateCurrentVolume((volume_value+1));
    update_volume((volume_value+1));
    break;
    case 40:
    updateCurrentVolume((volume_value-1));
    update_volume((volume_value-1));
    break;
  }
});

var $settings_icon = $('.cog_icon');
var $download_icon = $('.download_icon');
var $fullscreen_icon = $('.fullscreen_icon');

function goFullscreen() {
  if ($video.mozRequestFullScreen) {
    $video.mozRequestFullScreen();
  } else if ($video.webkitRequestFullScreen) {
    $video.webkitRequestFullScreen();
  }
}

$fullscreen_icon.on('click',goFullscreen);
$video_content.on('dblclick',goFullscreen);

var $duration_tip = $('.tooltip.duration_tip');
var $volume_tip = $('.tooltip.volume_tip');
var $play_tip = $('.tooltip.play_tip');
var $pause_tip = $('.tooltip.pause_tip');
var $forward_tip = $('.tooltip.forward_tip');
var $backward_tip = $('.tooltip.backward_tip');
var $next_tip = $('.tooltip.next_tip');
var $previous_tip = $('.tooltip.previous_tip');
var $mute_tip = $('.tooltip.mute_tip');
var $unmute_tip = $('.tooltip.unmute_tip');
var $settings_tip = $('.tooltip.settings_tip');
var $download_tip = $('.tooltip.download_tip');
var $fullscreen_tip = $('.tooltip.fullscreen_tip');
var $loop_tip = $('.tooltip2.loop_tip');
var $autoplay_tip = $('.tooltip2.autoplay_tip');
var $shuffle_tip = $('.tooltip2.shuffle_tip');
var $tooltip = $('.tooltip');
var $tooltip2 = $('.tooltip2');

$tooltip.hide();
$tooltip2.hide();

var currentPosition;
var $progress_bar_wrapper = $('.progress_bar-wrapper');
var $volume_bar_wrapper = $('.volume_slider');
var progress_bar_wrapper_width = parseInt($progress_bar_wrapper.css('width'));
var sliderXposition = $progress_bar_wrapper.offset().left;
var volumeXposition = $volume_bar_wrapper.offset().left;
var volume_bar_wrapper_width = parseInt($volume_bar_wrapper.css('width'));
var $playlist_utils = $('.playlist_utils');
var playlistXposition = $playlist_utils.offset().left;
var playlist_utils_width = parseInt($playlist_utils.css('width'));
var widthHalf;

var currentPXPosition;
var currentVXPosition;
var currentTip2Position;

function getTooltipPosition(e, tooltipId) {
  currentPosition = (((e.pageX - sliderXposition)-widthHalf)/progress_bar_wrapper_width)*100;
  $tooltip.css({left: currentPosition + "%"});
  currentPXPosition = currentPosition;
  currentVXPosition = (((e.pageX - volumeXposition)-widthHalf)/volume_bar_wrapper_width)*100;
  currentTip2Position = (((e.pageX - playlistXposition)-widthHalf)/playlist_utils_width)*100;
  $tooltip2.css({left: currentTip2Position + "%"});
  if(tooltipId == 1)
    return currentPXPosition;
  if(tooltipId == 2)
    return currentVXPosition;
  if(tooltipId == 3)
    return currentTip2Position;
}

$loopLabel.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($loop_tip.css('width'))/2;
  console.log($loop_tip);
  console.log(widthHalf);
  getTooltipPosition(e, 3);
  if(loopChecker == 1) {
    $loop_tip.text("Loop Off");
  } else {
    $loop_tip.text("Loop On");
  }
  $loop_tip.clearQueue().stop().show();
});

$loopLabel.on('click', function(e) {
  if(loopChecker == 1) {
    $loop_tip.text("Loop Off");
  } else {
    $loop_tip.text("Loop On");
  }
})

$loopLabel.on('mouseout', function() {
  $loop_tip.clearQueue().stop().hide();
});

$autoplayLabel.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($autoplay_tip.css('width'))/2;
  getTooltipPosition(e, 3);
  if(autoplayChecker == 1) {
    $autoplay_tip.text("Autoplay Off");
  } else {
    $autoplay_tip.text("Autoplay On");
  }
  $autoplay_tip.clearQueue().stop().show();
});

$autoplayLabel.on('click', function(e) {
  if(autoplayChecker == 1) {
    $autoplay_tip.text("Autoplay Off");
  } else {
    $autoplay_tip.text("Autoplay On");
  }
})

$autoplayLabel.on('mouseout', function() {
  $autoplay_tip.clearQueue().stop().hide();
});

$shuffleLabel.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($shuffle_tip.css('width'))/2;
  getTooltipPosition(e, 3);
  if(shuffleChecker == 1) {
    $shuffle_tip.text("Shuffle Off");
  } else {
    $shuffle_tip.text("Shuffle On");
  }
  $shuffle_tip.clearQueue().stop().show();
});

$shuffleLabel.on('click', function(e) {
  if(shuffleChecker == 1) {
    $shuffle_tip.text("Shuffle Off");
  } else {
    $shuffle_tip.text("Shuffle On");
  }
});

$shuffleLabel.on('mouseout', function() {
  $shuffle_tip.clearQueue().stop().hide();
});

var percentProgress;

$progress_bar_wrapper.on('mouseover mousemove', function(e) {
  if(e.target == $slider.get(0)) {
    widthHalf = parseInt($duration_tip.css('width'))/2;
    percentProgress = (((getTooltipPosition(e, 1)/100)+(widthHalf/progress_bar_wrapper_width))*100).toFixed(2);
    if(percentProgress >= 0 && percentProgress <=100) {
      percentProgress = getTimeFormat(($video.duration*percentProgress)/100);
      $duration_tip.text(percentProgress);
      $duration_tip.clearQueue().stop().show();
    } else {
      $duration_tip.clearQueue().stop().hide();
    }
  }
});

$tooltip.on('mouseover mousemove', function(e) {
  $tooltip.clearQueue().stop().hide();
});

$progress_bar_wrapper.on('mouseout', function() {
  $duration_tip.clearQueue().stop().hide();
});

$volume_slider.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($volume_tip.css('width'))/2;
  percentProgress = (((getTooltipPosition(e, 2)/100)+(widthHalf/volume_bar_wrapper_width))*100).toFixed(0);
  if(percentProgress-3 <0 || percentProgress-3 > 95) {
    $volume_tip.clearQueue().stop().hide();
  }
  else {
    $volume_tip.clearQueue().stop().show();
    $volume_tip.text(percentProgress-3);
  }
});

$volume_slider.on('mouseout', function() {
  $volume_tip.clearQueue().stop().hide();
});

$play_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($play_tip.css('width'))/2;
  getTooltipPosition(e);
  $play_tip.clearQueue().stop().show();
});

$play_icon.on('mouseout', function(e) {
  $play_tip.clearQueue().stop().hide();
});

$play_icon.on('click', function(e) {
  $play_tip.clearQueue().stop().hide();
  $pause_tip.clearQueue().stop().show();
});

$pause_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($pause_tip.css('width'))/2;
  getTooltipPosition(e);
  $pause_tip.clearQueue().stop().show();
});

$pause_icon.on('click', function(e) {
  $pause_tip.clearQueue().stop().hide();
  $play_tip.clearQueue().stop().show();
});

$pause_icon.on('mouseout', function(e) {
  $pause_tip.clearQueue().stop().hide();
});

$fast_forward.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($forward_tip.css('width'))/2;
  getTooltipPosition(e);
  $forward_tip.clearQueue().stop().show();
});

$fast_forward.on('mouseout', function(e) {
  $forward_tip.clearQueue().stop().hide();
});

$fast_backward.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($backward_tip.css('width'))/2;
  getTooltipPosition(e);
  $backward_tip.clearQueue().stop().show();
});

$fast_backward.on('mouseout', function(e) {
  $backward_tip.clearQueue().stop().hide();
});

$next_track_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($next_tip.css('width'))/2;
  getTooltipPosition(e);
  $next_tip.clearQueue().stop().show();
});

$next_track_icon.on('mouseout', function(e) {
  $next_tip.clearQueue().stop().hide();
});

$previous_track_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($previous_tip.css('width'))/2;
  getTooltipPosition(e);
  $previous_tip.clearQueue().stop().show();
});

$previous_track_icon.on('mouseout', function(e) {
  $previous_tip.clearQueue().stop().hide();
});

var currentVolTip;
var $volumeSVG = $('.volume_icon svg');

$volumeSVG.on('mouseover mousemove', function(e) {
  if($video.volume > 0) {
    currentVolTip = $mute_tip;
  } else {
    currentVolTip = $unmute_tip;
  }
  widthHalf = parseInt(currentVolTip.css('width'))/2;
  getTooltipPosition(e);
  currentVolTip.clearQueue().stop().show();
});

$volumeSVG.on('click', function(e) {
  currentVolTip.clearQueue().stop().hide();
  if(currentVolTip == $unmute_tip)
  {
    $unmute_tip.clearQueue().stop().show();
  } else {
    $mute_tip.clearQueue().stop().show();
  }
});

$volumeSVG.on('mouseout', function(e) {
  $mute_tip.clearQueue().stop().hide();
  $unmute_tip.clearQueue().stop().hide();
});

$settings_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($settings_tip.css('width'))/2;
  getTooltipPosition(e);
  $settings_tip.clearQueue().stop().show();
});

$settings_icon.on('mouseout', function() {
  $settings_tip.clearQueue().stop().hide();
});

$download_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($download_tip.css('width'))/2;
  getTooltipPosition(e);
  $download_tip.clearQueue().stop().show();
});

$download_icon.on('mouseout', function() {
  $download_tip.clearQueue().stop().hide();
});

$fullscreen_icon.on('mouseover mousemove', function(e) {
  widthHalf = parseInt($fullscreen_tip.css('width'))/2;
  getTooltipPosition(e);
  $fullscreen_tip.clearQueue().stop().show();
});

$fullscreen_icon.on('mouseout', function() {
  $fullscreen_tip.clearQueue().stop().hide();
});
