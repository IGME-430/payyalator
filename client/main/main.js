const handleEntry = (e) => {
    e.preventDefault();

    // $("#domoMessage").animate({width: 'hide'}, 350);

    if ($("#entryDate").val() === '' || $("#entryCategory").val() === '' || $("#entryItem").val() === '' || $("#entryAmount").val() === 0.00 ) {
        handleError("RAWR! All fields are required");
        return false;
    }

    if (
        $("#entryCategory").val().indexOf(' ') > 0 ||
        $("#entryItem").val().indexOf(' ') > 0) {
        handleError("RAWR! No spaces allowed in names.");
        return false;
    }

    sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
        getToken();
    });

    return false;
};

const removeEntry = (e) => {
    e.preventDefault();

    let entry = e.target.querySelectorAll("h3")[0].innerText.split(":")[1].replace(' ','');

    let removalData = `name=${entry}&`;
    removalData += $(`[id=${e.target.id}]`).serialize();

    sendAjax(
        'POST',
        $(`[id=${e.target.id}]`).attr("action"),
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
            <label htmlFor="year">Year: </label>
            <select id="entryYear" name="year">
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>
            <label htmlFor="month">Month: </label>
            <select id="entryMonth" name="month">
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
            <label htmlFor="category">Category: </label>
            <select id="entryCategory" name="category">
                <option value="fuel">Fuel</option>
                <option value="food">Food</option>
                <option value="accommodation">Accommodation</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
            </select>
            <label htmlFor="item">Item: </label>
            <input id="entryItem" type="text" name="item" placeholder="Entry Item"/>
            <label htmlFor="amount">Amount: </label>
            <input id="entryAmount" type="number" name="amount" placeholder="0.00"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="entrySubmit" type="submit" value="Submit Entry"/>
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

    const entryNodes = props.entries.map(function (entry) {
        return (
            <form id={entry.year + entry.month + entry.category + entry.item}
                  key={entry.id}
                  onSubmit={removeEntry}
                  name="budgetEntry"
                  action="/remover"
                  method="POST"
                  className="budgetEntry"
            >
                <h3 className="entryYear">Year: {entry.year}</h3>
                <h3 className="entryMonth">Month: {entry.month}</h3>
                <h3 className="entryCategory">Category: {entry.category}</h3>
                <h3 className="entryItem">Item: {entry.item}</h3>
                <h3 className="entryAmount">Amount: {entry.amount}</h3>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="removeEntrySubmit" type="submit" value="Remove Entry"/>
            </form>
        );
    });

    return (
        <div className="entryList">
            {entryNodes}
        </div>
    );
};

const loadEntriesFromServer = (csrf) => {
    sendAjax('GET', '/getEntries', null, (data) => {
        let entries = data.entries;

        ReactDOM.render(
            <EntryList csrf={csrf} entries={entries}/>, document.querySelector("#entries")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <EntryForm csrf={csrf} />, document.querySelector("#addEntry")
    );

    ReactDOM.render(
        <EntryList entries={[]} />, document.querySelector("#entries")
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