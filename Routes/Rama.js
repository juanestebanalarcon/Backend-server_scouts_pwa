const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createRama,readRama,readRamas,updateRama,deleteRama, getScoutsAsignados, changeScoutBranch} = require("../Controller/RamaController");
const router = Router();

router.post("/create-rama",[
    check("nombre","Nombre es obligatorio").not().isEmpty(),
    check("edadMax", "La edad maxima es obligatoria").not().isEmpty(),
    check("edadMin", "La edad minima es obligatoria").not().isEmpty(),
    validarCampos,
],createRama);
router.put("/:id",updateRama);
router.get("/allRamas",readRamas);
router.get("/:id",readRama);
router.put("/changeScoutBranch/:id",changeScoutBranch);
router.delete("/:id",deleteRama);
router.get("/getScoutsAsignados/:id",getScoutsAsignados);
module.exports=router;