//Expressフレームワークの読み込み
const express = require('express');
//ルーター機能作成
const router = express.Router();
//mssqlライブラリを読み込み
const sql = require('mssql');
//../db.jsで設定した情報を読み込める
const config = require('../db');

//async：awaitを使って非同期処理が可能
router.get('/',async(req,res) =>{
    try{
        //poolはDB接続の枠のこと
        //configを元にしてSQL Serverへ接続できる
        //awaitによって処理が終わるまで待つ
        const pool = await sql.connect(config);
        //result.recordsetに取得データを配列で入れれる
        const result = await pool.request().query('SELECT * FROM Memo');
    
        //memolist.ejsにデータを渡す
        res.render('memolist',{ memos: result.recordset });
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/',async(req,res) =>{
    try{
        const text = req.body.text;
        const pool = await sql.connect(config);
        await pool.request()
            .input("text",sql.NVarChar(50),text)
            .query('INSERT INTO Memo(Text) VALUES (@text)');
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/delete/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        const pool = await sql.connect(config);
        await pool.request()
            .input('id',sql.Int,id)
            .query('DELETE FROM Memo WHERE Id=@id');
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/update/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        const text = req.body.text;
        const pool = await sql.connect(config);
        await pool.request()
            .input('id',sql.Int,id)
            .input('text',sql.NVarChar(50),text)
            .query('Update Memo SET Text=@text WHERE Id=@id');
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;
