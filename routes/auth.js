const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/auth");
const {
  loginValidator,
  signupValidator,
  checkJWTValidator,
} = require("../validators/auth");

router.post("/login", loginValidator, authCtrl.login);
router.post("/signup", signupValidator, authCtrl.signup);
router.get("/check-jwt", checkJWTValidator, authCtrl.checkJWT);

module.exports = router;
