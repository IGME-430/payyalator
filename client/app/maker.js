const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if ($("#domoName").val() === '' || $("#domoAge").val() === '' || $("#domoLevel").val() === '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    if ($("#domoName").val().indexOf(' ') > 0) {
        handleError("RAWR! No spaces allowed in names.");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        getToken();
    });

    return false;
};

const removeDomo = (e) => {
    e.preventDefault();

    let domoName = e.target.querySelectorAll("h3")[0].innerText.split(":")[1].replace(' ','');

    let removalData = `name=${domoName}&`;
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

const DomoForm = (props) => {
    return (
        <form id="domoForm"
              onSubmit={handleDomo}
              name="domoForm"
              action="/maker"
              method="POST"
              className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <form id={domo.name}
            // <form id="domoEntry"
                  key={domo._id}
                  onSubmit={removeDomo}
                  name="domoEntry"
                  action="/remover"
                  method="POST"
                  className="domoEntry"
            >
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="removeDomoSubmit" type="submit" value="Remove Domo"/>
            </form>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {

        let domos = data.domos;

        ReactDOM.render(
            <DomoList csrf={csrf} domos={domos}/>, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]}/>, document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});