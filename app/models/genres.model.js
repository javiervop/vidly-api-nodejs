module.exports = (mongoose) => {
  const Genres = mongoose.model(
    "genres",
    mongoose.Schema(
      {
        name: String,
      },
      { timestamps: true }
    )
  );
  return Genres;
};
