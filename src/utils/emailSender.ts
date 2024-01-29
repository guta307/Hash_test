import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'Hotmail',
auth: {
  user: process.env.EMAIL,
  pass: process.env.EMAIL_PASSWORD
},
});

export async function validationEmail(email: string, nome: string,id:string,token:string) {

    // Configuração da mensagem
    await transporter.sendMail({
      from: process.env.EMAIL, // endereço do remetente
      to: email, // lista de destinatários
      subject: "Confirmação de Cadastro", // Assunto
      text: `Olá, ${nome}! Por favor, confirme seu cadastro clicando aqui.`, // corpo da mensagem
      html: `<b>Olá, ${nome}!</b><br>Por favor, confirme seu cadastro clicando <a href="${process.env.ROOT_ADDRESS}/user/validate/${id}?token=${token}">aqui</a>.`, // corpo da mensagem em HTML
    });
  
  }

  export async function changePasswordEmail(email: string, nome: string,id:string,token:string) {

    // Configuração da mensagem
    await transporter.sendMail({
      from: process.env.EMAIL, // endereço do remetente
      to: email, // lista de destinatários
      subject: "Troca de senha", // Assunto
      text: `Olá, ${nome}! Clique aqui para recadastrar nova senha.`, // corpo da mensagem
      html: `<b>Olá, ${nome}!</b><br>Por favor, acesse esse endereço para <a href="${process.env.ROOT_ADDRESS}/user/changePassword/${id}?token=${token}">alterar sua senha</a>.`, // corpo da mensagem em HTML
    });
  
  }