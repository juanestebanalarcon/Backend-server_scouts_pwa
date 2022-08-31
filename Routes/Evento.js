const { Router } = require("express");
const {check} = require("express-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const {createEvento,
    readEvento,
    readEventos,
    updateEvento,
    deleteEvento} = require("../Controller/EventoController");
const router = Router();

router.post("/create-evento",[
    check("titulo","Nombre es obligatorio").not().isEmpty(),
    check("descripcion","Nombre es obligatorio").not().isEmpty(),
    check("autor","Nombre es obligatorio").not().isEmpty(),
    check("fechaYHoraInicio","fecha y hora inicio es obligatorio").not().isEmpty(),
    check("fechaYHoraFinal","fecha y hora inicio es obligatorio").not().isEmpty(),
    check("linkImagen","link es obligatorio").not().isEmpty(),
    check("inscritos","Id de Scout es obligatorio").not().isEmpty(),
    validarCampos,
],createRama);
router.put("/:id",updateEvento);
router.get("/allEvents",readEventos);
router.get("/:uid",readEvento);
router.delete("/:uid",deleteEvento);
module.exports=router;