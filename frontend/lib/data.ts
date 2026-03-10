export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: Date;
  applications: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'jobseeker' | 'recruiter';
  avatar: string;
  bio?: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'reviewing' | 'interviewed' | 'rejected' | 'accepted';
  appliedDate: Date;
  resumeUrl?: string;
  coverLetter?: string;
}


export interface Application2 {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'interviewed';
  appliedDate: Date;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedDate: string;
  status: 'New' | 'Reviewing' | 'Interview' | 'Offer' | 'Rejected';
  rating: number;
}


export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: { min: 150000, max: 200000, currency: 'USD' },
    type: 'Full-time',
    level: 'Senior',
    description: 'We are looking for a senior frontend engineer to lead our UI development initiatives.',
    requirements: [
      'React expertise',
      '5+ years experience',
      'TypeScript proficiency',
      'CSS expertise'
    ],
    benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options'],
    postedDate: new Date('2024-02-20'),
    applications: 42
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'InnovateLabs',
    location: 'New York, NY',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    type: 'Full-time',
    level: 'Mid',
    description: 'Join our team to build scalable web applications using modern technologies.',
    requirements: [
      'Node.js experience',
      'React knowledge',
      'Database design',
      '3+ years experience'
    ],
    benefits: ['Health Insurance', 'Flexible Hours', 'Professional Development'],
    postedDate: new Date('2024-02-18'),
    applications: 28
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Austin, TX',
    salary: { min: 140000, max: 180000, currency: 'USD' },
    type: 'Full-time',
    level: 'Senior',
    description: 'Manage and optimize our cloud infrastructure and deployment pipelines.',
    requirements: [
      'Kubernetes experience',
      'AWS/GCP knowledge',
      'CI/CD expertise',
      '4+ years experience'
    ],
    benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
    postedDate: new Date('2024-02-17'),
    applications: 31
  },
  {
    id: '4',
    title: 'Product Designer',
    company: 'CreativeStudio',
    location: 'Los Angeles, CA',
    salary: { min: 100000, max: 140000, currency: 'USD' },
    type: 'Full-time',
    level: 'Mid',
    description: 'Design intuitive user experiences for our digital products.',
    requirements: [
      'Figma expertise',
      'UX/UI design experience',
      'Prototyping skills',
      '3+ years experience'
    ],
    benefits: ['Creative Freedom', 'Flexible Hours', 'Equipment Budget'],
    postedDate: new Date('2024-02-16'),
    applications: 19
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'DataFlow',
    location: 'Remote',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    type: 'Full-time',
    level: 'Mid',
    description: 'Build robust APIs and microservices powering our platform.',
    requirements: [
      'Java/Python proficiency',
      'Microservices experience',
      'SQL knowledge',
      '2+ years experience'
    ],
    benefits: ['Remote Work', 'Health Insurance', 'Stock Options'],
    postedDate: new Date('2024-02-15'),
    applications: 35
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AnalyticsAI',
    location: 'Boston, MA',
    salary: { min: 130000, max: 180000, currency: 'USD' },
    type: 'Full-time',
    level: 'Senior',
    description: 'Apply machine learning to solve real-world problems.',
    requirements: [
      'Python expertise',
      'ML/AI knowledge',
      'Statistics background',
      '3+ years experience'
    ],
    benefits: ['Research Opportunities', 'Conference Budget', 'Health Insurance'],
    postedDate: new Date('2024-02-14'),
    applications: 26
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: 'jobseeker',
    avatar: 'JD',
    bio: 'Full-stack developer passionate about building great products'
  },
  {
    id: '2',
    email: 'jane.smith@techcorp.com',
    name: 'Jane Smith',
    role: 'recruiter',
    avatar: 'JS',
    bio: 'Hiring tech talent at TechCorp'
  },
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    userId: '1',
    status: 'reviewing',
    appliedDate: new Date('2024-02-21'),
    coverLetter: 'I am very interested in this position...'
  },
  {
    id: '2',
    jobId: '2',
    userId: '1',
    status: 'applied',
    appliedDate: new Date('2024-02-19'),
  },
];


export const userApplications: Application2[] = [
  {
    id: 'app1',
    jobId: '1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'TechCorp',
    status: 'applied',
    appliedDate: new Date('2024-02-15')
  },
  {
    id: 'app2',
    jobId: '2',
    jobTitle: 'Product Designer',
    company: 'CreativeStudio',
    status: 'rejected',
    appliedDate: new Date ('2024-02-20')
  },
  {
    id: 'app3',
    jobId: '5',
    jobTitle: 'Full Stack Developer',
    company: 'WebInnovate',
    status: 'applied',
    appliedDate: new Date('2024-03-01')
  },
  {
    id: 'app4',
    jobId: '3',
    jobTitle: 'Backend Engineer',
    company: 'DataSystems Inc',
    status: 'rejected',
    appliedDate: new Date('2024-02-10')
  }
];

export const recentApplicants: Applicant[] = [
  {
    id: 'a1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    position: 'Senior Frontend Engineer',
    appliedDate: '2024-03-08',
    status: 'Interview',
    rating: 5
  },
  {
    id: 'a2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    position: 'Backend Engineer',
    appliedDate: '2024-03-07',
    status: 'Reviewing',
    rating: 4
  },
  {
    id: 'a3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    position: 'Full Stack Developer',
    appliedDate: '2024-03-06',
    status: 'New',
    rating: 3
  },
  {
    id: 'a4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    position: 'DevOps Engineer',
    appliedDate: '2024-03-05',
    status: 'Offer',
    rating: 5
  },
  {
    id: 'a5',
    name: 'Jessica Thompson',
    email: 'jessica.thompson@email.com',
    position: 'Product Designer',
    appliedDate: '2024-03-04',
    status: 'Interview',
    rating: 4
  }
];
