export const MadeWithLojaRapida = () => {
  return (
    <div className="p-4 text-center">
      <a
        href="https://lojarapida.co.mz"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center space-x-2"
      >
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="url(#gradient)"/>
          <path d="M10 8L11.5 14H20.5L22 8H10Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="13" cy="18" r="1" fill="white"/>
          <circle cx="19" cy="18" r="1" fill="white"/>
          <path d="M8 6H24" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6"/>
              <stop offset="100%" style="stop-color:#8B5CF6"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Feito com ❤️ em Moçambique</span>
      </a>
    </div>
  );
};