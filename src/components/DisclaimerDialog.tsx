import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DisclaimerDialogProps {
  language: string;
}

export const DisclaimerDialog = ({ language }: DisclaimerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show disclaimer on first visit
    const hasSeenDisclaimer = localStorage.getItem('nyaysathi-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nyaysathi-disclaimer-seen', 'true');
    setIsOpen(false);
  };

  const getContent = () => {
    if (language === 'hindi') {
      return {
        title: "⚠️ महत्वपूर्ण सूचना",
        description: "न्यायसाथी एक AI सहायक है, यह कानूनी पेशेवरों का विकल्प नहीं है। कानूनी विवादों के लिए स्थानीय कानूनी सहायता कार्यालयों से संपर्क करें।",
        note: "यह सिर्फ सामान्य जानकारी के लिए है। महत्वपूर्ण कानूनी मामलों में हमेशा योग्य वकील से सलाह लें।",
        button: "मैं समझ गया"
      };
    }
    
    return {
      title: "⚠️ Important Notice",
      description: "NyaySathi is an AI assistant, not a substitute for legal professionals. Contact local Legal Aid offices for legal disputes.",
      note: "This is for general information only. Always consult qualified lawyers for important legal matters.",
      button: "I Understand"
    };
  };

  const content = getContent();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-6 h-6" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-gray-700 leading-relaxed">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            💡 {content.note}
          </p>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAccept}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {content.button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};