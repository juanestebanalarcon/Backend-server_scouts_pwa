require('dotenv').config();
const { expect, assert } = require("chai");
const { dbConnection } = require("./database/config");
const request = require("supertest")("http://localhost:9000/api");
const Server = require('./Model/Server');
const server = new Server();
const app = server.app;
dbConnection();

describe("ScoutController unit tests", () => {
    let scout_ ={
        "nombre": "Prueba1",
        "apellido":"Test1",
        "email": "scout@correo.com",
        "password":"12345678Test",
        "link_ficha_medica":"www.link.com",
        "fecha_nacimiento": "08-06-1988",
        "celular": "323554989",
        "ramaAsociada":"Rama"
    };
    describe("CreateScout", () => {
        it("should create a new scout", (done) => {
            request(app)
            .post("/scouts/create-scout").send(scout_).expect(201).then((res)=>{
                expect(res.body).to.be.equal(scout_);
                done();
            }).catch((err)=>done(err));
        });
        it("shouldn't create a duplicate scout", (done) => {
            request(app)
            .post("/api/scouts/create-scout").send(scout_).expect(400).then((res)=>{
                expect(res.body.msg).to.be.equal("El Scout ya existe con ese email.");
                done();
            }).catch((err)=>done(err));
        });

    });

});
