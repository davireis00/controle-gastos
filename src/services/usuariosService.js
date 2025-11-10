const db = require('../db');

module.exports = {
    inserir: (nome, email, senha) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results.insertId);
            });
        });
    },

    buscarPorEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
                if (error) {
                    console.error('Erro ao buscar por email:', error);
                    reject(error);
                    return;
                }
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(false);
                }
            });
        });
    },

    atualizar: (id_usuario, nome, email, senha) => {
        return new Promise((resolve, reject) => {
            const updates = [];
            const params = [];
            if (nome) {
                updates.push('nome = ?');
                params.push(nome);
            }
            if (email) {
                updates.push('email = ?');
                params.push(email);
            }
            if (senha) {
                updates.push('senha = ?');
                params.push(senha);
            }
            params.push(id_usuario);
            db.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id_usuario = ?`, params, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    },

    buscarPorId: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(false);
                }
            });
        });
    },
};
