const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter = express.Router();

const Favorite = require('../models/favorite');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {

    Favorite.find()
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    //console.log(req.body)
    //res.json(req.body.some(code => JSON.stringify(code) === JSON.stringify({ _id: '5e56efb8bc57155cbb46003' })))
    //res.json(req.body.findIndex(item => item._id === Favorite.findOne({campsites: item._id})))
    
    if (req.body.findIndex(item => item._id != Favorite.findOne({campsites: item._id}))){
        req.body.campsites.push(item)
    }
        req.body.user = req.user._id;
        //console.log(req.body);
        Favorite.create(req.body)
        .then(favorite => {
            console.log('Favorite Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));  
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites'); 
})

.delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err)); 
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /Favorites'); 
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite) {
            res.statusCode = 304;
            res.setHeader('Content-Type', 'application/json');
            res.json("That campsite is already in the list of favorites!");
        } else {
            req.body.user = req.user._id;
            campsite.push(req.body);
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites'); 
})

.delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;