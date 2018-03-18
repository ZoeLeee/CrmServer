var express = require('express');
var router = express.Router();
var handler = require('./dbhandle');
var crypto = require('crypto');

/* GET users listing. */
router.post('/login', (req, res, next) => {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.upwd).digest('base64');
  console.log('password: ', password);
  console.log('{ name: req.body.uname }: ', { name: req.body.uname });
  handler(req, res, "user", { uname: req.body.uname }, data => {
    console.log(data);
    if (data.length === 0) {
      res.end('{"err":"抱歉，系统中并无该用户，如有需要，请向管理员申请"}');
    } else if (data[0].pwd !== req.body.upwd) {
      res.end('{"err":"密码不正确"}');
    } else if (data.length !== 0 && data[0].pwd === req.body.upwd) {

      req.session.username = req.body.uname; //存session
      req.session.password = password;

      res.end('{"success":true}');
    }
  })
})
module.exports = router;
