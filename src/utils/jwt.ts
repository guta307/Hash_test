import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
export function generateOneTimeToken(){
 
  // Gere um UUID único como jti
  const jti = uuidv4();

  // Payload do token
  const payload = {
      sub: process.env.SECRET_PASSWORD,  // Assunto (normalmente o ID do usuário)
      jti: jti,     // UUID único como jti
      exp: Math.floor(Date.now() / 1000) + 3600, // Tempo de expiração (1 hora a partir de agora)
  };

  // Crie o token JWT usando a chave secreta
  const token = jwt.sign(payload, process.env.SECRET_PASSWORD);

  return token;
   
}

export function validateToken(token:string) {
    try {
        // Verifique o token usando a chave secreta
        jwt.verify(token, process.env.SECRET_PASSWORD);

        return true; 
    }
     catch (error) {
        // Se houver algum erro na verificação, o token é inválido
        console.error('Erro ao validar o token:', error);
        return false; // Token inválido
    }
}
