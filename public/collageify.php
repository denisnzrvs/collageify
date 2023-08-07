<?php
session_start();
$user_dir = $_SESSION['user_dir'];

if (file_exists($user_dir . '/collage.jpg')) {
    unlink($user_dir . '/collage.jpg');
}

$images = glob($user_dir . '/*.jpg');

if (count($images) < 20) {
    echo json_encode(array('error' => 'You need at least 20 images to create a collage!'));
    exit();
}

// ... The rest of the PHP code for generating the collage image ...

$filename = $user_dir . '/collage.jpg';
imagejpeg($collage, $filename);

echo json_encode(array('filename' => $filename));
?>
