import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [studentCredentials, setStudentCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCredentials.username === 'Professor' && adminCredentials.password === '302808') {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('username', 'Professor');
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo, Professor!",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais de administrador inválidas.",
        variant: "destructive",
      });
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login de aluno - será substituído pela integração Supabase
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find((s: any) => s.username === studentCredentials.username && s.password === studentCredentials.password);
    
    if (student) {
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentId', student.id);
      localStorage.setItem('username', student.name);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${student.name}!`,
      });
      navigate('/student');
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais de aluno inválidas.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Mídia Escola
          </h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Mídiacoins</p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Aluno
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Professor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Login do Aluno</CardTitle>
                <CardDescription>
                  Entre com suas credenciais de aluno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="student-username">Usuário</Label>
                    <Input
                      id="student-username"
                      type="text"
                      value={studentCredentials.username}
                      onChange={(e) => setStudentCredentials(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Usuário"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-password">Senha</Label>
                    <Input
                      id="student-password"
                      type="password"
                      value={studentCredentials.password}
                      onChange={(e) => setStudentCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Senha"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Login do Professor</CardTitle>
                <CardDescription>
                  Acesso administrativo ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-username">Usuário</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Usuário"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Senha"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar como Professor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
