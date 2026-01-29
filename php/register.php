<?php
header("Content-Type: application/json");

// 🔹 Include MySQL connection
require_once "db_mysql.php";

// 🔹 Get POST data
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

// 🔹 Validation
if ($email === "" || $password === "") {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

// 🔹 Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already registered"
    ]);
    exit;
}

// 🔹 Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// 🔹 Insert new user
$stmt = $conn->prepare(
    "INSERT INTO users (email, password) VALUES (?, ?)"
);
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Registration failed"
    ]);
}

// 🔹 Close connections
$stmt->close();
$check->close();
$conn->close();
