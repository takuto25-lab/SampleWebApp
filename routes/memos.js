//Expressフレームワークの読み込み
const express = require('express');
//ルーター機能作成
const router = express.Router();

// DB（poolを読み込む）
const pool = require('../db');

//async：awaitを使って非同期処理が可能
router.get('/',async(req,res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM memo');
        res.render('memolist', { memos: rows });
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/',async(req,res) =>{
    try{
        const text = req.body.text;
        await pool.query(
            'INSERT INTO memo (text) VALUES (?)',
            [text]
        );
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/delete/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        await pool.query(
            'DELETE FROM memo WHERE id = ?',
            [id]
        );
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/update/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        const text = req.body.text;
        await pool.query(
            'UPDATE memo SET text = ? WHERE id = ?',
            [text, id]
        );
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;
