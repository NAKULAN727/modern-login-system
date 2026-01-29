<?php
header("Content-Type: application/json");

// MySQL connection
$conn = new mysqli("localhost", "root", "", "internship_db");

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}

// Get POST data
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($email === "" || $password === "") {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password required"
    ]);
    exit;
}

// Fetch user
$stmt = $conn->prepare(
    "SELECT id, password FROM users WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials"
    ]);
    exit;
}

// Generate token
$token = bin2hex(random_bytes(32));
$user_id = $user['id'];

// Redis connection
try {
    $redis = new Redis();
    $redis->connect("127.0.0.1", 6379);

    // Store token with expiry (1024 seconds)
    $redis->setEx($token, 1024, $user_id);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Redis connection failed"
    ]);
    exit;
}

// Success response
echo json_encode([
    "status" => "success",
    "token" => $token
]);

$stmt->close();
$conn->close();
