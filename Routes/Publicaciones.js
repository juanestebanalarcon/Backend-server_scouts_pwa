const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createPublicacion,
    readPublicacion,
    readPublicaciones,
    updatePublicacion,
    deletePublicacion,
    readPublicacionesByBranch} = require("../Controller/PublicacionesController");
const router = Router();

router.post("/create-publicacion",[
    check("titulo","Nombre es obligatorio").not().isEmpty(),
    check("descripcion","Nombre es obligatorio").not().isEmpty(),
    check("autor","Nombre es obligatorio").not().isEmpty(),
    check("fecha","fecha es obligatorio").not().isEmpty(),
    validarCampos,
],createPublicacion);
router.put("/:id",updatePublicacion);
router.get("/allPublicaciones",readPublicaciones);
router.get("/byBranch/:idRama",readPublicacionesByBranch);
router.get("/:id",readPublicacion);
router.delete("/:id",deletePublicacion);
module.exports=router;