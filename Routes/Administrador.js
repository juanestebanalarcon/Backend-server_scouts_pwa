const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createAdmin,readAdmin,readAdmins,updateAdmin,deleteAdmin,loginAdmin,revalidateToken, changePassword} = require("../Controller/AdminController");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post("/create-admin",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    validarCampos,
],createAdmin);
router.post('/log-in-admin',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginAdmin);
router.put("/:id",[
    check("email","Email es obligatorio").isEmail(),
    validarCampos,
],updateAdmin);
router.get("/AllAdmins",readAdmins);
router.get("/:id",readAdmin);
router.delete("/:id",deleteAdmin);
router.post("/changePassword",[
    check("email","Email es obligatorio").isEmail(),
    check('newPassword','La newPassword es obligatoria').isLength({min:8}), 
    validarCampos],changePassword);
router.get("/",validarJWT,revalidateToken);
module.exports=router;