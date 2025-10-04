import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Package } from "lucide-react";

const Termos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
            <p className="text-xl text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  1. Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Ao acessar e usar a plataforma LojaRapida, você concorda com estes Termos de Serviço. 
                  Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  2. Uso da Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Você concorda em usar a plataforma apenas para fins legais e de acordo com estas condições:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Não violar quaisquer leis aplicáveis locais, nacionais ou internacionais</li>
                    <li>Não infringir direitos de terceiros, incluindo direitos de propriedade intelectual</li>
                    <li>Não transmitir material que seja ofensivo, difamatório ou inadequado</li>
                    <li>Não usar a plataforma para fins fraudulentos ou enganosos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  3. Produtos e Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>
                    A LojaRapida funciona como uma plataforma que conecta vendedores e prestadores de serviços com clientes.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Não somos responsáveis pela qualidade dos produtos e serviços oferecidos</li>
                    <li>As transações são realizadas diretamente entre compradores e vendedores</li>
                    <li>Recomendamos verificar as credenciais dos vendedores antes de comprar</li>
                    <li>Disputas devem ser resolvidas diretamente entre as partes envolvidas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Todos os pagamentos processados através da plataforma são seguros e criptografados.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Aceitamos pagamentos via PIX, transferência bancária e cartão</li>
                    <li>A LojaRapida não armazena informações de cartão de crédito</li>
                    <li>Reembolsos estão sujeitos à política de cada vendedor</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Privacidade e Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Sua privacidade é importante para nós. Nossa Política de Privacidade explica como 
                  coletamos, usamos e protegemos suas informações quando você usa nossa plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Todo o conteúdo da LojaRapida, incluindo logos, textos, gráficos, design e funcionalidades, 
                  é protegido por direitos autorais e outras leis de propriedade intelectual.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  A LojaRapida não será responsável por quaisqueres danos diretos, indiretos, 
                  incidentais, especiais ou consequenciais resultantes do uso ou da incapacidade 
                  de usar a plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Alterações nos Termos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Reservamos o direito de modificar estes Termos de Serviço a qualquer momento. 
                  O uso continuado da plataforma após quaisquer alterações constitui aceitação desses termos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: contato@lojarapida.co.mz</p>
                  <p>Telefone: +258 86 318 1415</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 LojaRapida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Termos;