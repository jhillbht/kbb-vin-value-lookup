// Mock data to simulate different vehicle responses
const mockVehicles = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    trim: "SE",
    estimatedValue: 22500,
    tradeInValue: 20000,
    retailValue: 24500,
    cpoValue: 23000
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2019,
    trim: "EX",
    estimatedValue: 19800,
    tradeInValue: 17500,
    retailValue: 21500,
  },
  {
    make: "Ford",
    model: "F-150",
    year: 2021,
    trim: "XLT",
    estimatedValue: 35000,
    tradeInValue: 32000,
    retailValue: 37500,
    cpoValue: 35500
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

  // Return a random mock vehicle, but consistently based on the VIN
  const mockIndex = vin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockVehicles.length;
  return mockVehicles[mockIndex];
}