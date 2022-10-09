const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createEvento,
    readEvento,
    readEventos,
    updateEvento,
    deleteEvento,
    getScoutsAsignadosEvento,
    addScoutToEvent,
    addScoutsToEvent} = require("../Controller/EventoController");
const router = Router();

router.post("/create-evento",[
    check("titulo","Nombre es obligatorio").not().isEmpty(),
    check("descripcion","Nombre es obligatorio").not().isEmpty(),
    check("autor","Nombre es obligatorio").not().isEmpty(),
    check("fechaYHoraInicio","fecha y hora inicio es obligatorio").not().isEmpty(),
    check("fechaYHoraFinal","fecha y hora inicio es obligatorio").not().isEmpty(),
    validarCampos,
],createEvento);
router.put("/:id",updateEvento);
router.put("/addScout/:id",addScoutToEvent);
router.put("/addScouts/:id",addScoutsToEvent);
router.get("/allEvents",readEventos);
router.get("/:id",readEvento);
router.get("/getScoutsAsignadosEvento/:id",getScoutsAsignadosEvento);
router.delete("/:id",deleteEvento);
module.exports=router;