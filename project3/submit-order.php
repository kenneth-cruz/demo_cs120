<?php
// Enable error display 
ini_set('display_errors', 1);
error_reporting(E_ALL);

// MySQL credentials
$servername = "localhost";
$username = "uluevwtfuq0h5";
$password = "Bendetson123";
$dbname = "dbxuaptzuvc3qs";

// Connecting
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  http_response_code(500);
  die("Connection failed: " . $conn->connect_error);
}

// Read cart data 
$data = json_decode(file_get_contents("php://input"), true);

// Validation
if (!$data || !is_array($data)) {
  http_response_code(400);
  echo "Invalid cart data.";
  exit;
}

// Extract fruit Ids and Qtys
$item_ids = array_column($data, 'id');
$item_qtys = array_column($data, 'qty');

// Prepare values array for up to 5 items 
$values = [];
for ($i = 0; $i < 5; $i++) {
  $values[] = isset($item_ids[$i]) ? $item_ids[$i] : null;
  $values[] = isset($item_qtys[$i]) ? $item_qtys[$i] : null;
}

while (count($values) < 10) {
  $values[] = null;
}

// SQL insert
$stmt = $conn->prepare("
  INSERT INTO orders (
    item1_id, item1_qty, item2_id, item2_qty, 
    item3_id, item3_qty, item4_id, item4_qty, 
    item5_id, item5_qty
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Error checking
if (!$stmt) {
  http_response_code(500);
  die("Prepare failed: " . $conn->error);
}

// Bind values and execute
$stmt->bind_param("iiiiiiiiii", ...$values);

if ($stmt->execute()) {
  http_response_code(200);
  echo "Order saved.";
} else {
  http_response_code(500);
  echo "Error: " . $stmt->error;
}

$conn->close();
?>
