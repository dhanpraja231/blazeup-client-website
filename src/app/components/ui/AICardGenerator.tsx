'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, Info } from 'lucide-react';

interface AICardGeneratorProps {
  onDesignGenerated: (design: { elements: any[]; cardColor: string }) => void;
}

export default function AICardGenerator({ onDesignGenerated }: AICardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<{
    canGenerate: boolean;
    hasGeneratedThisMonth: boolean;
    remaining: number;
  } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/generate-card');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

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

    setIsGenerating(true);
    setError(null);

    try {
      const logoBase64 = await fileToBase64(logoFile);

      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoImage: logoBase64,
          companyName: companyName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate design');
      }

      onDesignGenerated(data.design);
      await fetchStatus();

      setLogoFile(null);
      setLogoPreview(null);
      setCompanyName('');

    } catch (err: any) {
      setError(err.message || 'Failed to generate card design');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold">AI Card Generator</h2>
      </div>

      {status && (
        <div className={`rounded-lg p-3 text-sm ${
          status.canGenerate
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className="flex items-start gap-2">
            <Info className={`w-4 h-4 mt-0.5 ${
              status.canGenerate ? 'text-green-400' : 'text-red-400'
            }`} />
            <div>
              {status.hasGeneratedThisMonth ? (
                <p className="text-red-300 font-medium">
                  You've already used your free generation this month
                </p>
              ) : status.remaining > 0 ? (
                <p className="text-green-300">
                  <span className="font-semibold">{status.remaining}</span> free designs remaining this month
                </p>
              ) : (
                <p className="text-red-300 font-medium">
                  Monthly limit reached (1,000 designs)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Company Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-semibold file:bg-purple-600 file:text-white
            hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
          disabled={isGenerating || !status?.canGenerate}
        />
      </div>

      {logoPreview && (
        <div className="bg-slate-700 rounded-lg p-4 flex justify-center">
          <img src={logoPreview} alt="Logo" className="max-h-32 object-contain" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Company Name (Optional)</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Corp"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          disabled={isGenerating || !status?.canGenerate}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!logoFile || isGenerating || !status?.canGenerate}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600
          hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Design...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate AI Design
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        1 free generation per month • {status?.remaining || 0} remaining globally
      </p>
    </div>
  );
}