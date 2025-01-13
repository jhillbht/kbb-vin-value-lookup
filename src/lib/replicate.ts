import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase.functions.invoke("replicate", {
      body: {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: `high quality professional photo of a ${prompt}, automotive photography, studio lighting, 4k, detailed`,
          negative_prompt: "ugly, blurry, low quality, distorted, text, watermark",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      },
    });

    if (error) {
      console.error("Error from Supabase function:", error);
      if (error.message.includes("402")) {
        const errorMessage = "Billing setup required for Replicate API. Please visit https://replicate.com/account/billing to set up billing.";
        toast({
          title: "Billing Required",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
      throw error;
    }

    console.log("Generation response:", data);
    return data;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const checkGenerationStatus = async (url: string): Promise<GenerationResponse> => {
  try {
    console.log("Checking generation status at URL:", url);
    // Remove any trailing colons from the URL
    const cleanUrl = url.replace(/:\/?$/, '');
    const predictionId = cleanUrl.split('/').pop();
    
    if (!predictionId) {
      throw new Error("Invalid prediction URL");
    }

    const { data, error } = await supabase.functions.invoke("replicate", {
      body: {
        predictionId,
      },
    });

    if (error) {
      console.error("Error from Supabase function:", error);
      throw error;
    }

    console.log("Status check response:", data);
    return data;
  } catch (error) {
    console.error("Error checking generation status:", error);
    throw error;
  }
};