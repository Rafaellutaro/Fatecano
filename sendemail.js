const odbc = require('odbc');
const nodemailer = require('nodemailer');

// Access Database connection string
const conn = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=C:\\Users\\rafae\\Desktop\\evento\\Registro_evento\\Aluno.accdb';

// Create the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: '', // your clown email to send the message 
    pass: '', // your email secure password, it cant be the password you use to login, it needs to be a secure password
  },
});

// Function to send email, the difference from this to the one in test.js, is that this one just sends the email and it doesn't create the certificate and send it.
async function sendEmail(student, retries = 3) {
  const mailOptions = {
    from: '"Evento Fatecano por um dia" <FatecItaquaEvento@gmail.com>',
    to: student.Email,
    subject: 'Id de estudante',
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Olá <strong>${student.Nome}</strong>,</p>
    <p>
      O seu <strong>código de estudante</strong> é: 
      <span style="font-size: 1.2em; color: #007BFF;"><strong>${student.ID}</strong></span>. 
      Por favor, guarde esse código com cuidado, pois ele será necessário para confirmar a sua presença no evento.
    </p>
    <p>
      Recomendamos que você anote o código em algum lugar seguro no seu celular ou, caso não tenha um celular, escreva-o em uma folha de papel para não esquecê-lo.
    </p>
    <p>Atenciosamente,</p>
    <p style="margin-top: 20px;">
      <strong>Fatec de Itaquaquecetuba</strong>
      <br />
      Gestão do evento "Fatecano por um dia"
    </p>
  </div>
`,
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

// Function to query students from Access and send emails
async function sendEmailsToAllStudents() {
    const connection = await odbc.connect(conn)
  try {
    const result = await connection.query('SELECT ID, Nome, Email FROM aluno'); 

    for (const student of result) {
      await sendEmail(student); 
      await new Promise(resolve => setTimeout(resolve, 4000)); 
    }

    await connection.close();
  } catch (error) {
    console.error('Error fetching students or sending emails:', error);
  }
}

// Call the function to send emails
sendEmailsToAllStudents();
