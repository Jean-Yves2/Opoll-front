import { useState } from 'react';
import CreateSurvey from './CreateSurveys';
import VotingResults from './VotingResults';

type SurveyData = {
  question: string;
  options: string[];
  isPublic: boolean;
  multipleChoice: boolean;
  endDate?: string;
};

function SurveyApp() {
  const [step, setStep] = useState('create');
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);

  const handleSurveySubmit = (data: SurveyData) => {
    setSurveyData(data);
    setStep('vote');
  };

  return step === 'create' ? (
    <CreateSurvey onSubmit={handleSurveySubmit} />
  ) : (
    <VotingResults />
  );
}

export default SurveyApp;
