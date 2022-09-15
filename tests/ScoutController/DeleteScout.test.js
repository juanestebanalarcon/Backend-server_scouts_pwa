const {request,expect,assert} = require("../../config");

describe("ScoutController unit tests", () => {
    describe("deleteScout", () => {
        it("shouldn't delete the scout", async() => {
            let response = await request.delete("/scouts/732389291271bd159604e6d8");
            expect(response.status).to.equal(404);
            //console.log(response.body);
            //expect(response.body).to.equal({ok:false,msg:"No existe scout por ese uid."});
    });

});