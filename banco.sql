CREATE DATABASE construcao;
use construcao;

CREATE TABLE usuarios (
    id_usuario INT(11) PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255),
    senha VARCHAR(255)
);

CREATE TABLE obras (
    id_obra INT(11) PRIMARY KEY,
    nome_obra VARCHAR(255),
    endereco VARCHAR(255),
    data_inicio VARCHAR(10),
    data_fim VARCHAR(10)
);

CREATE TABLE gastos (
    id_gasto INT(11) PRIMARY KEY,
    descricao VARCHAR(255),
    valor DECIMAL(10,2),
    data VARCHAR(10),
    id_usuario INT(11),
    id_obra INT(11),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
);
