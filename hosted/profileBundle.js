"use strict";

var updateProfile = function updateProfile(e) {
  e.preventDefault(); // $("#domoMessage").animate({width: 'hide'}, 350);

  if ($("#entryDate").val() === '' || $("#entryCategory").val() === '' || $("#entryItem").val() === '' || $("#entryAmount").val() === 0.00) {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#entryCategory").val().indexOf(' ') > 0 || $("#entryItem").val().indexOf(' ') > 0) {
    handleError("RAWR! No spaces allowed in names.");
    return false;
  }

  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    getToken();
  });
  return false;
};

var updateSubscription = function updateSubscription(e) {
  e.preventDefault();
  var subscriptionData = "subscribed=".concat(e.target.checked, "&");
  subscriptionData += "_csrf=".concat(e.target.parentElement.children['_csrf'].value);
  sendAjax('POST', '/updateSubscription', subscriptionData, function () {
    getToken();
  });
  return false;
};

var ProfileForm = function ProfileForm(props) {
  if (props.profile.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "editProfile"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyProfile"
    }, "No Profile Information"));
  }

  var profile = props.profile.map(function (profile) {
    return /*#__PURE__*/React.createElement("form", {
      id: "userProfile",
      onSubmit: updateProfile,
      action: "/updateProfile",
      mothod: "POST"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "username",
      disabled: "true"
    }, "Username: ", profile.username), /*#__PURE__*/React.createElement("h4", {
      className: "firstname"
    }, "Firstname: ", profile.firstname), /*#__PURE__*/React.createElement("h4", {
      className: "lastname"
    }, "Lastname: ", profile.lastname), /*#__PURE__*/React.createElement("label", {
      htmlFor: "subscribed"
    }, "Subscribed"), /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "subscribed"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "editProfile"
  }, profile);
};

var attachSubscriptionCheck = function attachSubscriptionCheck() {
  var subCheck = document.querySelector("#subscribed");
  subCheck.addEventListener("click", function (e) {
    e.preventDefault();
    updateSubscription(e);
    return false;
  });
};

var loadProfileFromServer = function loadProfileFromServer(csrf) {
  sendAjax('GET', '/getProfile', null, function (data) {
    var profile = data.profile;
    ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
      csrf: csrf,
      profile: profile
    }), document.querySelector("#editProfile"), function () {
      attachSubscriptionCheck();
    });
    document.querySelector("#subscribed").checked = profile[0].subscribed;
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
    csrf: csrf,
    profile: []
  }), document.querySelector("#editProfile"));
  loadProfileFromServer(csrf);
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
