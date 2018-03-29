(function(app, window, decument, undefined) {

  app.ui = {

    /**
     * 切り替えコンテンツ
     */
    switchView: function() {
      var $el = {};
      var $nav = {};
      var $navChild = {};
      var $contents = {};
      var $contentsChild = {};
      var maxHeight = 0;
      var classActive = 'active';
      var numActive = 0;
      var init = function(args) {
        numActive = args.numActive || numActive;
        setEl(args.el);
        setStyle();
        setEvents();
        return this;
      };
      var setEl = function(el) {
        $el = $(el);
        $nav = $el.find('.js-switchViewNav');
        $navChild = $nav.children();
        $contents = $el.find('.js-switchViewContents');
        $contentsChild = $contents.children();
        return this;
      };
      var setStyle = function() {
        $contentsChild.each(function(i) {
          var $content = $(this);
          var height = $content.outerHeight();
          if(maxHeight < height) {
            maxHeight = height;
          }
          if(i !== numActive) {
            $content.hide();
          }
        });
        $contents.css({ height: maxHeight });
        return this;
      };
      var setEvents = function() {
        $navChild.on('click', function() {
          switchContent($(this).index());
        });
        return this;
      };
      var switchContent = function(num) {
        $navChild.eq(numActive).removeClass(classActive);
        $contentsChild.eq(numActive).fadeOut();
        $navChild.eq(num).addClass(classActive);
        $contentsChild.eq(num).fadeIn();
        numActive = num;
        return this;
      };
      return { init: init };
    }


  };

})(App, window, document);