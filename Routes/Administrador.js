const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createAdmin,readAdmin,readAdmins,updateAdmin,deleteAdmin,loginAdmin} = require("../Controller/AdminController");
const router = Router();

router.post("/create-admin",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    check("password","Password es obligatorio").not().isEmpty(),
    check("ramaAsociada","rama asociada es obligatorio").not().isEmpty(),
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
router.get("/:uid",readAdmin);
router.delete("/:uid",deleteAdmin);
module.exports=router;