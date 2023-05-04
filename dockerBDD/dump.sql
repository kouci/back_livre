-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le :  mer. 04 mai. 2023 à 11:22
-- Version du serveur :  10.3.14-MariaDB
-- Version de PHP :  7.2.18

DROP DATABASE IF EXISTS livreAccueil;

CREATE DATABASE IF NOT EXISTS livreAccueil;
USE livreAccueil;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `livresAccueil`
--

DROP TABLE IF EXISTS auteur;
CREATE TABLE IF NOT EXISTS auteur (
  id int(11) NOT NULL AUTO_INCREMENT,
  nom varchar(255) COLLATE utf8_bin NOT NULL,
  description text COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (id),
  KEY authorName (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS livre;
CREATE TABLE IF NOT EXISTS livre (
  id int(11) NOT NULL AUTO_INCREMENT,
  nom varchar(255) COLLATE utf8_bin NOT NULL,
  ISBN varchar(17) COLLATE utf8_bin NOT NULL,
  prixHT double NOT NULL,
  annee int(4) NOT NULL,
  numEdition varchar(20) COLLATE utf8_bin NOT NULL,
  qteDispo int(11) NOT NULL,
  resume text COLLATE utf8_bin DEFAULT NULL,
  sommaire text COLLATE utf8_bin DEFAULT NULL,
  quartDePage text COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fastSearch (nom,ISBN)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS travail;
CREATE TABLE IF NOT EXISTS travail (
  id_livre int(11) NOT NULL,
  id_auteur int(11) NOT NULL,
  PRIMARY KEY (id_livre,id_auteur),
  KEY travail_fk_2 (id_auteur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE travail
  ADD CONSTRAINT travail_fk_1 FOREIGN KEY (id_livre) REFERENCES livre (id),
  ADD CONSTRAINT travail_fk_2 FOREIGN KEY (id_auteur) REFERENCES auteur (id);
COMMIT;