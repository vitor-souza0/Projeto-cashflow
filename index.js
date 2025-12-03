const express = require('express');

const mysql = require('mysql2/promise');

const cors = require('cors');

 

const app = express();

const port = 3000;

 

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

 

// Configuração do Banco

const dbConfig = {

    host: 'localhost',

    user: 'root',

    password: 'flamingo', // <-- ALUNOS: MUDEM AQUI

    database: 'cashflow_db'         // <-- ALUNOS: MUDEM AQUI

};

 

// --- ROTAS ---

 

// [GET] Listar todas as transações

app.get('/api/transacoes', async (req, res) => {

    try {

        const connection = await mysql.createConnection(dbConfig);

        // Ordenamos por data decrescente (mais recentes primeiro)

        const [rows] = await connection.execute('SELECT * FROM tbl_transacoes ORDER BY data_criacao DESC');

        await connection.end();

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Erro ao buscar dados.' });

    }

});

 

// [POST] Nova transação

app.post('/api/transacoes', async (req, res) => {

    const { descricao, valor, tipo } = req.body;

 

    // Validação básica

    if (!descricao || !valor || !tipo) {

        return res.status(400).json({ error: 'Preencha todos os campos.' });

    }

 

    try {

        const connection = await mysql.createConnection(dbConfig);

        const query = 'INSERT INTO tbl_transacoes (descricao, valor, tipo) VALUES (?, ?, ?)';

        const [result] = await connection.execute(query, [descricao, valor, tipo]);

        await connection.end();

       

        res.status(201).json({ message: 'Transação criada!', id: result.insertId });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Erro ao salvar.' });

    }

});

 

// [DELETE] Apagar transação

app.delete('/api/transacoes/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const connection = await mysql.createConnection(dbConfig);

        await connection.execute('DELETE FROM tbl_transacoes WHERE id = ?', [id]);

        await connection.end();

        res.json({ message: 'Item excluído.' });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Erro ao excluir.' });

    }

});

 

app.listen(port, () => {

    console.log(`CashFlow rodando em http://localhost:${port}`);

});