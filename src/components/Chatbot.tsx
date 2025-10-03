import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, WhatsApp, User, ShoppingBag, Wrench, HelpCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da LojaRapida. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses = [
    { id: 1, text: "Como me cadastrar?", icon: User },
    { id: 2, text: "Ver produtos", icon: ShoppingBag },
    { id: 3, text: "Ver serviços", icon: Wrench },
    { id: 4, text: "Falar com atendente", icon: WhatsApp }
  ];

  const botResponses = {
    "como me cadastrar?": "Para se cadastrar, clique em 'Cadastrar' no menu superior. Você pode se cadastrar como Cliente, Vendedor ou Prestador de Serviços. Precisa de ajuda com algum tipo específico de cadastro?",
    "ver produtos": "Claro! Posso te levar para a página de produtos onde você encontrará uma grande variedade de itens de vendedores locais. Deseja ir para lá agora?",
    "ver serviços": "Ótimo! Temos diversos serviços profissionais disponíveis. Posso te direcionar para a página de serviços para você explorar as opções. Quer ir para lá?",
    "falar com atendente": "Claro! Você pode falar diretamente com nosso atendimento pelo WhatsApp: +258863181415. Clique aqui para abrir o WhatsApp: https://wa.me/258863181415"
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const response = getBotResponse(message.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message: string) => {
    for (const [key, response] of Object.entries(botResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    // Default responses
    if (message.includes("ajuda") || message.includes("help")) {
      return "Posso ajudar com cadastro, produtos, serviços ou te conectar com um atendente. O que você precisa?";
    }
    
    if (message.includes("preço") || message.includes("valor")) {
      return "Os preços variam conforme o produto ou serviço. Você pode verificar os valores diretamente nas páginas de produtos e serviços. Quer que te leve até lá?";
    }
    
    if (message.includes("contato") || message.includes("whatsapp")) {
      return "Você pode entrar em contato conosco pelo WhatsApp: +258863181415. Nosso atendimento está disponível de segunda a sexta, das 8h às 18h.";
    }
    
    return "Desculpe, não entendi perfeitamente. Posso te ajudar com cadastro, mostrar produtos/serviços ou te conectar com um atendente. Como prefere?";
  };

  const handleQuickResponse = (response: string) => {
    handleSendMessage(response);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button with blinking animation */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg animate-pulse border-2 border-white"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-white" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            !
          </Badge>
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Assistente LojaRapida</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-blue-100">Estou aqui para ajudar! 😊</p>
          </CardHeader>
          
          <CardContent className="p-4 h-[calc(100%-120px)] flex flex-col">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick responses */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Respostas rápidas:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickResponses.map((response) => {
                  const Icon = response.icon;
                  return (
                    <Button
                      key={response.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(response.text)}
                      className="text-xs h-auto p-2 justify-start"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {response.text}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Input area */}
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputMessage)}
                size="icon"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* WhatsApp contact */}
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <WhatsApp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Precisa de ajuda humana?</span>
                </div>
                <a
                  href="https://wa.me/258863181415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;