"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  }), /*#__PURE__*/React.createElement("div", {
    "class": "amountClass"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount"
  }, "Amount: "), /*#__PURE__*/React.createElement("input", {
    id: "entryAmount",
    type: "number",
    name: "amount",
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement("input", {
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
  } // Build the table entries


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
      className: "removeEntrySubmit",
      type: "image",
      src: "/assets/img/trash.png",
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


  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    id: "title"
  }, "Budget Breakdown"), /*#__PURE__*/React.createElement("div", {
    id: "entries"
  }, /*#__PURE__*/React.createElement("tbody", {
    id: "tableBody"
  }, /*#__PURE__*/React.createElement("tr", null, tableHeader), entryNodes, /*#__PURE__*/React.createElement("tr", {
    id: "totalRow"
  }, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, "Total"), /*#__PURE__*/React.createElement("td", null, totalExpenses)))));
};

var SummaryList = function SummaryList(props) {
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "summaryList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyEntry"
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


  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    id: "title"
  }, "Budget Summary"), /*#__PURE__*/React.createElement("div", {
    id: "entries"
  }, /*#__PURE__*/React.createElement("tbody", {
    id: "tableBody"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CATEGORY"), /*#__PURE__*/React.createElement("th", null, "AMOUNT")), entryNodes, /*#__PURE__*/React.createElement("tr", {
    id: "totalRow"
  }, /*#__PURE__*/React.createElement("td", null, "Total"), /*#__PURE__*/React.createElement("td", null, totalExpenses)))));
};

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
};

var loadEntriesFromServer = function loadEntriesFromServer(csrf) {
  sendAjax('GET', '/getEntries', null, function (data) {
    var entries = data.entries;
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
      csrf: csrf,
      entries: entries
    }), document.querySelector("#entries"), function () {
      attachButton();
    });
    ReactDOM.render( /*#__PURE__*/React.createElement(SummaryList, {
      entries: entries
    }), document.querySelector("#summary"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
    csrf: csrf
  }), document.querySelector("#addEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, {
    entries: []
  }), document.querySelector("#entries"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SummaryList, {
    entries: []
  }), document.querySelector("#summary"));
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
