const express = require("express");
const router = express.Router();

router.get("/manager", (req, res) => {
    res.render("managerDashboard");
});

router. get("/admin", (req, res) => {
    res.render("adminDashboard");
});

router. get("/attendant", (req, res) => {
    res.render("attendantDashboard");
});

module.exports = router;