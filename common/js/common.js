/*--------------------------------------------------------------------
 common.js
----------------------------------------------------------------------*/

(function(window, undefined) {

  var app = {
    global: {},
    fn: {},
    ui: {},
    utils: {},
    views: {}
  };
  window.App = app;

})(window);

(function(app, window, decument, undefined) {


/* global
------------------------------------------------------------*/

  app.global = {

  };


/* fn
------------------------------------------------------------*/

  app.fn = {

    /**
     * デバイス判定
     */
    isMediaSp: function() {
      return ($(window).width() > 640) ? false : true;
    }

  };


/* ui
------------------------------------------------------------*/

  app.ui = {

    /**
     * プリローダー
     */
    preloader: function() {
      var $el = {};
      var $loadbar = {};
      var loadbarSpeed = 1500;
      var fadeSpeed = 500;
      var callback = null;
      var isLoading = false;
      var init = function(args) {
        callback = args.callback || null;
        setEl(args.el);
        onLoadFunction();
        setEvents();
        return this;
      };
      var setEl = function(el) {
        $el = $(el);
        $loadbar = $el.find('.js-loadbar');
        return this;
      };
      var onLoadFunction = function() {
        isLoading = true;
        $el.show();
        $loadbar.width(0);
        pageLoading();
        return this;
      };
      var pageLoading = function() {
        $loadbar.animate({
          width: '30%'
        });
        $(window).load(function() {
          $loadbar.animate({
            width: '100%'
          }, loadbarSpeed, function() {
            onLoading();
          });
        });
        return this;
      };
      var onLoading = function() {
        $el.fadeOut(fadeSpeed, function() {
          if(callback !== null) {
            callback();
          }
          isLoading = false;
        });
        return this;
      };
      var setEvents = function() {
        $(window).on('scroll', function(e) {
          if(isLoading) {
            e.preventDefault();
            onScrollHidden();
          }
        });
        return this;
      };
      var onScrollHidden = function() {
        $(window).scrollTop(0);
        return this;
      };
      return { init: init };
    },

    /**
     * 切り替えコンテンツ
     */
    switchView: function() {
      var $el = {};
      var $nav = {};
      var $navChild = {};
      var $contents = {};
      var activeNum = 0;
      var classNavActive = 'active';
      var isAnimate = false;
      var init = function(args) {
        setEl(args.el);
        onLoadFunction();
        setEvents();
        return this;
      };
      var setEl = function(el) {
        $el = $(el);
        $nav = $el.find('.js-switchViewNav');
        $navChild = $nav.children();
        $contents = $el.find('.js-switchViewContents');
        return this;
      };
      var onLoadFunction = function() {
        $contents.hide();
        $contents.eq(activeNum).show();
        $navChild.eq(activeNum).addClass(classNavActive);
        return this;
      };
      var setEvents = function() {
        var that = this;
        $navChild.on('click', function() {
          if(!isAnimate) {
            onClickNav(this);
            isAnimate = false;
          }
        });
        return this;
      };
      var onClickNav = function(target) {
        isAnimate = true;
        $contents.eq(activeNum).fadeOut();
        $navChild.eq(activeNum).removeClass(classNavActive);
        activeNum = $(target).index();
        $contents.eq(activeNum).fadeIn();
        $navChild.eq(activeNum).addClass(classNavActive);
        return this;
      };
      return { init: init };
    },

    /**
     * カルーセル
     */
    CarouselView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$list = {};
        this.$btnPrev = {};
        this.$btnNext = {};
        this.itemLength = 0;
        this.slideWidth = 0;
        this.slideSpeed = 500;
        this.isShowNum = 0;
        this.isAnimate = false;
        this.touchStartX = 0;
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.setEl(args.el);
        this.onLoadFunction();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$inner = this.$el.find('.js-carouselInner');
        this.$list = this.$el.find('.js-carouselList');
        this.$item = this.$list.children();
        this.$btnPrev = this.$el.find('.js-carouselBtnPrev');
        this.$btnNext = this.$el.find('.js-carouselBtnNext');
        return this;
      };
      proto.onLoadFunction = function() {
        this.setStyle();
        this.checkShowControlBtn();
        return this;
      };
      proto.setStyle = function() {
        this.$item.css({
          width: this.$el.width(),
          opacity: 0.3
        });
        this.$inner.css({ height: this.$item.height() });
        this.$item.eq(this.isShowNum).css({ opacity: 1 });

        this.itemLength = this.$item.length;
        this.slideWidth = this.$item.outerWidth(true);

        this.$list.css({
          left: 0,
          width: this.slideWidth * this.itemLength
        });
        return this;
      };
      proto.checkShowControlBtn = function() {
        if(this.isShowNum === 0) {
          this.$btnPrev.hide();
        } else {
          this.$btnPrev.show();
        }
        if(this.isShowNum === this.itemLength-1) {
          this.$btnNext.hide();
        } else {
          this.$btnNext.show();
        }
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        this.$btnPrev.on('click', function() {
          if(!that.isAnimate) {
            that.onClickBtnPrev();
            that.isAnimate = false;
          }
        });
        this.$btnNext.on('click', function() {
          if(!that.isAnimate) {
            that.onClickBtnNext();
            that.isAnimate = false;
          }
        });
        this.$list.on('touchstart', function() {
          that.touchStartX = event.changedTouches[0].pageX;
        });
        this.$list.on('touchmove, touchend', function(e) {
          if(!that.isAnimate) {
            that.onTouchmoveList(e, event);
            that.isAnimate = false;
          }
        });
        $(window).on('resize', function() {
          that.onResize();
        });
        return this;
      };
      proto.onClickBtnPrev = function() {
        if(this.isShowNum !== 0) {
          this.isShowNum--;
          this.animateSlideList(this.isShowNum+1);
          this.checkShowControlBtn();
        }
        return this;
      };
      proto.onClickBtnNext = function() {
        if(this.isShowNum !== this.itemLength-1) {
          this.isShowNum++;
          this.animateSlideList(this.isShowNum-1);
          this.checkShowControlBtn();
        }
        return this;
      };
      proto.onTouchmoveList = function(e, event) {
        if(Math.round(this.touchStartX - event.changedTouches[0].pageX) > 0) {
          this.onClickBtnNext();
        } else {
          this.onClickBtnPrev();
        }
        return this;
      };
      proto.animateSlideList = function(isBeforeShowNum) {
        this.isAnimate = true;
        this.$list.animate({
          left: -(this.slideWidth * this.isShowNum)
        }, this.slideSpeed);
        this.$item.eq(isBeforeShowNum).animate({ opacity: 0.3 });
        this.$item.eq(this.isShowNum).animate({ opacity: 1 });
        return this;
      };
      proto.onResize = function() {
        this.setStyle();
        this.$list.css({ left: -(this.slideWidth * this.isShowNum) });
        return this;
      };
      return constructor;
    })()

  };


