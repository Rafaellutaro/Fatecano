const odbc = require('odbc');
const twilio = require('twilio');

// Cant use unless with a paid subscription, i figured this out too late :(

const accountSid = 'Your twilio account id';
const authToken = 'Your twilio authToken';

const client = twilio(accountSid, authToken);

const conn = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=C:\\Users\\rafae\\Desktop\\Registro_evento\\Aluno.accdb;';

async function creatingMessage(student) {
    try {
        const message = await client.messages.create({
            from: 'your twilio number', // Twilio WhatsApp Sandbox number
            to: `whatsapp:${student.Celular}`, // Student's WhatsApp number (with country code)
            body: `Olá *${student.Nome}*,\n\n` +
                  `O seu *código de estudante* é: *${student.ID}*. ` +
                  `Por favor, guarde esse código com cuidado, pois ele será necessário para confirmar a sua presença no evento.\n\n` +
                  `Recomendamos que você anote o código em algum lugar seguro no seu celular ou, caso não tenha um celular, escreva-o em uma folha de papel para não esquecê-lo.\n\n` +
                  `Atenciosamente,\n` +
                  `*Fatec de Itaquaquecetuba*\n` +
                  `Gestão do evento "Fatecano por um dia"`
        });

        console.log(`WhatsApp message sent to ${student.Celular}: ${message.sid}`);
    } catch (error) {
        console.error(`Failed to send message to ${student.Celular}:`, error);
    }
}

async function sendingMessage() {
    const connection = await odbc.connect(conn);
    const result = await connection.query('SELECT * FROM aluno');

    // Sending messages concurrently
    await Promise.all(result.map(student => creatingMessage(student)));
    
    await connection.close(); // Close the connection when done
}

sendingMessage();
