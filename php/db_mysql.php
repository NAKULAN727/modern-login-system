<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "internship_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("MySQL connection failed");
}