<?php
header("Content-Type: application/json");
require_once "db_mysql.php";

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($email === "" || $password === "") {
    echo json_encode(["status" => "error", "message" => "Email & password required"]);
    exit;
}

// Fetch user
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    exit;
}

// Redis session
$token = bin2hex(random_bytes(32));
$user_id = $user['id'];

$redis = new Redis();
$redis->connect("127.0.0.1", 6379);
$redis->setEx($token, 1024, $user_id);

// Success
echo json_encode([
    "status" => "success",
    "token" => $token
]);

$stmt->close();
$conn->close();
