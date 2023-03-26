module.exports = (app) => {
  const genres = require("../controllers/genres.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", genres.create);

  // Retrieve all genres
  router.get("/", genres.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", genres.findOne);

  // Update a Tutorial with id
  router.put("/:id", genres.update);

  // Delete a Tutorial with id
  router.delete("/:id", genres.delete);

  // Delete all genres
  router.delete("/", genres.deleteAll);

  app.use("/api/genres", router);
};
