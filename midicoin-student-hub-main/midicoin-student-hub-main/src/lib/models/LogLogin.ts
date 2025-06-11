import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class LogLogin extends Model {
  public id!: number;
  public usuario_id!: number;
  public tipo_usuario!: string;
  public data_hora!: Date;
  public sucesso!: boolean;
}

LogLogin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sucesso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'LogLogin',
  }
);

export default LogLogin; 