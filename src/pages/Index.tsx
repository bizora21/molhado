import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Wrench, 
  Store, 
  Star, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Menu,
  X,
  Search,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
  Crown,
  Package,
  CreditCard,
  Handshake,
  Lock
} from "lucide-react";
import Chatbot from '@/components/Chatbot';

const Index: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Store className="h-8 w-8" />,
      title: "Vendedores Locais",
      description: "Conectamos você com os melhores vendedores e comerciantes da sua região",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Serviços Profissionais",
      description: "Encontre profissionais qualificados e confiáveis para todas as suas necessidades",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Pagamento na Entrega",
      description: "Pague somente quando receber seu produto. Segurança e confiança garantidas",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Entrega Rápida",
      description: "Receba seus produtos e serviços de forma rápida e eficiente em todo Moçambique",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Vendedores Ativos" },
    { number: "50,000+", label: "Produtos Cadastrados" },
    { number: "5,000+", label: "Serviços Oferecidos" },
    { number: "100,000+", label: "Clientes Satisfeitos" }
  ];

  const categories = [
    { name: "Eletrônicos", icon: "📱", count: 1234 },
    { name: "Moda", icon: "👕", count: 892 },
    { name: "Casa & Jardim", icon: "🏠", count: 756 },
    { name: "Serviços", icon: "🔧", count: 543 },
    { name: "Alimentos", icon: "🍔", count: 432 },
    { name: "Saúde", icon: "💊", count: 321 }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Cliente",
      content: "A melhor plataforma para comprar produtos locais. Entrega sempre no prazo e pago só quando recebo!",
      rating: 5
    },
    {
      name: "João Mendes",
      role: "Vendedor",
      content: "A LojaRapida transformou meu negócio. Mais clientes e segurança nas transações.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Prestadora",
      content: "Encontrei muitos clientes através da plataforma. O sistema de pagamento na entrega dá confiança.",
      rating: 5
    }
  ];

  const userTypes = [
    {
      title: "Para Clientes",
      description: "Compre com segurança dos melhores vendedores locais",
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "from-blue-600 to-blue-700",
      link: "/register",
      features: [
        "Pague na entrega",
        "Produtos verificados",
        "Suporte ao cliente",
        "Devolução garantida"
      ]
    },
    {
      title: "Para Vendedores",
      description: "Venda para milhares de clientes em todo Moçambique",
      icon: <Store className="h-8 w-8" />,
      color: "from-green-600 to-green-700",
      link: "/register-vendedor",
      features: [
        "Sem taxas de cadastro",
        "Acesso a 100.000+ clientes",
        "Pagamento garantido",
        "Dashboard completo"
      ]
    },
    {
      title: "Para Prestadores",
      description: "Ofereça seus serviços e alcance mais clientes",
      icon: <Wrench className="h-8 w-8" />,
      color: "from-purple-600 to-purple-700",
      link: "/register-prestador",
      features: [
        "Agendamento online",
        "Pagamento na prestação",
        "Avaliações de clientes",
        "Gestão de serviços"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2" aria-label="LojaRapida - Página inicial">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LojaRapida</span>
              </Link>
              
              <nav className="hidden lg:flex space-x-8" role="navigation">
                <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium transition-colors" aria-current="page">Início</Link>
                <Link to="/produtos" className="text-gray-600 hover:text-blue-600 transition-colors">Produtos</Link>
                <Link to="/servicos" className="text-gray-600 hover:text-blue-600 transition-colors">Serviços</Link>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
                <Input 
                  placeholder="Buscar produtos..." 
                  className="border-0 bg-transparent focus:ring-0 w-48"
                  aria-label="Buscar produtos"
                />
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Cadastrar
                  </Button>
                </Link>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link to="/" className="block text-gray-900 hover:text-blue-600 font-medium" aria-current="page">Início</Link>
              <Link to="/produtos" className="block text-gray-600 hover:text-blue-600">Produtos</Link>
              <Link to="/servicos" className="block text-gray-600 hover:text-blue-600">Serviços</Link>
              <Link to="/blog" className="block text-gray-600 hover:text-blue-600">Blog</Link>
              <div className="flex space-x-3 pt-3 border-t">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Entrar</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Cadastrar</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 w-fit">
                🛒 A maior plataforma de e-commerce de Moçambique
              </Badge>
              <h1 id="hero-title" className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Conectando 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Negócios</span> 
                <br />e 
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Clientes</span> 
                <br />em Todo Moçambique
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A plataforma mais segura para comprar e vender. 
                Pague somente na entrega e tenha a garantia de receber exatamente o que comprou.
              </p>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">10,000+</div>
                  <div className="text-sm text-gray-600">Vendedores</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600 mb-1">50,000+</div>
                  <div className="text-sm text-gray-600">Produtos</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600 mb-1">100,000+</div>
                  <div className="text-sm text-gray-600">Clientes</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Seguro</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento na Entrega</h3>
                  <p className="text-gray-600 mb-4">100% Seguro e Confiável</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Pague só quando receber</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Sem risco para o cliente</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Garantia de qualidade</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">Suporte ao cliente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white" aria-labelledby="usertypes-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">Para Todos</Badge>
            <h2 id="usertypes-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Uma Plataforma para Todos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seja você cliente, vendedor ou prestador de serviços, temos a solução ideal para você
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">{userType.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{userType.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {userType.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={userType.link} className="block">
                    <Button className={`w-full bg-gradient-to-r ${userType.color} hover:opacity-90 text-white font-medium`}>
                      Começar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="features-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">Por que a LojaRapida?</Badge>
            <h2 id="features-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Segurança e Confiança em Primeiro Lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recursos pensados para proteger tanto clientes quanto vendedores
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="stats-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Números que Demonstram Confiança
            </h2>
            <p className="text-xl text-gray-600">
              Resultados reais da nossa comunidade
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="categories-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">Categorias Populares</Badge>
            <h2 id="categories-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Encontre de Tudo um Pouco
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diversas categorias para todas as suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to="/produtos" className="group">
                <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl" aria-hidden="true">{category.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">{category.count} produtos</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">Depoimentos</Badge>
            <h2 id="testimonials-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Quem Confia na LojaRapida
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Histórias reais de sucesso da nossa comunidade
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-labelledby="cta-title">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-title" className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para Fazer Parte da Nossa Comunidade?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de clientes, vendedores e prestadores que já confiam na LojaRapida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold">
                  <Users className="h-5 w-5 mr-2" />
                  Cadastre-se como Cliente
                </Button>
              </Link>
              <Link to="/register-vendedor">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 font-bold">
                  <Store className="h-5 w-5 mr-2" />
                  Cadastre-se como Vendedor
                </Button>
              </Link>
              <Link to="/register-prestador">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 font-bold">
                  <Wrench className="h-5 w-5 mr-2" />
                  Cadastre-se como Prestador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold">LojaRapida</span>
              </div>
              <p className="text-gray-400 mb-4">
                A plataforma mais segura de e-commerce e serviços de Moçambique
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" aria-label="Facebook" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" aria-label="Instagram" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" aria-label="Twitter" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre nós</Link></li>
                <li><Link to="/carreiras" className="hover:text-white transition-colors">Carreiras</Link></li>
                <li><Link to="/imprensa" className="hover:text-white transition-colors">Imprensa</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Para Vendedores</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register-vendedor" className="hover:text-white transition-colors">Começar a Vender</Link></li>
                <li><Link to="/vendedor-dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/adicionar-produto" className="hover:text-white transition-colors">Adicionar Produtos</Link></li>
                <li><Link to="/termos" className="hover:text-white transition-colors">Taxas e Comissões</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/ajuda" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link to="/termos" className="hover:text-white transition-colors">Termos de Serviço</Link></li>
                <li><Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LojaRapida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      
      <Chatbot />
    </div>
  );
};

export default Index;