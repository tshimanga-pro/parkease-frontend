const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer  = require('multer');

const Vehicle = require("../models/Vehicle_registration");

//Image upload configurations
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage })

router.get("/registerVehicle", (req, res) => {
  res.render("register-vehicle");
});

router.post("/registerVehicle", upload.single("vehicleImage"), async (req, res) => {
  try {
    const uniqueTicket = "RCPT-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const newVehicle = new Vehicle({
     driverName: req.body.driverName,
     phoneNumber: req.body.phoneNumber,
     vehicleType: req.body.vehicleType,
     numberPlate: req.body.numberPlate,
     vehicleModel: req.body.vehicleModel,
     vehicleColor: req.body.vehicleColor,
     ninNumber: req.body.ninNumber,
     arrivalDate: req.body.arrivalDate,
     arrivalTime: req.body.arrivalTime,
     receiptNumber: uniqueTicket,
     vehicleImage: req.file.path
    });
    console.log(newVehicle);
    await newVehicle.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("register-vehicle");
  }
});

module.exports = router;
