module.exports = (app) => {
  const movies = require("../controllers/movie.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", movies.create);

  // Retrieve all movie
  router.get("/", movies.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", movies.findOne);

  // Update a Tutorial with id
  router.put("/:id", movies.update);

  // Delete a Tutorial with id
  router.delete("/:id", movies.delete);

  // Delete all movie
  router.delete("/", movies.deleteAll);

  app.use("/api/movies", router);
};
