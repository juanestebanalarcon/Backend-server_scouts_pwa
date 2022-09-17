const {request,expect,assert} = require("../../config");
const {SCOUT_TEST1,SCOUT_TEST3} = require("../../data/scout_");

describe("ScoutController unit tests", () => {
describe("LoginScout", () => {
    it("should log in the scout", async() => {
     let response =  await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST3.email,password:SCOUT_TEST3.password}).timeout(2000);
     expect(response.status).to.equal(200);
     expect(response.body.ok).to.equal(true);
     expect(response.body.email).to.equal(SCOUT_TEST3.email);
    });
    it("shouldn't log in the scout - incorrect password",async() => {
    let response =   await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST3.email, password:"admin1password"}).timeout(2000);
    expect(response.status).to.equal(400);
    expect(response.body.msg).to.equal('La password no es válida.');
 });
    it("shouldn't log in the scout - incorrect email",async() => {
        let response =   await request.post("/scouts/log-in-scout").send({email:SCOUT_TEST1.email, password:SCOUT_TEST1.password}).timeout(2000);
        expect(response.status).to.equal(404);
        expect(response.body.msg).to.equal('El correo no existe.');

});
});
});
