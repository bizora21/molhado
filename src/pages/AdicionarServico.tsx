import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const AdicionarServico = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        showError("Usuário não autenticado");
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .insert([
          {
            provider_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            is_active: true
          }
        ]);

      if (error) {
        showError(error.message);
        return;
      }

      showSuccess("Serviço adicionado com sucesso!");
      navigate('/prestador-dashboard');
    } catch (error) {
      showError("Erro ao adicionar serviço");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/prestador-dashboard" className="flex items-center text-purple-600 hover:text-purple-500">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-purple-600">Adicionar Serviço</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Novo Serviço
              </CardTitle>
              <CardDescription>
                Preencha as informações do serviço que deseja oferecer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Serviço</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Ex: Instalação Elétrica Residencial"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Descreva seu serviço com detalhes..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (MT)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)}>
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
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? "Adicionando..." : "Adicionar Serviço"}
                  </Button>
                  <Link to="/prestador-dashboard">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdicionarServico;