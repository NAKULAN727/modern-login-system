<?php
header("Content-Type: application/json");

// 🔹 Get token from header
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if ($token === "") {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// 🔹 Session Verification
$user_id = null;

// Try Redis first
if (class_exists('Redis')) {
    try {
        $redis = new Redis();
        if ($redis->connect("127.0.0.1", 6379)) {
            $user_id = $redis->get($token);
        }
    } catch (Exception $e) {
        // Redis failed, ignore and try DB
    }
}

// Fallback to MySQL if Redis didn't yield a user_id
if (!$user_id) {
    require_once "db_mysql.php";
    $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $user_id = $row['user_id'];
    }
    $stmt->close();
    // Do not close $conn here as we might use it (though this file uses MongoDB later, better safe)
    // Actually this file uses MongoDB for profile, but we just opened MySQL for session check.
}

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Session expired"]);
    exit;
}


// 🔹 MongoDB connection
require_once 'db.php';
$collection = $db->profiles;

// Ensure unique index exists
$collection->createIndex(['user_id' => 1], ['unique' => true]);

// 🔹 GET profile
if ($_SERVER['REQUEST_METHOD'] === "GET") {

    // Verify user_id is an integer for MongoDB query
    $profile = $collection->findOne(["user_id" => (int)$user_id]);

    echo json_encode([
        "status" => "success",
        "data" => $profile ?? [
            "name" => "",
            "dob" => "",
            "age" => "",
            "contact" => "",
            "address" => ""
        ]
    ]);
}

// 🔹 UPDATE profile
if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $collection->updateOne(
        ["user_id" => (int)$user_id],
        ['$set' => [
            "name" => $_POST['name'] ?? '',
            "age" => $_POST['age'] ?? '',
            "dob" => $_POST['dob'] ?? '',
            "contact" => $_POST['contact'] ?? '',
            "address" => $_POST['address'] ?? ''
        ]],
        ["upsert" => true]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Profile updated successfully"
    ]);
}
