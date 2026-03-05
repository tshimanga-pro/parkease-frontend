// 1. Validate driver/receiver name
function validateName(name) {
  // Must start with capital letter, no digits, min 2 chars
  return /^[A-Z][a-zA-Z\s'-]{1,}$/.test(name);
}

// 2. Validate Ugandan number plate
function validateNumberPlate(plate) {
  // Format: UAX 123A or UAX 123
  return /^UA[A-Z]\s\d{3}[A-Z]?$/.test(plate);
}

// 3. Validate Ugandan phone number
function validatePhone(phone) {
  // Accepts +256XXXXXXXXX or 07XXXXXXXX or 06XXXXXXXX
  return /^(\+256|0)(7|6)\d{8}$/.test(phone.replace(/\s/g, ""));
}

// 4. Validate NIN (National ID Number)
function validateNIN(nin) {
  // Format: 2 letters + 8 alphanumeric + 1 letter e.g. CM12345678A
  return /^[A-Z]{2}[0-9A-Z]{8,10}[A-Z]$/i.test(nin);
}

// 5. Calculate parking fee based on type and duration
function calculateFee(vehicleType, arrivalTime, signOutTime) {
  const durationMs = signOutTime - arrivalTime;
  const durationHrs = durationMs / (1000 * 60 * 60);
  const hour = new Date(arrivalTime).getHours();
  const isDay = hour >= 6 && hour < 19; // 6am - 6:59pm = day
  const isShort = durationHrs < 3;
  const rates = {
    Truck: { short: 2000, day: 5000, night: 10000 },
    "Personal Car": { short: 2000, day: 3000, night: 2000 },
    Taxi: { short: 2000, day: 3000, night: 2000 },
    Coaster: { short: 3000, day: 4000, night: 2000 },
    "Boda-boda": { short: 1000, day: 2000, night: 2000 },
  };
  const r = rates[vehicleType] || rates["Personal Car"];
  return isShort ? r.short : isDay ? r.day : r.night;
}
