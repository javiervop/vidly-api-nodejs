module.exports = (mongoose) => {
  const Tutorial = mongoose.model(
    "tutorial",
    mongoose.Schema(
      {
        title: String,
        description: String,
        published: Boolean,
      },
      { timestamps: true }
    )
  );

  return Tutorial;
};

/*
This Mongoose Model represents tutorials collection in MongoDB database. 
These fields will be generated automatically for each Tutorial document:
 _id, title, description, published, createdAt, updatedAt, __v.
*/
