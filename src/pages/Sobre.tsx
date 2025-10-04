import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Store, Wrench, Globe, Award, Target, Heart } from "lucide-react";

const Sobre = () => {
  const team = [
    {
      name: "João Silva",
      role: "CEO & Fundador",
      description: "Empreendedor com 10+ anos de experiência em e-commerce"
    },
    {
      name: "Maria Santos",
      role: "CTO",
      description: "Especialista em tecnologia e desenvolvimento de plataformas"
    },
    {
      name: "Pedro Mendes",
      role: "Head de Operações",
      description: "Especialista em logística e gestão de supply chain"
    }
  ];

  const milestones = [
    { year: "2020", title: "Fundação da LojaRapida", description: "Início das operações com 10 vendedores" },
    { year: "2021", title: "Expansão Nacional", description: "Presença em todas as províncias de Moçambique" },
    { year: "2022", title: "100.000+ Usuários", description: "Marco importante de crescimento" },
    { year: "2023", title: "Lançamento de Serviços", description: "Nova área de prestadores de serviços" },
    { year: "2024", title: "Inovação Tecnológica", description: "Atualização completa da plataforma" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LojaRapida</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-blue-600">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-blue-600">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
                <Link to="/sobre" className="text-blue-600 font-medium">Sobre</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/">
                <Button>Página Inicial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Sobre a LojaRapida</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Conectando negócios e oportunidades em Moçambique desde 2020
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">Nossa Missão</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Transformar o comércio local em Moçambique
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A LojaRapida nasceu com o propósito de digitalizar o comércio local, 
                conectando vendedores e prestadores de serviços diretamente com clientes 
                em todo o território moçambicano.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Acreditamos no potencial dos negócios locais e na força da comunidade 
                para criar uma economia mais inclusiva e próspera.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Missão</h3>
                  <p className="text-sm text-gray-600">
                    Facilitar o acesso ao mercado para pequenos e médios negócios
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Visão</h3>
                  <p className="text-sm text-gray-600">
                    Ser a maior plataforma de e-commerce da África Austral
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Valores</h3>
                  <p className="text-sm text-gray-600">
                    Confiança, inovação e comunidade
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Qualidade</h3>
                  <p className="text-sm text-gray-600">
                    Excelência em tudo o que fazemos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossos Números
            </h2>
            <p className="text-xl text-gray-600">
              Crescimento exponencial desde a nossa fundação
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">100,000+</div>
              <div className="text-gray-600">Clientes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Vendedores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">5,000+</div>
              <div className="text-gray-600">Prestadores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">50,000+</div>
              <div className="text-gray-600">Produtos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossa História
            </h2>
            <p className="text-xl text-gray-600">
              Marcos importantes na nossa jornada
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="w-1/2"></div>
                <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white z-10"></div>
                <div className="w-1/2 px-8">
                  <Card>
                    <CardContent className="p-6">
                      <Badge className="bg-blue-100 text-blue-800 mb-2">{milestone.year}</Badge>
                      <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600">
              As pessoas por trás do sucesso da LojaRapida
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Junte-se à Nossa Comunidade
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Seja cliente, vendedor ou prestador de serviços - há um lugar para você na LojaRapida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Começar Agora
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 LojaRapida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;