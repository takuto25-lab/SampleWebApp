const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

// ログイン画面
router.get('/', (req, res) => {
  res.render('login', {
    error: null
  });
});

// ログイン処理
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("login", {
        error: "入力してください"
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.render("login", {
        error: "ユーザーが存在しません"
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        error: "パスワードが違います"
      });
    }

    // ログイン成功
    req.session.user = {
        id: user.id,
        username: user.username
    };
    return res.redirect('/memos');

  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
module.exports = router;