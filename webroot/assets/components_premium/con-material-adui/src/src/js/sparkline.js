/* 
* 
* conSparkline extend sparkline (responsive fix)
* 
*/
!function($) {
  "use strict";

  $.fn.conSparkline = function(data, options) {
    var $element = $(this);
    var $window = $(window);

    // init sparkline
    var initSpark = function() {
      if(!$.fn.sparkline) {
        return;
      }
      
      // change width
      var newOpts = {};
      if(options.type == 'bar' && /%/g.test(options.width)) {
        newOpts.barSpacing = 1;
        newOpts.barWidth = $element.width() / data.length;
      }

      // init
      $element.sparkline(data, $.extend(options, newOpts) );
    }
    initSpark();

    // resize sparkline
    var resizeSpark;
    $window.on('resize', function() {
      clearTimeout(resizeSpark);
      resizeSpark = setTimeout(initSpark, 50);
    });
  }

}(jQuery);