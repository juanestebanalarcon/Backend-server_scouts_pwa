const { Router } = require("express");
const {check} = require("express-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const {createRama,
    readRama,
    readRamas,
    updateRama,
    deleteRama} = require("../Controller/RamaController");
const router = Router();

router.post("/create-rama",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("linkImagen","link es obligatorio").not().isEmpty(),
    check("Scout","Id de Scout es obligatorio").not().isEmpty(),
    validarCampos,
],createRama);
router.put("/:id",updateRama);
router.get("/allRamas",readRamas);
router.get("/:uid",readRama);
router.delete("/:uid",deleteRama);
module.exports=router;