(function () {
  // parse params
  var scripts = document.getElementsByTagName('script');
  var scriptsSrc = [].slice.call(scripts).map(function(script){
    return script.src;
  });
  // TODO: rewrite to ES5
  var scriptUrl = scriptsSrc.find(function(b) {
    return /^(https:\/\/cdn\.myanswers\.io)/.test(b);
  });

  var params = {};

  try {
    //  || 'fake\":\"fake' ---> it's for link without params if we will needed rune some code without params (and for old a code "for paste")
    params = JSON.parse('{\"' + (scriptUrl.replace(/^[^\?]+\??/, '').replace(/&/g, '","').replace(/=/g, '":"') || 'fake\":\"fake') + '\"}');
    if (typeof params !== 'object') {
      params = {};
    }

    // TODO: it's for old a code "for paste", remove if old code will not used
    params.knowledgeBase = params.knowledgeBase || window.CLIENT_SUBDOMAIN;
    params.algolia = params.algolia || window.ALGOLIA_INDEX;
    params.liveChatUrl = params.liveChatUrl || window.LIVECHATLINK;
    // end remove

    if (!params.knowledgeBase || !params.algolia) {
      throw 'miss params';
    }
  } catch (e) {
    console.warn('Help Widget in not loading: params is invalid.');
    return;
  }

  // append help widget styles
  var styleNode = document.createElement('link');
  styleNode.rel = 'stylesheet';
  styleNode.type = 'text/css';
  // TODO: it's remove before prod
  styleNode.href = 'https://cdn.myanswers.io/help-widget.css';
  document.head.appendChild(styleNode);

  // add style
  generateHttpRequest('https://' + params.knowledgeBase  + '.myanswers.io/api/v1/settings/help-widget', 'GET', function () {
    if(this.responseText){
      var widget_styles = JSON.parse(this.responseText).data;
      if(widget_styles.poweredBy === true){
        sessionStorage.setItem('poweredBy', 'true');
      }else{
        sessionStorage.setItem('poweredBy', 'false');
      }
      addSpecStyle([
        {
          selector: '.widget-container, #widget-header',
          styles: {
            'background': `${widget_styles.widgetColor} !important`
          }
        },
        {
          selector: '.widget-live-chat',
          styles: {
            'background': `${widget_styles.livechatColor} !important`
          }
        },
        {
          selector: '.widget-btn-liveChat, .widget-btn-help',
          styles: {
            'background': `${widget_styles.widgetbuttonColor} !important`
          }
        },
        {
          selector: '.widget-help-tip',
          styles: {
            'color': `${widget_styles.widgetbuttonColor} !important`
          }
        },
        {
          selector: '#widget-body a',
          styles: {
            'color': `${widget_styles.widgetlinkColor} !important`
          }
        },
      ]);
    }else{
      sessionStorage.setItem('poweredBy', 'true');
    }
  },params.knowledgeBase);
  // add style

  // append algolia code
  var algolia_script = document.createElement('script');
  algolia_script.type = 'text/javascript';
  algolia_script.src = 'https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js';
  document.body.appendChild(algolia_script);
  algolia_script.onload = function () {
    // get translation file
    if(window.navigator.language.includes('en')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/en.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('de')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/de.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('fr')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/fr.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('es')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/es.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('pl')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/pl.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('it')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/it.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('sv')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/sv.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('da')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/da.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else if(window.navigator.language.includes('fi')){
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/fi.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    else{
      generateHttpRequest('https://' + params.knowledgeBase + '.myanswers.io/assets/i18n/widget/nl.json', 'GET', function () {
        var widget_lang = JSON.parse(this.responseText);
        new MyAnswersHelpWidget(params,widget_lang);
      });
    }
    // get translation file;
  };


  function MyAnswersHelpWidget(params, translate) {
    var ALGOLIA_INDEX = params.algolia;
    var CLIENT_SUBDOMAIN = params.knowledgeBase;

    var ALGOLIA_ID = 'I9WKUNVPGV';
    var ALGOLIA_KEY = '5a6dbbf12e7c8d629d22ec3197fe0186';
    var CLIENT = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);
    var INDEX = CLIENT.initIndex(ALGOLIA_INDEX);
    var LIVECHATLINK = params.liveChatUrl && params.liveChatUrl.length ? decodeURIComponent(params.liveChatUrl) : null;
    var FAQ_URL = 'https://' + CLIENT_SUBDOMAIN + '.myanswers.io/redirecting?faq=';
    var STOPWORDS_URL = 'https://cdn.myanswers.io/api/stop_words/';
    var target_location = '';
    var top_result;
    var view_more;
    var listView;
    var hide;
    var button_liveChat;
    var liveChat_iframe;
    var button_close_liveChat;
    var target_location_url = window.location.href;

    // Get stop words lists
    if(!localStorage['stopWordsNL']) {
      generateHttpRequest(STOPWORDS_URL + "stopWordsNL.json", 'GET', function () {
        localStorage['stopWordsNL'] = JSON.parse(this.responseText);
      }, CLIENT_SUBDOMAIN);
      generateHttpRequest(STOPWORDS_URL + "stopWordsEN.json", 'GET', function () {
        localStorage['stopWordsEN'] = JSON.parse(this.responseText);
      }, CLIENT_SUBDOMAIN);
      generateHttpRequest(STOPWORDS_URL + "stopWordsFR.json", 'GET', function () {
        localStorage['stopWordsFR'] = JSON.parse(this.responseText);
      }, CLIENT_SUBDOMAIN);
      generateHttpRequest(STOPWORDS_URL + "stopWordsDE.json", 'GET', function () {
        localStorage['stopWordsDE'] = JSON.parse(this.responseText);
        if (window.location.pathname !== "/") {
          if (window.location.hash.length) {
            target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm);
            let target_hash = window.location.hash.match(/[0-9a-zA-Z]+/gm);
            let search_parameters = target_location.concat(target_hash);
            target_location = search_parameters.join(' ');
          } else {
            target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm).join(' ');
          }
          search_by_algolia(target_location);
        }
      }, CLIENT_SUBDOMAIN);
    }else{
      if (window.location.pathname !== "/") {
        if (window.location.hash.length) {
          target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm);
          let target_hash = window.location.hash.match(/[0-9a-zA-Z]+/gm);
          let search_parameters = target_location.concat(target_hash);
          target_location = search_parameters.join(' ');
        } else {
          target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm).join(' ');
        }
        search_by_algolia(target_location);
      }
    }
