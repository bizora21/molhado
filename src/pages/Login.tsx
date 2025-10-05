import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, Store, Wrench, ArrowRight, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (userType: string) => {
    setLoading(true);
    
    console.log("🔐 Tentando login como:", userType, "com email:", formData.email);
    
    try {
      // 1. Verificar se o email foi preenchido
      if (!formData.email.trim()) {
        showError("Por favor, insira seu email");
        setLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        showError("Por favor, insira sua senha");
        setLoading(false);
        return;
      }

      // 2. Tentar fazer login com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        console.error("❌ Erro no signInWithPassword:", authError);
        
        // Mensagens de erro mais específicas
        if (authError.message.includes("Invalid login credentials")) {
          showError("Email ou senha incorretos");
        } else if (authError.message.includes("Email not confirmed")) {
          showError("Por favor, confirme seu email antes de fazer login");
        } else {
          showError(authError.message || "Erro ao fazer login");
        }
        
        setLoading(false);
        return;
      }

      console.log("✅ Login bem-sucedido:", authData.user);

      if (!authData.user) {
        console.error("❌ Usuário não encontrado nos dados de autenticação");
        showError("Erro ao fazer login");
        setLoading(false);
        return;
      }

      // 3. Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError);
        
        // Se não encontrar perfil, tentar criar um básico
        if (profileError.code === 'PGRST116') {
          console.log("⚠️ Perfil não encontrado, criando perfil básico...");
          const basicProfile = {
            user_id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Usuário',
            phone: authData.user.user_metadata?.phone || '',
            user_type: userType,
            role: userType
          };

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([basicProfile])
            .select()
            .single();

          if (createError) {
            console.error("❌ Erro ao criar perfil básico:", createError);
            showError("Erro ao configurar seu perfil. Entre em contato com o suporte.");
            setLoading(false);
            return;
          }

          console.log("✅ Perfil básico criado:", newProfile);
          profile = newProfile;
        } else {
          showError("Erro ao carregar seu perfil. Tente novamente.");
          setLoading(false);
          return;
        }
      }

      console.log("✅ Perfil encontrado:", profile);

      // 4. Verificar se o tipo de usuário corresponde ao perfil
      if (profile.user_type && profile.user_type !== userType) {
        console.error("❌ Tipo de usuário selecionado não corresponde ao perfil");
        showError(`Este email está registrado como ${profile.user_type}, mas você selecionou ${userType}.`);
        setLoading(false);
        return;
      }

      // 5. Login bem-sucedido
      const displayName = profile?.full_name || profile?.store_name || profile?.professional_name || 'Usuário';
      showSuccess(`Bem-vindo de volta, ${displayName}!`);
      
      // 6. Redirecionar para o dashboard correto
      setTimeout(() => {
        switch (userType) {
          case 'cliente':
            navigate('/cliente-dashboard');
            break;
          case 'vendedor':
            navigate('/vendedor-dashboard');
            break;
          case 'prestador':
            navigate('/prestador-dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1000);

    } catch (error) {
      console.error("❌ Erro geral no login:", error);
      showError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LojaRapida</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-blue-600 transition-colors">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Novo aqui?</span>
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Message */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">Bem-vindo de volta</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Entre na sua conta e 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> continue</span>
                  <br />de onde parou
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Acesse sua conta para gerenciar seus pedidos, produtos ou serviços
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Acesso Seguro</h3>
                    <p className="text-gray-600">Seus dados estão protegidos com criptografia avançada</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Acesso Rápido</h3>
                    <p className="text-gray-600">Entre em segundos e continue de onde parou</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Novo na LojaRapida?</h3>
                <p className="text-blue-100 mb-4">Junte-se a 100,000+ usuários satisfeitos</p>
                <Link to="/register">
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    Criar Conta Gratuita
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Entrar na Conta</CardTitle>
                  <CardDescription>
                    Escolha seu tipo de conta para continuar
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Tabs defaultValue="cliente" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="cliente" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Cliente
                      </TabsTrigger>
                      <TabsTrigger value="vendedor" className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Vendedor
                      </TabsTrigger>
                      <TabsTrigger value="prestador" className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Prestador
                      </TabsTrigger>
                    </TabsList>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin('cliente');
                    }} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="password">Senha</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="•••••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="h-12 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-600">Lembrar de mim</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                          Esqueceu a senha?
                        </Link>
                      </div>

                      <TabsContent value="cliente" className="mt-6">
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                          onClick={() => handleLogin('cliente')}
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar como Cliente"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="vendedor" className="mt-6">
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                          onClick={() => handleLogin('vendedor')}
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar como Vendedor"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="prestador" className="mt-6">
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                          onClick={() => handleLogin('prestador')}
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar como Prestador"}
                        </Button>
                      </TabsContent>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                          Cadastre-se gratuitamente
                        </Link>
                      </p>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;