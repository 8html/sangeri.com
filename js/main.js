$(function() {
  var menu = $('.menu').first();
  menu.find('.mi').hover(function() {
    menu.find('.menu-p a').removeClass('active');
    menu.find('.menu-c .ms').addClass('hidden');
    var index = $(this).index();
    menu.find('.menu-p a').eq(index).addClass('active');
    menu.find('.menu-c .ms-' + (index + 1)).removeClass('hidden');
  });
});
