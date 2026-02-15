
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Signal } from 'lucide-react';

const LatencyDisplay = ({ baseLatency, isSelected }) => {
  const [latency, setLatency] = useState(baseLatency);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small jitter in latency
      const jitter = Math.floor(Math.random() * 3) - 1;
      setLatency(prev => Math.max(1, baseLatency + jitter));
    }, 2000);
    return () => clearInterval(interval);
  }, [baseLatency]);

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-md transition-colors duration-300",
      isSelected 
        ? "bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/30" 
        : "bg-gray-100 text-gray-500 border border-gray-200"
    )}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>
      <span className="opacity-80">Ping:</span>
      <motion.span 
        key={latency}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="font-bold"
      >
        {latency}ms
      </motion.span>
    </div>
  );
};

const LocationSelector = ({ selectedLocation, onSelectLocation }) => {
  const locations = [
    {
      id: 'br',
      name: 'Brasil',
      flag: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/444c147d46e25c753d13030f23c9ba25.png',
      label: 'São Paulo',
      latency: 4
    },
    {
      id: 'us', 
      name: 'Estados Unidos',
      flag: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/8c04d80d0c1ea9bb77309796c8d4a217.png',
      label: 'Miami',
      latency: 120
    }
  ];

  return (
    <div className="flex flex-row justify-center gap-4 mb-10 flex-wrap">
      {locations.map((location) => (
        <motion.button
          key={location.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectLocation(location.id)}
          className={cn(
            "relative flex flex-col items-stretch gap-3 px-5 py-4 rounded-xl border transition-all duration-300 min-w-[200px] shadow-lg overflow-hidden group text-left",
            selectedLocation === location.id
              ? "bg-[#1a1a2e] border-[#FFA500] shadow-[#FFA500]/20 ring-1 ring-[#FFA500]/50"
              : "bg-white border-gray-200 hover:border-[#FFA500]/30 hover:shadow-xl hover:shadow-[#FFA500]/10"
          )}
        >
          {/* Background Gradient for Active State */}
          {selectedLocation === location.id && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFA500]/10 via-transparent to-transparent pointer-events-none" />
          )}

          <div className="flex items-center gap-3">
             {/* Flag */}
            <div className={cn(
                "w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm border transition-colors",
                selectedLocation === location.id ? "border-[#FFA500]/50" : "border-gray-100"
            )}>
                <img 
                src={location.flag} 
                alt={`Bandeira ${location.name}`} 
                className="w-full h-full object-cover"
                />
            </div>
            
            <div className="flex flex-col">
                <span className={cn(
                "text-sm font-bold uppercase tracking-wider font-sora transition-colors",
                selectedLocation === location.id ? "text-white" : "text-gray-800"
                )}>
                {location.name}
                </span>
                <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    selectedLocation === location.id ? "text-gray-400" : "text-gray-500"
                )}>{location.label}</span>
            </div>

             {/* Active Indicator */}
             <AnimatePresence>
                {selectedLocation === location.id && (
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-auto bg-[#FFA500] text-white rounded-full p-1 shadow-sm"
                >
                    <Check className="w-3 h-3" strokeWidth={3} />
                </motion.div>
                )}
            </AnimatePresence>
          </div>
          
          <div className="w-full pt-2 border-t border-gray-100/10">
              <LatencyDisplay 
                baseLatency={location.latency} 
                isSelected={selectedLocation === location.id} 
              />
          </div>

        </motion.button>
      ))}
    </div>
  );
};

export default LocationSelector;
