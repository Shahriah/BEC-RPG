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
  Laptop,
  UserCheck,
  FileText,
  Clipboard,
  Eye,
  Server,
  BarChart,
  FileArchive,
  Building,
  CreditCard as Payment,
  Terminal,
  ShieldAlert,
  User,
  Key,
  Wifi,
  UserPlus,
  CalendarClock,
  FileQuestion
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
        },
        {
          id: 'ceo-1-2',
          employee: "Michael Lee - Marketing Director",
          department: Departments.MARKETING,
          activityType: ActivityTypes.FILE_TRANSFER,
          icon: FileText,
          normalPattern: "Regular access to campaign materials and presentations",
          timeline: [
            {
              date: "Jan 23",
              time: "10:30",
              action: "File Access",
              details: "Marketing presentation review",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 24",
              time: "14:15",
              action: "File Access",
              details: "Brand guide access",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 25",
              time: "16:45",
              action: "File Access",
              details: "Campaign materials download",
              location: "Home Network (Approved)",
              isNormal: true
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
        },
        {
          id: 'ceo-2-2',
          employee: "David Rodriguez - Global Operations",
          department: Departments.OPERATIONS,
          activityType: ActivityTypes.EMAIL_ACCESS,
          icon: Mail,
          normalPattern: "Global communications across different time zones",
          timeline: [
            {
              date: "Feb 14",
              time: "05:20",
              action: "Email Communication",
              details: "Asia region operations update",
              location: "Home Network (Approved)",
              isNormal: true
            },
            {
              date: "Feb 15",
              time: "21:45",
              action: "Email Communication",
              details: "Europe region status call follow-up",
              location: "Home Network (Approved)",
              isNormal: true
            },
            {
              date: "Feb 16",
              time: "18:30",
              action: "Video Conference",
              details: "Global operations sync with approved partners",
              location: "Home Network (Approved)",
              isNormal: true
            }
          ]
        }
      ]
    },
    {
      id: 'board-meeting-leak',
      title: "Board Meeting Information Leak",
      description: "Investigate potential leakage of confidential board discussions",
      activities: [
        {
          id: 'ceo-4-2',
          employee: "Thomas Wright - Legal Counsel",
          department: Departments.LEGAL,
          activityType: ActivityTypes.FILE_ACCESS,
          icon: FileText,
          normalPattern: "Regular access to legal documents and board materials",
          timeline: [
            {
              date: "Apr 9",
              time: "10:15",
              action: "Document Access",
              details: "Legal review of board documents",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 10",
              time: "14:30",
              action: "Document Editing",
              details: "Legal annotation of governance documents",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 11",
              time: "16:40",
              action: "Document Access",
              details: "Final legal review of board materials",
              location: "Office VPN (Authorized)",
              isNormal: true
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
          id: 'fin-1-2',
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
    },
    {
      id: 'payment-processing-anomaly',
      title: "Payment Processing Anomaly",
      description: "Detect unusual payment authorization activities",
      activities: [
        {
          id: 'fin-2-1',
          employee: "Thomas Zhang - Accounts Payable Specialist",
          department: Departments.FINANCE,
          activityType: ActivityTypes.PAYMENT_PROCESSING,
          icon: Payment,
          normalPattern: "Regular vendor payments with proper authorization",
          timeline: [
            {
              date: "Mar 15",
              time: "10:30",
              action: "Payment Processing",
              details: "Standard vendor payment batch of 15 invoices",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 16",
              time: "11:45",
              action: "Payment Processing",
              details: "Authorized contract payments",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 17",
              time: "06:15",
              action: "Payment Authorization",
              details: "Single large payment to unknown vendor",
              location: "Remote Access",
              isNormal: false,
              alerts: ["Early morning activity", "Unrecognized vendor", "Bypassed approval process"]
            }
          ]
        },
        {
          id: 'fin-2-2',
          employee: "Alan Johnson - Senior Finance Manager",
          department: Departments.FINANCE,
          activityType: ActivityTypes.PAYMENT_PROCESSING,
          icon: Payment,
          normalPattern: "Regular approval of department expenses",
          timeline: [
            {
              date: "Mar 14",
              time: "09:45",
              action: "Expense Approval",
              details: "Travel expense approvals",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 15",
              time: "14:30",
              action: "Expense Approval",
              details: "Department budget allocations",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 16",
              time: "10:15",
              action: "Budget Review",
              details: "Quarterly spending analysis",
              location: "Conference Room",
              isNormal: true
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
          id: 'it-1-3',
          employee: "Samantha Wong - DevOps Engineer",
          department: Departments.IT,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Server,
          normalPattern: "Regular CI/CD pipeline management",
          timeline: [
            {
              date: "Jan 22",
              time: "09:30",
              action: "Deployment",
              details: "Scheduled code release",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 23",
              time: "14:15",
              action: "System Configuration",
              details: "Infrastructure update",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jan 24",
              time: "11:45",
              action: "Pipeline Monitoring",
              details: "Build verification",
              location: "Office",
              isNormal: true
            }
          ]
        }
      ]
    },
    {
      id: 'security-monitoring-normal',
      title: "Security Monitoring Activity",
      description: "Track security monitoring and incident response activities",
      activities: [
        {
          id: 'it-5-2',
          employee: "Brian Taylor - Security Operations",
          department: Departments.IT,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: ShieldAlert,
          normalPattern: "24/7 security operations center activities",
          timeline: [
            {
              date: "May 12",
              time: "08:15",
              action: "Alert Triage",
              details: "Morning security alert review",
              location: "SOC (Authorized)",
              isNormal: true
            },
            {
              date: "May 12",
              time: "14:30",
              action: "Threat Hunting",
              details: "Scheduled network scanning",
              location: "SOC (Authorized)",
              isNormal: true
            },
            {
              date: "May 12",
              time: "22:45",
              action: "Incident Response",
              details: "After-hours security monitoring",
              location: "SOC (Authorized)",
              isNormal: true
            }
          ]
        }
      ]
    },
    {
      id: 'database-administrator-activity',
      title: "Database Administrator Activity",
      description: "Monitor sensitive database operations and potential data extraction",
      activities: [
        {
          id: 'it-2-1',
          employee: "Sophia Garcia - Database Administrator",
          department: Departments.IT,
          activityType: ActivityTypes.DATABASE_ACCESS,
          icon: Server,
          normalPattern: "Standard database maintenance during scheduled windows",
          timeline: [
            {
              date: "Mar 8",
              time: "14:30",
              action: "Database Maintenance",
              details: "Scheduled index optimization",
              location: "Data Center",
              isNormal: true
            },
            {
              date: "Mar 9",
              time: "15:15",
              action: "Database Backup",
              details: "Regular backup procedure",
              location: "Data Center",
              isNormal: true
            },
            {
              date: "Mar 10",
              time: "02:40",
              action: "Database Query",
              details: "Mass data extraction of customer records",
              location: "Remote Connection",
              isNormal: false,
              alerts: ["After hours activity", "Unusual query volume", "PII data extraction"]
            }
          ]
        }
      ]
    }
  ],

  HR: [
    {
      id: 'employee-records-access',
      title: "Employee Records Access",
      description: "Monitor access patterns to sensitive employee data and records",
      activities: [
        {
          id: 'hr-1-1',
          employee: "Jennifer Martinez - HR Specialist",
          department: Departments.HR,
          activityType: ActivityTypes.DATABASE_ACCESS,
          icon: UserCheck,
          normalPattern: "Routine employee records access during work hours",
          timeline: [
            {
              date: "Mar 12",
              time: "10:30",
              action: "Records Access",
              details: "Routine review of onboarding documents",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 13",
              time: "14:15",
              action: "Records Access",
              details: "Benefits update for new employees",
              location: "Office",
              isNormal: true
            },
            {
              date: "Mar 14",
              time: "20:45",
              action: "Records Access",
              details: "Mass download of employee SSNs and salary data",
              location: "Remote Connection",
              isNormal: false,
              alerts: ["After hours access", "Unusual data volume", "Sensitive PII accessed"]
            }
          ]
        },
        {
          id: 'hr-1-2',
          employee: "David Thompson - HR Manager",
          department: Departments.HR,
          activityType: ActivityTypes.FILE_TRANSFER,
          icon: FileText,
          normalPattern: "Limited file transfers to authorized HR systems",
          timeline: [
            {
              date: "Mar 18",
              time: "11:20",
              action: "File Transfer",
              details: "Standard HR policy updates",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Mar 19",
              time: "13:45",
              action: "File Transfer",
              details: "Employee handbook revision",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Mar 20",
              time: "19:10",
              action: "File Transfer",
              details: "Employee compensation data to personal email",
              location: "Home Network",
              isNormal: false,
              alerts: ["Sensitive data exfiltration", "Unauthorized recipient", "Personal account use"]
            }
          ]
        }
      ]
    },
    {
      id: 'recruitment-normal-activity',
      title: "Recruitment Process Activities",
      description: "Monitor recruitment and applicant handling processes",
      activities: [
        {
          id: 'hr-2-3',
          employee: "Mark Wilson - Talent Acquisition",
          department: Departments.HR,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Users,
          normalPattern: "Standard recruitment activities during business hours",
          timeline: [
            {
              date: "Apr 18",
              time: "09:30",
              action: "ATS Access",
              details: "Candidate screening",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 19",
              time: "13:45",
              action: "Interview Scheduling",
              details: "Coordination with hiring managers",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 20",
              time: "15:20",
              action: "Applicant Review",
              details: "Resume evaluation for IT roles",
              location: "Office",
              isNormal: true
            }
          ]
        }
      ]
    }
  ]
};

export default InsiderScenarios;