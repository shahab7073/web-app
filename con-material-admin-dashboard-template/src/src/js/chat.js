/*
 *
 * CHAT
 *
 */
!function($) {
  var Chat = function(element, options) {
    this.options    = options;
    this.$chat      = $(element);
    this.$window    = $(window);
    this.$document  = $(document);
    this.$chatForm  = this.$chat.find('.send > form');
    this.$msgNano   = this.$chat.find('.messages .nano');
    this.$msgCont   = this.$msgNano.find('> .nano-content');
    this.$msgInput  = this.$chat.find('input[name=chat-message]');
  };

  Chat.DEFAULTS = {
    // duration animation show new message
    msgDuration: 300,

    // set false to prevent demo message send
    msgDemo: 'Demo chat message ;)' 
  };

  Chat.prototype.init = function() {
    var _this = this;

    // Bindings

    // layer init
    _this.initLayer();

    // send message
    _this.$chatForm.on('submit', function(e) {
      e.preventDefault();
      _this.sendMsg();
    });

    // open chat with user
    _this.$chat.on('click', '.contacts .user', function(e) {
      e.stopPropagation();
      _this.$chat.addClass('open-messages');
    });
    // close chat with user
    _this.$chat.on('click', '.messages .topbar > .chat-back', function(e) {
      e.stopPropagation();
      e.preventDefault();
      _this.$chat.removeClass('open-messages');
    });
    
    _this.$chat.on('click', function(e) {
      if(!$(e.target).hasClass('chat-toggle') && !$(e.target).parent().hasClass('chat-toggle')) {
        e.stopPropagation();
      }
    });


    // init nanoScroller
    _this.$chat.find('.nano').each(function() {
      var scrollTo = '';
      if($(this).hasClass('scroll-bottom')) {
        scrollTo = 'bottom';
      } else if ($(this).hasClass('scroll-top')) {
        scrollTo = 'top';
      }

      $(this).nanoScroller({
        preventPageScrolling: true,
        scroll: scrollTo
      })
    });
  }

  Chat.prototype.initLayer = function() {
    var _this = this;

    // Toggle chat layer
    _this.$chat.MDLayer({
      duration: 400,
      onshow: function() {
        _this.$window.resize();
      }
    });

    // open chat
    _this.$document.on('click', '.chat-toggle', function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.$chat.MDLayer();
    });
    // close chat on document click
    _this.$document.on('click', function(e) {
      _this.$chat.MDLayer('hide');
    });
    // close chat on ESC press
    _this.$document.on('keyup', function(e) {
      if (e.keyCode == 27) {
        _this.$chat.MDLayer('hide');
      }
    });
  }

  Chat.prototype.sendMsg = function() {
    var _this = this;
    var message = _this.$msgInput.val() || _this.options.msgDemo;

    if(!message) {
      return;
    }

    // clear input
    _this.$msgInput.val('');

    // prepare new msg
    var newMsg = $('<div class="from-me">'+message+'</div>');
    _this.$msgCont.append('<div class="clear"></div>').append(newMsg);

    // animate new message
    newMsg.velocity({scale: 0, opacity: 0}, 0)
          .velocity({scale: 1, opacity: 1}, _this.options.msgDuration);

    // scroll to chat bottom
    _this.$msgNano.nanoScroller().nanoScroller({scroll: 'bottom'});
  }


  // init
  conApp.initChat = function() {
    $('.chat').each(function() {
      var options = $.extend({}, Chat.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curChat = new Chat(this, options);

      // call init
      curChat.init();
    });
  }
  
  if(typeof conAngular === 'undefined') {
    conApp.initChat();
  }

}(jQuery);