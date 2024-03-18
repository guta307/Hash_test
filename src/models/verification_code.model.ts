import { Op } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  AllowNull,
  BeforeCreate,
  Sequelize,
} from "sequelize-typescript";

import { v4 as uuidv4 } from "uuid";

@Table({
  paranoid: true,
  scopes: {
    notExpired: {
      where: {
        expiresAt: {
          [Op.gt]: Sequelize.literal("CURRENT_TIMESTAMP"), // Usando CURRENT_TIMESTAMP para sempre obter o momento atual no banco de dados
        },
      },
    },
  },
  tableName: "verification_codes",
  timestamps: false, // Desabilita os timestamps automáticos, pois usaremos o @CreatedAt para createdAt
})
class VerificationCode extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.UUID })
  declare userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare expiresAt: Date;

  @BeforeCreate
  static assignUuid(verificationCode: VerificationCode) {
    verificationCode.id = uuidv4();
  }
}

export default VerificationCode;
