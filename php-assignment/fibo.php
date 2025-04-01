<?php
// n parameter from querystring
$n = isset($_GET['n']) ? intval($_GET['n']) : 0;

// init fibonacci sequence
$fibSequence = [];

if ($n > 0) {
    $fibSequence[] = 0;
}
if ($n > 1) {
    $fibSequence[] = 1;
}

// generate sequence up to length n
for ($i = 2; $i < $n; $i++) {
    $fibSequence[] = $fibSequence[$i - 1] + $fibSequence[$i - 2];
}

// setting up final_result into an easy to read array
$final_result = [
    'length' => $n,
    'fibSequence' => $fibSequence
];

// Output JSON
header('Content-Type: application/json');
echo json_encode($final_result);
?>
