import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function validationEmail(email: string, nome: string) {
  // Geração da sequência de 4 números aleatórios
  const codigoConfirmacao = Math.floor(1000 + Math.random() * 9000);

  // Configuração da mensagem
  await transporter.sendMail({
    from: process.env.EMAIL, // endereço do remetente
    to: email, // lista de destinatários
    subject: "Confirmação de Cadastro", // Assunto
    text: `Olá, ${nome}! Seu código de confirmação é: ${codigoConfirmacao}`, // corpo da mensagem
    html: `<b>Olá, ${nome}!</b><br>Seu código de confirmação é: <b>${codigoConfirmacao}</b>.`, // corpo da mensagem em HTML
  });

  return codigoConfirmacao;
}

export async function changePasswordEmail(
  email: string,
  nome: string,
  id: string,
  token: string
) {
  // Configuração da mensagem
  await transporter.sendMail({
    from: process.env.EMAIL, // endereço do remetente
    to: email, // lista de destinatários
    subject: "Troca de senha", // Assunto
    text: `Olá, ${nome}! Clique aqui para recadastrar nova senha.`, // corpo da mensagem
    html: `<b>Olá, ${nome}!</b><br>Por favor, acesse esse endereço para <a href="${process.env.ROOT_ADDRESS}/user/changePassword/${id}?token=${token}">alterar sua senha</a>.`, // corpo da mensagem em HTML
  });
}
