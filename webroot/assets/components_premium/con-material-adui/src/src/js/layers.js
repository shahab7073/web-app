/* 
* 
* Open Layers with ripple effect
* 
* Usage:

  // Init layer
  var myLayer = $('.myLayer');

  // Init layer
  myLayer.MDLayer({
    duration: 400
  });

  // toggle layer
  $('.myLayer-toggle').on('click', function() {
    myLayer.MDLayer();
  });

  // hide layer
  $('.myLayer-hide').on('click', function() {
    myLayer.MDLayer('hide');
  });

  // show layer
  $('.myLayer-show').on('click', function() {
    myLayer.MDLayer('show');
  });
*/
!function($) {
  "use strict";
  
  var Layer = function(element, options) {
    this.options     = options;
    this.$body       = $('body');
    this.$navbar     = $('.navbar-top:eq(0)');
    this.$layer      = $(element);
    this.$overlay    = this.$layer.find('> .layer-overlay');
    this.$content    = this.$layer.find('> .layer-content');

    // duration and delay for content show / hide
    this.contDuration = this.options.duration * 0.8;

    // if layer currently opened (will change)
    this.isOpened    = this.$layer.hasClass('layer-opened');

    // when animation plays busy = true (will change)
    this.busy        = false;

    // start styles for layer (will change)
    this.startStyles = { left: 0, top: 0, width: 0, height: 0, marginTop: 0, marginLeft: 0 };

    // check if SVG supported
    this.useSVG      = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && !/^((?!chrome).)*safari/i.test(navigator.userAgent);

    // start init (apply styles)
    this.init();
  };

  Layer.DEFAULTS = {
    duration: 600,
    fixScrollbar: false,

    // call after end animation
    onhide: false,
    onshow: false
  };

  Layer.prototype.init = function() {
    var _this = this;

    if( _this.useSVG ) {
      _this.prepareSVG();
    } else {
      _this.$overlay.css({
        position: 'absolute',
        borderRadius: '50%',
        zIndex: 0
      });
    }

    // hide content background
    if(this.$content[0]) {
      this.$content[0].style.background = 'none';
    }

    _this.$content.css({
      zIndex: 2
    });
  }


  // create svg object to animate it
  Layer.prototype.prepareSVG = function() {
    var color = this.$overlay.css('background-color');

    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
        '<g><circle cx="0" cy="0" r="0" fill="'+color+'"></circle></g>',
      '</svg>'
    ].join('');

    this.$overlay.css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'none',
      zIndex: 0,
      transform: 'scale(1)'
    }).html( svg );

    if(this.$overlay[0]) {
      this.$overlay[0].style.background = 'none';
    }
  }


  // set circle start position and size
  Layer.prototype.setPosition = function( item ) {
    if( this.useSVG ) {
      item.find('g').attr({
        transform: 'translate('+this.startStyles.left+', '+this.startStyles.top+')'
      })

      item = item.find('circle');
      item.attr({
        r: this.startStyles.radius
      });
    } else {
      item.css({
        left: this.startStyles.left,
        top: this.startStyles.top,
        width: this.startStyles.radius * 2,
        height: this.startStyles.radius * 2,
        marginTop: - this.startStyles.radius,
        marginLeft: - this.startStyles.radius
      })
    }

    return item;
  }

  // show or hide layer
  // @type = ['show', 'hide']
  Layer.prototype.toggle = function(type) {
    if(
      this.busy ||
      (type == 'show' && this.isOpened) ||
      (type == 'hide' && !this.isOpened)
      ) {
      return false;
    }

    this.busy = true;

    this.calculateStartStyles();

    if(this.isOpened) {
      this.hide(1);
    } else {
      this.show(1);
    }
  }


  Layer.prototype.show = function(noredirect) {
    // redirect to toggle function
    if(!noredirect) {
      this.toggle('show');
      return false;
    }

    var _this = this;

    // scrollbar
    if(_this.options.fixScrollbar) {
      _this.checkScrollbar();
      _this.setScrollbar();
      _this.$body.addClass('layer-fix-scroll');
    }

    // start overlay animation
    _this.setPosition( _this.$overlay )
      .velocity({scale:0},0)
      .velocity({translateZ: 0, scale:1}, _this.options.duration, function() {
        // is opened now
        _this.isOpened = true;

        // end function
        if(_this.options.onshow) {
          _this.options.onshow();
        }

        // now not busy
        _this.busy = false;
      });

    // fade in content
    _this.$content
      .hide()
      .delay(_this.contDuration)
      .velocity('fadeIn', _this.contDuration);

    // show layer
    // timeout to prevent blinking on devices
    setTimeout(function() {
      _this.$layer.addClass('layer-opened').show();
    });
  }


  Layer.prototype.hide = function(noredirect) {
    // redirect to toggle function
    if(!noredirect) {
      this.toggle('hide');
      return false;
    }

    var _this = this;

    // content fadeout
    _this.$content.velocity('fadeOut', _this.contDuration);

    // start overlay animation
    _this.setPosition( _this.$overlay )
      .velocity({scale:1},0)
      .velocity({translateZ: 0, scale:0}, _this.options.duration, function() {
        // is hidde now
        _this.isOpened = false;

        // hide layer
        _this.$layer.removeClass('layer-opened').hide();

        // end function
        if(_this.options.onhide) {
          _this.options.onhide();
        }

        // scrollbar
        if(_this.options.fixScrollbar) {
          _this.$body.removeClass('layer-fix-scroll');
          _this.resetScrollbar();
        }

        // now not busy
        _this.busy = false;
      });
  }

  // calculate positions, sizes of layer
  Layer.prototype.calculateStartStyles = function(e) {
    var _this = this;
    var layer = _this.$layer;

    // layer pos
    // to get position need to show layer
    if(!this.isOpened) {
      layer.css({visibility: 'hidden',display: 'block'});
    }
    var layerPos = {
      top: layer.position().top,
      left: layer.position().left,
      width: layer.width(),
      // fix isue with fixed element
      height: (layer.css('position')=='fixed'?$(window).height():layer.height())
    };
    // after got position - hide layer
    if(!this.isOpened) {
      layer.css({display: 'none',visibility: 'visible'});
    }

    // start position of overlay
    _this.startStyles = {
      left: window.mousePos.x - layerPos.left,
      top: window.mousePos.y - layerPos.top
    };

    // correct position when click out of layer
    if(_this.startStyles.left < 0) {
      _this.startStyles.left = 0;
    }
    if(_this.startStyles.top < 0) {
      _this.startStyles.top = 0;
    }

    // end position overlay
    $.extend(_this.startStyles, {
      radius: Math.sqrt(Math.pow(layerPos.width, 2) + Math.pow(layerPos.height, 2))
    });
  }


  /*
    Fix Scrollbar
    functions from Bootstrap Modal
  */
  Layer.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
    this.scrollbarWidth = this.measureScrollbar();
  }

  Layer.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
      this.$navbar.css('padding-right', bodyPad + this.scrollbarWidth);
    }
  }

  Layer.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '');
    this.$navbar.css('padding-right', '');
  }

  Layer.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'layer-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  }


  // PLUGIN DEFINITION
  // =======================
  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('mdlayer');
      var options = $.extend({}, Layer.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('mdlayer', (data = new Layer(this, options)));
      if (typeof option == 'string' && data[option]) data[option]();
      if (typeof option == 'undefined') data.toggle();
    })
  }

  $.fn.MDLayer             = Plugin;
  $.fn.MDLayer.Constructor = Layer;



  /* Mouse Position - global */
  window.mousePos = {x: 0, y: 0};
  $(document).on('mousemove', function(e){ 
    window.mousePos.x = e.clientX || e.pageX; 
    window.mousePos.y = e.clientY || e.pageY;
  });

}(jQuery);