import express from "express";
import {
    deleteSingleItemFromItems,
  getSingleChecklist,
  postChecklist,
  removeEntireChecklist,
  updateChecklistItems,
} from "../Controllers/checklistcontroller";

const checklistRouter = express.Router();

checklistRouter.get("/:user_id/:trip_id", getSingleChecklist);
checklistRouter.post("/:user_id/:trip_id", postChecklist);
checklistRouter.patch("/:user_id/:trip_id", updateChecklistItems);
checklistRouter.patch("/:user_id/:trip_id/delete-item",deleteSingleItemFromItems)
checklistRouter.delete("/:user_id/:trip_id",removeEntireChecklist)
export default checklistRouter;
