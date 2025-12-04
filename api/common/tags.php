<?php
/**
 * タグ提案API
 * 
 * GET:  タグ一覧取得
 *   - area: 地域 (必須。global の場合は全地域のタグを取得)
 *   - no: 図鑑番号 (必須)
 * 
 * POST: タグ提案登録
 *   - area: 地域 (必須)
 *   - no: 図鑑番号 (必須)
 *   - tag: タグ名 (必須)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// データベースパス
$dbPath = __DIR__ . '/common.db';

// データベース接続
function getDB($dbPath) {
    $isNewDb = !file_exists($dbPath);
    
    try {
        $db = new PDO('sqlite:' . $dbPath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // 新規作成時はテーブルを初期化
        if ($isNewDb) {
            $initSql = file_get_contents(__DIR__ . '/init.sql');
            $db->exec($initSql);
        }
        
        return $db;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}

// レスポンス送信
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// エラーレスポンス送信
function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

// 地域一覧
$validAreas = ['global', 'kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui', 'kitakami', 'blueberry'];

// GETリクエスト処理: タグ一覧取得
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $area = $_GET['area'] ?? null;
    $no = $_GET['no'] ?? null;
    
    if (!$area || !$no) {
        sendError('area and no are required');
    }
    
    $no = intval($no);
    
    $db = getDB($dbPath);
    
    try {
        if ($area === 'global') {
            // globalの場合は全地域のタグを取得
            $stmt = $db->prepare('
                SELECT DISTINCT tag, area, pokedex_no 
                FROM tag_suggestions 
                WHERE pokedex_no = :no 
                ORDER BY tag
            ');
            $stmt->execute([':no' => $no]);
        } else {
            // 特定地域のタグを取得
            $stmt = $db->prepare('
                SELECT DISTINCT tag, area, pokedex_no 
                FROM tag_suggestions 
                WHERE area = :area AND pokedex_no = :no 
                ORDER BY tag
            ');
            $stmt->execute([':area' => $area, ':no' => $no]);
        }
        
        $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 承認済みタグも取得
        if ($area === 'global') {
            $stmtApproved = $db->prepare('
                SELECT DISTINCT tag, area, pokedex_no 
                FROM approved_tags 
                WHERE pokedex_no = :no 
                ORDER BY tag
            ');
            $stmtApproved->execute([':no' => $no]);
        } else {
            $stmtApproved = $db->prepare('
                SELECT DISTINCT tag, area, pokedex_no 
                FROM approved_tags 
                WHERE area = :area AND pokedex_no = :no 
                ORDER BY tag
            ');
            $stmtApproved->execute([':area' => $area, ':no' => $no]);
        }
        
        $approvedTags = $stmtApproved->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse([
            'success' => true,
            'area' => $area,
            'no' => $no,
            'suggestions' => $tags,
            'approved' => $approvedTags
        ]);
        
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage(), 500);
    }
}

// POSTリクエスト処理: タグ提案登録
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSONボディを取得
    $input = json_decode(file_get_contents('php://input'), true);
    
    $area = $input['area'] ?? null;
    $no = $input['no'] ?? null;
    $tag = $input['tag'] ?? null;
    
    // バリデーション
    if (!$area || !$no || !$tag) {
        sendError('area, no, and tag are required');
    }
    
    if (!in_array($area, $validAreas)) {
        sendError('Invalid area: ' . $area);
    }
    
    $no = intval($no);
    $tag = trim($tag);
    
    if (empty($tag)) {
        sendError('Tag cannot be empty');
    }
    
    if (mb_strlen($tag) > 50) {
        sendError('Tag is too long (max 50 characters)');
    }
    
    $db = getDB($dbPath);
    
    try {
        // 重複チェック（提案済み + 承認済み）
        $stmtCheck = $db->prepare('
            SELECT COUNT(*) as cnt FROM (
                SELECT tag FROM tag_suggestions WHERE area = :area AND pokedex_no = :no AND tag = :tag
                UNION
                SELECT tag FROM approved_tags WHERE area = :area AND pokedex_no = :no AND tag = :tag
            )
        ');
        $stmtCheck->execute([':area' => $area, ':no' => $no, ':tag' => $tag]);
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        
        if ($result['cnt'] > 0) {
            sendError('This tag already exists');
        }
        
        // 登録
        $stmt = $db->prepare('
            INSERT INTO tag_suggestions (area, pokedex_no, tag) 
            VALUES (:area, :no, :tag)
        ');
        $stmt->execute([':area' => $area, ':no' => $no, ':tag' => $tag]);
        
        sendResponse([
            'success' => true,
            'message' => 'Tag suggestion submitted successfully',
            'tag' => $tag,
            'area' => $area,
            'no' => $no
        ], 201);
        
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'UNIQUE constraint failed') !== false) {
            sendError('This tag already exists');
        }
        sendError('Database error: ' . $e->getMessage(), 500);
    }
}

// その他のメソッド
sendError('Method not allowed', 405);
