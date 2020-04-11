const updateProfile = (e) => {
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

const updateSubscription = (e) => {
    e.preventDefault();

    let subscriptionData = `subscribed=${e.target.checked}&`;
    subscriptionData += `_csrf=${e.target.parentElement.children['_csrf'].value}`;

    sendAjax(
        'POST',
        '/updateSubscription',
        subscriptionData,
        function () {
            getToken();
        }
    );

    return false;
}

const ProfileForm = function (props) {
    if (props.profile.length === 0) {
        return <div className="editProfile">
            <h3 className="emptyProfile">No Profile Information</h3>
        </div>
    }

    const profile = props.profile.map(function (profile) {
        return (
            <form id="userProfile"
                  onSubmit={updateProfile}
                  action="/updateProfile"
                  mothod="POST"

            >
                <h3 className="username" disabled="true">Username: {profile.username}</h3>
                <h4 className="firstname">Firstname: {profile.firstname}</h4>
                <h4 className="lastname">Lastname: {profile.lastname}</h4>
                <label htmlFor="subscribed">Subscribed</label>
                <input type="checkbox" id="subscribed" />
                <input type="hidden" name="_csrf" value={props.csrf}/>
            </form>
        );
    });

    return (
        <div className="editProfile">
            {profile}
        </div>
    );
};

const attachSubscriptionCheck = () => {
    const subCheck = document.querySelector("#subscribed");

    subCheck.addEventListener("click", (e) => {
        e.preventDefault();
        updateSubscription(e);
        return false;
    });
};

const loadProfileFromServer = (csrf) => {
    sendAjax('GET', '/getProfile', null, (data) => {
        let profile = data.profile;

        ReactDOM.render(
            <ProfileForm csrf={csrf} profile={profile}/>, document.querySelector("#editProfile"),
            () => {
                attachSubscriptionCheck();
            }
        );

        document.querySelector("#subscribed").checked = profile[0].subscribed;
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <ProfileForm csrf={csrf} profile={[]} />, document.querySelector("#editProfile")
    );

    loadProfileFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});