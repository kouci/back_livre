const db = require("../db");
const bcrypt = require("bcrypt"); // Pour générer et lire les mots de passes hashés et salés
const jwt = require("jsonwebtoken"); // Pour envoyer les mails de reset de mot de passe
const crypto = require("crypto"); // Pour générer les tokens de reset mdp
const { validationResult } = require("express-validator"); // Pour vérifier les données reçues

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { identifiant, password } = req.body;

  await db.pool
    .query(
      "SELECT nom, id AS userID, mot_de_passe AS password, nom AS name, siret, sirene, adresse AS address, telephone AS phone, email AS mail FROM users WHERE identifiant = ?",
      [identifiant]
    )
    .then((user) => {
      delete user.meta;
      if (Object.keys(user).length === 0)
        return res
          .status(401)
          .send({ warning: "Email et/ou mot de passe incorrect" });
      if (Object.keys(user).length > 1)
        return res.status(500).send({ warning: "Erreur inconnue" });

      bcrypt
        .compare(password, user[0].password)
        .then((good) => {
          if (!good) {
            return res
              .status(401)
              .send({ warning: "Email et/ou mot de passe incorrect" });
          }
          const accessToken = jwt.sign(
            {
              userID: user[0].userID,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
            }
          );

          const {
            userID,
            username,
            name,
            siret,
            sirene,
            address,
            phone,
            mail,
          } = user[0];

          return res.status(200).send({
            user: {
              id: userID,
              username,
              name,
              siret,
              sirene,
              address,
              phone,
              mail,
            },
            accessToken,
          });
        })
        .catch(() => res.status(500).send({ error: "Erreur" }));
      return undefined;
    })
    .catch(() => res.status(500).send({ error: "Erreur" }));
};
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password, siret, sirene, address, phone, mail, name } =
    req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPWD) => {
      db.pool
        .query(
          "INSERT INTO users (idemtifiant, mot_de_passe, nom, siret, sirene, adresse, telephone, email ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
          [username, hashedPWD, name, siret, sirene, address, phone, mail]
        )
        .then((lines) => {
          if (lines.affectedRows === 1) {
            return res.status(201).send({ message: "Compte créé" });
          }
          console.log(lines);
          return res.status(500).send({ error: "Erreur" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({ error: "Erreur" });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "Erreur" });
    });
  return undefined;
};

exports.checkJWT = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userID } = req.body;

  jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) return res.status(401).send({ error: "Token invalide" });

      if (+decoded.userID === +userID) {
        return res.status(200).send({ message: "Token valide" });
      }
      return res.status(401).send({ error: "Token invalide" });

      return undefined;
    }
  );
};
