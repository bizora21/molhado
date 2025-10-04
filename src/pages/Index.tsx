import React from 'react';
import Chatbot from '@/components/Chatbot';

const Index: React.FC = () => {
  return (
    <div>
      <main>
        {/* Your main content here */}
      </main>
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