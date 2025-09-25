"use client";

import React from "react";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-orange-50 text-center p-6">
      <h1 className="text-4xl font-bold text-orange-900">
        404 - Page Not Found
      </h1>
      <p className="text-orange-800 text-lg">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <Button
        onClick={() => router.push("/dashboard")}
        className="mt-4"
        variant="default"
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
