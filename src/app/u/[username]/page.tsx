'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';

interface FormData {
  content: string;
}

function SendFeedbackPage() {
  const [isUserUnique, setIsUserUnique] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAcceptingMesaage, setIsAcceptingMessage] = useState<boolean>(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [suggestedUsers, setSuggestedUsers] = useState<string[]>([]);
  const [feedbackSuggestions, setFeedbackSuggestions] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<string>('');
  const params = useParams<{ username: string }>();
  const username = params.username;

  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserExists = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        setIsUserUnique(!response.data.success);

        if (response.data.success) {
          const randomUsersResponse = await axios.get('/api/get-users');
          setSuggestedUsers(randomUsersResponse.data.users || []);
        }
      } catch (error) {
        console.log('Error in fetching valid user', error);
        setIsUserUnique(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserExists();
  }, [username]);

  const fetchFeedbackSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      const suggestions = response.data.script.split('||').map((item: string) => item.trim());
      setFeedbackSuggestions(suggestions);
    } catch (error) {
      console.log('Error fetching feedback suggestions', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchFeedbackSuggestions();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content,
      });

      toast({
        title: response.data.message,
        variant: response.data.success ? 'default' : 'destructive',
      });

      if (response.data.success) {
        reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data.message === 'User not accepting messages') {
        setIsAcceptingMessage(false);
        const randomUsersResponse = await axios.get('/api/get-users');
        setSuggestedUsers(randomUsersResponse.data.users || []);
      }
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackClick = (feedback: string) => {
    setSelectedFeedback(feedback);
    setValue('content', feedback);
  };

  const handleRefreshClick = () => {
    fetchFeedbackSuggestions(); // Fetch a new batch of feedback suggestions when clicked
  };

  if (!isUserUnique) {
    return (
      <div className="h-screen flex items-center justify-center bg-white bg-pattern">
        <div className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-red-500 mb-4">Check the link again!</h1>
          <p className="text-lg text-gray-600">No one with the username <strong>{username}</strong> exists.</p>
          <h3 className="text-xl font-medium mt-6">Try sending a response to these users:</h3>
          <ul className="mt-3 list-disc pl-5">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((user, index) => (
                <li key={index}>
                  <Link href={`/u/${user}`} className="text-blue-600 hover:text-blue-800">{user}</Link>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No suggestions available</p>
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-5xl w-full p-6 flex gap-8 bg-white rounded-lg shadow-lg">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-semibold mb-4">Leave Your Opinion</h1>
          <h2 className="text-2xl font-semibold mb-4">Send a message to <strong>{username}</strong></h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              {...register('content', { required: true })}
              value={selectedFeedback}
              onChange={(e) => setSelectedFeedback(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your feedback here..."
            />
            <Button type="submit" disabled={isLoading} className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
            </Button>
          </form>
          {!isAcceptingMesaage && (
            <div className="mt-6">
              <h3 className="text-xl font-medium">Try sending a response to these users:</h3>
              <ul className="mt-3 list-disc pl-5">
                {suggestedUsers.length > 0 ? (
                  suggestedUsers.map((user, index) => (
                    <li key={index}>
                      <Link href={`/u/${user}`} className="text-blue-600 hover:text-blue-800">{user}</Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No suggestions available</p>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="w-80 space-y-4">
          <h3 className="text-xl font-medium mb-2">Feedback Suggestions:</h3>
          <button
            onClick={handleRefreshClick}
            className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
          >
            <RefreshCcw className="h-6 w-6 mr-2" />
            Refresh Suggestions
          </button>
          {isLoadingSuggestions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ul className="space-y-3">
              {feedbackSuggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFeedbackClick(suggestion)}
                    className="w-full text-left p-4 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendFeedbackPage;
