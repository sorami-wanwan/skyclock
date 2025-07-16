# SkyClock

## 概要

SkyClockは、窓が無い部屋で仕事をする人たちのための時計です。
朝焼けから夕焼け、そして夜の星空まで、一日の流れを視覚的に写します。

## ファイル構成

```
soramiclock/
├── index.html    # メインアプリケーション
├── sky-clock-test.html        # 60秒テスト版（開発用）
├── css/
│   ├── main.css                  # メインスタイル
│   ├── colors.css                # カラーパレット
│   └── background.css            # 背景演出スタイル
├── js/
│   ├── clock.js                  # 時計機能
│   ├── background.js             # 背景演出モジュール
│   ├── color-interpolation.js    # 色補間システム
│   └── ambient-occlusion.js      # アンビエントオクルージョン
└── doc/
    ├── SPECIFICATION.md          # 仕様書
    └── task.md                   # タスク管理
```

## 使用方法

### 基本的な使用方法

1. `index.html` をブラウザで開く
2. 現在時刻に応じて背景が自動的に変化します

### テスト版の使用方法

1. `sky-clock-test.html` をブラウザで開く
2. 「Start Test」ボタンをクリックして60秒間のシミュレーションを開始
3. 速度調整や手動時刻設定も可能

## 技術仕様

### 対応ブラウザ
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 使用技術
- HTML5
- CSS3 (カスタムプロパティ、アニメーション)
- JavaScript (ES6+)
- Canvas API (粒子効果)

## 開発環境

### 必要な環境
- ローカルサーバー（推奨）

### ローカルサーバーの起動
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server

# PHPの場合
php -S localhost:8000
```

## カスタマイズ

### 色の変更
`css/colors.css` のCSS変数を編集することで、時間帯別の色を変更できます。

### 背景の調整
`js/background.js` のパラメータを調整することで、山の形状や雲の動きを変更できます。

### 時計の表示形式
`js/clock.js` を編集することで、時刻の表示形式を変更できます。
