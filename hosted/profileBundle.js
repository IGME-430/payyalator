"use strict";

// Change the user password
var changePassword = function changePassword(e) {
  e.preventDefault(); // Ensure the old, new and confirm password fields are populated

  if ($(".oldPasswordInput").val() === '') {
    handleMessage("passwordError", "You did not provide your old password");
    return false;
  } else if ($(".newPasswordInput").val() === '') {
    handleMessage("passwordError", "You did not provide a new password");
    return false;
  } else if ($(".confirmPasswordInput").val() === '') {
    handleMessage("passwordError", "Please confirm your password");
    return false;
  } // Make sure the new and confirm password is the same


  if ($(".newPasswordInput").val() !== $(".confirmPasswordInput").val()) {
    handleMessage("passwordError", "Your new passwords do not match");
    return false;
  }

  var passwordData = "password=".concat($(".oldPasswordInput").val(), "&");
  passwordData += "_csrf=".concat($("#_csrf").val()); // Make sure the old password is correct to ensure someone isn't stealing the account

  sendAjax('POST', '/isValidPwd', passwordData, function (password) {
    if (!password.isValid) {
      handleMessage("passwordError", "Your Old Password does not match the password on file, please try again");
      return false;
    } // If the user knows their old password, request the change to the new password


    sendAjax('GET', '/getToken', null, function (result) {
      var updateData = "newPassword=".concat($(".newPasswordInput").val(), "&");
      updateData += "_csrf=".concat(result.csrfToken);
      sendAjax('POST', '/updatePwd', updateData, function () {
        handleMessage("passwordUpdated", "Password updated successfully");
        $(".oldPasswordInput").val(null);
        $(".newPasswordInput").val(null);
        $(".confirmPasswordInput").val(null);
        jQuery.ready(function () {
          getToken();
        });
      });
    });
  });
}; // Update the user subscription status


var updateSubscription = function updateSubscription(e) {
  e.preventDefault();
  var subscriptionData = "subscribed=".concat(e.target.checked, "&");
  subscriptionData += "_csrf=".concat(e.target.parentElement.children['_csrf'].value);
  sendAjax('POST', '/updateSubscription', subscriptionData, function () {
    getToken();
  });
  return false;
}; // Build the react user profile form


var ProfileForm = function ProfileForm(props) {
  // If there is no profile information, indicate such
  if (props.profile.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      "class": "editProfile"
    }, /*#__PURE__*/React.createElement("h3", {
      "class": "emptyProfile"
    }, "No Profile Information"));
  } // If there is profile data available, render it


  var profile = props.profile.map(function (profile) {
    return /*#__PURE__*/React.createElement("form", {
      id: "userProfile"
    }, /*#__PURE__*/React.createElement("h3", {
      "class": "username",
      disabled: "true"
    }, "Username: ", profile.username), /*#__PURE__*/React.createElement("h4", {
      "class": "firstname"
    }, "Firstname: ", profile.firstname), /*#__PURE__*/React.createElement("h4", {
      "class": "lastname"
    }, "Lastname: ", profile.lastname), /*#__PURE__*/React.createElement("label", {
      htmlFor: "subscribed"
    }, "Subscribed"), /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "subscribed"
    }), /*#__PURE__*/React.createElement("input", {
      id: "_csrf",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }));
  }); // Return the combined profile data

  return /*#__PURE__*/React.createElement("div", {
    "class": "editProfile"
  }, profile);
}; // Build the react password change fields


var PasswordForm = function PasswordForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassword",
    onSubmit: changePassword,
    action: "/changePassword",
    mothod: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    "class": "passwordFormElement oldPasswordLabel"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "passwordFormElement oldPasswordInput",
    type: "password",
    name: "oldPassword",
    placeholder: "Old Password"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "passwordFormElement newPasswordLabel"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "passwordFormElement newPasswordInput",
    type: "password",
    name: "newPassword",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("label", {
    "class": "passwordFormElement confirmPasswordLabel"
  }, "Confirm Password: "), /*#__PURE__*/React.createElement("input", {
    "class": "passwordFormElement confirmPasswordInput",
    type: "password",
    name: "confirmPassword",
    placeholder: "Confirm Password"
  }), /*#__PURE__*/React.createElement("input", {
    "class": "passwordFormElement changePassword",
    type: "submit",
    value: "Change Password"
  }), /*#__PURE__*/React.createElement("p", {
    "class": "errorParagraph",
    id: "passwordErrorParagraph"
  }, /*#__PURE__*/React.createElement("span", {
    id: "passwordError"
  })));
}; // Add the click event listener to the subscription checkbox


var attachSubscriptionCheck = function attachSubscriptionCheck() {
  var subCheck = document.querySelector("#subscribed");
  subCheck.addEventListener("click", function (e) {
    e.preventDefault();
    updateSubscription(e);
    return false;
  });
}; // Get the user profile data from the server


var loadProfileFromServer = function loadProfileFromServer(csrf) {
  sendAjax('GET', '/getProfile', null, function (data) {
    var profile = data.profile; // Render and populate the user profile information

    ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
      csrf: csrf,
      profile: profile
    }), document.querySelector("#profileSection"), function () {
      attachSubscriptionCheck();
    }); // Update the "subscribed" checkbox on the screen to represent the user subscription status

    document.querySelector("#subscribed").checked = profile[0].subscribed;
  });
}; // Render the components to the screen


var setup = function setup(csrf) {
  // Render the user profile fields
  ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
    csrf: csrf,
    profile: []
  }), document.querySelector("#profileSection")); // Render the change password fields

  ReactDOM.render( /*#__PURE__*/React.createElement(PasswordForm, {
    csrf: csrf
  }), document.querySelector("#passwordSection")); // Populate the profile data

  loadProfileFromServer(csrf);
}; // Request a session token and setup the window


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// updates the attributes and provides a message to the user based on the message specification
var updateAttributes = function updateAttributes(component, message, messageType) {
  if (messageType === "error") {
    // Do this if it is an error message
    component.attr("style", "display: inline;");
    component.attr("aria-invalid", "true");
    component.css("background", "#FFECEC url('/assets/img/cross_small.png') no-repeat 15px 50%");
    component.css("background-size", "15px");
    component.css("border", "2px solid #F5ACA6");
    component.html("&nbsp; <b>ERROR</b> - " + message);
  } else if (messageType === "informative") {
    // Do this if it is an informational message
    component.attr("style", "display: inline;");
    component.attr("aria-invalid", "true");
    component.css("background", "#9FF4A1 url('/assets/img/checkmark_small.png') no-repeat 10px 50%");
    component.css("background-size", "15px");
    component.css("border", "2px solid #108E00");
    component.html("&nbsp; <b>SUCCESS</b> - " + message);
  }
}; // Handle the messages requested based on the message type


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
}; // Send an ajax request with the specified properties


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