// Get stop words lists


    var body = document.getElementsByTagName('body')[0];

// BUTTON HELP
    var button_help = document.createElement('button');
    button_help.className = 'widget-btn-help';
    body.parentNode.insertBefore(button_help, body.nextSibling);
    var help_tip = document.createElement('span');
    help_tip.className = 'widget-help-tip';
    button_help.appendChild(document.createTextNode("Help "));
    help_tip.appendChild(document.createTextNode("?"));
    button_help.appendChild(help_tip);
// BUTTON HELP

// WIDGET
    var widget = document.createElement('div');
    widget.innerHTML = '<div id="widget-header"><p class="widget-title">Help</p><input placeholder="Zoeken..." id="widget-search"></div><div id="widget-body"></div><div id="widget-footer"></div>';
    widget.className = 'widget-container';
    body.parentNode.insertBefore(widget, body.nextSibling);
    var widget_header = document.getElementById('widget-header');
// close button
    var button_close = document.createElement('button');
    button_close.className = 'widget-btn-close';
    button_close.appendChild(document.createTextNode("x"));
    widget_header.appendChild(button_close);
// close button tooltip
    button_close.classList.add("widget-tooltip");
    var btn_close_tooltiptext = document.createElement('span');
    btn_close_tooltiptext.appendChild(document.createTextNode(translate.WIDGET.CLOSE_WIDGET));
    btn_close_tooltiptext.className = 'widget-tooltiptext';
    button_close.appendChild(btn_close_tooltiptext);
// widget content
    var input_search = document.getElementById('widget-search');
    var result_of_question = document.getElementById('widget-body');
    var widget_footer = document.getElementById('widget-footer');
// button view more
    view_more = document.createElement('button');
    view_more.className = 'widget-btn-view-more';
    view_more.style.display = 'none';
    view_more.appendChild(document.createTextNode(translate.WIDGET.VIEW_MORE));
// button hide
    hide = document.createElement('button');
    hide.className = 'widget-btn-view-more';
    hide.style.display = 'none';
    hide.appendChild(document.createTextNode(translate.WIDGET.HIDE));
    input_search.placeholder = translate.WIDGET.SEARCH;
    if(sessionStorage.getItem('poweredBy') && sessionStorage.getItem('poweredBy')=== 'true'){
      var poweredBy = '<p class="poweredBy">Powered by <a href="https://www.myanswers.io/" target="_blank">MyAnswers.io</a></p>';
      widget_footer.insertAdjacentHTML('beforeEnd', poweredBy);
    }
