const {request,expect,assert} = require("../../config");
const {SCOUT_VOID,SCOUT_TEST0,SCOUT_TEST1,SCOUT_TEST4} = require("../../data/scout_");
describe("ScoutController unit tests", () => {
    describe("CreateScout", () => {
        it("should create a new scout", async() => {
         let response =  await request.post("/scouts/create-scout").send(SCOUT_TEST0);
         expect(response.status).to.equal(201);
         expect(response.body.ok).to.equal(true);
         
        });
        it("shouldn't create a duplicate scout", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST0);
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal('El Scout ya existe con ese email.');
        
    });
    it("shouldn't create a scout branchless", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST1);
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal('El Scout ya existe con ese email.');
        
    });
    it("shouldn't create a scout whiout email", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST4);
        expect(response.status).to.equal(400);
    
    });
    it("shouldn't create a scout whitout data", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_VOID);
        expect(response.status).to.equal(400);
    });
});
});