const {request,expect,assert} = require("../../config");
const {RAMA_TEST0,RAMA_TEST1,RAMA_TEST2} = require("../../data/rama_");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");

describe("RamaController unit tests", () => {
    describe("CreateRama", () => {
        it("should create a new branch", async() => {
        
         let response =  await request.post("/rama/create-rama").send(RAMA_TEST0);
         expect(response.status).to.equal(201);
         expect(response.body.ok).to.equal(true);     
        });
        it("shouldn't create a duplicate branch", async() => {
            let response =   await request.post("/rama/create-rama").send(RAMA_TEST0);
            expect(response.status).to.equal(400);
            expect(response.body.msg).to.equal(RESPONSE_MESSAGES.ERR_ALREADY_EXISTS);
            
        });
        it("shouldn't create a branch whitout data", async() => {
            let response =   await request.post("/rama/create-rama").send(RAMA_TEST1);
            expect(response.status).to.equal(400);
            
        });
        // it("shouldn't create a branch whitout data", async() => {
        //     let response =   await request.post("/rama/create-rama").send(RAMA_TEST2);
        //     expect(response.status).to.equal(400);
            
        // });
});
});
