// var LC_API = LC_API || {};
// (function () {
//   // var API_KEY = '505b484e24928de243f9b9d2d5570abc';
//   // var LOGIN = 'anthony@digitalcustomercare.nl';
// var API_KEY = '61d7dab5c6953d924c1330389113b27f';
// var LOGIN = 'olga.test100500+1@gmail.com';
// //   var authorization = window.btoa(LOGIN + ':' + API_KEY);
//   var authorization = 'b2xnYS50ZXN0MTAwNTAwKzFAZ21haWwuY29tOjYxZDdkYWI1YzY5NTNkOTI0YzEzMzAzODkxMTNiMjdm';
//   var available_agents = [];
//   // first codtition of groups
//   generateHttpRequest("https://api.livechatinc.com/groups", "GET", function () {
//     var chat_groups = JSON.parse(this.responseText);
//     localStorage['chat_groups'] = JSON.stringify(chat_groups);
//   });
// // first codtition of groups
//
//   LC_API.on_after_load = function () {
//     if (!LC_API.agents_are_available()) {
//       addeNewAgents();
//     }
//     setInterval(function () {
//       if (!LC_API.agents_are_available()) {
//         addeNewAgents();
//       }else{
//         checkStatusOfagents();
//       }
//     }, 20000);
//   };
//
//   function addeNewAgents() {
//     generateHttpRequest("https://api.livechatinc.com/visitors", "GET", function () {
//       var visitors = JSON.parse(this.responseText);
//       visitors.map(function (visitor) {
//         if (visitor.id === LC_API.get_visitor_id() && visitor.group !== 0) {
//           // create array of available agents
//           generateHttpRequest("https://api.livechatinc.com/agents", "GET", function () {
//             var agents = JSON.parse(this.responseText);
//             agents.map(function (agent) {
//               if (agent.status === 'accepting chats') {
//                 available_agents.push(agent.login);
//               }
//             });
//           });
//           // create array of available agents
//           var all_group = JSON.parse(localStorage['chat_groups']);
//           all_group.map(function (group) {
//             if (group.id === visitor.group && available_agents.length > 0) {
//               localStorage['group'] = visitor.group;
//               localStorage['group_agents'] = group.agents;
//               localStorage['add_agent'] = available_agents[0];
//               group.agents.unshift(available_agents[0]);
//               var updategroup = {
//                 agents: group.agents,
//               };
//               generateHttpRequest("https://api.livechatinc.com/groups/" + visitor.group, "PUT", function () {
//                 var groupreq = JSON.parse(this.responseText);
//               }, updategroup);
//             }
//           });
//         }
//       })
//     });
//   }
//
//   function checkStatusOfagents() {
//     if(localStorage['add_agent']){
//       var group_agents = localStorage['group_agents'].split(",");
//       generateHttpRequest("https://api.livechatinc.com/agents", "GET", function () {
//         var agents = JSON.parse(this.responseText);
//         agents.forEach(function (agent) {
//           if (group_agents.indexOf(agent.login) > -1) {
//             if(agent.status === 'accepting chats'){
//               generateHttpRequest("https://api.livechatinc.com/groups/" + localStorage['group'], "PUT", function () {
//                 var groupreq = JSON.parse(this.responseText);
//               }, {agents: group_agents});
//               available_agents = [];
//               localStorage.removeItem('add_agent');
//               localStorage.removeItem('group_agents');
//               localStorage.removeItem('group');
//             }
//           }
//         });
//       });
//     }
//
//   }
//
//   function generateHttpRequest(r_url, r_method, callback, data) {
//     var proxyURL = 'https://cors-anywhere.herokuapp.com';
//     var xhr = new XMLHttpRequest(),
//       method = r_method,
//       url = r_url;
//     xhr.open(method, proxyURL + '/' + url, true);
//     xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
//     xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
//     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
//     xhr.setRequestHeader("Authorization", 'Basic ' + authorization);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.setRequestHeader("X-API-Version", "2");
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//         if (typeof callback === "function") {
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
//
//   LC_API.on_chat_ended = function () {
//     available_agents = [];
//     if(localStorage['add_agent']) {
//       var group_agents = localStorage['group_agents'].split(",");
//       generateHttpRequest("https://api.livechatinc.com/groups/" + localStorage['group'], "PUT", function () {
//         var groupreq = JSON.parse(this.responseText);
//       }, {agents: group_agents});
//     }
//   };
// })();
