"use strict";

var handleEntry = function handleEntry(e) {
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

var removeEntry = function removeEntry(e) {
  e.preventDefault();
  var entry = e.target.querySelectorAll("h3")[0].innerText.split(":")[1].replace(' ', '');
  var removalData = "name=".concat(entry, "&");
  removalData += $("[id=".concat(e.target.id, "]")).serialize();
  sendAjax('POST', $("[id=".concat(e.target.id, "]")).attr("action"), removalData, function () {
    getToken();
  });
  return false;
};

var EntryForm = function EntryForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "entryForm",
    onSubmit: handleEntry,
    name: "entryForm",
    action: "/addEntry",
    method: "POST",
    className: "entryForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "year"
  }, "Year: "), /*#__PURE__*/React.createElement("select", {
    id: "entryYear",
    name: "year"
  }, /*#__PURE__*/React.createElement("option", {
    value: "2020"
  }, "2020"), /*#__PURE__*/React.createElement("option", {
    value: "2021"
  }, "2021"), /*#__PURE__*/React.createElement("option", {
    value: "2022"
  }, "2022"), /*#__PURE__*/React.createElement("option", {
    value: "2023"
  }, "2023"), /*#__PURE__*/React.createElement("option", {
    value: "2024"
  }, "2024"), /*#__PURE__*/React.createElement("option", {
    value: "2025"
  }, "2025")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "month"
  }, "Month: "), /*#__PURE__*/React.createElement("select", {
    id: "entryMonth",
    name: "month"
  }, /*#__PURE__*/React.createElement("option", {
    value: "jan"
  }, "January"), /*#__PURE__*/React.createElement("option", {
    value: "feb"
  }, "February"), /*#__PURE__*/React.createElement("option", {
    value: "mar"
  }, "March"), /*#__PURE__*/React.createElement("option", {
    value: "apr"
  }, "April"), /*#__PURE__*/React.createElement("option", {
    value: "may"
  }, "May"), /*#__PURE__*/React.createElement("option", {
    value: "jun"
  }, "June"), /*#__PURE__*/React.createElement("option", {
    value: "jul"
  }, "July"), /*#__PURE__*/React.createElement("option", {
    value: "aug"
  }, "August"), /*#__PURE__*/React.createElement("option", {
    value: "sep"
  }, "September"), /*#__PURE__*/React.createElement("option", {
    value: "oct"
  }, "October"), /*#__PURE__*/React.createElement("option", {
    value: "nov"
  }, "November"), /*#__PURE__*/React.createElement("option", {
    value: "dec"
  }, "December")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "category"
  }, "Category: "), /*#__PURE__*/React.createElement("select", {
    id: "entryCategory",
    name: "category"
  }, /*#__PURE__*/React.createElement("option", {
    value: "fuel"
  }, "Fuel"), /*#__PURE__*/React.createElement("option", {
    value: "food"
  }, "Food"), /*#__PURE__*/React.createElement("option", {
    value: "accommodation"
  }, "Accommodation"), /*#__PURE__*/React.createElement("option", {
    value: "entertainment"
  }, "Entertainment"), /*#__PURE__*/React.createElement("option", {
    value: "other"
  }, "Other")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "item"
  }, "Item: "), /*#__PURE__*/React.createElement("input", {
    id: "entryItem",
    type: "text",
    name: "item",
    placeholder: "Entry Item"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount"
  }, "Amount: "), /*#__PURE__*/React.createElement("input", {
    id: "entryAmount",
    type: "number",
    name: "amount",
    placeholder: "0.00"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "entrySubmit",
    type: "submit",
    value: "Submit Entry"
  }));
};

var EntryList = function EntryList(props) {
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "entryList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyEntry"
    }, "No Entries yet"));
  }

  var entryNodes = props.entries.map(function (entry) {
    return /*#__PURE__*/React.createElement("form", {
      id: entry.year + entry.month + entry.category + entry.item,
      key: entry.id,
      onSubmit: removeEntry,
      name: "budgetEntry",
      action: "/remover",
      method: "POST",
      className: "budgetEntry"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "entryYear"
    }, "Year: ", entry.year), /*#__PURE__*/React.createElement("h3", {
      className: "entryMonth"
    }, "Month: ", entry.month), /*#__PURE__*/React.createElement("h3", {
      className: "entryCategory"
    }, "Category: ", entry.category), /*#__PURE__*/React.createElement("h3", {
      className: "entryItem"
    }, "Item: ", entry.item), /*#__PURE__*/React.createElement("h3", {
      className: "entryAmount"
    }, "Amount: ", entry.amount), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "removeEntrySubmit",
      type: "submit",
      value: "Remove Entry"
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "entryList"
  }, entryNodes);
};

var loadEntriesFromServer = function loadEntriesFromServer(csrf) {
  sendAjax('GET', '/getEntries', null, function (data) {
    var entries = data.entries;
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
      csrf: csrf,
      entries: entries
    }), document.querySelector("#entries"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
    csrf: csrf
  }), document.querySelector("#addEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
    entries: []
  }), document.querySelector("#entries"));
  loadEntriesFromServer(csrf);
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
