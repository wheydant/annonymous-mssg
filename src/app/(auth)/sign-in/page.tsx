'use client'
import { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
//New syntax for declaration
import * as z  from "zod"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  //form initialization
  //Zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({ //form also called as register in doc, infer stmt specifies that it follows signUpSchema
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  //Sign in using next-auth
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    //as we are using next-auths signIn method no need of axios
    const result = await signIn('credentials', {
      redirect: false, //not using default routing we prefer using our own method
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error){
      toast({
        title: "Login failed",
        description:"Incorrect credential or password",
        variant:"destructive"
      })
    }

    //Tackle default routing
    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Drop your Honest Suggestion
          </h1>
          <p className='mb-4'>Sign in to start your annonymous critic adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" 
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
            ) : ('Sign-in') 
            }</Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            New member?{' '}
            <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>
              Sign Up
            </Link>
            {' '}or Back to{' '}
            <Link href="/" className='text-blue-600 hover:text-blue-800'>
              Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page