// Mock data to simulate different vehicle responses
const mockVehicles = [
  {
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    trim: "Long Range",
    estimatedValue: 45500,
    tradeInValue: 42000,
    retailValue: 47500,
  },
  {
    make: "Tesla",
    model: "Model Y",
    year: 2023,
    trim: "Performance",
    estimatedValue: 55800,
    tradeInValue: 52500,
    retailValue: 58500,
  },
  {
    make: "Tesla",
    model: "Model S",
    year: 2023,
    trim: "Plaid",
    estimatedValue: 105000,
    tradeInValue: 98000,
    retailValue: 109500,
  }
];

interface ValuationResponse {
  make: string;
  model: string;
  year: number;
  trim: string;
  estimatedValue: number;
  tradeInValue?: number;
  retailValue?: number;
  cpoValue?: number;
}

// Helper function to validate VIN format
const isValidVin = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get consistent mock data based on VIN
const getMockIndexFromVin = (vin: string): number => {
  // Use specific VINs for consistent data
  if (vin === "5YJ3E1EA1PF123456") return 0; // Tesla Model 3
  if (vin === "7SAYGDEF9PF789012") return 1; // Tesla Model Y
  if (vin === "5YJSA1E47PF456789") return 2; // Tesla Model S
  
  // For other VINs, use the original hash method
  return vin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockVehicles.length;
};

export async function getVehicleValuation(vin: string): Promise<ValuationResponse> {
  // Simulate API delay (between 500ms and 1.5s)
  await delay(Math.random() * 1000 + 500);

  // Validate VIN format
  if (!isValidVin(vin)) {
    throw new Error('Invalid VIN format. VIN must be 17 characters long and contain only letters (except I, O, Q) and numbers.');
  }

  // Simulate different API responses based on VIN
  const lastChar = vin.charAt(vin.length - 1).toLowerCase();
  
  // Simulate API errors occasionally
  if (lastChar === 'x') {
    throw new Error('Vehicle not found. Please check the VIN and try again.');
  }
  if (lastChar === 'z') {
    throw new Error('API rate limit exceeded. Please try again later.');
  }

  // Return consistent mock data based on VIN
  const mockIndex = getMockIndexFromVin(vin);
  return mockVehicles[mockIndex];
}
