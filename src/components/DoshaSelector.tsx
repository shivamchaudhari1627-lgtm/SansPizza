import React, { useState } from 'react';

interface DoshaSelectorProps {
  onSelectCrust: (crust: string) => void;
}

const DoshaSelector: React.FC<DoshaSelectorProps> = ({ onSelectCrust }) => {
  const [mood, setMood] = useState('');

  const moods = [
    { id: 'calm', label: 'Seeking Calm', crust: 'Ashwagandha-infused Wheat', color: '#E9C46A' },
    { id: 'energy', label: 'Need Energy', crust: 'Turmeric-Honey Golden Crust', color: '#DAA520' },
    { id: 'light', label: 'Keep it Light', crust: 'Millet & Basil Crust', color: '#BDB76B' }
  ];

  return (
    <div className="p-6 bg-[#FCF9F2] border-2 border-[#DAA520] rounded-2xl shadow-sm">
      <h3 className="text-2xl font-serif text-[#4A2C2A] mb-4">Personalize your Sanskriti Base</h3>
      <p className="text-sm text-gray-600 mb-6">Align your meal with your current energy (Vibe Check).</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {moods.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMood(m.id); onSelectCrust(m.crust); }}
            className={`flex-1 p-4 rounded-xl transition-all border-2 text-left sm:text-center ${
              mood === m.id ? 'border-[#8B4513] bg-[#F4EBD0]' : 'border-transparent bg-white hover:border-[#DAA520]/50'
            }`}
          >
            <span className="block font-bold text-[#8B4513]">{m.label}</span>
            <span className="text-xs text-gray-500 mt-1 block">{m.crust}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoshaSelector;
