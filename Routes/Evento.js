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
    readEventosOfWeek,
    readAllEventosByBranch,
    readEventosByBranchAndDate,
    readEventosByDate} = require("../Controller/EventoController");
const router = Router();

router.get("/getEventsOfWeek/:startDate",readEventosOfWeek);
router.get("/:id",readEvento);
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
router.get("/allEvents",readEventos);
router.put("/addScouts/:id",addScoutsToEvent);
router.get("/getEventByBranchAndDate/:idRama/:startDate",readEventosByBranchAndDate);
router.get("/getEventByDate/:startDate",readEventosByDate);
router.get("/getlastTwoEventByBranch/:idRama",readlastTowEventosByBranch);
router.get("/getAllEventByBranch/:idRama",readAllEventosByBranch);
router.get("/getScoutsAsignadosEvento/:id",getScoutsAsignadosEvento);
router.delete("/:id",deleteEvento);
module.exports=router;