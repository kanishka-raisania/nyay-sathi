
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
    { value: "rent_agreement", label: "Rent Agreement" },
    { value: "sale_deed", label: "Sale Deed" },
    { value: "will", label: "Will/Testament" },
    { value: "power_of_attorney", label: "Power of Attorney" },
    { value: "affidavit", label: "Affidavit" },
    { value: "loan_agreement", label: "Loan Agreement" }
  ];

  const getFormFields = (docType: string) => {
    switch (docType) {
      case "rent_agreement":
        return [
          { key: "landlord_name", label: "Landlord Name", type: "text" },
          { key: "tenant_name", label: "Tenant Name", type: "text" },
          { key: "property_address", label: "Property Address", type: "textarea" },
          { key: "monthly_rent", label: "Monthly Rent (₹)", type: "number" },
          { key: "security_deposit", label: "Security Deposit (₹)", type: "number" },
          { key: "lease_duration", label: "Lease Duration (months)", type: "number" }
        ];
      case "affidavit":
        return [
          { key: "applicant_name", label: "Your Full Name", type: "text" },
          { key: "father_name", label: "Father's Name", type: "text" },
          { key: "address", label: "Complete Address", type: "textarea" },
          { key: "purpose", label: "Purpose of Affidavit", type: "textarea" },
          { key: "statement", label: "Statement/Declaration", type: "textarea" }
        ];
      default:
        return [
          { key: "party1_name", label: "First Party Name", type: "text" },
          { key: "party2_name", label: "Second Party Name", type: "text" },
          { key: "details", label: "Additional Details", type: "textarea" }
        ];
    }
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
                    {type.label}
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
                    {field.label}
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
