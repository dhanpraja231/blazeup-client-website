export interface Service {
    icon: string;
    title: string;
    description: string;
    delay: number;
  }
  
  export interface StatItem {
    number: string;
    label: string;
    delay: number;
  }
  
  export interface Testimonial {
    id: string;
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    avatar?: string;
    delay: number;
  }
  
  export interface FooterSection {
    title: string;
    links: { label: string; href: string }[];
  }
  
  export interface NavItem {
    name: string;
    href: string;
  }
  
  export interface CounterProps {
    target: string;
    delay: number;
  }
  
  export interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }
  
  export interface ServiceCardProps {
    service: Service;
  }
  
  export interface TestimonialCardProps {
    testimonial: Testimonial;
    isActive?: boolean;
  }