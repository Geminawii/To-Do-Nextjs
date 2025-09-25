'use client'

import { useEffect, useState } from 'react';

export default function Greeting() {
  const [greeting, setGreeting] = useState<string>(""); 

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning! What’s on your list today?");
    } else if (hour < 18) {
      setGreeting("Good afternoon! Ready to tackle your tasks?");
    } else {
      setGreeting("Good evening! Let’s wrap up today’s plans.");
    }
  }, []);

  return (
    <p className="text-xl sm:text-2xl font-bold text-orange-900 mb-4 justify-center text-center">
      {greeting || "What plans do you have for today?"}
    </p>
  );
}
