const { ApolloServer, gql } = require('apollo-server');


const usuarios = [{
    id:1,
    nome:'João Silva',
    email:'jsilva@zemail.com',
    idade:29,
    perfil_id:1
},{
    id:2,
    nome:'Rafael Junior',
    email:'rafa@zemail.com',
    idade:31,
    perfil_id:2
},{
    id:3,
    nome:'Daniela Smith',
    email:'daniela@zemail.com',
    idade:24,
    perfil_id:1
}]

const perfis = [{
    id:1,
    nome:'Administrador'
},{
    id:2,
    nome:'Comum'
}]

const typeDefs = gql`
scalar Date

type Usuario{
    id: ID
    nome:String!
    email:String!
    idade:Int
    salario:Float
    vip:Boolean
    perfil:Perfil
}

type Produto{
    nome:String!
    preco:Float!
    desconto:Float
    presoComDesconto:Float
}

type Perfil{
    id:ID
    nome:String
}

#Pontos de Entrada da sua API!
type Query {
    ola:String!
    horaAtual:Date!
    usuarioLogado:Usuario
    produtoEmDestaque:Produto
    numerosMegaSena: [Int!]!
    usuarios:[Usuario]
    usuario(id:ID):Usuario
    perfis:[Perfil]
    perfil(id:ID):Perfil
}`
    ;

const resolvers = {
    Usuario: {
        salario(Usuario) {
            return Usuario.salario_real
        },
        perfil(usuario){
            const sels = perfis
            .filter(p => p.id == usuario.perfil_id)
        return sels ? sels[0] : null
        }
    },
    Produto: {
        presoComDesconto(Produto) {
            if (Produto.desconto) {
                return Produto.preco * (1 - Produto.desconto) 
            }else{
                return Produto.preco
            }
        }
    },
    Query: {
        ola() {
            return `Bom dia!`
        },
        horaAtual() {
            return new Date
        },
        usuarioLogado() {
            return {
                id: 1,
                nome: 'Ana da Web',
                email: 'anadaweb@email.com',
                idade: 23,
                salario_real: 1240.52,
                vip: true
            }
        },
        produtoEmDestaque() {
            return {
                nome: 'NoteBook Gamer',
                preco: 4890.89,
                desconto: 0.15
            }
        },
        numerosMegaSena(){
            // return [4,8,13,27,33,54]

            const crescente = (a,b)=>a-b

            return Array(6).fill(0).map(n => parseInt(Math.random() *60 + 1)).sort(crescente)
        },
        usuarios(){
            return usuarios
        },
        usuario(_,{ id }){
            const sels = usuarios
                .filter(u => u.id == id)
            return sels ? sels[0] : null
        },
        perfis(){
            return perfis
        },
        perfil(_,{ id }){
            const sels = perfis
                .filter(p => p.id == id)
            return sels ? sels[0] : null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`)
})