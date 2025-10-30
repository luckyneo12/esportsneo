// Indian States and Cities for Tower Location
// Simple dropdown system - No Google Maps API needed

export const INDIAN_LOCATIONS = {
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Kurnool',
    'Tirupati',
    'Rajahmundry',
  ],
  'Arunachal Pradesh': [
    'Itanagar',
    'Naharlagun',
    'Pasighat',
  ],
  'Assam': [
    'Guwahati',
    'Silchar',
    'Dibrugarh',
    'Jorhat',
    'Nagaon',
  ],
  'Bihar': [
    'Patna',
    'Gaya',
    'Bhagalpur',
    'Muzaffarpur',
    'Purnia',
    'Darbhanga',
  ],
  'Chhattisgarh': [
    'Raipur',
    'Bhilai',
    'Bilaspur',
    'Korba',
    'Durg',
  ],
  'Goa': [
    'Panaji',
    'Margao',
    'Vasco da Gama',
    'Mapusa',
  ],
  'Gujarat': [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Jamnagar',
    'Gandhinagar',
  ],
  'Haryana': [
    'Faridabad',
    'Gurgaon',
    'Panipat',
    'Ambala',
    'Yamunanagar',
    'Rohtak',
    'Hisar',
  ],
  'Himachal Pradesh': [
    'Shimla',
    'Dharamshala',
    'Solan',
    'Mandi',
    'Kullu',
  ],
  'Jharkhand': [
    'Ranchi',
    'Jamshedpur',
    'Dhanbad',
    'Bokaro',
    'Deoghar',
  ],
  'Karnataka': [
    'Bangalore',
    'Mysore',
    'Hubli',
    'Mangalore',
    'Belgaum',
    'Gulbarga',
    'Davangere',
  ],
  'Kerala': [
    'Thiruvananthapuram',
    'Kochi',
    'Kozhikode',
    'Thrissur',
    'Kollam',
    'Kannur',
  ],
  'Madhya Pradesh': [
    'Indore',
    'Bhopal',
    'Jabalpur',
    'Gwalior',
    'Ujjain',
    'Sagar',
    'Ratlam',
  ],
  'Maharashtra': [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Thane',
    'Nashik',
    'Aurangabad',
    'Solapur',
    'Kolhapur',
  ],
  'Manipur': [
    'Imphal',
    'Thoubal',
    'Bishnupur',
  ],
  'Meghalaya': [
    'Shillong',
    'Tura',
    'Jowai',
  ],
  'Mizoram': [
    'Aizawl',
    'Lunglei',
    'Champhai',
  ],
  'Nagaland': [
    'Kohima',
    'Dimapur',
    'Mokokchung',
  ],
  'Odisha': [
    'Bhubaneswar',
    'Cuttack',
    'Rourkela',
    'Berhampur',
    'Sambalpur',
  ],
  'Punjab': [
    'Ludhiana',
    'Amritsar',
    'Jalandhar',
    'Patiala',
    'Bathinda',
    'Mohali',
  ],
  'Rajasthan': [
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Bikaner',
    'Udaipur',
    'Ajmer',
    'Bhilwara',
  ],
  'Sikkim': [
    'Gangtok',
    'Namchi',
    'Gyalshing',
  ],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Erode',
  ],
  'Telangana': [
    'Hyderabad',
    'Warangal',
    'Nizamabad',
    'Karimnagar',
    'Khammam',
  ],
  'Tripura': [
    'Agartala',
    'Udaipur',
    'Dharmanagar',
  ],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Ghaziabad',
    'Agra',
    'Meerut',
    'Varanasi',
    'Allahabad',
    'Bareilly',
    'Aligarh',
    'Moradabad',
  ],
  'Uttarakhand': [
    'Dehradun',
    'Haridwar',
    'Roorkee',
    'Haldwani',
    'Rudrapur',
  ],
  'West Bengal': [
    'Kolkata',
    'Howrah',
    'Durgapur',
    'Asansol',
    'Siliguri',
    'Darjeeling',
  ],
  'Delhi': [
    'New Delhi',
    'North Delhi',
    'South Delhi',
    'East Delhi',
    'West Delhi',
    'Central Delhi',
  ],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Jammu and Kashmir': [
    'Srinagar',
    'Jammu',
    'Anantnag',
    'Baramulla',
    'Udhampur',
  ],
  'Ladakh': ['Leh', 'Kargil'],
};

// Get all states
export const getStates = (): string[] => {
  return Object.keys(INDIAN_LOCATIONS).sort();
};

// Get cities by state
export const getCitiesByState = (state: string): string[] => {
  return INDIAN_LOCATIONS[state as keyof typeof INDIAN_LOCATIONS] || [];
};

// Get all cities (for search/filter)
export const getAllCities = (): string[] => {
  const allCities: string[] = [];
  Object.values(INDIAN_LOCATIONS).forEach(cities => {
    allCities.push(...cities);
  });
  return allCities.sort();
};

// Format location string
export const formatLocation = (city: string, state: string): string => {
  return `${city}, ${state}`;
};

// Parse location string
export const parseLocation = (location: string): { city: string; state: string } | null => {
  const parts = location.split(',').map(p => p.trim());
  if (parts.length === 2) {
    return { city: parts[0], state: parts[1] };
  }
  return null;
};
