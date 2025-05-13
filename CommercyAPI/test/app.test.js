const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/users');
const ComercioModel = require('../models/comercio');
const WebModel = require('../models/web');
const { any } = require('../utils/handleStorage');

let token = ''; 
let userId = ''; 
let comercioToken = ''; 
let comercioId = ''; 
let comercioCif = ''; 
let webId = ''; 
let webCif = ''; 

describe('Auth', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({
                name: 'Menganito',
                age: 30,
                email: 'miemail1409@google.com',
                password: '123456789',
                ciudad: 'Buenos Aires',
                intereses: ['Deportes', 'Tecnología'],
                ofertas: true,
                role: ['admin']
            })
            .set('Accept', 'application/json')
            .expect(200);
    
        expect(res.body.password).toBeUndefined();
        expect(res.body).toMatchObject({
            name: 'Menganito',
            age: 30,
            email: 'miemail1409@google.com',
            ciudad: 'Buenos Aires',
            intereses: ['Deportes', 'Tecnología'],
            ofertas: true,
        });
        userId = res.body._id; 
    }, 10000);

    it('should log in a user', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: "miemail1409@google.com",
                password: "123456789"
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toMatchObject({
            _id: expect.any(String),
            name: 'Menganito',
            age: 30,
            email: 'miemail1409@google.com',
            ciudad: 'Buenos Aires',
            intereses: ['Deportes', 'Tecnología'],
            ofertas: true,
            role: ['admin'],
            deleted: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
        token = res.body.token;
    });

    it('should update a user', async () => {
        const res = await request(app)
            .put(`/api/user/updateUser/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John Updated',
                ciudad: 'Cordoba'
            })
            .set('Accept', 'application/json')
            .expect(200);

        expect(res.body).toMatchObject({
            _id: expect.any(String),
            name: 'John Updated',
            age: 30,
            email: 'miemail1409@google.com',
            ciudad: 'Cordoba',
            intereses: ["Deportes", "Tecnología"],
            ofertas: true,
            role: ['admin'],
            deleted: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it ('should get all comerces in a city by activity', async () => {
        let ciudad = 'Madrid'
        let intereses = 'Motos'
        let scoringOrder = true
        const res = await request(app)
            .get(`/api/user/comerciosFilter/${ciudad}/${intereses}?ordenarScoring=${scoringOrder}`)
            .set('Accept', 'application/json')
            .expect(200);
        
        expect(res.body).toEqual(expect.any(Array));
    });
});

describe('Comercios', () => {

    it('should get all comercios', async () => {
        const res = await request(app)
            .get('/api/comercios')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .expect(200);
        
        expect(res.body).toEqual(expect.any(Array));
    });

    it('should create a comerce', async () => {
        const res = await request(app)
            .post('/api/comercios')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Comercio Test',
                cif: 'CIF12345',
                direccion: 'Calle Falsa 123',
                email: 'comercio@test.com',
                telefono: '123456789',
                id: 10
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.comercio).toMatchObject({
            _id: expect.any(String),
            nombre: 'Comercio Test',
            cif: 'cif12345',
            direccion: 'Calle Falsa 123',
            email: 'comercio@test.com',
            telefono: '123456789',
            id: 10,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
        comercioId = res.body.comercio._id;
        comercioCif = res.body.comercio.cif;
        comercioToken = res.body.token;
    });

    it('should get a comercio by cif', async () => {
        const res = await request(app)
            .get(`/api/comercios/${comercioCif}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .expect(200);
        
        expect(res.body).toMatchObject({
            _id: expect.any(String),
            nombre: 'Comercio Test',
            cif: "cif12345",
            direccion: 'Calle Falsa 123',
            email: 'comercio@test.com',
            telefono: '123456789',
            id: 10,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it('should update a comerce', async () => {
        const res = await request(app)
            .put(`/api/comercios/${comercioId}/${comercioCif}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Comercio Updated'
            })
            .set('Accept', 'application/json')
            .expect(200);

        expect(res.body).toMatchObject({
            _id: expect.any(String),
            nombre: 'Comercio Updated',
            cif: 'cif12345',
            direccion: 'Calle Falsa 123',
            email: 'comercio@test.com',
            telefono: '123456789',
            id: 10,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe('Web', () => {

    it('should get all webs', async () => {
        const res = await request(app)
            .get('/api/web')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(res.body).toEqual(expect.any(Array));
    });

    it('should create a web', async () => {
        const res = await request(app)
            .post('/api/web')
            .set('Authorization', `Bearer ${comercioToken}`)
            .send({
                ciudad: 'Cordoba',
                actividad: 'eCommerce',
                titulo: 'Web Comercio Test',
                resumen: 'Resumen de prueba',
                textos: ['Texto 1', 'Texto 2'],
                imagenes: ['img1.jpg', 'img2.jpg'],
                cifComercio: 'CIF12345',
                reseñas: [
                    {
                        scoring: 5,
                        puntuacion: 5,
                        texto: 'Muy bueno'
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(res.body).toMatchObject({
            ciudad: 'cordoba',
            actividad: 'ecommerce',
            titulo: 'web comercio test',
            resumen: 'resumen de prueba',
            textos: [ 'Texto 1', 'Texto 2' ],
            imagenes: [ 'img1.jpg', 'img2.jpg' ],
            cifComercio: 'cif12345',
            reseñas: expect.any(Object),
            _id: expect.any(String),
            deleted: expect.any(Boolean),
        });
        webId = res.body._id;
        webCif = res.body.cifComercio;
    });

    it('should get a web by id', async () => {
        const res = await request(app)
            .get(`/api/web/${webId}`)
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(res.body).toMatchObject({
            _id: expect.any(String),
            ciudad:"cordoba",
            actividad:"ecommerce",
            titulo:"web comercio test",
            resumen:"resumen de prueba",
            textos:['Texto 1', 'Texto 2'],
            imagenes:[ 'img1.jpg', 'img2.jpg' ],
            cifComercio:expect.any(String),
            reseñas: expect.any(Object),
            "deleted":false
        });
    });

    it('should update a web', async () => {
        const res = await request(app)
            .put(`/api/web/${webCif}`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .send({
                titulo: 'Web Updated'
            })
            .set('Accept', 'application/json')
            .expect(200);

        expect(res.body).toMatchObject({
            ciudad: 'cordoba',
            actividad: 'ecommerce',
            titulo: 'Web Updated',
            resumen: 'resumen de prueba',
            textos: [ 'Texto 1', 'Texto 2' ],
            imagenes: [ 'img1.jpg', 'img2.jpg' ],
            cifComercio: 'cif12345',
            reseñas: expect.any(Object),
            _id: expect.any(String),
            deleted: expect.any(Boolean),
        });
    });

    it('should get users based on interested web', async () => {
        const res = await request(app)
            .get(`/api/web/userInterested/${webCif}`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .set('Accept', 'application/json')
            .expect(200);
        
        expect(res.body).toEqual(expect.any(Array));
    });

    it('should post a review by a register user', async () => {
        const res = await request(app)
            .post(`/api/user/writeReview/${webId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                scoring: 2,
                puntuacion: 2,
                texto: 'Mejorable, pero el servicio muy bueno'
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(res.body.reseñas).toEqual(expect.any(Array));
    });

    it('should upload image / texts to a web', async () => {
        const res = await request(app)
            .patch(`/api/web/${webCif}/upload-image`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .field('texts', 'Texto de prueba, Motos, Tecnología')
            .expect(200);
        expect(res.body).toEqual(expect.any(Object));
    });
});

describe('Deletes', () => {
    let webRestoreId = '';
    it('should soft delete a web', async () => {
        const res = await request(app)
            .delete(`/api/web/${webCif}?soft=True`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .expect(200);
        expect(res.body).toEqual(expect.any(String));
    });

    it('Should restore a web', async () => {
        const res = await request(app)
            .put(`/api/web/restore/${webCif}`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .expect(200);
        expect(res.body).toEqual(expect.any(Object));
        webRestoreId = res.body.data._id;
    });

    it('should hard delete a web', async () => {
        const res = await request(app)
            .delete(`/api/web/${webCif}?soft=False`)
            .set('Authorization', `Bearer ${comercioToken}`)
            .expect(200);
        expect(res.body).toEqual(expect.any(String));
    });

    it('should delete a comerce', async () => {
        const res = await request(app)
            .delete(`/api/comercios/${comercioCif}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body).toEqual(expect.any(String));
    });
    
    it('should delete a user', async () => {
        const res = await request(app)
            .delete(`/api/user/deleteUser/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body).toEqual(expect.any(String));
    });
});