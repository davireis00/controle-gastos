const usuariosService = require('../services/usuariosService');
const bcrypt = require('bcrypt');

module.exports = {
    cadastrar: async (req, res) => {
        let json = { error: '', result: {} };
        let { nome, email, senha } = req.body;
        if (nome && email && senha) {
            try {
                const hashedPassword = await bcrypt.hash(senha, 10);
                let usuarioCodigo = await usuariosService.inserir(nome, email, hashedPassword);
                json.result = { codigo: usuarioCodigo, nome, email };
            } catch (error) {
                json.error = 'Erro ao cadastrar usuário';
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    login: async (req, res) => {
        let json = { error: '', result: {} };
        let { email, senha } = req.body;
        if (email && senha) {
            try {
                let usuario = await usuariosService.buscarPorEmail(email);
                if (usuario) {
                    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
                    if (senhaCorreta) {
                        req.session.userId = usuario.id_usuario;
                        json.result = { codigo: usuario.id_usuario, nome: usuario.nome };
                    } else {
                        json.error = 'Senha incorreta';
                    }
                } else {
                    json.error = 'Usuário não encontrado';
                }
            } catch (error) {
                console.error('Erro ao realizar login:', error);
                json.error = 'Erro ao realizar login';
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    atualizar: async (req, res) => {
        let json = { error: '', result: {} };
        let { nome, email, senha, senhaAntiga } = req.body;
        const id_usuario = req.session.userId;
        if (id_usuario && (nome || email || senha)) {
            try {
                if (senha) {
                    const usuario = await usuariosService.buscarPorId(id_usuario);
                    const senhaCorreta = await bcrypt.compare(senhaAntiga, usuario.senha);
                    if (!senhaCorreta) {
                        json.error = 'Senha antiga incorreta';
                        return res.json(json);
                    }
                    senha = await bcrypt.hash(senha, 10);
                }
                await usuariosService.atualizar(id_usuario, nome, email, senha);
                json.result = { id_usuario, nome, email };
            } catch (error) {
                json.error = 'Erro ao atualizar usuário';
            }
        } else {
            json.error = 'Campos não enviados';
        }
        res.json(json);
    },

    detalhes: async (req, res) => {
        let json = { error: '', result: {} };
        const id_usuario = req.session.userId;
        if (id_usuario) {
            try {
                let usuario = await usuariosService.buscarPorId(id_usuario);
                if (usuario) {
                    json.result = { codigo: usuario.id_usuario, nome: usuario.nome, email: usuario.email };
                } else {
                    json.error = 'Usuário não encontrado';
                }
            } catch (error) {
                json.error = 'Erro ao buscar detalhes do usuário';
            }
        } else {
            json.error = 'Usuário não está logado';
        }
        res.json(json);
    },
    buscarUm: async (req, res) => {
        let json = { error: '', result: {} };
        let { id_usuario } = req.params;
        if (id_usuario) {
            try {
                let usuario = await usuariosService.buscarPorId(id_usuario);
                if (usuario) {
                    json.result = { 
                        codigo: usuario.id_usuario, 
                        nome: usuario.nome, 
                        email: usuario.email,
                        senha: usuario.senha  
                    };
                } else {
                    json.error = 'Usuário não encontrado';
                }
            } catch (error) {
                json.error = 'Erro ao buscar usuário';
            }
        } else {
            json.error = 'ID do usuário não enviado';
        }
        res.json(json);
    },
    
};
