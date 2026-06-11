# Study Tracker — 設計ドキュメント

React + TypeScript + Vite + Supabase で作る学習管理アプリの設計をまとめたものです。
「Web制作だけでなく、**DBを使った Web アプリ開発・CRUD・SaaS 風 UI**」を示すことを目的にしています。

---

## 1. 画面構成

サイドバー付きの SaaS 風レイアウト。画面は2つです。

```
┌────────────┬───────────────────────────────────────┐
│  Sidebar   │  Main                                  │
│            │                                        │
│  ST        │  ① ダッシュボード (/)                  │
│  Study     │     ・統計カード（合計時間/記録数/    │
│  Tracker   │       科目数/学習日数）                │
│            │     ・科目別の合計時間（横棒バー）     │
│ ▸ダッシュ  │     ・最近の記録（最新5件）            │
│ ▸学習記録  │                                        │
│            │  ② 学習記録 (/records)                 │
│            │     ・左：追加/編集フォーム            │
│            │     ・右：日付別の一覧（編集・削除）   │
└────────────┴───────────────────────────────────────┘
```

| 画面 | パス | 役割 |
| :--- | :--- | :--- |
| ダッシュボード | `/` | 学習データの集計を一目で把握（Read + 集計） |
| 学習記録 | `/records` | 記録の追加・編集・削除（CRUD の操作画面） |

- ルーティングは `react-router-dom`（`HashRouter`）。静的ホスティング（GitHub Pages 等）でもそのまま動く構成。
- レスポンシブ対応：880px 以下でサイドバーが上部の横並びに変化し、グリッドが1カラムになる。

---

## 2. DB設計

学習記録は「**ある日・ある科目を何分やったか**」が1件の情報。これを1テーブルで表現します。

- テーブルは `study_records` の**1つ**。
- 科目は別テーブルにせず `subject`（text）として記録に持たせる。
  - 理由：規模が小さく、科目別集計は `subject` でグループ化すれば足りるため。正規化（subjects テーブル + 外部キー）は **今後の改善案**として後述。
- 学習時間は `minutes`（integer・分）で保持し、表示時に「1h 30m」へ整形する。
  - 「1.5時間」のような小数を持たず、整数で扱えるため計算・集計が単純。

| カラム | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK, default `gen_random_uuid()` | 主キー |
| `subject` | text | not null | 科目名 |
| `minutes` | integer | not null, `check (minutes > 0)` | 学習時間（分） |
| `studied_on` | date | not null, default `current_date` | 学習日 |
| `memo` | text | nullable | メモ（任意） |
| `created_at` | timestamptz | not null, default `now()` | 作成日時 |

**集計の考え方（アプリ側で計算）**
- 合計時間 … `minutes` の合計
- 科目別 … `subject` でグループ化して合計（多い順）
- 日付別履歴 … `studied_on` でグループ化（新しい日順）

---

## 3. Supabase のテーブル設計

`supabase/schema.sql` を Supabase の **SQL Editor** に貼って実行すれば、テーブル・インデックス・RLS ポリシーが作成されます。

- **インデックス**：`studied_on`（降順・並び替え用）と `subject`（集計用）に付与。
- **RLS（Row Level Security）**：このデモはログイン無しの単一ユーザー想定のため、`anon` に CRUD を許可するポリシーを置いています。

> ⚠️ **本番化のときは認証必須**
> 実運用では Supabase Auth を導入し、`user_id uuid references auth.users` 列を追加して
> 「`auth.uid() = user_id` の行だけ操作可」というポリシーに置き換えます。
> 今回は「DB に繋いで CRUD する」ことを示すデモのため、あえてシンプルにしています。

---

## 4. コンポーネント設計

「**状態を持つ／API を呼ぶ層**」と「**受け取って表示する層**」を分けています。

