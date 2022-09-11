const { Router, response } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createScout,readScouts,readScout,updateScout,deleteScout,
    loginScout,revalidateToken, readActiveScouts} = require("../Controller/ScoutController");
const router = Router();

router.post("/create-scout",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("apellido","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    check("password","Password es obligatorio").not().isEmpty(),
    check("fecha_nacimiento","fecha nacimiento es obligatorio").not().isEmpty(),
    check("celular","celular es obligatorio").not().isEmpty(),
    check("ramaAsociada","rama asociada es obligatorio").not().isEmpty(),
    validarCampos,
],createScout);
router.post('/log-in-scout',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginScout);
router.put("/:id",[
    check("email","Email es obligatorio").isEmail(),
    validarCampos,
],updateScout);
router.get("/allScouts",readScouts);
router.get("/activeScouts",readActiveScouts);
router.get("/:uid",readScout);
router.delete("/:id",deleteScout);
module.exports=router;
