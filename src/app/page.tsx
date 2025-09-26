"use client";

import { useState, useEffect } from "react";
import LoginForm from "../components/forms/LoginForm";
import Slideshow from "@/components/Slideshow";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Slide = {
  image: string;
  quote: string;
};

const slides: Slide[] = [
  {
    image: "/images/slide-1.png",
    quote: "The key is not in spending time, but in investing it.",
  },
  {
    image: "/images/slide-2.png",
    quote: "Nothing makes a person more productive than the last minute.",
  },
  {
    image: "/images/slide-3.png",
    quote: "You may delay, but time will not.",
  },
  {
    image: "/images/slide-4.png",
    quote: "My to-do list seems to be filled with things from yesterday.",
  },
  {
    image: "/images/slide-5.png",
    quote: "Now is never a good time to wait till later.",
  },
];

export default function Login() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 400);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex flex-col md:flex-row h-screen bg-white">
      <section className="md:hidden w-full h-full flex flex-col items-center justify-center px-4 py-6 text-orange-800">
        {showForm ? (
          <LoginForm />
        ) : (
          <>
            <div className="relative h-40 w-40 -mt-20 flex items-center justify-center mx-auto">
              <Image
                src="/images/logo.png"
                alt="App Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className="relative h-72 w-4/5 mb-3 rounded-lg shadow-xl overflow-hidden">
              <Image
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
            <p
              className={`relative text-orange-700 font-medium text-lg px-3 py-2 text-center mt-7 transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {slides[currentSlide].quote}
            </p>

            <div className="flex justify-center mt-4 space-x-2">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-orange-800" : "bg-orange-600"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="mt-10 w-full bg-amber-800 text-white"
            >
              Login
            </Button>
          </>
        )}
      </section>

     
      <section className="hidden md:flex w-[35%] items-center justify-center bg-white">
        <Slideshow images={slides} />
      </section>

      <section className="hidden md:flex w-[65%] items-center justify-center px-4 bg-white">
        <LoginForm />
      </section>
    </main>
  );
}
