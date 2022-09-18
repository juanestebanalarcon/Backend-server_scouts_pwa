const {request,expect,assert} = require("../../config");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");

describe("ScoutController unit tests", () => {
    describe("deleteScout", () => {
        it("shouldn't delete the scout", async() => {
            let response = await request.delete("/scouts/732389291271bd159604e6d8");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    });
        it("should delete the scout", async() => {
            let response = await request.delete("/scouts/63210a4e3c2be79f4a06fe6a");
            expect(response.status).to.equal(200);
            expect(response.body).to.equal({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    });

});
});
