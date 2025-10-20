import React from 'react';

export default function WizardSteps({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-brand-contrast text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                currentStep >= step ? 'text-brand-contrast' : 'text-gray-400'
              }`}>
                {step === 1 ? 'Modelo' : step === 2 ? 'Variante' : 'Listing'}
              </span>
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                currentStep > step ? 'bg-brand-contrast' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
