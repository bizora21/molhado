import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TesteEmail = () => {
  const [testResults, setTestResults] = useState({
    auth: { status: 'pending', message: '' },
    profile: { status: 'pending', message: '' },
    email: { status: 'pending', message: '' }
  });

  const [testEmail, setTestEmail] = useState("");

  const testAuthFlow = async () => {
    setTestResults(prev => ({ ...prev, auth: { status: 'testing', message: 'Testando autenticação...' } }));
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'Teste123456';
      
      // 1. Tentar registrar email
      console.log("Testando registro com email:", testEmail);
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'error', message: error.message } 
        }));
        return;
      }

      console.log("Usuário de teste criado:", data.user);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'success', message: 'Email de teste criado com sucesso' } 
      }));

      // 2. Tentar login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (loginError) {
        setTestResults(prev => ({ 
          ...prev, 
          auth: { status: 'error', message: loginError.message } 
        }));
        return;
      }

      console.log("Login de teste bem-sucedido:", loginData.user);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'success', message: 'Login de teste bem-sucedido' } 
      }));

      // 3. Verificar se o email foi confirmado
      const { data: userData } = await supabase.auth.getUser(data.user.id);
      
      if (userData && userData.email_confirmed_at) {
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'success', message: 'Email confirmado' } 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'warning', message: 'Email não confirmado' } 
        }));
      }

    } catch (error) {
      console.error("Erro no teste de email:", error);
      setTestResults(prev => ({ 
        ...prev, 
        auth: { status: 'error', message: 'Erro no teste' } 
      }));
    }
  };

  const testProfileFlow = async () => {
    setTestResults(prev => ({ ...prev, profile: { status: 'testing', message: 'Testando criação de perfil...' } }));
    
    try {
      const testUserId = 'test-user-id';
      
      // 1. Buscar perfil de teste
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      if (error) {
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'error', message: error.message } 
        }));
        return;
      }

      console.log("Perfil de teste encontrado:", profile);
      setTestResults(prev => ({ 
        ...prev, 
        profile: { status: 'success', message: 'Perfil de teste encontrado' } 
      }));

    } catch (error) {
      console.error("Erro no teste de perfil:", error);
      setTestResults(prev => ({ 
        ...prev, 
        profile: { status: 'error', message: 'Erro no teste' } 
      }));
    }
  };

  const testDatabaseConnection = async () => {
    setTestResults(prev => ({ ...prev, profile: { status: 'testing', message: 'Testando conexão com banco de dados...' } }));
    
    try {
      // Testar conexão com uma consulta simples
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .single();
      
      if (error) {
        setTestResults(prev => ({ 
          ...prev, 
          profile: { status: 'error', message: 'Erro na conexão com banco de dados' } 
        }));
        return;
      }

      console.log("Conexão com banco de dados bem-sucedida. Total de perfis:", data.count);
      setTestResults(prev => ({ 
        ...prev, 
        profile: { status: 'success', message: `Conexão OK. Total de perfis: ${data.count}` } 
      }));

    } catch (error) {
      console.error("Erro na conexão com banco de dados:", error);
      setTestResults(prev => ({ 
        ...prev, 
        profile: { status: 'error', message: 'Erro na conexão' } 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Teste de Sistema de Email</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Autenticação</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testAuthFlow}
                  className="w-full mb-4"
                  disabled={testResults.auth.status === 'testing'}
                >
                  {testResults.auth.status === 'testing' ? 'Testando...' : 'Testar Autenticação'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teste de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testProfileFlow}
                  className="w-full mb-4"
                  disabled={testResults.profile.status === 'testing'}
                >
                  {testResults.profile.status === 'testing' ? 'Testando...' : 'Testar Criação de Perfil'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teste de Conexãoção</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testDatabaseConnection}
                  className="w-full mb-4"
                  disabled={testResults.profile.status === 'testing'}
                >
                  {testResults.profile.status === 'testing' ? 'Testando...' : 'Testar Conexão'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enviar Email de Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Email de teste"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full"
                  />
                  <Button 
                    onClick={() => {
                      console.log("Enviando email de teste:", testEmail);
                      // Aqui você pode implementar o envio real
                    }}
                    className="w-full"
                  >
                    Enviar Email de Teste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados dos Testes</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  testResults.auth.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  Autenticação: {testResults.auth.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  testResults.profile.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  Perfil: {testResults.profile.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  testResults.profile.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  Conexão: {testResults.profile.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesteEmail;