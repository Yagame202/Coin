import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import Aluno from './Aluno';

class TransacaoMidiascoin extends Model {
  public id!: number;
  public aluno_id!: number;
  public quantidade!: number;
  public tipo!: string;
  public data_hora!: Date;
  public responsavel!: string;
}

TransacaoMidiascoin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aluno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Aluno,
        key: 'id',
      },
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    responsavel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TransacaoMidiascoin',
  }
);

export default TransacaoMidiascoin; 