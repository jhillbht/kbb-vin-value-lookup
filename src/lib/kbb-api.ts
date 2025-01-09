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

export async function getVehicleValuation(vin: string): Promise<ValuationResponse> {
  const response = await fetch('/api/valuation/vin', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KBB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vin }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your KBB API credentials.');
    }
    if (response.status === 404) {
      throw new Error('Vehicle not found. Please check the VIN and try again.');
    }
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    throw new Error('Failed to fetch vehicle data. Please try again later.');
  }

  const data = await response.json();
  
  // Validate required fields
  if (!data.make || !data.model || !data.year || !data.estimatedValue) {
    throw new Error('Incomplete vehicle data received from KBB API.');
  }

  return data;
}