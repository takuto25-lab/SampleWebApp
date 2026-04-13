const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');


router.get('/', (req, res) => {
  res.render("signup", {
    error: null,
    username: ""
  });
});


router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("signup", {
        error: "入力してください",
        username
      });
    }

    if (password.length < 8) {
      return res.render("signup", {
        error: "パスワードは8文字以上",
        username
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    const [users] = await pool.query(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    const user = users[0];

    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.redirect('/memos');

  } catch (err) {
    let message = "エラーが発生しました";

    if (err.code === 'ER_DUP_ENTRY') {
      message = "そのユーザー名は既に使われています";
    }

    return res.render("signup", {
      error: message,
      username: req.body.username || ""
    });
  }
});

module.exports = router;