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

$sql = "SELECT * FROM orders ORDER BY date_ordered DESC";
$result = $conn->query($sql);
$orders = [];

while ($row = $result->fetch_assoc()) {
  $items = [];

  for ($i = 1; $i <= 5; $i++) {
    $itemId = $row["item{$i}_id"];
    $qty = $row["item{$i}_qty"];
    if ($itemId && $qty) {
      $productRes = $conn->query("SELECT name, price FROM products WHERE id = $itemId");
      $product = $productRes->fetch_assoc();
      $items[] = [
        "name" => $product["name"],
        "price" => floatval($product["price"]),
        "qty" => intval($qty),
        "subtotal" => floatval($product["price"]) * intval($qty)
      ];
    }
  }

  $total = array_reduce($items, fn($sum, $item) => $sum + $item["subtotal"], 0);

  $orders[] = [
    "id" => $row["id"],
    "date" => $row["date_ordered"],
    "items" => $items,
    "total" => $total
  ];
}

echo json_encode($orders);
$conn->close();
?>
