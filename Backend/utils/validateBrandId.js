const mongoose = require("mongoose");

const validateBrandId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("Invalid Brand ID format.");
  }
};

module.exports = validateBrandId;
