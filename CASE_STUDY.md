# Study Tracker — Case Study

> ポートフォリオ掲載用の Case Study 文章です。未経験〜ポテンシャル採用向けに、
> 背伸びせず、React・TypeScript・DB・CRUD を理解して作ったことが伝わるトーンで書いています。

---

## 概要

**Study Tracker** は、日々の学習（科目・時間・日付・メモ）を記録し、合計時間や科目別の内訳を
ダッシュボードで可視化する Web アプリです。React 18 / TypeScript / Vite で構築し、
バックエンドに **Supabase（PostgreSQL）** を使って、学習記録の**追加・一覧・編集・削除（CRUD）** を実装しました。

| 種別 | 学習管理 Web アプリ（SPA） |
| :--- | :--- |
| 使用技術 | React 18 / TypeScript / Vite / Supabase / SCSS / React Router |
| 担当範囲 | 設計 / DB設計 / 実装（フロントエンド） |

---

## 1. 制作背景

これまで HTML / CSS / WordPress での Web 制作を中心に学んできましたが、
**「データベースに繋いで、データを保存・更新する Web アプリ」** を自分で一から作った経験を形にしたいと考えていました。

学習記録アプリは、**CRUD（作成・取得・更新・削除）** と**集計（合計時間・科目別）** が一通り必要で、
SaaS のダッシュボードのような UI も練習できます。「DB を使った Web アプリ開発」を理解するのにちょうどよい題材として選びました。

---

## 2. 課題設定

- **ユーザー視点**：勉強した内容を手軽に記録し、「どの科目をどれだけやったか」を一目で振り返れるようにする。
- **技術的なゴール**：
  - Supabase（PostgreSQL）をバックエンドに、**CRUD を一通り実装する**。
  - DB の行・フォーム入力・集計結果を **TypeScript の型**で表現し、壊れにくくする。
  - データ操作（API）と画面（表示）を分け、**見通しのよい設計**にする。
  - 合計時間・科目別・日付別の**集計を自分で実装**し、ダッシュボードに可視化する。

---

## 3. 使用技術

| 技術 | 選定理由 |
| :--- | :--- |
| React 18 / TypeScript | 状態に応じて画面が更新される宣言的 UI と、型による安全性のため |
| Vite | 開発サーバーが軽快で、学習中の試行錯誤がしやすいため |
| Supabase | PostgreSQL をすぐ使え、JS クライアントから CRUD が書きやすいため |
| React Router | ダッシュボードと記録画面を分けるルーティングのため |
| SCSS | 変数・ネストでデザインを見通しよく管理するため |

---

## 4. データベース設計（CRUD のためのテーブル）

学習記録は「**ある日・ある科目を何分やったか**」が1件の情報。これを `study_records` テーブル1つで表現しました。

| カラム | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 主キー |
| `subject` | text | 科目名 |
| `minutes` | integer | 学習時間（分） |
| `studied_on` | date | 学習日 |
| `memo` | text | メモ（任意） |
| `created_at` | timestamptz | 作成日時 |

- 学習時間は**分（integer）** で保持し、表示時に「1h 30m」へ整形。計算・集計が単純になる。
- 科目別・日付別の集計は、`subject` / `studied_on` でグループ化して算出。
- 並び替え・集計でよく使う列にはインデックスを付与。

---

## 5. コンポーネント設計

「**状態を持つ／DB を呼ぶ層**」と「**受け取って表示する層**」を分けました。

```
App                      … 学習記録ストアを1つ持ち、各ページへ渡す
└─ Layout                … サイドバー + メイン（SaaS 風シェル）
   ├─ Dashboard          … 集計して表示するだけ（表示専任）
   └─ Records            … 編集対象を管理するページ
      ├─ RecordForm      … 入力・バリデーション・送信
      └─ RecordList      … 日付別の一覧（編集・削除）

useStudyRecords (hook)   … 取得 + CRUD を集約し、state を更新して即時反映
api.ts                   … Supabase への CRUD（画面から SQL を隠す層）
```

データ操作を `api.ts` と `useStudyRecords` に集約することで、画面コンポーネントは表示に専念でき、
後から機能を足しても壊れにくい構成にしています。

---

## 6. API / DB 通信の流れ（CRUD）

例として「記録を追加」する流れ：

1. フォームに入力し、送信する。
2. 入力をバリデーション（科目が空でないか、時間が1以上か）。
3. `api.ts` の `createRecord()` が Supabase に `insert` する。
4. 返ってきた1件を**ローカル state の先頭に追加**して即時反映（再取得しない）。
5. 失敗時は `try / catch` でエラーメッセージを表示。

取得・更新・削除も同様に、`api.ts` の関数を `useStudyRecords` 経由で呼び、state を同期します。

```ts
// Create の例（api.ts）
export async function createRecord(input: StudyRecordInput): Promise<StudyRecord> {
  const { data, error } = await supabase
    .from('study_records')
    .insert({ subject: input.subject, minutes: input.minutes, studied_on: input.studied_on, memo: input.memo || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

---

## 7. 工夫した点

- **データ操作の分離**：Supabase 呼び出しを `api.ts` に閉じ込め、画面は SQL を意識しない作りにした。
- **型で壊れにくく**：DB の行・フォーム入力・集計結果をそれぞれ型で定義した。
- **集計を純粋関数に**：科目別・日付別の集計を `utils.ts` の純粋関数として切り出し、テストしやすくした。
- **CRUD 後の即時反映**：API を都度呼ばず、ローカル state を更新して UI に反映し、体感を軽くした。

---

## 8. 苦労した点と解決方法

- **環境変数と接続**：Supabase の URL / anon key が未設定だと動かず最初つまずいた。→ クライアント生成時に未設定を検知して分かるエラーを出すようにした。
- **RLS で操作できない**：RLS を有効にしたら最初は読み書きできなかった。→ 仕組みを理解し、デモ用に anon を許可するポリシーを設定（本番は Auth 前提だと整理）。
- **状態の同期**：更新・削除のたびに全件再取得すると重い。→ 返り値や id を使ってローカル state だけ更新する形にした。

---

## 9. 今後の改善案

- `subjects` テーブルへの正規化（外部キー・JOIN を扱う）
- Supabase Auth でログイン → ユーザーごとの記録（RLS を本番仕様に）
- 週次・月次の推移グラフ、目標時間の設定
- Vitest + React Testing Library でのテスト

---

## 10. この制作で活かせる点

- **DB を使った Web アプリ開発・CRUD** を一通り実装した経験は、SaaS プロダクト開発の基礎としてそのまま活かせます。
- データ取得・集計・可視化（ダッシュボード）の流れは、**SaaS の管理画面**に通じます。
- 今後 Kotlin / Spring Boot・PostgreSQL を学び、「フロントから DB を扱う」側から「API・DB を設計する」側へ広げ、
  フルスタックエンジニアとして自走できるよう成長していきたいです。
