'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, X, Upload } from 'lucide-react';

interface AITemplateGeneratorProps {
  onTemplateSelect: (design: { frontElements: any[]; backElements: any[]; frontBg: string; backBg: string }) => void;
  onClose: () => void;
}

export default function AITemplateGenerator({ onTemplateSelect, onClose }: AITemplateGeneratorProps) {
  const [step, setStep] = useState<'upload' | 'generating' | 'select'>('upload');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedTemplates, setGeneratedTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setLogoFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!logoFile) {
      setError('Please upload a logo first');
      return;
    }

    setStep('generating');
    setError(null);

    try {
      const logoBase64 = await fileToBase64(logoFile);

      console.log('🎨 Generating 3 AI templates...');

      const response = await fetch('/api/generate-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoImage: logoBase64,
          companyName: companyName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate templates');
      }

      console.log('✅ Templates generated:', data.templates);
      setGeneratedTemplates(data.templates);
      setStep('select');

    } catch (err: any) {
      console.error('💥 Error generating templates:', err);
      setError(err.message || 'Failed to generate templates');
      setStep('upload');
    }
  };

  const handleSelectTemplate = (index: number) => {
    const template = generatedTemplates[index];
    onTemplateSelect({
      frontElements: template.frontElements,
      backElements: template.backElements,
      frontBg: template.frontBg,
      backBg: template.backBg,
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-4xl mx-4 rounded-3xl p-8 relative" style={{ background: 'rgba(15,15,30,.98)', border: '1px solid rgba(255,255,255,.1)', maxHeight: '90vh', overflow: 'auto' }}>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
              {step === 'upload' && 'AI Card Generator'}
              {step === 'generating' && 'Creating Your Designs...'}
              {step === 'select' && 'Choose Your Favorite'}
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {step === 'upload' && 'Upload your logo to generate 3 custom card designs'}
            {step === 'generating' && 'Our AI is crafting 3 unique designs just for you'}
            {step === 'select' && 'Pick a design to start customizing'}
          </p>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">Company Logo *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0
                  file:text-sm file:font-semibold file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
              />
            </div>

            {logoPreview && (
              <div className="bg-slate-800/50 rounded-xl p-6 flex justify-center border border-slate-700">
                <img src={logoPreview} alt="Logo preview" className="max-h-40 object-contain" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">Company Name (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corporation"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!logoFile}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20"
            >
              <Sparkles className="w-6 h-6" />
              Generate 3 AI Designs
            </button>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === 'generating' && (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-6" />
            <p className="text-lg text-slate-300 mb-2">Creating your custom designs...</p>
            <p className="text-sm text-slate-500">This may take 10-20 seconds</p>
          </div>
        )}

        {/* Step 3: Select Template */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTemplate(index)}
                  className={`group rounded-2xl p-4 transition-all hover:scale-105 ${
                    selectedTemplate === index ? 'ring-2 ring-purple-500' : ''
                  }`}
                  style={{ background: 'rgba(255,255,255,.05)', border: selectedTemplate === index ? '2px solid rgba(168,85,247,.6)' : '1px solid rgba(255,255,255,.08)' }}
                >
                  <div
                    className="rounded-xl h-48 mb-4 overflow-hidden relative"
                    style={{ background: template.frontBg, boxShadow: '0 8px 30px rgba(0,0,0,.4)' }}
                  >
                    {/* Mini preview of card elements */}
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      Design {index + 1}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors text-center">
                    {template.name || `Design ${index + 1}`}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedTemplate !== null && handleSelectTemplate(selectedTemplate)}
              disabled={selectedTemplate === null}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-xl shadow-purple-500/20"
            >
              Continue with Selected Design
            </button>

            <button
              onClick={() => setStep('upload')}
              className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}
            >
              ← Generate New Designs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}