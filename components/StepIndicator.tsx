
import React from 'react';
import { Step, StepConfig } from '../types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: Step;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.title} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {currentStep > step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-cyan-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-cyan-600 rounded-full">
                   <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
            ) : currentStep === step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-gray-800 border-2 border-cyan-500 rounded-full">
                  <span className="h-2.5 w-2.5 bg-cyan-500 rounded-full" aria-hidden="true" />
                </div>
                <span className="absolute -bottom-6 text-sm font-semibold text-cyan-400">{step.title}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-gray-700 border-2 border-gray-600 rounded-full" />
                <span className="absolute -bottom-6 text-sm font-medium text-gray-500">{step.title}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
