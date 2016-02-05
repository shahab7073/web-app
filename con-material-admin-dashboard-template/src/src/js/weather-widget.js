/*
*
* WEATHER WIDGET
*
*/
!function($) {
  "use strict";
  
  var Weather = function(element, options) {
    this.options   = options;
    this.$element  = $(element);

    // init
    this.init();
  };

  Weather.DEFAULTS = {
    // when navigator no support geolocation
    // [location, woeid]
    fallback: ['Seattle',''],

    // weather icons
    icons: ['wi-tornado','wi-night-thunderstorm','wi-storm-showers','wi-thunderstorm','wi-storm-showers','wi-rain-mix','wi-rain-mix','wi-rain-mix','wi-rain-mix','wi-snow','wi-rain-mix','wi-snow','wi-snow','wi-snow','wi-snow','wi-rain-mix','wi-snow','wi-rain-mix','wi-rain-wind','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-gusts','wi-cloudy-gusts','wi-cloudy','wi-night-cloudy','wi-day-cloudy','wi-night-cloudy','wi-day-cloudy','wi-night-clear','wi-day-sunny','wi-night-clear','wi-day-sunny','wi-rain-mix','wi-day-sunny','wi-storm-showers','wi-storm-showers','wi-storm-showers','wi-rain','wi-rain-mix','wi-snow','wi-rain-mix','wi-night-cloudy','wi-storm-showers','wi-rain-wind','wi-storm-showers']
  }

  Weather.prototype.init = function() {
    var _this = this;
    // Check user geolocation and show weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        _this.loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
      });
    } else {
      // load fallback location
      _this.loadWeather(_this.options.fallback[0], _this.options.fallback[1]);
    }
  }

  Weather.prototype.loadWeather = function(location, woeid) {
    var _this = this;
    $.simpleWeather({
      location: location,
      woeid: woeid,
      unit: 'c',
      success: function(weather) {
        var html = [
          '<div class="row">',
            '<div class="temp col s7">',
              weather.temp+'&deg;'+weather.units.temp,
              ' <span class="alt">'+weather.alt.temp+'&deg;F</span>',
            '</div>',
            '<div class="city col s5"><i class="fa fa-map-marker"></i> '+weather.city+'</div>',
          '</div>',
          '<div class="icon"><i class="wi '+_this.options.icons[weather.code]+'"></i></div>',
          '<div class="currently">'+weather.currently+'</div>'
        ].join('');  
        
        _this.$element.html(html);
      },
      error: function(error) {
        _this.$element.html('<h4>'+error.error+'</h4>'+'<p>'+error.message+'</p>');
      }
    });
  }

  // init plugin
  conApp.initCardWeather = function() {
    $(".weather-card").each(function() {
      new Weather(this, Weather.DEFAULTS);
    });
  }

  if(typeof conAngular === 'undefined') {
    conApp.initCardWeather();
  }

}(jQuery);