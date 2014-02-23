module.exports = function(params, callback) {
  'use strict';

  var assemble = params.assemble;
  var grunt    = params.grunt;
  var options  = assemble.options;
  var pages    = options.pages;

  var allpages = [];
  var allnews = [];

  for (var i = 0; i < pages.length; i++) {
    allpages.push(pages[i].data.permalink);
    if (pages[i].src.slice(0, 11) === 'posts/news/') {
      allnews.push({
        title: pages[i].data.title,
        permalink: pages[i].data.permalink,
        date: pages[i].data.date
      });
    }
  }

  var all_pages = grunt.config('assemble.options.all_pages');
  if (!all_pages || typeof(all_pages) !== 'object') all_pages = [];
  all_pages = all_pages.concat(allpages);
  grunt.config('assemble.options.all_pages', all_pages);

  var all_news = grunt.config('assemble.options.all_news');
  if (!all_news || typeof(all_news) !== 'object') all_news = [];
  all_news = all_news.concat(allnews);
  grunt.config('assemble.options.all_news', all_news);

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
