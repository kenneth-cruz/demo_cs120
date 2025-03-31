<?php
$host = 'localhost';
$dbname = 'dbigqyshk01mmd';
$username = 'uluevwtfuq0h5';
$password = 'zoinkis123';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$songs = [];

if (!empty($_POST['genre_ids'])) {
    $placeholders = implode(',', array_fill(0, count($_POST['genre_ids']), '?'));
    $sql = "
        SELECT songs.title, songs.artist, genres.name AS genre
        FROM songs
        JOIN song_genres ON songs.id = song_genres.song_id
        JOIN genres ON song_genres.genre_id = genres.id
        WHERE genres.id IN ($placeholders)
    ";

    $stmt = $conn->prepare($sql);
    $types = str_repeat('i', count($_POST['genre_ids']));
    $stmt->bind_param($types, ...$_POST['genre_ids']);
    $stmt->execute();
    $result = $stmt->get_result();
    $songs = $result->fetch_all(MYSQLI_ASSOC);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Song Results</title>
    <style>
        body { font-family: Arial; background-color: #eef2f3; }
        .results { max-width: 600px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; }
        h2 { text-align: center; }
        .song { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ccc; }
        .title { font-weight: bold; }
        .artist { color: #555; }
        .genre { font-size: 14px; color: #888; }
    </style>
</head>
<body>
<div class="results">
    <h2>Matching Songs</h2>
    <?php if (!empty($songs)): ?>
        <?php foreach ($songs as $song): ?>
            <div class="song">
                <div class="title"><?= htmlspecialchars($song['title']) ?></div>
                <div class="artist">by <?= htmlspecialchars($song['artist']) ?></div>
                <div class="genre">Genre: <?= htmlspecialchars($song['genre']) ?></div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No songs found for the selected genres.</p>
    <?php endif; ?>
</div>
</body>
</html>

<?php $conn->close(); ?>
