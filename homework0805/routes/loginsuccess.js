var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next) {
    res.send('成功')
    res.render('login')
});
module.exports = router;
