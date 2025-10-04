import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DebugSupabase = () => {
  const [showKey, setShowKey] = useState(false);
  const [testResults, setTestResults] = useState({
    config: { status: 'pending', message: 'Verificando configuração...', details: null },
    connection: { status: 'pending', message: 'Testando conexão...', details: null },
    auth: { status: 'pending', message: 'Testando autenticação...', details: null },
    tables: { status: 'pending', message: 'Verificando tabelas...', details: null }
  });

  const [customConfig, setCustomConfig] = useState({
    url: "https://seqcczrzxoqlpqbxyxsz.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcWNjenJ6eG9xbHBxYnh5eHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjgzNjYsImV4cCI6MjA3NDA0NDM2Nn0.a09p913eEVld6G3L1ggLV_-zpzNKU4ZVtjm-ojzCLgY"
  });

  const testConfig = () => {
    console.log("🔍 Verificando configuração do Supabase...");
    
    const config = {
      url: customConfig.url,
      keyLength: customConfig.key.length,
      keyStart: customConfig.key.substring(0, 20) + "...",
      keyEnd: "..." + customConfig.key.substring(customConfig.key.length - 20)
    };

    console.log("Configuração:", config);

    // Verificar se a chave tem formato JWT válido
    const parts = customConfig.key.split('.');
    const isValidJWT = parts.length === 3;

    setTestResults(prev => ({ 
      ...prev, 
      config: { 
        status: isValidJWT ? 'success' : 'error', 
        message: isValidJWT ? 'Configuração OK - Formato JWT válido' : 'Erro - Formato de chave inválido', 
        details: config 
      } 
    }));
  };

  const testConnection = async () => {
    setTestResults(prev => ({ ...prev, connection: { status: 'testing', message: 'Testando conexão...', details: null } }));
    
    try {
      console.log("🔍 Testando conexão com:", customConfig.url);
      
      // Criar cliente temporário para teste
      const testClient = supabase;
      
      // Teste simples de conexão
      const { data, error } = await testClient.from('profiles').select('count').single();
      
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
          connection: { status: 'success', message: 'Conexão OK', details: data } 
        }));
      }
    } catch (error) {
      console.error("❌ Erro geral na conexão:", error);
      setTestResults(prev => ({ 
        ...prev, 
        connection: { status: 'error', message: `Erro: ${error.message}`, details: error } 
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
        auth: { status: 'error', message: `Erro: ${error.message}`, details: error } 
      }));
    }
  };

  const testTables = async () => {
    setTestResults(prev => ({ ...prev, tables: { status: 'testing', message: 'Verificando tabelas...', details: null } }));
    
    try {
      console.log("🔍 Verificando tabelas do banco...");
      
      const tables = ['profiles', 'products', 'services', 'orders', 'blog_posts'];
      const results = [];

      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('count').single();
          results.push({ table, status: error ? 'error' : 'ok', count: data?.count || 0, error: error?.message });
        } catch (err) {
          results.push({ table, status: 'error', error: err.message });
        }
      }

      const allOk = results.every(r => r.status === 'ok');
      
      setTestResults(prev => ({ 
        ...prev, 
        tables: { 
          status: allOk ? 'success' : 'error', 
          message: allOk ? 'Todas as tabelas OK' : 'Algumas tabelas com problemas',
          details: results 
        } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        tables: { status: 'error', message: `Erro: ${error.message}`, details: error } 
      }));
    }
  };

  const runAllTests = async () => {
    console.log("🚀 Iniciando diagnóstico completo...");
    testConfig();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testAuth();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testTables();
    console.log("🏁 Diagnóstico concluído!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 Debug Supabase</h1>
            <p className="text-gray-600">Diagnóstico completo da configuração do Supabase</p>
          </div>

          {/* Configuração Atual */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>⚙️ Configuração Atual</CardTitle>
              <CardDescription>
                Verifique e ajuste as credenciais do Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supabaseUrl">URL do Supabase</Label>
                <div className="flex gap-2">
                  <Input
                    id="supabaseUrl"
                    value={customConfig.url}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, url: e.target.value }))}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => copyToClipboard(customConfig.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="supabaseKey">Chave Anônima (Anon Key)</Label>
                <div className="flex gap-2">
                  <Input
                    id="supabaseKey"
                    type={showKey ? "text" : "password"}
                    value={customConfig.key}
                    onChange={(e) => setCustomConfig(prev => ({ ...prev, key: e.target.value }))}
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={() => copyToClipboard(customConfig.key)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={runAllTests} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Todos os Testes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados dos Testes */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(testResults.config.status)}
                    Configuração
                  </CardTitle>
                  {getStatusBadge(testResults.config.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.config.message}</p>
                {testResults.config.details && (
                  <div className="text-xs space-y-1">
                    <p><strong>URL:</strong> {testResults.config.details.url}</p>
                    <p><strong>Tamanho da chave:</strong> {testResults.config.details.keyLength} caracteres</p>
                    <p><strong>Início:</strong> {testResults.config.details.keyStart}</p>
                    <p><strong>Fim:</strong> {testResults.config.details.keyEnd}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(testResults.connection.status)}
                    Conexão
                  </CardTitle>
                  {getStatusBadge(testResults.connection.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.connection.message}</p>
                {testResults.connection.details && testResults.connection.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.connection.details.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(testResults.auth.status)}
                    Autenticação
                  </CardTitle>
                  {getStatusBadge(testResults.auth.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.auth.message}</p>
                {testResults.auth.details && testResults.auth.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    <p><strong>Erro:</strong> {testResults.auth.details.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(testResults.tables.status)}
                    Tabelas
                  </CardTitle>
                  {getStatusBadge(testResults.tables.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{testResults.tables.message}</p>
                {testResults.tables.details && Array.isArray(testResults.tables.details) && (
                  <div className="text-xs space-y-1">
                    {testResults.tables.details.map((table: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{table.table}:</span>
                        <span className={table.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                          {table.status === 'ok' ? `✅ ${table.count}` : '❌'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Instruções para Corrigir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Se a conexão falhar:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Verifique se a URL está correta: https://seqcczrzxoqlpqbxyxsz.supabase.co</li>
                    <li>Verifique se a chave anônima está correta e não expirou</li>
                    <li>Acesse o painel do Supabase para obter novas credenciais</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Para obter novas credenciais:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Acesse <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">supabase.com/dashboard</a></li>
                    <li>Selecione seu projeto: seqcczrzxoqlpqbxyxsz</li>
                    <li>Vá para Settings → API</li>
                    <li>Copie a URL e a chave anônima (anon public)</li>
                    <li>Cole nos campos acima</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Se tudo estiver OK:</h4>
                  <p className="text-gray-600">
                    Teste o cadastro real em <a href="/register" className="text-blue-600 underline">/register</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;