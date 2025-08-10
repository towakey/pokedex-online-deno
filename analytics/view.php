<?php
// analytics/view.php - Simple admin dashboard for analytics.db
// Shows: Daily counts, hourly counts (for a selected day), and top URLs.

declare(strict_types=1);

$dbFile = __DIR__ . DIRECTORY_SEPARATOR . 'analytics.db';
$errors = [];

// Read filters
$today = (new DateTime('now'))->format('Y-m-d');
$start = isset($_GET['start']) && $_GET['start'] !== '' ? $_GET['start'] : '';
$end = isset($_GET['end']) && $_GET['end'] !== '' ? $_GET['end'] : '';
$urlLike = isset($_GET['url_like']) ? trim((string)$_GET['url_like']) : '';
$limitTop = isset($_GET['limit']) && ctype_digit((string)$_GET['limit']) ? (int)$_GET['limit'] : 50;
$dailyLimit = isset($_GET['daily_limit']) && ctype_digit((string)$_GET['daily_limit']) ? (int)$_GET['daily_limit'] : 30;
$hourlyDay = isset($_GET['hourly_day']) && $_GET['hourly_day'] !== '' ? $_GET['hourly_day'] : $today;

// Basic validation
if ($start !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $start)) {
  $errors[] = '開始日は YYYY-MM-DD 形式で入力してください。';
}
if ($end !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
  $errors[] = '終了日は YYYY-MM-DD 形式で入力してください。';
}
if ($hourlyDay !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $hourlyDay)) {
  $errors[] = '時間帯別の対象日は YYYY-MM-DD 形式で入力してください。';
}
if ($limitTop < 1) $limitTop = 50;
if ($dailyLimit < 1) $dailyLimit = 30;

