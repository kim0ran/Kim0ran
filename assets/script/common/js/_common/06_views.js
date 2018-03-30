(function(app, window, decument, undefined) {

  /**
   * ページ
   */
  app.views.PageView = (function() {
    var constructor = function(el) {
      this.$el = {};
      this.$anchor = {};
      this.globalNavView = {};
      this.isAnimate = false;
      this.scrollSpeed = 500;
      this.init(el);
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(el) {
      this.setEl(el);
      this.setChildViewInstance();
      this.setEvents();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      this.$anchor = this.$el.find('a[href^="#"]');
      return this;
    };
    proto.setChildViewInstance = function() {

      /* グローバルナビ */
      this.globalNavView = new app.views.GlobalNavView();
      this.globalNavView.parentViewEl = this.$el;
      this.globalNavView.init({ el: '#GlobalNavView' });

      /* フッタ */
      this.footerView = new app.views.FooterView();
      this.footerView.init({ el: '#FooterView' });

      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$anchor.on('click', function(e) {
        e.preventDefault();
        if(!that.isAnimate) {
          that.smoothScroll($(this).attr('href'));
        }
        return false;
      });
      $(window).on('scroll', function() {
        if(!that.isAnimate) {
          that.onScroll($(window).scrollTop());
          that.isAnimate = false;
        }
      });
      $(window).on('resize', function() {
        if(!that.isAnimate) {
          that.onResize();
          that.isAnimate = false;
        }
      });
      return this;
    };
    proto.smoothScroll = function(href) {
      var $target = $(href === '#' || href === '' ? 'html' : href);
      if($target.length > 0) {
        var position = $target.offset().top;
        $('html, body').animate({
          scrollTop: position
        }, this.scrollSpeed, 'swing');
      }
      return this;
    };
    proto.onScroll = function(scrollTop) {
      this.isAnimate = true;
      this.globalNavView.onScroll(scrollTop);
      this.footerView.onScroll(scrollTop);
      return this;
    };
    proto.onResize = function() {
      this.isAnimate = true;
      this.globalNavView.onResize();
      this.footerView.onResize();
      return this;
    };
    return constructor;
  })();

  /**
   * グローバルナビ
   */
  app.views.GlobalNavView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$navListEl = {};
      this.$navAnchorEl = {};
      this.$toggleTriggerEl = {};
      this.classOpened = 'active';
      this.isAnimate = false;
      this.isOpen = false;
      this.offsetTopOpened = 0;
      this.speed = 500;
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args.el);
      this.setStyle();
      this.setEvents();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      this.$navListEl = this.$el.find('.js-globalNavList');
      this.$navAnchorEl = this.$navListEl.find('a');
      this.$toggleTriggerEl = $('.js-globalNavToggleTrigger');
      return this;
    };
    proto.setStyle = function() {
      if(app.fn.isMediaSp()) {
        this.$navListEl.hide();
        this.$el.css({
          top: 0
        });
      } else {
        this.$navListEl.show();
        this.$el.css({
          top: $(window).outerHeight() - this.$el.outerHeight()
        });
      }
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$toggleTriggerEl.on('click', function() {
        that.onClickToggleTrigger();
      });
      this.$el.on('click', function() {
        that.onClickToggleTrigger();
      });
      this.$el.children().on('click', function(e) {
        e.stopPropagation();
      });
      this.$navAnchorEl.on('click', function() {
        if(app.fn.isMediaSp()) {
          that.onClickToggleTrigger();
        }
      });
      return this;
    };
    proto.onClickToggleTrigger = function() {
      if(!this.isAnimate) {
        if(this.isOpen) {
          this.animateCloseNav();
        } else {
          this.animateOpenNav();
        }
        this.isAnimate = false;
      }
      return this;
    };
    proto.animateOpenNav = function() {
      var that = this;
      this.isAnimate = true;
      this.offsetTopOpened = $(window).scrollTop();
      this.parentViewEl.css({
        position: 'fixed',
        top: -this.offsetTopOpened,
        width: '100%'
      });
      this.$el.addClass(this.classOpened);
      this.$navListEl.slideToggle(this.speed, function() {
        that.isOpen = true;
      });
      return this;
    };
    proto.animateCloseNav = function() {
      var that = this;
      this.isAnimate = true;
      this.parentViewEl.css({
        position: 'static',
        top: 'auto',
        width: 'auto'
      });
      $(window).scrollTop(this.offsetTopOpened);
      this.$navListEl.slideToggle(this.speed, function() {
        that.$el.removeClass(that.classOpened);
        that.isOpen = false;
      });
      return this;
    };
    proto.onScroll = function(scrollTop) {
      if(!app.fn.isMediaSp()) {
        if($(window).outerHeight()-this.$el.outerHeight()< scrollTop) {
          this.$el.css({
            position: 'fixed',
            top: 0
          });
        } else {
          this.$el.css({
            position: 'absolute',
            top: $(window).outerHeight() - this.$el.outerHeight()
          });
        }
      }
      return this;
    };
    proto.onResize = function() {
      this.resetStyle();
      this.setStyle();
      return this;
    };
    proto.resetStyle = function() {
      if(!app.fn.isMediaSp()) {
        this.$el.removeClass(this.classOpened);
        this.parentViewEl.css({
          position: 'static',
          top: 'auto',
          width: 'auto'
        });
        this.isOpen = false;
      }
      return this;
    };
    return constructor;
  })();

  /**
   * フッタ
   */
  app.views.FooterView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$btnPagetop = {};
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args.el);
      this.setStyle();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      this.$btnPagetop = this.$el.find('.js-btnPagetop');
      return this;
    };
    proto.setStyle = function() {
      if(!app.fn.isMediaSp()) {
        this.$btnPagetop.hide();
      } else {
        this.$btnPagetop.show();
      }
      return this;
    };
    proto.onScroll = function(scrollTop) {
      if(!app.fn.isMediaSp()) {
        if($(window).outerHeight()*1.5 < scrollTop) {
          this.$btnPagetop.fadeIn();
        } else {
          this.$btnPagetop.fadeOut();
        }
      }
      return this;
    };
    proto.onResize = function() {
      this.setStyle();
      return this;
    };
    return constructor;
  })();

  /**
   * モーダル
   */
  app.views.ModalView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$triggerCloseEl = {};
      this.$triggerOpenEl = {};
      this.isOpen = false;
      this.isAnimate = false;
      this.$pageEl = {};
      this.scrollTopOpened = 0;
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args);
      this.setStyle();
      this.setEvents();
      return this;
    };
    proto.setStyle = function() {
      this.$el.hide();
      return this;
    };
    proto.setEl = function(args) {
      this.$el = $(args.el);
      this.$triggerCloseEl = this.$el.find('.js-modalBtnClose');
      this.$triggerOpenEl = $(args.triggerOpenEl);
      this.$pageEl = $('.page');
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$triggerOpenEl.on('click', function() {
        that.onEventOpenModal();
      });
      this.$triggerCloseEl.on('click', function() {
        that.onEventCloseModal();
      });
      return this;
    };
    proto.onEventOpenModal = function() {
      if(!this.isAnimate) {
        this.openModal();
        this.isAnimate = false;
      }
      return this;
    };
    proto.onEventCloseModal = function() {
      if(!this.isAnimate) {
        this.closeModal();
        this.isAnimate = false;
      }
      return this;
    };
    proto.openModal = function() {
      this.isAnimate = true;
      this.scrollTopOpened = $(window).scrollTop();
      this.$pageEl.css({
        position: 'fixed',
        top: -this.scrollTopOpened,
        width: '100%'
      });
      this.$el.fadeIn();
      return this;
    };
    proto.closeModal = function() {
      this.isAnimate = true;
      this.$el.fadeOut();
      this.$pageEl.css({
        position: 'static',
        top: 'auto',
        width: 'auto'
      });
      $(window).scrollTop(this.scrollTopOpened);
      return this;
    };
    return constructor;
  })();

})(App, window, document);