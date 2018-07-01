// var LC_API = LC_API || {};
// (function () {
//   var API_KEY = '9e9c9ab7efe7ecd90dbeb3844a7ef673';
//   // var API_KEY = 'bdc5aafb42162670a008416b131665d2';
//   var LOGIN = 'anthony@livechatpro.nl';
//   // var LOGIN = 'olga.test100500@gmail.com';
//   var authorization = window.btoa(LOGIN + ':' + API_KEY);
//   var agents_email = 'carine.henry@live.fr';
//   // var agents_email = 'olga.test100500@gmail.com';
//   var groups = [35,25,42,39,36,53,37,57,16,18,8,5,51,50,55];
//   // var groups = [1, 4, 5, 6];
//   var groups_data = [];
//   var api_url = 'http://52.58.86.36/api/v1/live-chat/';
//   generateHttpRequest(api_url + 'groups?token=' + authorization, 'GET', function () {
//     chat_groups = JSON.parse(this.responseText);
//     chat_groups.forEach(function (group) {
//       if (groups.indexOf(group.id) > -1) {
//         groups_data.push(group);
//       }
//     });
//     checkagent();
//   });
//
//   setInterval(function(){
//     checkagent();
//   }, 10000);
//
//
//   function checkagent() {
//     generateHttpRequest(api_url + 'agents/' + agents_email + '?token=' + authorization, 'GET', function () {
//       var agent = JSON.parse(this.responseText);
//       if (agent.status === 'accepting chats') {
//         groups.forEach(function (group) {
//           var agents = {agents: [agents_email]};
//           generateHttpRequest(api_url + 'groups/' + group + '?token=' + authorization, 'PUT', function () {
//             var groupreq = JSON.parse(this.responseText);
//           }, agents);
//         });
//       } else {
//         groups_data.forEach(function (group) {
//           if (groups.indexOf(group.id) > -1) {
//             var agents = {agents: group.agents};
//             generateHttpRequest(api_url + 'groups/' + group.id + '?token=' + authorization, 'PUT', function () {
//               var result = JSON.parse(this.responseText);
//             }, agents);
//           }
//         });
//       }
//     });
//   }
//
//
//
//   LC_API.on_chat_ended = function () {
//     groups_data.forEach(function (group) {
//       if (groups.indexOf(group.id) > -1) {
//         var agents = {agents: group.agents};
//         generateHttpRequest(api_url + 'groups/' + group.id + '?token=' + authorization, 'PUT', function () {
//           var result = JSON.parse(this.responseText);
//         }, agents);
//       }
//     });
//   };
//
//   function generateHttpRequest(r_url, r_method, callback, data) {
//     var xhr = new XMLHttpRequest(),
//       method = r_method,
//       url = r_url;
//     xhr.open(method, url, true);
//     xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//         if (typeof callback === 'function') {
//           callback.apply(xhr);
//         }
//       }
//     };
//     if (data) {
//       xhr.send(JSON.stringify(data));
//     } else {
//       xhr.send();
//     }
//   }
// })();
