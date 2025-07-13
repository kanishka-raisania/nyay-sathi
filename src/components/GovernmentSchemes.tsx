import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Volume2, Home, Heart, Banknote, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GovernmentSchemesProps {
  language: string;
  onBack: () => void;
}

interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  summary: string;
  summaryHindi: string;
  icon: React.ReactNode;
  details?: string;
}

export const GovernmentSchemes = ({ language, onBack }: GovernmentSchemesProps) => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schemeDetails, setSchemeDetails] = useState("");

  const GEMINI_API_KEY = "AIzaSyA17r5DJ8kfRUwcdjv1LT5eHkTDqkVj_5I";

  const schemes: Scheme[] = [
    {
      id: "pmay",
      name: "PMAY (Housing)",
      nameHindi: "प्रधानमंत्री आवास योजना",
      summary: "Free housing for eligible families",
      summaryHindi: "पात्र परिवारों के लिए मुफ्त आवास",
      icon: <Home className="w-8 h-8 text-orange-600" />
    },
    {
      id: "ayushman",
      name: "Ayushman Bharat",
      nameHindi: "आयुष्मान भारत",
      summary: "Free healthcare coverage up to ₹5 lakh",
      summaryHindi: "₹5 लाख तक मुफ्त स्वास्थ्य कवरेज",
      icon: <Heart className="w-8 h-8 text-red-600" />
    },
    {
      id: "pmkisan",
      name: "PM-KISAN",
      nameHindi: "पीएम-किसान",
      summary: "₹6000 per year for farmers",
      summaryHindi: "किसानों के लिए प्रति वर्ष ₹6000",
      icon: <Banknote className="w-8 h-8 text-green-600" />
    }
  ];

  const getLanguageCode = (lang: string) => {
    const codes: { [key: string]: string } = {
      english: "en-US",
      hindi: "hi-IN",
      tamil: "ta-IN",
      bengali: "bn-IN",
      marathi: "mr-IN"
    };
    return codes[lang] || "en-US";
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const fetchSchemeDetails = async (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsLoading(true);

    try {
      const prompt = `Explain the ${scheme.name} government scheme in India. Include:
      1. Who is eligible
      2. What benefits are provided
      3. How to apply
      4. Required documents
      5. Important deadlines if any
      
      Language preference: ${language}
      Make the explanation simple and easy to understand for rural citizens. Keep it comprehensive but not too long.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scheme details');
      }

      const data = await response.json();
      const details = data.candidates[0].content.parts[0].text;
      
      setSchemeDetails(details);
      
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      toast.error("Failed to load scheme details. Please try again.");
      setSchemeDetails("Sorry, I couldn't load the scheme details right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSchemeName = (scheme: Scheme) => {
    return language === 'hindi' ? scheme.nameHindi : scheme.name;
  };

  const getSchemeSummary = (scheme: Scheme) => {
    return language === 'hindi' ? scheme.summaryHindi : scheme.summary;
  };

  if (selectedScheme) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedScheme(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">{getSchemeName(selectedScheme)}</h1>
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedScheme.icon}
                  <span>{getSchemeName(selectedScheme)}</span>
                </div>
                {schemeDetails && (
                  <Button 
                    onClick={() => speakText(schemeDetails)}
                    variant="outline"
                    size="sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    🔊 Hear this info
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading scheme details...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {schemeDetails}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            📢 {language === 'hindi' ? 'सरकारी योजनाएं' : 'Government Schemes'}
          </h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {language === 'hindi' 
              ? 'आप इन सरकारी योजनाओं के लिए आवेदन कर सकते हैं'
              : 'Government Schemes You Can Apply For'
            }
          </p>
        </div>

        {schemes.map((scheme) => (
          <Card 
            key={scheme.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
            onClick={() => fetchSchemeDetails(scheme)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {scheme.icon}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {getSchemeName(scheme)}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {getSchemeSummary(scheme)}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                  >
                    {language === 'hindi' ? 'और जानें' : 'Know More'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Help Text */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-6">
          <p className="text-yellow-800 text-sm text-center">
            💡 {language === 'hindi' 
              ? 'किसी भी योजना पर क्लिक करें और विस्तृत जानकारी सुनें'
              : 'Click on any scheme to hear detailed information'
            }
          </p>
        </div>
      </div>
    </div>
  );
};