import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AIAssistant = () => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getAdvice = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/ai/advice');
      setAdvice(res.data.advice);
    } catch (error) {
      setAdvice('<p>Could not fetch AI advice.</p>');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { getAdvice(); }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
      {isLoading ? (
        <p className="text-cyan-400 animate-pulse">FinVisor is thinking...</p>
      ) : (
        <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: advice }} />
      )}
      <button onClick={getAdvice} disabled={isLoading} className="button-secondary w-full mt-4">
        <SparklesIcon className="h-5 w-5 mr-2 inline" />
        Refresh Advice
      </button>
    </div>
  );
};

export default AIAssistant;
