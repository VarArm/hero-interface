const express = require('express')
const bodyParser = require('body-parser')
var multer = require('multer')
// 导入path模块
const path = require('path')
var upload = multer({ dest: 'uploads/' })
const db = require('./utils/db.js')
const app = express()
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
// 暴露  www目录让 外部访问
app.use(express.static('www'))
//获取post上传在body中的数据
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/login', function (req, res) {
    const { userName, password } = req.body
    if (userName == 'admin' && password == '123456') {
        res.send({
            msg: '登录成功',
            code: 200
        })
    } else {
        res.send({
            msg: '用户名或密码错误',
            code: 400
        })
    }
})
app.get('/list', (req, res) => {
    const data = db.getHeros()
    res.send({
        msg: '获取成功',
        code: 200,
        data 
    })
})
app.post('/add', upload.single('icon'), function (req, res, next) {
    // req.file is the `avatar` file
    // const icon = req.file.path
    const icon = "../uploads/" + req.file.filename;
    console.log(icon);
    // req.body will hold the text fields, if there were any
    const { name, skill } = req.body
    if (db.addHero({ name, skill, icon })) {
        res.send({
            msg: '新增成功',
            code: 200,
            data: db.getHeros()
        })
    } else {
        res.send({
            msg: '新增失败',
            code: 400,
        })
    }
})
app.get('/delete', (req, res) => {
    if (db.deleteHeroById(req.query.id)) {
        res.send({
            msg: '删除成功',
            code: 200,
            data: db.getHeros()
        })
    } else {
        res.send({
            msg: '删除失败',
            code: 400,
        })
    }
})
app.get('/search', (req, res) => {
    const data = db.getHeroById(req.query.id)
    if (data) {
        res.send({
            msg: '查询成功',
            code: 200,
            data
        })
    } else {
        res.send({
            msg: '参数错误',
            code: 400,
        })
    }
})
app.post('/edit', upload.single('icon'), function (req, res, next) {
    // req.file is the `avatar` file
    // const icon = req.file.path
    const icon = "../uploads/" + req.file.filename;
    console.log(icon);
    // req.body will hold the text fields, if there were any
    const { id, name, skill } = req.body
    if (db.editHero({ id, name, skill, icon })) {
        res.send({
            msg: '修改成功',
            code: 200,
            data: db.getHeroById(req.body.id)
        })
    } else {
        res.send({
            msg: '修改失败',
            code: 400,
        })
    }

})
app.listen(3446, () => {
    console.log('success');
})