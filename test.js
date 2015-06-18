
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(
    document.querySelector('body'),
    ':before'
  ).getPropertyValue('content').replace(/\"/g, '');
};


$(window).resize(function () {
  breakpoint.refreshValue();
}).resize();


if (breakpoint.value == 'tablet') {
  console.log('Tablet breakpoint');
} else {
  console.log('Some other breakpoint');
}



/**
* Global: Get current CSS breakpoint
*/
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/"/g, '');
};

/**
* Pass the number of columns to leaderboardMoveHelper() to do all the work
*/
var leaderboardMove = function () {
  if (breakpoint.value == 'tablet_narrow') {
    leaderboardMoveHelper(2);
  }
  if ((breakpoint.value == 'tablet_wide') || (breakpoint.value == 'normal')) {
    leaderboardMoveHelper(3);
  }
  if (breakpoint.value == 'wide') {
    leaderboardMoveHelper(4);
  }
};

/**
* Move the leaderboard to the second row
*/
var leaderboardMoveHelper = function (columns) {
  var $tileView = $('.tile-container', context),
    $leaderboard = $('.ad-leaderboard.processed', $tileView),
    // Move the leaderboard
    $('.tile:nth-child(' + (columns + 1) + ')', $tileView).after($leaderboard);
    // Indicate it's moved
  $leaderboard.addClass('js-leaderboard-processed');
  $tileView.addClass('js-leaderboard-processed');
};

/**
* Execute
*/
$(window).resize(function () {
  breakpoint.refreshValue();
  leaderboardMove();
}).resize();