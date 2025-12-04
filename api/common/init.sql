-- タグ提案テーブル
CREATE TABLE IF NOT EXISTS tag_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT NOT NULL,           -- 地域 (global, kanto, johto, など)
    pokedex_no INTEGER NOT NULL,  -- 図鑑番号
    tag TEXT NOT NULL,            -- タグ名
    status TEXT DEFAULT 'pending', -- ステータス (pending, approved, rejected)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(area, pokedex_no, tag)  -- 同じ地域・番号・タグの重複を防ぐ
);

-- 承認済みタグテーブル（将来の拡張用）
CREATE TABLE IF NOT EXISTS approved_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT NOT NULL,
    pokedex_no INTEGER NOT NULL,
    tag TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(area, pokedex_no, tag)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_tag_suggestions_area_no ON tag_suggestions(area, pokedex_no);
CREATE INDEX IF NOT EXISTS idx_approved_tags_area_no ON approved_tags(area, pokedex_no);
