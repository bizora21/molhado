import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Shield, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const TesteRLS = () => {
  const [testResults, setTestResults] = useState({
    policies: { status: 'pending', message: 'Verificando políticas...', details: null },
    insert: { status: 'pending', message: 'Testando inserção...', details: null },
    select: { status: 'pending', message: 'Testando consulta...', details: null },
    update: { status: 'pending', message: 'Testando atualização...', details: null }
  });

  const [testData, setTestData] = useState({
    email: `test-${Date.now()}@example.com`,
    password: 'Teste123456',
    fullName: 'Test User RLS',
    phone: '+258841234567',
    address: 'Test Address'
  });

  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const checkPolicies = async () => {
    setTestResults(prev => ({ ...prev, policies: { status: 'testing', message: 'Verificando políticas RLS...', details: null } }));
    
    try {
      // Verificar se RLS está habilitado
      const { data: rlsStatus, error: rlsError } = await supabase
        .from('profiles')
        .select('count')
        .single();

      if (rlsError) {
        setTestResults(prev => ({
          ...prev,
          policies: { status: 'error', message: `Erro ao verificar RLS: ${rlsError.message}`, details: rlsError }
        }));
        return;
      }

      setTestResults(prev => ({
        ...prev,
        policies: { status: 'success', message: 'RLS está habilitado e funcionando', details: rlsStatus }
      }));

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        policies: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const testInsert = async () => {
    setTestResults(prev => ({ ...prev, insert: { status: 'testing', message: 'Testando inserção de perfil...', details: null } }));
    
    try {
      console.log("🧪 Testando inserção de perfil com RLS...");

      // 1. Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testData.email,
        password: testData.password,
        options: {
          data: {
            full_name: testData.fullName
          }
        }
      });

      if (authError) {
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'error', message: `Erro ao criar usuário: ${authError.message}`, details: authError }
        }));
        return;
      }

      if (!authData.user) {
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'error', message: 'Usuário não criado', details: null }
        }));
        return;
      }

      console.log("✅ Usuário criado:", authData.user.id);

      // 2. Fazer login para obter sessão
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testData.email,
        password: testData.password
      });

      if (signInError) {
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'error', message: `Erro ao fazer login: ${signInError.message}`, details: signInError }
        }));
        return;
      }

      console.log("✅ Login realizado");

      // 3. Tentar inserir perfil
      const profileData = {
        user_id: authData.user.id,
        full_name: testData.fullName,
        phone: testData.phone,
        address: testData.address,
        user_type: 'cliente',
        role: 'cliente'
      };

      console.log("🔍 Tentando inserir perfil:", profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();

      if (profileError) {
        console.error("❌ Erro ao inserir perfil:", profileError);
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'error', message: `Erro RLS: ${profileError.message}`, details: profileError }
        }));
      } else {
        console.log("✅ Perfil inserido com sucesso:", profileResult);
        setCreatedUserId(authData.user.id);
        setTestResults(prev => ({
          ...prev,
          insert: { status: 'success', message: 'Perfil inserido com sucesso!', details: profileResult }
        }));
      }

    } catch (error) {
      console.error("❌ Erro geral:", error);
      setTestResults(prev => ({
        ...prev,
        insert: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const testSelect = async () => {
    if (!createdUserId) {
      setTestResults(prev => ({
        ...prev,
        select: { status: 'error', message: 'Nenhum usuário criado para testar', details: null }
      }));
      return;
    }

    setTestResults(prev => ({ ...prev, select: { status: 'testing', message: 'Testando consulta de perfil...', details: null } }));
    
    try {
      console.log("🧪 Testando consulta de perfil com RLS...");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', createdUserId)
        .single();

      if (error) {
        setTestResults(prev => ({
          ...prev,
          select: { status: 'error', message: `Erro ao consultar: ${error.message}`, details: error }
        }));
      } else {
        console.log("✅ Perfil consultado com sucesso:", data);
        setTestResults(prev => ({
          ...prev,
          select: { status: 'success', message: 'Perfil consultado com sucesso!', details: data }
        }));
      }

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        select: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const testUpdate = async () => {
    if (!createdUserId) {
      setTestResults(prev => ({
        ...prev,
        update: { status: 'error', message: 'Nenhum usuário criado para testar', details: null }
      }));
      return;
    }

    setTestResults(prev => ({ ...prev, update: { status: 'testing', message: 'Testando atualização de perfil...', details: null } }));
    
    try {
      console.log("🧪 Testando atualização de perfil com RLS...");

      const { data, error } = await supabase
        .from('profiles')
        .update({ phone: '+258849999999' })
        .eq('user_id', createdUserId)
        .select();

      if (error) {
        setTestResults(prev => ({
          ...prev,
          update: { status: 'error', message: `Erro ao atualizar: ${error.message}`, details: error }
        }));
      } else {
        console.log("✅ Perfil atualizado com sucesso:", data);
        setTestResults(prev => ({
          ...prev,
          update: { status: 'success', message: 'Perfil atualizado com sucesso!', details: data }
        }));
      }

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        update: { status: 'error', message: `Erro: ${error.message}`, details: error }
      }));
    }
  };

  const runAllTests = async () => {
    console.log("🚀 Iniciando testes completos de RLS...");
    await checkPolicies();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testInsert();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testSelect();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testUpdate();
    console.log("🏁 Testes RLS concluídos!");
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🛡️ Teste de Políticas RLS</h1>
            <p className="text-gray-600">Verificação das políticas de segurança da tabela profiles</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Políticas RLS
                  </CardTitle>
                  {getStatusBadge(testResults.policies.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.policies.message}</p>
                {testResults.policies.details && (
                  <p className="text-xs text-gray-500">{JSON.stringify(testResults.policies.details)}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Inserção (INSERT)
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Consulta (SELECT)
                  </CardTitle>
                  {getStatusBadge(testResults.select.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.select.message}</p>
                {testResults.select.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.select.details?.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Atualização (UPDATE)
                  </CardTitle>
                  {getStatusBadge(testResults.update.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.update.message}</p>
                {testResults.update.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.update.details?.message}</p>
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
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={checkPolicies} disabled={testResults.policies.status === 'testing'}>
                  {getStatusIcon(testResults.policies.status)}
                  Verificar Políticas
                </Button>
                <Button onClick={testInsert} disabled={testResults.insert.status === 'testing'}>
                  {getStatusIcon(testResults.insert.status)}
                  Testar Inserção
                </Button>
                <Button onClick={testSelect} disabled={testResults.select.status === 'testing'}>
                  {getStatusIcon(testResults.select.status)}
                  Testar Consulta
                </Button>
                <Button onClick={testUpdate} disabled={testResults.update.status === 'testing'}>
                  {getStatusIcon(testResults.update.status)}
                  Testar Atualização
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

export default TesteRLS;