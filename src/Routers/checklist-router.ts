import express from "express";
import {
    deleteSingleItemFromItems,
  getSingleChecklist,
  postChecklist,
  removeEntireChecklist,
  updateChecklistItems,
  updateItemCompleted,
} from "../Controllers/checklistcontroller";

const checklistRouter = express.Router();

checklistRouter.get("/:user_id/:trip_id", getSingleChecklist);
checklistRouter.post("/:user_id/:trip_id", postChecklist);
checklistRouter.patch("/:user_id/:trip_id", updateChecklistItems);
checklistRouter.patch("/:user_id/:trip_id/delete-item",deleteSingleItemFromItems)
checklistRouter.patch("/:user_id/:trip_id/change-status",updateItemCompleted)
checklistRouter.delete("/:user_id/:trip_id",removeEntireChecklist)
export default checklistRouter;
