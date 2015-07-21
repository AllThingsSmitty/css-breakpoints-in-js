var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(
    document.querySelector('body'),
    ':before'
  ).getPropertyValue('content').replace(/\"|\'/g, '');
};

$(window).resize(function () {
  breakpoint.refreshValue();
  $('.breakpoint').html(breakpoint.value);
}).resize();
