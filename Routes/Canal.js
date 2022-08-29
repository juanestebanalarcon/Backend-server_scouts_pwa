const { Router } = require("express");
const {check} = require("express-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const {createCanal,
    readCanal,
    readCanals,
    updateCanal,
    deleteCanal} = require("../Controller/CanalController");
const router = Router();

router.post("/create-canal",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("ramaAsignada","Nombre es obligatorio").not().isEmpty(),
    check("linkImagen","link es obligatorio").not().isEmpty(),
    check("publicacion","Id de Publicacion es obligatorio").not().isEmpty(),
    validarCampos,
],createRama);
router.put("/:id",updateCanal);
router.get("/allCanals",readCanals);
router.get("/:uid",readCanal);
router.delete("/:uid",deleteCanal);
module.exports=router;