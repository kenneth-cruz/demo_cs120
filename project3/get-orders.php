<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "uluevwtfuq0h5";
$password = "Bendetson123";
$dbname = "dbxuaptzuvc3qs";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit;
}

// Get up to 10 most recent orders
$sql = "SELECT * FROM orders ORDER BY date_ordered DESC LIMIT 10";
$result = $conn->query($sql);
$orders = [];

while ($row = $result->fetch_assoc()) {
  $items = [];

  for ($i = 1; $i <= 10; $i++) {
    $itemId = $row["item{$i}_id"];
    $qty = $row["item{$i}_qty"];

    // Skip if item is null or quantity is null
    if ($itemId !== null && $qty !== null) {
      $productRes = $conn->query("SELECT name, price FROM products WHERE id = $itemId");

      if ($productRes && $productRes->num_rows > 0) {
        $product = $productRes->fetch_assoc();

        $items[] = [
          "name" => $product["name"],
          "price" => floatval($product["price"]),
          "qty" => intval($qty),
          "subtotal" => floatval($product["price"]) * intval($qty)
        ];
      }
    }
  }

    $total = array_reduce($items, fn($sum, $item) => $sum + $item["subtotal"], 0);

    if (count($items) > 0) { // ✅ Only include orders with items
    $orders[] = [
        "id" => $row["id"],
        "date" => $row["date_ordered"],
        "items" => $items,
        "total" => $total
    ];
    }

}

echo json_encode($orders);
$conn->close();
?>
