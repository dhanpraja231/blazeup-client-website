import { Service, StatItem, Testimonial, FooterSection, NavItem } from '@/lib/types';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/home' },
  { name: 'Build', href: '/build' },
  { name: 'Freelance', href: '/freelance' },
  { name: 'Vision', href: '/vision' },
  { name: 'Success', href: '/success' }
//   { name: 'Contact', href: '#contact' }
];

export const HERO_WORDS: string[] = ["Team", "Startup", "Idea", "Product", "Vision","Career","Profile"];

export const SERVICES: Service[] = [
  {
    icon: '🎨',
    title: 'Design & Creative',
    description: 'Brand identity, UI/UX design, graphic design, and creative campaigns that captivate your audience and drive results.',
    delay: 0
  },
  {
    icon: '⚡',
    title: 'Development & Tech',
    description: 'Full-stack development, mobile apps, AI solutions, and cutting-edge technology implementations.',
    delay: 0.1
  },
  {
    icon: '📈',
    title: 'Marketing & Growth',
    description: 'Digital marketing, SEO, content strategy, and growth hacking to scale your business exponentially.',
    delay: 0.2
  },
  {
    icon: '💼',
    title: 'Business Strategy',
    description: 'Consulting, market research, business planning, and strategic guidance from industry experts.',
    delay: 0.3
  },
  {
    icon: '✍️',
    title: 'Content & Writing',
    description: 'Compelling copy, technical writing, content marketing, and storytelling that converts.',
    delay: 0.4
  },
  {
    icon: '🤖',
    title: 'AI & Automation',
    description: 'Machine learning, AI integration, process automation, and intelligent solutions for modern businesses.',
    delay: 0.5
  }
];

export const STATS: StatItem[] = [
  { number: '500K+', label: 'Projects Completed', delay: 0 },
  { number: '98%', label: 'Client Satisfaction', delay: 0.2 },
  { number: '50K+', label: 'Expert Freelancers', delay: 0.4 },
  { number: '24/7', label: 'Support Available', delay: 0.6 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Chen',
    position: 'Founder & CEO',
    company: 'TechVenture',
    content: 'BlazeUp transformed our startup vision into reality. Their team delivered exceptional results beyond our expectations, helping us secure Series A funding.',
    rating: 5,
    delay: 0
  },
  {
    id: 'testimonial-2',
    name: 'Marcus Rodriguez',
    position: 'Product Manager',
    company: 'InnovateCorp',
    content: 'The design and development quality was outstanding. BlazeUp understood our complex requirements and delivered a solution that exceeded all benchmarks.',
    rating: 5,
    delay: 0.2
  },
  {
    id: 'testimonial-3',
    name: 'Emily Watson',
    position: 'Marketing Director',
    company: 'GrowthLabs',
    content: 'Working with BlazeUp was a game-changer for our brand. Their creative approach and strategic thinking helped us achieve 300% growth in just 6 months.',
    rating: 5,
    delay: 0.4
  },
  {
    id: 'testimonial-4',
    name: 'David Kim',
    position: 'CTO',
    company: 'FutureTech',
    content: 'BlazeUp\'s technical expertise is unmatched. They implemented AI solutions that revolutionized our operations and gave us a competitive edge.',
    rating: 5,
    delay: 0.6
  },
  {
    id: 'testimonial-5',
    name: 'Lisa Park',
    position: 'Startup Founder',
    company: 'NextGen Solutions',
    content: 'From concept to launch, BlazeUp was our trusted partner. Their dedication to quality and innovation helped us build something truly extraordinary.',
    rating: 5,
    delay: 0.8
  }
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Design & Creative', href: '#services' },
      { label: 'Development', href: '#services' },
      { label: 'Marketing', href: '#services' },
      { label: 'Business Strategy', href: '#services' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Privacy Policy', href: '#privacy' },
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Trust & Safety', href: '#trust' },
      { label: 'API Documentation', href: '#api' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#blog' },
      { label: 'Success Stories', href: '#testimonials' },
      { label: 'Case Studies', href: '#cases' },
      { label: 'Community', href: '#community' },
    ]
  }
];