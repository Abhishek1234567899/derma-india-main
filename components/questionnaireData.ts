import React from 'react';
import {
    MaleHairLoss1, MaleHairLoss2, MaleHairLoss3, MaleHairLoss4,
    MaleHairLoss5, MaleHairLoss6, MaleHairLossCoinPatch, MaleHairLossHeavyFall
} from './Icons';

interface ImageRadioOption {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type Question = {
  question: string;
  key: string;
} & (
  | {
      type: 'single' | 'multiple';
      options: string[];
      imageOptions?: never;
    }
  | {
      type: 'image-radio';
      options?: never;
      imageOptions: ImageRadioOption[];
    }
);


export const maleQuestions: Question[] = [
    {
        question: "How much hair do you lose on an average day?",
        key: 'hairfallAmountMale',
        type: 'single',
        options: ["Less than 50 strands", "50-100 strands", "100-200 strands", "More than 200 strands / In clumps"],
    },
    {
        question: "Which image best describes your hair loss?",
        key: 'hairlossImageMale',
        type: 'image-radio',
        imageOptions: [
            { label: "Stage - 1", icon: MaleHairLoss1 },
            { label: "Stage - 2", icon: MaleHairLoss2 },
            { label: "Stage - 3", icon: MaleHairLoss3 },
            { label: "Stage - 4", icon: MaleHairLoss4 },
            { label: "Stage - 5", icon: MaleHairLoss5 },
            { label: "Stage - 6", icon: MaleHairLoss6 },
            { label: "Coin Size Patch", icon: MaleHairLossCoinPatch },
            { label: "Heavy Hair Fall", icon: MaleHairLossHeavyFall },
        ],
    },
    {
        question: "Where are you primarily experiencing hair loss?",
        key: 'hairlossLocationMale',
        type: 'single',
        options: ["Hairline/Temples", "Crown/Top of head", "Overall thinning", "All of the above"],
    },
    {
        question: "Do you have a family history of baldness (from either parent's side)?",
        key: 'familyHistory',
        type: 'single',
        options: ["Yes", "No", "I'm not sure"],
    },
    {
        question: "Do you experience dandruff?",
        key: 'dandruff',
        type: 'single',
        options: ["Never", "Occasionally", "Frequently (visible flakes)"],
    },
    {
        question: "How would you describe your scalp?",
        key: 'scalpType',
        type: 'single',
        options: ["Oily (gets greasy within a day)", "Dry and flaky", "Normal (balanced)", "Itchy or irritated"],
    },
    {
        question: "How would you rate your current stress levels?",
        key: 'stressLevel',
        type: 'single',
        options: ["Low", "Moderate", "High", "Very High"],
    },
    {
        question: "Have you experienced any of the following recently?",
        key: 'medicalConditions',
        type: 'multiple',
        options: ["Major illness or surgery", "Significant weight loss or gain", "Started or stopped new medication", "None of the above"],
    },
    {
        question: "What is your typical diet like?",
        key: 'proteinIntake',
        type: 'single',
        options: ["Rich in protein (meat, fish, eggs, legumes)", "Balanced diet", "Mostly vegetarian/vegan", "High in processed/junk food"],
    },
    {
        question: "How often do you wash your hair?",
        key: 'hairwashFrequency',
        type: 'single',
        options: ["Daily", "Every 2-3 days", "Once a week", "Less than once a week"],
    },
];

export const femaleQuestions: Question[] = [
    {
        question: "How much hairfall do you experience while oiling, combing or washing your hair?",
        key: 'hairfallAmountFemale',
        type: 'single',
        options: ["Normal hairfall (~20 strands)", "I notice a bigger clump than normal (~40-50 strands)", "I get very big clumps of hair, more than 100 hair strands"],
    },
    {
        question: "How long have you been experiencing increased hairfall?",
        key: 'hairfallDuration',
        type: 'single',
        options: ["Less than 6 months", "6 months to 2 years", "2 years to 5 years", "More than 5 years", "Not Applicable"],
    },
    {
        question: "What does your hair feel like, when you touch it?",
        key: 'hairFeel',
        type: 'multiple',
        options: ["Split ends", "Feels frizzy, dry, or rough to touch", "Breaks easily", "Sometimes soft/silky, sometimes rough/frizzy"],
    },
    {
        question: "What hair treatments have you done in the past 2 years?",
        key: 'hairTreatmentsFemale',
        type: 'multiple',
        options: ["None", "Smoothening or Straightening treatment", "Hair repair treatment", "Chemical hair coloring", "Natural hair coloring", "Other hair treatments"],
    },
    {
        question: "What is your experience with dandruff these days?",
        key: 'dandruffFemale',
        type: 'single',
        options: ["No dandruff at all", "No dandruff on wash day, but appears 2–3 days after", "Always see visible dandruff flakes or powder on hair or shoulder", "Scalp is always itchy (sticky dandruff under nails upon scratching)", "Persistent red, dry patches on your scalp"],
    },
    {
        question: "Are you going through any of these life stages currently?",
        key: 'lifeStages',
        type: 'single',
        options: ["None", "Planning to get pregnant sometime soon", "Currently pregnant", "Post pregnancy (My baby is less than 1 year old)", "I don’t get my periods anymore"],
    },
    {
        question: "How well do you sleep these days?",
        key: 'sleepQualityFemale',
        type: 'single',
        options: ["Peacefully for 6–8 hours", "I have difficulty falling asleep", "Disturbed sleep (I wake up at least once a night)", "I sleep for less than 5 hours, as I am very busy", "It varies (Some days I get good sleep, some days I don't)"],
    },
    {
        question: "How would you describe your stress level these days?",
        key: 'stressLevelFemale',
        type: 'single',
        options: ["I feel calm and relaxed most days, with no major worries", "I feel tensed 1–2 times a week, but it’s manageable", "I feel tensed 3–5 times a week, and it affects my mood or focus", "I feel tensed almost every day, and it disrupts my sleep or daily life"],
    },
    {
        question: "How would you describe your typical energy during the day?",
        key: 'energyLevelsFemale',
        type: 'single',
        options: ["I always feel energetic", "Energetic during the day, but low/tired by evening/night", "Low/tired when I wake up, but gradually feel more energetic", "Experience occasional instances of low energy", "I always feel tired and low on energy"],
    },
    {
        question: "Are you currently taking any supplements or vitamins for hair?",
        key: 'supplementsFemale',
        type: 'single',
        options: ["Yes", "No"],
    },
    {
        question: "Which of these best describe your food habits on most days?",
        key: 'foodHabits',
        type: 'single',
        options: ["I mostly eat healthy homely meals, on time", "I mostly eat healthy homely food, but often skip meals", "I often eat junk food (more than 5 times a week)"],
    },
    {
        question: "Do you experience scalp itching or redness frequently?",
        key: 'scalpItchingFemale',
        type: 'single',
        options: ["Never", "Occasionally (once in a while)", "Frequently (at least once a week)", "Almost every day"],
    },
    {
        question: "Do you notice any flakes, buildup, or oily patches on your scalp?",
        key: 'scalpBuildup',
        type: 'single',
        options: ["No flakes or buildup", "Mild flakes occasionally", "Frequent flakes or oiliness", "Thick buildup and greasy scalp"],
    },
    {
        question: "Do you feel your scalp is dry or tight after washing?",
        key: 'scalpDryness',
        type: 'single',
        options: ["Never", "Sometimes, especially in winter"],
    },
];
