const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    createdBy: { //who created it
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//automatically exclude soft deleted ones
recordSchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Record", recordSchema);
