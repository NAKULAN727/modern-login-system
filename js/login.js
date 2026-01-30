$(document).ready(function () {
  $("#loginBtn").click(function () {
    let email = $("#email").val();
    let password = $("#password").val();

    if (email == "" || password == "") {
      Toast.warning("Email and Password are required");
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
          Toast.success("Login Successful");
          setTimeout(() => {
            window.location.href = "profile.html";
          }, 1000); // Slight delay to see toast
        } else {
          Toast.error(res.message || "Login Failed");
        }
      },
      error: function () {
        Toast.error("Server Error");
      },
    });
  });
});
