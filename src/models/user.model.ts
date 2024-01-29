import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  BeforeCreate,
  IsEmail,
  DataType
} from "sequelize-typescript";
import { createHashWithSalt } from "../utils/Crypto";
import { v4 as uuidv4 } from 'uuid';

@Table({ paranoid: true })
class User extends Model {

  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column
  declare name: string;
  
  @IsEmail
  @Column
  declare email: string;

  @Column
  declare passwordHash: string; // Alterado para armazenar o hash da senha com sal

  @Column
  declare salt: string; // Armazenar o sal

  @AllowNull(false)
  @Column
  declare confirmed: boolean;

  
  @BeforeCreate
  static assignUuid(user: User) {
    user.id = uuidv4();
  }
  
  // Hook para criptografar a senha antes de criar o usuário
  @BeforeCreate
  static async hashPassword(user: User) {
    const hashResult = createHashWithSalt(user.passwordHash);
    user.salt = hashResult.salt;
    user.passwordHash = hashResult.passwordHash;
  }
}

export default User;