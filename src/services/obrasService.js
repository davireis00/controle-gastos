const db = require('../db');

module.exports = {
    buscarTodos: () => {
        return new Promise((aceito, rejeitado) => {
            db.query('SELECT * FROM obras', (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            });
        });
    },

    buscarUm: (id_obra) => {
        return new Promise((aceito, rejeitado) => {
            db.query('SELECT * FROM obras WHERE id_obra = ?', [id_obra], (error, results) => {
                if (error) { rejeitado(error); return; }
                if (results.length > 0) {
                    aceito(results[0]);
                } else {
                    aceito(false);
                }
            });
        });
    },

    inserir: (nome_obra, endereco, data_inicio, data_fim) => {
        return new Promise((aceito, rejeitado) => {
            db.query(
                'INSERT INTO obras (nome_obra, endereco, data_inicio, data_fim) VALUES (?,?,?,?)',
                [nome_obra, endereco, data_inicio, data_fim],
                (error, results) => {
                    if (error) {
                        rejeitado(error);
                        return;
                    }
                    aceito(results.insertId);
                }
            );
        });
    },

    alterar: (id_obra, nome_obra, endereco, data_inicio, data_fim) => {
        return new Promise((aceito, rejeitado) => {
            db.query(
                'UPDATE obras SET nome_obra = ?, endereco = ?, data_inicio = ?, data_fim = ? WHERE id_obra = ?',
                [nome_obra, endereco, data_inicio, data_fim, id_obra],
                (error, results) => {
                    if (error) {
                        rejeitado(error);
                        return;
                    }
                    aceito(results);
                }
            );
        });
    },

    excluir: (id_obra) => {
        return new Promise((aceito, rejeitado) => {
            db.query('DELETE FROM obras WHERE id_obra = ?', [id_obra], (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            });
        });
    },

    buscarObrasEGastosPorUsuario: (id_usuario) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT o.id_obra, o.nome_obra, g.descricao, g.valor
                FROM obras o
                JOIN gastos g ON o.id_obra = g.id_obra
                WHERE g.id_usuario = ?`;
    
            db.query(query, [id_usuario], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const obrasMap = {};
    
                results.forEach(row => {
                    if (!obrasMap[row.id_obra]) {
                        obrasMap[row.id_obra] = {
                            id_obra: row.id_obra,
                            nome_obra: row.nome_obra,
                            gastos: []
                        };
                    }
    
                    obrasMap[row.id_obra].gastos.push({
                        descricao: row.descricao,
                        valor: row.valor
                    });
                });
    
                const obras = Object.values(obrasMap);
                resolve(obras);
            });
        });
    }
};
