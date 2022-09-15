const {request,expect,assert} = require("../../config");
const {SCOUT_TEST0,SCOUT_TEST3} = require("../../data/scout_");
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
        expect(response.body.msg).to.equal('El Scout ya existe con ese email.');
        
    });
});
});