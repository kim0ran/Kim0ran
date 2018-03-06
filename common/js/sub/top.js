/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/

(function() {

  var global = App.global;
  var fn = App.fn;
  var ui = App.ui;
  var utils = App.utils;
  var views = App.views;

  /* グローバル変数 */
  global.sectionOffsetArray = [];  // 各セクション位置配列
  global.scrollAdjustHeight = 0;  // スクロール時調整用の高さ

  /**
   * ページビュー
   */
  var PageView = (function() {
    var constructor = function(el) {
      this.$section = {};
      this.headerView = {};
      this.globalNavView = {};
      this.footerView = {};
      this.modalView = {};
      this.init(el);
      return this;
    };
    var proto = constructor.prototype = new views.PageView();
    proto.init = function(el) {
      views.PageView.prototype.init.apply(this, [el]);
      this.setCustomEvents();
      return this;
    };
    proto.setEl = function(el) {
      views.PageView.prototype.setEl.apply(this, [el]);
      this.$section = this.$el.find('.section');
      this.$btnModalOpen = this.$el.find('.js-modalBtnOpen');
      return this;
    };
    proto.onLoadFunction = function() {

      /* プリローダー */
      var preloader = ui.preloader();
      preloader.init({ el: '.js-loader' });
      //$('.js-loader').hide();

      /* 子要素の高さを合わせる */
      utils.matchHeight('.js-matchHeight');

      this.getSectionOffsetArray();
      this.setSectionViewInstance();
      return this;
    };
    proto.getSectionOffsetArray = function() {
      var that = this;
      global.scrollAdjustHeight = Math.floor($(window).height()/2);
      var sectionOffsetArray = [];
      this.$section.each(function() {
        sectionOffsetArray.push($(this).offset().top);
      });
      sectionOffsetArray.push(sectionOffsetArray[sectionOffsetArray.length-1] + this.$section.eq(this.$section.length-1).outerHeight());
      global.sectionOffsetArray = sectionOffsetArray;
      return this;
    };
    proto.setChildViewInstance = function() {

      /* ヘッダ */
      this.headerView = new HeaderView();
      this.headerView.init({ el: '#HeaderView' });

      /* グローバルナビ */
      this.globalNavView = new GlobalNavView();
      this.globalNavView.init({ el: '#GlobalNavView' });

      /* フッタ */
      this.footerView = new FooterView();
      this.footerView.parentViewEl = this.$el;
      this.footerView.init({ el: '#FooterView' });

      /* モーダル */
      this.modalView = new views.ModalView();
      this.modalView.parentViewEl = this.$el;
      this.modalView.init({ el: '#ModalView'});

      return this;
    };
    proto.setSectionViewInstance = function() {

      /* プロフィール */
      var profileView = new ProfileView();
      profileView.init({ el: '#ProfileView' });

      /* コンセプト */
      var conceptView = new ConceptView();
      conceptView.init({ el: '#ConceptView' });

      /* ギャラリー */
      var galleryView = new GalleryView();
      galleryView.init({ el: '#GalleryView' });

      /* ブログ */
      var blogView = new BlogView();
      blogView.init({ el: '#BlogView' });

      /* お問い合わせ */
      var contactView = new ContactView();
      contactView.init({ el: '#ContactView' });

      return this;
    };
    proto.setEvents = function() {
      views.PageView.prototype.setEvents.apply(this);
      var that = this;
      this.$btnModalOpen.on('click', function() {
        that.modalView.onClickBtnOpen($(this).data('target'));
      });
      return this;
    };
    proto.onScroll = function(scrollTop) {
      this.isAnimate = true;
      this.globalNavView.onScroll(scrollTop);
      this.footerView.onScroll(scrollTop);
      return this;
    };
    proto.onResize = function() {
      this.headerView.onResize();
      this.globalNavView.onResize();
      this.footerView.onResize();
      return this;
    };
    proto.setCustomEvents = function() {
      var that = this;
      this.$el.on('onClickBtnModalOpenTrigger', function(e, target) {
        that.onClickBtnModalOpenTrigger(target);
      });
      return this;
    };
    proto.onClickBtnModalOpenTrigger = function(target) {
      this.modalView.onClickBtnOpen($(target).data('target'));
      return this;
    };
    return constructor;
  })();

  /**
   * ヘッダ
   */
  var HeaderView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.onLoadFunction = function() {
      this.setStyle();
      return this;
    };
    proto.setStyle = function() {
      this.$el.css({ height: $(window).height() });
      return this;
    };
    proto.onResize = function() {
      this.setStyle();
      return this;
    };
    return constructor;
  })();

  /**
   * グローバルナビ
   */
  var GlobalNavView = (function() {
    var constructor = function() {
      this.$header = {};
      this.$list = {};
      this.$listChild = {};
      this.$anchor = {};
      this.$btnSlideToggle = {};
      this.elHeight = 0;
      this.positionTop = 0;
      this.classNavCurrent = 'current';
      this.slideSpeed = 500;
      this.isAnimate = false;
      this.isOpen = false;
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$header = this.$el.find('.js-globalNavHeader');
      this.$list = this.$el.find('.js-globalNavList');
      this.$nav = this.$el.find('.globalNav-nav-list');
      this.$navChild = this.$nav.children();
      this.$anchor = this.$el.find('a[href^="#"]');
      this.$btnSlideToggle = this.$el.find('.js-globalNavBtn');
      return this;
    };
    proto.onLoadFunction = function() {
      this.setStyle();
      this.showEl();
      return this;
    };
    proto.setStyle = function() {
      this.elHeight = this.$el.outerHeight();
      this.positionTop = $(window).height() - this.elHeight;
      this.$el.css({ top: fn.isMediaSp() ? 0 : this.positionTop });
      return this;
    };
    proto.showEl = function() {
      if(fn.isMediaSp()) {
        this.$list.hide();
      } else {
        this.$list.show();
      }
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$el.on('click', function() {
        if(!that.isAnimate) {
          that.animateSlideNav();
          that.isAnimate = false;
        }
      });
      this.$btnSlideToggle.on('click', function(e) {
        e.stopPropagation();
        if(!that.isAnimate) {
          that.animateSlideNav();
          that.isAnimate = false;
        }
      });
      this.$nav.on('click', function(e) {
        e.stopPropagation();
      });
      this.$anchor.on('click', function() {
        if(!that.isAnimate) {
          that.animateSlideNav();
          that.isAnimate = false;
        }
      });
      return this;
    };
    proto.animateSlideNav = function() {
      this.isAnimate = true;
      if(!this.isOpen) {
        this.animateSlideOpen();
      } else {
        this.animateSlideClose();
      }
      return this;
    };
    proto.animateSlideOpen = function() {
      this.$el.addClass('active');
      this.$list.slideDown(this.slideSpeed);
      var windowHeight = window.innerHeight ? window.innerHeight: $(window).height();
      this.$el.css({ height: windowHeight });
      this.isOpen = true;
      return this;
    };
    proto.animateSlideClose = function() {
      var that = this;
      this.$list.slideUp(this.slideSpeed, function() {
        that.$el.removeClass('active');
      });
      this.$el.css({ height: 'auto' });
      this.isOpen = false;
      return this;
    };
    proto.onScroll = function(scrollTop) {
      this.setElPosition(scrollTop);
      this.setClassCurrent(scrollTop);
      if(fn.isMediaSp() && this.isOpen) {
        if(!this.isAnimate) {
          this.animateSlideNav();
          this.isAnimate = false;
        }
      }
      return this;
    };
    proto.setElPosition = function(scrollTop) {
      if(scrollTop > $(window).height() - this.elHeight) {
        this.$el.addClass('fixed');
        this.$el.css({ top: 0 });
      } else {
        this.$el.removeClass('fixed');
        this.$el.css({ top: fn.isMediaSp() ? 0 : this.positionTop });
      }
      return this;
    };
    proto.setClassCurrent = function(scrollTop) {
      this.$nav.find('.' + this.classNavCurrent).removeClass(this.classNavCurrent);
      scrollTop = scrollTop + global.scrollAdjustHeight;
      for(var i=0; i<global.sectionOffsetArray.length; i++) {
        if(scrollTop > global.sectionOffsetArray[i] && scrollTop < global.sectionOffsetArray[i+1]) {
          this.$navChild.eq(i).addClass(this.classNavCurrent);
          break;
        }
      }
      return this;
    };
    proto.onResize = function() {
      this.setStyle();
      this.showEl();
      return this;
    };
    return constructor;
  })();

  /**
   * フッタ
   */
  var FooterView = (function() {
    var constructor = function() {
      this.$snsList = {};
      this.$snsListIcon = {};
      this.$nsListText = {};
      this.classSnsListText = '.js-snsListText';
      this.$btnPagetop = {};
      this.collection = [];
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$snsList = this.$el.find('.js-snsList');
      this.$snsListText = this.$el.find(this.classSnsListText);
      this.$btnPagetop = this.$el.find('.js-btnPagetop');
      return this;
    };
    proto.onLoadFunction = function() {
      if(!fn.isMediaSp()) {
        this.$btnPagetop.hide();
      }
      this.getFeed();
      return this;
    };
    proto.getFeed = function() {
      var that = this;
      $.ajax({
        type: 'get',
        url: "./common/data/sns.json",
        dataType: 'json',
      }).done(function(data) {
        that.collection = data.sns;
        that.render();
      }).fail(function() {
        that.error('データが取得できませんでした');
      });
      return this;
    };
    proto.render = function() {
      var that = this;
      var tmpl = [];
      for(var i=0; i<this.collection.length;i++) {
        var model = this.collection[i];
        if(model.flg > 0) {
          if(model.url !== '') {
            tmpl.push('<li><a href="' + model.url + '" class="icon-' + model.id + '">' + model.name + '</a></li>');
          } else {
            tmpl.push('<li><span class="icon-' + model.id + ' js-modalBtnOpen" data-target="' + this.classSnsListText + '" data-message="' + model.message + '">' + model.name + '</span></li>');
          }
        }
      }
      this.$snsList.append(tmpl.join('')).promise().done(function() {
        that.$snsListIcon = that.$snsList.find('span');
        that.setOnRenderEvents();
      });
      return this;
    };
    proto.setOnRenderEvents = function() {
      var that = this;
      this.$snsListIcon.on('click', function() {
        that.onClickSnsListIcon(this);
      });
      return this;
    };
    proto.onClickSnsListIcon = function(target) {
      this.$snsListText.html('<p class="">' + $(target).data('message') + '</p>');
      this.parentViewEl.trigger('onClickBtnModalOpenTrigger', target);
      return this;
    };
    proto.onScroll = function(scrollTop) {
      if(!fn.isMediaSp()) {
        if(scrollTop > $(window).height() *1.5) {
          this.$btnPagetop.fadeIn();
        } else {
          this.$btnPagetop.fadeOut();
        }
      }
      return this;
    };
    proto.onResize = function(scrollTop) {
      if(fn.isMediaSp()) {
        this.$btnPagetop.show();
      }
      return this;
    };
    return constructor;
  })();

  /**
   * セクション
   */
  var SectionView = (function() {
    var constructor = function() {
      this.$inner = {};
      this.offsetTop = 0;
      this.offsetBottom = 0;
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$inner = this.$el.find('.inner');
      return this;
    };
    proto.onLoadFunction = function() {
      this.getElOffset();
      this.setStyle();
      return this;
    };
    proto.getElOffset = function() {
      var index = 0;
      var top = this.$el.offset().top;
      for(var i=0; i<global.sectionOffsetArray.length; i++) {
        if(top === global.sectionOffsetArray[i]) {
          index = i;
          break;
        }
      }
      this.offsetTop = global.sectionOffsetArray[index] - global.scrollAdjustHeight;
      this.offsetBottom = global.sectionOffsetArray[index+1] - global.scrollAdjustHeight;
      return this;
    };
    proto.setStyle = function() {
      this.$inner.css({
        position: 'relative',
        top: 20,
        opacity: 0
      });
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      $(window).on('scroll', function() {
        that.onScroll($(window).scrollTop());
      });
      return this;
    };
    proto.onScroll = function(scrollTop) {
      if(scrollTop > this.offsetTop && scrollTop < this.offsetBottom) {
        this.$inner.animate({
          top: 0,
          opacity: 1
        });
      }
      return this;
    };
    return constructor;
  })();

  /**
   * プロフィール
   */
  var ProfileView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    proto.onLoadFunction = function() {

      /* 切り替えコンテンツ */
      var switchView = new ui.switchView();
      switchView.init({ el: '.js-switchView' });

      SectionView.prototype.onLoadFunction.apply(this);
      return this;
    };
    return constructor;
  })();

  /**
   * コンセプト
   */
  var ConceptView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /**
   * ギャラリー
   */
  var GalleryView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    proto.onLoadFunction = function() {

      /* カルーセル */
      var carouselView = new ui.CarouselView();
      carouselView.init({ el: '.js-carousel' });

      SectionView.prototype.onLoadFunction.apply(this);
      return this;
    };
    return constructor;
  })();

  /**
   * ブログ
   */
  var BlogView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /**
   * お問い合わせ
   */
  var ContactView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /* ページ */
  new PageView('#PageView');

})();
