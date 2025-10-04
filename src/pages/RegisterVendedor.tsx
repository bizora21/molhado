import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Store, ArrowLeft, Upload, CheckCircle } from "lucide-react";
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
    storeOpeningHours: "",
    storeWhatsapp: "",
    storeAcceptsDelivery: false,
    storeDeliveryRadiusKm: "",
    storeDeliveryFee: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const benefits = [
    { icon: <CheckCircle className="h-6 w-6" />, title: "Venda Imediata", description: "Comece a vender assim que se cadastrar" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Gestão Simples", description: "Painel intuitivo para gerenciar seus produtos" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Alcance Ampliado", description: "Acesse milhares de clientes em Moçambique" }
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
              user_type: 'vendedor',
              role: 'vendedor',
              store_name: formData.storeName,
              store_category: formData.storeCategory,
              store_description: formData.storeDescription,
              store_opening_hours: formData.storeOpeningHours,
              store_whatsapp: formData.storeWhatsapp,
              store_accepts_delivery: formData.storeAcceptsDelivery,
              store_delivery_radius_km: formData.storeDeliveryRadiusKm ? parseFloat(formData.storeDeliveryRadiusKm) : null,
              store_delivery_fee: formData.storeDeliveryFee ? parseFloat(formData.storeDeliveryFee) : null,
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
    } else if (step === 2 && formData.storeName && formData.storeCategory) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
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
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <div className="bg-green-100 text-green-800 hover:bg-green-200 mb-4 w-fit px-3 py-1 rounded-full text-sm font-medium">
                  Cadastre-se como Vendedor
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Venda seus produtos para 
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> milhares</span> 
                  <br />de clientes em Moçambique
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Crie sua loja online em minutos e comece a vender imediatamente
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
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
                    Preencha os dados para começar a vender
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
                          <Label htmlFor="email">Email</Label>
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
                              <SelectItem value="alimentos">Alimentos e Bebidas</SelectItem>
                              <SelectItem value="roupas">Roupas e Acessórios</SelectItem>
                              <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                              <SelectItem value="moveis">Móveis e Decoração</SelectItem>
                              <SelectItem value="saude">Saúde e Beleza</SelectItem>
                              <SelectItem value="esportes">Esportes e Lazer</SelectItem>
                              <SelectItem value="livros">Livros e Papelaria</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
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
                            placeholder="Av. Julius Nyerere, 1234, Maputo"
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
                          <Label htmlFor="storeWhatsapp">WhatsApp</Label>
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

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Quer comprar produtos ou contratar serviços?{' '}
                      <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                        Cadastre-se como Cliente
                      </Link>{' '}
                      ou{' '}
                      <Link to="/register-prestador" className="font-medium text-green-600 hover:text-green-500">
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

export default RegisterVendedor;