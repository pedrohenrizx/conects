<?php
// Simple Front Controller for built-in PHP server routing

// Allow accessing static assets directly
if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // serve the requested resource as-is.
}

$request = $_SERVER['REQUEST_URI'];
$basePath = dirname($_SERVER['SCRIPT_NAME']);

// Remove query string and base path from request
$path = parse_url($request, PHP_URL_PATH);
if ($basePath !== '/' && strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Remove trailing slash
$path = rtrim($path, '/');
if (empty($path)) {
    $path = '/';
}

// Simple routing map
$routes = [
    '/' => 'views/feed.php',
    '/login' => 'views/login.php',
    '/profile' => 'views/profile.php',
    '/groups' => 'views/groups.php',
    '/messages' => 'views/messages.php'
];

// Handle routing
if (array_key_exists($path, $routes)) {
    require __DIR__ . '/' . $routes[$path];
} else {
    // 404 Not Found
    http_response_code(404);
    require __DIR__ . '/views/404.php';
}
?>