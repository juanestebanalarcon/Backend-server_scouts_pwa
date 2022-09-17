const { Router, response } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {createAcudiente,readAcudientes,readAcudiente,deleteAcudiente,
    loginAcudiente,revalidateToken, changePassword} = require("../Controller/AcudienteController");
const router = Router();

router.post("/create-acudiente",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("apellido","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    check("fecha_nacimiento","fecha nacimiento es obligatorio").not().isEmpty(),
    check("celular","celular es obligatorio").not().isEmpty(),
    validarCampos,
],createAcudiente);
router.post('/log-in-acudiente',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginAcudiente);
router.get("/:id",readAcudiente);
router.get("/allAcudientes",readAcudientes);
router.post("/changePassword",[
    check("email","Email es obligatorio").isEmail(),
    check('newPassword','La newPassword es obligatoria').isLength({min:8}), 
    validarCampos],changePassword);
router.delete("/:id",deleteAcudiente);
router.get("/",validarJWT,revalidateToken);
module.exports=router;