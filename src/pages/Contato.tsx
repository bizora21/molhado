import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const Contato = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulação de envio de formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      showError("Erro ao enviar mensagem. Tente novamente.");
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

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      value: "+258 86 318 1415",
      description: "Segunda a Sexta, 8h às 18h"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "contato@lojarapida.co.mz",
      description: "Resposta em até 24 horas"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Endereço",
      value: "Av. Julius Nyerere, 1234, Maputo",
      description: "Moçambique"
    }
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
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LojaRapida</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-blue-600">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-blue-600">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais rápido possível.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">Informações de Contato</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como podemos ajudar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha a melhor forma de entrar em contato conosco
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">{info.icon}</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                  <p className="text-blue-600 font-medium mb-1">{info.value}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entraremos em contato em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="Assunto da mensagem"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Descreva sua mensagem aqui..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Respostas rápidas para as perguntas mais comuns
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Como faço para me tornar um vendedor?</h3>
                <p className="text-gray-600">
                  Simples! Clique em "Cadastrar" e escolha a opção "Vendedor". 
                  Preencha suas informações e da sua loja, e comece a vender imediatamente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Quais são as taxas da plataforma?</h3>
                <p className="text-gray-600">
                  A LojaRapida cobra uma comissão de 10% sobre cada venda realizada através da plataforma.
                  Não há taxas de cadastro ou mensais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Como funciona a entrega?</h3>
                <p className="text-gray-600">
                  Cada vendedor define suas próprias opções de entrega. 
                  Alguns oferecem entrega própria, outros usam serviços de terceiros.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">É seguro comprar na plataforma?</h3>
                <p className="text-gray-600">
                  Sim! Implementamos medidas de segurança avançadas e recomendamos 
                  verificar as credenciais dos vendedores antes de comprar.
                </p>
              </CardContent>
            </Card>
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

export default Contato;