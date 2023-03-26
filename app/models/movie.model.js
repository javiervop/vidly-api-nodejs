const { isObjectIdOrHexString } = require("mongoose");

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const Movie = mongoose.model(
    "movie",
    mongoose.Schema(
      {
        title: String,
        genre: { name: String, _id: Schema.Types.ObjectId },
        numberInStock: Number,
        dailyRentalRate: Number,
      },
      { timestamps: true }
    )
  );
  return Movie;
};
