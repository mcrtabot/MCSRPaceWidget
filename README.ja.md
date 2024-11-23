# MCSR (Minecraft Speedrunning) Pace Widget

[README in English is here](README.md)

## 概要

リアルタイムでペースを表示する マインクラフト RTA のウィジェットツールです。

## 必要条件

- SpeedRunIGT 14.0 以降
  - **リアルタイムの更新には、SpeedRunIGT オプション > タイマー内で"自動保存間隔"を`Ticks`に設定してください！**

## 特徴

### タイムライン

- 現在のペース、および自己ベストとの違いを表示します。

<img src="docs/timeline_texture-bar.gif" alt="現在のペースと自己ベストの差を表示しているタイムライン">

### ビジュアルタイムライン (旧称: インジケーター)

- 視覚的に分かりやすいタイムライン

<img src="docs/indicator_texture-bar.gif" alt="視覚的にグラフィカルなタイムラインの表現">

### その他

- カスタマイズ可能なテーマ
- リアルタイム更新
- ブラウザソースを使って OBS 上で簡単に表示可能

## 使用方法

### スタンドアロン実行

1. [リリースページ](https://github.com/mcrtabot/MCSRPaceWidget/releases)からダウンロードし、zip ファイルを解凍します。
2. （オプション）ホームディレクトリ内に`.config/MCSRPaceWidget`ディレクトリを作成し（Windows の場合: `C:\Users\[username]`, Mac の場合: `/Users/[username]`）、解凍したディレクトリから`theme`および`setting`をコピーします。
3. `mcsr-pace-widget.jar`を実行します。
4. `open MCSR Pace Widget`をクリックします（これによりブラウザでhttp://127.0.0.1:1161が開きます）。
5. テーマを選択し、ウィジェット URL をコピーします。
6. ウィジェットを使用します（例：OBS ブラウザソースで）。
7. "自動保存間隔"を（SpeedRunIGT オプション > タイマー内で）`Ticks`に設定します。

### Jingle プラグインとしての実行

1. [リリースページ](https://github.com/mcrtabot/MCSRPaceWidget/releases)からダウンロードし、zip ファイルを解凍します。
2. （必須！）ホームディレクトリ内に`.config/MCSRPaceWidget`ディレクトリを作成し（Windows の場合: `C:\Users\[username]`）、解凍したディレクトリから`theme`および`setting`をコピーします。
3. `mcsr-pace-widget.jar`を Jingle プラグインディレクトリ（`C:\Users\[username]\.config\Jingle\plugins`）にコピーします。
4. Jingle を再起動します。
5. プラグイン -> MCSR Pace Widget タブを開きます。
6. `open MCSR Pace Widget`をクリックします（これによりブラウザでhttp://127.0.0.1:1161が開きます）。
7. テーマを選択し、ウィジェット URL をコピーします。
8. ウィジェットを使用します（例：OBS ブラウザソースで）。
9. "自動保存間隔"を（SpeedRunIGT オプション > タイマー内で）`Ticks`に設定します。

### 設定

- `setting`フォルダと`theme`フォルダは、ホームディレクトリの`.config/MCSRPaceWidget`ディレクトリ内か、`mcsr-pace-widget.jar`と同じディレクトリ内に配置されます。
- これらのディレクトリがホームディレクトリの`.config/MCSRPaceWidget`ディレクトリ内に存在する場合、それらが優先されます。

#### PB タイム設定

自己ベスト（PB）との差を確認するには、PB タイム設定を編集します。

- MCSRPaceWidget ウィンドウ内（または Jingle のタブ内）で`Pace Settings...`をクリックし、時間を入力します。
- 時間は`12:34`（12 分 34 秒）または`12:34.567`（12 分 34.567 秒）の形式で入力します。

#### カスタムテーマ

- ベースとなるテーマ（例：default）をコピーし、`theme`ディレクトリ内で名前を変更します。
- `setting.json`とスタイルシート`timeline.css` / `indicator.css`を編集します。

## テーマ

- Default / Texture-bar

  <img src="docs/timeline_texture-bar.gif" alt="Default / Texture-bar theme timeline">
  <img src="docs/indicator_texture-bar.gif" alt="Default / Texture-bar theme indicator">

- Standard

  <img src="docs/timeline_standard.gif" alt="Standard theme timeline">
  <img src="docs/indicator_standard.gif" alt="Standard theme indicator">

- Standard-full

  <img src="docs/timeline_standard-full.gif" alt="Standard-full theme timeline">
  <img src="docs/indicator_standard-full.gif" alt="Standard-full theme indicator">

- Paceman (display latest event only)

  <img src="docs/timeline_paceman.gif" alt="Paceman theme timeline">
  <img src="docs/indicator_paceman.gif" alt="Paceman theme indicator">

- Paceman-list

  <img src="docs/timeline_paceman-list.gif" alt="Paceman-list theme timeline">
  <img src="docs/indicator_paceman-list.gif" alt="Paceman-list theme indicator">

- Horizontal

  <img src="docs/timeline_horizontal.gif" alt="Horizontal theme timeline">

- Niwatori

  <img src="docs/timeline_niwatori.gif" alt="Niwatori theme timeline">
  <img src="docs/indicator_niwatori.gif" alt="Niwatori theme indicator">

加えて、あなた自身がカスタマイズしたテーマも追加可能です！

Minecraft 風の見た目には[Minecraft フォント](https://fontmeme.com/jfont/minecraft-font/)を使用できます。
