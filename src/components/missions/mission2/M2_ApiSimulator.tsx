'use client';

import { useState } from 'react';

export default function ApiSimulator() {
    const [apiKey, setApiKey] = useState('');
    const [iv, setIv] = useState('');
    const [prompt, setPrompt] = useState('Hello, can you verify this response?');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState('');

    const executeRequest = async () => {
        if (!apiKey.trim()) {
            setError('API Key is required');
            return;
        }

        setIsLoading(true);
        setError('');
        setResponse(null);

        try {
            // Clean up the API key - remove "Bearer " if user included it
            const cleanApiKey = apiKey.trim().replace(/^Bearer\s+/i, '');

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanApiKey}`
            };

            if (iv.trim()) {
                headers['iv'] = iv;
            }

            const res = await fetch('https://api.ambient.xyz/v1/responses', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: 'large',
                    input: prompt,
                    store: true,
                    emit_verified: true,
                    wait_for_verification: true,
                    emit_usage: true
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(`Error ${res.status}: ${data.detail || 'Request failed'}`);
                return;
            }

            setResponse(data);
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 rounded-t-[2.5rem]">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider">POST /v1/responses</h3>
                <p className="text-cyan-100 text-[10px] font-medium mt-1">Ambient API Simulator</p>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white/95">
                {/* API Key Input */}
                <div>
                    <label className="block text-[10px] uppercase font-black text-black/40 mb-2 tracking-widest">
                        Authorization <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Paste your API Key here (without 'Bearer')"
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-[13px] font-mono focus:outline-none focus:border-cyan-500 transition-all"
                    />
                </div>

                {/* IV Input (Optional) */}
                <div>
                    <label className="block text-[10px] uppercase font-black text-black/40 mb-2 tracking-widest">
                        IV (Optional)
                    </label>
                    <input
                        type="text"
                        value={iv}
                        onChange={(e) => setIv(e.target.value)}
                        placeholder="12-byte hex string"
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-[13px] font-mono focus:outline-none focus:border-cyan-500 transition-all"
                    />
                </div>

                {/* Prompt Input */}
                <div>
                    <label className="block text-[10px] uppercase font-black text-black/40 mb-2 tracking-widest">
                        Prompt
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-[13px] focus:outline-none focus:border-cyan-500 transition-all resize-none"
                    />
                </div>

                {/* Execute Button */}
                <button
                    onClick={executeRequest}
                    disabled={isLoading}
                    className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-100"
                >
                    {isLoading ? 'Executing...' : 'Execute'}
                </button>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-[10px] uppercase font-black text-red-600 mb-1">Error</p>
                        <p className="text-[12px] text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Response Display */}
                {response && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase font-black text-green-600">Response (200 OK)</p>
                            {response.merkle_root && (
                                <span className="text-[9px] bg-green-600 text-white px-2 py-1 rounded-full font-black uppercase">Verified ✓</span>
                            )}
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-[10px] text-cyan-400 font-mono whitespace-pre-wrap break-words">
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        </div>
                        {response.merkle_root && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-green-300">
                                <p className="text-[9px] uppercase font-black text-green-700 mb-1">Merkle Root (Cryptographic Proof)</p>
                                <p className="text-[11px] font-mono text-green-800 break-all">{response.merkle_root}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
