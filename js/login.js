$(document).ready(function () {
  $("#loginBtn").click(function () {
    let email = $("#email").val();
    let password = $("#password").val();

    if (email == "" || password == "") {
      alert("Email and Password are required");
      return;
    }
    $.ajax({
      url: "php/login.php",
      type: "POST",
      data: {
        email: email,
        password: password,
      },
      dataType: "json",
      success: function (res) {
        if (res.status === "success") {
          if (res.token) {
            localStorage.setItem("auth_token", res.token);
          }
          alert("Login Success");
          window.location.href = "profile.html";
        } else {
          alert(res.message || "Login Failed");
        }
      },
      error: function () {
        alert("Server Error");
      },
    });
  });
});
