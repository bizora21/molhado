import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Calendar, Star, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PrestadorDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        window.location.href = '/login';
        return;
      }

      setUser(authUser);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch provider's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', authUser.id);

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
      } else {
        setServices(servicesData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-purple-600">LojaRapida</Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-purple-600">Início</Link>
                <Link to="/produtos" className="text-gray-700 hover:text-purple-600">Produtos</Link>
                <Link to="/servicos" className="text-gray-700 hover:text-purple-600">Serviços</Link>
                <Link to="/blog" className="text-gray-700 hover:text-purple-600">Blog</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Bem-vindo, {profile?.professional_name || profile?.full_name || 'Prestador'}</span>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Meu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Profissional</label>
                    <p className="text-gray-900">{profile?.professional_name || 'Não configurado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profissão</label>
                    <p className="text-gray-900">{profile?.professional_profession || 'Não informada'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Categoria</label>
                    <p className="text-gray-900">{profile?.professional_category || 'Não informada'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                    <p className="text-gray-900">{profile?.professional_whatsapp || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experiência</label>
                    <p className="text-gray-900">{profile?.professional_experience_years || 0} anos</p>
                  </div>
                  <Button className="w-full mt-4">
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600 mb-2">{services.length}</p>
                  <p className="text-sm text-gray-600">Serviços cadastrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
                  <p className="text-sm text-gray-600">Agendamentos pendentes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
                  <p className="text-sm text-gray-600">Total de avaliações</p>
                </CardContent>
              </Card>
            </div>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Meus Serviços
                    </CardTitle>
                    <CardDescription>
                      Gerencie seus serviços oferecidos
                    </CardDescription>
                  </div>
                  <Link to="/adicionar-servico">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Serviço
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço cadastrado</h3>
                    <p className="text-gray-600 mb-4">Comece adicionando seus primeiros serviços</p>
                    <Link to="/adicionar-servico">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Serviço
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.slice(0, 5).map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{service.title}</h4>
                          <p className="text-sm text-gray-600">{service.category}</p>
                          <p className="text-sm text-gray-600 mt-1">{service.description.substring(0, 100)}...</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={service.is_active ? "default" : "secondary"}>
                            {service.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          <p className="text-sm font-medium text-purple-600">MT {service.price}</p>
                        </div>
                      </div>
                    ))}
                    {services.length > 5 && (
                      <div className="text-center pt-4">
                        <Link to="/meus-servicos">
                          <Button variant="outline">
                            Ver todos os serviços ({services.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Gerencie seus serviços rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/adicionar-servico">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Serviço
                    </Button>
                  </Link>
                  <Link to="/meus-servicos">
                    <Button variant="outline" className="w-full justify-start">
                      <Wrench className="h-4 w-4 mr-2" />
                      Gerenciar Serviços
                    </Button>
                  </Link>
                  <Link to="/agendamentos">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Agendamentos
                    </Button>
                  </Link>
                  <Link to="/avaliacoes">
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      Ver Avaliações
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestadorDashboard;