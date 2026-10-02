import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { VpnNode, VPN_NODES } from './VpnModal';

interface VpnBadgeProps {
  isConnected: boolean;
  selectedNode?: VpnNode;
  nodeName?: string;
  onClick: () => void;
}

export const VpnBadge: React.FC<VpnBadgeProps> = ({
  isConnected,
  selectedNode = VPN_NODES[0],
  onClick
}) => {
  const node = selectedNode || VPN_NODES[0];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
        isConnected 
          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:border-emerald-400' 
          : 'bg-black/60 border-red-500/40 text-red-300 hover:border-red-400'
      }`}
      title="VPN Connection Control"
    >
      <div className="relative flex items-center justify-center">
        {isConnected ? (
          <ShieldCheck size={14} className="text-emerald-400" />
        ) : (
          <ShieldAlert size={14} className="text-red-400" />
        )}
        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
          isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-500'
        }`} />
      </div>

      <div className="flex items-center gap-1">
        <span>{isConnected ? node?.flag || '🇺🇸' : 'VPN'}</span>
        <span className="hidden sm:inline">
          {isConnected ? `Free VPN (${node?.country || 'US'})` : 'Free VPN: OFF'}
        </span>
      </div>

      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
        isConnected ? 'bg-emerald-400 text-black' : 'bg-red-500/30 text-red-300'
      }`}>
        {isConnected ? 'FREE' : 'CONNECT'}
      </span>
    </button>
  );
};
