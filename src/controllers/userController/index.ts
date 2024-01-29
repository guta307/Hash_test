import User from "../../models/user.model.js";

import { Request, Response } from "express";
import { Op } from 'sequelize';
/*import de interface*/
import { UserInterface } from "../../interface/user.js";

/*Decorators*/
import FieldValidation from "../../decorator/FieldValidation.js";

/*UTILS*/
import { validationEmail } from "../../utils/emailSender.js";
import { generateOneTimeToken, validateToken } from "../../utils/jwt.js";

export class UserController {

  
  @FieldValidation<UserInterface>({
    name: "",
    email: "",
    passwordHash: "",
  })

  static async create(req: Request, res: Response): Promise<Response> {
    try{
      const newRegister = req.body;

      const list = await User.findOne({   where: {
        [Op.or]: [
            { email: newRegister.email },
            { name: newRegister.name }
        ]
    } });

      if(list){
        return res.status(400).json({error:'cadastro existente'});
      }
      const register = new User({...newRegister,confirmed:false});
      await register.save();

      const token = generateOneTimeToken()
      await validationEmail(register.email,register.name,register.id,token)

      return res.status(200).json(register);
    }
    catch(e){
        return res.status(500).json(e);
    }
  }
  
  static async validate(req:Request,res:Response): Promise<void> {
      try{
        const {token} = req.query; // Obtém o token da consulta da URL

      // Valide o token
      const ValidToken = validateToken(token as string);

      if (!ValidToken) {
        // Token válido, faça o que for necessário aqui
        return res.status(401).redirect('https://www.youtube.com/');
    }
        const { id } = req.params;
        await User.update({confirmed:true}, { where: { id } });
        return res.redirect('https://www.google.com/');
      }
      catch(e){
        res.status(500).json({ error: 'Ocorreu um erro' });
      }
    }
  }
  
