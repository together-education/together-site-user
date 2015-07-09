
/*
 * GET home page.
 */

var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function(app) {
  app.get("/", function (req, res) {
    res.render('index', { title: "主页"});
  });

  app.get("/login", notAuthentication);
  app.get("/login", function (req, res) {
    res.render('login', { title: "用户登录"});
  });

  app.post("/login", notAuthentication);
  app.post("/login", function (req, res) {
    var name = req.body.username,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');
    if (name == "" || password == "") {
      req.session.error = "请不要留白！";
      return res.redirect('/login');
    }

    User.get(name, function(err, user) {
      if (!user) {
        req.session.error = "用户不存在！";
        return res.redirect('/login')    ;//用户不存在就跳转回登录
      }
      //检查密码是否一致
      if (user.password != md5_password) {
        req.session.error = "密码错误！";
        return res.redirect('/login');
      }
      //用户名密码都匹配后，将用户信息存入session
      req.session.user = user;
      req.session.success = "登录成功！";
      res.redirect('/home');
    });
  });

  app.get("/register", notAuthentication);
  app.get("/register", function (req, res) {
    res.render('register', { title: "用户注册"});
  });

  app.post("/register", notAuthentication);
  app.post("/register", function (req, res) {
    var name = req.body.username,
        password = req.body.password,
        repassword = req.body['repassword'];
    if (name == "" || password == "" || repassword == "") {
      req.session.error = "请不要留白！";
      return res.redirect('/register');
    }
    if (password != repassword) {
      req.session.error = "两次密码输入不一样";
      return res.redirect('/register');
    }
    //密码的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest(    'hex');
    var newUser = new User({
      name: name,
      password: password
    });
    User.get(newUser.name, function (err, user) {
      if (user) {
        req.session.error = "用户已经存在!";
        return res.redirect('/register');
      }
      //不存在，则增加新用户
      newUser.save(function (err, user) {
        if (err) {
          req.session.error = err;
          return res.redirect('/register');
        }
        req.session.user = user;
        req.session.success = "注册成功！";
        res.redirect('/home');
      });

    });
  });

  app.get("/logout", authentication);
  app.get("/logout", function (req, res) {
    req.session.user = null;
    res.redirect('/');
  });

  app.get("/home", authentication);
  app.get("/home", function (req, res) {
    res.render('home', {
      title: 'Home'
      //username: req.session.username.toString()
    });
  });

  //这里是权限控制，通过检测session是否存在，对相关页面进行强制重定向
  function authentication (req, res, next) {
    if (!req.session.user) {
      req.session.error = '请登录';
      return res.redirect('/login');
    }
    next();
  }
  function notAuthentication (req, res, next) {
    if (req.session.user) {
      req.session.error = '已登录';
      return res.redirect('/home');
    }
    next();
  }
}