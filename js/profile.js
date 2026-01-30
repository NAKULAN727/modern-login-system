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
        let d = response.data;

        // Populate Inputs
        $("#name").val(d.name || "");
        $("#email").val(d.email || ""); // Set Email
        $("#address").val(d.address || "");
        $("#age").val(d.age || "");
        $("#dob").val(d.dob || "");
        $("#contact").val(d.contact || "");

        // Update Sidebar/Display
        updateSidebar(d.name, d.email);
      } else {
        if (
          response.message === "Unauthorized" ||
          response.message === "Session expired"
        ) {
          window.location.href = "login.html";
        } else {
          Toast.error("Unable to load profile: " + response.message);
        }
      }
    },
    error: function () {
      console.error("Server error while loading profile");
      Toast.error("Error loading profile data");
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
      Toast.warning("All fields are required");
      return;
    }

    // Show loading state
    let $btn = $(this);
    let originalText = $btn.text();
    $btn.prop("disabled", true).text("Saving...");

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
        $btn.prop("disabled", false).text(originalText);

        if (response.status === "success") {
          // Update Sidebar immediately
          updateSidebar(name, $("#email").val());
          Toast.success("Profile updated successfully!");
        } else {
          Toast.error(response.message || "Update failed");
        }
      },
      error: function () {
        $btn.prop("disabled", false).text(originalText);
        Toast.error("Server error while saving profile");
      },
    });
  });

  // 🔹 LOGOUT
  $("#logoutBtn").click(function () {
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
  });

  // Helper to update Avatar & Sidebar Text
  function updateSidebar(name, email) {
    let displayName = name || "User";
    $("#displayName").text(displayName);
    $("#displayEmail").text(email || "");

    // Update Avatar src with new name
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e9ecef&color=495057&size=150&bold=true`;
    $("#avatarImg").attr("src", avatarUrl);
  }
});