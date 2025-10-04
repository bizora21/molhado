import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Wrench, ArrowLeft, Upload, CheckCircle } from "lucide-react";
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
    professionalHomeService: false,
    professionalServiceRadiusKm: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const benefits = [
    { icon: <CheckCircle className="h-6 w-6" />, title: "Clientes Imediatos", description: "Receba solicitações assim que se cadastrar" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Agendamento Fácil", description: "Gerencie seus serviços com calendário integrado" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Pagamento Seguro", description: "Receba pagamentos com segurança e rapidez" }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) {
        showError(error.message);
        return;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
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
              professional_home_service: formData.professionalHomeService,
              professional_service_radius_km: formData.professionalServiceRadiusKm ? parseFloat(formData.professionalServiceRadiusKm) : null,
            }
          ]);

        if (profileError) {
          showError("Erro ao criar perfil");
          return;
        }

        showSuccess("Cadastro realizado com sucesso! Verifique seu email.");
        navigate('/login');
      }
    } catch (error) {
      showError("Erro ao realizar cadastro");
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
      {/* Header */}
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
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <div className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4 w-fit px-3 py-1 rounded-full text-sm font-medium">
                  Cadastre-se como Prestador
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Ofereça seus serviços para 
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> milhares</span> 
                  <br />de clientes em Moçambique
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Cadastre seus serviços profissionais e comece a receber solicitações imediatamente
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
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
                    Preencha os dados para oferecer seus serviços
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
                          <Label htmlFor="email">Email</Label>
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
                          <Input
                            id="professionalProfession"
                            name="professionalProfession"
                            type="text"
                            required
                            placeholder="Eletricista, Encanador, Designer, etc."
                            value={formData.professionalProfession}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="professionalCategory">Categoria de Serviço</Label>
                          <Select onValueChange={(value) => handleSelectChange('professionalCategory', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="construcao">Construção e Reformas</SelectItem>
                              <SelectItem value="eletrica">Elétrica e Hidráulica</SelectItem>
                              <SelectItem value="informatica">Informática e Tecnologia</SelectItem>
                              <SelectItem value="design">Design e Criatividade</SelectItem>
                              <SelectItem value="educacao">Educação e Treinamento</SelectItem>
                              <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                              <SelectItem value="beleza">Beleza e Estética</SelectItem>
                              <SelectItem value="consultoria">Consultoria e Negócios</SelectItem>
                              <SelectItem value="outros">Outros Serviços</SelectItem>
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

                        <div>
                          <Label htmlFor="professionalWhatsapp">WhatsApp</Label>
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
                                placeholder="••••••••"
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
                                placeholder="••••••••"
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

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Quer comprar produtos ou vender itens?{' '}
                      <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
                        Cadastre-se como Cliente
                      </Link>{' '}
                      ou{' '}
                      <Link to="/register-vendedor" className="font-medium text-purple-600 hover:text-purple-500">
                        Vendedor
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

export default RegisterPrestador;