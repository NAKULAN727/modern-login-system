$(document).ready(function () {
  // Auto-calculate Age based on DOB
  $("#dob").change(function () {
    let dateVal = $(this).val();
    if (!dateVal) {
      $("#age").val("");
      return;
    }
    let dob = new Date(dateVal);
    if (isNaN(dob.getTime())) {
      // Invalid date
      return;
    }

    let today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    $("#age").val(age >= 0 ? age : "");
  });

  $("#registerBtn").click(function () {
    // Get values
    let name = $("#name").val().trim();
    let dob = $("#dob").val();
    let age = $("#age").val();
    let contact = $("#contact").val().trim();
    let address = $("#address").val().trim();
    let email = $("#email").val().trim();
    let password = $("#password").val();
    let confirmPassword = $("#confirm_password").val();

    // 1️⃣ Validation
    if (
      name === "" ||
      dob === "" ||
      contact === "" ||
      address === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send data
    $.ajax({
      url: "php/register.php",
      type: "POST",
      data: {
        name: name,
        dob: dob,
        age: age,
        contact: contact,
        address: address,
        email: email,
        password: password,
      },
      dataType: "json",
      success: function (res) {
        if (res.status === "success") {
          alert("Registration Success! Please login.");
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
