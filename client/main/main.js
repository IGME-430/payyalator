const handleEntry = (e) => {
  e.preventDefault();

  if ($("#entryYear").val() === '' ||
    $("#entryMonth").val() === '' ||
    $("#entryCategory").val() === '' ||
    $("#entryItem").val() === '' ||
    $("#entryAmount").val() === 0.00) {
    handleEntryError("All fields are required");

    return false;
  }

  if ($("#entryCategory").val().indexOf(' ') > 0 ||
    $("#entryItem").val().indexOf(' ') > 0) {
    handleEntryError("No spaces allowed in names.");

    return false;
  }

  if (parseInt($("#nrOfEntries").val()) >= 10 && $("#subscribed").val() === "false") {
    handleEntryError("You have reached your entry limit.  Subscribe in" +
      " the profile page to add more than 10 entries");

    return false;
  }

  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    getToken();
  });

  return false;
};

const removeEntry = (e) => {
  e.preventDefault();

  let children = e.target.parentElement.children;
  let removalData = `year=${children[0].innerText}&`;
  removalData += `month=${children[1].innerText}&`;
  removalData += `category=${children[2].innerText}&`;
  removalData += `item=${children[3].innerText}&`;
  children[3].innerText = '';
  removalData += `amount=${parseFloat(children[4].innerText)}&`;
  children[4].innerText = 0.00;
  removalData += `_csrf=${children[5].value}`;

  sendAjax(
    'POST',
    '/removeEntry',
    removalData,
    function () {
      getToken();
    }
  );

  return false;
};

const EntryForm = (props) => {
  return (
    <form id="entryForm"
          onSubmit={handleEntry}
          name="entryForm"
          action="/addEntry"
          method="POST"
          className="entryForm"
    >
      <label class="entryFormElement" htmlFor="year">Year: </label>
      <select class="entryFormElement" id="entryYear" name="year">
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
      <label class="entryFormElement" htmlFor="month">Month: </label>
      <select class="entryFormElement" id="entryMonth" name="month">
        <option value="jan">January</option>
        <option value="feb">February</option>
        <option value="mar">March</option>
        <option value="apr">April</option>
        <option value="may">May</option>
        <option value="jun">June</option>
        <option value="jul">July</option>
        <option value="aug">August</option>
        <option value="sep">September</option>
        <option value="oct">October</option>
        <option value="nov">November</option>
        <option value="dec">December</option>
      </select>
      <label class="entryFormElement" htmlFor="category">Category: </label>
      <select class="entryFormElement" id="entryCategory" name="category">
        <option value="fuel">Fuel</option>
        <option value="food">Food</option>
        <option value="accommodation">Accommodation</option>
        <option value="entertainment">Entertainment</option>
        <option value="other">Other</option>
      </select>
      <label class="entryFormElement" htmlFor="item">Item: </label>
      <input class="entryFormElement" id="entryItem" type="text" name="item" placeholder="Entry Item"/>
      <div class="amountClass">
        <label class="entryFormElement" htmlFor="amount">Amount: </label>
        <input class="entryFormElement" id="entryAmount" type="number" name="amount" placeholder="0.00"/>
      </div>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input id="nrOfEntries" type="hidden" name="nrOfEntries" value=""/>
      <input id="subscribed" type="hidden" name="subscribed" value=""/>
      <input className="entrySubmit entryFormElement" type="submit" value="Submit Entry"/>
      <p id="entryErrorParagraph"><span id="entryError"></span></p>
    </form>
  );
};

const EntryList = function (props) {
  if (props.entries.length === 0) {
    return (
      <div className="entryList">
        <h3 className="emptyEntry">No Entries yet</h3>
      </div>
    );
  }

  document.querySelector("#nrOfEntries").value = props.entries.length;

  // Build the table entries
  const entryNodes = props.entries.map((entry, index) => {
    const {year, month, category, item, amount} = entry
    return (
      <tr key={index}>
        <td>{year}</td>
        <td>{month}</td>
        <td>{category}</td>
        <td>{item}</td>
        <td>{amount}</td>
        <input type='hidden' name='_csrf' value={props.csrf}/>
        <input id='trashButton' className='removeEntrySubmit' type='image' src='/assets/img/trash.png'
               alt="Submit"/>
      </tr>
    );
  });

  // Build the header
  let header = (Object.keys(props.entries[0])).slice(1, 6);
  const tableHeader = header.map((key, index) => {
    return (
      <th key={index}>{key.toUpperCase()}</th>
    )
  });

  // Total expenses
  let totalExpenses = 0;
  for (let idx in props.entries) {
    totalExpenses += props.entries[idx].amount;
  }

  // Return the combined table
  return (
    <div class="scrollbarStyles">
      <h1 id='title'>Budget Breakdown</h1>
      <div id='entries'>
        <tbody id='tableBody'>
        <tr>{tableHeader}</tr>
        {entryNodes}
        <tr id='totalRow'>
          <td></td>
          <td></td>
          <td></td>
          <td>Total</td>
          <td>{totalExpenses}</td>
        </tr>
        </tbody>
      </div>
    </div>
  );
}

const SummaryList = function (props) {
  if (props.entries.length === 0) {
    return (
      <div className="summaryList">
        <h3 className="emptyEntry">No Entries yet</h3>
      </div>
    );
  }

  let sumList = {}

  for (let obj of props.entries) {
    if (!(obj['category'] in sumList)) {
      sumList[obj['category']] = 0
      sumList[obj['category']] += obj['amount']
    } else {
      sumList[obj['category']] += obj['amount']
    }
  }

  // Build the table entries
  const entryNodes = Object.keys(sumList).map((entry, index) => {
    return (
      <tr key={index}>
        <td>{entry}</td>
        <td>{sumList[entry]}</td>
        <input type='hidden' name='_csrf' value={props.csrf}/>
      </tr>
    );
  });

  // Total expenses
  let totalExpenses = 0;
  for (let idx in props.entries) {
    totalExpenses += props.entries[idx].amount;
  }

  // Return the combined table
  return (
    <div class="scrollbarStyles">
      <h1 id='title'>Budget Summary</h1>
      <div id='entries'>
        <tbody id='tableBody'>
        <tr>
          <th>CATEGORY</th>
          <th>AMOUNT</th>
        </tr>
        {entryNodes}
        <tr id='totalRow'>
          <td>Total</td>
          <td>{totalExpenses}</td>
        </tr>
        </tbody>
      </div>
    </div>
  );
}

const attachButton = () => {
  const trashButtons = document.querySelectorAll("#trashButton");

  for (let button of trashButtons) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      removeEntry(e);
      return false;
    });
  }
};

const loadEntriesFromServer = (csrf) => {
  sendAjax('GET', '/getEntries', null, (data) => {
    let entries = data.entries;

    ReactDOM.render(
      <EntryList csrf={csrf} entries={entries}/>, document.querySelector("#breakdownContainer"),
      () => {
        attachButton();
      }
    );

    ReactDOM.render(
      <SummaryList entries={entries}/>, document.querySelector("#summaryContainer")
    );
  });

  sendAjax('GET', '/isSubscribed', null, (result) => {
    document.querySelector("#subscribed").value = result.subscribed[0].subscribed;
  });
};

const setup = function (csrf) {
  ReactDOM.render(
    <EntryForm csrf={csrf}/>, document.querySelector("#addEntryContainer")
  );

  ReactDOM.render(
    <EntryList entries={[]}/>, document.querySelector("#breakdownContainer")
  );

  ReactDOM.render(
    <SummaryList entries={[]}/>, document.querySelector("#summaryContainer")
  );

  loadEntriesFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});