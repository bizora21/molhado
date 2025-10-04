import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, MessageSquareShare, User, ShoppingBag, Wrench, HelpCircle } from "lucide-react";

const Chatbot = () => {
  // Rest of the component remains the same, just replace WhatsApp with MessageSquareShare
  const quickResponses = [
    { id: 1, text: "Como me cadastrar?", icon: User },
    { id: 2, text: "Ver produtos", icon: ShoppingBag },
    { id: 3, text: "Ver serviços", icon: Wrench },
    { id: 4, text: "Falar com atendente", icon: MessageSquareShare }
  ];

  // Rest of the component code...
};

export default Chatbot;