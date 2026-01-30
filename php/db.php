<?php
require_once __DIR__ . '/vendor/autoload.php';

try {
    $mongo_uri = getenv("MONGO_URI") ?: "mongodb://localhost:27017";
    $mongo = new MongoDB\Client($mongo_uri);
    $db = $mongo->internship_db;
} catch (Exception $e) {
    die("Error connecting to MongoDB: " . $e->getMessage());
}
?>
