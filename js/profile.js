$(document).ready(function () {

    // 🔐 Get token from localStorage
    let token = localStorage.getItem("auth_token");

    // If token not found → redirect to login
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // 🔹 LOAD profile data (GET)
    $.ajax({
        url: "php/profile.php",
        type: "GET",
        headers: {
            "Authorization": token
        },
        dataType: "json",
        success: function (response) {

            if (response.status === "success" && response.data) {
                $("#age").val(response.data.age || "");
                $("#dob").val(response.data.dob || "");
                $("#contact").val(response.data.contact || "");
            } 
            else {
                alert("Unable to load profile");
            }
        },
        error: function () {
            alert("Server error while loading profile");
        }
    });

    // 🔹 SAVE / UPDATE profile (POST)
    $("#saveBtn").click(function () {

        let age = $("#age").val();
        let dob = $("#dob").val();
        let contact = $("#contact").val();

        // Basic validation
        if (age === "" || dob === "" || contact === "") {
            alert("All fields are required");
            return;
        }

        $.ajax({
            url: "php/profile.php",
            type: "POST",
            headers: {
                "Authorization": token
            },
            data: {
                age: age,
                dob: dob,
                contact: contact
            },
            dataType: "json",
            success: function (response) {
                alert(response.message);
            },
            error: function () {
                alert("Server error while saving profile");
            }
        });
    });

    // 🔹 LOGOUT
    $("#logoutBtn").click(function () {
        localStorage.removeItem("auth_token");
        window.location.href = "login.html";
    });

});
