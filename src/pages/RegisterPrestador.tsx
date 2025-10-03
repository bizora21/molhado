import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Wrench, ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const RegisterPrestador = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para início
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Wrench className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cadastrar como Prestador de Serviços
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Faça login
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar seus serviços na LojaRapida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Seu Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="João Silva"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@servico.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+258 84 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalWhatsapp">WhatsApp</Label>
                  <Input
                    id="professionalWhatsapp"
                    name="professionalWhatsapp"
                    type="tel"
                    required
                    placeholder="+258 84 123 4567"
                    value={formData.professionalWhatsapp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalName">Nome Profissional ou Nome da Empresa</Label>
                <Input
                  id="professionalName"
                  name="professionalName"
                  type="text"
                  required
                  placeholder="João Silva - Eletricista"
                  value={formData.professionalName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalProfession">Profissão</Label>
                <Input
                  id="professionalProfession"
                  name="professionalProfession"
                  type="text"
                  required
                  placeholder="Eletricista, Encanador, Designer, etc."
                  value={formData.professionalProfession}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professionalExperienceYears">Anos de Experiência</Label>
                  <Input
                    id="professionalExperienceYears"
                    name="professionalExperienceYears"
                    type="number"
                    placeholder="5"
                    value={formData.professionalExperienceYears}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalHourlyRate">Valor por Hora (MT)</Label>
                  <Input
                    id="professionalHourlyRate"
                    name="professionalHourlyRate"
                    type="number"
                    placeholder="500"
                    value={formData.professionalHourlyRate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalMinPrice">Preço Mínimo (MT)</Label>
                  <Input
                    id="professionalMinPrice"
                    name="professionalMinPrice"
                    type="number"
                    placeholder="1000"
                    value={formData.professionalMinPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professionalServiceRadiusKm">Raio de Atendimento (km)</Label>
                  <Input
                    id="professionalServiceRadiusKm"
                    name="professionalServiceRadiusKm"
                    type="number"
                    placeholder="20"
                    value={formData.professionalServiceRadiusKm}
                    onChange={handleInputChange}
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

                <div className="space-y-2">
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Eu concordo com os{' '}
                  <Link to="/termos" className="text-purple-600 hover:text-purple-500">
                    termos de serviço
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacidade" className="text-purple-600 hover:text-purple-500">
                    política de privacidade
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Serviços"}
              </Button>
            </form>

            <div className="mt-6 text-center">
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
  );
};

export default RegisterPrestador;