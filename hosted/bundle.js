"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() === '' || $("#domoAge").val() === '' || $("#domoLevel").val() === '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#domoName").val().indexOf(' ') > 0) {
    handleError("RAWR! No spaces allowed in names.");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    getToken();
  });
  return false;
};

var removeDomo = function removeDomo(e) {
  e.preventDefault();
  var domoName = e.target.querySelectorAll("h3")[0].innerText.split(":")[1].replace(' ', '');
  var removalData = "name=".concat(domoName, "&");
  removalData += $("[id=".concat(e.target.id, "]")).serialize();
  sendAjax('POST', $("[id=".concat(e.target.id, "]")).attr("action"), removalData, function () {
    getToken();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  }), React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), React.createElement("label", {
    htmlFor: "level"
  }, "Level: "), React.createElement("input", {
    id: "domoLevel",
    type: "text",
    name: "level",
    placeholder: "Domo Level"
  }), React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement("div", {
      className: "domoList"
    }, React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement("form", {
      id: domo.name // <form id="domoEntry"
      ,
      key: domo._id,
      onSubmit: removeDomo,
      name: "domoEntry",
      action: "/remover",
      method: "POST",
      className: "domoEntry"
    }, React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name), React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age), React.createElement("h3", {
      className: "domoLevel"
    }, "Level: ", domo.level), React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), React.createElement("input", {
      className: "removeDomoSubmit",
      type: "submit",
      value: "Remove Domo"
    }));
  });
  return React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', null, function (data) {
    var domos = data.domos;
    ReactDOM.render(React.createElement(DomoList, {
      csrf: csrf,
      domos: domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render(React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
