const gastosService = require('../services/gastosService');
const obrasService = require('../services/obrasService');


module.exports = {
    buscarTodos: async (req, res) => {
        let json = { error: '', result: [] };
        try {
            let gastos = await gastosService.buscarTodos();
            json.result = gastos.map(gasto => ({
                codigo: gasto.id_gasto,
                descricao: gasto.descricao,
                valor: gasto.valor,
                data: gasto.data,
                id_usuario: gasto.id_usuario,
                id_obra: gasto.id_obra,
                nome_obra: gasto.nome_obra || 'Obra não informada'
            }));
        } catch (error) {
            json.error = 'Erro ao buscar gastos: ' + error.message;
        }
        res.json(json);
    },
    

    buscarUm: async (req, res) => {
        let json = { error: '', result: {} };
        let id_gasto = req.params.id_gasto;
        try {
            let gasto = await gastosService.buscarUm(id_gasto);
            if (gasto) {
                json.result = gasto;
            } else {
                json.error = 'Gasto não encontrado';
            }
        } catch (error) {
            json.error = 'Erro ao buscar gasto: ' + error.message;
        }
        res.json(json);
    },

    inserir: async (req, res) => {
        let json = { error: '', result: {} };
        let { descricao, valor, data, id_usuario, id_obra } = req.body;
        if (descricao && valor && data && id_usuario && id_obra) {
            try {
                let gastoCodigo = await gastosService.inserir(descricao, valor, data, id_usuario, id_obra);
                json.result = {
                    codigo: gastoCodigo,
                    descricao,
                    valor,
                    data,
                    id_usuario,
                    id_obra
                };
            } catch (error) {
                json.error = 'Erro ao inserir gasto: ' + error.message;
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    alterar: async (req, res) => {
        let json = { error: '', result: {} };
        let id_gasto = req.params.id_gasto;
        let { descricao, valor, data, id_usuario, id_obra } = req.body;
        if (id_gasto && descricao && valor && data && id_usuario && id_obra) {
            try {
                await gastosService.alterar(id_gasto, descricao, valor, data, id_usuario, id_obra);
                json.result = { codigo: id_gasto, descricao, valor, data, id_usuario, id_obra };
            } catch (error) {
                json.error = 'Erro ao alterar gasto: ' + error.message;
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    excluir: async (req, res) => {
        let id_gasto = req.params.id_gasto;
        try {
            await gastosService.excluir(id_gasto);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir gasto: ' + error.message });
        }
    },

    buscarUltimos: async (req, res) => {
        let json = { error: '', result: [] };
        let id_usuario = req.params.id_usuario;
        try {
            const gastos = await gastosService.buscarUltimosGastosPorUsuario(id_usuario);
            json.result = gastos.length ? gastos : [];
            res.json(json);
        } catch (error) {
            json.error = 'Erro ao buscar últimos gastos: ' + error.message;
            res.status(500).json(json);
        }
    },

    calcularTotal: async (req, res) => {
        let json = { error: '', result: {} };
        try {
            const total = await gastosService.calcularTotalGastos();
            json.result.total = total || 0;
            res.json(json);
        } catch (error) {
            json.error = 'Erro ao calcular total de gastos: ' + error.message;
            res.status(500).json(json);
        }
    },

    buscarGastosPorObra: async (req, res) => {
        let json = { error: '', result: [] };
        let id_obra = req.params.id_obra;
        try {
            let gastos = await gastosService.buscarGastosPorObra(id_obra);
            json.result = gastos.map(gasto => ({
                codigo: gasto.id_gasto,
                descricao: gasto.descricao,
                valor: gasto.valor,
                data: gasto.data,
                id_usuario: gasto.id_usuario
            }));
        } catch (error) {
            json.error = 'Erro ao buscar gastos por obra: ' + error.message;
        }
        res.json(json);
    },

    buscarGastosParaGraficos: async (req, res) => {
        let json = { error: '', result: [] };
        try {
            const obras = [
                { id_obra: 1, nome: 'Reforma Colégio Univap' },
                { id_obra: 2, nome: 'Construção Casa Urbanova' },
                { id_obra: 3, nome: 'Construção Casa Centro' }
            ];

            for (let obra of obras) {
                let gastos = await gastosService.buscarGastosPorObra(obra.id_obra);
                json.result.push({
                    obra: obra.nome,
                    gastos: gastos.map(gasto => ({
                        descricao: gasto.descricao,
                        valor: gasto.valor
                    }))
                });
            }
        } catch (error) {
            json.error = 'Erro ao buscar gastos para gráficos: ' + error.message;
        }
        res.json(json);
    },

    buscarObrasEGastosPorUsuario: async (req, res) => {
        let json = { error: '', result: [] };
        let id_usuario = req.params.id_usuario; 
        try {
            const obrasEGastos = await obrasService.buscarObrasEGastosPorUsuario(id_usuario);
    
            for (let obra of obrasEGastos) {
                json.result.push({
                    nome_obra: obra.nome_obra, 
                    gastos: obra.gastos.map(gasto => ({
                        descricao: gasto.descricao,
                        valor: gasto.valor
                    }))
                });
            }
        } catch (error) {
            json.error = 'Erro ao buscar obras e gastos: ' + error.message;
        }
        res.json(json);
    }    
};
