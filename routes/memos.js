//Expressフレームワークの読み込み
const express = require('express');
//ルーター機能作成
const router = express.Router();

// DB（poolを読み込む）
const pool = require('../db');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

//async：awaitを使って非同期処理が可能
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM memo WHERE user_id = ?',
      [req.session.user.id]
    );

    res.render('memolist', {
      memos: rows,
      error: null
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const text = req.body.text;

    // 50文字チェック
    if (text.length > 50) {
      const [rows] = await pool.query(
        'SELECT * FROM memo WHERE user_id = ?',
        [req.session.user.id]
      );

      return res.render('memolist', {
        memos: rows,
        error: '50文字以内で入力してください'
      });
    }

    await pool.query(
      'INSERT INTO memo (text, user_id) VALUES (?, ?)',
      [text, req.session.user.id]
    );

    res.redirect('/memos');

  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/delete/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        await pool.query(
        'DELETE FROM memo WHERE id = ? AND user_id = ?',
        [id, req.session.user.id]
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
        'UPDATE memo SET text = ? WHERE id = ? AND user_id = ?',
        [text, id, req.session.user.id]
        );
        res.redirect('/memos');
    }catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;
