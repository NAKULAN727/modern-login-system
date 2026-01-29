<?php
header("Content-Type: application/json");

// 🔹 Get token from header
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if ($token === "") {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// 🔹 Redis connection
$redis = new Redis();
$redis->connect("127.0.0.1", 6379);

$user_id = $redis->get($token);

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Session expired"]);
    exit;
}

// 🔹 MongoDB connection
require_once 'db.php';
$collection = $db->profiles;

// 🔹 GET profile
if ($_SERVER['REQUEST_METHOD'] === "GET") {

    $profile = $collection->findOne(["user_id" => $user_id]);

    echo json_encode([
        "status" => "success",
        "data" => $profile ?? [
            "age" => "",
            "dob" => "",
            "contact" => ""
        ]
    ]);
}

// 🔹 UPDATE profile
if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $collection->updateOne(
        ["user_id" => $user_id],
        ['$set' => [
            "age" => $_POST['age'],
            "dob" => $_POST['dob'],
            "contact" => $_POST['contact']
        ]],
        ["upsert" => true]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Profile updated successfully"
    ]);
}
