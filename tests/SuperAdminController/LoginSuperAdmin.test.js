const {request,expect,assert} = require("../../config");
const {SUPER_ADMIN_TEST3,SUPER_ADMIN_TEST4} = require("../../data/superAdmin_");

describe("SuperAdminController unit tests", () => {
describe("LoginSuperAdmin", () => {
    it("should log in the SuperAdmin", async() => {
     let response =  await request.post("/superAdmin/log-in-superAdmin").send({email:SUPER_ADMIN_TEST4.email,password:SUPER_ADMIN_TEST4.password});
     expect(response.status).to.equal(200);
     expect(response.body.ok).to.equal(true);
     expect(response.body.email).to.equal(SUPER_ADMIN_TEST4.email);
    });
    it("shouldn't log in the SuperAdmin - incorrect password",async() => {
        let response =   await request.post("/superAdmin/log-in-superAdmin").send({email:SUPER_ADMIN_TEST4.email,password:SUPER_ADMIN_TEST3.password});
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal('La password no es válida.');
    
    });
    it("shouldn't log in the SuperAdmin - incorrect email",async() => {
        let response =   await request.post("/superAdmin/log-in-superAdmin").send({email:SUPER_ADMIN_TEST3.email, password:SUPER_ADMIN_TEST3.password});
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal('El correo no existe.');
    });
});
});
