var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.post('/',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
    var options = {
        host:'localhost',
        port:3306,
        user:'root',
        password:''

    };
    var connect = mysql.createConnection(options);
    connect.connect(function (error) {
        if (error){
            console.log('连接失败')
        }else{
            console.log('连接成功')
        }
    });
    var useDBSQL = 'use login';
    connect.query(useDBSQL,function (error) {
        if (error){
            console.log('使用失败')
            console.log(error)
        }else{
            console.log('使用成功')
        }
    });
    var selectSQL = 'select * from log';
    connect.query(selectSQL,function (error,results) {
        if(error){
            console.log('查询失败')
        }else{
            console.log('查询成功');
            console.log(results);
            for(var i = 0;i < results.length;i++){
                //console.log(password);
                if(username== results[i]['username'] && password == results[i]['password']){
                    res.send('登陆成功')
                    res.render('loginsuccess')
                } else {
                    res.send('登录失败')
                    res.render('loginsuccess')
                }
            }
        }
    })
});
module.exports = router;
