'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import OnChainSimulator to avoid SSR issues with wallet adapter
const OnChainSimulator = dynamic(() => import('./M3_OnChainSimulator'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full"><p className="text-purple-600 font-medium">Loading wallet adapter...</p></div>
});

interface CodeSection {
    title: string;
    code?: string;
    language?: string;
    description: string;
    isInteractive?: boolean;
}

const codeSections: CodeSection[] = [
    {
        title: "Interactive Simulator",
        description: "Connect your wallet and execute real transactions on Ambient Testnet",
        isInteractive: true
    },
    {
        title: "Smart Contract (lib.rs)",
        language: "rust",
        description: "Main Rust program implementing the 3-stage Ambient integration",
        code: `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod hello_ambient {
    use super::*;

    /// Stage 1: Initialize a new inference request
    pub fn initialize_request(
        ctx: Context<InitializeRequest>,
        prompt: String,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        request.authority = ctx.accounts.authority.key();
        request.prompt = prompt;
        request.status = RequestStatus::Pending;
        request.response_hash = [0u8; 32];
        request.created_at = Clock::get()?.unix_timestamp;
        
        msg!("Request initialized: {}", request.prompt);
        Ok(())
    }

    /// Stage 2: Request inference via CPI
    pub fn request_inference(
        ctx: Context<RequestInference>,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        
        // TODO: Implement CPI to Ambient Auction Program
        // This would use ambient_auction_interface
        
        request.status = RequestStatus::Processing;
        msg!("Inference requested!");
        Ok(())
    }

    /// Stage 3: Update with verification result
    pub fn update_result(
        ctx: Context<UpdateResult>,
        response_hash: [u8; 32],
        merkle_root: Option<[u8; 32]>,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        request.response_hash = response_hash;
        request.merkle_root = merkle_root;
        request.status = RequestStatus::Completed;
        
        msg!("Result updated with merkle_root!");
        Ok(())
    }
}`
    },
    {
        title: "Test Client (TypeScript)",
        language: "typescript",
        description: "Integration tests showing how to interact with the contract",
        code: `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAmbient } from "../target/types/hello_ambient";

describe("hello-ambient", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HelloAmbient;

  it("Initializes and requests inference", async () => {
    const prompt = "Hello, Ambient!";
    
    // Derive PDA for request account
    const [requestPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("request"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Stage 1: Initialize
    await program.methods
      .initializeRequest(prompt)
      .accounts({
        request: requestPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Stage 2: Request inference
    await program.methods
      .requestInference()
      .accounts({
        request: requestPda,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    // Fetch result
    const account = await program.account.inferenceRequest.fetch(requestPda);
    console.log("Status:", account.status);
    console.log("Merkle Root:", account.merkleRoot);
  });
});`
    },
    {
        title: "Configuration (Anchor.toml)",
        language: "toml",
        description: "Anchor configuration pointing to Ambient Testnet",
        code: `[provider]
cluster = "https://rpc.ambient.xyz"
wallet = "~/.config/solana/id.json"

[programs.localnet]
hello_ambient = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`
    }
];

export default function OnChainCode() {
    const [activeSection, setActiveSection] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (codeSections[activeSection].code) {
            navigator.clipboard.writeText(codeSections[activeSection].code!);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with tabs */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
                <h3 className="text-white font-black text-[14px] uppercase tracking-wider mb-3">
                    Hello Ambient Smart Contract
                </h3>
                <div className="flex gap-2 overflow-x-auto">
                    {codeSections.map((section, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSection(idx)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeSection === idx
                                ? 'bg-white text-cyan-700'
                                : 'bg-cyan-500/30 text-white hover:bg-cyan-500/50'
                                }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto bg-white/95">
                {codeSections[activeSection].isInteractive ? (
                    <OnChainSimulator />
                ) : (
                    <div className="p-6">
                        <div className="mb-4">
                            <p className="text-[11px] font-medium text-black/60 leading-relaxed">
                                {codeSections[activeSection].description}
                            </p>
                        </div>

                        <div className="relative">
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 px-3 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-purple-700 transition-all z-10"
                            >
                                {copied ? '✓ Copied!' : 'Copy Code'}
                            </button>

                            <div className="bg-zinc-900 rounded-xl p-6 overflow-x-auto">
                                <pre className="text-[11px] text-cyan-400 font-mono leading-relaxed">
                                    <code>{codeSections[activeSection].code}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <h4 className="text-[10px] uppercase font-black text-purple-700 mb-2 tracking-widest">
                                📋 Next Steps
                            </h4>
                            <ol className="text-[11px] text-purple-900 font-medium space-y-2 ml-4 list-decimal">
                                <li>Copy the code above</li>
                                <li>Create a new Anchor project: <code className="bg-purple-100 px-1 rounded">anchor init hello-ambient</code></li>
                                <li>Replace <code className="bg-purple-100 px-1 rounded">lib.rs</code> with the smart contract code</li>
                                <li>Build and deploy: <code className="bg-purple-100 px-1 rounded">anchor build && anchor deploy</code></li>
                                <li>Try the Interactive Simulator tab to test it!</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
