// data/roleBasedInsiderScenarios.js
import { ActivityTypes, Departments } from '../types/insiderThreatTypes';
import { 
  Database, 
  Mail, 
  HardDrive, 
  Users, 
  FileSpreadsheet, 
  Network,
  CloudDownload,
  CreditCard,
  Lock,
  Laptop
} from 'lucide-react';

export const InsiderScenarios = {
  CEO: [
    {
      id: 'executive-data-access',
      title: "Executive Data Access",
      description: "Monitor executive team's sensitive data access patterns",
      activities: [
        {
          id: 'ceo-1-1',
          employee: "James Wilson - CFO",
          department: Departments.FINANCE,
          activityType: ActivityTypes.FILE_TRANSFER,
          icon: FileSpreadsheet,
          normalPattern: "Regular small file transfers during business hours",
          timeline: [
            {
              date: "Jan 24",
              time: "14:30",
              action: "File Transfer",
              details: "150MB financial report transfer",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 25",
              time: "15:15",
              action: "File Transfer",
              details: "120MB quarterly analysis",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 26",
              time: "23:45",
              action: "File Transfer",
              details: "2.3GB sensitive data transfer",
              location: "Remote",
              isNormal: false,
              alerts: ["After hours activity", "Unusual data volume", "Unexpected location"]
            }
          ]
        }
      ]
    },
    {
      id: 'confidential-communication',
      title: "Confidential Email Communication",
      description: "Investigate suspicious email patterns and potential information leakage",
      activities: [
        {
          id: 'ceo-2-1',
          employee: "Sarah Chen - Strategy Director",
          department: Departments.STRATEGY,
          activityType: ActivityTypes.EMAIL_ACCESS,
          icon: Mail,
          normalPattern: "Standard business email communication during work hours",
          timeline: [
            {
              date: "Feb 15",
              time: "10:20",
              action: "Email Communication",
              details: "Internal strategy meeting follow-up",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Feb 16",
              time: "11:45",
              action: "Email Communication",
              details: "Routine department update",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Feb 17",
              time: "22:30",
              action: "External Email",
              details: "Confidential document shared with unknown recipient",
              location: "Personal Network",
              isNormal: false,
              alerts: ["After-hours communication", "External email to unknown domain", "Potential data exfiltration"]
            }
          ]
        }
      ]
    }
  ],

  FINANCE: [
    {
      id: 'financial-system-access',
      title: "Financial System Access",
      description: "Monitor access to critical financial systems and databases",
      activities: [
        {
          id: 'fin-1-1',
          employee: "Robert Wilson - Senior Accountant",
          department: Departments.FINANCE,
          activityType: ActivityTypes.DATABASE_ACCESS,
          icon: Database,
          normalPattern: "System access during business hours from office",
          timeline: [
            {
              date: "Jan 24",
              time: "09:30",
              action: "Database Access",
              details: "Regular records review",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 25",
              time: "10:15",
              action: "Database Access",
              details: "Account reconciliation",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 26",
              time: "22:15",
              action: "Database Access",
              details: "Multiple failed login attempts",
              location: "Unknown IP",
              isNormal: false,
              alerts: ["After hours access", "Failed login attempts", "Unknown location"]
            }
          ]
        },
        {
          id: 'fin-2-1',
          employee: "Emily Rodriguez - Financial Analyst",
          department: Departments.FINANCE,
          activityType: ActivityTypes.FILE_TRANSFER,
          icon: CreditCard,
          normalPattern: "Occasional financial spreadsheet transfers",
          timeline: [
            {
              date: "Feb 10",
              time: "14:45",
              action: "File Transfer",
              details: "Monthly budget analysis",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Feb 11",
              time: "15:30",
              action: "File Transfer",
              details: "Vendor payment records",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Feb 12",
              time: "01:20",
              action: "File Transfer",
              details: "Unexplained financial spreadsheet to external email",
              location: "Personal Network",
              isNormal: false,
              alerts: ["Midnight transfer", "External recipient", "Potential financial fraud"]
            }
          ]
        }
      ]
    }
  ],

  IT_SECURITY: [
    {
      id: 'system-configuration-changes',
      title: "System Configuration Changes",
      description: "Monitor security-related system modifications and access",
      activities: [
        {
          id: 'it-1-1',
          employee: "Alex Kumar - System Administrator",
          department: Departments.IT,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Laptop,
          normalPattern: "Scheduled maintenance with approved tickets",
          timeline: [
            {
              date: "Jan 24",
              time: "14:00",
              action: "System Update",
              details: "Scheduled maintenance",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 25",
              time: "15:00",
              action: "Security Patch",
              details: "Approved update",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 26",
              time: "16:45",
              action: "Config Change",
              details: "Multiple security changes",
              location: "Office",
              isNormal: false,
              alerts: ["No change ticket", "Multiple rapid changes", "No approval"]
            }
          ]
        },
        {
          id: 'it-2-1',
          employee: "Michael Chen - Network Security Specialist",
          department: Departments.IT,
          activityType: ActivityTypes.NETWORK_ACCESS,
          icon: Network,
          normalPattern: "Regular network monitoring and security checks",
          timeline: [
            {
              date: "Feb 15",
              time: "10:30",
              action: "Network Scan",
              details: "Routine network security assessment",
              location: "Internal Network",
              isNormal: true
            },
            {
              date: "Feb 16",
              time: "11:45",
              action: "Firewall Configuration",
              details: "Standard security rule update",
              location: "Internal Network",
              isNormal: true
            },
            {
              date: "Feb 17",
              time: "23:10",
              action: "Unauthorized Network Access",
              details: "Attempted access to restricted network segments",
              location: "Remote Connection",
              isNormal: false,
              alerts: ["After-hours access", "Unauthorized network probe", "Potential intrusion attempt"]
            }
          ]
        }
      ]
    }
  ]
};

export default InsiderScenarios;