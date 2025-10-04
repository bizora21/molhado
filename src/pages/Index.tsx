import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wrench, Store, Book } from "lucide-react";
import Chatbot from '@/components/Chatbot';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-blue-600">LojaRapida</Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-blue-600 font-medium">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-blue-600">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-blue-600">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Conectando Negócios e Serviços em Moçambique
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          LojaRapida é a plataforma que une vendedores, prestadores de serviços e clientes em uma única comunidade.
        </p>
        
        <div className="flex justify-center space-x-4 mb-16">
          <Link to="/produtos">
            <Button size="lg" className="space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Comprar Produtos</span>
            </Button>
          </Link>
          <Link to="/servicos">
            <Button size="lg" variant="outline" className="space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Contratar Serviços</span>
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Store className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Vendedores Locais</h3>
            <p className="text-gray-600">Encontre produtos de vendedores da sua região</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Serviços Diversos</h3>
            <p className="text-gray-600">Profissionais qualificados para todos os tipos de serviços</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Book className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2">Blog e Conteúdo</h3>
            <p className="text-gray-600">Dicas e informações para empreendedores</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-xl font-semibold mb-2">Compra Fácil</h3>
            <p className="text-gray-600">Navegação simples e processo de compra intuitivo</p>
          </div>
        </div>
      </div>

      <footer>
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LojaRapida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default Index;