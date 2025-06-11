import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import bcrypt from 'bcrypt';

class Administrador extends Model {
  public id!: number;
  public nome_usuario!: string;
  public senha!: string;
}

Administrador.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Administrador',
    hooks: {
      beforeCreate: async (admin: Administrador) => {
        if (admin.senha) {
          admin.senha = await bcrypt.hash(admin.senha, 10);
        }
      },
    },
  }
);

export default Administrador; 