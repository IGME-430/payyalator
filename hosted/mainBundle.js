"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Handle the submission of a new entry
var handleEntry = function handleEntry(e) {
  e.preventDefault(); // Confirm that all the required fields are supplied

  if ($("#entryYear").val() === '' || $("#entryMonth").val() === '' || $("#entryCategory").val() === '' || $("#entryItem").val() === '' || $("#entryAmount").val() === 0.00) {
    handleMessage("entryError", "All fields are required");
    return false;
  } // Ensure there is no entry at the beginning of a category or item


  if ($("#entryCategory").val().indexOf(' ') > 0 || $("#entryItem").val().indexOf(' ') > 0) {
    handleMessage("entryError", "No spaces allowed in names.");
    return false;
  } // Determine how many entries the user has.  If the user has 5 entries, inform them
  // if they are not a subscriber that they need to subscribe in order to add more entries


  if (parseInt($("#nrOfEntries").val()) >= 5 && $("#subscribed").val() === "false") {
    handleMessage("entryError", "You have reached your entry limit.  Subscribe in" + " the profile page to add more than 5 entries");
    return false;
  } // Send the entry submission to the server


  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    getToken();
    $("#entryItem").val(null);
    $("#entryAmount").val(null);
  });
  return false;
}; // Remove an entry from the entries list


var removeEntry = function removeEntry(e) {
  e.preventDefault();
  var children = e.target.parentElement.children;
  var removalData = "year=".concat(children[0].innerText, "&");
  removalData += "month=".concat(children[1].innerText, "&");
  removalData += "category=".concat(children[2].innerText, "&");
  removalData += "item=".concat(children[3].innerText, "&");
  children[3].innerText = '';
  removalData += "amount=".concat(parseFloat(children[4].innerText), "&");
  children[4].innerText = 0.00;
  removalData += "_csrf=".concat(children[5].value);
  sendAjax('POST', '/removeEntry', removalData, function () {
    getToken();
  });
  return false;
}; // Build the React data entry template


var EntryForm = function EntryForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "entryForm",
    onSubmit: handleEntry,
    name: "entryForm",
    action: "/addEntry",
    method: "POST",
    "class": "entryForm"
  }, /*#__PURE__*/React.createElement("label", {
    "class": "entryFormElement",
    htmlFor: "year"
  }, "Year: "), /*#__PURE__*/React.createElement("select", {
    "class": "entryFormElement",
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
    "class": "entryFormElement",
    htmlFor: "month"
  }, "Month: "), /*#__PURE__*/React.createElement("select", {
    "class": "entryFormElement",
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
    "class": "entryFormElement",
    htmlFor: "category"
  }, "Category: "), /*#__PURE__*/React.createElement("select", {
    "class": "entryFormElement",
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
    "class": "entryFormElement",
    htmlFor: "item"
  }, "Item: "), /*#__PURE__*/React.createElement("input", {
    "class": "entryFormElement",
    id: "entryItem",
    type: "text",
    name: "item",
    placeholder: "Entry Item"
  }), /*#__PURE__*/React.createElement("div", {
    "class": "amountClass"
  }, /*#__PURE__*/React.createElement("label", {
    "class": "entryFormElement",
    htmlFor: "amount"
  }, "Amount: "), /*#__PURE__*/React.createElement("input", {
    "class": "entryFormElement",
    id: "entryAmount",
    type: "number",
    name: "amount",
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "nrOfEntries",
    type: "hidden",
    name: "nrOfEntries",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "subscribed",
    type: "hidden",
    name: "subscribed",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    "class": "entrySubmit entryFormElement",
    type: "submit",
    value: "Submit Entry"
  }), /*#__PURE__*/React.createElement("p", {
    "class": "errorParagraph",
    id: "entryErrorParagraph"
  }, /*#__PURE__*/React.createElement("span", {
    id: "entryError"
  })));
}; // Build the react detailed table of entries


