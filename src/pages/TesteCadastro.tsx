import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, User, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const TesteCadastro = () => {
  const [testResults, setTestResults] = useState({
    connection: { status: 'pending', message: '', data: null },
    auth: { status: 'pending', message: '', data: null },
    profile: { status: 'pending', message: '', data: null },
    database: { status: 'pending', message: '', data: null }
  });

  const [testData, setTestData] = useState({
    email: `test-${Date.now()}@example.com`,
    password: 'Teste123456',
    fullName: 'Test User',
    phone: '+258841234567'
  });

  const testConnection = async () => {
    setTestResults(prev => ({ ...prev, connection: { status: 'testing', message: 'Testando conexão com Supabase...', data: null } }));
    
    try {
      console.log("Testando conexão com Supabase...");
      console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Presente" : "Ausente");
      
      // Teste básico de conexão
      const { data, error } = await supabase.from('profiles').select('count').single();
      
      if (error) {
        console.error("Erro na conexão:", error);
        setTestResults(prev => ({ 
          ...prev, 
          connection: { status: 'error', message: `Erro: ${error.message}`, data: error } 
        }));
      } else {
        console.log("Conexão bem-sucedida:", data);
        setTestResults(prev => ({ 
          ...prev, 
          connection: { status: 'success', message: 'Conexão OK', data: data } 
        }));
      }
    } catch (error) {
      console.error("Erro geral na conexão:", error);
      setTestResults(prev => ({ 
        ...prev, 
        connection: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const testAuth = async () => {
    setTestResults(prev => ({ ...prev, auth: { status: 'testing', message: 'Testando autenticação...', data: null } }));
    
    try {
      console.log("Testando autenticação com email:", testData.email);
      
      // 1. Tentar registrar usuário
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testData.email,
        password: testData.password,
        options: {
          data: {
            full_name: testData.fullName,
            phone: testData.phone
          }
        }
      });

      if (signUpError) {
        console.error("Erro no signUp:", signUpError);
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'error', message: `Erro no signUp: ${signUpError.message}`, data: signUpError } 
        }));
        return;
      }

      console.log("SignUp bem-sucedido:", signUpData);

      // 2. Tentar fazer login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testData.email,
        password: testData.password
      });

      if (signInError) {
        console.error("Erro no signIn:", signInError);
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'error', message: `Erro no signIn: ${signInError.message}`, data: signInError } 
        }));
        return;
      }

      console.log("SignIn bem-sucedido:", signInData);
      
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'success', message: 'Autenticação OK', data: signInData } 
      }));

    } catch (error) {
      console.error("Erro geral na autenticação:", error);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const testProfile = async () => {
    setTestResults(prev => ({ ...prev, profile: { status: 'testing', message: 'Testando criação de perfil...', data: null } }));
    
    try {
      // Primeiro, fazer login para obter o usuário
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testData.email,
        password: testData.password
      });

      if (signInError || !signInData.user) {
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'error', message: 'Usuário não autenticado', data: null } 
        }));
        return;
      }

      console.log("Testando criação de perfil para usuário:", signInData.user.id);

      // Criar perfil
      const profileData = {
        user_id: signInData.user.id,
        full_name: testData.fullName,
        phone: testData.phone,
        user_type: 'cliente',
        role: 'cliente',
        email_confirmed_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();

      if (error) {
        console.error("Erro na criação do perfil:", error);
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'error', message: `Erro: ${error.message}`, data: error } 
        }));
      } else {
        console.log("Perfil criado com sucesso:", data);
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'success', message: 'Perfil criado com sucesso', data: data } 
        }));
      }

    } catch (error) {
      console.error("Erro geral na criação do perfil:", error);
      setTestResults(prev => ({ 
        ...prev, 
        profile: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const testDatabase = async () => {
    setTestResults(prev => ({ ...prev, database: { status: 'testing', message: 'Testando operações no banco...', data: null } }));
    
    try {
      // Testar leitura
      const { data: readData, error: readError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (readError) {
        setTestResults(prev => ({ 
          ...prev, 
          database: { status: 'error', message: `Erro na leitura: ${readError.message}`, data: readError } 
        }));
        return;
      }

      console.log("Leitura OK:", readData);

      // Testar se a tabela existe e tem estrutura correta
      const { data: tableInfo, error: tableError } = await supabase
        .from('profiles')
        .select('user_id, full_name, user_type')
        .limit(1);

      if (tableError) {
        setTestResults(prev => ({ 
          ...prev, 
          database: { status: 'error', message: `Erro na estrutura: ${tableError.message}`, data: tableError } 
        }));
      } else {
        console.log("Estrutura OK:", tableInfo);
        setTestResults(prev => ({ 
          ...prev, 
          database: { status: 'success', message: 'Banco de dados OK', data: readData } 
        }));
      }

    } catch (error) {
      console.error("Erro geral no banco de dados:", error);
      setTestResults(prev => ({ 
        ...prev, 
        database: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const runAllTests = async () => {
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDatabase();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testAuth();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testProfile();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">Testando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Teste de Sistema de Cadastro</h1>
            <p className="text-gray-600">Diagnóstico completo do sistema de autenticação e banco de dados</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Dados de Teste
                </CardTitle>
                <CardDescription>
                  Configure os dados para teste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testEmail">Email</Label>
                  <Input
                    id="testEmail"
                    value={testData.email}
                    onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="testPassword">Senha</Label>
                  <Input
                    id="testPassword"
                    type="password"
                    value={testData.password}
                    onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="testName">Nome</Label>
                  <Input
                    id="testName"
                    value={testData.fullName}
                    onChange={(e) => setTestData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="testPhone">Telefone</Label>
                  <Input
                    id="testPhone"
                    value={testData.phone}
                    onChange={(e) => setTestData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Testes Disponíveis
                </CardTitle>
                <CardDescription>
                  Execute os testes individualmente ou todos de uma vez
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={testConnection}
                  className="w-full justify-start"
                  disabled={testResults.connection.status === 'testing'}
                >
                  {getStatusIcon(testResults.connection.status)}
                  Testar Conexão
                </Button>
                <Button 
                  onClick={testDatabase}
                  className="w-full justify-start"
                  disabled={testResults.database.status === 'testing'}
                >
                  {getStatusIcon(testResults.database.status)}
                  Testar Banco de Dados
                </Button>
                <Button 
                  onClick={testAuth}
                  className="w-full justify-start"
                  disabled={testResults.auth.status === 'testing'}
                >
                  {getStatusIcon(testResults.auth.status)}
                  Testar Autenticação
                </Button>
                <Button 
                  onClick={testProfile}
                  className="w-full justify-start"
                  disabled={testResults.profile.status === 'testing'}
                >
                  {getStatusIcon(testResults.profile.status)}
                  Testar Criação de Perfil
                </Button>
                <Button 
                  onClick={runAllTests}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={Object.values(testResults).some(r => r.status === 'testing')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Todos os Testes
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes</CardTitle>
              <CardDescription>
                Status detalhado de cada componente do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(testResults.connection.status)}
                      <h3 className="font-semibold">Conexão com Supabase</h3>
                      {getStatusBadge(testResults.connection.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{testResults.connection.message}</p>
                    {testResults.connection.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.connection.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(testResults.database.status)}
                      <h3 className="font-semibold">Banco de Dados</h3>
                      {getStatusBadge(testResults.database.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{testResults.database.message}</p>
                    {testResults.database.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.database.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(testResults.auth.status)}
                      <h3 className="font-semibold">Autenticação</h3>
                      {getStatusBadge(testResults.auth.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{testResults.auth.message}</p>
                    {testResults.auth.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.auth.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(testResults.profile.status)}
                      <h3 className="font-semibold">Criação de Perfil</h3>
                      {getStatusBadge(testResults.profile.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{testResults.profile.message}</p>
                    {testResults.profile.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.profile.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TesteCadastro;