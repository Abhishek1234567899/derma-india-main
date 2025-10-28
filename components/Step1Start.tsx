import React, { useState } from 'react';
import { HairProfileData } from '../types';
import Input from './common/Input';
import Button from './common/Button';
import { ArrowRightIcon } from './Icons';
import Select from './common/Select';

interface Step1StartProps {
  onNext: () => void;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
  hairProfileData: Partial<HairProfileData>;
}

const ageRanges = ["12 - 17 old", "18 - 24 old", "25 - 34 old", "35 - 54 old", "55 - 64 old", "65 - Older"];

const Step1Start: React.FC<Step1StartProps> = ({ onNext, setHairProfileData, hairProfileData }) => {
  const [name, setName] = useState(hairProfileData.name || '');
  const [email, setEmail] = useState(hairProfileData.email || '');
  const [phone, setPhone] = useState(hairProfileData.phone || '');
  const [age, setAge] = useState(hairProfileData.age || '');

  const isFormValid = name.trim() !== '' && email.trim() !== '' && age !== '';

  const handleNext = () => {
    if (isFormValid) {
      setHairProfileData(prev => ({ ...prev, name, email, phone, age }));
      onNext();
    }
  };

  return (
    <div className="animate-fade-in-up flex flex-col w-full h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Let's Begin!</h2>
          <p className="text-base text-slate-600 mt-1">Let's start with a little about you!</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="name"
              label="What's your name?*"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Select
              id="age"
              label="How old are you?*"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            >
              <option value="" disabled>Select an age range</option>
              {ageRanges.map((ageRange) => (
                <option key={ageRange} value={ageRange}>
                  {ageRange}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="email"
              label="Email*"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="phone"
              label="Phone"
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-slate-200">
        <Button variant="ghost" size="md" className="gap-2" disabled>
          &larr; Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          size="md"
          className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          Next <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1Start;