// WIDGET

// LIVE CHAT
    if (LIVECHATLINK) {
      var live_chat = document.createElement('div');
      live_chat.className = 'widget-live-chat';
      body.parentNode.insertBefore(live_chat, body.nextSibling);
      var liveChatLink = ('https:' === document.location.protocol ? 'https://' : 'http://') + LIVECHATLINK;
      // button live chat
      button_liveChat = document.createElement('button');
      button_liveChat.className = 'widget-btn-liveChat';
      button_liveChat.appendChild(document.createTextNode("Live Chat"));
      widget_footer.appendChild(button_liveChat);
      // live chat iframe
      liveChat_iframe = document.createElement('iframe');
      liveChat_iframe.className = 'widget-iframe';
      liveChat_iframe.src = liveChatLink;
      liveChat_iframe.scrolling = "no";
      live_chat.appendChild(liveChat_iframe);
      //button close live chat
      button_close_liveChat = document.createElement('button');
      button_close_liveChat.className = 'widget-iframe-close';
      button_close_liveChat.appendChild(document.createTextNode("x"));
      live_chat.appendChild(button_close_liveChat);
      // divider
      var divider = document.createElement('div');
      divider.className = 'widget-divider';
      button_liveChat.parentNode.insertBefore(divider, button_liveChat);
      // tooltip
      button_close_liveChat.classList.add("widget-tooltip");
      var btn_close_liveChat_tooltiptext = document.createElement('span');
      button_close_liveChat.appendChild(btn_close_liveChat_tooltiptext);
      btn_close_liveChat_tooltiptext.appendChild(document.createTextNode(translate.WIDGET.CLOSE_LIVE_CHAT));
      btn_close_liveChat_tooltiptext.className = 'widget-tooltiptext';
      //tooltip
      button_liveChat.addEventListener('click', function () {
        sessionStorage.setItem('showlivechatic', 'true');
        widget.style.display = "none";
        button_help.style.display = "none";
        live_chat.style.display = "block";
      });

      button_close_liveChat.addEventListener('click', function () {
        sessionStorage.removeItem('showlivechatic');
        input_search.value = '';
        cleanListOfQuestions();
        widget.style.display = "none";
        button_help.style.display = "block";
        live_chat.style.display = "none";
      });
    }
    if (sessionStorage.getItem('showlivechatic')) {
      widget.style.display = "none";
      button_help.style.display = "none";
      live_chat.style.display = "block";
    }
