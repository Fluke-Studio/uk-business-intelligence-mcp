// Top 50 UK cities/towns for programmatic SEO pages
// Slug is used in URLs: /data/businesses-in-{slug}

export interface UKCity {
  name: string;
  slug: string;
  region: string;
  country: 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
}

export const UK_CITIES: UKCity[] = [
  // Major cities
  { name: 'London', slug: 'london', region: 'Greater London', country: 'England' },
  { name: 'Manchester', slug: 'manchester', region: 'Greater Manchester', country: 'England' },
  { name: 'Birmingham', slug: 'birmingham', region: 'West Midlands', country: 'England' },
  { name: 'Leeds', slug: 'leeds', region: 'West Yorkshire', country: 'England' },
  { name: 'Glasgow', slug: 'glasgow', region: 'Glasgow', country: 'Scotland' },
  { name: 'Liverpool', slug: 'liverpool', region: 'Merseyside', country: 'England' },
  { name: 'Bristol', slug: 'bristol', region: 'Bristol', country: 'England' },
  { name: 'Edinburgh', slug: 'edinburgh', region: 'Edinburgh', country: 'Scotland' },
  { name: 'Sheffield', slug: 'sheffield', region: 'South Yorkshire', country: 'England' },
  { name: 'Newcastle', slug: 'newcastle', region: 'Tyne and Wear', country: 'England' },
  // Medium cities
  { name: 'Nottingham', slug: 'nottingham', region: 'Nottinghamshire', country: 'England' },
  { name: 'Cardiff', slug: 'cardiff', region: 'South Glamorgan', country: 'Wales' },
  { name: 'Leicester', slug: 'leicester', region: 'Leicestershire', country: 'England' },
  { name: 'Brighton', slug: 'brighton', region: 'East Sussex', country: 'England' },
  { name: 'Coventry', slug: 'coventry', region: 'West Midlands', country: 'England' },
  { name: 'Belfast', slug: 'belfast', region: 'Belfast', country: 'Northern Ireland' },
  { name: 'Southampton', slug: 'southampton', region: 'Hampshire', country: 'England' },
  { name: 'Reading', slug: 'reading', region: 'Berkshire', country: 'England' },
  { name: 'Aberdeen', slug: 'aberdeen', region: 'Aberdeen', country: 'Scotland' },
  { name: 'Derby', slug: 'derby', region: 'Derbyshire', country: 'England' },
  // Tech / business hubs
  { name: 'Cambridge', slug: 'cambridge', region: 'Cambridgeshire', country: 'England' },
  { name: 'Oxford', slug: 'oxford', region: 'Oxfordshire', country: 'England' },
  { name: 'Milton Keynes', slug: 'milton-keynes', region: 'Buckinghamshire', country: 'England' },
  { name: 'Swindon', slug: 'swindon', region: 'Wiltshire', country: 'England' },
  { name: 'Bath', slug: 'bath', region: 'Somerset', country: 'England' },
  { name: 'York', slug: 'york', region: 'North Yorkshire', country: 'England' },
  { name: 'Exeter', slug: 'exeter', region: 'Devon', country: 'England' },
  { name: 'Norwich', slug: 'norwich', region: 'Norfolk', country: 'England' },
  { name: 'Plymouth', slug: 'plymouth', region: 'Devon', country: 'England' },
  { name: 'Swansea', slug: 'swansea', region: 'West Glamorgan', country: 'Wales' },
  // Additional coverage
  { name: 'Dundee', slug: 'dundee', region: 'Dundee', country: 'Scotland' },
  { name: 'Wolverhampton', slug: 'wolverhampton', region: 'West Midlands', country: 'England' },
  { name: 'Stoke-on-Trent', slug: 'stoke-on-trent', region: 'Staffordshire', country: 'England' },
  { name: 'Preston', slug: 'preston', region: 'Lancashire', country: 'England' },
  { name: 'Bournemouth', slug: 'bournemouth', region: 'Dorset', country: 'England' },
  { name: 'Ipswich', slug: 'ipswich', region: 'Suffolk', country: 'England' },
  { name: 'Peterborough', slug: 'peterborough', region: 'Cambridgeshire', country: 'England' },
  { name: 'Gloucester', slug: 'gloucester', region: 'Gloucestershire', country: 'England' },
  { name: 'Chester', slug: 'chester', region: 'Cheshire', country: 'England' },
  { name: 'Cheltenham', slug: 'cheltenham', region: 'Gloucestershire', country: 'England' },
  { name: 'Lincoln', slug: 'lincoln', region: 'Lincolnshire', country: 'England' },
  { name: 'Inverness', slug: 'inverness', region: 'Highland', country: 'Scotland' },
  { name: 'Luton', slug: 'luton', region: 'Bedfordshire', country: 'England' },
  { name: 'Colchester', slug: 'colchester', region: 'Essex', country: 'England' },
  { name: 'Blackpool', slug: 'blackpool', region: 'Lancashire', country: 'England' },
  { name: 'Warrington', slug: 'warrington', region: 'Cheshire', country: 'England' },
  { name: 'Northampton', slug: 'northampton', region: 'Northamptonshire', country: 'England' },
  { name: 'Doncaster', slug: 'doncaster', region: 'South Yorkshire', country: 'England' },
  { name: 'Huddersfield', slug: 'huddersfield', region: 'West Yorkshire', country: 'England' },
  { name: 'Wakefield', slug: 'wakefield', region: 'West Yorkshire', country: 'England' },
];

export function getCityBySlug(slug: string): UKCity | undefined {
  return UK_CITIES.find((c) => c.slug === slug);
}
