const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};
const { sendResponse, AppError } = require("../helpers/utils.js");

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    ) {
      const exception = new Error("Missing required information");
      throw exception;
    }
    const newCar = await new Car({
      make: make,
      model: model,
      release_date: release_date,
      transmission_type: transmission_type,
      size: size,
      style: style,
      price: price,
    }).save();
    const response = {
      message: "Create car successfully!",
      car: newCar,
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  let { page, ...filterQuery } = req.query;

  try {
    //Input Validation
    const filterKeys = Object.keys(filterQuery);
    console.log(filterQuery);
    if (filterKeys.length) {
      const exception = new Error("Only accept page query");
      throw exception;
    }

    // get cars
    let allCars = await Car.find();
    allCars = allCars.filter((item) => item.isDeleted === false);
    const totalPages = parseInt(allCars.length / 10);
    //page division
    page = parseInt(page) || 1;
    let limit = 10;
    let offset = limit * (page - 1);
    allCars = allCars.slice(offset, offset + limit);

    const response = {
      message: "Get Car List Successfully!",
      page: page,
      total: totalPages,
      cars: allCars,
    };

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    let { id } = req.params;
    console.log(id);
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
    const updates = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );
    if (!updatedCar) throw new Error("Car not found!");
    const response = {
      message: "Updated Car Successfully!",

      car: updatedCar,
    };
    res.status(200).send(response);
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
    let deletedCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    const response = { message: "Delete car successfully!", car: deletedCar };
    res.status(200).send(response);
    // YOUR CODE HERE
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
