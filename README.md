# TodoList_jig

### 追加課題
HTML/CSS/JavaScriptを使ったWebアプリの制作

## モデル
- ユーザ
  - ID
  - パスワード
  - 年齢
  - メールアドレス

- Todo
  - ID
  - タイトル
  - メモ
  - 期日
  - 優先順位
  - 完了チェック
  - ユーザID

## 出来ること
- ユーザの作成、ログイン、ログアウト、情報の更新
- Todoの作成、更新、削除、絞り込み

## 機能
- ログインしていないユーザがアクセスするとログインフォームに遷移する
- ユーザ及びTodoの作成時と更新時に、不適切な値を保存できない
- Todoは、優先順位及び期日を過ぎている場合を考慮して、背景色を変えるようにしている

  
## プラグイン
- ejs
- express-session
- express-validator
- passport
- passport-local
