
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Coins } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  coins: number;
}

interface CoinTransactionProps {
  student: Student;
  onTransaction: (studentId: string, amount: number, type: 'add' | 'remove') => void;
  onClose: () => void;
}

const CoinTransaction = ({ student, onTransaction, onClose }: CoinTransactionProps) => {
  const [amount, setAmount] = useState(1);

  const handleTransaction = (type: 'add' | 'remove') => {
    if (amount > 0) {
      onTransaction(student.id, amount, type);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Gerenciar Mídiacoins
          </DialogTitle>
          <DialogDescription>
            Adicionar ou remover Mídiacoins de {student.name} ({student.class})
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm text-muted-foreground">Saldo Atual</p>
          <p className="text-2xl font-bold">{student.coins} Mídiacoins</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Quantidade</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            />
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </TabsTrigger>
              <TabsTrigger value="remove" className="flex items-center gap-2">
                <Minus className="w-4 h-4" />
                Remover
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div className="text-center p-4 border rounded-lg bg-green-50">
                <p className="text-sm text-muted-foreground">Novo saldo será:</p>
                <p className="text-xl font-bold text-green-600">
                  {student.coins + amount} Mídiacoins
                </p>
              </div>
              <Button 
                onClick={() => handleTransaction('add')} 
                className="w-full"
                disabled={amount <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar {amount} Mídiacoins
              </Button>
            </TabsContent>

            <TabsContent value="remove" className="space-y-4">
              <div className="text-center p-4 border rounded-lg bg-red-50">
                <p className="text-sm text-muted-foreground">Novo saldo será:</p>
                <p className="text-xl font-bold text-red-600">
                  {Math.max(0, student.coins - amount)} Mídiacoins
                </p>
                {student.coins - amount < 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Saldo não pode ser negativo
                  </p>
                )}
              </div>
              <Button 
                onClick={() => handleTransaction('remove')} 
                variant="destructive" 
                className="w-full"
                disabled={amount <= 0 || amount > student.coins}
              >
                <Minus className="w-4 h-4 mr-2" />
                Remover {amount} Mídiacoins
              </Button>
            </TabsContent>
          </Tabs>

          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinTransaction;
