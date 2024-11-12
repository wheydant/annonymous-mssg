'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const Home = () => {
  const [creators, setCreators] = useState<string[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get('/api/get-users');
        if (response.data.success) {
          setCreators(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching popular creators:", error);
      }
    };

    fetchCreators();
  }, []);

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-20 py-12 space-y-8">
        {/* Intro Section */}
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Provide Constructive Criticism to Your Favourite Creators
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
            Explore Anonymous Feedback - Where your opinion matters, not your name.
          </p>
        </section>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          {/* Left Column: Popular Creators */}
          <section className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold text-center md:text-left">
              Try Sending Feedback to Our Popular Creators
            </h2>
            <ul className="space-y-2">
              {creators.length > 0 ? (
                creators.map((creator, index) => (
                  <li key={index} className="text-center md:text-left">
                    <Link href={`/u/${creator}`} className="text-blue-600 hover:underline">
                      {creator.toUpperCase()}
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center md:text-left">No creators available at the moment.</p>
              )}
            </ul>
            <p className="text-center md:text-left">
              Are you a creator?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>{" "}
              to receive feedback.
            </p>
          </section>

          {/* Right Column: Carousel */}
          <section className="w-full md:w-1/2">
            <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <Card className="bg-gray-100 rounded-lg shadow-lg">
                        <CardHeader className="text-lg font-semibold text-center">
                          {message.title}
                        </CardHeader>
                        <CardContent className="flex aspect-square items-center justify-center p-4 text-center">
                          <span className="text-lg font-medium text-gray-800">{message.content}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-50 w-full border-t">
        © 2024 Anonymous Feedback. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
