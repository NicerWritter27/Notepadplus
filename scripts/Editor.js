var Editor = function() {
  
  function init() {
    actionBinds();
    additionalActionBinds();
  }
  
  function actionBinds() {
    var actions = [
      'bold', 
      'italic', 
      'underline', 
      'strikeThrough',
      'insertOrderedList',
      'insertUnorderedList',
      'removeFormat'
    ];
    
    for(var i = 0, l = actions.length; i < l; i++) {
      // New function scope to fight closures
      (function() {
        var action = actions[i];
        
        $('#edit-' + action).on('click', function(e) {
          e.preventDefault();
          document.execCommand(action, false, null);
        });
      })();
    }
  }

  function additionalActionBinds() {
    var fontSize = 2;

    $('#edit-decreaseFontSize').click(function(){
      if (fontSize > 1)
        fontSize--;

      document.execCommand("fontSize", false, fontSize);
    });
    
    $('#edit-increaseFontSize').click(function(){
      if (fontSize < 7)
        fontSize++;

      document.execCommand("fontSize", false, fontSize);
    });
  }
  
  return {
    init: init
  }
}();

Editor.init();