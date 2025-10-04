import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterVendedor from "./pages/RegisterVendedor";
import RegisterPrestador from "./pages/RegisterPrestador";
import ClienteDashboard from "./pages/ClienteDashboard";
import VendedorDashboard from "./pages/VendedorDashboard";
import PrestadorDashboard from "./pages/PrestadorDashboard";
import AdicionarProduto from "./pages/AdicionarProduto";
import AdicionarServico from "./pages/AdicionarServico";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Blog from "./pages/Blog";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Contato from "./pages/Contato";
import TesteCadastro from "./pages/TesteCadastro";
import TesteConexao from "./pages/TesteConexao";
import DebugSupabase from "./pages/DebugSupabase";
import DiagnosticoRapido from "./pages/DiagnosticoRapido";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-vendedor" element={<RegisterVendedor />} />
        <Route path="/register-prestador" element={<RegisterPrestador />} />
        <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/vendedor-dashboard" element={<VendedorDashboard />} />
        <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
        <Route path="/adicionar-produto" element={<AdicionarProduto />} />
        <Route path="/adicionar-servico" element={<AdicionarServico />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/teste-cadastro" element={<TesteCadastro />} />
        <Route path="/teste-conexao" element={<TesteConexao />} />
        <Route path="/debug-supabase" element={<DebugSupabase />} />
        <Route path="/diagnostico" element={<DiagnosticoRapido />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;