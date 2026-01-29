$(document).ready(function () {
  $("#registerBtn").click(function () {
    let email = $("#email").val();
    let password = $("#password").val();
    let confirmPassword = $("#confirm_password").val();

    // 1️⃣ Validation
    if (email === "" || password === "" || confirmPassword === "") {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    $.ajax({
      url: "php/register.php",
      type: "POST",
      data: {
        email: email,
        password: password,
      },
      dataType: "json",
      success: function (res) {
        if (res.status === "success") {
          alert("Registration Success");
          window.location.href = "login.html";
        } else {
          alert(res.message || "Registration Failed");
        }
      },
      error: function () {
        alert("Server Error");
      },
    });
  });
});
