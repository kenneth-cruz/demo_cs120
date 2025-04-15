<?php
// hello.php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ecommerce";

// Placeholder connection logic
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Sample query for orders (for orders.html)
$sql = "SELECT * FROM orders ORDER BY date_ordered DESC";
$result = $conn->query($sql);

echo "<h2>All Orders</h2>";

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    echo "<div class='order'>";
    echo "Order ID: " . $row["id"] . " - Date: " . $row["date_ordered"] . "<br>";
    echo "Item 1: " . $row["item1_id"] . " Qty: " . $row["item1_qty"] . "<br>";
    echo "Item 2: " . $row["item2_id"] . " Qty: " . $row["item2_qty"] . "<br>";
    echo "</div>";
  }
} else {
  echo "0 results";
}

$conn->close();
?>
