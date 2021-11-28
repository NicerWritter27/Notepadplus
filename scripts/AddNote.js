var AddNote = (function () {
  function init() {
    newNote();
  }

  function newNote() {
    $("#add-note").on("click", function () {
      Core.readObj("notes-counter", function (obj) {
        var notesCounterData = obj["notes-counter"];
        var notesCount = notesCounterData ? notesCounterData.count : 0;
        notesCount++;

        Write.noteIncrementer(notesCount);

        $("nav li").removeClass("active");
        $("#quick-note-nav").after(
          '<li class="active" data-note-id="' +
            notesCount +
            '">Untitled Note ' +
            notesCount +
            "</li>"
        );
        $("#quick-note-panel").addClass("hide");
        $("#stored-note").removeClass("hide").text("").get(0).focus();
        $("#other-controls").removeClass("hide");
        $("#other-controls time").text(dayjs().format("HH:mm DD-MM-YY"));
      });
    });
  }

  return {
    init: init,
  };
})();

AddNote.init();
