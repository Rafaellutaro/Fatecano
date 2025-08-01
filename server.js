const express = require('express');
const bodyparser = require('body-parser');
const odbc = require('odbc');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');

const os = require('os');

function getLocalIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                const ip = iface.address; // This will return the local IP address
                console.log(ip);
                return ip
                
            }
        }
    }
    return '0.0.0.0'; // Fallback if no external network found
}


app.use(bodyparser.json());
app.use(express.static('public'));


const conn = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=C:\\Users\\rafae\\Desktop\\evento\\Registro_evento\\Aluno.accdb';


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/registro.html');
});

// Registrar
app.post('/register', async (req, res) => {
    const { nome, email, celular } = req.body;

    console.log('Dados recebidos:', { nome, email, celular });

    try {
        const connection = await odbc.connect(conn);

        // verifica se o email já existe
        const result_email = await connection.query(`SELECT * FROM aluno WHERE Email = '${email}'`);

        if (result_email.length > 0) {
            await connection.close();
            return res.status(400).json({ success: false, message: 'Email já registrado' });
        }

        await connection.query(`INSERT INTO aluno (Nome, Email, Celular, Presenca) VALUES ('${nome}', '${email}', '${celular}', true)`);

        await connection.close();
        res.json({ success: true, message: 'Aluno Registrado com Sucesso.' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Erro no banco de dados', error: error.message });
    }
});

// Confirmar a presença
app.post('/confirm-presenca', async (req, res) => {
    const { id } = req.body;

    try {
        const connection = await odbc.connect(conn);

        // Verifica se o ID existe
        const idResult = await connection.query(`SELECT * FROM aluno WHERE ID = ${id}`);

        if (idResult.length > 0) {
            // Atualiza o campo Presenca para true
            await connection.query(`UPDATE aluno SET Presenca = true WHERE ID = ${id}`);
            res.json({ success: true, message: 'Presença confirmada' });
        } else {
            res.status(404).json({ success: false, message: 'ID não encontrado' });
        }

        await connection.close();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Erro ao confirmar presença', error: error.message });
    }
});

const localIp = getLocalIPAddress();
if (localIp) {
  console.log(`Local IPv4 Address: ${localIp}`);
} else {
  console.log('Could not find a local IPv4 address.');
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://${localIp}:${port}`);
});
