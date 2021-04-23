if (localStorage.getItem("loggedInUser") != null) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  profile(user);
} else {
  logIn();
  register();
}

// logIn();


function logIn() {


  let loginForm = `<div>
  <input type="text" name="userName" id="userName" placeholder="Användarnamn">
  <input type="password" name="userPass" id="password" placeholder="Lösenord">
  <button id="loginBtn">Logga in</button></div>`


  document.getElementById("container").insertAdjacentHTML("afterbegin", loginForm);
  document.getElementById("loginBtn").addEventListener("click", function () {
    let userName = document.getElementById("userName").value;
    let userPass = document.getElementById("password").value;

    let user = {
      userName: userName,
      userPass: userPass,
      userId: "",
      newsletter: "false"
    }

    console.log('klick på knappen för att logga in');
    console.log(user);

    fetch('https://stinas-newsletter.herokuapp.com/users/login', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(user => {
        console.log('Success:', user);
        if (user != "Terror") {
          let userToLS = {
            userName: user.userName,
            userId: user.userId
          }
          console.log(userToLS);
          localStorage.setItem('loggedInUser', JSON.stringify(userToLS));
          console.log("användaren sparad till LS");
          console.log("user till profile", user);
          profile(user);
        } else {
          console.log("Något gick fel");
        }
      })

  })
}

function register() {
  let registerForm = `<form action="https://stinas-newsletter.herokuapp.com/users/add" method="post">
  <label for="userName">Användarnamn: </label><input type="text" name="userName" id="userName">
  <label for="password">Lösenord: </label><input type="text" name="password" id="userPass">
  <button type="submit" id="register">Registrera dig</button>
  <a href="https://stinas-newsletter.herokuapp.com/">Registera dig</a>
</form>`

  document.getElementById("container").insertAdjacentHTML("beforeend", registerForm);
  document.getElementById("register").addEventListener("click", function () {
    console.log('klick på knappen för att registrera sig');
  })
}

function profile(user) {
  console.log(user.userName);
  fetch(`https://stinas-newsletter.herokuapp.com/users/list/${user.userName}`)
    .then(res => res.json())
    .then(data => {
      let userData = JSON.parse(data);
      console.log("newsletter status", userData);
      let text;
      let buttonText;
      if (userData == "" || userData == false) {
        text = "Nej";
        buttonText = "Vill du ha mitt nyhetsbrev?"
      } else {
        text = "Ja";
        buttonText = "Vill du avsluta din prenumeration?"
      }


      let profileView = `<div>
      <h2>Hej ${user.userName}</h2>
      <div>Nyhetsbrev: <span>${text}</span></div>
      <a href="https://stinas-newsletter.herokuapp.com/users/newsletter/${user.userName}"><button id="newsBtn">${buttonText}</button></a>
    </div>`
      document.getElementById("container").innerHTML = profileView;


      // document.getElementById("newsBtn").addEventListener("click", function () {
      //   fetch(`http://localhost:3001/users/list/:${user.userName}`)
      //     .then(res => res.json())
      //     .then(data => {
      //       let userData = JSON.parse(data);
      //       console.log(userData);
      //     })
      // })
    })
}
