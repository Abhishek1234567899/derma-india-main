import React, { useState } from 'react';
import { HairProfileData } from '../types';
import { maleQuestions, femaleQuestions } from './questionnaireData';
import Button from './common/Button';
import { ArrowLeftIcon, ArrowRightIcon, User, CheckIcon } from './Icons';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  hairProfileData: Partial<HairProfileData>;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
}

const Step2HealthQuestionnaire: React.FC<Step2Props> = ({
  onNext,
  onBack,
  hairProfileData,
  setHairProfileData,
}) => {
  const [formData, setFormData] = useState<Partial<HairProfileData>>(hairProfileData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = hairProfileData.gender === 'Female' ? femaleQuestions : maleQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setHairProfileData(formData);
      onNext();
    }
  };
  
  const handleSingleChoiceAndProceed = (name: string, value: string) => {
    handleChange(name, value);
    setTimeout(() => {
      handleNextQuestion();
    }, 300);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const isCurrentOptionSelected = () => {
    if (!currentQuestion) return false;
    const value = formData[currentQuestion.key as keyof HairProfileData];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(value) && value.length > 0;
    }
    return !!value;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!hairProfileData.gender) {
     return (
      <div className="animate-fade-in-up flex flex-col w-full h-full items-center justify-center p-8">
          <p className="text-red-600">Gender not selected. Please go back.</p>
          <Button onClick={onBack} variant="primary" size="md" className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col w-full h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="mb-8">
            <span className="text-sm font-bold text-slate-700">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {currentQuestion.key === 'hairlossImageMale' && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800">Hair Health</h3>
            <p className="text-slate-500">Good hair, don’t care — because it’s healthy!</p>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h2>

        {currentQuestion.type === 'image-radio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {currentQuestion.imageOptions.map((option) => {
              const isSelected = formData[currentQuestion.key as keyof HairProfileData] === option.label;
              const Icon = option.icon;
              return (
                 <div
                  key={option.label}
                  onClick={() => handleSingleChoiceAndProceed(currentQuestion.key, option.label)}
                  className={`
                    rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 group relative
                    flex flex-row items-center justify-between
                    lg:flex-col lg:justify-start lg:text-center
                    ${isSelected
                      ? 'bg-blue-50/60 border-2 border-blue-500 shadow-lg'
                      : 'bg-slate-100/70 border border-slate-200 hover:border-slate-300 hover:bg-slate-200/60'
                    }
                  `}
                >
                  {/* Mobile: Radio + Label */}
                  <div className="flex items-center gap-4 lg:hidden">
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}`}>
                      {isSelected && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{option.label}</span>
                  </div>

                  {/* Desktop: Radio (positioned absolutely) */}
                  <div className="hidden lg:block absolute top-3 left-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}`}>
                      {isSelected && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>}
                    </span>
                  </div>
                  
                  {/* Icon (responsive size) */}
                  <div className="flex items-center justify-center h-12 w-16 sm:w-20 lg:h-24 lg:w-full lg:mb-2">
                    <Icon className="w-full h-full object-contain text-slate-800" />
                  </div>

                  {/* Desktop: Label */}
                  <span className="hidden lg:block text-sm font-medium text-slate-700">{option.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'single' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = formData[currentQuestion.key as keyof HairProfileData] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSingleChoiceAndProceed(currentQuestion.key, option)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all flex items-center gap-4 ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600' : 'border-slate-400'}`}>
                    {isSelected && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option}</span>
                </button>
              )
            })}
          </div>
        )}

        {currentQuestion.type === 'multiple' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const currentSelection = (formData[currentQuestion.key as keyof HairProfileData] as string[]) || [];
              const isSelected = currentSelection.includes(option);
              const handleOptionClick = () => {
                const newSelection = isSelected
                  ? currentSelection.filter((item) => item !== option)
                  : [...currentSelection, option];
                handleChange(currentQuestion.key, newSelection);
              };
              return (
                <button
                  key={option}
                  onClick={handleOptionClick}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all flex items-center gap-4 ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                    {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{option}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex justify-between p-6 border-t border-slate-200">
        <Button onClick={handlePrevQuestion} variant="ghost" size="md" className="gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </Button>
        {currentQuestion.type === 'multiple' && (
            <Button onClick={handleNextQuestion} disabled={!isCurrentOptionSelected()} size="md" className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Next
            <ArrowRightIcon className="w-4 h-4" />
            </Button>
        )}
      </div>
    </div>
  );
};

export default Step2HealthQuestionnaire;