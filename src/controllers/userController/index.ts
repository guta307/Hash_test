import User from "../../models/user.model.js";

import { Request, Response } from "express";
import { Op } from 'sequelize';
/*import de interface*/
import { UserInterface } from "../../interface/user.js";

/*Decorators*/
import FieldValidation from "../../decorator/FieldValidation.js";

/*UTILS*/
import { validationEmail } from "../../utils/emailSender.js";

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

      await validationEmail(register.email,register.name)

      return res.status(200).json(register);
    }
    catch(e){
        return res.status(500).json(e);
    }
  }

}