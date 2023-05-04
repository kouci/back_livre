USE livreAccueil;

DELIMITER //
CREATE TRIGGER check_livre_length
BEFORE INSERT ON livre
FOR EACH ROW
BEGIN
  DECLARE livre_count INT;
  SELECT COUNT(*) INTO livre_count FROM livre;
  
  IF livre_count >= 20 THEN
    SET @min_id = (SELECT MIN(id) FROM livre);
    DELETE FROM livre WHERE id = @min_id;
  END IF;
END;
//
DELIMITER ;