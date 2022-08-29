const { Router } = require("express");
const {check} = require("express-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const {createPublicacion,
    readPublicacion,
    readPublicaciones,
    updatePublicacion,
    deletePublicacion} = require("../Controller/PublicacionesController");
const router = Router();

router.post("/create-publicacion",[
    check("titulo","Nombre es obligatorio").not().isEmpty(),
    check("descripcion","Nombre es obligatorio").not().isEmpty(),
    check("autor","Nombre es obligatorio").not().isEmpty(),
    check("fecha","fecha es obligatorio").not().isEmpty(),
    check("linkImagen","link es obligatorio").not().isEmpty(),
    check("inscritos","Id de Scout es obligatorio").not().isEmpty(),
    validarCampos,
],createPublicacion);
router.put("/:id",updatePublicacion);
router.get("/allPublicaciones",readPublicaciones);
router.get("/:uid",readPublicacion);
router.delete("/:uid",deletePublicacion);
module.exports=router;