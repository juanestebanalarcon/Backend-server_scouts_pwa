const {request,expect,assert} = require("../../config");

describe("ScoutController unit tests", () => {
    describe("ReadScouts", () => {
        it("should return all scouts", async() => {
            let response =  await request.get("/scouts/allScouts");
            expect(response.status).to.equal(200);
            expect(response.body.ok).to.equal(true);
        });  
    });

});