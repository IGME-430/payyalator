"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() === '' && $("#pass").val() === '') {
    handleLoginError("Username and password is empty");
    return false;
  } else if ($("#user").val() === '') {
    handleLoginError("Username is empty");
    return false;
  } else if ($("#pass").val() === '') {
    handleLoginError("Password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    "class": "userLabelLogin",
    htmlFor: "username"
  }, "Username:"), /*#__PURE__*/React.createElement("input", {
    "class": "userInputLogin",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "passLabelLogin",
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "passInputLogin",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit signIn",
    type: "submit",
    value: "Sign in"
  }), /*#__PURE__*/React.createElement("p", {
    id: "loginErrorParagraph"
  }, /*#__PURE__*/React.createElement("span", {
    id: "loginError"
  })));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    "class": "firstnameLabelReg",
    htmlFor: "firstname"
  }, "Firstname: "), /*#__PURE__*/React.createElement("input", {
    "class": "firstnameInputReg",
    id: "firstn",
    type: "text",
    name: "firstname",
    placeholder: "firstname"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "lastnameLabelReg",
    htmlFor: "lastname"
  }, "Lastname: "), /*#__PURE__*/React.createElement("input", {
    "class": "lastnameInputReg",
    id: "lastn",
    type: "text",
    name: "lastname",
    placeholder: "lastname"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "usernameLabelReg",
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    "class": "usernameInputReg",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "password1LabelReg",
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "password1InputReg",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "password2LabelReg",
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "password2InputReg",
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit signUp",
    type: "submit",
    value: "Sign Up"
  }));
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); // default view
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

var handleLoginError = function handleLoginError(message) {
  $("#loginError").attr("style", "display: inline;");
  $("#loginError").attr("aria-invalid", "true");
  $("#loginError").html("&nbsp; <b>ERROR</b> - " + message);
  $("#user").attr("aria-invalid", "true");
};

var handleEntryError = function handleEntryError(message) {
  $("#entryError").attr("style", "display: inline;");
  $("#entryError").attr("aria-invalid", "true");
  $("#entryError").html("&nbsp; <b>ERROR</b> - " + message);
  $("#user").attr("aria-invalid", "true");
};

var redirect = function redirect(response) {
  $("#errorMessage").animate({
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

      switch (_error) {
        case "Unauthorized":
          handleLoginError(messageObj.error);

        default:
          console.log(messageObj.error);
      }
    }
  });
};
