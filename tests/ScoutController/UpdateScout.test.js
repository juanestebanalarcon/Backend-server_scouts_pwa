const {request,expect,assert} = require("../../config");
const SCOUT_TEST2 = require("../../data/scout_");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");
describe("ScoutController unit tests", () => {
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
            expect(response.body).to.equal({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    });
});
});