// LIVE CHAT


    setInterval(function () {
      if ((target_location_url == 'undefined') || (target_location_url !== window.location.href)) {
        target_location_url = window.location.href;
        if (window.location.pathname !== "/") {
          if (window.location.hash.length) {
            target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm);
            let target_hash = window.location.hash.match(/[0-9a-zA-Z]+/gm);
            let search_parameters = target_location.concat(target_hash);
            target_location = search_parameters.join(' ');
          } else {
            target_location = window.location.pathname.match(/[0-9a-zA-Z]+/gm).join(' ');
          }
          search_by_algolia(target_location);
        } else {
          input_search.value = '';
          cleanListOfQuestions();
        }
      }
    }, 1000);

    button_help.addEventListener('click', function () {
      widget.style.display = "block";
      button_help.style.display = "none";
    });

    button_close.addEventListener('click', function () {
      input_search.value = '';
      cleanListOfQuestions();
      widget.style.display = "none";
      button_help.style.display = "block";
    });


    input_search.addEventListener('input', function () {
      if (input_search.value.length > 0) {
        search_by_algolia(input_search.value);
      } else {
        cleanListOfQuestions();
      }
    });

    view_more.addEventListener('click', function () {
      view_more.style.display = 'none';
      hide.style.display = 'block';
      for (var i = 3; i < listView.children.length; i++) {
        listView.children[i].style.display = "list-item";
      }
    });

    hide.addEventListener('click', function () {
      hide.style.display = 'none';
      view_more.style.display = 'block';
      for (var i = 3; i < listView.children.length; i++) {
        listView.children[i].style.display = "none";
      }
    });

    function search_by_algolia(item) {
      var stopWordsNL = localStorage['stopWordsNL'];
      var stopWordsEN = localStorage['stopWordsEN'];
      var stopWordsFR = localStorage['stopWordsFR'];
      var stopWordsDE = localStorage['stopWordsDE'];
      var search = checkStopWords(item, stopWordsNL);
      search = checkStopWords(search, stopWordsEN);
      search = checkStopWords(search, stopWordsFR);
      var algoliasearch = checkStopWords(search, stopWordsDE);
      INDEX.search(algoliasearch, {
        hitsPerPage: 50,
        optionalWords: algoliasearch,
        queryType: 'prefixLast',
        removeStopWords: ["nl", "en"]
      }, function searchCallback(err, content) {
        if (err) {
          console.error(err);
          return;
        }
        cleanListOfQuestions();
        if (algoliasearch === '') {
          top_result = document.createElement('p');
          top_result.appendChild(document.createTextNode(translate.WIDGET.NO_RESULTS));
          top_result.className = 'widget-top-results';
          // top_result.style.display = 'none';
          result_of_question.appendChild(top_result);
          // top_result.style.display = 'block';
        } else {
          // top_result.style.display = 'none';
          result_of_question.appendChild(createListOfQuestions(content));

          if (content.hits.length > 0) {
            top_result = document.createElement('p');
            top_result.appendChild(document.createTextNode(translate.WIDGET.TOP_RESULTS));
            top_result.className = 'widget-top-results';
            result_of_question.lastElementChild.parentNode.insertBefore(top_result, result_of_question.lastElementChild);
          }
          if (content.hits.length < 1) {
            // top_result.style.display = 'block';
            top_result = document.createElement('p');
            top_result.appendChild(document.createTextNode(translate.WIDGET.NO_RESULTS));
            top_result.className = 'widget-top-results';
            // top_result.style.display = 'none';
            result_of_question.appendChild(top_result);
          }
          if (content.hits.length > 3) {
            result_of_question.lastElementChild.parentNode.insertBefore(hide, result_of_question.lastElementChild.nextSibling);
            result_of_question.lastElementChild.parentNode.insertBefore(view_more, result_of_question.lastElementChild.nextSibling);
            hide.style.display = 'none';
            view_more.style.display = 'block';
          }
        }
      });
    }

    function createListOfQuestions(content) {
      listView = document.createElement('ol');
      for (var i = 0; i < content.hits.length; i++) {
        var listViewItem = document.createElement('li');
        var item_href = document.createElement('a');
        item_href.appendChild(document.createTextNode(content.hits[i].question));
        item_href.href = FAQ_URL + content.hits[i].objectID;
        item_href.setAttribute('target', '_blank');
        listViewItem.appendChild(item_href);
        listView.appendChild(listViewItem);
      }
      // Show the first three items
      for (var j = 3; j < listView.children.length; j++) {
        listView.children[j].style.display = "none";
      }
      return listView;
    }

    function cleanListOfQuestions() {
      while (result_of_question.firstChild) {
        result_of_question.removeChild(result_of_question.firstChild);
      }
    }

    function checkStopWords(item, stopWordsList) {
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
  }

  function addSpecStyle(styleObject){
    var style = '';
    var widgetstyleNode = document.createElement('style');

    if (!Array.isArray(styleObject)) {
      styleObject = [styleObject];
    }

    styleObject.forEach(function (item)  {
      var hasSelector = typeof item.selector === 'string' && !!item.selector.length;
      var hasStyles = typeof item.styles === 'object' && item.styles !== null;
      if (!hasSelector || !hasStyles) {
        return;
      }

      style = style + " " + item.selector + " { ";

      for (var key in item.styles) {
        style = style + " " + key + ": " + item.styles[key] + ";";
      }
      style = style + " }";
    });

    widgetstyleNode.type = 'text/css';
    widgetstyleNode.textContent = style;
    document.head.appendChild(widgetstyleNode);
  };

  function generateHttpRequest(r_url, r_method, callback, subdomain, data) {
    var xhr = new XMLHttpRequest(),
      method = r_method,
      url = r_url;
    xhr.open(method, url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    if(subdomain){
      xhr.setRequestHeader('Client-Subdomain', subdomain);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        if (typeof callback === 'function') {
          callback.apply(xhr);
        }
      }
    };
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  }
})();
