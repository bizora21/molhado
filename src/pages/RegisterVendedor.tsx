import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Store, ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const RegisterVendedor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para início
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Store className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cadastrar sua Loja
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Faça login
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar sua loja na LojaRapida
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
                    placeholder="sua@loja.com"
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
                  <Label htmlFor="storeWhatsapp">WhatsApp</Label>
                  <Input
                    id="storeWhatsapp"
                    name="storeWhatsapp"
                    type="tel"
                    required
                    placeholder="+258 84 123 4567"
                    value={formData.storeWhatsapp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  placeholder="Minha Loja Ltda"
                  value={formData.storeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Endereço da Loja</Label>
                <Input
                  id="storeAddress"
                  name="storeAddress"
                  type="text"
                  required
                  placeholder="Av. Julius Nyerere, 1234, Maputo"
                  value={formData.storeAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeOpeningHours">Horário de Funcionamento</Label>
                <Input
                  id="storeOpeningHours"
                  name="storeOpeningHours"
                  type="text"
                  required
                  placeholder="Seg-Sex: 8h-18h, Sáb: 8h-13h"
                  value={formData.storeOpeningHours}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeDeliveryRadiusKm">Raio de Entrega (km)</Label>
                  <Input
                    id="storeDeliveryRadiusKm"
                    name="storeDeliveryRadiusKm"
                    type="number"
                    placeholder="10"
                    value={formData.storeDeliveryRadiusKm}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDeliveryFee">Taxa de Entrega (MT)</Label>
                  <Input
                    id="storeDeliveryFee"
                    name="storeDeliveryFee"
                    type="number"
                    placeholder="50"
                    value={formData.storeDeliveryFee}
                    onChange={handleInputChange}
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
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Eu concordo com os{' '}
                  <Link to="/termos" className="text-green-600 hover:text-green-500">
                    termos de serviço
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacidade" className="text-green-600 hover:text-green-500">
                    política de privacidade
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Loja"}
              </Button>
            </form>

            <div className="mt-6 text-center">
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
  );
};

export default RegisterVendedor;