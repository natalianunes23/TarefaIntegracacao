const express = require("express");
const app = express();

const Pagamento = require("./models/Pagamento")
//const Usuario = require("./models/Usuario")
const path=require ('path');//enderço de cada rota
const router=express.Router();// trabalha com as rotas
const moment = require('moment');
const handlebars = require("express-handlebars");
const Usuario = require("./models/Usuario");

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
},

helpers: {
    formatDate: (date) => {
        return moment(date).format('DD/MM/YYYY')
    }
}
}))

app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Rotas
router.get('/pagamento', function(req, res){
    res.sendFile(path.join(__dirname+'/pagamento.html'));
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));    
});


router.post('/pagamento', function(req, res){
    Pagamento.create({
        nome: req.body.nome,
        valor: req.body.valor
    }).then(function(){
        res.redirect('/pagamento')
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
    })
});

router.get('/lista', function(req, res){
    Pagamento.findAll().then(function(pagamentos){
        res.render('pagamento', {pagamentos: pagamentos});
    })
});

router.get('/del-pagamento/:id', function(req, res){
    Pagamento.destroy({
        where: {'id': req.params.id}
    }).then(function(){
        res.redirect('/pagamento');
/*res.send("Pagamento apagado com sucesso!");*/
    }).catch(function(erro){
        res.send("Pagamento não apgado com sucesso!");
    })
});

router.get('/edit-pagamento/:id', function(req, res){
    Pagamento.findByPk (req.params.id).then(function(pagamentos){
        res.render('editar', {pagamentos: pagamentos});
    })
}); 

router.post('/edit-pagamento/:id', function(req, res){
    Pagamento.update( 
    {nome: req.body.nome,
    valor: req.body.valor},
    {where: {'id': req.params.id}}
).then(function(){
res.redirect('/lista')
}).catch(function(erro){
res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
})
});

//rotas para usuários

router.get('/usuario', function(req, res){
res.sendFile(path.join(__dirname+'/usuario.html'));
});

router.get('/cadastrousuario', function(req, res){
res.sendFile(path.join(__dirname+'/indexUsuario.html'));
});

router.post('/usuario', function(req, res){
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
    }).then(function(){
        res.sendFile(path.join(__dirname+'/indexUsuario.html'));
    }).catch(function(erro){
        res.send("Erro: Usuário não foi cadastrado com sucesso!" + erro)
    })
});

router.get('/listausuario', function(req, res){
    Usuario.findAll().then(function(Usuario){
        res.render('usuario', {Usuario: Usuario});
    })
});

router.get('/del-usuario/:id', function(req, res){
Usuario.destroy({
where: {'id': req.params.id}
}).then(function(){
res.redirect('/listausuario');

}).catch(function(erro){
res.send("Erro! Usuário não apagado.");
})
});

router.get('/edit-usuario/:id', function(req, res){
Usuario.findByPk (req.params.id).then(function(Usuario){
res.render('editarCadUsuario', {Usuario: Usuario});
})
}); 

router.post('/edit-usuario/:id', function(req, res){
Usuario.update( 
{nome: req.body.nome,
email: req.body.email,
senha: req.body.senha,},
{where: {'id': req.params.id}}
).then(function(){
res.redirect('/listausuario')
}).catch(function(erro){
res.send("Erro: Usuário não atualizado." + erro)
})
});

app.use('/',router);
app.use('/pagamento',router);
app.use('/lista',router);
app.use('/del-pagamento/:id',router);
app.use('/edit-pagamento/:id',router);

app.use('/indexUsuario',router);
app.use('/usuario',router);
app.use('/listausuario',router);
app.use('/del-usuario/:id',router);
app.use('/edit-usuario/:id',router);

app.listen(8080);

