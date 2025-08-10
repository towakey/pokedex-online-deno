<?php
// analytics/analytics.php
// Simple analytics endpoint: store URL, timestamp, country (by IP), browser (UA), referrer into SQLite.

declare(strict_types=1);

// CORS for cross-origin requests (e.g., Vite dev server -> Apache)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
        exit;
    }

    // Read request body (JSON or form data)
    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    $raw = file_get_contents('php://input');
    $data = [];

    if (stripos($contentType, 'application/json') !== false) {
        $data = json_decode($raw ?: 'null', true) ?: [];
    } elseif (!empty($_POST)) {
        $data = $_POST;
    } else {
        // Try to parse as query-string formatted body
        parse_str($raw ?? '', $data);
    }

    // Fallbacks from server headers
    $serverUA = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $serverRef = $_SERVER['HTTP_REFERER'] ?? '';

    $url = (string)($data['url'] ?? '');
    $timestamp = (string)($data['timestamp'] ?? '');
    $browser = (string)($data['browser'] ?? $serverUA);
    $referrer = (string)($data['referrer'] ?? $serverRef);

    if ($url === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing url']);
        exit;
    }

    if ($timestamp === '') {
        // ISO 8601
        $timestamp = date('c');
    }

    $ip = (function (): string {
        $candidates = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_CLIENT_IP',
            'REMOTE_ADDR',
        ];
        foreach ($candidates as $h) {
            if (!empty($_SERVER[$h])) {
                $v = $_SERVER[$h];
                // HTTP_X_FORWARDED_FOR may contain a list
                if ($h === 'HTTP_X_FORWARDED_FOR') {
                    $parts = array_map('trim', explode(',', $v));
                    if (!empty($parts)) {
                        return $parts[0];
                    }
                }
                return $v;
            }
        }
        return '';
    })();

    $isPrivate = function (string $ip): bool {
        if ($ip === '' || $ip === '::1' || $ip === '127.0.0.1') return true;
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $privateRanges = [
                '10.0.0.0/8',
                '172.16.0.0/12',
                '192.168.0.0/16',
            ];
            foreach ($privateRanges as $cidr) {
                [$subnet, $mask] = explode('/', $cidr);
                $mask = (int)$mask;
                $ipLong = ip2long($ip);
                $subnetLong = ip2long($subnet);
                $maskLong = -1 << (32 - $mask);
                $subnetMin = $subnetLong & $maskLong;
                if (($ipLong & $maskLong) === $subnetMin) return true;
            }
        }
        return false;
    };

    $country = 'Unknown';
    if ($ip && !$isPrivate($ip)) {
        $queryUrl = 'https://ipwho.is/' . rawurlencode($ip) . '?fields=success,country';
        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 2,
                'ignore_errors' => true,
                'header' => [
                    'Accept: application/json',
                    'User-Agent: AnalyticsBot/1.0',
                ],
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);
        $resp = @file_get_contents($queryUrl, false, $ctx);
        if ($resp !== false) {
            $geo = json_decode($resp, true);
            if (is_array($geo) && !empty($geo['success']) && !empty($geo['country'])) {
                $country = (string)$geo['country'];
            }
        }
    }

    // Prepare SQLite
    $dbFile = __DIR__ . DIRECTORY_SEPARATOR . 'analytics.db';

    $pdo = new PDO('sqlite:' . $dbFile, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            visited_at TEXT NOT NULL,
            country TEXT,
            browser TEXT,
            referrer TEXT,
            ip TEXT
        )'
    );

    $stmt = $pdo->prepare('INSERT INTO visits (url, visited_at, country, browser, referrer, ip) VALUES (:url, :visited_at, :country, :browser, :referrer, :ip)');
    $stmt->execute([
        ':url' => $url,
        ':visited_at' => $timestamp,
        ':country' => $country,
        ':browser' => $browser,
        ':referrer' => $referrer,
        ':ip' => $ip,
    ]);

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
