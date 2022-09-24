const {request,expect,assert} = require("../../config");
const {SCOUT_VOID,SCOUT_TEST0,SCOUT_TEST1,SCOUT_TEST4} = require("../../data/scout_");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");

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
        expect(response.body.msg).to.equal(RESPONSE_MESSAGES.ERR_ALREADY_EXISTS);
        
    });
    it("shouldn't create a scout branchless", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST1);
        expect(response.status).to.equal(404);
        expect(response.body.msg).to.equal(RESPONSE_MESSAGES. ERR_NOT_FOUND);
        
    });
    it("shouldn't create a scout whithout email", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_TEST4);
        expect(response.status).to.equal(400);
    
    });
    it("shouldn't create a scout whithout data", async() => {
        let response =   await request.post("/scouts/create-scout").send(SCOUT_VOID);
        expect(response.status).to.equal(400);
    });
});
});