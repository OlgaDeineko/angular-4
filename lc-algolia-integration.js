var LC_API = LC_API || {};
(function () {
  var algolia_script = document.createElement('script');
  algolia_script.type = 'text/javascript';
  algolia_script.src = 'https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js';
  document.body.appendChild(algolia_script);
  algolia_script.onload = function () {
    new AlgoliaIntegration()
  };

  function AlgoliaIntegration() {
    var ALGOLIA_ID = 'I9WKUNVPGV';
    var ALGOLIA_KEY = '5a6dbbf12e7c8d629d22ec3197fe0186';
    var ALGOLIA_INDEX = 'livechatpro';
    var CLIENT = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);
    var INDEX = CLIENT.initIndex(ALGOLIA_INDEX);
    var API_KEY = '9e9c9ab7efe7ecd90dbeb3844a7ef673';
    var LOGIN = 'anthony@livechatpro.nl';
    var CIENT_SUBDOMAIN = "livechatpro";

    var custom_variables = [];
    var j = 0;
    var urlRedirect = 'https://' + CIENT_SUBDOMAIN + '.myanswers.io/redirecting?';

    // Get stop words lists
    if (!localStorage['stopWordsNL']) {
      var xhr1 = new XMLHttpRequest(),
        method = "GET",
        url = "https://cdn.myanswers.io/api/stop_words/stopWordsNL.json";
      xhr1.open(method, url, true);
      xhr1.setRequestHeader("Content-Type", "application/json");
      xhr1.onreadystatechange = function () {
        if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
          localStorage['stopWordsNL'] = JSON.parse(xhr1.responseText);
        }
      };
      xhr1.send();

      var xhr5 = new XMLHttpRequest(),
        method5 = "GET",
        url5 = "https://cdn.myanswers.io/api/stop_words/stopWordsEN.json";
      xhr5.open(method5, url5, true);
      xhr5.setRequestHeader("Content-Type", "application/json");
      xhr5.onreadystatechange = function () {
        if (xhr5.readyState === XMLHttpRequest.DONE && xhr5.status === 200) {
          localStorage['stopWordsEN'] = JSON.parse(xhr5.responseText);
        }
      };
      xhr5.send();

      var xhr3 = new XMLHttpRequest(),
        method3 = "GET",
        url3 = "https://cdn.myanswers.io/api/stop_words/stopWordsFR.json";
      xhr3.open(method3, url3, true);
      xhr3.setRequestHeader("Content-Type", "application/json");
      xhr3.onreadystatechange = function () {
        if (xhr3.readyState === XMLHttpRequest.DONE && xhr3.status === 200) {
          localStorage['stopWordsFR'] = JSON.parse(xhr3.responseText);
        }
      };
      xhr3.send();

      var xhr4 = new XMLHttpRequest(),
        method4 = "GET",
        url4 = "https://cdn.myanswers.io/api/stop_words/stopWordsDE.json";
      xhr4.open(method4, url4, true);
      xhr4.setRequestHeader("Content-Type", "application/json");
      xhr4.onreadystatechange = function () {
        if (xhr4.readyState === XMLHttpRequest.DONE && xhr4.status === 200) {
          localStorage['stopWordsDE'] = JSON.parse(xhr4.responseText);
        }
      };
      xhr4.send();
    }
// Get stop words lists


    LC_API.on_chat_started = function (data) {
      getGroup();
    };

    LC_API.on_message = function (event) {
      if (event.user_type === 'visitor' && localStorage['group_facet_filter']) {
        initSearching(event)
      } else {
        getGroup(event);
      }
    };

    function cheackStopWords(item, stopWordsList) {
      var inputWords = item.split(/\,| /);
      var stopWordsArray = [];
      var searchData;
      inputWords.forEach((word) => {
        if (!(stopWordsList.indexOf(word.toLowerCase()) > -1)) {
          stopWordsArray.push(word);
        }
        searchData = stopWordsArray.join(' ');
      });
      return searchData;
    }

    function getGroup(event) {
      var authorization = window.btoa(LOGIN + ':' + API_KEY);
      var visitor_id = LC_API.get_visitor_id();
      var xhr = new XMLHttpRequest(),
        method = "GET",
        url = 'https://' + CIENT_SUBDOMAIN + '.myanswers.io/api/v1/live-chat/visitors?token=' + authorization;
      xhr.open(method, url, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
      xhr.setRequestHeader("Client-Subdomain", CIENT_SUBDOMAIN);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          data.map(function (item) {
            if (item.id === visitor_id) {
              localStorage['group_id'] = item.group;
            }
          });
          var xhr2 = new XMLHttpRequest(),
            method = "GET",
            url = 'https://' + CIENT_SUBDOMAIN + '.myanswers.io/group-list-algolia-integration.json';
          xhr2.open(method, url, true);
          xhr2.setRequestHeader("Content-Type", "application/json");
          xhr2.onreadystatechange = function () {
            if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 200) {
              var data2 = JSON.parse(xhr2.responseText);
              var group_id = localStorage['group_id'];
              var arr_groups_id = Object.keys(data2);
              if (arr_groups_id.indexOf(group_id.toString()) > -1) {
                localStorage['group_facet_filter'] = data2[group_id].group_facet_filter;
                localStorage['lang'] = data2[group_id].lang;
                if (event !== undefined && event.user_type === 'visitor') {
                  initSearching(event);
                }
              } else {
                localStorage['group_facet_filter'] = "";
                localStorage['lang'] = "";
              }

            }
          };
          xhr2.send();
        }
      };
      xhr.send();

    }

    function initSearching(event) {
      if (localStorage['group_facet_filter'] !== '') {
        var group_facet_filter = localStorage['group_facet_filter'];
        var lang = localStorage['lang'];
        var stopWordsNL = localStorage['stopWordsNL'];
        var stopWordsEN = localStorage['stopWordsEN'];
        var stopWordsFR = localStorage['stopWordsFR'];
        var stopWordsDE = localStorage['stopWordsDE'];
        var search = event.text.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
        search = cheackStopWords(search, stopWordsNL);
        search = cheackStopWords(search, stopWordsEN);
        search = cheackStopWords(search, stopWordsDE);
        var algoliasearch = cheackStopWords(search, stopWordsFR);
        if (localStorage['lang'] === '') {
          var searchsettings = {
            hitsPerPage: 3,
            removeStopWords: true,
            optionalWords: algoliasearch,
            attributesToRetrieve: "*",
            facets: "[\"hierarchicalCategories.lvl1\",\"hierarchicalCategories.lvl0\",\"hierarchicalCategories.lvl2\"]",
            facetFilters: group_facet_filter,
          };
        } else {
          var searchsettings = {
            hitsPerPage: 3,
            removeStopWords: true,
            optionalWords: algoliasearch,
            attributesToRetrieve: "*",
            facets: "[\"hierarchicalCategories.lvl1\",\"hierarchicalCategories.lvl0\",\"hierarchicalCategories.lvl2\"]",
            facetFilters: group_facet_filter,
            filters: `language:${lang}`
          };
        }


        INDEX.search(algoliasearch, searchsettings, function searchCallback(err, content) {
            if (err) {
              console.error(err);
              return;
            }
            if (content.hits.length > 0) {
              var algoliaResults = content.hits.map(function (hit) {
                hit._highlightResult.answer.value = hit._highlightResult.answer.value.toString().replace(/<(?!\/?em)[^>]+>/gm, '');
                return hit
              });
              for (var i = 0; i < content.hits.length; i++) {
                custom_variables[j] = {
                  name: 'FAQ title' + [i + 1],
                  value: algoliaResults[i]._highlightResult.question.value.toString().replace(/<(.*?)em(.*?)>/gm, '')
                };
                custom_variables[j + 1] = {
                  name: 'Answer' + [i + 1],
                  value: algoliaResults[i]._highlightResult.answer.value.toString().replace(/<(.*?)em(.*?)>/gm, '')
                    .split(' ').slice(0, 75).join(' ') + '. See more:' + urlRedirect + 'faq=' + algoliaResults[i].objectID
                };
                j = j + 2;
              }
              j = 0;
              LC_API.set_custom_variables(custom_variables);
            } else {
              LC_API.set_custom_variables([{name: 'Message', value: 'No search result.'}]);
            }
          }
        );
      } else {
        LC_API.set_custom_variables('');
      }
    }

    LC_API.on_chat_ended = function () {
      LC_API.set_custom_variables('');
      localStorage.removeItem('group_id');
      localStorage.removeItem('group_facet_filter');
      localStorage.removeItem('lang');
    };
  }
})();
