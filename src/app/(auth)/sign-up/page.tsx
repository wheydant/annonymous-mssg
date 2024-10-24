'use client'
import { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
//New syntax for declaration
import * as z  from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"

import React from 'react'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast();
  const router = useRouter();

  //form initialization
  //Zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({ //form also called as register in doc, infer stmt specifies that it follows signUpSchema
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  //Debouncing Logic
  //useEffect(setup, dependencies)
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try{
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        }catch (error){
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message??"Error checking username"
          )
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  //Form submit logic
  // handleSubmit is a react-hook-form component and it needs an onSubmit button which always has data parameter embedded in it
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    console.log(data)

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message
      })
      //This is new page to be made which will further call /verify-code.
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Drop your Honest Suggestion
          </h1>
          <p className='mb-4'>Sign up to start your annonymous critic adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" 
                  {...field}
                  //This is actually not need when working with react-hook-form but as we are checking in the database for existing user we need to add this
                  onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }} 
                  />
                </FormControl>
                {isCheckingUsername && <Loader2 className='animate-spin'/>}
                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500':'text-red-500'}`}>
                    {usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" 
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="password" 
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>{isSubmitting? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait
              </>
            ) : ('Signup') 
            }</Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page