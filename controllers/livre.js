const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

// Récupérer tous les livres
exports.list = async (req, res) => {
  try {
    const query = {
      text: 'SELECT * FROM livre',
    };
    const result = await pool.query(query);
    const livre = result.rows;

    return res.status(200).json({
      data: livre,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: [{ msg: 'Une erreur est survenue, impossible de récupérer les livres' }],
    });
  }
};

// Récupérer un livre par ID
exports.read = async (req, res) => {
  const bookId = req.params.id;

  try {
    const query = {
      text: 'SELECT * FROM livre WHERE id = $1',
      values: [bookId],
    };
    const result = await pool.query(query);
    const book = result.rows[0];

    if (!book)
      return res.status(404).json({
        error: [{ msg: "Ce livre n'existe pas" }],
      });

    return res.status(200).json({
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: [{ msg: 'Une erreur est survenue, impossible de récupérer le livre' }],
    });
  }
};

// Créer un nouveau livre
exports.createOrUpdate = async (req, res) => {
  const { title, author, genre } = req.body;

  try {
    const query = {
      text: 'INSERT INTO livre (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
      values: [title, author, genre],
    };
    const result = await pool.query(query);
    const book = result.rows[0];

    return res.status(201).json({
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: [{ msg: 'Une erreur est survenue, impossible de créer le livre' }],
    });
  }
};

// Mettre à jour un livre existant
exports.update = async (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre } = req.body;

  try {
    const query = {
      text: 'UPDATE livre SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *',
      values: [title, author, genre, bookId],
    };
    const result = await pool.query(query);
    const book = result.rows[0];

    if (!book)
      return res.status(404).json({
        error: [{ msg: "Ce livre n'existe pas" }],
      });

    return res.status(200).json({
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: [{ msg: 'Une erreur est survenue, impossible de mettre à jour le livre' }],
    });
  }
};

// DELETE /livre/:id
exports.remove = async (req, res) => {
  const id = req.params.id;

  try {
    const query = {
      text: "DELETE FROM livre WHERE id = $1 RETURNING *",
      values: [id],
    };
    const result = await pool.query(query);
    const deletedBook = result.rows[0];

    if (!deletedBook) {
      return res.status(404).json({
        error: [{ msg: "Ce livre n'existe pas" }],
      });
    }

    return res.status(200).json({
      data: deletedBook,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: [{ msg: "Une erreur est survenue, impossible de supprimer le livre" }],
    });
  }
};

