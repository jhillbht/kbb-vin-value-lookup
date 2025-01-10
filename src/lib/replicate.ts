import { toast } from "@/hooks/use-toast";

const REPLICATE_API_KEY = "r8_TgDOuItziSv8IOM9sQk6rLHMZGoPxyJ3hOXcO";
const BASE_URL = import.meta.env.PROD 
  ? "https://api.replicate.com/v1/predictions"
  : "/api/replicate/predictions";

export interface GenerationResponse {
  id: string;
  urls: {
    get: string;
    cancel: string;
  };
  status: "starting" | "processing" | "succeeded" | "failed";
  output?: string[];
  error?: string;
}

export const generateVehicleImage = async (prompt: string): Promise<GenerationResponse> => {
  try {
    console.log("Generating image with prompt:", prompt);
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: `high quality professional photo of a ${prompt}, automotive photography, studio lighting, 4k, detailed`,
          negative_prompt: "ugly, blurry, low quality, distorted, text, watermark",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 402) {
        const errorMessage = "Billing setup required for Replicate API. Please visit https://replicate.com/account/billing to set up billing.";
        toast({
          title: "Billing Required",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
      throw new Error(data.detail || "Failed to generate image");
    }

    console.log("Generation response:", data);
    return data;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const checkGenerationStatus = async (
  url: string
): Promise<GenerationResponse> => {
  // In production, use the original URL, in development use the proxy
  const checkUrl = import.meta.env.PROD 
    ? url 
    : url.replace('https://api.replicate.com/v1', '/api/replicate');

  try {
    console.log("Checking generation status at URL:", checkUrl);
    const response = await fetch(checkUrl, {
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to check generation status");
    }

    const data = await response.json();
    console.log("Status check response:", data);
    return data;
  } catch (error) {
    console.error("Error checking generation status:", error);
    throw error;
  }
};