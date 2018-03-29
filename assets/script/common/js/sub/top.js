$(function() {

  var global = App.global;
  var fn = App.fn;
  var ui = App.ui;
  var utils = App.utils;
  var views = App.views;

  /**
   * インスタンス
   */
  var viewsInstance = function() {

    /* ギャラリー */
    var galleryView = new GalleryView();
    galleryView.init({ el: '#GalleryView' });

    /* プロフィール */
    var profileView = new ProfileView();
    profileView.init({ el: '#ProfileView' });

    /* お問い合わせ */
    var contactView = new ContactView();
    contactView.init({ el: '#ContactView' });

  };

  /**
   * ギャラリー
   */
  var GalleryView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$carousel = {};
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args.el);
      this.setSlick();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      this.$carousel = this.$el.find('.js-galleryCarousel');
      return this;
    };
    proto.setSlick = function() {
      this.$carousel.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        centerPadding: '10%'
      });
      return this;
    };
    return constructor;
  })();

  /**
   * プロフィール
   */
  var ProfileView = (function() {
    var constructor = function() {
      this.$el = {};
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args.el);
      this.setChildViewInstance();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      return this;
    };
    proto.setChildViewInstance = function() {

      /* 詳細 */
      var detailProfile = new ui.switchView();
      detailProfile.init({ el: '.js-detailProfile' });

      return this;
    };
    return constructor;
  })();

  /**
   * お問い合わせ
   */
  var ContactView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$form = {};
      this.$formInput = {};
      this.$btnConfirm = {};
      this.contactModalView = {};
      return this;
    };
    var proto = constructor.prototype;
    proto.init = function(args) {
      this.setEl(args.el);
      this.setChildViewInstance();
      this.setEvents();
      return this;
    };
    proto.setEl = function(el) {
      this.$el = $(el);
      this.$form = this.$el.find('.form');
      this.$formInput = this.$form.find('input, textarea');
      this.$btnConfirm = this.$el.find('.js-contactBtnConfirm');
      return this;
    };
    proto.setChildViewInstance = function() {

      /* お問い合わせモーダル */
      this.contactModalView = new ContactModalView();
      this.contactModalView.parentViewEl = this.$el;
      this.contactModalView.init({ el: '.js-contactModal' });

      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$btnConfirm.on('click', function() {
        that.onClickBtnConfirm();
      });
      return this;
    };
    proto.onClickBtnConfirm = function() {
      if(0 === this.$form.find('.error').length) {
        this.contactModalView.setInputValue(this.loadFormValue());
      }
      return this;
    };
    proto.loadFormValue = function() {
      var nameObj = {};
      // this.$formInput.each(function() {
      //   var $input = $(this);
      //   var val = $input.val();
      //   var array = [];
      //   array[$input.attr('name')] = val;
      //   $.extand(nameObj, array);
      // });
      return nameObj;
    };
    return constructor;
  })();

  /**
   * お問い合わせモーダル
   */
  var ContactModalView = (function() {
    var constructor = function() {
      this.$form = {};
      return this;
    };
    var proto = constructor.prototype = new views.ModalView();
    proto.setEl = function(args) {
      views.ModalView.prototype.setEl.apply(this, [args]);
      this.$form = this.$el.find('form');
      return this;
    };
    proto.setInputValue = function(valArray) {
      var that = this;
      for(var i=0; i<valArray.length; i++) {
        this.$form.find('input[name="' + i + '"]').val(valArray[i]);
      }
      this.onEventOpenModal();
      return this;
    };
    return constructor;
  })();


  /* インスタンス */
  $(window).load(function() {
    viewsInstance();
  });

});