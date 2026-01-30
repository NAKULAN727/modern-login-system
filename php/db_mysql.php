<?php
$host = getenv("MYSQL_HOST") ?: "localhost";
$user = getenv("MYSQL_USER") ?: "root";
$password = getenv("MYSQL_PASSWORD") ?: "";
$dbname = getenv("MYSQL_DB") ?: "internship_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("MySQL connection failed");
}