/* utils
------------------------------------------------------------*/

  app.utils = {

    /**
     * 子要素の高さを合わせる
     */
    matchHeight: function(el) {
      var $el = {};
      var $child = {};
      var maxHeight = 0;
      var init = function() {
        setEl();
        getHeight();
        setHeight();
        return this;
      };
      var setEl = function() {
        $el = $(el);
        $child = $el.children();
        return this;
      };
      var getHeight = function() {
        var array = [];
        $child.each(function() {
          array.push($(this).outerHeight());
        });
        array.sort(function(a, b) {
          if(a > b) return -1;
          if(a < b) return 1;
          return 0;
        });
        maxHeight = array[0];
        return this;
      };
      var setHeight = function() {
        $el.css({ height: maxHeight });
        return this;
      };
      init();
    }

  };


/* views
------------------------------------------------------------*/

  app.views = {

    /**
     * ベース
     */
    BaseView: (function() {
      var constructor = function() {
        this.$el = {};
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.setEl(args.el);
        this.onLoadFunction();
        this.setChildViewInstance();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        return this;
      };
      proto.onLoadFunction = function() {
        return this;
      };
      proto.setChildViewInstance = function() {
        return this;
      };
      proto.setEvents = function() {
        return this;
      };
      proto.error = function(str) {
        alert(str);
        return this;
      };
      return constructor;
    })(),

    /**
     * ページ
     */
    PageView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$anchor = {};
        this.isAnimate = false;
        this.scrollSpeed = 500;
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(el) {
        this.setEl(el);
        this.onLoadFunction();
        this.setChildViewInstance();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$anchor = this.$el.find('a[href^="#"]');
        return this;
      };
      proto.onLoadFunction = function() {
        return this;
      };
      proto.setChildViewInstance = function() {
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        $(window).on('scroll', function() {
          if(!that.isAnimate) {
            that.onScroll($(window).scrollTop());
            that.isAnimate = false;
          }
        });
        $(window).on('resize', function() {
          that.onResize();
        });
        this.$anchor.on('click', function(e) {
          e.preventDefault();
          if(!that.isAnimate) {
            that.smoothScroll($(this).attr('href'));
            that.isAnimate = false;
          }
        });
        return this;
      };
      proto.onScroll = function(scrollTop) {
        this.isAnimate = true;
        return this;
      };
      proto.onResize = function() {
        return this;
      };
      proto.smoothScroll = function(href) {
        this.isAnimate = true;
        var $target = $(href === '#' || href === '' ? 'html' : href);
        var position = $target.offset().top;
        $('html, body').animate({
          scrollTop: position
        }, this.scrollSpeed, 'swing');
        return this;
      };
      return constructor;
    })(),

    /**
     * モーダル
     */
    ModalView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$inner = {};
        this.$main = {};
        this.$btnClose = {};
        this.openWrapScrollTop = 0;
        this.fadeSpeed = 500;
        this.isAnimate = false;
        this.isOpen = false;
        this.callback = {};
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.isOpen = (args.isOpen !== undefined) ? args.isOpen : this.isOpen;
        this.callback = args.callback || undefined;
        this.setEl(args.el);
        this.onLoadFunction();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$inner = this.$el.find('.js-modalInner');
        this.$main = this.$el.find('.js-modalMain');
        this.$btnClose = this.$el.find('.js-modalBtnClose');
        return this;
      };
      proto.onLoadFunction = function() {
        this.$el.hide();
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        this.$btnClose.on('click', function() {
          that.onClickBtnClose();
        });
        this.$el.on('click', function() {
          that.onClickBtnClose();
        });
        this.$inner.on('click', function(e) {
          e.stopPropagation();
        });
        return this;
      };
      proto.onClickBtnOpen = function(cloneEl) {
        if(!this.isAnimate && $(cloneEl).length > 0) {
          this.openModal(cloneEl);
          this.isAnimate = false;
          this.isOpen = true;
        }
        return this;
      };
      proto.openModal = function(cloneEl) {
        var that = this;
        this.isAnimate = true;
        this.openWrapScrollTop = $(window).scrollTop();
        this.$main.append($(cloneEl).html()).promise().done(function() {
          that.onAppend(cloneEl);
        });
        this.parentViewEl.css({
          position: 'fixed',
          top: -this.openWrapScrollTop
        });
        return this;
      };
      proto.onAppend = function(cloneEl) {
        if(!App.fn.isMediaSp) {
          this.$inner.css({ width: $(cloneEl).data('width') || 'auto' });
        }
        this.$el.fadeIn(this.fadeSpeed);
        this.$inner.css({
          top: Math.ceil(($(window).height() - this.$inner.outerHeight())/2),
          left: Math.ceil(($(window).width() - this.$inner.outerWidth())/2)
        });
        if(this.callback !== undefined) {
          this.callback();
        }
        return this;
      };
      proto.onClickBtnClose = function() {
        if(!this.isAnimate) {
          this.closeModal();
          this.isAnimate = false;
          this.isOpen = false;
        }
        return this;
      };
      proto.closeModal = function() {
        var that = this;
        this.isAnimate = true;
        this.$el.fadeOut(this.fadeSpeed, function() {
          that.$main.children().remove();
        });
        this.parentViewEl.css({
          position: 'relative',
          top: 'auto'
        });
        $(window).scrollTop(this.openWrapScrollTop);
        return this;
      };
      return constructor;
    })()

  };

})(App, window, document);
