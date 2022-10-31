const { Router, response } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createScout,readScouts,readScout,updateScout,deleteScout,
    loginScout,revalidateToken, readActiveScouts, changePassword, changeScoutState, readScoutBranch, readScoutsWithoutAcudiente} = require("../Controller/ScoutController");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post('/log-in-scout',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La es contraseña es obligatoria').isLength({min:8}),
    validarCampos
],loginScout);
router.post("/create-scout",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("apellido","Nombre es obligatorio").not().isEmpty(),
    check("email","Email es obligatorio").isEmail(),
    check("fecha_nacimiento","fecha nacimiento es obligatorio").not().isEmpty(),
    check("celular","celular es obligatorio").not().isEmpty(),
    validarCampos,
],createScout);
router.put("/:id",updateScout);
router.get("/allScouts",readScouts);
router.get("/activeScouts",readActiveScouts);
router.get("/aloneScouts",readScoutsWithoutAcudiente);
router.get("/scoutBranch/:id",readScoutBranch);
router.post("/changeState/:id",changeScoutState);
router.get("/:id",readScout);
router.post("/changePassword",[
    check("email","Email es obligatorio").isEmail(),validarCampos],changePassword);
router.delete("/:id",deleteScout);
router.get("/",validarJWT,revalidateToken);
module.exports=router;
