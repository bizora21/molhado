import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, Store, Wrench, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch featured products
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active')
        .limit(6);
      
      if (!error && data) {
        setFeaturedProducts(data);
      }
    };

    // Fetch featured services
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .limit(6);
      
      if (!error && data) {
        setFeaturedServices(data);
      }
    };

    fetchProducts();
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">LojaRapida</h1>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-blue-600">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-blue-600">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos ou serviços..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button>Cadastrar</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Bem-vindo à LojaRapida
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A maior plataforma de e-commerce e serviços de Moçambique. Compre produtos, 
            encontre serviços profissionais e cresça seu negócio.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Começar a Comprar
              </Button>
            </Link>
            <Link to="/register-vendedor">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                Vender na LojaRapida
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Como você quer usar a LojaRapida?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Cliente</CardTitle>
                <CardDescription>
                  Compre produtos de qualidade e encontre serviços profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Compre produtos de vendedores locais</li>
                  <li>✓ Encontre serviços profissionais</li>
                  <li>✓ Agende serviços online</li>
                  <li>✓ Pagamento seguro e rápido</li>
                </ul>
                <Link to="/register">
                  <Button className="w-full">Cadastrar como Cliente</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Store className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Vendedor</CardTitle>
                <CardDescription>
                  Venda seus produtos e alcance mais clientes em Moçambique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Crie sua loja online</li>
                  <li>✓ Gerencie produtos e estoque</li>
                  <li>✓ Receba pagamentos seguros</li>
                  <li>✓ Acompanhe vendas em tempo real</li>
                </ul>
                <Link to="/register-vendedor">
                  <Button className="w-full">Cadastrar como Vendedor</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Wrench className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Prestador de Serviços</CardTitle>
                <CardDescription>
                  Ofereça seus serviços e encontre novos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Crie seu perfil profissional</li>
                  <li>✓ Ofereça seus serviços</li>
                  <li>✓ Gerencie agendamentos</li>
                  <li>✓ Receba avaliações de clientes</li>
                </ul>
                <Link to="/register-prestador">
                  <Button className="w-full">Cadastrar como Prestador</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold">Produtos em Destaque</h3>
            <Link to="/produtos">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h4>
                  <p className="text-blue-600 font-bold">MT {product.price}</p>
                  <Badge variant="secondary" className="text-xs mt-2">
                    {product.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold">Serviços em Destaque</h3>
            <Link to="/servicos">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{service.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{service.category}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-bold text-lg">MT {service.price}</p>
                    <Button size="sm">Agendar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher a LojaRapida?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h4 className="font-semibold mb-2">Compras Seguras</h4>
              <p className="text-blue-100">Pagamento protegido e garantia de devolução</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="font-semibold mb-2">Foco Local</h4>
              <p className="text-blue-100">Produtos e serviços de todo Moçambique</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8" />
              </div>
              <h4 className="font-semibold mb-2">Serviços Profissionais</h4>
              <p className="text-blue-100">Prestadores verificados e qualificados</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8" />
              </div>
              <h4 className="font-semibold mb-2">Suporte 24/7</h4>
              <p className="text-blue-100">Atendimento ao cliente sempre disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">LojaRapida</h4>
              <p className="text-gray-400">
                A maior plataforma de e-commerce e serviços de Moçambique.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Para Clientes</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/produtos" className="hover:text-white">Produtos</Link></li>
                <li><Link to="/servicos" className="hover:text-white">Serviços</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/ajuda" className="hover:text-white">Ajuda</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Para Vendedores</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register-vendedor" className="hover:text-white">Cadastrar Loja</Link></li>
                <li><Link to="/vendedor-dashboard" className="hover:text-white">Painel</Link></li>
                <li><Link to="/taxas" className="hover:text-white">Taxas</Link></li>
                <li><Link to="/suporte-vendedor" className="hover:text-white">Suporte</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@lojarapida.co.mz</li>
                <li>Telefone: +258 84 123 4567</li>
                <li>WhatsApp: +258 84 123 4567</li>
                <li><Link to="/contato" className="hover:text-white">Fale Conosco</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LojaRapida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;