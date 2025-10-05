import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, ArrowLeft, Check, Shield, Zap, ShoppingBag, Home, Star } from "lucide-react";
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
    city: "",
    province: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const clientBenefits = [
    { icon: <ShoppingBag className="h-6 w-6" />, title: "Compre com Segurança", description: "Pague somente na entrega do produto" },
    { icon: <Shield className="h-6 w-6" />, title: "Garantia de Qualidade", description: "Todos os produtos verificados e aprovados" },
    { icon: <Zap className="h-6 w-6" />, title: "Entrega Rápida", description: "Receba seus produtos em até 48h" },
    { icon: <Star className="h-6 w-6" />, title: "Suporte Especial", description: "Atendimento dedicado para clientes" }
  ];

  const provinces = [
    "Maputo", "Matola", "Xai-Xai", "Inhambane", "Maxixe", "Chimoio", "Beira", "Tete", "Quelimane", "Nampula", "Pemba", "Lichinga"
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações específicas para cliente
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
      showError("Por favor, preencha seu endereço de entrega");
      return;
    }

    if (!formData.city.trim()) {
      showError("Por favor, preencha sua cidade");
      return;
    }

    if (!formData.province) {
      showError("Por favor, selecione sua província");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Por favor, insira um email válido");
      return;
    }

    setLoading(true);
    
    try {
      console.log("🛒 Iniciando cadastro de CLIENTE:", formData.email);
      
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            user_type: 'cliente',
            role: 'cliente'
          }
        }
      });

      if (authError) {
        console.error("❌ Erro no auth.signUp:", authError);
        showError(authError.message || "Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("✅ Cliente criado no Auth:", authData.user);

      if (!authData.user) {
        console.error("❌ Usuário não retornado do auth");
        showError("Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      // 2. Fazer login automático
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        console.error("❌ Erro no signIn:", signInError);
        showError("Erro ao fazer login após cadastro. Tente fazer login manualmente.");
        setLoading(false);
        return;
      }

      console.log("✅ Login automático realizado");

      // 3. Verificar sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("❌ Erro ao obter sessão:", sessionError);
        showError("Erro ao verificar sessão. Tente fazer login manualmente.");
        setLoading(false);
        return;
      }

      console.log("✅ Sessão verificada, User ID:", session.user.id);

      // 4. Criar perfil de cliente no banco
      const profileData = {
        user_id: session.user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        user_type: 'cliente',
        role: 'cliente'
      };

      console.log("📊 Dados do perfil CLIENTE:", profileData);

      let profileResult = null;

      // Tentativa 1: Inserção direta
      try {
        console.log("🔄 Tentativa 1: Inserção direta...");
        const { data: result, error: error } = await supabase
          .from('profiles')
          .insert([profileData])
          .select();

        if (error) {
          console.error("❌ Erro na tentativa 1:", error);
          throw error;
        }

        console.log("✅ Perfil de cliente criado:", result);
        profileResult = result;
      } catch (error1) {
        console.warn("⚠️ Tentativa 1 falhou, tentando RPC...");
        
        // Tentativa 2: Usar RPC
        try {
          console.log("🔄 Tentativa 2: Usando RPC...");
          const { data: result, error: error } = await supabase
            .rpc('create_profile_simple', {
              p_user_id: session.user.id,
              p_full_name: formData.fullName,
              p_phone: formData.phone,
              p_address: formData.address,
              p_user_type: 'cliente',
              p_role: 'cliente'
            });

          if (error) {
            console.error("❌ Erro na tentativa 2:", error);
            throw error;
          }

          console.log("✅ Perfil de cliente criado via RPC:", result);
          profileResult = result;
        } catch (error2) {
          console.error("❌ Falha ao criar perfil:", error2);
          // Continuar mesmo sem perfil para não bloquear o usuário
        }
      }

      console.log("🎉 Cadastro de CLIENTE concluído com sucesso!");
      
      showSuccess("Conta de cliente criada com sucesso! Você já pode fazer compras.");
      
      // 5. Redirecionar para dashboard do cliente
      setTimeout(() => {
        navigate('/cliente-dashboard');
      }, 2000);

    } catch (error) {
      console.error("❌ Erro geral no cadastro:", error);
      showError(error.message || "Ocorreu um erro inesperado. Tente novamente.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LojaRapida</span>
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
            {/* Left Side - Cliente Benefits */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cadastro de Cliente
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Compre dos melhores 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> vendedores</span> 
                  <br />com total segurança
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Cadastre-se como cliente e compre com pagamento na entrega. 
                  Receba exatamente o que pediu ou não pague!
                </p>
              </div>

              <div className="space-y-6">
                {clientBenefits.map((benefit, index) => (
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

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">100,000+ Clientes</h3>
                    <p className="text-blue-100">Já compram com segurança</p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-white/50" />
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Criar Conta de Cliente</CardTitle>
                  <CardDescription>
                    Cadastre-se para comprar com pagamento na entrega
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= stepNumber 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
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
                            step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
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
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                          <Label htmlFor="address">Endereço de Entrega</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            required
                            placeholder="Av. Julius Nyerere, 1234"
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
                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            required
                            placeholder="Maputo"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="province">Província</Label>
                          <select
                            id="province"
                            name="province"
                            required
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Selecione uma província</option>
                            {provinces.map(province => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                        </div>

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
                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cadastrando...
                              </>
                            ) : (
                              "Criar Conta de Cliente"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center border-t pt-6">
                    <p className="text-sm text-gray-600 mb-3">É vendedor ou prestador?</p>
                    <div className="flex space-x-3">
                      <Link to="/register-vendedor" className="text-green-600 hover:text-green-500 text-sm font-medium">
                        Cadastre-se como Vendedor
                      </Link>
                      <span className="text-gray-400">•</span>
                      <Link to="/register-prestador" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                        Cadastre-se como Prestador
                      </Link>
                    </div>
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