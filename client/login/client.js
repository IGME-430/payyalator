const handleLogin = (e) => {
  e.preventDefault();

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

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  if ($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '') {
    handleMessage("signupError", "All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleMessage("signupError", "Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

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

const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); // default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});