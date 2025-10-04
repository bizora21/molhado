"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, MessageSquareShare } from "lucide-react";

const QuickResponses = [
  {
    id: 1,
    question: "Como faço um pedido?",
    answer: "Para fazer um pedido, navegue até a página de Produtos, selecione o item desejado e clique em 'Adicionar ao Carrinho'."
  },
  {
    id: 2,
    question: "Formas de pagamento",
    answer: "Aceitamos pagamento via PIX, transferência bancária e cartão de crédito/débito."
  },
  {
    id: 3,
    question: "Prazo de entrega",
    answer: "O prazo de entrega varia de 2 a 5 dias úteis dependendo da sua localização."
  },
  {
    id: 4,
    question: "Política de troca",
    answer: "Aceitamos trocas em até 7 dias após o recebimento do produto, desde que esteja em perfeito estado."
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleQuickResponse = (answer: string) => {
    setSelectedQuestion(answer);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/+258863181415?text=Preciso%20de%20ajuda`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full p-4 bg-green-500 hover:bg-green-600 shadow-xl animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[320px] shadow-2xl border-2 border-green-100 bg-white">
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">Central de Ajuda</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-2">
            {selectedQuestion ? (
              <div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-800 leading-relaxed">{selectedQuestion}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedQuestion(null)}
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Como podemos ajudar?</p>
                </div>
                {QuickResponses.map((response) => (
                  <Button
                    key={response.id}
                    variant="outline"
                    className="w-full justify-start mb-2 text-left h-auto py-2 px-3"
                    onClick={() => handleQuickResponse(response.answer)}
                  >
                    <span className="text-sm">{response.question}</span>
                  </Button>
                ))}
                
                <Button 
                  variant="default" 
                  className="w-full mt-3 bg-green-600 hover:bg-green-700"
                  onClick={handleWhatsApp}
                >
                  <MessageSquareShare className="mr-2 h-4 w-4" /> Falar no WhatsApp
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;