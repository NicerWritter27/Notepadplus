var Modal = function() {
  function init() {
    uiBindings();
  }

  function uiBindings() {
    open();
    close();
  }

  function open() {
    $('[data-target-modal]').on('click', function(e) {
      e.preventDefault();
      $('[data-modal="' + $(this).data('target-modal') + '"]').removeClass('hide');
    });
  }

  function close() {
    $('.close-modal').on('click', function(e) {
      e.preventDefault();
      $(this).closest('.modal').addClass('hide');
    });
  }

  return {
    init: init
  }
}();

Modal.init();