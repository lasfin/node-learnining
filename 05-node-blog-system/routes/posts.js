'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/show/:id', (req, res, next) =>{
    let posts = db.get('posts');
    posts.findById(req.params.id, (err, post) => {
        res.render('showpost', {
            post,
            errors: []
        })
    })
});


router.get('/add', (req, res, next) => {
    let categories = db.get('categories');
    categories.find({}, {}, (err, categories) => {
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
        mainImageName = 'noimage.png';
    }

    // form validation
    req.checkBody('title', 'title field is required').notEmpty();
    req.checkBody('body', 'body field is required').notEmpty();

    // check errors
    let errors = req.validationErrors();

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


router.post('/addcomment', (req, res, next) => {
    // get form values
    let name = req.body.name;
    let email = req.body.email;
    let body = req.body.body;
    let postid = req.body.postid;
    let commentDate = new Date();

    // form validation
    req.checkBody('name', 'name field is required').notEmpty();
    req.checkBody('body', 'body field is required').notEmpty();
    req.checkBody('email', 'e-mail field is required').notEmpty();
    req.checkBody('email', 'e-mail field not formatted correctly').isEmail();

    // check errors
    let errors = req.validationErrors();

    if (errors) {
        let posts = db.get('post');
        posts.findById(postid, ()=>{
            res.render('showpost', {
                errors,
                posts
            })
        });
    } else {
        let comment = {name, email, body, commentDate};
        let posts = db.get('posts');
        // submit to db
        posts.update({
            '_id': postid
        }, {
            $push: {
                'comments': comment
            }
        }, (err, document) => {
            if (err) {
                throw err;
            } else {
                req.flash('success', 'comment added');
                res.location('/posts/show/' + postid);
                res.redirect('/posts/show/' + postid);
            }
        })
    }


});

module.exports = router;
