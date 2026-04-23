const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SEUEMAIL@gmail.com',
    pass: 'SUA_SENHA_DE_APP'
  }
});

app.post('/send-email', async (req, res) => {
  const { name, email, type, message } = req.body;

  if (!name || !email || !type || !message) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios.'
    });
  }

  try {
    await transporter.sendMail({
      from: 'SEUEMAIL@gmail.com',
      to: 'SEUEMAIL@gmail.com',
      replyTo: email,
      subject: `Novo contato do site - ${type}`,
      html: `
        <h2>Novo contato recebido</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Tipo de projeto:</strong> ${type}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'E-mail enviado com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({
      error: 'Erro interno ao enviar e-mail.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});