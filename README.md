# Biz-Data Analysis Frontend 🎨

このプロジェクトは、AIによるビジネス分析プラットフォームのフロントエンド・インターフェースです。
Next.js（またはReact）を使用し、ユーザーが入力した事業データをバックエンド API へ送信、Gemini 2.0 が生成した分析結果をリアルタイムで表示します。

## 🌟 主な機能
- **直感的な入力フォーム**: 事業名、事業概要、目標売上を簡単に送信。
- **AI分析結果の表示**: バックエンド経由で取得した Gemini 2.0 の高度な分析を美しくレンダリング。
- **レスポンシブデザイン**: PC、タブレット、スマートフォン全てのデバイスに対応。

## 🛠️ 技術スタック
- **Framework**: Next.js / React
- **Styling**: Tailwind CSS / Lucid-react (アイコン)
- **API Client**: Axios / SWR (または Fetch API)
- **Deployment**: Docker / AWS EC2

## 🔌 API 連携設定
フロントエンドは以下のエンドポイントと通信します。
- **Development**: `http://localhost:8080/api/businesses`
- **Production**: `http://54.92.3.60:8080/api/businesses`

## 🚀 クイックスタート

### 1. 依存関係のインストール
```bash
npm install

Frontend URL: http://54.92.3.60:3000/
Backend API (web2_15_biz-api)
