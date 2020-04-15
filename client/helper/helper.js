const updateAttributes = (component, message, messageType) => {
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
}

const handleMessage = (messageType, message) => {

  let component;

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

const redirect = (response) => {
  $("#errorMessage").animate({width: 'hide'}, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText)

      switch (error) {
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