
var $playlist_list = $('.video_player-playlist ul');

var new_list_item = '<li class="list_item"><span class="selected"></span><div class="list_item-index"></div><div class="list_item-details"><h3></h3><p></p></div></li>';

function createListItems(total) {
  for(let i=0;i<total;i++) {
    $playlist_list.append(new_list_item);
  }
}

createListItems($video_list.length);

var $list_item = $('.list_item');
var $list_item_index = $('.list_item-index');
var $list_item_title = $('.list_item-details h3');
var $list_item_description = $('.list_item-details p');
var $list_item_selector = $('.list_item .selected');

$list_item_selector.map(function(index, item) {
  if(index != 0)
    $(item).css({width:"0px"});
})

function addListItemDetails() {
  for(let i=0; i<$video_list.length; i++) {
    $($list_item_title[i]).text(getSubstring($video_list[i].src).split('_').join(' '));
    $($list_item_description).text($($video).attr('title'));
    $($list_item_index[i]).text(i+1+".");
  }
}
addListItemDetails();

function showSelectedVideo(index) {
  for(let i=0;i<$video_list.length;i++) {
    if(i == index)
    {
      $($list_item_selector[i]).css({width:"2px"});
    } else {
      $($list_item_selector[i]).css({width:"0px"});
    }
  }
}

function playClickedVideo(index) {
  showSelectedVideo(index);
  $video.src = $video_list[index].src;
  $video.load();
  $video.play();
}

function checkListItem(item) {
  for(let i=0;i<$video_list.length; i++) {
    if($list_item[i] == item)
    {
      playClickedVideo(i);
      break;
    }
  }
}

$playlist_list.on('click', 'div', function(e) {
  if($(e.target).parents('li')) {
    checkListItem($(e.target).parents('li').get(0));
  }
});
