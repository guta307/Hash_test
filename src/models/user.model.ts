import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BeforeCreate,
  IsEmail
} from "sequelize-typescript";
import createHashWithSalt from "../utils/Crypto";

@Table({ paranoid: true })
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

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

  // Hook para criptografar a senha antes de criar o usuário
  @BeforeCreate
  static async hashPassword(user: User) {
    const hashResult = createHashWithSalt(user.passwordHash);
    user.salt = hashResult.salt;
    user.passwordHash = hashResult.passwordHash;
  }
}

export default User;