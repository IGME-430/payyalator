// Change the user password
const changePassword = (e) => {
  e.preventDefault();

  // Ensure the old, new and confirm password fields are populated
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

  // Make sure the new and confirm password is the same
  if ($(".newPasswordInput").val() !== $(".confirmPasswordInput").val()) {
    handleMessage("passwordError", "Your new passwords do not match");
    return false;
  }

  let passwordData = `password=${$(".oldPasswordInput").val()}&`;
  passwordData += `_csrf=${$("#_csrf").val()}`;

  // Make sure the old password is correct to ensure someone isn't stealing the account
  sendAjax('POST', '/isValidPwd', passwordData, (password) => {
    if (!password.isValid) {
      handleMessage("passwordError", "Your Old Password does not match the password on file, please try again");
      return false;
    }

    // If the user knows their old password, request the change to the new password
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

// Update the user subscription status
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

// Build the react user profile form
const ProfileForm = function (props) {
  // If there is no profile information, indicate such
  if (props.profile.length === 0) {
    return <div class="editProfile">
      <h3 class="emptyProfile">No Profile Information</h3>
    </div>
  }

  // If there is profile data available, render it
  const profile = props.profile.map(function (profile) {
    return (
      <form id="userProfile"
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

  // Return the combined profile data
  return (
    <div class="editProfile">
      {profile}
    </div>
  );
};

// Build the react password change fields
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

// Add the click event listener to the subscription checkbox
const attachSubscriptionCheck = () => {
  const subCheck = document.querySelector("#subscribed");

  subCheck.addEventListener("click", (e) => {
    e.preventDefault();
    updateSubscription(e);
    return false;
  });
};

// Get the user profile data from the server
const loadProfileFromServer = (csrf) => {
  sendAjax('GET', '/getProfile', null, (data) => {
    let profile = data.profile;

    // Render and populate the user profile information
    ReactDOM.render(
      <ProfileForm csrf={csrf} profile={profile}/>, document.querySelector("#profileSection"),
      () => {
        attachSubscriptionCheck();
      }
    );

    // Update the "subscribed" checkbox on the screen to represent the user subscription status
    document.querySelector("#subscribed").checked = profile[0].subscribed;
  });
};

// Render the components to the screen
const setup = function (csrf) {
  // Render the user profile fields
  ReactDOM.render(
    <ProfileForm csrf={csrf} profile={[]}/>, document.querySelector("#profileSection")
  );

  // Render the change password fields
  ReactDOM.render(
    <PasswordForm csrf={csrf}/>, document.querySelector("#passwordSection")
  );

  // Populate the profile data
  loadProfileFromServer(csrf);
};

// Request a session token and setup the window
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});