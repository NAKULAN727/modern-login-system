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

// Generate Token
$token = bin2hex(random_bytes(32));
$user_id = $user['id'];

if (class_exists('Redis')) {
    try {
        $redis = new Redis();
        if ($redis->connect("127.0.0.1", 6379)) {
            $redis->setEx($token, 3600, $user_id);
        } else {
            throw new Exception("Redis connection failed");
        }
    } catch (Exception $e) {
        // Fallback to MySQL if Redis fails
        storeSessionInDb($conn, $user_id, $token);
    }
} else {
    // Fallback to MySQL if Redis extension missing
    storeSessionInDb($conn, $user_id, $token);
}

function storeSessionInDb($conn, $user_id, $token) {
    $stmt = $conn->prepare("INSERT INTO sessions (user_id, token) VALUES (?, ?)");
    $stmt->bind_param("is", $user_id, $token);
    $stmt->execute();
    $stmt->close();
}

// Success
echo json_encode([
    "status" => "success",
    "token" => $token
]);

$stmt->close();
$conn->close();