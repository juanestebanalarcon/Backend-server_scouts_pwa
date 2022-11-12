const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {createEvento,readEvento,readEventos,updateEvento,deleteEvento,getScoutsAsignadosEvento,addScoutToEvent,addScoutsToEvent,readlastTowEventosByBranch,readEventosOfWeek,readAllEventosByBranch,readEventosByBranchAndDate,readEventosByDate,readGeneralEventos,getTotalInscritosEvento,isScoutPresent,readTwoGeneralEventos,readAllEventosByBranchDate,readGeneralEventosDate} = require("../Controller/EventoController");
const router = Router();

router.get("/getEventsOfWeek/:startDate",readEventosOfWeek);
router.post("/create-evento",[
    check("titulo","Título es obligatorio").not().isEmpty(),
    check("descripcion","Descripción es obligatorio").not().isEmpty(),
    check("autor","Autor es obligatorio").not().isEmpty(),
    check("fechaYHoraInicio","fecha y hora inicio es obligatorio").not().isEmpty(),
    check("fechaYHoraFinal","fecha y hora final es obligatorio").not().isEmpty(),
    validarCampos,
],createEvento);
router.put("/:id",updateEvento);
router.put("/addScout/:id/:idScout",addScoutToEvent);
router.put("/addScouts/:id",addScoutsToEvent);
router.get("/getEventByBranchAndDate/:idRama/:startDate",readEventosByBranchAndDate);
router.get("/getEventByDate/:startDate",readEventosByDate);
router.get("/allEvents",readEventos);
router.get("/allGeneralEvents",readGeneralEventos);
router.get("/allGeneralEventsDate",readGeneralEventosDate);
router.get("/TwoGeneralEvents",readTwoGeneralEventos);
router.get("/getlastTwoEventByBranch/:idRama",readlastTowEventosByBranch);
router.get("/getAllEventByBranch/:idRama",readAllEventosByBranch);
router.get("/getAllEventByBranchDate/:idRama",readAllEventosByBranchDate);
router.get("/getScoutsAsignadosEvento/:id",getScoutsAsignadosEvento);
router.delete("/:id",deleteEvento);
router.get("/:id",readEvento);
router.get("/countInscritos/:id",getTotalInscritosEvento);
router.get("/ScoutIsPresent/:id/:idScout",isScoutPresent);
module.exports=router;