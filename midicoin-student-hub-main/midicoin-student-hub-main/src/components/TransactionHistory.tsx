
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search, Calendar, User, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  admin: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    
    setTransactions(savedTransactions.sort((a: Transaction, b: Transaction) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setStudents(savedStudents);
  }, []);

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Aluno não encontrado';
  };

  const handleClearHistory = () => {
    localStorage.setItem('transactions', '[]');
    setTransactions([]);
    toast({
      title: "Histórico limpo!",
      description: "Todas as transações foram removidas do histórico.",
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const studentName = getStudentName(transaction.studentId).toLowerCase();
    return studentName.includes(searchTerm.toLowerCase()) ||
           transaction.admin.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Transações
            </CardTitle>
            <CardDescription>
              Todas as movimentações de Mídiacoins realizadas no sistema
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
            disabled={transactions.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por aluno ou administrador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {getStudentName(transaction.studentId)}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(transaction.date).toLocaleDateString('pt-BR')} às {new Date(transaction.date).toLocaleTimeString('pt-BR')}
                      <span className="mx-2">•</span>
                      Por: {transaction.admin}
                    </p>
                  </div>
                </div>
                <Badge variant={transaction.amount > 0 ? 'default' : 'destructive'} className="text-sm">
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} MC
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm">
              {searchTerm ? 'Tente alterar os termos de busca' : 'As transações de Mídiacoins aparecerão aqui'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
