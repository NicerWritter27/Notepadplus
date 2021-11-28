var Write = (function () {
  function init() {
    storeNote();
    notesCounter();
    deleteNote();
  }

  function notesCounter() {
    var data = {
      "notes-counter": {
        count: 0,
      },
    };

    Core.readObj("notes-counter", function (obj) {
      if (!("notes-counter" in obj)) {
        Core.storeObj(data, storeSuccess);
      }
    });
  }

  function deleteNote() {
    $("#delete-note").on("click", function (e) {
      e.preventDefault();
      var getNoteId = $("nav")
        .find(".active:not(#quick-note-nav)")
        .data("note-id");

      var elm = $("nav").find('[data-note-id="' + getNoteId + '"]');
      var nextElm = $(elm).next();
      var prevElm = $(elm).prev();

      elm.remove();

      chrome.storage.local.remove(["note-file-" + getNoteId], function () {
        var error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
      });

      if ($("nav").find("li").length > 0) {
        if (nextElm.length > 0) {
          nextElm.trigger("click");
        } else {
          prevElm.trigger("click");
        }
      }
    });
  }

  function noteIncrementer(counter) {
    var data = {
      "notes-counter": {
        count: counter,
      },
    };

    Core.storeObj(data, storeSuccess);

    var obj = {};

    obj["note-file-" + counter] = {
      id: counter,
      text: "",
      created: dayjs().format("HH:mm DD/MM/YY"),
      updated: dayjs().format("HH:mm DD/MM/YY"),
    };

    Core.storeObj(obj, storeSuccess);
  }

  function storeNote() {
    $("#quick-note-panel, #stored-note").on("input", function () {
      var elm = $(this);
      var noteData = $(elm).html();
      var activeNoteId = $("nav").find(".active").data("note-id");
      var noteKey = "note-file-" + activeNoteId;

      Core.readObj(noteKey, function (obj) {
        if ($(elm).hasClass("quick-note-panel")) {
          obj = {
            "quick-note": {
              text: noteData,
            },
          };
        } else {
          obj[noteKey] = {
            ...obj[noteKey],
            id: activeNoteId,
            text: noteData,
            updated: dayjs().format("HH:mm DD/MM/YY"),
          };

          $(".updated-at-ts").text(obj[noteKey].updated);
          debugger;
          var fileName = noteData
            .replace(/\s?(<br\s?\/?>)\s?/g, "\r\n")
            .replace(/(<([^>]+)>)/gi, "")
            .split("\n")[0]
            .substring(0, 18);

          $("aside")
            .find('li[data-note-id="' + activeNoteId + '"]')
            .text(fileName === "" ? "Untitled Note " + activeNoteId : fileName);
        }

        Core.storeObj(obj, storeSuccess);
      });
    });
  }

  function storeSuccess() {
    console.log("Stored");
  }

  return {
    init: init,
    noteIncrementer: noteIncrementer,
  };
})();

Write.init();
