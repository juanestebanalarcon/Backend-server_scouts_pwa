describe("ScoutController unit tests", () => {
    describe("deleteScout", () => {
        it("should delete a scout", async() => {
            let response =  await request.delete("/scouts/632124b4b3500c3aff1f2b67");
            expect(response.status).to.equal(200);
            expect(response.body.ok).to.equal(true);
        });
        it("shouldn't delete the scout", async() => {
            let response = await request.put("/scouts/63211e35b3500c3af51f2d43");
            expect(response.status).to.equal(404);
            expect(response.body).to.equal({ok:false,msg:"No existe scout por ese uid."});
    });
});
});