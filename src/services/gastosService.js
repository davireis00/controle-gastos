const db = require('../db');

module.exports = {
    buscarTodos: () => {
        return new Promise((resolve, reject) => {
            const query = `
                 SELECT 
                    g.id_gasto, 
                    g.descricao, 
                    g.valor, 
                    g.data, 
                    g.id_usuario, 
                    g.id_obra, 
                    o.nome_obra 
                FROM 
                    gastos g
                LEFT JOIN 
                    obras o ON g.id_obra = o.id_obra
            `;
            
            db.query(query, (error, results) => {
                if (error) { 
                    reject(error); 
                    return; 
                }
                resolve(results);
            });
        });
    },
    
    buscarUm: (id_gasto) => {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT g.*, o.nome_obra
                FROM gastos g
                JOIN obras o ON g.id_obra = o.id_obra
                WHERE g.id_gasto = ?
            `, [id_gasto], (error, results) => {
                if (error) { reject(error); return; }
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    },

    inserir: (descricao, valor, data, id_usuario, id_obra) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO gastos (descricao, valor, data, id_usuario, id_obra) VALUES (?,?,?,?,?)',
                [descricao, valor, data, id_usuario, id_obra],
                (error, results) => {
                    if (error) { reject(error); return; }
                    resolve(results.insertId);
                }
            );
        });
    },

    alterar: (id_gasto, descricao, valor, data, id_usuario, id_obra) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE gastos SET descricao = ?, valor = ?, data = ?, id_usuario = ?, id_obra = ? WHERE id_gasto = ?',
                [descricao, valor, data, id_usuario, id_obra, id_gasto],
                (error, results) => {
                    if (error) { reject(error); return; }
                    resolve(results);
                }
            );
        });
    },

    excluir: (id_gasto) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM gastos WHERE id_gasto = ?', [id_gasto], (error, results) => {
                if (error) { reject(error); return; }
                resolve(results);
            });
        });
    },

    buscarUltimosGastos: () => {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT g.*, o.nome_obra
                FROM gastos g
                JOIN obras o ON g.id_obra = o.id_obra
                ORDER BY g.data DESC LIMIT 10
            `, (error, results) => {
                if (error) { reject(error); return; }
                resolve(results);
            });
        });
    },

    calcularTotalGastos: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT SUM(valor) AS total FROM gastos', (error, results) => {
                if (error) { reject(error); return; }
                resolve(results.length > 0 ? results[0].total : 0);
            });
        });
    },

    buscarGastosPorObra: (id_obra) => {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT g.*, o.nome_obra
                FROM gastos g
                JOIN obras o ON g.id_obra = o.id_obra
                WHERE g.id_obra = ?
            `, [id_obra], (error, results) => {
                if (error) { reject(error); return; }
                resolve(results);
            });
        });
    },

    buscarUltimosGastosPorUsuario: (id_usuario) => {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT g.*, o.nome_obra
                FROM gastos g
                JOIN obras o ON g.id_obra = o.id_obra
                WHERE g.id_usuario = ?
                ORDER BY g.data DESC LIMIT 10
            `, [id_usuario], (error, results) => {
                if (error) { reject(error); return; }
                resolve(results);
            });
        });
    },
};
