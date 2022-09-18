const {request,expect,assert} = require("../../config");
const {ADMIN_TEST0,ADMIN_TEST1,ADMIN_TEST2,ADMIN_TEST3,ADMIN_TEST4,ADMIN_TEST5} = require("../../data/admin_");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");
describe("AdminController unit tests", () => {
    describe("CreateAdmin", () => {
        it("should create a new admin", async() => {
         let response =  await request.post("/admin/create-admin").send(ADMIN_TEST1);
         expect(response.status).to.equal(201);
         expect(response.body.ok).to.equal(true);
        });
        it("shouldn't create a duplicate admin", async() => {
        let response =   await request.post("/admin/create-admin").send(ADMIN_TEST0);
        expect(response.status).to.equal(400);
        expect(response.body).to.equal({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});
        assert.equal(response.body.msg, RESPONSE_MESSAGES.ERR_ALREADY_EXISTS);
    });
});

});