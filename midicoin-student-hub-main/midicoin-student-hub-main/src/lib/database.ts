import { Sequelize } from 'sequelize';
import { Aluno, Administrador, TransacaoMidiascoin, LogLogin } from './models';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Sincroniza o banco de dados
sequelize.sync({ force: true }).then(() => {
  console.log('Banco de dados sincronizado.');
});

export default sequelize; 