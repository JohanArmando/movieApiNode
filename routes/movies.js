"use strict"
var express = require('express')
var router = express.Router()
var _ = require('lodash')
var Movie = {};

/* POST movie. */
router
    .post('/', function(req, res, next) {
        console.log("POST" , req.body);
        if (!req.body){
            res
                .status(403)
                .json({'error': true , 'Message': 'BOdy empty'});
        }

        let movie = req.body;
        movie._id = Date.now();
        Movie[movie._id] =  movie;

        res
            .status(201)
            .json({'movie' : Movie[movie._id]});
    })
    .get('/', function(req, res, next) {
        console.log("MOVIES GET")

        res
            .status(200)
            .json({movies: _.values(Movie)})
    })
    .get('/:id', function(req, res, next) {
        console.log('GET:id', req.params.id)
        if(!req.params.id) {
            res
                .status(403)
                .json({error: true, message: 'Params empty'})
        }

        let movie = Movie[req.params.id];

            res
                .status(200)
                .json({movie: movie})
    })
    .put('/:id', function(req, res, next) {
        console.log('PUT:id', req.params.id)
        if(!req.params.id && !req.body) {
            res
                .status(403)
                .json({error: true, message: 'Params empty'})
        }

        let new_body  =  req.body
        new_body._id = parseInt(req.params.id , 10)
        Movie[new_body._id] = new_body
        new_body = Movie[req.params.id]

        res
            .status(200)
            .json({movie: new_body})
    })
    .delete('/:id', function (req , res , next) {
        console.log('DELETE:id' , req.params.id);
        if(!req.params.id) {
            res
                .status(403)
                .json({error: true, message: 'Params empty'})
        }

        delete Movie[req.params.id];

        res
            .status(400)
            .json({})
    });

module.exports = router;
