"use strict"
let request = require('supertest-as-promised');
const api = require('../app');
const host = api;
const _ = require('lodash')

request = request(host);

describe('Rutas de las peliculas' , () => {
    describe('Post Create' , () => {
        it('Deberia crear una pelicula' , (done) => {
            let movie = {
                'title': 'Back to the future',
                'year': '1985'
            };

            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type',  /application\/json/)
            .end((err , res) => {
                let body = res.body;
                expect(body).to.have.property('movie');
                movie = body.movie;
                expect(movie).to.have.property('title' , 'Back to the future');
                expect(movie).to.have.property('year' , '1985');
                expect(movie).to.have.property('_id');
                done(err);
            });
        });
    });

    /**
     * Get all movies
     */

    describe('GET /', function() {
        it('deberia obtener todas las peliculas', function(done) {
            let movie_id
            let movie2_id

            let movie = {
                'title': 'back to the future',
                'year': '1985'
            }

            let movie2 = {
                'title': 'back to the future 2',
                'year': '1989'
            }
            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    movie_id = res.body.movie._id

                    return request
                        .post('/movie')
                        .set('Accept', 'application/json')
                        .send(movie2)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
                })
                .then((res) => {
                    movie2_id = res.body.movie._id

                    return request
                        .get('/movie')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                })
                .then((res) => {
                    let body = res.body

                    expect(body).to.have.property('movies')
                    expect(body.movies).to.be.an('array')
                        .and.to.have.length.above(2)

                    let movies = body.movies
                    movie = _.find(movies, {_id: movie_id})
                    movie2 = _.find(movies, {_id: movie2_id})

                    expect(movie).to.have.property('_id', movie_id)
                    expect(movie).to.have.property('title', 'back to the future')
                    expect(movie).to.have.property('year', '1985')

                    expect(movie2).to.have.property('_id', movie2_id)
                    expect(movie2).to.have.property('title', 'back to the future 2')
                    expect(movie2).to.have.property('year', '1989')

                    done()
                }, done)
        })
    });

    /**
     * SHOW movie
     */
    describe('peticion GET /:id', function() {
        it('deberia una sola pelicula', function(done) {
            let movie_id;
            let movie = {
                'title': 'her',
                'year': '2013'
            };
            request
                .post('/movie')
                .set('Accept', 'application/json')
                .send(movie)
                .expect(201)
                .expect('Content-Type', /application\/json/)
                .then((res) => {
                    movie_id = res.body.movie._id;
                    return request
                        .get('/movie/' + movie_id)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
                })
                .then((res) => {
                    let body = res.body

                    expect(body).to.have.property('movie')
                    movie = body.movie

                    expect(movie).to.have.property('_id', movie_id)
                    expect(movie).to.have.property('title', 'her')
                    expect(movie).to.have.property('year', '2013')
                    done()
            }, done)
        })
    });

    /**
     * UPDATE
     */

    describe('peticion PUT /:id', function() {
        it('deberia actualizar una pelicula', function(done) {
            let movie_id
            let movie = {
                'title': 'pulp fiction',
                'year': '1993'
            }

            request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            .then((res) => {
                movie_id = res.body.movie._id
                let movie = {
                    'title': 'new fiction',
                    'year': '1993'
                }
                return request
                    .put('/movie/' + movie_id)
                    .set('Accept', 'application/json')
                    .send(movie)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body

                expect(body).to.have.property('movie')
                movie = body.movie

                expect(movie).to.have.property('_id', movie_id)
                expect(movie).to.have.property('title', 'new fiction')
                expect(movie).to.have.property('year', '1993')
                done()
            }, done)
        });
    });

    /**
     * DELETE
     */

    describe('DELETE:id peliculas' , () =>{
       it('Deberia eliminar pelicula' , (done) => {
           let movie_id
           let movie = {
               'title': 'pulp fiction',
               'year': '1993'
           }

           request
               .post('/movie')
               .set('Accept', 'application/json')
               .send(movie)
               .expect(201)
               .expect('Content-Type', /application\/json/)
               .then((res) => {
                   movie_id = res.body.movie._id
                   let movie = {
                       'title': 'new fiction',
                       'year': '1993'
                   }
                   return request
                       .delete('/movie/' + movie_id)
                       .set('Accept', 'application/json')
                       .expect(400)
                       .expect('Content-Type', /application\/json/)
               })
               .then((res) => {
                   let body = res.body

                   expect(body).to.be.empty
                   done()
               }, done)
       });
    });
});