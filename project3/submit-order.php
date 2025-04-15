<?php
// SiteGround MySQL credentials
$servername = "localhost";
$username = "uluevwtfuq0h5";
$password = "Bendetson123";
$dbname = "dbxuaptzuvc3qs";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  http_response_code(500);
  die("Connection failed: " . $conn->connect_error);
}

// Read cart data from the fetch() body
$data = json_decode(file_get_contents("php://input"), true);

// Validate incoming data
if (!$data || !is_array($data)) {
  http_response_code(400);
  echo "Invalid cart data.";
  exit;
}

// Prepare arrays for up to 5 items
$item_ids = array_column($data, 'id');
$item_qtys = array_column($data, 'qty');
$values = [];

// Populate placeholders
for ($i = 0; $i < 5; $i++) {
  $values[] = isset($item_ids[$i]) ? $item_ids[$i] : NULL;
  $values[] = isset($item_qtys[$i]) ? $item_qtys[$i] : NULL;
}

// Prepare and run INSERT
$stmt = $conn->prepare(
  "INSERT INTO orders (
    item1_id, item1_qty, item2_id, item2_qty, 
    item3_id, item3_qty, item4_id, item4_qty, 
    item5_id, item5_qty
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
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
