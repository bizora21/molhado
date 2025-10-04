import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Database, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TesteRPC = () => {
  const [testResults, setTestResults] = useState({
    function: { status: 'pending', message: 'Verificando função...', details: null },
    insert: { status: 'pending', message: 'Testando inserção...', details: null },
    columns: { status: 'pending', message: 'Verificando colunas...', details: null }
  });

  const [testData, setTestData] = useState({
    userId: '00000000-0000-0000-0000-000000000000',
    fullName: 'Test User RPC',
    phone: '+258841234567',
    address: 'Test Address RPC'
  });

  const checkFunction = async () => {
    setTestResults(prev => ({ ...prev, function: { status: 'testing', message: 'Verificando função RPC...', details: null } }));
    
    try {
      // Verificar se a função existe
      const { data, error } = await supabase
        .rpc('create_profile', {
          p_user_id: testData.userId,
          p_full_name: testData.fullName,
          p_phone: testData.phone,
          p_address: testData.address,
          p_user_type: 'cliente',
          p_role: 'cliente'
        });

      if (error) {
        setTestResults(prev => ({
          ...prev,
          function: { status: 'error', message: `Erro: ${error.message}`, details: error }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          function: { status: 'success', message: 'Função RPC verificada', details: data }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        function: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const checkColumns = async () => {
    setTestResults(prev => ({ ...prev, columns: { status: 'testing', message: 'Verificando colunas...', details: null } }));
    
    try {
      // Verificar as colunas da tabela profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (error) {
        setTestResults(prev => ({
          ...prev,
          columns: { status: 'error', message: `Erro: ${error.message}`, details: error }
        }));
      } else {
        // Extrair nomes das colunas do primeiro resultado
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        setTestResults(prev => ({
          ...prev,
          columns: { status: 'success', message: 'Colunas verificadas', details: columns }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        columns: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const testInsert = async () => {
    setTestResults(prev => ({ ...prev, insert: { status: 'testing', message: 'Testando inserção via RPC...', details: null } }));
    
    try {
      // Gerar um UUID de teste
      const testUserId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .rpc('create_profile', {
          p_user_id: testUserId,
          p_full_name: testData.fullName,
          p_phone: testData.phone,
          p_address: testData.address,
          p_user_type: 'cliente',
          p_role: 'cliente'
        });

      if (error) {
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'error', message: `Erro: ${error.message}`, details: error }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'success', message: 'Inserção via RPC funcionou!', details: data }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        insert: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const runAllTests = async () => {
    console.log("🚀 Iniciando testes de RPC...");
    await checkColumns();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await checkFunction();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testInsert();
    console.log("🏁 Testes de RPC concluídos!");
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
        return <Badge className="bg-green-100 text-green-800">✅ OK</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">❌ Erro</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">🔄 Testando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">⏳ Aguardando</Badge>;
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 Teste de Função RPC</h1>
            <p className="text-gray-600">Verificação da função create_profile para contornar RLS</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Colunas da Tabela
                  </CardTitle>
                  {getStatusBadge(testResults.columns.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.columns.message}</p>
                {testResults.columns.details && Array.isArray(testResults.columns.details) && (
                  <div className="text-xs bg-gray-100 p-2 rounded">
                    <p className="font-medium mb-1">Colunas encontradas:</p>
                    {testResults.columns.details.map((col, index) => (
                      <div key={index} className="text-gray-700">• {col}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Função RPC
                  </CardTitle>
                  {getStatusBadge(testResults.function.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.function.message}</p>
                {testResults.function.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.function.details?.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Inserção via RPC
                  </CardTitle>
                  {getStatusBadge(testResults.insert.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.insert.message}</p>
                {testResults.insert.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.insert.details?.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🎮 Controles de Teste</CardTitle>
              <CardDescription>
                Execute os testes individualmente ou todos de uma vez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button onClick={checkColumns} disabled={testResults.columns.status === 'testing'}>
                  {getStatusIcon(testResults.columns.status)}
                  Verificar Colunas
                </Button>
                <Button onClick={checkFunction} disabled={testResults.function.status === 'testing'}>
                  {getStatusIcon(testResults.function.status)}
                  Testar Função
                </Button>
                <Button onClick={testInsert} disabled={testResults.insert.status === 'testing'}>
                  {getStatusIcon(testResults.insert.status)}
                  Testar Inserção
                </Button>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={runAllTests}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={Object.values(testResults).some(r => r.status === 'testing')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Todos os Testes
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Abra o console do navegador (F12) para ver logs detalhados durante os testes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesteRPC;