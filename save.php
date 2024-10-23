<?php
// Check if POST request contains the snap data
if (isset($_POST['snap'])) {

    // Extract base64 image data from the POST request
    $data = $_POST['snap'];

    // Verify the format is base64-encoded JPEG
    if (preg_match('/^data:image\/jpeg;base64,/', $data)) {
        // Strip out the base64 string to get the image data
        $data = str_replace('data:image\/jpeg;base64,', '', $data);
        $data = str_replace(' ', '+', $data);
        $data = base64_decode($data);

        // Ensure base64 decoding is successful
        if ($data === false) {
            echo 'Error: Failed to decode the image.';
            exit;
        }

        // Generate a unique filename with timestamp for saving
        $fileName = 'snap_' . time() . '.jpg';
        $
