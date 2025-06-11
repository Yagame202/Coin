import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Aluno, Administrador } from './lib/models';
import bcrypt from 'bcrypt';

const app = express();
const router = express.Router();
app.use(bodyParser.json());

// Cadastro de aluno
const cadastrarAluno = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, turma, foto_url } = req.body;
    const aluno = await Aluno.create({ nome, email, senha, turma, foto_url });
    res.status(201).json({ id: aluno.id, nome: aluno.nome, email: aluno.email });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Login de aluno
const loginAluno = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const aluno = await Aluno.findOne({ where: { email } });
  if (!aluno) {
    res.status(401).json({ error: 'Aluno não encontrado' });
    return;
  }
  const match = await bcrypt.compare(senha, aluno.senha);
  if (!match) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }
  res.json({ id: aluno.id, nome: aluno.nome, email: aluno.email });
};

// Login de admin
const loginAdmin = async (req: Request, res: Response) => {
  const { nome_usuario, senha } = req.body;
  const admin = await Administrador.findOne({ where: { nome_usuario } });
  if (!admin) {
    res.status(401).json({ error: 'Admin não encontrado' });
    return;
  }
  const match = await bcrypt.compare(senha, admin.senha);
  if (!match) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }
  res.json({ id: admin.id, nome_usuario: admin.nome_usuario });
};

// Consulta saldo de aluno
const consultarSaldo = async (req: Request, res: Response) => {
  const aluno = await Aluno.findByPk(req.params.id);
  if (!aluno) {
    res.status(404).json({ error: 'Aluno não encontrado' });
    return;
  }
  res.json({ saldo_midiascoin: aluno.saldo_midiascoin });
};

router.post('/api/alunos', cadastrarAluno);
router.post('/api/alunos/login', loginAluno);
router.post('/api/admin/login', loginAdmin);
router.get('/api/alunos/:id/saldo', consultarSaldo);

app.use(router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 