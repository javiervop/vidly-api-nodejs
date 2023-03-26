const db = require("../models");
const Genres = db.genres;

// Create and Save a new Genres
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Genres can not be empty!" });
    return;
  }

  // Create a Genres
  const genres = new Genres({
    name: req.body.name,
  });

  // Save Genres in the database
  genres
    .save(genres)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Genres.",
      });
    });
};

// Retrieve all Genress from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Genres.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Genres.",
      });
    });
};

// Find a single Genres with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Genres.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Genres with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Genres with id=" + id });
    });
};

// Update a Genres by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Genres.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Genres with id=${id}. Maybe Genres was not found!`,
        });
      } else res.send({ message: "Genres was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Genres with id=" + id,
      });
    });
};

// Delete a Genres with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Genres.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Genres with id=${id}. Maybe Genres was not found!`,
        });
      } else {
        res.send({
          message: "Genres was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Genres with id=" + id,
      });
    });
};

// Delete all Genress from the database.
exports.deleteAll = (req, res) => {
  Genres.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Genres were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Genres.",
      });
    });
};
