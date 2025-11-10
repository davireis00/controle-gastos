const obrasService = require('../services/obrasService');

module.exports = {
    buscarTodos: async (req, res) => {
        let json = { error: '', result: [] };
        try {
            let obras = await obrasService.buscarTodos();
            for (let i in obras) {
                json.result.push({
                    codigo: obras[i].id_obra,
                    nome_obra: obras[i].nome_obra,
                    endereco: obras[i].endereco,
                    data_inicio: obras[i].data_inicio,
                    data_fim: obras[i].data_fim
                });
            }
        } catch (error) {
            console.error(error);
            json.error = 'Erro ao buscar obras';
        }
        res.json(json);
    },

    buscarUm: async (req, res) => {
        let json = { error: '', result: {} };
        let id_obra = req.params.id_obra;
        try {
            let obra = await obrasService.buscarUm(id_obra);
            if (obra) {
                json.result = obra;
            } else {
                json.error = 'Obra não encontrada';
            }
        } catch (error) {
            console.error(error);
            json.error = 'Erro ao buscar obra';
        }
        res.json(json);
    },

    inserir: async (req, res) => {
        let json = { error: '', result: {} };
        let nome_obra = req.body.nome;
        let endereco = req.body.localizacao;
        let data_inicio = req.body.data_inicio;
        let data_fim = req.body.data_fim || null;

        if (nome_obra && endereco && data_inicio) {
            try {
                let obraCodigo = await obrasService.inserir(nome_obra, endereco, data_inicio, data_fim);
                json.result = {
                    codigo: obraCodigo,
                    nome_obra,
                    endereco,
                    data_inicio,
                    data_fim
                };
            } catch (error) {
                console.error('Erro ao inserir obra:', error);
                json.error = 'Erro ao inserir obra';
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    alterar: async (req, res) => {
        let json = { error: '', result: {} };
        let id_obra = req.params.id_obra;
        let nome_obra = req.body.nome;
        let endereco = req.body.localizacao;
        let data_inicio = req.body.data_inicio;
        let data_fim = req.body.data_fim || null;

        if (id_obra && nome_obra && endereco && data_inicio) {
            try {
                await obrasService.alterar(id_obra, nome_obra, endereco, data_inicio, data_fim);
                json.result = {
                    codigo: id_obra,
                    nome_obra,
                    endereco,
                    data_inicio,
                    data_fim
                };
            } catch (error) {
                console.error('Erro ao alterar obra:', error);
                json.error = 'Erro ao alterar obra';
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    excluir: async (req, res) => {
        let json = { error: '', result: {} };
        let id_obra = req.params.id_obra;
        try {
            await obrasService.excluir(id_obra);
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao excluir obra:', error);
            res.status(500).json({ error: 'Erro ao excluir obra' });
        }
    }
};
