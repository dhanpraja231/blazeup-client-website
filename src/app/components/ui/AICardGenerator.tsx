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
      console.log('📊 Fetching generation status...');
      const response = await fetch('/api/generate-card');
      const data = await response.json();
      console.log('📊 Status response:', data);
      setStatus(data);
    } catch (err) {
      console.error('❌ Failed to fetch status:', err);
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
    console.log('🚀 Generate button clicked!');
    console.log('Logo file:', logoFile);
    console.log('Company name:', companyName);
    console.log('Status:', status);

    if (!logoFile) {
      console.error('❌ No logo file uploaded');
      setError('Please upload a logo first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('📦 Converting logo to base64...');
      const logoBase64 = await fileToBase64(logoFile);
      console.log('✅ Logo converted, length:', logoBase64.length);

      console.log('🌐 Sending POST request to /api/generate-card...');
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoImage: logoBase64,
          companyName: companyName.trim() || undefined,
        }),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      const data = await response.json();
      console.log('📄 Response data:', data);

      if (!response.ok) {
        console.error('❌ API error:', data.error);
        throw new Error(data.error || 'Failed to generate design');
      }

      console.log('✅ Design generated successfully!');
      console.log('Design data:', data.design);

      // Pass the design to parent component
      onDesignGenerated(data.design);

      // Refresh status
      await fetchStatus();

      // Reset form
      setLogoFile(null);
      setLogoPreview(null);
      setCompanyName('');

    } catch (err: any) {
      console.error('💥 Error in handleGenerate:', err);
      console.error('Error stack:', err.stack);
      setError(err.message || 'Failed to generate card design');
    } finally {
      setIsGenerating(false);
      console.log('🏁 Generation process complete');
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden sidebar-item" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', backdropFilter: 'blur(20px)' }}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold">AI Card Generator</h3>
        </div>

        {status && (
          <div className={`rounded-lg p-2.5 text-xs mb-3 ${
            status.canGenerate
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-start gap-2">
              <Info className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                status.canGenerate ? 'text-green-400' : 'text-red-400'
              }`} />
              <div className="flex-1 min-w-0">
                {status.hasGeneratedThisMonth ? (
                  <p className="text-red-300 font-medium">
                    Already used this month
                  </p>
                ) : status.remaining > 0 ? (
                  <p className="text-green-300">
                    <span className="font-semibold">{status.remaining}</span> remaining
                  </p>
                ) : (
                  <p className="text-red-300 font-medium">
                    Monthly limit reached
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-400">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-xs text-slate-400
                file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                file:text-xs file:font-semibold file:bg-purple-600 file:text-white
                hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
              disabled={isGenerating || !status?.canGenerate}
            />
          </div>

          {logoPreview && (
            <div className="bg-slate-700/50 rounded-lg p-3 flex justify-center">
              <img src={logoPreview} alt="Logo" className="max-h-20 object-contain" />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-400">Company Name (Optional)</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
              disabled={isGenerating || !status?.canGenerate}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-2.5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!logoFile || isGenerating || !status?.canGenerate}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600
              hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-sm
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Design
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center">
            1 free/month • {status?.remaining || 0} remaining globally
          </p>
        </div>
      </div>
    </div>
  );
}