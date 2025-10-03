import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

const AdicionarProduto = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: "",
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
        .from('products')
        .insert([
          {
            store_id: user.id,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity),
            category: formData.category,
            image_url: formData.image_url || null,
            is_active: true,
            status: 'active'
          }
        ]);

      if (error) {
        showError(error.message);
        return;
      }

      showSuccess("Produto adicionado com sucesso!");
      navigate('/vendedor-dashboard');
    } catch (error) {
      showError("Erro ao adicionar produto");
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
              <Link to="/vendedor-dashboard" className="flex items-center text-green-600 hover:text-green-500">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-green-600">Adicionar Produto</h1>
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
                <Package className="h-5 w-5" />
                Novo Produto
              </CardTitle>
              <CardDescription>
                Preencha as informações do produto que deseja vender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ex: iPhone 15 Pro Max"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Descreva seu produto com detalhes..."
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
                    <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      required
                      placeholder="0"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select onValueChange={(value) => handleSelectChange('category', value)}>
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
                  <Label htmlFor="image_url">URL da Imagem (opcional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Adicionando..." : "Adicionar Produto"}
                  </Button>
                  <Link to="/vendedor-dashboard">
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

export default AdicionarProduto;