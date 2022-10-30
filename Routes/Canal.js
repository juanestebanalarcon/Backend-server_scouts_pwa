const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createCanal,
    readCanal,
    readCanals,
    updateCanal,
    deleteCanal,
    deletePostFromCanal} = require("../Controller/CanalController");
const router = Router();

router.post("/create-canal",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("ramaAsignada","Nombre es obligatorio").not().isEmpty(),
    check("linkImagen","link es obligatorio").not().isEmpty(),
    check("publicacion","Id de Publicacion es obligatorio").not().isEmpty(),
    validarCampos,
],createCanal);
router.put("/:id",updateCanal);
router.get("/allCanals",readCanals);
router.get("/:id",readCanal);
router.delete("/:id",deleteCanal);
router.delete("/deletePost/:id/:publicacion",deletePostFromCanal);
module.exports=router;