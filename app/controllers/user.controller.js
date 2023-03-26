const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config.js");

// Create and Save a new User
// async function create(req, res) {
exports.create = (req, res) => {
  if (!req.body.email) {
    res.status(400).send({ message: "User can not be empty!" });
    return;
  }
  const email = req.body.email;
  const condition = { email: { $regex: new RegExp(email), $options: "i" } };
  User.find(condition)
    .then(async (data) => {
      console.log(data, data.length);
      if (data.length > 0) {
        res.status(400).send({ message: "User already registered. " + email });
      } else {
        console.log("Create user");
        // Create a User

        let user = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Save User in the database
        user
          .save(user)
          .then((data) => {
            const { _doc } = data;
            const token = generateAuthToken(_doc);
            const aut_user = { ..._doc, jwt: token };
            res
              .header("x-auth-token", token)
              .header("access-control-expose-headers", "x-auth-token")
              .send(aut_user);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving User with email. " + email });
    });
};

// module.exports = create;

exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email
    ? { email: { $regex: new RegExp(email), $options: "i" } }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} User were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all User.",
      });
    });
};

exports.auth = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!req.body.email) {
    res.status(400).send({ message: "Username can not be empty!" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "Password can not be empty!" });
    return;
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // console.log("auth", req.body);
  // console.log("auth", user);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  // console.log("validPassword", validPassword, req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = generateAuthToken(user);
  res.send(token);

  /*
  var condition = {};
  if (email) condition["email"] = { $regex: new RegExp(email), $options: "i" };
  if (password)
    condition["password"] = { $regex: new RegExp(password), $options: "i" };
  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
  */
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(req);
}

generateAuthToken = function (user) {
  console.log("generateAuthToken user", user);
  // note attributes need to be defined on user.model.js
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user["admin"],
    },
    config["jwtPrivateKey"]
  );
  console.log("generateAuthToken jwt", token);
  return token;
};
