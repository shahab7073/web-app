/* 
* 
* Cards
* 
*/
!function($) {
  "use strict";
  
  var Card = function(element, options) {
    this.options      = options;
    this.$card        = $(element);
    this.$closeBtn    = this.$card.find('> .title > .close');
    this.$minimizeBtn = this.$card.find('> .title > .minimize');
    this.$content     = this.$card.find('> .content');
    this.$window      = $(window);
  };

  Card.DEFAULTS = {
    // duration of all animations
    duration: 300
  };

  // init card
  Card.prototype.init = function() {
    var _this = this;

    // Remove card
    _this.$closeBtn.on('click', function(e) {
      e.preventDefault();
      _this.close();
    });

    // Minimize card
    _this.$minimizeBtn.on('click', function(e) {
      e.preventDefault();
      _this.minimize();
    });
  }

  // cloase card
  Card.prototype.close = function() {
    var _this = this;

    // remove animation
    _this.$card.velocity({
      opacity: 0,
      translateY: -20
    }, _this.options.duration )
    
    .velocity('slideUp', _this.options.duration, function() {
      _this.$card.remove();
    });
  }

  // minimize card
  Card.prototype.minimize = function() {
    var _this = this;

    if(_this.$card.hasClass('minimized')) {
      _this.$content
        .css('display', 'none')
        .velocity('slideDown', 'swing', _this.options.duration);
    } else {
      _this.$content
        .css('display', 'block')
        .velocity('slideUp', 'swing', _this.options.duration);
    }

    _this.$card.toggleClass('minimized');

    // resize for nano scroller and charts
    _this.$window.resize();
  }



  // init
  conApp.initCards = function() {
    $('.card').each(function() {
      var options = $.extend({}, Card.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curCard = new Card(this, options);

      // call init
      curCard.init();
    });
  }
  
  if(typeof conAngular === 'undefined') {
    conApp.initCards();
  }

}(jQuery);