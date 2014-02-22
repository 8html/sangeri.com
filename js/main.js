$(function() {
  var menu = $('.menu').first();
  menu.find('.mi').hover(function() {
    menu.find('.menu-p a').removeClass('active');
    menu.find('.menu-c .ms').addClass('hidden');
    var index = $(this).index();
    menu.find('.menu-p a').eq(index).addClass('active');
    var panel = menu.find('.menu-c .ms-' + (index + 1));
    panel.removeClass('hidden');
    var totalwidth = 0;
    panel.find('a').map(function() { totalwidth += $(this).width(); })
    var maxwidth = panel.width();
    var center = $(this).position().left + $(this).width() / 2;
    var left = center - (totalwidth / 2);
    var offset = 28;
    left -= offset;
    if (left < 0) left = 0;
    if (left + totalwidth > maxwidth) left = maxwidth - totalwidth;
    panel.find('a:first').css({ 'margin-left': left });
  });
  $('.hompage-slider').sliderkit({
    auto: true,
    circular: true,
    panelfx: 'sliding',
    panelfxspeed: 1000
  });
  $(".ip-slider").sliderkit({
    auto: true,
    circular: true,
    shownavitems: 9
  });
});
