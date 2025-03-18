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
    },
    {
      id: 'acquisition-data-breach',
      title: "Acquisition Data Breach",
      description: "Detect potential data leakage related to an upcoming acquisition",
      activities: [
        {
          id: 'ceo-3-1',
          employee: "Mark Johnson - Head of M&A",
          department: Departments.STRATEGY,
          activityType: ActivityTypes.FILE_ACCESS,
          icon: FileArchive,
          normalPattern: "Regular access to M&A documents on secure server",
          timeline: [
            {
              date: "Mar 5",
              time: "09:30",
              action: "Document Access",
              details: "Due diligence report review",
              location: "Secure Room",
              isNormal: true
            },
            {
              date: "Mar 6",
              time: "14:15",
              action: "Document Access",
              details: "Term sheet analysis",
              location: "Secure Room",
              isNormal: true
            },
            {
              date: "Mar 7",
              time: "20:45",
              action: "Document Access",
              details: "Copied acquisition plans to USB drive",
              location: "Executive Suite",
              isNormal: false,
              alerts: ["After hours activity", "Physical media transfer", "Highly confidential material"]
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
          id: 'ceo-4-1',
          employee: "Patricia Miller - Board Secretary",
          department: Departments.EXECUTIVE,
          activityType: ActivityTypes.EMAIL_ACCESS,
          icon: FileText,
          normalPattern: "Normal distribution of board materials to approved recipients",
          timeline: [
            {
              date: "Apr 10",
              time: "11:20",
              action: "Email Distribution",
              details: "Board agenda sent to directors",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 11",
              time: "13:40",
              action: "Document Access",
              details: "Minutes preparation",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 12",
              time: "17:55",
              action: "Email Communication",
              details: "Board materials forwarded to personal email",
              location: "Office",
              isNormal: false,
              alerts: ["Unauthorized recipient", "Confidential content", "Personal email usage"]
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
        }
      ]
    },
    {
      id: 'financial-report-manipulation',
      title: "Financial Report Manipulation",
      description: "Identify potential manipulation of financial reporting data",
      activities: [
        {
          id: 'fin-3-1',
          employee: "Sandra Lee - Senior Financial Analyst",
          department: Departments.FINANCE,
          activityType: ActivityTypes.DATABASE_ACCESS,
          icon: BarChart,
          normalPattern: "Financial database access during business hours",
          timeline: [
            {
              date: "Apr 20",
              time: "14:20",
              action: "Database Access",
              details: "Quarter-end report preparation",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 21",
              time: "15:10",
              action: "Database Access",
              details: "Expense categorization review",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 22",
              time: "23:05",
              action: "Database Modification",
              details: "Multiple revenue entries modified",
              location: "VPN Connection",
              isNormal: false,
              alerts: ["After hours modification", "Revenue data tampering", "Unusual pattern of changes"]
            }
          ]
        }
      ]
    },
    {
      id: 'treasury-management-breach',
      title: "Treasury Management Breach",
      description: "Monitor access to treasury management systems and fund transfers",
      activities: [
        {
          id: 'fin-4-1',
          employee: "Kevin Patel - Treasury Analyst",
          department: Departments.FINANCE,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Building,
          normalPattern: "Normal banking system access during business hours",
          timeline: [
            {
              date: "May 8",
              time: "09:40",
              action: "Banking System Access",
              details: "Daily liquidity check",
              location: "Office",
              isNormal: true
            },
            {
              date: "May 9",
              time: "13:30",
              action: "Banking System Access",
              details: "FX transaction review",
              location: "Office",
              isNormal: true
            },
            {
              date: "May 10",
              time: "19:15",
              action: "Wire Transfer Attempt",
              details: "Attempted offshore transfer to unknown account",
              location: "Unknown IP",
              isNormal: false,
              alerts: ["Unusual recipient", "Non-standard transfer time", "Policy violation"]
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
          id: 'it-1-2',
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
    },
    {
      id: 'privileged-access-misuse',
      title: "Privileged Access Misuse",
      description: "Track administrative privilege usage on critical systems",
      activities: [
        {
          id: 'it-3-1',
          employee: "David Sharma - Systems Engineer",
          department: Departments.IT,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Terminal,
          normalPattern: "Limited use of elevated privileges for specific tasks",
          timeline: [
            {
              date: "Apr 15",
              time: "10:20",
              action: "Admin Access",
              details: "Server cluster maintenance",
              location: "Server Room",
              isNormal: true
            },
            {
              date: "Apr 16",
              time: "11:30",
              action: "Admin Access",
              details: "OS patching on production servers",
              location: "Server Room",
              isNormal: true
            },
            {
              date: "Apr 17",
              time: "23:15",
              action: "Admin Access",
              details: "Creation of unauthorized admin account",
              location: "VPN Connection",
              isNormal: false,
              alerts: ["Backdoor creation", "After-hours privileged access", "No change request"]
            }
          ]
        }
      ]
    },
    {
      id: 'security-tools-tampering',
      title: "Security Tools Tampering",
      description: "Identify potential disabling or bypassing of security controls",
      activities: [
        {
          id: 'it-4-1',
          employee: "Thomas Lee - Security Engineer",
          department: Departments.IT,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: ShieldAlert,
          normalPattern: "Regular updates and monitoring of security systems",
          timeline: [
            {
              date: "May 5",
              time: "09:30",
              action: "Security Console Access",
              details: "Alert review and analysis",
              location: "Security Operations Center",
              isNormal: true
            },
            {
              date: "May 6",
              time: "14:15",
              action: "Security Console Access",
              details: "Rule modification for false positive reduction",
              location: "Security Operations Center",
              isNormal: true
            },
            {
              date: "May 7",
              time: "00:20",
              action: "Security Console Access",
              details: "Multiple monitoring services disabled",
              location: "Unknown IP",
              isNormal: false,
              alerts: ["Critical security disabling", "Midnight activity", "Non-standard access point"]
            }
          ]
        }
      ]
    },
    {
      id: 'vpn-unusual-access',
      title: "VPN Unusual Access Pattern",
      description: "Detect suspicious remote access behavior",
      activities: [
        {
          id: 'it-5-1',
          employee: "Olivia Wilson - DevOps Engineer",
          department: Departments.IT,
          activityType: ActivityTypes.NETWORK_ACCESS,
          icon: Wifi,
          normalPattern: "Occasional VPN access during on-call hours",
          timeline: [
            {
              date: "Jun 10",
              time: "19:30",
              action: "VPN Access",
              details: "Emergency production issue",
              location: "Home Network",
              isNormal: true
            },
            {
              date: "Jun 11",
              time: "20:15",
              action: "VPN Access",
              details: "Scheduled deployment support",
              location: "Home Network",
              isNormal: true
            },
            {
              date: "Jun 12",
              time: "03:45",
              action: "VPN Access",
              details: "Multiple simultaneous connections from different countries",
              location: "Multiple IPs",
              isNormal: false,
              alerts: ["Geographic impossibility", "Credential sharing", "Potential account compromise"]
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
      id: 'applicant-data-handling',
      title: "Applicant Data Handling",
      description: "Investigate potential misuse of job applicant information",
      activities: [
        {
          id: 'hr-2-1',
          employee: "Rachel Wilson - Recruiting Coordinator",
          department: Departments.HR,
          activityType: ActivityTypes.EMAIL_ACCESS,
          icon: Clipboard,
          normalPattern: "Regular access to applicant tracking system during business hours",
          timeline: [
            {
              date: "Apr 5",
              time: "09:15",
              action: "ATS Access",
              details: "Review of engineering candidates",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 6",
              time: "11:30",
              action: "ATS Access",
              details: "Interview scheduling for marketing roles",
              location: "Office",
              isNormal: true
            },
            {
              date: "Apr 7",
              time: "22:40",
              action: "ATS Export",
              details: "Mass export of applicant contact details",
              location: "Unknown Location",
              isNormal: false,
              alerts: ["After-hours activity", "Bulk data export", "Potential identity theft risk"]
            }
          ]
        },
        {
          id: 'hr-2-2',
          employee: "Thomas Wright - HR Director",
          department: Departments.HR,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: Eye,
          normalPattern: "Occasional performance review system access",
          timeline: [
            {
              date: "Apr 12",
              time: "14:20",
              action: "System Access",
              details: "Quarterly performance metrics review",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Apr 13",
              time: "10:45",
              action: "System Access",
              details: "Management training program setup",
              location: "Office Network",
              isNormal: true
            },
            {
              date: "Apr 14",
              time: "01:15",
              action: "System Access",
              details: "Unusual access to terminated employee records",
              location: "External IP",
              isNormal: false,
              alerts: ["Midnight system access", "Terminated employee focus", "Unauthorized location"]
            }
          ]
        }
      ]
    },
    {
      id: 'employment-verification-fraud',
      title: "Employment Verification Fraud",
      description: "Detect unauthorized employment verification responses",
      activities: [
        {
          id: 'hr-3-1',
          employee: "Michael Brown - HR Assistant",
          department: Departments.HR,
          activityType: ActivityTypes.EMAIL_ACCESS,
          icon: User,
          normalPattern: "Standard employment verification through official channels",
          timeline: [
            {
              date: "May 14",
              time: "10:20",
              action: "Email Response",
              details: "Authorized employment verification to bank",
              location: "Office",
              isNormal: true
            },
            {
              date: "May 15",
              time: "13:45",
              action: "Email Response",
              details: "Standard verification for mortgage company",
              location: "Office",
              isNormal: true
            },
            {
              date: "May 16",
              time: "18:30",
              action: "Email Response",
              details: "Unauthorized verification with inflated salary information",
              location: "Coffee Shop Wifi",
              isNormal: false,
              alerts: ["Non-standard location", "Falsified information", "Unauthorized response"]
            }
          ]
        }
      ]
    },
    {
      id: 'payroll-system-irregularity',
      title: "Payroll System Irregularity",
      description: "Identify potentially fraudulent payroll modifications",
      activities: [
        {
          id: 'hr-4-1',
          employee: "Lisa Johnson - Payroll Specialist",
          department: Departments.HR,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: CreditCard,
          normalPattern: "Regular payroll processing during business hours",
          timeline: [
            {
              date: "Jun 5",
              time: "09:30",
              action: "Payroll System Access",
              details: "Bi-weekly payroll preparation",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jun 6",
              time: "14:15",
              action: "Payroll System Access",
              details: "Tax withholding adjustments",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jun 7",
              time: "22:10",
              action: "Payroll System Access",
              details: "New bank account added for existing employee",
              location: "Unknown IP",
              isNormal: false,
              alerts: ["After-hours activity", "Direct deposit change", "Unusual access location"]
            }
          ]
        }
      ]
    },
    {
      id: 'unauthorized-termination-access',
      title: "Unauthorized Termination Process",
      description: "Monitor for abnormal access to termination procedures and systems",
      activities: [
        {
          id: 'hr-5-1',
          employee: "Andrew Chen - Employee Relations Specialist",
          department: Departments.HR,
          activityType: ActivityTypes.SYSTEM_ACCESS,
          icon: UserPlus,
          normalPattern: "Limited access to termination workflow with proper authorization",
          timeline: [
            {
              date: "Jul 10",
              time: "11:45",
              action: "HR System Access",
              details: "Scheduled employee offboarding",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jul 11",
              time: "13:30",
              action: "HR System Access",
              details: "Exit interview documentation",
              location: "Office",
              isNormal: true
            },
            {
              date: "Jul 12",
              time: "07:15",
              action: "HR System Access",
              details: "Unauthorized termination initiation for executive",
              location: "Mobile Device",
              isNormal: false,
              alerts: ["No termination approval", "Executive target", "Outside normal process"]
            }
          ]
        }
      ]
    }
  ]
};

export default InsiderScenarios;