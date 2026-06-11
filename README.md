<div align="center">

# 📚 Study Tracker

**Portfolio Project** &nbsp;·&nbsp; Frontend Engineer Portfolio Work

**学習記録を管理する SaaS 風ダッシュボードアプリ**
React + TypeScript + Supabase による、DB を使った CRUD Web アプリ

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)

<br>

### 🚀 まずはここから ／ Quick Links

[![Live Demo](https://img.shields.io/badge/1.%20Live%20Demo-Open%20App-3FCF8E?style=for-the-badge&logo=vercel&logoColor=white)](https://study-tracker-delta-rouge.vercel.app/)
&nbsp;&nbsp;
[![Project Proposal](https://img.shields.io/badge/2.%20Project%20Proposal-View%20Doc-0F7A66?style=for-the-badge&logo=githubpages&logoColor=white)](https://hirotonozaki.github.io/study-tracker-proposal/)
&nbsp;&nbsp;
[![Source Code](https://img.shields.io/badge/3.%20Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hirotonozaki/study-tracker)

**▶ アプリを見る　→　📄 企画書を見る　→　💻 コードを見る**

</div>

---

## 📖 Overview ／ 概要

日々の学習（科目・時間・日付・メモ）を記録し、合計時間や科目別の内訳をダッシュボードで可視化する Web アプリです。
**Supabase（PostgreSQL）をバックエンドに、追加・一覧・編集・削除（CRUD）** を実装しています。
Web 制作（HTML / CSS / WordPress）に加えて、**DB を使った Web アプリ開発**ができることを示すために制作しました。

| 項目 | 内容 |
| :--- | :--- |
| **種別** | 学習管理 Web アプリ（SPA） |
| **公開 URL** | https://study-tracker-delta-rouge.vercel.app/ |
| **企画書** | https://hirotonozaki.github.io/study-tracker-proposal/ |
| **バックエンド** | Supabase（PostgreSQL / Row Level Security） |
| **データ操作** | Create / Read / Update / Delete（CRUD） |
| **担当範囲** | 課題発見 / 設計 / DB設計 / 実装 / 公開（すべて個人） |

<br>

## 🎯 Why I Built This ／ なぜ作ったか

Web 開発の学習を続ける中で、**学習時間を記録し振り返る仕組み**が欲しいと考え制作しました。
Web 制作（HTML / CSS / WordPress）に加え、**React・TypeScript・Supabase を利用したデータベース連携アプリケーション開発に挑戦する**ことも目的としています。

<br>

## 📄 Project Proposal ／ 企画書

このアプリの **「なぜ作ったか・どう設計したか・何を学んだか」** を企画書としてまとめ、公開しています。
コードだけでは伝わらない **課題発見から設計・技術選定までの思考プロセス** をご確認いただけます。

> ### ▶ [企画書を読む — Project Proposal](https://hirotonozaki.github.io/study-tracker-proposal/)

**企画書に含まれる内容**

| セクション | 内容 |
| :--- | :--- |
| 🎯 **制作背景** | 実体験から「学習時間を記録・振り返る仕組み」が欲しいと考えた経緯 |
| 🧩 **課題設定** | ユーザーの課題と、技術的に達成したいゴール |
| 🗄 **DB設計** | `study_records` テーブルの構成と、設計上の判断 |
| 🔁 **CRUD実装** | Supabase への CRUD と、ローカル state の即時反映 |
| ⚡ **Supabase採用理由** | バックエンド（PostgreSQL / BaaS）を選んだ理由 |
| ▲ **Vercel採用理由** | デプロイ先として選んだ理由 |
| 💡 **学んだこと** | 制作を通じて理解が深まったこと |
| 🔭 **今後の改善案** | 認証・正規化・テストなど、次のステップ |

<br>

## ✨ Features ／ 機能

- 📝 **学習記録の追加** — 科目・学習時間（分）・学習日・メモ
- 📋 **一覧表示** — 日付別にまとめて表示
- ✏️ **編集** / 🗑️ **削除** — 各記録を更新・削除（CRUD）
- 📊 **科目別の合計時間** — 横棒バーで内訳を可視化
- 🗓️ **日付別の学習履歴** — 日ごとの合計と内訳
- 📈 **ダッシュボード** — 合計時間・記録数・科目数・学習日数を集計表示
- ✅ **入力バリデーション** / **ローディング・エラー表示**

<br>

## 🛠 Tech Stack ／ 使用技術

| 領域 | 技術 |
| :--- | :--- |
| **Frontend** | React 18 / TypeScript / Vite |
| **Routing** | React Router（HashRouter） |
| **Backend / DB** | Supabase（PostgreSQL） |
| **Styling** | SCSS（デザイントークン + BEM ライク命名） |
| **Hosting** | Vercel |

<br>

## 🗄 Database ／ テーブル設計（`study_records`）

| カラム | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 主キー |
| `subject` | text | 科目名 |
| `minutes` | integer | 学習時間（分） |
| `studied_on` | date | 学習日 |
| `memo` | text (null可) | メモ |
| `created_at` | timestamptz | 作成日時 |

> 🔐 デモはログイン無しの単一ユーザー想定のため `anon` に CRUD を許可しています。本番では Supabase Auth + `user_id` 単位のポリシーへ置き換える前提です（詳細は[企画書](https://hirotonozaki.github.io/study-tracker-proposal/)）。

<br>

## 🚀 Getting Started ／ セットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. Supabase: SQL Editor で supabase/schema.sql を実行
#    （study_records テーブル・インデックス・RLS を作成）

# 3. 環境変数
cp .env.example .env
# .env に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定

# 4. 起動
npm run dev   # → http://localhost:5173
```

<br>

## 📂 Directory ／ ディレクトリ構成

```
study-tracker/
├── supabase/schema.sql           # テーブル + インデックス + RLS
└── src/
    ├── lib/supabase.ts           # Supabase クライアント
    ├── api.ts                    # CRUD（Supabase 呼び出し）
    ├── hooks/useStudyRecords.ts  # 取得 + CRUD のカスタムフック
    ├── types.ts / utils.ts       # 型 / 整形・集計
    ├── components/               # Layout / Dashboard / Records / RecordForm / RecordList
    └── styles/globals.scss       # デザインシステム
```

<br>

## 💡 What I Focused On ／ 工夫した点

- **データ操作の分離** — `api.ts`（Supabase 呼び出し）と `useStudyRecords`（state 同期）に集約し、画面は表示に専念
- **型安全** — DB の行・フォーム入力・集計結果をそれぞれ型で定義し、壊れにくく
- **集計はアプリ側で** — 科目別・日付別の集計を純粋関数（`utils.ts`）として実装
- **CRUD 後の即時反映** — API を都度呼ばず、ローカル state を更新して UI に反映

> 設計意図・技術選定の詳細は **[企画書](https://hirotonozaki.github.io/study-tracker-proposal/)** にまとめています。

<br>

## 🔭 Future Work ／ 今後の改善案

- `subjects` テーブルへの正規化（外部キー・JOIN）
- Supabase Auth によるログインとユーザー別データ（RLS 本番仕様）
- 週次／月次の推移グラフ・目標時間の設定
- Vitest + React Testing Library でのテスト

<br>

<div align="center">

---

**🔗 Links**

[▶ Live Demo](https://study-tracker-delta-rouge.vercel.app/) ・ [📄 企画書 / Proposal](https://hirotonozaki.github.io/study-tracker-proposal/) ・ [💻 GitHub Repository](https://github.com/hirotonozaki/study-tracker)

<sub>Portfolio work — React / TypeScript / Supabase による CRUD Web アプリ</sub>

</div>
