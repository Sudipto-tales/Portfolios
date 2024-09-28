<?php
// Set the content type to JSON
header('Content-Type: application/json');

// Get the raw POST data
$data = file_get_contents("php://input");

// Check if data was received
if ($data === false) {
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
    exit;
}

// Decode the JSON data
$formData = json_decode($data, true);

// Check if JSON was decoded successfully
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format.']);
    exit;
}

// File path where the data will be stored
$file = 'formData.json';

// Initialize an array to hold the data
$jsonArray = [];

// Check if the file already exists
if (file_exists($file)) {
    // Get current contents of the file
    $currentData = file_get_contents($file);

    // Check if the current data is valid JSON
    if ($currentData === false || json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'Error reading current data.']);
        exit;
    }

    // Decode the existing data into an array
    $jsonArray = json_decode($currentData, true);
}

// Add the new form data to the array
$jsonArray[] = $formData;

// Save the updated array back to the file
if (file_put_contents($file, json_encode($jsonArray, JSON_PRETTY_PRINT)) === false) {
    echo json_encode(['status' => 'error', 'message' => 'Error saving data to file.']);
    exit;
}

// Respond with success
echo json_encode(['status' => 'success', 'message' => 'Data saved successfully.']);
?>
