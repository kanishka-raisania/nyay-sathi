import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, MapPin, Globe, Mail } from "lucide-react";

interface HelpScreenProps {
  language: string;
  onBack: () => void;
}

export const HelpScreen = ({ language, onBack }: HelpScreenProps) => {
  const getContent = () => {
    if (language === 'hindi') {
      return {
        title: "📞 सहायता एवं संपर्क",
        legalAid: {
          title: "कानूनी सहायता",
          phone: "राष्ट्रीय हेल्पलाइन: 15100",
          district: "जिला कानूनी सेवा प्राधिकरण से संपर्क करें"
        },
        police: {
          title: "पुलिस सहायता",
          emergency: "आपातकाल: 100 या 112",
          women: "महिला हेल्पलाइन: 1091"
        },
        online: {
          title: "ऑनलाइन संसाधन",
          services: "डिजिटल इंडिया: india.gov.in",
          courts: "ई-कोर्ट्स: ecourts.gov.in"
        },
        about: {
          title: "न्यायसाथी के बारे में",
          description: "न्यायसाथी भारत के ग्रामीण क्षेत्रों के लिए एक AI-संचालित कानूनी सहायक है। यह सामान्य कानूनी जानकारी प्रदान करता है और सरकारी योजनाओं के बारे में बताता है।"
        }
      };
    }
    
    return {
      title: "📞 Help & Contact",
      legalAid: {
        title: "Legal Aid Services",
        phone: "National Helpline: 15100",
        district: "Contact your District Legal Services Authority"
      },
      police: {
        title: "Police Assistance",
        emergency: "Emergency: 100 or 112",
        women: "Women Helpline: 1091"
      },
      online: {
        title: "Online Resources",
        services: "Digital India: india.gov.in",
        courts: "E-Courts: ecourts.gov.in"
      },
      about: {
        title: "About NyaySathi",
        description: "NyaySathi is an AI-powered legal assistant for rural India. It provides general legal information and helps with government scheme information."
      }
    };
  };

  const content = getContent();

  const helpSections = [
    {
      title: content.legalAid.title,
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      items: [
        content.legalAid.phone,
        content.legalAid.district
      ]
    },
    {
      title: content.police.title,
      icon: <Phone className="w-6 h-6 text-red-600" />,
      items: [
        content.police.emergency,
        content.police.women
      ]
    },
    {
      title: content.online.title,
      icon: <Globe className="w-6 h-6 text-green-600" />,
      items: [
        content.online.services,
        content.online.courts
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">{content.title}</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Help Sections */}
        {helpSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <Mail className="w-6 h-6 text-purple-600" />
              {content.about.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-sm">
              {content.about.description}
            </p>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="text-center">
            <p className="text-red-800 font-semibold">
              🚨 {language === 'hindi' ? 'आपातकाल में' : 'In Emergency'}
            </p>
            <p className="text-red-700 text-sm mt-1">
              {language === 'hindi' 
                ? 'तुरंत 100 या 112 डायल करें'
                : 'Dial 100 or 112 immediately'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};