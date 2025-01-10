import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onSubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Replicate API Key Required</CardTitle>
        <CardDescription>
          Please enter your Replicate API key to enable image generation.
          You can find your API key at{" "}
          <a
            href="https://replicate.com/account/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            replicate.com/account/api-tokens
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your Replicate API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Save API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};