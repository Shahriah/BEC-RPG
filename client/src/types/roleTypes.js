
import { Shield, Users, BadgeDollarSign, UserCog } from 'lucide-react';

export const Roles = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer',
    description: 'Lead company security strategy',
    icon: Shield,
    responsibilities: [
      'Approve security policies',
      'Handle executive-level threats',
      'Oversee security strategy',
      'Make critical decisions'
    ]
  },
  {
    id: 'finance',
    title: 'Finance Department',
    description: 'Protect financial assets',
    icon: BadgeDollarSign,
    responsibilities: [
      'Verify payment requests',
      'Monitor transactions',
      'Protect financial data',
      'Maintain payment protocols'
    ]
  },
  {
    id: 'it_security',
    title: 'IT Security',
    description: 'Monitor security measures',
    icon: UserCog,
    responsibilities: [
      'Monitor system security',
      'Investigate threats',
      'Implement security measures',
      'Handle technical incidents'
    ]
  },
  {
    id: 'hr',
    title: 'HR Manager',
    description: 'Protect employee data',
    icon: Users,
    responsibilities: [
      'Protect personnel data',
      'Manage security training',
      'Verify staff communications',
      'Handle employee security'
    ]
  }
];