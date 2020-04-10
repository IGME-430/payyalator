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
                <h3 className="firstname">Firstname: {profile.firstname}</h3>
                <h3 className="lastname">Lastname: {profile.lastname}</h3>
                <label htmlFor="subscribed">Subscribed</label>
                <input type="checkbox" id="subscribed" />
                {/*<h3 className="subscribed">Subscribed: {profile.subscribed}</h3>*/}
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

const loadProfileFromServer = (csrf) => {
    sendAjax('GET', '/getProfile', null, (data) => {
        let profile = data.profile;

        ReactDOM.render(
            <ProfileForm csrf={csrf} profile={profile}/>, document.querySelector("#editProfile")
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