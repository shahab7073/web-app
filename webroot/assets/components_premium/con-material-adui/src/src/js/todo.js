/* 
* 
* TODO
* 
*/
!function($) {
  "use strict";
  
  var TODO = function(element, options) {
    this.options  = options;
    this.$todo    = $(element);
    this.$add     = this.$todo.find('#todo-add');
  };

  TODO.DEFAULTS = {
    demoTask: 'This is Lorem ipsum task'
  };

  TODO.prototype.init = function() {
    var _this = this;

    // add new task
    _this.$add.on('keypress', function(e) {
      if (e.which == 13) {
        _this.addTask();
      }
    })

    // remove task
    this.$todo.on('click', '.todo-task .todo-remove', function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.removeTask( $(this).parents('.todo-task:eq(0)') );
    })
  }

  // Add new task
  TODO.prototype.addTask = function() {
    var taskID = 'todo-task-' + this.getUniqueID();
    var taskMsg = this.$add.val() || this.options.demoTask;
    var newTask = [
      '<div class="todo-task" style="display: none">',
        '<input type="checkbox" id="'+taskID+'">',
        '<label for="'+taskID+'">'+taskMsg+' <span class="todo-remove mdi-action-delete"></span></label>',
      '</div>'
    ].join('');
    newTask = $(newTask);

    // clean input
    this.$add.val('');

    // insert new task
    this.$add.parent().before(newTask);
    newTask.velocity("slideDown", 300);
  }

  // Remove Task
  TODO.prototype.removeTask = function(task) {
    task.velocity({ opacity: 0 }, 200, function() {
      $(this).velocity("slideUp", 200, function() {
        $(this).remove();
      });
    });
  }


  // get unique ID for task
  var unique = 100;
  TODO.prototype.getUniqueID = function() {
    if( $('#todo-task-'+unique)[0] ) {
      unique++;
      return this.getUniqueID();
    } else {
      return unique;
    }
  }


  // init
  conApp.initCardTodo = function() {
    $('.todo-card').each(function() {
      var options = $.extend({}, TODO.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curTodo = new TODO(this, options);

      // call init
      curTodo.init();
    });
  }
  
  if(typeof conAngular === 'undefined') {
    conApp.initCardTodo();
  }

}(jQuery);