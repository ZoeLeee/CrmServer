const MongoClient=require('mongodb').MongoClient;

const assert=require('assert');
const config=require('./defaultConfig');
const url=require('url');
// 数据连接数据
const Urls=`mongodb://${config.host}:${config.port}/${config.database}`;

//add一条数据 
const add = function (db, collections, selector, fn) {
    let collection = db.collection(collections);
    collection.insertMany([selector], function (err, result) {
        try {
            assert.equal(err, null)
        } catch (e) {
            console.log(e);
            result = [];
        };

        fn(result);
        db.close();
    });
};

//delete
const deletes = function (db, collections, selector, fn) {
    let collection = db.collection(collections);
    collection.deleteOne(selector, function (err, result) {
        try {
            assert.equal(err, null);
            assert.notStrictEqual(0, result.result.n);
        } catch (e) {
            console.log(e);
            result.result = "";
        };

        fn(result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
        db.close;
    });
};

//find
const find = function (db, collections, selector, fn) {
    //collections="hashtable";
    let collection = db.collection(collections);

    collection.find(selector).toArray(function (err, result) {
        //console.log(docs);
        try {
            assert.equal(err, null);
        } catch (e) {
            console.log(e);
            result = [];
        }

        fn(result);
        db.close();
    });

}

//update
const updates = function (db, collections, selector, fn) {
    let collection = db.collection(collections);

    collection.updateOne(selector[0], selector[1], function (err, result) {
        try {
            assert.equal(err, null);
            assert.notStrictEqual(0, result.result.n);
        } catch (e) {
            console.log(e);
            result.result = "";
        };

        fn(result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
        db.close();
    });

}

const methodType = {
    // 项目所需
    login: find,
    //   type ---> 不放在服务器上面
    //  放入到服务器
    //  请求---> 根据传入进来的请求 数据库操作
    //  req.query    req.body
    show: find, //后台部分
    add: add,
    update: updates,
    delete: deletes,
    updatePwd: updates,
    //portal部分
    showCourse: find,
    register: add
};
//主逻辑    服务器  ， 请求    --》 
// req.route.path ==》 防止前端的请求 直接操作你的数据库
module.exports = function (req, res, collections, selector, fn) {
    MongoClient.connect(Urls, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        // 根据 请求的地址来确定是什么操作  （为了安全，避免前端直接通过请求url操作数据库）
        methodType[req.route.path.substr(1)](db, collections, selector, fn);

        db.close();
    });
};