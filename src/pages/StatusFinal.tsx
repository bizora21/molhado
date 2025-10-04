import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, ExternalLink, User, Mail, Database, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StatusFinal = () => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'checking',
    components: {
      connection: { status: 'checking', message: 'Verificando...' },
      database: { status: 'checking', message: 'Verificando...' },
      auth: { status: 'checking', message: 'Verificando...' },
      tables: { status: 'checking', message: 'Verificando...' }
    }
  });

  const [isRunning, setIsRunning] = useState(false);

  const checkSystem = async () => {
    setIsRunning(true);
    setSystemStatus(prev => ({ ...prev, overall: 'checking' }));

    // 1. Testar Conexão
    try {
      const { data, error } = await supabase.from('profiles').select('count').single();
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          connection: {
            status: error ? 'error' : 'success',
            message: error ? `Erro: ${error.message}` : `Conectado (${data.count} perfis)`
          }
        }
      }));
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          connection: {
            status: 'error',
            message: `Erro: ${err.message}`
          }
        }
      }));
    }

    // 2. Testar Banco de Dados
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, user_type')
        .limit(3);
      
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          database: {
            status: error ? 'error' : 'success',
            message: error ? `Erro: ${error.message}` : `Banco OK (${data.length} perfis)`
          }
        }
      }));
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          database: {
            status: 'error',
            message: `Erro: ${err.message}`
          }
        }
      }));
    }

    // 3. Testar Autenticação
    try {
      const { data, error } = await supabase.auth.getSession();
      
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          auth: {
            status: error ? 'error' : 'success',
            message: error ? `Erro: ${error.message}` : 'Auth OK'
          }
        }
      }));
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          auth: {
            status: 'error',
            message: `Erro: ${err.message}`
          }
        }
      }));
    }

    // 4. Testar Tabelas
    try {
      const tables = ['profiles', 'products', 'services', 'orders', 'blog_posts'];
      let workingTables = 0;
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count').single();
          if (!error) workingTables++;
        } catch (err) {
          // Ignorar erros individuais
        }
      }
      
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          tables: {
            status: workingTables === tables.length ? 'success' : 'warning',
            message: `${workingTables}/${tables.length} tabelas funcionando`
          }
        }
      }));
    } catch (err) {
      setSystemStatus(prev => ({
        ...prev,
        components: {
          ...prev.components,
          tables: {
            status: 'error',
            message: `Erro: ${err.message}`
          }
        }
      }));
    }

    // Calcular status geral
    setTimeout(() => {
      const statuses = Object.values(systemStatus.components);
      const successCount = statuses.filter(s => s.status === 'success').length;
      const errorCount = statuses.filter(s => s.status === 'error').length;
      
      let overallStatus: 'success' | 'warning' | 'error';
      if (errorCount === 0) overallStatus = 'success';
      else if (successCount > errorCount) overallStatus = 'warning';
      else overallStatus = 'error';
      
      setSystemStatus(prev => ({ ...prev, overall: overallStatus }));
      setIsRunning(false);
    }, 1000);
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
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
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
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Parcial</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800">🔄 Verificando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">⏳ Aguardando</Badge>;
    }
  };

  const getOverallMessage = () => {
    switch (systemStatus.overall) {
      case 'success':
        return "🎉 Sistema 100% funcional! Cadastro e login estão prontos.";
      case 'warning':
        return "⚠️ Sistema parcialmente funcional. Alguns recursos podem não funcionar.";
      case 'error':
        return "❌ Sistema com problemas. Verifique os erros abaixo.";
      default:
        return "🔍 Verificando status do sistema...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🚀 Status Final do Sistema</h1>
            <p className="text-xl text-gray-600">Verificação completa do LojaRapida</p>
          </div>

          {/* Status Geral */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(systemStatus.overall)}
                Resultado Final
              </CardTitle>
              <CardDescription className="text-lg">
                {getOverallMessage()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {systemStatus.overall === 'success' ? '100%' : 
                     systemStatus.overall === 'warning' ? '75%' : '25%'}
                  </p>
                  <p className="text-sm text-gray-600">Sistema operacional</p>
                </div>
                <Button 
                  onClick={checkSystem}
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Verificar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status dos Componentes */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Conexão Supabase
                  </CardTitle>
                  {getStatusBadge(systemStatus.components.connection.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{systemStatus.components.connection.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Banco de Dados
                  </CardTitle>
                  {getStatusBadge(systemStatus.components.database.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{systemStatus.components.database.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Autenticação
                  </CardTitle>
                  {getStatusBadge(systemStatus.components.auth.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{systemStatus.components.auth.message}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Tabelas
                  </CardTitle>
                  {getStatusBadge(systemStatus.components.tables.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{systemStatus.components.tables.message}</p>
              </CardContent>
            </Card>
          </div>

          {/* Ações Finais */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Teste as Funcionalidades</CardTitle>
              <CardDescription>
                Verifique se o cadastro e login estão funcionando
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  className="w-full justify-start"
                  onClick={() => window.open('/register', '_blank')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Testar Cadastro de Cliente
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button 
                  className="w-full justify-start"
                  onClick={() => window.open('/register-vendedor', '_blank')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Testar Cadastro de Vendedor
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button 
                  className="w-full justify-start"
                  onClick={() => window.open('/register-prestador', '_blank')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Testar Cadastro de Prestador
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button 
                  className="w-full justify-start"
                  onClick={() => window.open('/login', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Testar Login
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Final */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>📋 Resumo Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.components.connection.status)}
                  <span className="text-sm">Conexão com Supabase: {systemStatus.components.connection.status === 'success' ? '✅ OK' : '❌ Problema'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.components.auth.status)}
                  <span className="text-sm">Sistema de Autenticação: {systemStatus.components.auth.status === 'success' ? '✅ OK' : '❌ Problema'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.components.database.status)}
                  <span className="text-sm">Banco de Dados: {systemStatus.components.database.status === 'success' ? '✅ OK' : '❌ Problema'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.components.tables.status)}
                  <span className="text-sm">Tabelas: {systemStatus.components.tables.status === 'success' ? '✅ OK' : systemStatus.components.tables.status === 'warning' ? '⚠️ Parcial' : '❌ Problema'}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {systemStatus.overall === 'success' ? 
                    '✅ Sistema pronto para uso!' : 
                    '⚠️ Sistema precisa de atenção'}
                </p>
                <p className="text-xs text-gray-600">
                  {systemStatus.overall === 'success' ? 
                    'Todos os componentes estão funcionando. Você pode usar o sistema normalmente.' : 
                    'Verifique os erros acima e use as páginas de debug para corrigir os problemas.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatusFinal;