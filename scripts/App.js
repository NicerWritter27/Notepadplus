var App = (function () {
  function init() {
    uiBindings();
  }

  function uiBindings() {
    backupData();
    populateBackupInfo();
    recoverData();
    expandOtherLinks();
  }

  function expandOtherLinks() {
    $("#expand-collapse").on("click", function () {
      $(".other-links").toggleClass("expanded-other-links");
    });
  }

  function populateBackupInfo() {
    Core.readObj(null, function (fetch) {
      $("#last-backup-timestamp")
        .find("span")
        .text(fetch._lastBackedUpTimeStamp);
      $("#last-backup-id").find("span").text(fetch._backupID);
    });
  }

  function backupSuccess() {
    var c = new Date();
    Core.storeObj({
      _lastBackedUpTimeStamp:
        c.getDate() +
        "-" +
        (c.getMonth() + 1) +
        "-" +
        c.getFullYear() +
        " | " +
        c.getHours() +
        ":" +
        c.getMinutes() +
        ":" +
        c.getSeconds(),
    });

    var backupWrapper = $("#backup-wrapper");
    backupWrapper.find(".backup-inprogress, .success-message").remove();
    backupWrapper.append(
      '<p class="success-message">All the notes are successfully backedup.</p>'
    );

    var successMsg;

    clearTimeout(successMsg);

    successMsg = setTimeout(function () {
      backupWrapper.find(".success-message").remove();
    }, 2000);

    $("#quick-note-nav a").trigger("click");

    populateBackupInfo();
  }

  function backupData() {
    $("#backup-data").on("click", function (e) {
      e.preventDefault();

      Core.readObj(null, function (items) {
        var dataObj = {
          data: items,
          app: "chrome-advanced-notepad-extension",
        };

        var decideMethod = !items._backupID ? "post" : "put";
        var decideURL = !items._backupID
          ? "https://api.jsonbin.io/b"
          : `https://api.jsonbin.io/b/${items._backupID}`;

        delete dataObj.data._lastBackedUpTimeStamp;
        delete dataObj.data._backupID;

        $.ajax({
          url: decideURL,
          contentType: "application/json",
          type: decideMethod,
          dataType: "json",
          headers: {
            "secret-key":
              "$2b$10$bW/CFo2aSbRhIShYvRgGz.RX5EM6HnbqGZxPkUw1sqzy8AKOVaWIe",
            "collection-id": "5e00fc832c714135cda669fd",
          },
          data: JSON.stringify(dataObj),
          beforeSend: function (xhr) {
            $("#backup-wrapper").remove(".backup-inprogress");
            $("#backup-wrapper").append(
              '<p class="backup-inprogress">Data is being backed up...</p>'
            );
          },
          success: function (fetch) {
            var allData = fetch;

            if (!items._backupID) {
              Core.storeObj({
                _backupID: fetch.id,
              });
            }

            backupSuccess();
          },
        });
      });
    });
  }

  function recoverData() {
    $("#recover-data").on("click", function (e) {
      e.preventDefault();

      Core.readObj(null, function (items) {
        var recoverID = $("#recover-data-id").val();
        var restoreWrapper = $("#restore-wrapper");

        var provideBackupID;

        if (recoverID === "") {
          restoreWrapper.find(".error-message").remove();
          restoreWrapper.append(
            '<p class="error-message">Provide backup ID</p>'
          );

          clearTimeout(provideBackupID);

          provideBackupID = setTimeout(function () {
            restoreWrapper.find(".error-message").remove();
          }, 2000);
        }

        if (recoverID) {
          $.ajax({
            url: "https://api.jsonbin.io/b/" + recoverID + "/latest",
            type: "get",
            headers: {
              "secret-key":
                "$2b$10$bW/CFo2aSbRhIShYvRgGz.RX5EM6HnbqGZxPkUw1sqzy8AKOVaWIe",
            },
            beforeSend: function (xhr) {
              restoreWrapper.find(".error-message").remove();
              restoreWrapper.append(
                '<p class="restoring-inprogress">Data is being restored...</p>'
              );
            },
            success: function (fetch) {
              var backupID = items._backupID;
              var lastBackupTimeStamp = items._lastBackedUpTimeStamp;

              chrome.storage.local.clear(function () {
                var error = chrome.runtime.lastError;
                if (error) {
                  console.error(error);
                }

                fetch.data._backupID = backupID;
                fetch.data._lastBackedUpTimeStamp = lastBackupTimeStamp;

                Core.storeObj(fetch.data, function () {
                  recoverSuccess(fetch.data);
                });
              });
            },
            error: function (data) {
              var responseText = JSON.parse(data.responseText);
              restoreWrapper.find(".restoring-inprogress").remove();

              var errorMsg;

              clearTimeout(errorMsg);

              restoreWrapper.append(
                '<p class="error-message">' + responseText.message + "</p>"
              );
              errMsg = setTimeout(function () {
                restoreWrapper.find(".error-message").remove();
              }, 2000);
            },
          });
        }
      });
    });
  }

  function recoverSuccess(data) {
    var restoreWrapper = $("#restore-wrapper");
    restoreWrapper.find(".restoring-inprogress").remove();
    restoreWrapper.append(
      '<p class="success-message">All the notes are successfully restored.</p>'
    );
    $("#recover-data-id").val("");

    var successMsg;

    clearTimeout(successMsg);

    successMsg = setTimeout(function () {
      restoreWrapper.find(".success-message").remove();
    }, 2000);

    $("#quick-note-nav a").trigger("click");

    $("nav").find("li:not(#quick-note-nav)").remove();

    Read.fetchAllNotes();
  }

  return {
    init: init,
  };
})();

App.init();
