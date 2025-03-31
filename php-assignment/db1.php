<?php
$host = 'localhost';
$dbname = 'dbigqyshk01mmd';
$username = 'uluevwtfuq0h5';
$password = 'zoinkis123';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$genres = $conn->query("SELECT id, name FROM genres");
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
        button { padding: 10px; width: 100%; background: #28a745; color: white; border: none; border-radius: 5px; }
    </style>
</head>
<body>
<div class="container">
    <h2>Select Music Genres</h2>
    <form action="db2.php" method="post">
        <?php while ($row = $genres->fetch_assoc()): ?>
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="genre_ids[]" value="<?= $row['id'] ?>"> <?= htmlspecialchars($row['name']) ?>
                </label>
            </div>
        <?php endwhile; ?>
        <button type="submit">Show Songs</button>
    </form>
</div>
</body>
</html>

<?php $conn->close(); ?>
