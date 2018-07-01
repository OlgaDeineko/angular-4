var LC_API = LC_API || {};
(function () {
  var timetohide = false;
  workingStatus();
  setInterval(function () {
    var d = new Date();
    var m = d.getMinutes();
    if (m === 30 || m === 0) {
      workingStatus()
    }
  }, 30000);

  LC_API.on_after_load = function () {
    setInterval(function () {
      if (timetohide === true && !(window.location.pathname.includes('klantenservice') ||
          window.location.pathname.includes('winkelmandje') || window.location.pathname.includes('zoek')
          || window.location.pathname.includes('winkels'))) {
        LC_API.hide_chat_window();
      } else{
        var is_hidden = LC_API.chat_window_hidden();
        if(is_hidden === true){
          LC_API.minimize_chat_window();
        }
      }
    }, 1000);
  };

  function workingStatus() {
    var xhr = new XMLHttpRequest(),
      method = "GET",
      url = 'https://livechatinc.myanswers.io/api/v1/livechatinc/groups/23/working-status';
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        timetohide = JSON.parse(xhr.responseText).status;
      }
    };
    xhr.send();
  }
})();
