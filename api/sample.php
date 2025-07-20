<?php
// Simple sample API endpoint for development
// URL: http://localhost/api/sample.php?name=pikachu

header('Content-Type: application/json; charset=utf-8');

// Allow CORS during direct access (port 80) – not required when using Nuxt devProxy
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
}

$name = isset($_GET['name']) ? $_GET['name'] : 'world';
$response = [
    'message' => "Hello, {$name}!",
    'timestamp' => date('c')
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
