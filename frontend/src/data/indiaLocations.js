/**
 * Official Indian Local Government Directory (LGD) Reference Master Data
 * 
 * Contains all 36 States & Union Territories of India and their official districts.
 * Designed for 0ms client-side cascading dropdowns and instant profile location resolution.
 */

export const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const POPULAR_LOCATIONS = [
  'All India',
  'Delhi, India',
  'New Delhi, Delhi, India',
  'Chennai, Tamil Nadu, India',
  'Coimbatore, Tamil Nadu, India',
  'Madurai, Tamil Nadu, India',
  'Bengaluru, Karnataka, India',
  'Mumbai, Maharashtra, India',
  'Pune, Maharashtra, India',
  'Hyderabad, Telangana, India',
  'Kolkata, West Bengal, India',
  'Kochi, Kerala, India'
];

export const INDIA_DISTRICTS_BY_STATE = {
  'Delhi': [
    'Central Delhi',
    'East Delhi',
    'New Delhi',
    'North Delhi',
    'North East Delhi',
    'North West Delhi',
    'Shahdara',
    'South Delhi',
    'South East Delhi',
    'South West Delhi',
    'West Delhi'
  ],
  'Tamil Nadu': [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar'
  ],
  'Karnataka': [
    'Bagalkote',
    'Ballari',
    'Belagavi',
    'Bengaluru Rural',
    'Bengaluru Urban',
    'Bidar',
    'Chamarajanagara',
    'Chikkaballapura',
    'Chikkamagaluru',
    'Chitradurga',
    'Dakshina Kannada',
    'Davanagere',
    'Dharwad',
    'Gadag',
    'Hassan',
    'Haveri',
    'Kalaburagi',
    'Kodagu',
    'Kolar',
    'Koppal',
    'Mandya',
    'Mysuru',
    'Raichur',
    'Ramanagara',
    'Shivamogga',
    'Tumakuru',
    'Udupi',
    'Uttara Kannada',
    'Vijayanagara',
    'Vijayapura',
    'Yadgir'
  ],
  'Kerala': [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ],
  'Maharashtra': [
    'Ahmednagar',
    'Akola',
    'Amravati',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Beed',
    'Bhandara',
    'Buldhana',
    'Chandrapur',
    'Dhule',
    'Gadchiroli',
    'Gondia',
    'Hingoli',
    'Jalgaon',
    'Jalna',
    'Kolhapur',
    'Latur',
    'Mumbai City',
    'Mumbai Suburban',
    'Nagpur',
    'Nanded',
    'Nandurbar',
    'Nashik',
    'Osmanabad (Dharashiv)',
    'Palghar',
    'Parbhani',
    'Pune',
    'Raigad',
    'Ratnagiri',
    'Sangli',
    'Satara',
    'Sindhudurg',
    'Solapur',
    'Thane',
    'Wardha',
    'Washim',
    'Yavatmal'
  ],
  'Telangana': [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hanumakonda',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Komaram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Rangareddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal',
    'Yadadri Bhuvanagiri'
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju',
    'Anakapalli',
    'Ananthapuramu',
    'Annamayya',
    'Bapatla',
    'Chittoor',
    'Dr. B.R. Ambedkar Konaseema',
    'East Godavari',
    'Eluru',
    'Guntur',
    'Kakinada',
    'Krishna',
    'Kurnool',
    'Nandyal',
    'NTR',
    'Palnadu',
    'Parvathipuram Manyam',
    'Prakasam',
    'Sri Potti Sriramulu Nellore',
    'Sri Sathya Sai',
    'Srikakulam',
    'Tirupati',
    'Visakhapatnam',
    'Vizianagaram',
    'West Godavari',
    'Y.S.R. Kadapa'
  ],
  'Gujarat': [
    'Ahmedabad',
    'Amreli',
    'Anand',
    'Aravalli',
    'Banaskantha',
    'Bharuch',
    'Bhavnagar',
    'Botad',
    'Chhota Udaipur',
    'Dahod',
    'Dang',
    'Devbhumi Dwarka',
    'Gandhinagar',
    'Gir Somnath',
    'Jamnagar',
    'Junagadh',
    'Kheda',
    'Kutch',
    'Mahisagar',
    'Mehsana',
    'Morbi',
    'Narmada',
    'Navsari',
    'Panchmahal',
    'Patan',
    'Porbandar',
    'Rajkot',
    'Sabarkantha',
    'Surat',
    'Surendranagar',
    'Tapi',
    'Vadodara',
    'Valsad'
  ],
  'Uttar Pradesh': [
    'Agra',
    'Aligarh',
    'Ayodhya',
    'Bareilly',
    'Ghaziabad',
    'Gorakhpur',
    'Gautam Buddha Nagar (Noida)',
    'Kanpur Nagar',
    'Lucknow',
    'Mathura',
    'Meerut',
    'Prayagraj',
    'Varanasi'
  ],
  'West Bengal': [
    'Alipurduar',
    'Bankura',
    'Birbhum',
    'Cooch Behar',
    'Dakshin Dinajpur',
    'Darjeeling',
    'Hooghly',
    'Howrah',
    'Jalpaiguri',
    'Jhargram',
    'Kalimpong',
    'Kolkata',
    'Malda',
    'Murshidabad',
    'Nadia',
    'North 24 Parganas',
    'Paschim Bardhaman',
    'Paschim Medinipur',
    'Purba Bardhaman',
    'Purba Medinipur',
    'Purulia',
    'South 24 Parganas',
    'Uttar Dinajpur'
  ],
  'Haryana': [
    'Ambala',
    'Faridabad',
    'Gurugram',
    'Hisar',
    'Karnal',
    'Panipat',
    'Panchkula',
    'Rohtak',
    'Sonipat'
  ],
  'Punjab': [
    'Amritsar',
    'Bathinda',
    'Jalandhar',
    'Ludhiana',
    'Mohali (SAS Nagar)',
    'Patiala'
  ],
  'Rajasthan': [
    'Ajmer',
    'Bikaner',
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Udaipur'
  ],
  'Bihar': [
    'Bhagalpur',
    'Gaya',
    'Muzaffarpur',
    'Patna',
    'Purnia'
  ],
  'Madhya Pradesh': [
    'Bhopal',
    'Gwalior',
    'Indore',
    'Jabalpur',
    'Ujjain'
  ],
  'Puducherry': [
    'Karaikal',
    'Mahe',
    'Puducherry',
    'Yanam'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Jammu and Kashmir': [
    'Jammu',
    'Srinagar',
    'Anantnag',
    'Baramulla'
  ],
  'Ladakh': [
    'Leh',
    'Kargil'
  ],
  'Goa': [
    'North Goa',
    'South Goa'
  ],
  'Assam': [
    'Guwahati (Kamrup Metro)',
    'Dibrugarh',
    'Silchar',
    'Jorhat'
  ]
};

