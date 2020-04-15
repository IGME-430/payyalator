"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() === '' && $("#pass").val() === '') {
    handleMessage("loginError", "Username and password is empty");
    return false;
  } else if ($("#user").val() === '') {
    handleMessage("loginError", "Username is empty");
    return false;
  } else if ($("#pass").val() === '') {
    handleMessage("loginError", "Password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '') {
    handleMessage("signupError", "All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleMessage("signupError", "Passwords do not match");
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
    "class": "errorParagraph",
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
  }), /*#__PURE__*/React.createElement("p", {
    "class": "errorParagraph",
    id: "signupErrorParagraph"
  }, /*#__PURE__*/React.createElement("span", {
    id: "signupError"
  })));
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

var updateAttributes = function updateAttributes(component, message, messageType) {
  if (messageType === "error") {
    component.attr("style", "display: inline;");
    component.attr("aria-invalid", "true");
    component.css("background", "#FFECEC url('/assets/img/cross_small.png') no-repeat 15px 50%");
    component.css("background-size", "15px");
    component.css("border", "2px solid #F5ACA6");
    component.html("&nbsp; <b>ERROR</b> - " + message);
  } else if (messageType === "informative") {
    component.attr("style", "display: inline;");
    component.attr("aria-invalid", "true");
    component.css("background", "#9FF4A1 url('/assets/img/checkmark_small.png') no-repeat 10px 50%");
    component.css("background-size", "15px");
    component.css("border", "2px solid #108E00");
    component.html("&nbsp; <b>SUCCESS</b> - " + message);
  }
};

var handleMessage = function handleMessage(messageType, message) {
  var component;

  switch (messageType) {
    case "loginError":
      component = $("#loginError");
      updateAttributes(component, message, "error");
      break;

    case "signupError":
      component = $("#signupError");
      updateAttributes(component, message, "error");
      break;

    case "entryError":
      component = $("#entryError");
      updateAttributes(component, message, "error");
      break;

    case "passwordError":
      component = $("#passwordError");
      updateAttributes(component, message, "error");
      break;

    case "passwordUpdated":
      component = $("#passwordError");
      updateAttributes(component, message, "informative");
      break;

    default:
      console.log("An unknown error occurred");
  }

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
          handleMessage("loginError", messageObj.error);
          break;

        case "Bad Request":
          handleMessage("signupError", messageObj.error);
          break;

        default:
          console.log(messageObj.error);
      }
    }
  });
};
