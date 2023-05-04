const express = require("express");

const router = express.Router();
const authCtrl = require("../controllers/livre");
const {
  loginValidator,
  signupValidator,
  checkJWTValidator,
} = require("../validators/auth");


router.post('/livre', createOrUpdate, authCtrl.login);

router.get('/livres', list);
router.get('/livre/:_id', read);
router.put('/livre/:_id', update, authCtrl.login);
router.delete('/livre/:_id', remove, authCtrl.login);
router.get("/check-jwt", checkJWTValidator, authCtrl.checkJWT);

module.exports = router;
