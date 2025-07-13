
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Scale, FileText, MessageCircle, Volume2, AlertTriangle } from "lucide-react";
import { VoiceChatbot } from "@/components/VoiceChatbot";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { GovernmentSchemes } from "@/components/GovernmentSchemes";
import { HelpScreen } from "@/components/HelpScreen";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DisclaimerDialog } from "@/components/DisclaimerDialog";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<"home" | "voice" | "document" | "schemes" | "help">("home");
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "tamil", label: "தமிழ் (Tamil)" },
    { value: "bengali", label: "বাংলা (Bengali)" },
    { value: "marathi", label: "मराठी (Marathi)" }
  ];

  const popularQuestions = [
    "What is PM-KISAN?",
    "How to register farmland?",
    "What are women's property rights?"
  ];

  const handleQuestionClick = (question: string) => {
    setCurrentScreen("voice");
  };

  const handleNavigate = (screen: "home" | "voice" | "document" | "schemes" | "help") => {
    setCurrentScreen(screen);
  };

  if (currentScreen === "voice") {
    return <VoiceChatbot language={selectedLanguage} onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "document") {
    return <DocumentGenerator language={selectedLanguage} onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "schemes") {
    return <GovernmentSchemes language={selectedLanguage} onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "help") {
    return <HelpScreen language={selectedLanguage} onBack={() => setCurrentScreen("home")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20">
      <DisclaimerDialog language={selectedLanguage} />
      <div className="max-w-md mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="text-center pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-12 h-12 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">NyaySathi</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to NyaySathi! Get legal help in your language.
          </p>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Your Language
          </label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          <Button 
            onClick={() => setCurrentScreen("voice")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-xl rounded-xl shadow-lg"
          >
            <Mic className="w-8 h-8 mr-3" />
            🎙️ Start Voice Chat
          </Button>

          <Button 
            onClick={() => setCurrentScreen("document")}
            variant="outline"
            className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 py-6 text-xl rounded-xl"
          >
            <FileText className="w-8 h-8 mr-3" />
            📄 Generate Legal Document
          </Button>
        </div>

        {/* Popular Questions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
            Popular Questions
          </h2>
          <div className="space-y-3">
            {popularQuestions.map((question, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                onClick={() => handleQuestionClick(question)}
              >
                <CardContent className="p-4">
                  <p className="text-gray-700 font-medium">{question}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <p className="text-yellow-800 font-medium leading-relaxed">
              ⚠️ Not a lawyer. For serious issues, contact a legal professional.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Made with ❤️ for Rural India
          </p>
        </div>
      </div>
      
      <BottomNavigation 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        language={selectedLanguage}
      />
    </div>
  );
};

export default Index;
