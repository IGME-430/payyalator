const updateProfile = (e) => {
  e.preventDefault();

  if ($("#entryDate").val() === '' ||
    $("#entryCategory").val() === '' ||
    $("#entryItem").val() === '' ||
    $("#entryAmount").val() === 0.00) {
    handleMessage("passwordError", "All fields are required");

    return false;
  }

  if (
    $("#entryCategory").val().indexOf(' ') > 0 ||
    $("#entryItem").val().indexOf(' ') > 0) {
    handleMessage("passwordError", "No spaces allowed in names.");

    return false;
  }

  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    getToken();
  });

  return false;
};

const changePassword = (e) => {
  e.preventDefault();

  if ($(".oldPasswordInput").val() === '') {
    handleMessage("passwordError", "You did not provide your old password");

    return false;
  } else if ($(".newPasswordInput").val() === '') {
    handleMessage("passwordError", "You did not provide a new password");
    return false;
  } else if ($(".confirmPasswordInput").val() === '') {
    handleMessage("passwordError", "Please confirm your password");
    return false;
  }

  if ($(".newPasswordInput").val() !== $(".confirmPasswordInput").val()) {
    handleMessage("passwordError", "Your new passwords do not match");
    return false;
  }

  let passwordData = `password=${$(".oldPasswordInput").val()}&`;
  passwordData += `_csrf=${$("#_csrf").val()}`;

  sendAjax('POST', '/isValidPwd', passwordData, (password) => {
    if (!password.isValid) {
      handleMessage("passwordError", "Your Old Password does not match the password on file, please try again");
      return false;
    }

    sendAjax('GET', '/getToken', null, (result) => {
      let updateData =`newPassword=${$(".newPasswordInput").val()}&`;
      updateData += `_csrf=${result.csrfToken}`;

      sendAjax('POST', '/updatePwd', updateData, () => {
        handleMessage("passwordUpdated", "Password updated successfully");

        $(".oldPasswordInput").val(null);
        $(".newPasswordInput").val(null);
        $(".confirmPasswordInput").val(null);

        jQuery.ready(function () {
          getToken();
        });
      });
    });
  });
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
    return <div class="editProfile">
      <h3 class="emptyProfile">No Profile Information</h3>
    </div>
  }

  const profile = props.profile.map(function (profile) {
    return (
      <form id="userProfile"
            onSubmit={updateProfile}
            action="/updateProfile"
            mothod="POST"

      >
        <h3 class="username" disabled="true">Username: {profile.username}</h3>
        <h4 class="firstname">Firstname: {profile.firstname}</h4>
        <h4 class="lastname">Lastname: {profile.lastname}</h4>
        <label htmlFor="subscribed">Subscribed</label>
        <input type="checkbox" id="subscribed"/>
        <input id="_csrf" type="hidden" name="_csrf" value={props.csrf}/>
      </form>
    );
  });

  return (
    <div class="editProfile">
      {profile}
    </div>
  );
};

const PasswordForm = function (props) {
  return (
    <form id="changePassword"
          onSubmit={changePassword}
          action="/changePassword"
          mothod="POST"

    >
      <label class="passwordFormElement oldPasswordLabel">Old Password: </label>
      <input class="passwordFormElement oldPasswordInput" type="password" name="oldPassword"
             placeholder="Old Password"/>
      <label class="passwordFormElement newPasswordLabel">New Password: </label>
      <input class="passwordFormElement newPasswordInput" type="password" name="newPassword"
             placeholder="New Password"/>
      <label class="passwordFormElement confirmPasswordLabel">Confirm Password: </label>
      <input class="passwordFormElement confirmPasswordInput" type="password" name="confirmPassword"
             placeholder="Confirm Password"/>

      <input class="passwordFormElement changePassword" type="submit" value="Change Password"/>
      <p class="errorParagraph" id="passwordErrorParagraph"><span id="passwordError"></span></p>
    </form>
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
      <ProfileForm csrf={csrf} profile={profile}/>, document.querySelector("#profileSection"),
      () => {
        attachSubscriptionCheck();
      }
    );

    document.querySelector("#subscribed").checked = profile[0].subscribed;
  });
};

const setup = function (csrf) {
  ReactDOM.render(
    <ProfileForm csrf={csrf} profile={[]}/>, document.querySelector("#profileSection")
  );

  ReactDOM.render(
    <PasswordForm csrf={csrf}/>, document.querySelector("#passwordSection")
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