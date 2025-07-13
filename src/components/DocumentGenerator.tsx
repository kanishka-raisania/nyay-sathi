
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DocumentGeneratorProps {
  language: string;
  onBack: () => void;
}

export const DocumentGenerator = ({ language, onBack }: DocumentGeneratorProps) => {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const GEMINI_API_KEY = "AIzaSyA17r5DJ8kfRUwcdjv1LT5eHkTDqkVj_5I";

  const documentTypes = [
    { value: "land_ownership", label: "Land Ownership Form", labelHindi: "भूमि स्वामित्व फॉर्म" },
    { value: "rti_application", label: "RTI Application", labelHindi: "आरटीआई आवेदन" },
    { value: "pmkisan_form", label: "PM-KISAN Subsidy Form", labelHindi: "पीएम-किसान सब्सिडी फॉर्म" },
    { value: "legal_heir", label: "Legal Heir Certificate", labelHindi: "कानूनी वारिस प्रमाणपत्र" },
    { value: "affidavit", label: "Affidavit", labelHindi: "हलफनामा" },
    { value: "income_certificate", label: "Income Certificate", labelHindi: "आय प्रमाणपत्र" }
  ];

  const getFormFields = (docType: string) => {
    const fields = {
      land_ownership: [
        { key: "full_name", label: "Full Name", labelHindi: "पूरा नाम", type: "text" },
        { key: "aadhaar_number", label: "Aadhaar Number", labelHindi: "आधार संख्या", type: "text" },
        { key: "village", label: "Village", labelHindi: "गाँव", type: "text" },
        { key: "district", label: "District", labelHindi: "जिला", type: "text" },
        { key: "plot_number", label: "Plot Number", labelHindi: "प्लॉट संख्या", type: "text" },
        { key: "plot_area", label: "Plot Area (in acres)", labelHindi: "प्लॉट क्षेत्रफल (एकड़ में)", type: "text" }
      ],
      rti_application: [
        { key: "full_name", label: "Full Name", labelHindi: "पूरा नाम", type: "text" },
        { key: "address", label: "Complete Address", labelHindi: "पूरा पता", type: "textarea" },
        { key: "department", label: "Government Department", labelHindi: "सरकारी विभाग", type: "text" },
        { key: "information_sought", label: "Information Required", labelHindi: "आवश्यक जानकारी", type: "textarea" },
        { key: "reason", label: "Reason for Information", labelHindi: "जानकारी का कारण", type: "textarea" }
      ],
      pmkisan_form: [
        { key: "full_name", label: "Full Name", labelHindi: "पूरा नाम", type: "text" },
        { key: "aadhaar_number", label: "Aadhaar Number", labelHindi: "आधार संख्या", type: "text" },
        { key: "village", label: "Village", labelHindi: "गाँव", type: "text" },
        { key: "district", label: "District", labelHindi: "जिला", type: "text" },
        { key: "land_area", label: "Total Land Area (acres)", labelHindi: "कुल भूमि क्षेत्रफल (एकड़)", type: "text" },
        { key: "bank_account", label: "Bank Account Number", labelHindi: "बैंक खाता संख्या", type: "text" }
      ],
      legal_heir: [
        { key: "deceased_name", label: "Name of Deceased", labelHindi: "मृतक का नाम", type: "text" },
        { key: "applicant_name", label: "Your Full Name", labelHindi: "आपका पूरा नाम", type: "text" },
        { key: "relationship", label: "Relationship with Deceased", labelHindi: "मृतक से रिश्ता", type: "text" },
        { key: "aadhaar_number", label: "Aadhaar Number", labelHindi: "आधार संख्या", type: "text" },
        { key: "address", label: "Complete Address", labelHindi: "पूरा पता", type: "textarea" },
        { key: "purpose", label: "Purpose of Certificate", labelHindi: "प्रमाणपत्र का उद्देश्य", type: "textarea" }
      ],
      affidavit: [
        { key: "full_name", label: "Full Name", labelHindi: "पूरा नाम", type: "text" },
        { key: "father_name", label: "Father's Name", labelHindi: "पिता का नाम", type: "text" },
        { key: "aadhaar_number", label: "Aadhaar Number", labelHindi: "आधार संख्या", type: "text" },
        { key: "address", label: "Complete Address", labelHindi: "पूरा पता", type: "textarea" },
        { key: "purpose", label: "Purpose of Affidavit", labelHindi: "हलफनामे का उद्देश्य", type: "textarea" },
        { key: "statement", label: "Statement/Declaration", labelHindi: "कथन/घोषणा", type: "textarea" }
      ],
      income_certificate: [
        { key: "full_name", label: "Full Name", labelHindi: "पूरा नाम", type: "text" },
        { key: "father_name", label: "Father's Name", labelHindi: "पिता का नाम", type: "text" },
        { key: "aadhaar_number", label: "Aadhaar Number", labelHindi: "आधार संख्या", type: "text" },
        { key: "village", label: "Village", labelHindi: "गाँव", type: "text" },
        { key: "district", label: "District", labelHindi: "जिला", type: "text" },
        { key: "annual_income", label: "Annual Income (₹)", labelHindi: "वार्षिक आय (₹)", type: "number" },
        { key: "occupation", label: "Occupation", labelHindi: "व्यवसाय", type: "text" }
      ]
    };
    
    return fields[docType as keyof typeof fields] || [];
  };

  const generateDocument = async () => {
    if (!selectedDocType || Object.keys(formData).length === 0) {
      toast.error("Please select document type and fill required details.");
      return;
    }

    setIsGenerating(true);

    try {
      const formDetails = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const prompt = `Generate a legal ${selectedDocType.replace('_', ' ')} document in Indian legal format. Use simple language suitable for rural India. Include all necessary legal clauses and terms. Here are the details:

${formDetails}

Language preference: ${language}

Make it professional but easy to understand. Include proper legal formatting and structure.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      const document = data.candidates[0].content.parts[0].text;
      
      setGeneratedDocument(document);
      toast.success("Document generated successfully!");
      
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Document downloaded!");
  };

  const formFields = selectedDocType ? getFormFields(selectedDocType) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Document Generator</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Document Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Select Document Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose document type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {language === 'hindi' ? type.labelHindi : type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Form Fields */}
        {selectedDocType && (
          <Card>
            <CardHeader>
              <CardTitle>Fill Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'hindi' && field.labelHindi ? field.labelHindi : field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
              
              <Button 
                onClick={generateDocument}
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generated Document */}
        {generatedDocument && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Document</CardTitle>
                <Button onClick={downloadDocument} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                  {generatedDocument}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
