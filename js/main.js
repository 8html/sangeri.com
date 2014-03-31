$(function() {
  var menu = $('.menu').first();
  var initial = 12;
  menu.find('.mi').hover(function(e) {
    menu.find('.menu-p a').removeClass('active');
    menu.find('.menu-c .ms').addClass('hidden');
    var index = $(this).parent().children('.mi').index($(this));
    menu.find('.menu-p a').eq(index).addClass('active');
    var panel = menu.find('.menu-c .ms-' + (index + 1));
    if (panel.length) {
      $('.showifpanelshows').removeClass('hidden');
      $('.hideifpanelshows').addClass('hidden');
    } else {
      $('.showifpanelshows').addClass('hidden');
      $('.hideifpanelshows').removeClass('hidden');
    }
    panel.removeClass('hidden');
    var totalwidth = 0;
    var panel_a = panel.find('a');
    panel_a.map(function() { totalwidth += $(this).width(); });
    var maxwidth = panel.width();
    var center = $(this).position().left + $(this).width() / 2;
    var left = center - (totalwidth / 2);
    var offset = 28;
    left -= offset;
    if (left + totalwidth > maxwidth) left = maxwidth - totalwidth;
    if (left < 0) left = 0;
    panel_a.first().css({ 'margin-left': left });
    if (!e.originalEvent || $(e.relatedTarget).is('.menu-p') || $(e.relatedTarget).is('.ms')) {
      return;
    }
    panel_a.css({ 'margin-top': menu.find('.menu-c .ms').height(), opacity: 0 });
    panel_a.each(function(a, b) {
      $(b).delay(a * 100).animate({ 'margin-top': initial, opacity: 1 }, 400);
    });
  }, function() {

  });
  $('#hidemenu').click(function(e) {
    e.preventDefault();
    menu.find('.menu-c .ms').addClass('hidden');
    $('.showifpanelshows').addClass('hidden');
    $('.hideifpanelshows').removeClass('hidden');
  });
  menu.find('.mi .mi-c a.active').trigger('mouseover')
  $('.hompage-slider').sliderkit({
    auto: true,
    circular: true,
    panelfx: 'sliding',
    panelfxspeed: 1000
  });
  $(".ip-slider").sliderkit({
    auto: true,
    autospeed: 5000,
    circular: true,
    // panelfx: 'sliding',
    shownavitems: 9
  });
  $('.addfav').click(function(e) {
    e.preventDefault();
    var url = 'http://www.sangeri.com/'
    var title = document.title || '香格伊';
    try {
      window.external.addFavorite(url, title);
    } catch(e) {
      try {
        window.sidebar.addPanel(title, url, '');
      } catch (e) {
        alert('请按Ctrl+D将本网站添加到你的浏览器收藏夹。');
      }
    }
  })
});
