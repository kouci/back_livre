const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const responseTime = require("response-time");
require("dotenv").config();

process.env.TZ = "Europe/Paris";

const authRoutes = require("./routes/auth");

const app = express();
app.disable("X-Powered-By");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(helmet()); // Bases pour protéger les headers, ca se voit pas avec le proxy web d'angular, mais en prod ca marche
app.use(express.json()); // Pour utiliser le json
app.use(cookieParser()); // Pour les tokens csurf
app.use(responseTime()); // Pour voir les temps de réponse

app.use("/api/auth", authRoutes);

module.exports = { app };
