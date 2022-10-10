const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createSuperAdministrador,
    readSuperAdministradors,
    readSuperAdministrador,
    updateSuperAdministrador,
    deleteSuperAdministrador,
    loginSuperAdministrador,
    revalidateToken,
    changePassword} = require("../Controller/SuperAdminController");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post("/create-superAdmin",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    validarCampos,
],createSuperAdministrador);

router.post('/log-in-superAdmin',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginSuperAdministrador);

router.put("/:id",updateSuperAdministrador);

router.get("/allSuperAdmins",readSuperAdministradors);

router.get("/:id",readSuperAdministrador);

router.delete("/:id",deleteSuperAdministrador);

router.get("/",validarJWT,revalidateToken);

router.post("/changePassword",[check("email","Email es obligatorio").isEmail(),validarCampos],changePassword);
module.exports=router;