
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Coins, 
  LogOut, 
  User,
  Calendar,
  History,
  TrendingUp
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  coins: number;
  avatar?: string;
}

interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  admin: string;
}

const StudentDashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se é estudante
    if (localStorage.getItem('userType') !== 'student') {
      navigate('/');
      return;
    }

    const studentId = localStorage.getItem('studentId');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const currentStudent = students.find((s: Student) => s.id === studentId);
    
    if (currentStudent) {
      setStudent(currentStudent);
    } else {
      navigate('/');
      return;
    }

    // Carregar transações do aluno
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const studentTransactions = allTransactions.filter((t: Transaction) => t.studentId === studentId);
    setTransactions(studentTransactions.sort((a: Transaction, b: Transaction) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!student) {
    return <div>Carregando...</div>;
  }

  const recentTransactions = transactions.slice(0, 5);
  const totalEarned = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">Meu Painel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Olá, {student.name}!</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perfil do Aluno */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-xl">{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription className="text-lg">{student.class}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Saldo Atual</div>
                <Badge variant="secondary" className="text-2xl p-3">
                  <Coins className="w-6 h-6 mr-2" />
                  {student.coins}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ganho</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{totalEarned}</div>
              <p className="text-xs text-muted-foreground">Mídiacoins recebidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{totalSpent}</div>
              <p className="text-xs text-muted-foreground">Mídiacoins utilizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transações</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">Total de movimentações</p>
            </CardContent>
          </Card>
        </div>

        {/* Histórico Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Últimas Transações
            </CardTitle>
            <CardDescription>
              Suas movimentações mais recentes de Mídiacoins
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">
                          {transaction.amount > 0 ? 'Mídiacoins Recebidas' : 'Mídiacoins Utilizadas'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Por: {transaction.admin} • {new Date(transaction.date).toLocaleDateString('pt-BR')} às {new Date(transaction.date).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={transaction.amount > 0 ? 'default' : 'destructive'}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm">Suas movimentações de Mídiacoins aparecerão aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
