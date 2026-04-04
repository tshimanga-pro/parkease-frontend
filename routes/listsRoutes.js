const express = require("express");
const router = express.Router();

//Import model files
const Registration = require("../models/Registration");
const Vehicle = require("../models/Vehicle_registration");
const Battery = require("../models/Battery_registration");

router.get("/users", async (req, res) => {
    try {
       let users = await Registration.find().sort({$natural:-1})
       res.render("usersList", {users}); 
    } catch (error) {
        res.status(400).send("Unable to find users in the database")
    }  
});


router.get("/cars", async (req, res) => {
    try {
        let cars = await Vehicle.find().sort({$natural:-1})
        res.render("carList", {cars});
    } catch (error) {
       res.status(400).send("Unable to find cars in the database") 
    }
});

router.get("/batteries", async (req, res) => {
    try {
        let batteries = await Battery.find().sort({$natural:-1})
        res.render("batteriesList", {batteries});
    } catch (error) {
        res.status(400).send("Unable to find batteries in the database")  
    }
});

module.exports = router;