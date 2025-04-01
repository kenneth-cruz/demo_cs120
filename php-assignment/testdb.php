<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Best to set all values at the top
$server = 'localhost';
$userid = 'uluevwtfuq0h5';
$pw = 'Meepmeep02170!!';
$dbname = 'dbiqgyshk01mmd';

// Connect to the MySQL server (no DB selected yet)
$conn = new mysqli($server, $userid, $pw);

// Did the connection work?
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected to MySQL server successfully<br>";

// Select the database
if (!$conn->select_db($dbname)) {
    die("❌ Could not select database '$dbname': " . $conn->error);
}
echo "✅ Database '$dbname' selected successfully";
?>
