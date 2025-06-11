import Aluno from './Aluno';
import Administrador from './Administrador';
import TransacaoMidiascoin from './TransacaoMidiascoin';
import LogLogin from './LogLogin';

// Associações
Aluno.hasMany(TransacaoMidiascoin, { foreignKey: 'aluno_id' });
TransacaoMidiascoin.belongsTo(Aluno, { foreignKey: 'aluno_id' });

export { Aluno, Administrador, TransacaoMidiascoin, LogLogin }; 