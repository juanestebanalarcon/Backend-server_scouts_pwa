const {request,expect,assert} = require("../config");
const {SCOUT_TEST0,SCOUT_TEST1,SCOUT_TEST2,SCOUT_TEST3} = require("../data/scout_");

describe("ScoutController unit tests", () => {
    describe("CreateScout", () => {
        it("should create a new scout", async() => {
         let response =  await request.post("/scouts/create-scout").send(SCOUT_TEST0);
         expect(response.status).to.equal(201);
         expect(response.body.ok).to.equal(true);
        });
        it("shouldn't create a duplicate scout", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST3);
        expect(response.status).to.equal(400);
        expect(response.body).to.equal({ok:false,msg:"El Scout ya existe con ese email."});
        assert.equal(response.body.msg, "El Scout ya existe con ese email.");
    });
});
describe("ReadScout", () => {
    it("should return a scout", async() => {
        let response = await request.get("/scouts/63210a4e3c2be79f4a06fe6a");
        expect(response.status).to.equal(200);
        expect(response.body.ok).to.equal(true);
        });
        it("shouldn't return a scout", async() => {
            let response = await request.get("/scouts/63210a4e3c2be79f4a06fe6r");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:"Not found"});
            assert.equal(response.body.msg, "Not found");
        });
    });
    describe("ReadScouts", () => {
        it("should return all scouts", async() => {
            let response =  await request.get("/scouts/allScouts");
            expect(response.status).to.equal(200);
            expect(response.body.ok).to.equal(true);
        });  
    });
    describe("UpdateScout", () => {
        it("should update a scout", async() => {
            let response =  await  request.put("/scouts/63211e35b3500c3aff1f2b66").send(SCOUT_TEST2);
            expect(response.status).to.equal(200);
            expect(response.body.ok).to.equal(true);
            expect(response.body.scoutUpdate).to.equal(SCOUT_TEST2);
        });
        it("shouldn't update the scout", async() => {
            let response = await request.put("/api/scouts/63211e35b3500c3aff1f2d43");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:"No existe scout por ese uid."});
    });
});
    describe("deleteScout", () => {
        it("should delete a scout", async() => {
            let response =  await request.delete("/scouts/632124b4b3500c3aff1f2b67");
            expect(response.status).to.equal(200);
            expect(response.body.ok).to.equal(true);
        });
        it("shouldn't delete the scout", async() => {
            let response = await request.put("/scouts/63211e35b3500c3af51f2d43");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:"No existe scout por ese uid."});
    });
});
describe("LoginScout", () => {
    it("should log in the scout", async() => {
     let response =  await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST3.email,password:SCOUT_TEST3.password});
     expect(response.status).to.equal(201);
     expect(response.body.ok).to.equal(true);
     expect(response.body.email).to.equal(SCOUT_TEST3.email);
    });
    it("shouldn't log in the scout - incorrect password",async() => {
    let response =   await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST3.email, password:SCOUT_TEST1.password});
    expect(response.status).to.equal(400);
    expect(response.body).to.equal({ok:false,msg:"La password no es válida."});
    assert.equal(response.body.msg, "La password no es válida.");
});
it("shouldn't log in the scout - incorrect email",async() => {
    let response =   await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST1.email, password:SCOUT_TEST1.password});
    expect(response.status).to.equal(404);
    expect(response.body).to.equal({ok:false,msg:"El correo no existe."});
    assert.equal(response.body.msg, "El correo no existe.");
});
});
});
