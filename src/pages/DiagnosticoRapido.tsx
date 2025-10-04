import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DiagnosticoRapido = () => {
  const [systemStatus, setSystemStatus] = useState({
    supabase: { status: 'checking', message: 'Verificando conexão...', details: null },
    database: { status: 'checking', message: 'Verificando banco de dados...', details: null },
    auth: { status: 'checking', message: 'Verificando autenticação...', details: null },
    tables: { status: 'checking', message: 'Verificando tabelas...', details: null }
  });

  const [isRunning, setIsRunning] = useState(false);

  const checkSystem = async () => {
    setIsRunning(true);
    console.log("🔍 Iniciando diagnóstico rápido do sistema...");

    // 1. Verificar conexão com Supabase
    try {
      console.log("1️⃣ Testando conexão com Supabase...");
      const { data, error } = await supabase.from('profiles').select('count').single();
      
      if (error) {
        setSystemStatus(prev => ({
          ...prev,
          supabase: { status: 'error', message: 'Falha na conexão', details: error.message }
        }));
      } else {
        setSystemStatus(prev => ({
          ...prev,
          supabase: { status: 'success', message: 'Conexão OK', details: `Total de perfis: ${data.count}` }
        }));
      }
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        supabase: { status: 'error', message: 'Erro crítico', details: err.message }
      }));
    }

    // 2. Verificar tabelas necessárias
    try {
      console.log("2️⃣ Verificando tabelas do banco de dados...");
      const tables = ['profiles', 'products', 'services', 'orders', 'blog_posts'];
      const tableResults = [];

      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('count').single();
          tableResults.push({ table, status: error ? 'error' : 'ok', count: data?.count || 0, error: error?.message });
        } catch (err) {
          tableResults.push({ table, status: 'error', error: err.message });
        }
      }

      const allTablesOk = tableResults.every(t => t.status === 'ok');
      
      setSystemStatus(prev => ({
        ...prev,
        tables: { 
          status: allTablesOk ? 'success' : 'error', 
          message: allTablesOk ? 'Todas as tabelas OK' : 'Algumas tabelas com problemas',
          details: tableResults
        }
      }));
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        tables: { status: 'error', message: 'Erro ao verificar tabelas', details: err.message }
      }));
    }

    // 3. Verificar sistema de autenticação
    try {
      console.log("3️⃣ Testando sistema de autenticação...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setSystemStatus(prev => ({
          ...prev,
          auth: { status: 'error', message: 'Erro no sistema de auth', details: error.message }
        }));
      } else {
        setSystemStatus(prev => ({
          ...prev,
          auth: { status: 'success', message: 'Sistema de auth OK', details: data ? 'Sessão ativa' : 'Nenhuma sessão ativa' }
        }));
      }
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        auth: { status: 'error', message: 'Erro crítico no auth', details: err.message }
      }));
    }

    // 4. Verificar banco de dados
    try {
      console.log("4️⃣ Verificando integridade do banco de dados...");
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, user_type, created_at')
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) {
        setSystemStatus(prev => ({
          ...prev,
          database: { status: 'error', message: 'Erro ao acessar dados', details: error.message }
        }));
      } else {
        setSystemStatus(prev => ({
          ...prev,
          database: { 
            status: 'success', 
            message: 'Banco de dados OK', 
            details: `${data.length} perfis encontrados` 
          }
        }));
      }
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        database: { status: 'error', message: 'Erro no banco de dados', details: err.message }
      }));
    }

    setIsRunning(false);
    console.log("✅ Diagnóstico completo!");
  };

  useEffect(() => {
    checkSystem();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✅ Funcionando</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">❌ Erro</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800">🔄 Verificando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">⏳ Aguardando</Badge>;
    }
  };

  const allSystemsOk = Object.values(systemStatus).every(s => s.status === 'success');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🔍 Diagnóstico Rápido do Sistema</h1>
            <p className="text-gray-600">Verificação automática do status do sistema LojaRapida</p>
          </div>

          {/* Status Geral */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {allSystemsOk ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-500" />
                )}
                Status Geral do Sistema
              </CardTitle>
              <CardDescription>
                {allSystemsOk 
                  ? "🎉 Todos os sistemas estão funcionando perfeitamente!" 
                  : "⚠️ Alguns sistemas precisam de atenção."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {allSystemsOk ? "100%" : "75%"}
                  </p>
                  <p className="text-sm text-gray-600">Sistemas operacionais</p>
                </div>
                <Button 
                  onClick={checkSystem}
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRunning ? "Verificando..." : "Verificar Novamente"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Detalhado */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.supabase.status)}
                    Conexão Supabase
                  </CardTitle>
                  {getStatusBadge(systemStatus.supabase.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{systemStatus.supabase.message}</p>
                {systemStatus.supabase.details && (
                  <p className="text-xs text-gray-500">{systemStatus.supabase.details}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.database.status)}
                    Banco de Dados
                  </CardTitle>
                  {getStatusBadge(systemStatus.database.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{systemStatus.database.message}</p>
                {systemStatus.database.details && (
                  <p className="text-xs text-gray-500">{systemStatus.database.details}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.auth.status)}
                    Sistema de Autenticação
                  </CardTitle>
                  {getStatusBadge(systemStatus.auth.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{systemStatus.auth.message}</p>
                {systemStatus.auth.details && (
                  <p className="text-xs text-gray-500">{systemStatus.auth.details}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.tables.status)}
                    Tabelas do Banco
                  </CardTitle>
                  {getStatusBadge(systemStatus.tables.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{systemStatus.tables.message}</p>
                {systemStatus.tables.details && Array.isArray(systemStatus.tables.details) && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {systemStatus.tables.details.map((table: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{table.table}:</span>
                        <span className={table.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                          {table.status === 'ok' ? `✅ ${table.count} registros` : '❌ Erro'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>🚀 Ações Rápidas</CardTitle>
              <CardDescription>
                Teste as funcionalidades principais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/register', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Testar Cadastro
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/login', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Testar Login
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/teste-cadastro', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Teste Completo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>📋 Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Configuração:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Supabase URL: https://seqcczrzxoqlpqbxyxsz.supabase.co</li>
                    <li>• Ambiente: Desenvolvimento</li>
                    <li>• Status: Online</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recursos:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• React + TypeScript</li>
                    <li>• Supabase Auth + Database</li>
                    <li>• Tailwind CSS + shadcn/ui</li>
                    <li>• React Router</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticoRapido;