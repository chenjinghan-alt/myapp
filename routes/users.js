var express = require('express');
const ejs=require("ejs")
var router = express.Router();
var model=require('../model');
var flag=0; //标志用户是否已经存在
const { defaultConfiguration } = require('../app');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/register', function(req,res,next){
  var data={
    username: req.body.username,
    password:req.body.password,
    password2:req.body.password2,
    email:req.body.email
  }
  //数据检验
  
  var whereStr = {"username":data.username};  // 查询条件
  model.connect(function(db){
    db.collection('user').find(whereStr).toArray(function(err,docs){
      if(docs.length>0){
        flag=1;
        console.log("flag1",flag)
         if(data.password!=data.password2){
    res.redirect('/register')
  }
  else if(data.username.length==0 || data.password.length==0 || data.password2.length==0 || data.email.length==0 || flag==1){
    res.redirect('/register')
  }
  else{
    model.connect(function(db){
      db.collection('user').insertOne(data,function(err,ret){
        if(err){
          console.log("注册失败")
          res.redirect('/register')
        }
        else{
          res.redirect('/login')
        }
      })
    })
  }
      }
      else{
        flag=0;
        if(data.password!=data.password2){
          res.redirect('/register')
        }
        else if(data.username.length==0 || data.password.length==0 || data.password2.length==0 || data.email.length==0 || flag==1){
          res.redirect('/register')
        }
        else{
          model.connect(function(db){
            db.collection('user').insertOne(data,function(err,ret){
              if(err){
                console.log("注册失败")
                res.redirect('/register')
              }
              else{
                res.redirect('/login')
              }
            })
          })
        }
      }
    })
  })

  
  //res.send(data);
})

//登录接口
router.post('/login',function(req,res,next){
  var data={
    username: req.body.username,
    password:req.body.password
}
var  identity=req.body.check;//区分管理员和普通用户的标志
  // console.log(identity);
  if(identity=='users'){
    model.connect(function(db){
      db.collection('user').find(data).toArray(function(err,docs){
        if(err){
          res.redirect('/login')
        }else {
          if(docs.length>0){
            //登录成功，进行session会话储存
            req.session.username=data.username
            res.redirect('/')
          }else {
            res.redirect('/login')
          }
        }
      })
    })
  }else {
    model.connect(function(db){
      db.collection('admin').find(data).toArray(function(err,docs){
        if(err){
          res.redirect('/login')
        }else{
          if(docs.length>0){
            //登录成功，进行session会话储存
            req.session.username=data.username
            res.redirect('/admin')
          }
        }
      })
    })
  }
  

 // console.log('用户登录',data);
})

//退出登录
router.get('/logout',function(req,res,next){
    req.session.username=null;
    res.redirect('/login')
})
module.exports = router;
