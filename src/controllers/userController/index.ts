import User from "../../models/user.model.js";
import VerificationCode from "../../models/verification_code.model.js";
import { Request, Response } from "express";
/*import de interface*/
import { UserInterface } from "../../interface/user.js";
import { validationCodeInterface } from "../../interface/validation_code.js";
/*Decorators*/
import FieldValidation from "../../decorator/FieldValidation.js";

/*UTILS*/
import {
  changePasswordEmail,
  validationEmail,
} from "../../utils/emailSender.js";
import { SignedToken, generateOneTimeToken } from "../../utils/jwt.js";
import { Authentication } from "../../utils/Crypto.js";

export class UserController {
  @FieldValidation<UserInterface>({
    name: "",
    email: "",
    passwordHash: "",
  })
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const newRegister = req.body;

      const list = await User.findOne({ where: { email: newRegister.email } });

      if (list) {
        return res.status(400).json({ error: "email in use" });
      }
      const register = new User({ ...newRegister, confirmed: false });

      await register.save();

      const code = await validationEmail(register.email, register.name);

      const codeRegister = new VerificationCode({
        userId: register.userId,
        code,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      });

      codeRegister.save();

      return res.status(200).json(register);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  @FieldValidation<validationCodeInterface>({
    code: "",
  })
  static async validate(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body; // Obtém o token da consulta da URL
      const register = await VerificationCode.scope("notExpired").findOne({
        where: {
          code,
        },
      });

      if (register) {
        await User.update(
          { confirmed: true },
          { where: { userId: register.userId } }
        );
        await register.destroy();
        res.status(200).json({ msg: "account activated" });
      } else {
        res.status(401).json({ msg: "no code found" });
      }
    } catch (e) {
      res.status(500).json({ e });
    }
  }

  @FieldValidation<UserInterface>({
    email: "",
    passwordHash: "",
  })
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const access = req.body;
      const register = await User.findOne({ where: { email: access.email } });

      if (register) {
        if (register.confirmed) {
          const result = Authentication(
            access.passwordHash,
            register.salt,
            register.passwordHash
          );
          if (result) {
            const token = SignedToken(register.userId);
            return res.status(200).json({ name: register.name, token });
          }
          return res.status(401).json({ error: "Incorrect password" });
        }
        return res.status(401).json({ error: "Account not verified" });
      }

      return res.status(401).json({ error: "Email not found" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e as string });
    }
  }

  static async requestChangePassword(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const access = req.body;
      const register = await User.findOne({ where: { email: access.email } });

      if (register) {
        const token = generateOneTimeToken();
        changePasswordEmail(register.email, register.name, register.id, token);
        return res.status(200).json({ msg: "invalid Email" });
      }

      return res.status(401).json({ error: "no account found" });
    } catch (e) {
      return res.status(500).json({ error: e as string });
    }
  }

  @FieldValidation<UserInterface>({
    email: "",
    passwordHash: "",
  })
  static async ChangePassword(req: Request, res: Response): Promise<Response> {
    try {
      const register = req.body;
      const user = await User.findOne({ where: { email: register.email } });
      if (user) {
        user.passwordHash = register.passwordHash;
        await user.save();
        return res.status(200).json({ msg: "success" });
      }

      return res.status(401).json({ error: "no account found" });
    } catch (e) {
      return res.status(500).json({ error: e as string });
    }
  }
}
