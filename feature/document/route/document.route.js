import { Router } from "express";
import documentController from "../controller/document.controller.js";
import upload from "../../../middleware/upload.middleware.js";

const DocumentRoute = Router();
DocumentRoute.post("/", documentController.createNewDoc);
DocumentRoute.get("/", documentController.getAllDocuments);
DocumentRoute.get("/:id", documentController.getDocumentById);
DocumentRoute.put(
  "/:id",
  documentController.updateDocumentById
);
export default DocumentRoute;
