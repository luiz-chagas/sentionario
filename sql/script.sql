CREATE TABLE Palavra 
(
    id serial PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario(
    id serial PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(256) NOT NULL,
    pontos INT NOT NULL,
    reg_date TIMESTAMP
);

CREATE TABLE Voto
(
    id serial PRIMARY KEY,
    palavra_id INT REFERENCES Palavra(id),
    usuario_id INT REFERENCES Usuario(id),
    valor INT
);

DELIMITER //
CREATE PROCEDURE top10()
BEGIN
  SELECT nome, pontos FROM Usuario
  ORDER BY pontos DESC LIMIT 10;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE addPontos(IN userID INT)
BEGIN
  UPDATE Usuario
  SET pontos = pontos + 5,
  WHERE id = userID;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE addPalavra(IN word VARCHAR(50))
BEGIN
  INSERT INTO Palavra(id, nome) VALUES(NULL, word);
END //
DELIMITER ;
