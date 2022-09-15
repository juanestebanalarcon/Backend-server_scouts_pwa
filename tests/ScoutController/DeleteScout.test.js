const {request,expect,assert} = require("../../config");

describe("ScoutController unit tests", () => {
    describe("deleteScout", () => {
        it("shouldn't delete the scout", async() => {
            let response = await request.delete("/scouts/732389291271bd159604e6d8");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:"No existe scout por ese uid."});
    });
        it("should delete the scout", async() => {
            let response = await request.delete("/scouts/63210a4e3c2be79f4a06fe6a");
            expect(response.status).to.equal(200);
            expect(response.body).to.equal({ok:true,msg:"Scout eliminado."});
    });

});
});
