const handleLoginError = (message) => {
  $("#loginError").attr("style", "display: inline;");
  $("#loginError").attr("aria-invalid", "true");
  $("#loginError").html("&nbsp; <b>ERROR</b> - " + message);

  $("#user").attr("aria-invalid", "true");
};

const handleEntryError = (message) => {
  $("#entryError").attr("style", "display: inline;");
  $("#entryError").attr("aria-invalid", "true");
  $("#entryError").html("&nbsp; <b>ERROR</b> - " + message);

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
          handleLoginError(messageObj.error);
        default:
          console.log(messageObj.error);
      }
    }
  });
};