```
App                      … 状態ストア(useStudyRecords)を1つ持ち、各ページへ渡す
└─ Layout                … サイドバー + <Outlet/>（SaaS 風シェル）
   ├─ Dashboard          … records を受け取り、集計して表示（表示専任）
   └─ Records            … 編集対象の state を持つページ
      ├─ RecordForm      … 追加/編集フォーム（バリデーション）
      └─ RecordList      … 日付別の一覧（編集・削除ボタン）

hooks/useStudyRecords    … 取得 + CRUD を集約。state を更新して画面へ即時反映
api.ts                   … Supabase への CRUD（SQL を画面から隠す層）
lib/supabase.ts          … Supabase クライアント生成
types.ts                 … 型定義（StudyRecord など）
utils.ts                 … 表示整形（分→"1h 30m"）と集計（科目別・日付別）
```

| 種類 | 担当 |
| :--- | :--- |
| `useStudyRecords` | データ取得・追加・編集・削除と、ローカル state の同期 |
| `api.ts` | Supabase の呼び出しだけを担当（画面は SQL を意識しない） |
| `RecordForm` | 入力とバリデーション、送信イベントの発火のみ |
| `RecordList` / `Dashboard` | 受け取ったデータの表示だけ（props で動く純粋な部品） |

**設計の意図**：データ操作を `api.ts` と `useStudyRecords` に集約することで、画面コンポーネントは「表示」に専念でき、後から機能を足しても壊れにくくなる。

---

## 5. ファイル構成

```
study-tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .env.example              # Supabase の URL / anon key の雛形（.env にコピー）
├── .gitignore
├── supabase/
│   └── schema.sql            # テーブル + インデックス + RLS
└── src/
    ├── main.tsx              # エントリ（React 描画）
    ├── App.tsx               # ルーティング + 状態ストアの共有
    ├── vite-env.d.ts         # 環境変数の型
    ├── types.ts              # 型定義
    ├── api.ts                # Supabase への CRUD
    ├── utils.ts              # 整形・集計
    ├── lib/
    │   └── supabase.ts       # Supabase クライアント
    ├── hooks/
    │   └── useStudyRecords.ts# 取得 + CRUD のカスタムフック
    ├── components/
    │   ├── Layout.tsx
    │   ├── Dashboard.tsx
    │   ├── Records.tsx
    │   ├── RecordForm.tsx
    │   └── RecordList.tsx
    └── styles/
        └── globals.scss      # デザインシステム（SCSS）
```

---

## 6. 実装手順

ゼロから作る場合の流れ。完成版は本リポジトリにそのまま入っています。

1. **プロジェクト作成**
   ```bash
   npm create vite@latest study-tracker -- --template react-ts
   cd study-tracker
   npm install
   npm install @supabase/supabase-js react-router-dom
   npm install -D sass
   ```
2. **Supabase 準備**：[supabase.com](https://supabase.com) でプロジェクト作成 → SQL Editor に `supabase/schema.sql` を貼って実行。
3. **環境変数**：`.env.example` を `.env` にコピーし、Project Settings → API の URL と anon key を設定。
4. **データ層**：`lib/supabase.ts`（クライアント）→ `types.ts`（型）→ `api.ts`（CRUD）→ `utils.ts`（集計）の順に実装。
5. **状態管理**：`hooks/useStudyRecords.ts` で取得と CRUD を集約。
6. **画面**：`Layout` → `Dashboard` → `RecordForm` / `RecordList` → `Records` の順に組み、`App.tsx` でルーティング。
7. **スタイル**：`styles/globals.scss` でデザインを整える。
8. **起動**：`npm run dev` で `http://localhost:5173` を確認。
9. **デプロイ**（任意）：Vercel / Netlify に接続し、環境変数を設定して公開。

---

## 今後の改善案（背伸びしない範囲で）

- `subjects` テーブルを分けて正規化（外部キー・JOIN を扱う）
- Supabase Auth でログイン → ユーザーごとの記録（RLS を本番仕様に）
- 週次・月次の推移グラフ、目標時間の設定
- Vitest + React Testing Library でロジックのテスト
