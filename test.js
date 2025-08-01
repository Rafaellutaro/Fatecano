// this will create a pdf file with the certificate and send to the user through email.

const { gerarCertificado } = require('./certificado');
const odbc = require('odbc');
const nodemailer = require('nodemailer');

const conn = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=C:\\Users\\rafae\\Desktop\\evento\\Registro_evento\\Aluno.accdb';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: '', // your clown email to send the message 
      pass: '', // your email secure password, it cant be the password you use to login, it needs to be a secure password
    },
  });

// change the below message to whatever shit you want it to be
async function sendCertificate(student, certificatePath, retries = 3){
    const mailOptions = {
        from: '"Evento Fatecano por um dia" <FatecItaquaEvento@gmail.com>',
        to: student.Email,
        subject: 'Certificado de participação no evento fatecano por um dia',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Olá <strong>${student.Nome}</strong>,</p>
            <p>Muito obrigado por ter participado do evento <strong>"Fatecano por um Dia"</strong>. Esperamos que tenha sido uma experiência enriquecedora para você!</p>
            <p>Em anexo, você encontrará o seu certificado de participação. Basta baixá-lo e ele será todo seu.</p>
            <p>Atenciosamente,</p>
            <p style="margin-top: 20px;">
                <strong>Fatec de Itaquaquecetuba</strong><br />
                Gestão do evento "Fatecano por um Dia"
            </p>
        </div>`,
        attachments: [
            {
                filename: `certificado-${student.Nome}-${student.ID}.pdf`, // Set the filename for the attachment
                path: certificatePath, // Path to the generated PDF
            },
        ],
    };
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${student.Email}: ${info.response}`);
        return;
      } catch (error) {
        console.log(`Error sending to ${student.Email}, attempt ${attempt}: `, error.message);
        if (attempt < retries) {
          console.log(`Retrying in 5 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        } else {
          console.log(`Failed to send email to ${student.Email} after ${retries} attempts.`);
        }
      }
    }
  }
  


// Função para testar a geração do certificado
(async () => {
    try {
        const connection = await odbc.connect(conn);
        const result = await connection.query("SELECT ID, Nome, Email FROM aluno");

        for (const student of result) {
            //if (student.Presenca == true){
              const caminho = await gerarCertificado(student.Nome, student.ID); // Call with name and ID
              console.log(`Certificado gerado em: ${caminho}`);

              await sendCertificate(student, caminho);
              await new Promise(resolve => setTimeout(resolve, 4000));
            //} else{
              //console.log(`Aluno: ${student.Nome} não está presente`)
            //}
        };  

        await connection.close();
    } catch (error) {
        console.error('Erro ao gerar certificados:', error);
    }
})();
