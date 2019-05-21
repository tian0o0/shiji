chrome.devtools.panels.create('Test', '/images/icon16.png', '/index.html', function(extensionPanel) {
    var _window; // Going to hold the reference to panel.html's `window`

    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});
    port.lineTime = [];
    chrome.devtools.network.onRequestFinished.addListener(
    // console.log(notifyDevtools);
      function(request) {
          var url = request.request.url,
              time = request.time;
          if(url.substring(0, 9) === "chrome://" || url.substring(0, 19) === "chrome-extension://" || url.substring(0, 7) === "file://") return;
          chrome.runtime.sendMessage({url: url,time: time});
    });
});