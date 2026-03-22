// Top 25 UK industries for programmatic SEO pages
// Each maps to one or more SIC code prefixes for Companies House search

export interface Industry {
  name: string;
  slug: string;
  sicPrefixes: string[]; // 2-digit SIC code prefixes
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    name: 'IT & Software',
    slug: 'it-software',
    sicPrefixes: ['62', '63'],
    description: 'Computer programming, consultancy, data processing, and information technology services.',
  },
  {
    name: 'Construction',
    slug: 'construction',
    sicPrefixes: ['41', '42', '43'],
    description: 'Building construction, civil engineering, and specialist construction activities.',
  },
  {
    name: 'Retail',
    slug: 'retail',
    sicPrefixes: ['47'],
    description: 'Retail trade in stores, online, and market stalls across all product categories.',
  },
  {
    name: 'Financial Services',
    slug: 'financial-services',
    sicPrefixes: ['64', '66'],
    description: 'Banking, investment, fund management, and financial intermediation services.',
  },
  {
    name: 'Real Estate',
    slug: 'real-estate',
    sicPrefixes: ['68'],
    description: 'Buying, selling, renting, and managing residential and commercial property.',
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    sicPrefixes: ['86', '87', '88'],
    description: 'Hospitals, medical practices, residential care, and social work activities.',
  },
  {
    name: 'Legal & Accounting',
    slug: 'legal-accounting',
    sicPrefixes: ['69'],
    description: 'Law firms, solicitors, chartered accountants, bookkeeping, and tax advisory.',
  },
  {
    name: 'Management Consultancy',
    slug: 'management-consultancy',
    sicPrefixes: ['70'],
    description: 'Business management consulting, head office activities, and strategic advisory.',
  },
  {
    name: 'Recruitment',
    slug: 'recruitment',
    sicPrefixes: ['78'],
    description: 'Employment agencies, temporary staffing, and executive search firms.',
  },
  {
    name: 'Education',
    slug: 'education',
    sicPrefixes: ['85'],
    description: 'Schools, universities, training providers, and educational support services.',
  },
  {
    name: 'Manufacturing',
    slug: 'manufacturing',
    sicPrefixes: ['10', '11', '13', '14', '20', '22', '24', '25', '26', '27', '28', '31', '32'],
    description: 'Production of goods from food and textiles to electronics and machinery.',
  },
  {
    name: 'Wholesale',
    slug: 'wholesale',
    sicPrefixes: ['46'],
    description: 'Wholesale trade and distribution of goods to businesses and retailers.',
  },
  {
    name: 'Food & Beverage',
    slug: 'food-beverage',
    sicPrefixes: ['56'],
    description: 'Restaurants, cafes, pubs, takeaways, catering, and mobile food services.',
  },
  {
    name: 'Accommodation',
    slug: 'accommodation',
    sicPrefixes: ['55'],
    description: 'Hotels, B&Bs, holiday lets, camping sites, and short-stay accommodation.',
  },
  {
    name: 'Transport & Logistics',
    slug: 'transport-logistics',
    sicPrefixes: ['49', '50', '51', '52', '53'],
    description: 'Road freight, passenger transport, warehousing, postal, and courier services.',
  },
  {
    name: 'Architecture & Engineering',
    slug: 'architecture-engineering',
    sicPrefixes: ['71'],
    description: 'Architectural practices, engineering consultancies, and technical testing.',
  },
  {
    name: 'Advertising & Marketing',
    slug: 'advertising-marketing',
    sicPrefixes: ['73'],
    description: 'Advertising agencies, PR firms, market research, and media buying.',
  },
  {
    name: 'Insurance',
    slug: 'insurance',
    sicPrefixes: ['65'],
    description: 'Life insurance, non-life insurance, reinsurance, and pension funding.',
  },
  {
    name: 'Motor Vehicle Trade',
    slug: 'motor-vehicle-trade',
    sicPrefixes: ['45'],
    description: 'Car dealerships, vehicle repair, parts sales, and motorcycle trade.',
  },
  {
    name: 'Telecommunications',
    slug: 'telecommunications',
    sicPrefixes: ['61'],
    description: 'Wired, wireless, satellite telecommunications, and internet service providers.',
  },
  {
    name: 'Warehousing & Storage',
    slug: 'warehousing-storage',
    sicPrefixes: ['52'],
    description: 'Warehousing, storage facilities, and support activities for transportation.',
  },
  {
    name: 'Security Services',
    slug: 'security-services',
    sicPrefixes: ['80'],
    description: 'Private security, investigation services, and security system installation.',
  },
  {
    name: 'Facilities Management',
    slug: 'facilities-management',
    sicPrefixes: ['81'],
    description: 'Building cleaning, landscaping, and combined facilities support services.',
  },
  {
    name: 'Publishing & Media',
    slug: 'publishing-media',
    sicPrefixes: ['58', '59', '60'],
    description: 'Book and magazine publishing, film production, TV broadcasting, and digital media.',
  },
  {
    name: 'Agriculture & Farming',
    slug: 'agriculture-farming',
    sicPrefixes: ['01', '02', '03'],
    description: 'Crop growing, animal farming, forestry, fishing, and agricultural services.',
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
