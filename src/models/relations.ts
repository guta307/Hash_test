import Person from "./user.model.js";
import VerificationCode from "./verification_code.model.js";

export function setupRelations() {
  VerificationCode.belongsTo(Person, { foreignKey: "userId" });
  Person.hasMany(VerificationCode, { foreignKey: "userId" });
}
