import { Request, Response } from "express";

function FieldValidation<T>(inputObject: T) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response) {
      try {
        const inputData = req.body; // Obtenha os dados do corpo da solicitação como T

        // Obtenha as chaves do objeto exemplo
        const requiredFields: (keyof T)[] = Object.keys(
          inputObject
        ) as (keyof T)[];

        // Verifique se todas as propriedades obrigatórias estão presentes no objeto
        const missingProperties: string[] = [];

        for (const key of requiredFields) {
          if (!(key in inputData)) {
            missingProperties.push(key as string);
          }
        }

        // Lança um erro se faltarem propriedades
        if (missingProperties.length > 0) {
          throw new Error(
            `Faltam propriedades obrigatórias: ${missingProperties.join(", ")}`
          );
        }

        return originalMethod.apply(this, [req, res]);
      } catch (e) {
        if (e instanceof Error) {
          // Se for uma instância de Error, retorne a mensagem de erro
          return res.status(422).json({ error: e.message });
        } else {
          // Para outros tipos de erros, retorne uma mensagem genérica
          return res.status(500).json({ error: "An unknown error occurred" });
        }
      }
    };
  };
}

export default FieldValidation;
