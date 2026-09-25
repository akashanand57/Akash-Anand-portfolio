// Mirrors the seed data in supabase/schema.sql so the site renders a complete,
// correct page even before Supabase is connected (and during local dev).
import { DEFAULT_THEME } from './theme'

export const FALLBACK = {
  profile: {
    name: 'Akash Anand',
    role: 'AI-Augmented Full Stack Software Developer',
    tagline:
      'I build real product features at the seam where full-stack engineering meets agentic AI.',
    summary:
      'B.Tech Computer Science graduate with hands-on full stack development experience and professional training in Java Full Stack Development. Experienced integrating modern AI tools and agentic workflows (Claude, Codex, n8n, ElevenLabs Conversational Agents, Nemotron, MCP) into real product features.',
    email: 'akashanand330@gmail.com',
    phone: '+91-7970433198',
    location: 'India',
    resume_url: null,
  },
  social: [
    { id: 's1', label: 'GitHub', url: '', handle: '' },
    { id: 's2', label: 'LinkedIn', url: '', handle: '' },
    { id: 's3', label: 'Email', url: 'mailto:akashanand330@gmail.com', handle: 'akashanand330@gmail.com' },
  ],
  skills: [
    ...['Java', 'JavaScript', 'TypeScript'].map((name) => ({ category: 'Languages', name })),
    ...['React.js', 'Angular', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'].map((name) => ({ category: 'Frontend', name })),
    ...['Node.js', 'Express.js', 'Spring Boot'].map((name) => ({ category: 'Backend', name })),
    ...['MySQL', 'MongoDB', 'PostgreSQL'].map((name) => ({ category: 'Databases', name })),
    ...['AWS', 'DigitalOcean', 'Aiven', 'Vercel'].map((name) => ({ category: 'Cloud & Deployment', name })),
    ...['Claude (Anthropic)', 'OpenAI Codex', 'n8n', 'ElevenLabs Conversational AI', 'NVIDIA Nemotron', 'Model Context Protocol (MCP)'].map((name) => ({ category: 'AI Tools & Agentic Platforms', name })),
    ...['Git', 'GitHub', 'Postman', 'Swagger', 'REST APIs', 'Agile', 'Figma', 'Canva', 'React Native', 'Elementor', 'WordPress'].map((name) => ({ category: 'Other Tools', name })),
  ].map((s, i) => ({ id: `sk${i}`, sort_order: i, ...s })),
  experiences: [
    {
      id: 'e1',
      role: 'Tech Executive',
      company: 'Exchange4Media',
      period: 'Sep 2025 - Present',
      summary: 'Shipping web platform features and automating editorial + growth workflows with agentic AI.',
      highlights: [
        'Built web platform features and reusable frontend components',
        'Delivered API integrations across editorial and marketing systems',
        'Improved SEO and ran newsletter / email campaigns',
        'Automated content and growth workflows using Claude / Codex + n8n',
      ],
      tags: ['Claude', 'Codex', 'n8n', 'SEO', 'Frontend', 'APIs'],
    },
    {
      id: 'e2',
      role: 'Full Stack Developer',
      company: 'Colibyt Technologies',
      period: 'Sep 2024 - Aug 2025',
      summary: 'Built production React + Node applications and REST APIs in an Agile team.',
      highlights: [
        'Developed React.js / Node.js / MySQL applications end to end',
        'Designed and consumed REST APIs',
        'Built reusable UI component libraries',
        'Worked in Agile / Git-based collaborative workflows',
      ],
      tags: ['React.js', 'Node.js', 'MySQL', 'REST APIs', 'Agile', 'Git'],
    },
    {
      id: 'e3',
      role: 'Java Full Stack Development Trainee',
      company: 'QSpiders',
      period: 'Jan 2024 - Aug 2024',
      summary: 'Intensive professional training in Java full stack engineering.',
      highlights: ['Core Java and Object-Oriented Programming', 'JDBC and SQL', 'React fundamentals', 'Spring Boot backend development'],
      tags: ['Core Java', 'JDBC', 'SQL', 'React', 'Spring Boot'],
    },
  ],
  projects: [
    { id: 'p1', title: 'AITrackStocks', description: 'AI-powered stock trading platform with intelligent trading bots and real-time market analysis.', tech: ['AI Trading Bots', 'Real-time Data', 'React', 'Node.js'], live_url: 'https://aitrackstocks.com', featured: true },
    { id: 'p2', title: 'Globlys', description: 'AI-powered visa application platform covering 190+ destinations, with an ElevenLabs-based AI chat + voice advisor.', tech: ['ElevenLabs', 'Conversational AI', 'Voice', 'React', 'Node.js'], live_url: 'https://globlys.com', featured: true },
    { id: 'p3', title: 'Property On Click', description: 'AI-driven real estate discovery platform with AI market-intelligence briefs, price heatmaps, and a chat + voice AI advisor.', tech: ['AI Briefs', 'Heatmaps', 'Voice AI', 'React', 'Node.js'], live_url: 'https://dev.propertyonclick.com', featured: true },
    { id: 'p4', title: 'Bywinn', description: 'E-commerce platform built on a React / Node / Express / MySQL stack.', tech: ['React', 'Node.js', 'Express.js', 'MySQL', 'E-commerce'], live_url: '', featured: false },
    { id: 'p5', title: 'Job Aggregator Platform', description: 'Aggregates job listings from multiple external APIs into a single searchable feed.', tech: ['React', 'External APIs', 'Aggregation'], live_url: 'https://job-aggregator-omega.vercel.app', featured: false },
    { id: 'p6', title: 'Crypto Intel Dashboard', description: 'Real-time cryptocurrency market data dashboard with live price intelligence.', tech: ['React', 'Real-time Data', 'Dashboard', 'Crypto APIs'], live_url: 'https://crypto-intel-nu.vercel.app', featured: false },
  ],
  certifications: [
    { id: 'c1', title: 'JavaScript, Java & OOP', issuer: 'Geekster', year: '2024' },
    { id: 'c2', title: 'Advanced Data Structures & Algorithms', issuer: 'Geekster', year: '2024' },
  ],
  education: [
    { id: 'ed1', degree: 'B.Tech, Computer Science Engineering', institution: 'IK Gujral Punjab Technical University', location: 'Jalandhar, Punjab', period: '2020 - 2024', score: '72.90%' },
  ],
  theme: DEFAULT_THEME,
}
