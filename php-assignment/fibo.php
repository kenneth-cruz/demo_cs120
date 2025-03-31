<?php
// Get the 'n' parameter from the query string

$n = isset($_GET['n']) ? intval($_GET['n']) : 0;

// Initialize the Fibonacci sequence
$fibSequence = [];

if ($n > 0) {
    $fibSequence[] = 0;
}
if ($n > 1) {
    $fibSequence[] = 1;
}

// Generate the Fibonacci sequence up to length n
for ($i = 2; $i < $n; $i++) {
    $fibSequence[] = $fibSequence[$i - 1] + $fibSequence[$i - 2];
}

// Prepare the result
$result = [
    'length' => $n,
    'fibSequence' => $fibSequence
];

// Output the result as JSON
header('Content-Type: application/json');
echo json_encode($result);
?>
