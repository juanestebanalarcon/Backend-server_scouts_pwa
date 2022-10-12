const { Router, response } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {createAcudiente,readAcudientes,readAcudiente,deleteAcudiente,
    loginAcudiente,revalidateToken,updateAcudiente,changePassword, getScoutsAcudiente, getScoutBranch} = require("../Controller/AcudienteController");
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
router.put("/:id",updateAcudiente);
router.get("/allAcudientes",readAcudientes);
router.post("/changePassword",[check("email","Email es obligatorio").isEmail(),validarCampos],changePassword);
router.get("/:id",readAcudiente);
router.get("/getScouts/:id",getScoutsAcudiente);
router.get("/getScoutsBranch/:id",getScoutBranch);
router.delete("/:id",deleteAcudiente);
router.get("/",validarJWT,revalidateToken);
module.exports=router;
