$(document).ready(function () {
  // 🔐 Get token from localStorage
  let token = localStorage.getItem("auth_token");

  // If token not found → redirect to login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Auto-calculate Age on DOB change
  $("#dob").change(function () {
    let dob = new Date($(this).val());
    let today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    $("#age").val(age >= 0 ? age : "");
  });

  // 🔹 LOAD profile data (GET)
  $.ajax({
    url: "php/profile.php",
    type: "GET",
    headers: {
      Authorization: token,
    },
    dataType: "json",
    success: function (response) {
      if (response.status === "success" && response.data) {
        $("#name").val(response.data.name || "");
        $("#address").val(response.data.address || "");
        $("#age").val(response.data.age || "");
        $("#dob").val(response.data.dob || "");
        $("#contact").val(response.data.contact || "");
      } else {
        // If token invalid, maybe redirect?
        if (
          response.message === "Unauthorized" ||
          response.message === "Session expired"
        ) {
          window.location.href = "login.html";
        } else {
          alert("Unable to load profile: " + response.message);
        }
      }
    },
    error: function () {
      alert("Server error while loading profile");
    },
  });

  // 🔹 SAVE / UPDATE profile (POST)
  $("#saveBtn").click(function () {
    let name = $("#name").val().trim();
    let address = $("#address").val().trim();
    let age = $("#age").val();
    let dob = $("#dob").val();
    let contact = $("#contact").val().trim();

    // Basic validation
    if (
      name === "" ||
      age === "" ||
      dob === "" ||
      contact === "" ||
      address === ""
    ) {
      alert("All fields are required");
      return;
    }

    $.ajax({
      url: "php/profile.php",
      type: "POST",
      headers: {
        Authorization: token,
      },
      data: {
        name: name,
        address: address,
        age: age,
        dob: dob,
        contact: contact,
      },
      dataType: "json",
      success: function (response) {
        if (response.status === "success") {
          alert("Profile updated successfully!");
        } else {
          alert(response.message || "Update failed");
        }
      },
      error: function () {
        alert("Server error while saving profile");
      },
    });
  });

  // 🔹 LOGOUT
  $("#logoutBtn").click(function () {
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
  });
});
