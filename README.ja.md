# MCSR (Minecraft Speedrunning) Pace Widget

[README in English](README.md)

Minecraft スピードラン（RSG）の配信を強化するペース表示ウィジェットです。
SpeedRunIGT と連携し、各スプリットのタイムと目標タイムとの差分をリアルタイムで表示します。
自己ベスト・目標ペースなど自由に基準タイムを設定でき、
OBS のブラウザソースとしてテーマを切り替えるだけで配信画面にすぐ組み込めます。

<img src="docs/timeline_texture-bar.gif" alt="タイムライン表示例">
<img src="docs/indicator_texture-bar.gif" alt="ビジュアルタイムライン表示例">

## Quick Start

SpeedRunIGT 14.0 以降と Java 17 以降が必要です。
**SpeedRunIGT オプション > タイマー で「自動保存間隔」を `Ticks` にしてください。** これが無いとスプリットがリアルタイムで書き出されません。
設定が違う場合はウィジェットの画面で知らせます。

1. [リリースページ](https://github.com/mcrtabot/MCSRPaceWidget/releases)から `mcsr-pace-widget.jar` をダウンロード
2. どちらかの方法で起動
   - **スタンドアロン**: `mcsr-pace-widget.jar` を実行
   - **Jingle プラグイン**: `C:\Users\<ユーザー名>\.config\Jingle\plugins` にコピーして Jingle を再起動
3. OBS のブラウザソースにこの URL を設定

   ```
   http://127.0.0.1:1161/indicator?theme=default
   ```

   横に伸ばしたいときはブラウザソースの **幅** を変えてください。

以上です。必要なものはすべて jar に入っています。

## ウィジェット

URL のパスを変えるとウィジェットが切り替わります。どれも `?theme=<テーマ名>` を受け付けます。

| ウィジェット | URL | 表示内容 |
| --- | --- | --- |
| Visual Timeline | `/indicator?theme=default` | バー形式で目標ペースに対する現在位置を表示 |
| Timeline | `/timeline?theme=default` | 各スプリットのタイムと目標ペースとの差分をテーブル表示 |
| Segment | `/segment?theme=default` | 現在の区間を表示。バナー演出や常時表示などの登場アニメーション付き |

13 分以内のランは MCSR のリタイム規定に合わせてポーズ時間を自動で加算します。

## 次のステップ

### 目標ペースを設定して差分を出す

設定しなくても動きます。PB が無いときの Visual Timeline はラン自体に合わせてスケールします。
PB（または任意の目標ペース）を設定すると、すべてのウィジェットでその差分が出ます。

- MCSRPaceWidget ウィンドウ（または Jingle タブ）の `Pace Settings...` をクリック
- `12:34`（12分34秒）または `12:34.567`（12分34.567秒）の形式で入力

### テーマを選ぶ

http://127.0.0.1:1161 を開き（`Open MCSR Pace Widget` でも開けます）、ウィジェットごとにテーマを選んで URL をコピーします。

<details>
<summary>Default / Texture-bar</summary>

<img src="docs/timeline_texture-bar.gif" alt="Default / Texture-bar タイムライン">
<img src="docs/indicator_texture-bar.gif" alt="Default / Texture-bar ビジュアルタイムライン">
</details>

<details>
<summary>Standard</summary>

<img src="docs/timeline_standard.gif" alt="Standard タイムライン">
<img src="docs/indicator_standard.gif" alt="Standard ビジュアルタイムライン">
</details>

<details>
<summary>Standard-full</summary>

<img src="docs/timeline_standard-full.gif" alt="Standard-full タイムライン">
<img src="docs/indicator_standard-full.gif" alt="Standard-full ビジュアルタイムライン">
</details>

<details>
<summary>Paceman（最新イベントのみ）</summary>

<img src="docs/timeline_paceman.gif" alt="Paceman タイムライン">
<img src="docs/indicator_paceman.gif" alt="Paceman ビジュアルタイムライン">
</details>

<details>
<summary>Paceman-list</summary>

<img src="docs/timeline_paceman-list.gif" alt="Paceman-list タイムライン">
<img src="docs/indicator_paceman-list.gif" alt="Paceman-list ビジュアルタイムライン">
</details>

<details>
<summary>Horizontal-timeline</summary>

<img src="docs/timeline_horizontal.gif" alt="Horizontal-timeline">
</details>

<details>
<summary>Niwatori</summary>

<img src="docs/timeline_niwatori.gif" alt="Niwatori タイムライン">
<img src="docs/indicator_niwatori.gif" alt="Niwatori ビジュアルタイムライン">
</details>

### CSS を書かずにテーマを調整する

トップページでテーマの横の `Customize...` を押します（http://127.0.0.1:1161/customize でも開けます）。
テーマエディタで色・フォント・サイズ・各パーツの表示/非表示を調整すると、その変更を含んだウィジェット URL が出るので、それを OBS に貼るだけです。
ファイルには何も書き込まないので、URL をそのまま人に渡すこともできます。

## 高度な設定

### 設定フォルダ

初回起動時に `~/.config/MCSRPaceWidget`（Windows は `C:\Users\<ユーザー名>\.config\MCSRPaceWidget`）を作り、同梱のファイルをコピーします。
MCSRPaceWidget ウィンドウ（または Jingle タブ）の `Open Config Folder` で開けます。

| パス | 内容 |
| --- | --- |
| `setting/pb.json` | 目標ペース。`Pace Settings...` が書き込む先 |
| `setting/player.json` | スキン顔に使う Minecraft ID / UUID（後述） |
| `theme/<テーマ名>/` | テーマ。自作テーマはここに置く |
| `icon/<セット名>/` | スプリットアイコンのセット |
| `upload/` | テーマエディタから追加した画像 |

ここにあるファイルが同梱のものより優先されます。一度作られたフォルダは上書きされません。
新しいリリースに同梱されたテーマやアイコンセットも一覧に出るので、アップデートは jar を差し替えるだけです。

### 顔を自分のスキンにする

Visual Timeline の顔キャラクターは自分の Minecraft スキンになります。標準で有効で、アカウントはランのデータから自動検出するので入力は不要です。
テーマ側に顔の画像がある場合はそちらが使われます（同梱の `niwatori` がそうです）。これはテーマの CSS で決まります。

- ウィジェット URL に `?face=theme` を付けるとテーマの画像、`?face=skin` を付けるとスキンを強制
- 別のアカウントにしたいとき（他の人のランを配信するときなど）は `setting/player.json` の `id` に Minecraft ID か UUID を入れる
- スキンが取得できないときはテーマの顔画像が出ます

### アイコンセット

スプリットアイコンは `icon/` の共通セット（`default`、`paceman`、`paceman-stat`）から出ます。
テーマは `setting.json` の `"iconSet"` でどれを使うか選びます。ウィジェット URL に `?icons=<セット名>` を付けると、ファイルを触らずに別のセットを試せます。

### カスタムテーマ

1. 設定フォルダ内でベースとなるテーマ（例: `theme/default`）をコピーしてリネーム
2. `setting.json` と CSS（`timeline.css` / `indicator.css` / `segment.css`）を編集
3. http://127.0.0.1:1161/playground でさまざまなデータパターンを使って表示を確認

テーマが対応するウィジェットの CSS だけを置いてください。サーバーは各ファイルの有無で対応ウィジェットを判定します。
Minecraft フォントを同梱しています。CSS で `font-family: 'Minecraft-Regular'` を指定すると本家に近い見た目になります。

CSS の詳しい仕様は [テーマ開発ガイド](resources/THEME_GUIDE.md) を参照してください。

## FAQ

**Q: Enter Bastion や Enter Fortress などのスプリットがすぐに表示されない**

A: SpeedRunIGT オプション > タイマー で「自動保存間隔」が `Ticks` になっているか確認してください。
この設定がないとスプリットデータがリアルタイムで書き込まれず、表示が遅れます。

**Q: jar を更新したのに新しいテーマが出てこない**

A: 同梱テーマは設定フォルダのテーマと合わせて一覧に出るので、再起動すれば表示されるはずです。
設定フォルダに同名のテーマがある場合はそちらが使われます。

## 開発

開発環境のセットアップやビルド手順は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## 関連プロジェクト

- [MCSRImageBuilder](https://github.com/mcrtabot/MCSRImageBuilder) — 完走したランからタイムライン画像を生成する Web ツール
