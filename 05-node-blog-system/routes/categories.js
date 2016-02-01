'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/show/:category', (req, res, next) => {
    let db = req.db;
    let posts = db.get('posts');
    posts.find({
        category: req.params.category
    }, {}, function(err, posts) {
        res.render('index', {
            'title': req.params.category,
            posts
        })
    });
});


router.get('/add', (req, res, next) => {
    res.render('addcategory', {
        title: 'Add category'
    })
});

router.post('/add', (req, res, next) => {
    // get form values
    let title = req.body.title;
    // form validation
    req.checkBody('title', 'title field is required').notEmpty();
    // check errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('addcategory', {
            errors,
            title
        })
    } else {
        let categories = db.get('categories');
        // submit to db
        categories.insert({
            title
        }, (err, category) => {
            if (err) {
                res.send('There was an issue submitting the category')
            } else {
                req.flash('success', 'Category submitted');
                res.location('/');
                res.redirect('/');
            }
        })
    }

});

module.exports = router;
