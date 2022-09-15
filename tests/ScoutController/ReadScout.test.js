const {request,expect,assert} = require("../../config");

describe("ScoutController unit tests", () => {
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

});