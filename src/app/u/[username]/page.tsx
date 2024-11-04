'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useParams} from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

interface FormData {
  content: string;
}


function SendFeedbackPage() {
  // const [isUserValid, setIsUserValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const router = useRouter();
  const params = useParams<{username: string}>()
  const username = params.username
  // console.log("Username is : ", username) => username is being captured

  const { register, handleSubmit, reset } = useForm<FormData>();
  const { toast } = useToast();

  // useEffect(() => {
  //   const checkUserExists = async () => {
  //     if (!username) return;
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get(/api/check-username-unique?username=${username})
  //       console.log(response.data)
  //       setIsUserValid(response.data.success);
  //     } catch (error) {
  //       console.log("Error in fetching valid user", error)
  //       setIsUserValid(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkUserExists();
  // }, [username]);

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
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // if (isUserValid === null || isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader2 className="h-10 w-10 animate-spin" />
  //     </div>
  //   );
  // }

  // if (!isUserValid) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-xl text-red-500">User not found or not accepting messages.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Leave Your Opinion</h1>
      <h2 className="text-2xl font-semibold mb-4">Send a message to {username}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <textarea
          {...register('content', { required: true })}
          className="input input-bordered p-2 w-full h-32"
          placeholder="Write your feedback here..."
        ></textarea>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
      </form>
    </div>
  );
}

export default SendFeedbackPage;