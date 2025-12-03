import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`relative w-10 h-5 transition-colors duration-200 ease-in-out rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-400'}`}>
        <div 
          className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </div>
  );
};