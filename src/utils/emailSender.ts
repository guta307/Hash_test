import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export async function validationEmail(email: string, nome: string) {
    // Configuração do transporte de e-mail
    let transporter = nodemailer.createTransport({
        service: 'Hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
    });
  
    // Configuração da mensagem
    await transporter.sendMail({
      from: process.env.EMAIL, // endereço do remetente
      to: email, // lista de destinatários
      subject: "Confirmação de Cadastro", // Assunto
      text: `Olá, ${nome}! Por favor, confirme seu cadastro clicando aqui.`, // corpo da mensagem
      html: `<b>Olá, ${nome}!</b><br>Por favor, confirme seu cadastro clicando <a href="link_de_confirmacao">aqui</a>.`, // corpo da mensagem em HTML
    });
  
  }