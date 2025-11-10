const express = require('express');
const router = express.Router();

const gastosController = require('./controllers/gastosController');
const obrasController = require('./controllers/obrasController');
const usuariosController = require('./controllers/usuariosController');


router.get('/gastos', gastosController.buscarTodos); 
router.get('/gastos/ultimos', gastosController.buscarUltimos); 
router.get('/gastos/:id_gasto', gastosController.buscarUm);
router.post('/gasto', gastosController.inserir);
router.put('/gasto/:id_gasto', gastosController.alterar);
router.delete('/gasto/:id_gasto', gastosController.excluir);
router.get('/gastos/obra/:id_obra', gastosController.buscarGastosPorObra);


router.get('/gastos/total', gastosController.calcularTotal);
router.get('/gastos/graficos', gastosController.buscarGastosParaGraficos);

router.get('/obras', obrasController.buscarTodos);
router.get('/obras/:id_obra', obrasController.buscarUm);
router.post('/obra', obrasController.inserir);
router.put('/obra/:id_obra', obrasController.alterar);
router.delete('/obra/:id_obra', obrasController.excluir);

router.post('/usuario/cadastrar', usuariosController.cadastrar);
router.post('/usuario/login', usuariosController.login);
router.put('/usuario/atualizar', usuariosController.atualizar);
router.get('/usuario/:id_usuario', usuariosController.buscarUm);
router.get('/usuario/detalhes', usuariosController.detalhes);

router.get('/usuario/:id_usuario/obras-gastos', gastosController.buscarObrasEGastosPorUsuario);
router.get('/gastos/ultimos/:id_usuario', gastosController.buscarUltimos);



module.exports = router;
