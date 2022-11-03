const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createPublicacion,
    readPublicacion,
    readPublicaciones,
    updatePublicacion,
    deletePublicacion,
    readPublicacionesByBranch,
    readlastTwoPublicaciones,
    readlastTwoPublicacionesByBranch,
    readGeneralPublicaciones,
    readGeneralTwoPublicaciones} = require("../Controller/PublicacionesController");
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
router.get("/lastTwoPubli",readlastTwoPublicaciones);
router.get("/allGeneralPosts",readGeneralPublicaciones);
router.get("/allGeneralTwoPosts",readGeneralTwoPublicaciones);
router.get("/lastTwoPubliByBranch/:idRama",readlastTwoPublicacionesByBranch);
router.get("/byBranch/:idRama",readPublicacionesByBranch);
router.get("/:id",readPublicacion);
router.delete("/:id",deletePublicacion);
module.exports=router;