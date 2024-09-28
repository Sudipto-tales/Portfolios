<?php
// Get the raw POST data
$data = file_get_contents("php://input");

// Decode the JSON data
$formData = json_decode($data, true);

// File path where the data will be stored
$file = 'formData.json';

// Check if the file already exists
if (file_exists($file)) {
    // Get current contents of the file
    $currentData = file_get_contents($file);
    // Decode it into an array
    $jsonArray = json_decode($currentData, true);
} else {
    $jsonArray = array();
}

// Add the new form data to the array
$jsonArray[] = $formData;

// Save the updated array back to the file
file_put_contents($file, json_encode($jsonArray, JSON_PRETTY_PRINT));

echo json_encode(['status' => 'success']);
?>
