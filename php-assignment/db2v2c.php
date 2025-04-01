<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

//my db creds
$server = 'localhost';
$userid = 'uluevwtfuq0h5';
$pw = 'Meepmeep02170!!';
$dbname = 'dbiqgyshk01mmd';

// Connect to server
$conn = new mysqli($server, $userid, $pw);

// Check if connected well or not
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected to MySQL server successfully<br>";

// choose db
if (!$conn->select_db($dbname)) {
    die("❌ Could not select database '$dbname': " . $conn->error);
}
echo "✅ Database '$dbname' selected successfully<br>";

$songs = [];

#SQL script that would choose the songs in that genre.
if (!empty($_POST['genre_ids'])) {
    $placeholders = implode(',', array_fill(0, count($_POST['genre_ids']), '?'));
    $sql = "
        SELECT songs.title, songs.artist, genres.genre_name AS genre
        FROM songs
        JOIN song_genres ON songs.song_id = song_genres.song_id
        JOIN genres ON song_genres.genre_id = genres.genre_id
        WHERE genres.genre_id IN ($placeholders)
    ";

    #in case script failed
    $state_ment = $conn->prepare($sql);
    if (!$state_ment) {
        die("Error: Prepare failed: " . $conn->error);
    }

    $types = str_repeat('i', count($_POST['genre_ids']));
    $state_ment->bind_param($types, ...$_POST['genre_ids']);
    $state_ment->execute();
    $result = $state_ment->get_result();
    $songs = $result->fetch_all(MYSQLI_ASSOC);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Song Results</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; background-color: #eef2f3; }
        .results { max-width: 600px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; }
        h2 { text-align: center; }
        .song { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #ccc; }
        .title { font-weight: bold; }
        .artist { color: blue; }
        .genre { font-size: 14px; color: #888; }
    </style>
</head>
<body>
<!-- Here we have HTML displaying based on the conditional if there are songs or not. -->
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
        <p>No songs available for the genre.</p>
    <?php endif; ?>
</div>
</body>
</html>

<?php $conn->close(); ?>
