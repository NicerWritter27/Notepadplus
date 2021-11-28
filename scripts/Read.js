var Read = (function () {
  function init() {
    quickNote();
    fetchAllNotes();
    getNotes();
  }

  function quickNote() {
    Core.readObj("quick-note", function (obj) {
      var noteData = obj["quick-note"];
      var noteText = noteData
        ? noteData.text
        : "Here you can type quick notes, to learn more, click the question mark at the bottom right, feel free to erase this text, happy writting :)                                                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp At November 21, there was 81 new users are using our extension, with the total of 129 users thank you all, share this extension because I could upload a drawing pad extension, link here https://microsoftedge.microsoft.com/addons/detail/my-notepad/cggnkokdpoaoglmbplgobkfmhmhhhkfd";

      $("#quick-note-panel").html(noteText);
    });
  }

  function getNotes() {
    $(".quick-note-nav").on("click", function () {
      $("nav li").removeClass("active");
      $("#stored-note").html("");
      $("#stored-note, #other-controls").addClass("hide");
      $("#quick-note-panel").removeClass("hide");

      Core.readObj("quick-note", function (obj) {
        var noteData = obj["quick-note"];
        var noteText = noteData
          ? noteData.text
          : "You can write some stuff here :)";

        $("#quick-note-panel").html(noteText);
      });
    });

    $(document).on(
      "click",
      "nav li:not(.quick-note-nav, .add-note)",
      function () {
        $("nav li").removeClass("active");
        $("#other-controls").removeClass("hide");

        var elm = $(this);
        elm.addClass("active");

        Core.readObj("note-file-" + $(elm).data("note-id"), function (obj) {
          $("#stored-note").html("");

          $("#quick-note-panel").addClass("hide");
          $("#stored-note").removeClass("hide");

          var noteData = obj["note-file-" + $(elm).data("note-id")];

          $(".created-at-ts").text(noteData.created || "N/A");
          $(".updated-at-ts").text(noteData.updated || "N/A");
          $("#stored-note").html(noteData.text);
        });
      }
    );
  }

  function fetchAllNotes() {
    var getFiles = [];

    Core.readObj(null, function (obj) {
      $.each(obj, function (k, v) {
        var splitKey = k.split("-");

        if (splitKey.length > 0 && splitKey[1] == "file") {
          getFiles.push(obj[k]);
        }
      });

      renderNotes(getFiles);
    });
  }

  function renderNotes(arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      var fileName =
        arr[i].text == ""
          ? "Untitled Note " + arr[i].id
          : arr[i].text
              .replace(/\s?(<br\s?\/?>)\s?/g, "\r\n")
              .replace(/(<([^>]+)>)/gi, "")
              .split("\n")[0]
              .substring(0, 18);

      $("#quick-note-nav").after(
        '<li data-note-id="' + arr[i].id + '">' + fileName + "</li>"
      );
    }
  }

  return {
    init: init,
    fetchAllNotes: fetchAllNotes,
  };
})();

Read.init();
