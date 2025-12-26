# 投稿（Markdown）追加手順

このリポジトリのブログ投稿は `posts/` 配下の Markdown ファイルと `posts/index.json` で管理します。

基本ルール
- 投稿ファイル名は次のいずれかの形式にしてください:
  - `slug.lang.md` 例: `my-post.en.md`, `my-post.ja.md`
  - `slug-lang.md` 例: `my-post-en.md`, `my-post-ja.md`
  - `slug.md`（単一言語で扱いたい場合）
- `slug` は URL の識別子になります（`/post.html?slug=slug` で参照されます）。

投稿の内容とメタ情報
- 各 Markdown の先頭に `# タイトル` を入れておくとスクリプトがタイトルを自動抽出します。
- 抜粋（excerpt）は最初の段落を自動抽出します。必要なら `posts/index.json` に手動で書いてください。

自動的に `posts/index.json` に未登録の Markdown を追加するスクリプト
- スクリプト: `scripts/generate_index.py`
- 使い方（リポジトリのルートで実行）:

```bash
python3 scripts/generate_index.py --dry-run
python3 scripts/generate_index.py --write
```

オプション
- `--dry-run`（デフォルト）: 追加予定のエントリを表示するだけです。
- `--write`: 実際に `posts/index.json` に追記してファイルを上書きします。
- `--posts-dir`/`--index` でパスを変更できます。

スクリプトの振る舞い
- `posts/` 内の Markdown をスキャンし、`slug` ごとに存在する言語を集めます。
- `index.json` に `slug` が存在しなければ、以下の情報を自動で作成して追加します:
  - `slug`, `langs`（検出した言語コード配列）
  - `title_en` / `title_ja`（対応言語の見出しを代入）
  - `excerpt_en` / `excerpt_ja`（最初の段落を代入）
  - `date`（ファイルの更新時刻を YYYY-MM-DD 形式で使用）
  - `tags`: 空配列

注意点
- 自動生成は既存エントリの上書きは行いません。手動で詳細なメタ（タグや抜粋の修正）を `posts/index.json` に記載してください。
- 追加後はブラウザで `/post.html?slug=<slug>&lang=<lang>` を開いて表示を確認してください。
