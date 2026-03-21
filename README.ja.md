# MCSR (Minecraft Speedrunning) Pace Widget

[README in English](README.md)

Minecraft スピードラン（RSG）の配信を強化するペース表示ウィジェットです。
SpeedRunIGT と連携し、各スプリットのタイムと目標タイムとの差分をリアルタイムで表示します。
自己ベスト・目標ペースなど自由に基準タイムを設定でき、
OBS のブラウザソースとしてテーマを切り替えるだけで配信画面にすぐ組み込めます。

<img src="docs/timeline_texture-bar.gif" alt="タイムライン表示例">
<img src="docs/indicator_texture-bar.gif" alt="ビジュアルタイムライン表示例">

## 特徴

- **タイムライン** — 現在のペースと自己ベスト（PB）との差分をテーブル表示
- **ビジュアルタイムライン** — バー形式で進行状況を視覚的に表示
- カスタマイズ可能なテーマ（7種類同梱 + 自作テーマ対応）
- SpeedRunIGT と連携したリアルタイム更新

## 必要条件

- SpeedRunIGT 14.0 以降
  - **SpeedRunIGT オプション > タイマー で「自動保存間隔」を `Ticks` に設定してください** — スプリットをリアルタイムで表示するために必要です

## インストール

[リリースページ](https://github.com/mcrtabot/MCSRPaceWidget/releases)から zip をダウンロードし、解凍します。

### スタンドアロン実行

1. `mcsr-pace-widget.jar` を実行
2. `open MCSR Pace Widget` をクリック（http://127.0.0.1:1161 が開きます）
3. テーマを選択し、ウィジェット URL をコピー
4. OBS のブラウザソースに URL を設定

### Jingle プラグインとして実行

1. ホームディレクトリに `.config/MCSRPaceWidget` ディレクトリを作成し、解凍した `theme` と `setting` をコピー
   - Windows: `C:\Users\<ユーザー名>\.config\MCSRPaceWidget`
2. `mcsr-pace-widget.jar` を Jingle プラグインディレクトリにコピー
   - `C:\Users\<ユーザー名>\.config\Jingle\plugins`
3. Jingle を再起動し、Plugins > MCSR Pace Widget タブを開く
4. `open MCSR Pace Widget` をクリックし、テーマを選択
5. OBS のブラウザソースにウィジェット URL を設定

## 設定

`setting` と `theme` ディレクトリは以下のいずれかに配置します（上が優先）:

1. `~/.config/MCSRPaceWidget/` 内
2. `mcsr-pace-widget.jar` と同じディレクトリ内

### PB タイム設定

自己ベストとの差分を表示するには、PB タイムを設定します。

- MCSRPaceWidget ウィンドウ（または Jingle タブ）で `Pace Settings...` をクリック
- `12:34`（12分34秒）または `12:34.567`（12分34.567秒）の形式で入力

### カスタムテーマ

1. `theme` ディレクトリ内のベーステーマ（例: `default`）をコピーしてリネーム
2. `setting.json` と `timeline.css` / `indicator.css` を編集

Minecraft フォントが同梱されています。テーマ CSS で `font-family: 'Minecraft-Regular'` を指定すると、より Minecraft らしい見た目にできます。

## テーマ一覧

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
<summary>Paceman（最新イベントのみ表示）</summary>

<img src="docs/timeline_paceman.gif" alt="Paceman タイムライン">
<img src="docs/indicator_paceman.gif" alt="Paceman ビジュアルタイムライン">
</details>

<details>
<summary>Paceman-list</summary>

<img src="docs/timeline_paceman-list.gif" alt="Paceman-list タイムライン">
<img src="docs/indicator_paceman-list.gif" alt="Paceman-list ビジュアルタイムライン">
</details>

<details>
<summary>Horizontal</summary>

<img src="docs/timeline_horizontal.gif" alt="Horizontal タイムライン">
</details>

<details>
<summary>Niwatori</summary>

<img src="docs/timeline_niwatori.gif" alt="Niwatori タイムライン">
<img src="docs/indicator_niwatori.gif" alt="Niwatori ビジュアルタイムライン">
</details>

## FAQ

**Q: Enter Bastion や Enter Fortress などのスプリットがすぐに表示されない**

A: SpeedRunIGT オプション > タイマー で「自動保存間隔」が `Ticks` になっているか確認してください。
この設定がされていないと、スプリットデータがリアルタイムで書き出されず、表示が遅延します。

## 開発

開発に参加する場合は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## 関連プロジェクト

- [MCSRImageBuilder](https://github.com/mcrtabot/MCSRImageBuilder) — ランのタイムライン画像を生成するWebツール
