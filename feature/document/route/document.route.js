import { Router } from "express";
import documentController from "../controller/document.controller.js";
import upload from "../../../middleware/upload.middleware.js";

const DocumentRoute = Router();
DocumentRoute.post("/", upload.single("file"), documentController.createNewDoc);
DocumentRoute.get("/", documentController.getAllDocuments);
DocumentRoute.get("/:id", documentController.getDocumentById);
DocumentRoute.put(
  "/:id",
  upload.single("file"),
  documentController.updateDocumentById
);
export default DocumentRoute;
