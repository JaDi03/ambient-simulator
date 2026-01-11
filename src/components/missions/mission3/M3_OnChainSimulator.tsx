'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

// This will be the deployed program ID on Ambient Testnet
const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export default function OnChainSimulator() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [txSignature, setTxSignature] = useState('');
    const [requestPda, setRequestPda] = useState<PublicKey | null>(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const initializeRequest = async () => {
        if (!publicKey) {
            setError('Please connect your wallet first');
            return;
        }

        if (!prompt) {
            setError('Please enter a prompt');
            return;
        }

        setLoading(true);
        setError('');
        setTxSignature('');

        try {
            // Derive PDA for request account
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from('request'), publicKey.toBuffer()],
                PROGRAM_ID
            );
            setRequestPda(pda);

            // Create instruction data (simplified - in production use IDL)
            const instruction = {
                programId: PROGRAM_ID,
                keys: [
                    { pubkey: pda, isSigner: false, isWritable: true },
                    { pubkey: publicKey, isSigner: true, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                ],
                data: Buffer.from([]), // Simplified - would use proper serialization
            };

            const transaction = new Transaction().add(instruction);

            const signature = await sendTransaction(transaction, connection);
            setTxSignature(signature);
            setStatus('Request initialized! Waiting for confirmation...');

            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');
            setStatus('✅ Request confirmed on-chain!');

        } catch (err: any) {
            setError(err.message || 'Transaction failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider mb-2">
                    Interactive On-Chain Simulator
                </h3>
                <p className="text-cyan-100 text-[10px] font-medium">
                    Connect your wallet and execute real transactions on Ambient Testnet
                </p>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white/95">
                {/* Wallet Connection */}
                <div className="flex items-center justify-between p-4 bg-cyan-50/50 rounded-xl border border-cyan-200/50">
                    <div>
                        <p className="text-[10px] uppercase font-black text-cyan-700 tracking-widest">
                            Wallet Connection
                        </p>
                        {publicKey && (
                            <p className="text-[11px] font-mono text-cyan-600 mt-1">
                                {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
                            </p>
                        )}
                    </div>
                    <WalletMultiButton
                        className="!bg-cyan-600 hover:!bg-cyan-700 !rounded-lg !text-[10px] !font-black !uppercase !tracking-wider"
                        style={{ backgroundColor: '#0891b2' }}
                    />
                </div>

                {/* Prompt Input */}
                <div>
                    <label className="block text-[10px] uppercase font-black text-black/40 mb-2 tracking-widest">
                        AI Prompt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt for on-chain AI inference..."
                        className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-[13px] font-medium focus:outline-none focus:border-purple-500 transition-all resize-none"
                        rows={3}
                        disabled={!publicKey || loading}
                    />
                </div>

                {/* Execute Button */}
                <button
                    onClick={initializeRequest}
                    disabled={!publicKey || !prompt || loading}
                    className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black text-[12px] uppercase tracking-wider hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                    {loading ? 'Processing Transaction...' : 'Initialize & Request Inference'}
                </button>

                {/* Status Messages */}
                {status && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-300">
                        <p className="text-[11px] font-medium text-green-800">{status}</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-300">
                        <p className="text-[11px] font-medium text-red-800">{error}</p>
                    </div>
                )}

                {/* Transaction Result */}
                {txSignature && (
                    <div className="p-4 bg-white rounded-xl border border-purple-300">
                        <p className="text-[10px] uppercase font-black text-purple-700 mb-2 tracking-widest">
                            Transaction Signature
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="text-[11px] font-mono text-purple-600 break-all flex-grow">
                                {txSignature}
                            </code>
                            <a
                                href={`https://explorer.solana.com/tx/${txSignature}?cluster=custom&customUrl=https://rpc.ambient.xyz`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-purple-700 transition-all whitespace-nowrap"
                            >
                                View on Explorer →
                            </a>
                        </div>
                    </div>
                )}

                {/* Request PDA */}
                {requestPda && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <p className="text-[10px] uppercase font-black text-purple-700 mb-2 tracking-widest">
                            Your Request Account (PDA)
                        </p>
                        <code className="text-[11px] font-mono text-purple-600 break-all">
                            {requestPda.toBase58()}
                        </code>
                    </div>
                )}

                {/* Instructions */}
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                    <h4 className="text-[10px] uppercase font-black text-cyan-700 mb-2 tracking-widest">
                        How It Works
                    </h4>
                    <ol className="text-[11px] text-cyan-900 font-medium space-y-2 ml-4 list-decimal">
                        <li>Connect your Solana wallet (Phantom, Solflare, etc.)</li>
                        <li>Make sure you have AMB tokens from the <a href="https://app.ambient.xyz/drops" target="_blank" className="text-cyan-600 underline">faucet</a></li>
                        <li>Enter your AI prompt</li>
                        <li>Click "Initialize & Request Inference"</li>
                        <li>Approve the transaction in your wallet</li>
                        <li>View the transaction on Solana Explorer</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
