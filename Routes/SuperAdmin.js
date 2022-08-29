const { Router } = require("express");
const {check} = require("express-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const {createSuperAdministrador,
    readSuperAdministradors,
    readSuperAdministrador,
    updateSuperAdministrador,
    deleteSuperAdministrador,
    loginSuperAdministrador,
    revalidateToken} = require("../Controller/SuperAdminController");
const router = Router();

router.post("/create-superAdmin",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    check("password","Password es obligatorio").not().isEmpty(),
    validarCampos,
],createSuperAdministrador);
router.post('/log-in-superAdmin',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginSuperAdministrador);
router.put("/:id",[
    check("email","Email es obligatorio").isEmail(),
    validarCampos,
],updateSuperAdministrador);
router.get("/allSuperAdmins",readSuperAdministradors);
router.get("/:uid",readSuperAdministrador);
router.delete("/:uid",deleteSuperAdministrador);
module.exports=router;