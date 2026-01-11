'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export default function WalletContextProvider({ children }: { children: React.ReactNode }) {
    // Use Ambient Testnet RPC
    const endpoint = useMemo(() => 'https://rpc.ambient.xyz', []);

    // Empty array - wallets will auto-detect installed browser extensions
    // This avoids dependency conflicts with @solana/wallet-adapter-wallets
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
