<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'dbigqyshk01mmd';
$username = 'sbglonkazaakx';
$password = 'zoinkis123';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "✅ Database connected successfully!";
?>
