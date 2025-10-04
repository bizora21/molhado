import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database } from "lucide-react";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-xl text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  1. Compromisso com a Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Na LojaRapida, estamos comprometidos em proteger sua privacidade e garantir 
                  a segurança de suas informações pessoais. Esta Política de Privacidade explica 
                  como coletamos, usamos, compartilham e protegemos seus dados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  2. Informações que Coletamos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>Coletamos as seguintes informações para fornecer nossos serviços:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Informações de Conta:</strong> Nome, email, telefone, endereço</li>
                    <li><strong>Informações de Perfil:</strong> Foto de perfil, preferências</li>
                    <li><strong>Informações de Transação:</strong> Histórico de compras e pagamentos</li>
                    <li><strong>Informações de Uso:</strong> Como você interage com nossa plataforma</li>
                    <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, dispositivo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Como Usamos Suas Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>Usamos suas informações para:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fornecer e manter nossos serviços</li>
                    <li>Processar transações e enviar confirmações</li>
                    <li>Comunicar com você sobre sua conta</li>
                    <li>Melhorar nossos serviços e personalizar sua experiência</li>
                    <li>Enviar informações promocionais (com seu consentimento)</li>
                    <li>Proteger contra fraudes e atividades abusivas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Compartilhamento de Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>Não vendemos, alugamos ou compartilamos suas informações pessoais com terceiros, exceto:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Com seu consentimento explícito</li>
                    <li>Para processar pagamentos com nossos parceiros financeiros</li>
                    <li>Quando exigido por lei ou para proteger nossos direitos</li>
                    <li>Com vendedores quando você realiza uma compra</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  5. Seus Direitos de Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>Você tem os seguintes direitos em relação às suas informações:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Acesso:</strong> Solicitar uma cópia de seus dados</li>
                    <li><strong>Correção:</strong> Atualizar informações incorretas</li>
                    <li><strong>Exclusão:</strong> Solicitar remoção de seus dados</li>
                    <li><strong>Portabilidade:</strong> Transferir seus dados para outro serviço</li>
                    <li><strong>Restrição:</strong> Limitar o processamento de seus dados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Segurança dos Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger 
                  suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Retenção de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Mantemos suas informações apenas pelo tempo necessário para fornecer nossos 
                  serviços e cumprir obrigações legais. Quando não forem mais necessários, 
                  as informações são deletadas ou anonimizadas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cookies e Tecnologias Similares</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Usamos cookies e tecnologias similares para melhorar sua experiência. 
                  Você pode controlar as configurações de cookies through do seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Crianças</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
                  intencionalmente informações de crianças. Se tomarmos conhecimento de que 
                  coletamos informações de uma criança, tomamos medidas para remover essas informações.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Alterações nesta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                  quaisquer alterações significativas através de nossa plataforma ou por email.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: privacidade@lojarapida.co.mz</p>
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

export default Privacidade;