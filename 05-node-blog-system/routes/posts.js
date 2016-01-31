var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/add', function(req, res, next) {
    res.render('addpost', {
       'title': 'Add post'
    });
});

router.post('add', function(req, res, next){
   // get form values
    var title = req.form.title;
    var category = req.form.category;
    var body = req.form.body;
    var author = req.form.author;
    var date = new Date();

    if (req.files.mainimage) {
        var mainImageOriginalName = req.files.mainimage.originalname;
        var mainImageName = req.files.mainimage.name;
        var mainImageMine = req.files.mainimage.mimetype;
        var mainImagePath = req.files.mainimage.path;
        var mainImageExt = req.files.mainimage.extension;
        var mainImageSize = req.files.mainimage.size;
    } else {
        var mainImageName = 'noimage.jpg';
    }

    // form validation



});

module.exports = router;
