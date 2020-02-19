//configura servidor
const express = require("express")
const server = express()

//configurar server para receber arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({
    extended: true
}))

//configurar conexição com o BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configura apresentação da pag
server.get("/", function (req, res) {
    
    db.query(`SELECT * FROM donors` , function(err,result){
        if(err) res.send("Erro de banco!")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req, res){
    //pegar dados
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios!") 
    }

    //colocando valores dentro do BD
    const query = 
        `INSERT INTO donors ("name" , "email" , "blood") 
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]
    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no banco de dados!")
        //fluxo ideal
        return res.redirect("/")
    })

    
})


//liga servidor e permite acesso a porta 3000
server.listen(3000)
