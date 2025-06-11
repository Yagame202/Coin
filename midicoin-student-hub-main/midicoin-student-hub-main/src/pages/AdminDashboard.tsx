
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Coins, 
  Plus, 
  Search, 
  LogOut, 
  Edit, 
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StudentForm from '@/components/StudentForm';
import CoinTransaction from '@/components/CoinTransaction';
import TransactionHistory from '@/components/TransactionHistory';

interface Student {
  id: string;
  name: string;
  class: string;
  username: string;
  password: string;
  coins: number;
  avatar?: string;
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCoinTransaction, setShowCoinTransaction] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se é admin
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/');
      return;
    }

    // Carregar dados do localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Dados iniciais de exemplo
      const initialStudents: Student[] = [
        {
          id: '1',
          name: 'Ana Silva',
          class: '9º A',
          username: 'ana.silva',
          password: '123456',
          coins: 150,
          avatar: ''
        },
        {
          id: '2',
          name: 'João Santos',
          class: '8º B',
          username: 'joao.santos',
          password: '123456',
          coins: 200,
          avatar: ''
        }
      ];
      setStudents(initialStudents);
      localStorage.setItem('students', JSON.stringify(initialStudents));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCoins = students.reduce((sum, student) => sum + student.coins, 0);
  const averageCoins = students.length > 0 ? Math.round(totalCoins / students.length) : 0;

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setShowStudentForm(false);
    toast({
      title: "Aluno adicionado!",
      description: `${newStudent.name} foi cadastrado com sucesso.`,
    });
  };

  const handleEditStudent = (studentData: Student) => {
    const updatedStudents = students.map(s => s.id === studentData.id ? studentData : s);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setEditingStudent(null);
    toast({
      title: "Aluno atualizado!",
      description: `Dados de ${studentData.name} foram atualizados.`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    toast({
      title: "Aluno removido!",
      description: "O aluno foi removido do sistema.",
    });
  };

  const handleCoinTransaction = (studentId: string, amount: number, type: 'add' | 'remove') => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const newCoins = type === 'add' ? student.coins + amount : Math.max(0, student.coins - amount);
        return { ...student, coins: newCoins };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    // Salvar transação no histórico
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = {
      id: Date.now().toString(),
      studentId,
      amount: type === 'add' ? amount : -amount,
      date: new Date().toISOString(),
      admin: 'Professor'
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    setShowCoinTransaction(false);
    setSelectedStudent(null);
    
    const student = students.find(s => s.id === studentId);
    toast({
      title: "Transação realizada!",
      description: `${type === 'add' ? 'Adicionadas' : 'Removidas'} ${amount} Mídiacoins ${type === 'add' ? 'para' : 'de'} ${student?.name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">Painel do Professor</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Bem-vindo, Professor!</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mídiacoins</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Aluno</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageCoins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar alunos por nome ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={() => setShowStudentForm(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Novo Aluno
          </Button>
        </div>

        {/* Lista de Alunos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.class}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {student.coins}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingStudent(student)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowCoinTransaction(true);
                    }}
                    className="flex-1"
                  >
                    <Coins className="w-3 h-3 mr-1" />
                    Coins
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Histórico de Transações */}
        <TransactionHistory />

        {/* Modais */}
        {showStudentForm && (
          <StudentForm
            onSubmit={handleAddStudent}
            onClose={() => setShowStudentForm(false)}
          />
        )}

        {editingStudent && (
          <StudentForm
            student={editingStudent}
            onSubmit={handleEditStudent}
            onClose={() => setEditingStudent(null)}
          />
        )}

        {showCoinTransaction && selectedStudent && (
          <CoinTransaction
            student={selectedStudent}
            onTransaction={handleCoinTransaction}
            onClose={() => {
              setShowCoinTransaction(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
