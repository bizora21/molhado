import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Store, Wrench } from "lucide-react";
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        showError("Email ou senha incorretos");
        return;
      }

      // Get user profile to determine user type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', data.user?.id)
        .single();

      if (profileError || !profile) {
        showError("Erro ao carregar perfil do usuário");
        return;
      }

      // Redirect based on user type
      switch (profile.user_type) {
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
      
      showSuccess("Login realizado com sucesso!");
    } catch (error) {
      showError("Erro ao fazer login");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Entrar na LojaRapida
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              crie uma nova conta
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Escolha seu tipo de conta</CardTitle>
            <CardDescription className="text-center">
              Selecione como você quer acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cliente" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
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

              <TabsContent value="cliente" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin('cliente')}
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar como Cliente"}
                </Button>
              </TabsContent>

              <TabsContent value="vendedor" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-vendedor">Email</Label>
                  <Input
                    id="email-vendedor"
                    name="email"
                    type="email"
                    required
                    placeholder="sua@loja.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-vendedor">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password-vendedor"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin('vendedor')}
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar como Vendedor"}
                </Button>
              </TabsContent>

              <TabsContent value="prestador" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-prestador">Email</Label>
                  <Input
                    id="email-prestador"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@servico.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-prestador">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password-prestador"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin('prestador')}
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar como Prestador"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;