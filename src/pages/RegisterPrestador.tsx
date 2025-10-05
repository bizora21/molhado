import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Wrench, ArrowLeft, CheckCircle, Calendar, Users, Star, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const RegisterPrestador = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    professionalName: "",
    professionalProfession: "",
    professionalCategory: "",
    professionalDescription: "",
    professionalExperienceYears: "",
    professionalHourlyRate: "",
    professionalMinPrice: "",
    professionalWhatsapp: "",
    professionalCity: "",
    professionalProvince: "",
    professionalHomeService: false,
    professionalServiceRadiusKm: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const providerBenefits = [
    { icon: <Calendar className="h-6 w-6" />, title: "Agendamento Online", description: "Receba solicitações de serviço diretamente" },
    { icon: <Users className="h-6 w-6" />, title: "Milhares de Clientes", description: "Acesse mais de 100.000 clientes em todo Moçambique" },
    { icon: <Star className="h-6 w-6" />, title: "Avaliações e Reputação", description: "Construa sua reputação com avaliações de clientes" },
    { icon: <Award className="h-6 w-6" />, title: "Pagamento Garantido", description: "Receba pagamento na conclusão do serviço" }
  ];

  const serviceCategories = [
    "Construção e Reformas",
    "Elétrica e Hidráulica",
    "Informática e Tecnologia",
    "Design e Criatividade",
    "Educação e Treinamento",
    "Saúde e Bem-estar",
    "Beleza e Estética",
    "Consultoria e Negócios",
    "Limpeza e Conservação",
    "Transporte e Logística",
    "Fotografia e Vídeo",
    "Música e Entretenimento",
    "Reparação e Manutenção",
    "Jardinagem e Paisagismo",
    "Outros Serviços"
  ];

  const professions = [
    "Eletricista", "Encanador", "Pintor", "Pedreiro", "Carpinteiro", "Mecânico",
    "Designer Gráfico", "Desenvolvedor Web", "Fotógrafo", "Videomaker", "Músico",
    "Professor Particular", "Personal Trainer", "Nutricionista", "Psicólogo", "Advogado",
    "Médico", "Enfermeiro", "Fisioterapeuta", "Belezelecista", "Cabeleireiro",
    "Motorista", "Entregador", "Limpeza", "Jardineiro", "Cozinheiro", "Outro"
  ];

  const provinces = [
    "Maputo", "Matola", "Xai-Xai", "Inhambane", "Maxixe", "Chimoio", "Beira", "Tete", "Quelimane", "Nampula", "Pemba", "Lichinga"
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações específicas para prestador
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

    if (!formData.professionalName.trim()) {
      showError("Por favor, preencha seu nome profissional");
      return;
    }

    if (!formData.professionalProfession) {
      showError("Por favor, selecione sua profissão");
      return;
    }

    if (!formData.professionalCategory) {
      showError("Por favor, selecione uma categoria de serviço");
      return;
    }

    if (!formData.professionalDescription.trim()) {
      showError("Por favor, descreva seus serviços");
      return;
    }

    if (!formData.professionalCity.trim()) {
      showError("Por favor, preencha sua cidade de atuação");
      return;
    }

    if (!formData.professionalProvince) {
      showError("Por favor, selecione sua província de atuação");
      return;
    }

    if (!formData.professionalWhatsapp.trim()) {
      showError("Por favor, preencha seu WhatsApp profissional");
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
      console.log("🔧 Iniciando cadastro de PRESTADOR:", formData.email);
      
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            user_type: 'prestador',
            role: 'prestador'
          }
        }
      });

      if (authError) {
        console.error("❌ Erro no auth.signUp:", authError);
        showError(authError.message || "Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      console.log("✅ Prestador criado no Auth:", authData.user);

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

      // 4. Criar perfil de prestador no banco
      const profileData = {
        user_id: session.user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        user_type: 'prestador',
        role: 'prestador',
        professional_name: formData.professionalName,
        professional_profession: formData.professionalProfession,
        professional_category: formData.professionalCategory,
        professional_description: formData.professionalDescription,
        professional_experience_years: formData.professionalExperienceYears ? parseInt(formData.professionalExperienceYears) : null,
        professional_hourly_rate: formData.professionalHourlyRate ? parseFloat(formData.professionalHourlyRate) : null,
        professional_min_price: formData.professionalMinPrice ? parseFloat(formData.professionalMinPrice) : null,
        professional_whatsapp: formData.professionalWhatsapp,
        professional_city: formData.professionalCity,
        professional_province: formData.professionalProvince,
        professional_home_service: formData.professionalHomeService,
        professional_service_radius_km: formData.professionalServiceRadiusKm ? parseFloat(formData.professionalServiceRadiusKm) : null
      };

      console.log("📊 Dados do perfil PRESTADOR:", profileData);

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

        console.log("✅ Perfil de prestador criado:", result);
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
              p_address: formData.professionalCity,
              p_user_type: 'prestador',
              p_role: 'prestador'
            });

          if (error) {
            console.error("❌ Erro na tentativa 2:", error);
            throw error;
          }

          console.log("✅ Perfil de prestador criado via RPC:", result);
          profileResult = result;
        } catch (error2) {
          console.error("❌ Falha ao criar perfil:", error2);
        }
      }

      console.log("🎉 Cadastro de PRESTADOR concluído com sucesso!");
      
      showSuccess("Perfil profissional criado com sucesso! Você já pode oferecer seus serviços.");
      
      // 5. Redirecionar para dashboard do prestador
      setTimeout(() => {
        navigate('/prestador-dashboard');
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
    } else if (step === 2 && formData.professionalName && formData.professionalProfession) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">LojaRapida</span>
            </Link>
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Provider Benefits */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
                  <Wrench className="h-4 w-4 mr-2" />
                  Cadastro de Prestador
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Ofereça seus serviços para 
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> milhares</span> 
                  <br />de clientes em Moçambique
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Cadastre-se como prestador e encontre clientes para seus serviços 
                  profissionais. Receba pagamentos na conclusão do trabalho.
                </p>
              </div>

              <div className="space-y-6">
                {providerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-purple-600">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">5,000+ Prestadores</h3>
                    <p className="text-purple-100">Já oferecem serviços na LojaRapida</p>
                  </div>
                  <Wrench className="h-12 w-12 text-white/50" />
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Cadastrar como Prestador</CardTitle>
                  <CardDescription>
                    Cadastre seus serviços profissionais
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= stepNumber 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
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
                            step > stepNumber ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'
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
                          <Label htmlFor="email">Email Profissional</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="seu@servico.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone Profissional</Label>
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
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Continuar
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4 animate-in slide-in-from-right">
                        <div>
                          <Label htmlFor="professionalName">Nome Profissional</Label>
                          <Input
                            id="professionalName"
                            name="professionalName"
                            type="text"
                            required
                            placeholder="João Silva - Eletricista"
                            value={formData.professionalName}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="professionalProfession">Profissão</Label>
                          <Select onValueChange={(value) => handleSelectChange('professionalProfession', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione sua profissão" />
                            </SelectTrigger>
                            <SelectContent>
                              {professions.map(profession => (
                                <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="professionalCategory">Categoria de Serviço</Label>
                          <Select onValueChange={(value) => handleSelectChange('professionalCategory', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="professionalDescription">Descrição dos Serviços</Label>
                          <Textarea
                            id="professionalDescription"
                            name="professionalDescription"
                            required
                            placeholder="Descreva seus serviços, experiência e diferenciais..."
                            value={formData.professionalDescription}
                            onChange={handleInputChange}
                            rows={4}
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
                            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                            <Label htmlFor="professionalCity">Cidade de Atuação</Label>
                            <Input
                              id="professionalCity"
                              name="professionalCity"
                              type="text"
                              required
                              placeholder="Maputo"
                              value={formData.professionalCity}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div>
                            <Label htmlFor="professionalProvince">Província de Atuação</Label>
                            <select
                              id="professionalProvince"
                              name="professionalProvince"
                              required
                              value={formData.professionalProvince}
                              onChange={handleInputChange}
                              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="">Selecione uma província</option>
                              {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="professionalWhatsapp">WhatsApp Profissional</Label>
                          <Input
                            id="professionalWhatsapp"
                            name="professionalWhatsapp"
                            type="tel"
                            required
                            placeholder="+258 84 123 4567"
                            value={formData.professionalWhatsapp}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="professionalExperienceYears">Anos de Experiência</Label>
                            <Input
                              id="professionalExperienceYears"
                              name="professionalExperienceYears"
                              type="number"
                              placeholder="5"
                              value={formData.professionalExperienceYears}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div>
                            <Label htmlFor="professionalHourlyRate">Valor por Hora (MT)</Label>
                            <Input
                              id="professionalHourlyRate"
                              name="professionalHourlyRate"
                              type="number"
                              placeholder="500"
                              value={formData.professionalHourlyRate}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div>
                            <Label htmlFor="professionalMinPrice">Preço Mínimo (MT)</Label>
                            <Input
                              id="professionalMinPrice"
                              name="professionalMinPrice"
                              type="number"
                              placeholder="1000"
                              value={formData.professionalMinPrice}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="professionalServiceRadiusKm">Raio de Atendimento (km)</Label>
                            <Input
                              id="professionalServiceRadiusKm"
                              name="professionalServiceRadiusKm"
                              type="number"
                              placeholder="20"
                              value={formData.professionalServiceRadiusKm}
                              onChange={handleInputChange}
                              className="h-12"
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              id="professionalHomeService"
                              name="professionalHomeService"
                              type="checkbox"
                              checked={formData.professionalHomeService}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="professionalHomeService">Atende em domicílio</Label>
                          </div>
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
                                placeholder="•••••••••••••••"
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
                                placeholder="•••••••••••••••"
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
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-600">
                            Eu concordo com os{' '}
                            <Link to="/termos" className="text-purple-600 hover:text-purple-500 underline">
                              termos de serviço
                            </Link>{' '}
                            e{' '}
                            <Link to="/privacidade" className="text-purple-600 hover:text-purple-500 underline">
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
                            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            disabled={loading}
                          >
                            {loading ? "Cadastrando..." : "Cadastrar Serviços"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center border-t pt-6">
                    <p className="text-sm text-gray-600 mb-3">É cliente ou vendedor?</p>
                    <div className="flex space-x-3">
                      <Link to="/register" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                        Cadastre-se como Cliente
                      </Link>
                      <span className="text-gray-400">•</span>
                      <Link to="/register-vendedor" className="text-green-600 hover:text-green-500 text-sm font-medium">
                        Cadastre-se como Vendedor
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

export default RegisterPrestador;