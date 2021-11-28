var Core = function() {
  function init() {}
  
  function storeObj(data, cb = null) {
    chrome.storage.local.set(data, cb);
  }
  
  function readObj(key, cb = null) {
    chrome.storage.local.get(key, cb);
  }
  
  return {
    init: init,
    storeObj: storeObj,
    readObj: readObj
  }
}();