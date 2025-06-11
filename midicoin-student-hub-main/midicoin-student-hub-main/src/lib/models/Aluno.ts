import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import bcrypt from 'bcrypt';

class Aluno extends Model {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public turma!: string;
  public foto_url!: string;
  public saldo_midiascoin!: number;
  public data_criacao!: Date;
}

Aluno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    turma: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saldo_midiascoin: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Aluno',
    hooks: {
      beforeCreate: async (aluno: Aluno) => {
        if (aluno.senha) {
          aluno.senha = await bcrypt.hash(aluno.senha, 10);
        }
      },
    },
  }
);

export default Aluno; 