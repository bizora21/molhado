import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, ArrowLeft, Check, Shield, Zap, Users, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const benefits = [
    { icon: <Shield className="h-6 w-6" />, title: "Compra Segura", description: "Transações protegidas com garantia" },
    { icon: <Zap className="h-6 w-6" />, title: "Entrega Rápida", description: "Receba em até 48h" },
    { icon: <Users className="h-6 w-6" />, title: "Suporte 24/7", description: "Ajuda sempre que precisar" }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações mais rigorosas
    if (!formData.fullName.trim()) {
      showError("Por favor, preencha seu nome completo");
      return;
    }

    if (!formData.email.trim()) {
      showError("Por favor, preencha seu email");
      return;
    }

    if (!formData.phone.trim()) {
      showError("Por favor, preencha seu telefone");
      return;
    }

    if (!formData.address.trim()) {
      showError("Por favor, preencha seu endereço");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Validação de email mais forte
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Por favor, insira um email válido");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Iniciando registro do usuário:", formData.email);
      
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address
          }
        }
      });

      if (authError) {
        console.error("Erro no auth.signUp:", authError);
        showError(authError.message || "Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("Usuário registrado com sucesso:", authData.user);

      if (!authData.user) {
        console.error("Usuário não retornado do auth");
        showError("Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      // 2. Criar perfil no banco de dados
      const profileData = {
        user_id: authData.user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        user_type: 'cliente',
        role: 'cliente',
        email_confirmed_at: new Date().toISOString()
      };

      console.log("Criando perfil:", profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        showError("Erro ao salvar seus dados. Tente novamente.");
        
        // Tentar deletar o usuário criado para não deixar conta órfã
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        setLoading(false);
        return;
      }

      console.log("Perfil criado com sucesso:", profileResult);

      // 3. Simular envio de email (em produção, isso seria feito por Supabase)
      console.log("Simulando envio de email de confirmação...");
      
      // Mostrar mensagem de sucesso imediata
      showSuccess("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
      
      // Redirecionar após um pequeno delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Erro geral no registro:", error);
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

  const nextStep = () => {
    if (step === 1 && formData.fullName && formData.email) {
      setStep(2);
    } else if (step === 2 && formData.phone && formData.address) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LojaRapida</span>
            </Link>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">Cadastre-se Grátis</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Junte-se à maior comunidade de 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> compras</span> 
                  <br />de Moçambique
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Crie sua conta em menos de 2 minutos e comece a comprar dos melhores vendedores locais
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-blue-600">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">100,000+ Clientes</h3>
                    <p className="text-blue-100">Confiam na LojaRapida</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Criar Conta</CardTitle>
                  <CardDescription>
                    Preencha os dados abaixo para começar
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= stepNumber 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step > stepNumber ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            stepNumber
                          )}
                        </div>
                        {stepNumber < 3 && (
                          <div className={`w-full h-1 mx-2 ${
                            step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="fullName">Nome Completo</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            placeholder="João Silva"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

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

                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Continuar
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+258 84 123 4567"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            required
                            placeholder="Av. Julius Nyerere, Maputo"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep}
                            className="flex-1 h-12"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                          </Button>
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Continuar
                            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="password">Senha</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••"
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

                        <div>
                          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="h-12 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-600">
                            Eu concordo com os{' '}
                            <Link to="/termos" className="text-blue-600 hover:text-blue-500 underline">
                              termos de serviço
                            </Link>{' '}
                            e{' '}
                            <Link to="/privacidade" className="text-blue-600 hover:text-blue-500 underline">
                              política de privacidade
                            </Link>
                          </label>
                        </div>

                        <div className="flex space-x-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep}
                            className="flex-1 h-12"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cadastrando...
                              </>
                            ) : (
                              "Criar Conta"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Quer vender produtos ou oferecer serviços?{' '}
                      <Link to="/register-vendedor" className="font-medium text-blue-600 hover:text-blue-500">
                        Cadastre-se como Vendedor
                      </Link>{' '}
                      ou{' '}
                      <Link to="/register-prestador" className="font-medium text-blue-600 hover:text-blue-500">
                        Prestador de Serviços
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;