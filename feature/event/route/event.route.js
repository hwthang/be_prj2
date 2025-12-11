import { Router } from "express";
import eventController from "../controller/event.controller.js";
import { buildResponse } from "../../../utils/response.helper.js";
import upload from "../../../middleware/upload.middleware.js";

const EventRoute = Router();

// POST create
EventRoute.post("/", eventController.createNewEvent);

// GET get all
EventRoute.get("/", eventController.getAllEvents);

// GET get by id
EventRoute.get("/:id", eventController.getEventById);

// PUT update by id
EventRoute.put("/:id", eventController.updateEventById);

// PATCH update images by id
EventRoute.patch(
  "/:id/update-images",
  upload.array("images", 10),
  eventController.updateImagesEventById
);

// PATCH cancel
EventRoute.patch("/:id/cancel", eventController.cancelEventById);

// PATCH cancel
EventRoute.post("/:id/posts", eventController.createEventPostById);

export default EventRoute;
