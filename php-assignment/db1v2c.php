<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// my db creds
$server = 'localhost';
$userid = 'uluevwtfuq0h5';
$pw = 'Meepmeep02170!!';
$dbname = 'dbiqgyshk01mmd';

// connect to server
$conn = new mysqli($server, $userid, $pw);

// checking
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "YES! Connected to MySQL server successfully<br>";

// connect to db (check)
if (!$conn->select_db($dbname)) {
    die("No, Could not select database '$dbname': " . $conn->error);
}
echo "YES! Database '$dbname' selected successfully<br>";

// SQL query for genre
$genres = $conn->query("SELECT genre_id, genre_name FROM genres");
if (!$genres) {
    die("NO, Query failed: " . $conn->error);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Select Genres</title>
    <style>
        body { font-family: Arial; background-color: #f9f9f9; }
        .container { width: 400px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; }
        h2 { text-align: center; }
        .checkbox { margin-bottom: 10px; }
        button { padding: 10px; width: 100%; background: beige; color: black; border: none; border-radius: 5px; }
    </style>
</head>
<body>
<div class="container">
    <h2>Select Music Genres</h2>
    <form action="db2v2c.php" method="post">
        <?php while ($row = $genres->fetch_assoc()): ?>
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="genre_ids[]" value="<?= $row['genre_id'] ?>"> <?= htmlspecialchars($row['genre_name']) ?>
                </label>
            </div>
        <?php endwhile; ?>
        <button type="submit">Show Songs</button>
    </form>
</div>
</body>
</html>

<?php $conn->close(); ?>