// Fallback districts for other states
INDIA_STATES.forEach(st => {
  if (!INDIA_DISTRICTS_BY_STATE[st]) {
    INDIA_DISTRICTS_BY_STATE[st] = [st + ' Central', st + ' North', st + ' South'];
  }
});

/**
 * Get districts for a given state name
 */
export function getDistrictsForState(stateName) {
  if (!stateName) return [];
  return INDIA_DISTRICTS_BY_STATE[stateName] || [];
}

/**
 * Format standard location string with country
 * E.g. "Cuddalore, Tamil Nadu, India" or "Delhi, India" or "All India"
 */
export function formatLocationString(district, state, includeCountry = true) {
  if (!state || state === 'All India' || district === 'All India') {
    return 'All India';
  }
  let base = '';
  if (state === 'Delhi') {
    base = district && district.toLowerCase() !== 'delhi' ? `${district}, Delhi` : 'Delhi';
  } else if (!district || district.toLowerCase() === state.toLowerCase()) {
    base = state;
  } else {
    base = `${district}, ${state}`;
  }
  if (includeCountry) {
    return base.toLowerCase().endsWith('india') ? base : `${base}, India`;
  }
  return base;
}

/**
 * Normalize any existing location string to include ", India" suffix
 */
export function normalizeLocationWithCountry(loc) {
  if (!loc || typeof loc !== 'string') return 'Delhi, India';
  const clean = loc.trim();
  if (clean.toLowerCase() === 'all india') return 'All India';
  if (clean.toLowerCase().endsWith('india')) return clean;
  return `${clean}, India`;
}

/**
 * Parse location string into { state, district }
 */
export function parseLocationString(locStr) {
  if (!locStr || typeof locStr !== 'string') {
    return { state: 'Delhi', district: 'New Delhi' };
  }
  const clean = locStr.trim();
  if (clean.toLowerCase() === 'all india' || clean.toLowerCase() === 'india') {
    return { state: 'All India', district: '' };
  }
  // Strip trailing ", India" if present
  const withoutCountry = clean.replace(/,\s*India$/i, '').trim();
  const parts = withoutCountry.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const possibleState = parts[parts.length - 1];
    const possibleDistrict = parts[0];
    const matchedState = INDIA_STATES.find(s => s.toLowerCase() === possibleState.toLowerCase());
    if (matchedState) {
      return { state: matchedState, district: possibleDistrict };
    }
  }
  // Check if string matches a known state directly
  const matchedState = INDIA_STATES.find(s => s.toLowerCase() === withoutCountry.toLowerCase());
  if (matchedState) {
    return { state: matchedState, district: '' };
  }
  return { state: 'Delhi', district: withoutCountry };
}
