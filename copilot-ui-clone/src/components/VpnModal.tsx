import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Zap, 
  Wifi, 
  X, 
  Check, 
  RefreshCw, 
  Lock, 
  Radio, 
  Activity, 
  Sparkles,
  Server,
  Download,
  Upload,
  Layers
} from 'lucide-react';

export interface VpnNode {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  ip: string;
  ping: number;
  speed: string;
  load: number;
  isFree: boolean;
}

export const VPN_NODES: VpnNode[] = [
  { id: 'us-east', name: 'United States', city: 'Miami, FL', country: 'US', flag: '🇺🇸', ip: '104.28.14.92', ping: 24, speed: '10 Gbps', load: 32, isFree: true },
  { id: 'sg-main', name: 'Singapore', city: 'Singapore City', country: 'SG', flag: '🇸🇬', ip: '139.99.45.102', ping: 18, speed: '10 Gbps', load: 28, isFree: true },
  { id: 'jp-tokyo', name: 'Japan', city: 'Tokyo', country: 'JP', flag: '🇯🇵', ip: '153.120.32.18', ping: 42, speed: '10 Gbps', load: 45, isFree: true },
  { id: 'uk-london', name: 'United Kingdom', city: 'London', country: 'UK', flag: '🇬🇧', ip: '185.220.101.5', ping: 38, speed: '10 Gbps', load: 39, isFree: true },
  { id: 'de-frankfurt', name: 'Germany', city: 'Frankfurt', country: 'DE', flag: '🇩🇪', ip: '142.132.200.14', ping: 48, speed: '10 Gbps', load: 51, isFree: true },
  { id: 'ca-toronto', name: 'Canada', city: 'Toronto', country: 'CA', flag: '🇨🇦', ip: '198.51.100.42', ping: 35, speed: '10 Gbps', load: 22, isFree: true },
];

interface VpnModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  selectedNode: VpnNode;
  setSelectedNode: (node: VpnNode) => void;
}

export const VpnModal: React.FC<VpnModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  setIsConnected,
  selectedNode,
  setSelectedNode
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState('84.2 Mbps');
  const [uploadSpeed, setUploadSpeed] = useState('42.8 Mbps');
  const [activeTab, setActiveTab] = useState<'servers' | 'stats'>('servers');
  const [bytesSec, setBytesSec] = useState('1.2 GB');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => {
        setDownloadSpeed((70 + Math.random() * 30).toFixed(1) + ' Mbps');
        setUploadSpeed((35 + Math.random() * 20).toFixed(1) + ' Mbps');
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  if (!isOpen) return null;

  const handleToggleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 1200);
    }
  };

  const handleSelectNode = (node: VpnNode) => {
    setSelectedNode(node);
    if (isConnected) {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              <Globe size={20} className={isConnected ? 'animate-spin duration-3000' : ''} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Free High-Speed VPN Proxy
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  FREE 100%
                </span>
              </h3>
              <p className="text-white/50 text-[11px]">
                {isConnected ? `Connected to ${selectedNode.name} (${selectedNode.ip})` : 'Disconnected • Tap power button to connect'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Connection Status Card */}
        <div className="p-6 bg-gradient-to-b from-black/80 to-neutral-900/90 flex flex-col items-center justify-center border-b border-white/10 relative overflow-hidden">
          
          {/* Glowing Background Ring */}
          <div className={`absolute w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
            isConnected ? 'bg-emerald-500' : isConnecting ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
          }`} />

          {/* Large Interactive Power Toggle Button */}
          <button 
            onClick={handleToggleConnect}
            disabled={isConnecting}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
              isConnected 
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-black border-4 border-emerald-300 hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.5)]' 
                : isConnecting 
                ? 'bg-amber-500 text-black border-4 border-amber-300 animate-pulse'
                : 'bg-gradient-to-br from-neutral-800 to-neutral-950 text-white border-4 border-white/20 hover:border-emerald-400/80 hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
            }`}
          >
            {isConnecting ? (
              <RefreshCw size={36} className="animate-spin text-black" />
            ) : isConnected ? (
              <ShieldCheck size={40} className="stroke-[2.5]" />
            ) : (
              <ShieldAlert size={40} className="stroke-[2] text-white/80" />
            )}
            <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1">
              {isConnecting ? 'Routing...' : isConnected ? 'PROTECTED' : 'CONNECT'}
            </span>
          </button>

          {/* Connection Text Details */}
          <div className="mt-4 text-center z-10">
            <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              {isConnected ? 'Geo-Bypass Active • Unrestricted Access' : 'VPN Inactive'}
            </span>
            <p className="text-white/60 text-xs mt-2 font-mono">
              Virtual IP: <span className="text-white font-bold">{isConnected ? selectedNode.ip : '127.0.0.1 (Exposed)'}</span>
            </p>
          </div>

          {/* Live Speed Gauge Row */}
          {isConnected && (
            <div className="w-full grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 z-10">
              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-white/50 font-medium">
                  <Download size={12} className="text-emerald-400" /> Down
                </div>
                <div className="text-xs font-bold text-white mt-1">{downloadSpeed}</div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-white/50 font-medium">
                  <Upload size={12} className="text-blue-400" /> Up
                </div>
                <div className="text-xs font-bold text-white mt-1">{uploadSpeed}</div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-white/50 font-medium">
                  <Activity size={12} className="text-amber-400" /> Latency
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{selectedNode.ping} ms</div>
              </div>
            </div>
          )}

        </div>

        {/* Servers Selection List */}
        <div className="p-5 flex flex-col gap-3 flex-1 overflow-y-auto max-h-[260px]">
          <div className="flex justify-between items-center text-xs font-bold text-white/70 uppercase tracking-wider px-1">
            <span>Select Free Server Location</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Zap size={12} /> 100% Unlimited
            </span>
          </div>

          <div className="space-y-2">
            {VPN_NODES.map(node => {
              const isSelected = selectedNode.id === node.id;

              return (
                <button 
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-md' 
                      : 'bg-neutral-800/60 border-white/10 hover:border-white/30 text-white/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{node.flag}</span>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        {node.name}
                        {isSelected && (
                          <span className="bg-amber-400 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {node.city} • {node.ip}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-emerald-400">{node.ping} ms</div>
                      <div className="text-[9px] text-white/40">{node.speed}</div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/30'
                    }`}>
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock size={12} /> Military-grade AES-256 Encryption
          </span>
          <span>Zero Logs Policy</span>
        </div>

      </div>
    </div>
  );
};
