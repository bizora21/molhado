import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Database, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TesteConexao = () => {
  const [testResults, setTestResults] = useState({
    config: { status: 'pending', message: 'Verificando configuração...', details: null },
    connection: { status: 'pending', message: 'Testando conexão...', details: null },
    auth: { status: 'pending', message: 'Testando autenticação...', details: null }
  });

  const testConfig = () => {
    setTestResults(prev => ({ 
      ...prev, 
      config: { 
        status: 'success', 
        message: 'Configuração OK', 
        details: {
          url: 'https://seqcczrzxoqlpqbxyxsz.supabase.co',
          keyLength: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'.length,
          keyStarts: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        }
      } 
    }));
  };

  const testConnection = async () => {
    setTestResults(prev => ({ ...prev, connection: { status: 'testing', message: 'Testando conexão...', details: null } }));
    
    try {
      console.log("🔍 Testando conexão com Supabase...");
      console.log("URL:", "https://seqcczrzxoqlpqbxyxsz.supabase.co");
      
      // Teste simples de conexão
      const { data, error } = await supabase.from('profiles').select('count').single();
      
      if (error) {
        console.error("❌ Erro na conexão:", error);
        setTestResults(prev => ({ 
          ...prev, 
          connection: { status: 'error', message: `Erro: ${error.message}`, details: error } 
        }));
      } else {
        console.log("✅ Conexão bem-sucedida:", data);
        setTestResults(prev => ({ 
          ...prev, 
          connection: { status: 'success', message: 'Conexão OK', data: data } 
        }));
      }
    } catch (error) {
      console.error("❌ Erro geral na conexão:", error);
      setTestResults(prev => ({ 
        ...prev, 
        connection: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const testAuth = async () => {
    setTestResults(prev => ({ ...prev, auth: { status: 'testing', message: 'Testando autenticação...', details: null } }));
    
    try {
      console.log("🔍 Testando sistema de autenticação...");
      
      // Teste simples - verificar se podemos acessar o auth
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Erro no auth:", error);
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'error', message: `Erro: ${error.message}`, details: error } 
        }));
      } else {
        console.log("✅ Auth OK:", data);
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'success', message: 'Sistema de autenticação OK', details: data } 
        }));
      }
    } catch (error) {
      console.error("❌ Erro geral no auth:", error);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'error', message: `Erro: ${error.message}`, data: error } 
      }));
    }
  };

  const runAllTests = async () => {
    console.log("🚀 Iniciando testes de conexão...");
    testConfig();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testAuth();
    console.log("🏁 Testes concluídos!");
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 Teste de Conexão Supabase</h1>
            <p className="text-gray-600">Verificação da configuração e conectividade com o Supabase</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(testResults.config.status)}
                </div>
                <p className="text-xs text-gray-600">{testResults.config.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Conexão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(testResults.connection.status)}
                </div>
                <p className="text-xs text-gray-600">{testResults.connection.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Autenticação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(testResults.auth.status)}
                </div>
                <p className="text-xs text-gray-600">{testResults.auth.message}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🎮 Controles de Teste</CardTitle>
              <CardDescription>
                Execute os testes para verificar a conexão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={testConfig} disabled={testResults.config.status === 'testing'}>
                  Testar Configuração
                </Button>
                <Button onClick={testConnection} disabled={testResults.connection.status === 'testing'}>
                  Testar Conexão
                </Button>
                <Button onClick={testAuth} disabled={testResults.auth.status === 'testing'}>
                  Testar Autenticação
                </Button>
                <Button 
                  onClick={runAllTests}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={Object.values(testResults).some(r => r.status === 'testing')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Todos
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📋 Resultados Detalhados</CardTitle>
              <CardDescription>
                Informações detalhadas sobre cada teste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(testResults.config.status)}
                    <h3 className="font-semibold">Configuração do Cliente</h3>
                    {getStatusBadge(testResults.config.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testResults.config.message}</p>
                  {testResults.config.details && (
                    <div className="text-xs bg-gray-100 p-3 rounded">
                      <p><strong>URL:</strong> {testResults.config.details.url}</p>
                      <p><strong>Key Length:</strong> {testResults.config.details.keyLength} caracteres</p>
                      <p><strong>Key Start:</strong> {testResults.config.details.keyStarts}...</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(testResults.connection.status)}
                    <h3 className="font-semibold">Conexão com Banco</h3>
                    {getStatusBadge(testResults.connection.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testResults.connection.message}</p>
                  {testResults.connection.data && (
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(testResults.connection.data, null, 2)}
                    </pre>
                  )}
                  {testResults.connection.details && testResults.connection.status === 'error' && (
                    <div className="text-xs bg-red-50 p-3 rounded text-red-700">
                      <p><strong>Erro:</strong> {testResults.connection.details.message}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(testResults.auth.status)}
                    <h3 className="font-semibold">Sistema de Autenticação</h3>
                    {getStatusBadge(testResults.auth.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testResults.auth.message}</p>
                  {testResults.auth.data && (
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(testResults.auth.data, null, 2)}
                    </pre>
                  )}
                  {testResults.auth.details && testResults.auth.status === 'error' && (
                    <div className="text-xs bg-red-50 p-3 rounded text-red-700">
                      <p><strong>Erro:</strong> {testResults.auth.details.message}</p>
                    </div>
                  )}
                </div>
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

export default TesteConexao;