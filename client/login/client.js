// Process the login request
const handleLogin = (e) => {
  e.preventDefault();

  // Ensure the username and password fields ar enot empty
  if ($("#user").val() === '' && $("#pass").val() === '') {
    handleMessage("loginError", "Username and password is empty");
    return false;
  } else if ($("#user").val() === '') {
    handleMessage("loginError", "Username is empty");
    return false;
  } else if ($("#pass").val() === '') {
    handleMessage("loginError", "Password is empty");
    return false;
  }

  // Send the login request to the server
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// Process the sign up request
const handleSignup = (e) => {
  e.preventDefault();

  // Ensure all the required fields are provided to register the user
  if ($("#firstn").val() === '' ||
      $("#lastn").val() === '' ||
      $("#user").val() === '' ||
      $("#pass").val() === '' ||
      $("#pass2").val() === '') {
    handleMessage("signupError", "All fields are required");
    return false;
  }

  // Ensure the password and confirm password fields have the same value
  if ($("#pass").val() !== $("#pass2").val()) {
    handleMessage("signupError", "Passwords do not match");
    return false;
  }

  // Send the signup request to the server
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// Build the React login window template
const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm"
          onSubmit={handleLogin}
          action="/login"
          method="POST"
          className="mainForm"
    >
      <label class="userLabelLogin" htmlFor="username">Username:</label>
      <input class="userInputLogin" id="user" type="text" name="username" placeholder="username"/>
      <label class="passLabelLogin" htmlFor="pass">Password: </label>
      <input class="passInputLogin" id="pass" type="password" name="pass" placeholder="password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit signIn" type="submit" value="Sign in"/>
      <p class="errorParagraph" id="loginErrorParagraph"><span id="loginError"></span></p>
    </form>
  );
};

// Build the React signup window template
const SignupWindow = (props) => {
  return (
    <form id="signupForm"
          name="signupForm"
          onSubmit={handleSignup}
          action="/signup"
          method="POST"
          className="mainForm"
    >
      <label class="firstnameLabelReg" htmlFor="firstname">Firstname: </label>
      <input class="firstnameInputReg" id="firstn" type="text" name="firstname" placeholder="firstname"/>
      <label class="lastnameLabelReg" htmlFor="lastname">Lastname: </label>
      <input class="lastnameInputReg" id="lastn" type="text" name="lastname" placeholder="lastname"/>
      <label class="usernameLabelReg" htmlFor="username">Username: </label>
      <input class="usernameInputReg" id="user" type="text" name="username" placeholder="username"/>
      <label class="password1LabelReg" htmlFor="pass">Password: </label>
      <input class="password1InputReg" id="pass" type="password" name="pass" placeholder="password"/>
      <label class="password2LabelReg" htmlFor="pass2">Password: </label>
      <input class="password2InputReg" id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit signUp" type="submit" value="Sign Up"/>
      <p class="errorParagraph" id="signupErrorParagraph"><span id="signupError"></span></p>
    </form>
  );
};

// Render the login window
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

// Render the signup window
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

// Add the event listeners to the login and signup buttons
const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  // Add the click even listener to the signup button
  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  // Add the click even listener to the login button
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); // default view
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