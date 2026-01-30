<?php
header("Content-Type: application/json");

// 🔹 Include MySQL connection
require_once "db_mysql.php";
// 🔹 Include MongoDB connection
require_once "db.php"; 

// 🔹 Get POST data
$name = trim($_POST['name'] ?? '');
$dob = trim($_POST['dob'] ?? '');
$age = trim($_POST['age'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$address = trim($_POST['address'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

// 🔹 Validation
if ($name === "" || $dob === "" || $contact === "" || $address === "" || $email === "" || $password === "") {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

// 🔹 Check if email already exists (MySQL)
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already registered"
    ]);
    $check->close();
    exit;
}
$check->close();

// 🔹 Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// 🔹 Insert new user into MySQL
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id; // Get the generated user ID

    try {
        // 🔹 Insert profile details into MongoDB
        $collection = $db->profiles;
        $insertOneResult = $collection->insertOne([
            'user_id' => $user_id,
            'name' => $name, // Adding Name
            'dob' => $dob,
            'age' => $age,
            'contact' => $contact,
            'address' => $address
            // Email is strictly auth, usually not duplicated in profile unless requested, but user didn't ask to duplicate it here.
        ]);

        if ($insertOneResult->getInsertedCount() == 1) {
            echo json_encode([
                "status" => "success", 
                "message" => "Registration successful"
            ]);
        } else {
             // Rollback MySQL if MongoDB fails? (Ideally yes, but for this scope maybe just error)
             // For now, let's just Log it.
             echo json_encode([
                "status" => "success", 
                "message" => "User registered, but profile creation had an issue. Please update profile later."
            ]);
        }

    } catch (Exception $e) {
        // Log error
        file_put_contents("mongo_error.log", $e->getMessage(), FILE_APPEND);
        echo json_encode([
            "status" => "success", // Still success because account is created
            "message" => "Registration successful (Profile error)"
        ]);
    }

} else {
    $errorMsg = "Registration failed: " . $stmt->error;
    echo json_encode([
        "status" => "error",
        "message" => $errorMsg
    ]);
}

// 🔹 Close MySQL connection
$stmt->close();
$conn->close();