$pdo = null;
if (!is_file($dbFile)) {
  $errors[] = 'analytics.db が見つかりませんでした（まだ記録が無い可能性があります）。';
} else {
  try {
    $pdo = new PDO('sqlite:' . $dbFile, null, null, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
  } catch (Throwable $e) {
    $errors[] = 'データベース接続エラー: ' . $e->getMessage();
  }
}

function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

// Build WHERE clauses
$where = [];
$params = [];
if ($start !== '') {
  $where[] = 'substr(visited_at,1,10) >= :start';
  $params[':start'] = $start;
}
if ($end !== '') {
  $where[] = 'substr(visited_at,1,10) <= :end';
  $params[':end'] = $end;
}
if ($urlLike !== '') {
  $where[] = 'url LIKE :url_like';
  $params[':url_like'] = '%' . $urlLike . '%';
}
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$dailyRows = [];
$hourlyRows = [];
$topUrlRows = [];
$totalCount = 0;

if ($pdo) {
  try {
    // Total count
    $stmt = $pdo->prepare("SELECT COUNT(*) AS c FROM visits $whereSql");
    $stmt->execute($params);
    $totalCount = (int)($stmt->fetchColumn() ?: 0);

    // Daily counts (limit N)
    $sqlDaily = "SELECT substr(visited_at,1,10) AS day, COUNT(*) AS cnt
                 FROM visits
                 $whereSql
                 GROUP BY day
                 ORDER BY day DESC
                 LIMIT $dailyLimit"; // limit is sanitized integer
    $stmt = $pdo->prepare($sqlDaily);
    $stmt->execute($params);
    $dailyRows = $stmt->fetchAll();

    // Hourly counts for a specific day
    $paramsHour = $params;
    $paramsHour[':hourly_day'] = $hourlyDay;
    $sqlHourly = "SELECT substr(visited_at,1,13) AS hour, COUNT(*) AS cnt
                  FROM visits
                  WHERE substr(visited_at,1,10) = :hourly_day"
                  . ($where ? ' AND ' . implode(' AND ', $where) : '') .
                  " GROUP BY hour
                    ORDER BY hour ASC";
    $stmt = $pdo->prepare($sqlHourly);
    $stmt->execute($paramsHour);
    $hourlyRows = $stmt->fetchAll();

    // Top URLs (limit N)
    $sqlTop = "SELECT url, COUNT(*) AS cnt
               FROM visits
               $whereSql
               GROUP BY url
               ORDER BY cnt DESC
               LIMIT $limitTop"; // sanitized integer
    $stmt = $pdo->prepare($sqlTop);
    $stmt->execute($params);
    $topUrlRows = $stmt->fetchAll();
  } catch (Throwable $e) {
    $errors[] = 'クエリエラー: ' . $e->getMessage();
  }
}

?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Analytics Viewer</title>
  <style>
    :root { --bg:#0f172a; --card:#111827; --text:#e5e7eb; --muted:#9ca3af; --accent:#22c55e; --border:#1f2937; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
    header { padding:20px; border-bottom:1px solid var(--border); }
    h1 { margin:0; font-size:20px; }
    main { padding:20px; display:grid; gap:20px; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:16px; }
    .grid { display:grid; gap:20px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .muted { color:var(--muted); }
    form.filter { display:flex; flex-wrap:wrap; gap:12px; align-items:end; }
    label { display:flex; flex-direction:column; gap:6px; font-size:12px; }
    input[type="text"], input[type="date"], input[type="number"] { background:#0b1220; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:8px 10px; }
    button { background:var(--accent); color:#062812; border:none; border-radius:8px; padding:10px 14px; font-weight:600; cursor:pointer; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding:8px 10px; border-bottom:1px solid var(--border); font-size:13px; text-align:left; }
    th { color:#a7f3d0; }
    tr:hover td { background:#0b1220; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .badges { display:flex; gap:8px; flex-wrap:wrap; }
    .badge { background:#0b1220; border:1px solid var(--border); padding:4px 8px; border-radius:999px; font-size:12px; }
    .section-title { display:flex; justify-content:space-between; align-items:center; gap:12px; }
  </style>
</head>
<body>
  <header>
    <h1>Analytics Viewer</h1>
    <div class="muted">SQLite: <?php echo h($dbFile); ?></div>
  </header>
  <main>
    <section class="card">
      <form class="filter" method="get">
        <label>
          開始日
          <input type="date" name="start" value="<?php echo h($start); ?>" />
        </label>
        <label>
          終了日
          <input type="date" name="end" value="<?php echo h($end); ?>" />
        </label>
        <label style="min-width:240px">
          URL 含む
          <input type="text" name="url_like" placeholder="/pokedex/..." value="<?php echo h($urlLike); ?>" />
        </label>
        <label>
          日別 表示件数
          <input type="number" name="daily_limit" min="1" max="365" value="<?php echo (int)$dailyLimit; ?>" />
        </label>
        <label>
          上位URL 件数
          <input type="number" name="limit" min="1" max="1000" value="<?php echo (int)$limitTop; ?>" />
        </label>
        <label>
          時間帯 対象日
          <input type="date" name="hourly_day" value="<?php echo h($hourlyDay); ?>" />
        </label>
        <div>
          <button type="submit">再表示</button>
        </div>
      </form>
      <?php if ($errors): ?>
        <div style="margin-top:12px; color:#fecaca;">
          <?php foreach ($errors as $e): ?>
            <div>• <?php echo h($e); ?></div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
      <div style="margin-top:12px;" class="badges">
        <div class="badge">ヒット総数: <strong><?php echo (int)$totalCount; ?></strong></div>
        <div class="badge">期間: <strong><?php echo h($start ?: '指定なし'); ?> ~ <?php echo h($end ?: '指定なし'); ?></strong></div>
        <?php if ($urlLike !== ''): ?>
          <div class="badge">URLフィルタ: <strong><?php echo h($urlLike); ?></strong></div>
        <?php endif; ?>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <div class="section-title">
          <h2 style="margin:0; font-size:16px;">日別アクセス数</h2>
          <span class="muted">直近 <?php echo (int)$dailyLimit; ?> 件（降順）</span>
        </div>
        <div style="overflow:auto;">
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>アクセス数</th>
              </tr>
            </thead>
            <tbody>
              <?php if ($dailyRows): foreach ($dailyRows as $r): ?>
                <tr>
                  <td class="mono"><?php echo h($r['day'] ?? ''); ?></td>
                  <td><?php echo (int)($r['cnt'] ?? 0); ?></td>
                </tr>
              <?php endforeach; else: ?>
                <tr><td colspan="2" class="muted">データがありません</td></tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="section-title">
          <h2 style="margin:0; font-size:16px;">時間帯別アクセス数（<?php echo h($hourlyDay); ?>）</h2>
          <span class="muted">0-23時</span>
        </div>
        <div style="overflow:auto;">
          <table>
            <thead>
              <tr>
                <th>時間</th>
                <th>アクセス数</th>
              </tr>
            </thead>
            <tbody>
              <?php if ($hourlyRows): foreach ($hourlyRows as $r): ?>
                <tr>
                  <td class="mono"><?php echo h(($r['hour'] ?? '') . ':00'); ?></td>
                  <td><?php echo (int)($r['cnt'] ?? 0); ?></td>
                </tr>
              <?php endforeach; else: ?>
                <tr><td colspan="2" class="muted">データがありません</td></tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h2 style="margin:0; font-size:16px;">アクセスが多い順のURL</h2>
        <span class="muted">上位 <?php echo (int)$limitTop; ?> 件</span>
      </div>
      <div style="overflow:auto;">
        <table>
          <thead>
            <tr>
              <th>順位</th>
              <th>URL</th>
              <th>アクセス数</th>
            </tr>
          </thead>
          <tbody>
            <?php if ($topUrlRows): $rank=1; foreach ($topUrlRows as $r): ?>
              <tr>
                <td class="mono" style="width:60px;">#<?php echo $rank++; ?></td>
                <td class="mono"><a style="color:#93c5fd;" href="<?php echo h($r['url'] ?? ''); ?>" target="_blank" rel="noopener noreferrer"><?php echo h($r['url'] ?? ''); ?></a></td>
                <td style="width:120px;"><?php echo (int)($r['cnt'] ?? 0); ?></td>
              </tr>
            <?php endforeach; else: ?>
              <tr><td colspan="3" class="muted">データがありません</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>
