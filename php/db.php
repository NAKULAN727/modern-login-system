<?php
require_once __DIR__ . '/vendor/autoload.php';

try {
    $mongo = new MongoDB\Client("mongodb://localhost:27017");
    $db = $mongo->internship_db;
} catch (Exception $e) {
    die("Error connecting to MongoDB: " . $e->getMessage());
}
?>
