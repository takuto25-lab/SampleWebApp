//モジュールの読み込み
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//ルートの読み込み
const indexRouter = require('./routes/index');
const memosRouter = require('./routes/memos');


//Expressアプリの生成（これがサーバーそのもの）
var app = express();


//ビューエンジン設定（HTMLに変数を埋め込んでページを生成できる）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//ミドルウェア登録
//開発用のアクセスログ作成
app.use(logger('dev'));
//JSON形式のリクエストの解析
app.use(express.json());
//フォーム送信の解析（URLエンコード）
app.use(express.urlencoded({ extended: false }));
//Cookieを使う
app.use(cookieParser());
//publicフォルダの静的ファイル(CSS,JS,画像)を公開
app.use(express.static(path.join(__dirname, 'public')));


//ルート設定
app.use('/', indexRouter);
app.use('/memos',memosRouter);


//404処理
app.use(function(req, res, next) {
  next(createError(404));
});


//エラーハンドラ
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

//サーバー起動
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running → http://localhost:${PORT}/memos`);
});

//エクスポート（別のファイルで使えるようにする）
module.exports = app;
