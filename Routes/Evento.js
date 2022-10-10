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
    addScoutsToEvent,
    readEventosByBranch,
    readlastTowEventosByBranch,
    readEventosOfWeek} = require("../Controller/EventoController");
const router = Router();

router.post("/create-evento",[
    check("titulo","Nombre es obligatorio").not().isEmpty(),
    check("descripcion","Nombre es obligatorio").not().isEmpty(),
    check("autor","Nombre es obligatorio").not().isEmpty(),
    check("fechaYHoraInicio","fecha y hora inicio es obligatorio").not().isEmpty(),
    check("fechaYHoraFinal","fecha y hora inicio es obligatorio").not().isEmpty(),
    validarCampos,
],createEvento);
router.put("/updateEvento/:id",updateEvento);
router.put("/addScout/:id",addScoutToEvent);
router.get("/readEvento/:id",readEvento);
router.get("/allEvents",readEventos);
router.put("/addScouts/:id",addScoutsToEvent);
router.get("/getEventByBranch",readEventosByBranch);
router.get("/getEventsOfWeek",readEventosOfWeek);
router.get("/getlastTwoEventByBranch",readlastTowEventosByBranch);
router.get("/getScoutsAsignadosEvento/:id",getScoutsAsignadosEvento);
router.delete("/deleteEvento/:id",deleteEvento);
module.exports=router;