var EntryList = function EntryList(props) {
  // If there are not entries, indicate such
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      "class": "entryList"
    }, /*#__PURE__*/React.createElement("h3", {
      "class": "emptyEntry"
    }, "No Entries yet"));
  }

  document.querySelector("#nrOfEntries").value = props.entries.length; // Build the table entries

  var entryNodes = props.entries.map(function (entry, index) {
    var year = entry.year,
        month = entry.month,
        category = entry.category,
        item = entry.item,
        amount = entry.amount;
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, year), /*#__PURE__*/React.createElement("td", null, month), /*#__PURE__*/React.createElement("td", null, category), /*#__PURE__*/React.createElement("td", null, item), /*#__PURE__*/React.createElement("td", null, amount), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      id: "trashButton",
      "class": "removeEntrySubmit",
      type: "image",
      src: "/assets/img/trash_small.png",
      alt: "Submit"
    }));
  }); // Build the header

  var header = Object.keys(props.entries[0]).slice(1, 6);
  var tableHeader = header.map(function (key, index) {
    return /*#__PURE__*/React.createElement("th", {
      key: index
    }, key.toUpperCase());
  }); // Total expenses

  var totalExpenses = 0;

  for (var idx in props.entries) {
    totalExpenses += props.entries[idx].amount;
  } // Return the combined table


  return /*#__PURE__*/React.createElement("div", {
    "class": "scrollbarStyles"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "title"
  }, "Budget Breakdown"), /*#__PURE__*/React.createElement("div", {
    id: "entries"
  }, /*#__PURE__*/React.createElement("tbody", {
    id: "tableBody"
  }, /*#__PURE__*/React.createElement("tr", null, tableHeader), entryNodes, /*#__PURE__*/React.createElement("tr", {
    id: "totalRow"
  }, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, "Total"), /*#__PURE__*/React.createElement("td", null, totalExpenses)))));
}; // Build the react summary table of entries


var SummaryList = function SummaryList(props) {
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      "class": "summaryList"
    }, /*#__PURE__*/React.createElement("h3", {
      "class": "emptyEntry"
    }, "No Entries yet"));
  }

  var sumList = {};

  var _iterator = _createForOfIteratorHelper(props.entries),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var obj = _step.value;

      if (!(obj['category'] in sumList)) {
        sumList[obj['category']] = 0;
        sumList[obj['category']] += obj['amount'];
      } else {
        sumList[obj['category']] += obj['amount'];
      }
    } // Build the table entries

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var entryNodes = Object.keys(sumList).map(function (entry, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, entry), /*#__PURE__*/React.createElement("td", null, sumList[entry]), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }));
  }); // Total expenses

  var totalExpenses = 0;

  for (var idx in props.entries) {
    totalExpenses += props.entries[idx].amount;
  } // Return the combined table


  return /*#__PURE__*/React.createElement("div", {
    "class": "scrollbarStyles"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "title"
  }, "Budget Summary"), /*#__PURE__*/React.createElement("div", {
    id: "entries"
  }, /*#__PURE__*/React.createElement("tbody", {
    id: "tableBody"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CATEGORY"), /*#__PURE__*/React.createElement("th", null, "AMOUNT")), entryNodes, /*#__PURE__*/React.createElement("tr", {
    id: "totalRow"
  }, /*#__PURE__*/React.createElement("td", null, "Total"), /*#__PURE__*/React.createElement("td", null, totalExpenses)))));
}; // Add the click even listener to the deletion button


var attachButton = function attachButton() {
  var trashButtons = document.querySelectorAll("#trashButton");

  var _iterator2 = _createForOfIteratorHelper(trashButtons),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var button = _step2.value;
      button.addEventListener("click", function (e) {
        e.preventDefault();
        removeEntry(e);
        return false;
      });
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}; // Get the entry data for all entries made by the user from MongoDB


var loadEntriesFromServer = function loadEntriesFromServer(csrf) {
  sendAjax('GET', '/getEntries', null, function (data) {
    var entries = data.entries; // Render and populate the list of entries

    ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
      csrf: csrf,
      entries: entries
    }), document.querySelector("#breakdownContainer"), function () {
      attachButton();
    }); // Render and populate the summary

    ReactDOM.render( /*#__PURE__*/React.createElement(SummaryList, {
      entries: entries
    }), document.querySelector("#summaryContainer"));
  }); // Determine if the user is a subscriber, and update the subscribed checkbox state

  sendAjax('GET', '/isSubscribed', null, function (result) {
    document.querySelector("#subscribed").value = result.subscribed[0].subscribed;
  });
}; // Render the components on the screen


var setup = function setup(csrf) {
  // Render the form used to make new entries
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
    csrf: csrf
  }), document.querySelector("#addEntryContainer")); // Render the table displaying a list of all entries

  ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
    entries: []
  }), document.querySelector("#breakdownContainer")); // Render the table displaying a summary of all entries

  ReactDOM.render( /*#__PURE__*/React.createElement(SummaryList, {
    entries: []
  }), document.querySelector("#summaryContainer")); // Populate the tables

  loadEntriesFromServer(csrf);
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
