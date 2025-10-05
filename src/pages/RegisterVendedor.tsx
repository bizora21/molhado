import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Store, ArrowLeft, Upload, CheckCircle, Package, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const RegisterVendedor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    storeName: "",
    storeCategory: "",
    storeDescription: "",
    storeAddress: "",
    storeCity: "",
    storeProvince: "",
    storeOpeningHours: "",
    storeWhatsapp: "",
    storeAcceptsDelivery: false,
    storeDeliveryRadiusKm: "",
    storeDeliveryFee: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const sellerBenefits = [
    { icon: <Package className="h-6 w-6" />, title: "Venda Imediata", description: "Comece a vender assim que se cadastrar" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Amplo Mercado", description: "Acesse mais de 100.000 clientes em todo Moçambique" },
    { icon: <Users className="h-6 w-6" />, title: "Pagamento Garantido", description: "Receba pagamentos na entrega dos produtos" },
    { icon: <Store className="h-6 w-6" />, title: "Dashboard Completo", description: "Gerencie seus produtos e vendas online" }
  ];

  const storeCategories = [
    "Alimentos e Bebidas",
    "Roupas e Acessórios", 
    "Eletrônicos e Celulares",
    "Móveis e Decoração",
    "Saúde e Beleza",
    "Esportes e Lazer",
    "Livros e Papelaria",
    "Brinquedos e Jogos",
    "Automotivo e Peças",
    "Ferramentas e Construção",
    "Casa e Jardim",
    "Informática e Tecnologia",
    "Bebês e Crianças",
    "Pet Shop",
    "Outros"
  ];

  const provinces = [
    "Maputo", "Matola", "Xai-Xai", "Inhambane", "Maxixe", "Chimoio", "Beira", "Tete", "Quelimane", "Nampula", "Pemba", "Lichinga"
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações específicas para vendedor
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

    if (!formData.storeName.trim()) {
      showError("Por favor, preencha o nome da sua loja");
      return;
    }

    if (!formData.storeCategory) {
      showError("Por favor, selecione uma categoria para sua loja");
      return;
    }

    if (!formData.storeDescription.trim()) {
      showError("Por favor, descreva sua loja e produtos");
      return;
    }

    if (!formData.storeAddress.trim()) {
      showError("Por favor, preencha o endereço da sua loja");
      return;
    }

    if (!formData.storeCity.trim()) {
      showError("Por favor, preencha a cidade da sua loja");
      return;
    }

    if (!formData.storeProvince) {
      showError("Por favor, selecione a província da sua loja");
      return;
    }

    if (!formData.storeOpeningHours.trim()) {
      showError("Por favor, preencha o horário de funcionamento");
      return;
    }

    if (!formData.storeWhatsapp.trim()) {
      showError("Por favor, preencha o WhatsApp da sua loja");
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
      console.log("🏪 Iniciando cadastro de VENDEDOR:", formData.email);
      
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            user_type: 'vendedor',
            role: 'vendedor'
          }
        }
      });

      if (authError) {
        console.error("❌ Erro no auth.signUp:", authError);
        showError(authError.message || "Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("✅ Vendedor criado no Auth:", authData.user);

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

      // 4. Criar perfil de vendedor no banco
      const profileData = {
        user_id: session.user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        user_type: 'vendedor',
        role: 'vendedor',
        store_name: formData.storeName,
        store_category: formData.storeCategory,
        store_description: formData.storeDescription,
        store_address: formData.storeAddress,
        store_city: formData.storeCity,
        store_province: formData.storeProvince,
        store_opening_hours: formData.storeOpeningHours,
        store_whatsapp: formData.storeWhatsapp,
        store_accepts_delivery: formData.storeAcceptsDelivery,
        store_delivery_radius_km: formData.storeDeliveryRadiusKm ? parseFloat(formData.storeDeliveryRadiusKm) : null,
        store_delivery_fee: formData.storeDeliveryFee ? parseFloat(formData.storeDeliveryFee) : null
      };

      console.log("📊 Dados do perfil VENDEDOR:", profileData);

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

        console.log("✅ Perfil de vendedor criado:", result);
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
              p_address: formData.storeAddress,
              p_user_type: 'vendedor',
              p_role: 'vendedor'
            });

          if (error) {
            console.error("❌ Erro na tentativa 2:", error);
            throw error;
          }

          console.log("✅ Perfil de vendedor criado via RPC:", result);
          profileResult = result;
        } catch (error2) {
          console.error("❌ Falha ao criar perfil:", error2);
        }
      }

      console.log("🎉 Cadastro de VENDEDOR concluído com sucesso!");
      
      showSuccess("Loja cadastrada com sucesso! Você já pode começar a vender.");
      
      // 5. Redirecionar para dashboard do vendedor
      setTimeout(() => {
        navigate('/vendedor-dashboard');
      }, 2000);

    } catch (error) {
      console.error("❌ Erro geral no cadastro:", error);
      showError(error.message || "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    if (step === 1 && formData.fullName && formData.email) {
      setStep(2);
    } else if (step === 2 && formData.storeName && formData.storeCategory) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">LojaRapida</span>
            </Link>
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Seller Benefits */}
            <div className="space-y-8">
              <div>
                <div className="bg-green-100 text-green-800 hover:bg-green-200 mb-4 w-fit px-3 py-1 rounded-full text-sm font-medium">
                  Cadastro de Vendedor
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Abra sua loja online e 
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> alcance</span> 
                  <br />milhares de clientes
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Cadastre sua loja e comece a vender para todo Moçambique. 
                  Sem taxas de cadastro e pagamento garantido na entrega.
                </p>
              </div>

              <div className="space-y-6">
                {sellerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-green-600">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">10,000+ Vendedores</h3>
                    <p className="text-green-100">Já vendem na LojaRapida</p>
                  </div>
                  <Store className="h-12 w-12 text-white/50" />
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Cadastrar sua Loja</CardTitle>
                  <CardDescription>
                    Cadastre sua loja para começar a vender online
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= stepNumber 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step > stepNumber ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            stepNumber
                          )}
                        </div>
                        {stepNumber < 3 && (
                          <div className={`w-full h-1 mx-2 ${
                            step > stepNumber ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="fullName">Seu Nome Completo</Label>
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
                          <Label htmlFor="email">Email da Loja</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="sua@loja.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone da Loja</Label>
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

                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          Continuar
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="storeName">Nome da Loja</Label>
                          <Input
                            id="storeName"
                            name="storeName"
                            type="text"
                            required
                            placeholder="Minha Loja Ltda"
                            value={formData.storeName}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="storeCategory">Categoria da Loja</Label>
                          <Select onValueChange={(value) => handleSelectChange('storeCategory', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {storeCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="storeDescription">Descrição da Loja</Label>
                          <Textarea
                            id="storeDescription"
                            name="storeDescription"
                            required
                            placeholder="Descreva sua loja, produtos oferecidos e diferenciais..."
                            value={formData.storeDescription}
                            onChange={handleInputChange}
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="storeAddress">Endereço da Loja</Label>
                          <Input
                            id="storeAddress"
                            name="storeAddress"
                            type="text"
                            required
                            placeholder="Av. Julius Nyerere, 1234"
                            value={formData.storeAddress}
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
                            className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            Continuar
                            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="storeCity">Cidade</Label>
                            <Input
                              id="storeCity"
                              name="storeCity"
                              type="text"
                              required
                              placeholder="Maputo"
                              value={formData.storeCity}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div>
                            <Label htmlFor="storeProvince">Província</Label>
                            <select
                              id="storeProvince"
                              name="storeProvince"
                              required
                              value={formData.storeProvince}
                              onChange={handleInputChange}
                              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Selecione uma província</option>
                              {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="storeOpeningHours">Horário de Funcionamento</Label>
                          <Input
                            id="storeOpeningHours"
                            name="storeOpeningHours"
                            type="text"
                            required
                            placeholder="Seg-Sex: 8h-18h, Sáb: 8h-13h"
                            value={formData.storeOpeningHours}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="storeWhatsapp">WhatsApp da Loja</Label>
                          <Input
                            id="storeWhatsapp"
                            name="storeWhatsapp"
                            type="tel"
                            required
                            placeholder="+258 84 123 4567"
                            value={formData.storeWhatsapp}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="storeDeliveryRadiusKm">Raio de Entrega (km)</Label>
                            <Input
                              id="storeDeliveryRadiusKm"
                              name="storeDeliveryRadiusKm"
                              type="number"
                              placeholder="10"
                              value={formData.storeDeliveryRadiusKm}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div>
                            <Label htmlFor="storeDeliveryFee">Taxa de Entrega (MT)</Label>
                            <Input
                              id="storeDeliveryFee"
                              name="storeDeliveryFee"
                              type="number"
                              placeholder="50"
                              value={formData.storeDeliveryFee}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            id="storeAcceptsDelivery"
                            name="storeAcceptsDelivery"
                            type="checkbox"
                            checked={formData.storeAcceptsDelivery}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <Label htmlFor="storeAcceptsDelivery">Aceita entregas</Label>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="•••••••••••••••••"
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
                                placeholder="••••••••••••••••"
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
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-600">
                            Eu concordo com os{' '}
                            <Link to="/termos" className="text-green-600 hover:text-green-500 underline">
                              termos de serviço
                            </Link>{' '}
                            e{' '}
                            <Link to="/privacidade" className="text-green-600 hover:text-green-500 underline">
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
                            className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            disabled={loading}
                          >
                            {loading ? "Cadastrando..." : "Cadastrar Loja"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center border-t pt-6">
                    <p className="text-sm text-gray-600 mb-3">É cliente ou prestador?</p>
                    <div className="flex space-x-3">
                      <Link to="/register" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                        Cadastre-se como Cliente
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

export default RegisterVendedor;