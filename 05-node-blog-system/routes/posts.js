'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');


router.get('/add', (req, res, next) => {
    let categories = db.get('categories');
    categories.find({}, {}, function(err, categories) {
        res.render('addpost', {
            title: 'Add post',
            categories
        });
    });
});

router.post('/add', (req, res, next) => {
   // get form values
    let title = req.body.title;
    let category = req.body.category;
    let body = req.body.body;
    let author = req.body.author;
    let date = new Date();
    let mainImageName;

    if (req.files.mainimage) {
        mainImageName = req.files.mainimage.name;
        let mainImageOriginalName = req.files.mainimage.originalname;
        let mainImageMine = req.files.mainimage.mimetype;
        let mainImagePath = req.files.mainimage.path;
        let mainImageExt = req.files.mainimage.extension;
        let mainImageSize = req.files.mainimage.size;
    } else {
        mainImageName = 'noimage.jpg';
    }

    // form validation
    req.checkBody('title', 'title field is required').notEmpty();
    req.checkBody('body', 'body field is required').notEmpty();

    // check errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            errors,
            title,
            body
        })
    } else {
        let posts = db.get('posts');
        // submit to db
        posts.insert({
            title,
            body,
            category,
            date,
            author,
            mainimage: mainImageName
        }, (err, post) => {
            if (err) {
                res.send('There was an issue submitting the post')
            } else {
                req.flash('success', 'Post submitted');
                res.location('/');
                res.redirect('/');
            }
        })
    }


});

module.exports = router;
