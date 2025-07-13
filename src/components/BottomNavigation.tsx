import { Home, MessageCircle, FileText, Megaphone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  currentScreen: "home" | "voice" | "document" | "schemes" | "help";
  onNavigate: (screen: "home" | "voice" | "document" | "schemes" | "help") => void;
  language: string;
}

export const BottomNavigation = ({ currentScreen, onNavigate, language }: BottomNavigationProps) => {
  const navItems = [
    {
      id: "home" as const,
      icon: <Home className="w-5 h-5" />,
      label: language === 'hindi' ? 'होम' : 'Home',
      emoji: '🏠'
    },
    {
      id: "voice" as const,
      icon: <MessageCircle className="w-5 h-5" />,
      label: language === 'hindi' ? 'चैट' : 'Ask AI',
      emoji: '🧠'
    },
    {
      id: "document" as const,
      icon: <FileText className="w-5 h-5" />,
      label: language === 'hindi' ? 'दस्तावेज़' : 'Documents',
      emoji: '📄'
    },
    {
      id: "schemes" as const,
      icon: <Megaphone className="w-5 h-5" />,
      label: language === 'hindi' ? 'योजनाएं' : 'Schemes',
      emoji: '📢'
    },
    {
      id: "help" as const,
      icon: <HelpCircle className="w-5 h-5" />,
      label: language === 'hindi' ? 'सहायता' : 'Help',
      emoji: '📞'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 h-auto min-w-0 flex-1 ${
              currentScreen === item.id 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-xs font-medium truncate w-full text-center">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};