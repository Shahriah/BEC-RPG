// data/insiderThreatScenarios.js
import { ActivityTypes, Departments, AccessLevels, BehaviorFlags } from '../types/insiderThreatTypes';
import { Database, Mail, HardDrive, Users, Share } from 'lucide-react';

export const scenarios = [
  {
    id: 'unusual-access',
    title: "Unusual Access Patterns",
    description: "Monitor for suspicious access to sensitive data",
    activities: [
      {
        id: 1,
        employee: "Sarah Chen",
        department: Departments.SALES,
        accessLevel: AccessLevels.BASIC,
        activityType: ActivityTypes.DATABASE_ACCESS,
        details: "Accessed financial records database",
        timestamp: "23:45",
        icon: Database,
        isSuspicious: true,
        flags: [BehaviorFlags.AFTER_HOURS, BehaviorFlags.UNAUTHORIZED_ACCESS],
        riskScore: 85,
        evidence: {
          normalHours: "9:00 - 17:00",
          previousAccess: "No prior financial database access",
          accessLocation: "Remote IP address",
          additionalContext: "No active projects requiring financial data"
        },
        tips: [
          "Check if access time matches normal working hours",
          "Verify if role requires financial data access",
          "Look for patterns of after-hours activity"
        ]
      },
      {
        id: 2,
        employee: "John Miller",
        department: Departments.IT,
        accessLevel: AccessLevels.ADMIN,
        activityType: ActivityTypes.SYSTEM_ACCESS,
        details: "System maintenance and updates",
        timestamp: "14:30",
        icon: HardDrive,
        isSuspicious: false,
        riskScore: 20,
        evidence: {
          normalHours: "8:00 - 18:00",
          previousAccess: "Regular system maintenance schedule",
          accessLocation: "Office network",
          additionalContext: "Scheduled maintenance window"
        }
      }
    ],
    learningPoints: [
      "Monitor access times and patterns",
      "Check role-based access violations",
      "Review access locations and contexts"
    ]
  },
  {
    id: 'data-exfiltration',
    title: "Data Exfiltration Detection",
    description: "Identify potential data theft attempts",
    activities: [
      {
        id: 3,
        employee: "Mike Johnson",
        department: Departments.FINANCE,
        accessLevel: AccessLevels.ELEVATED,
        activityType: ActivityTypes.EMAIL_ACTIVITY,
        details: "Multiple large file attachments sent to personal email",
        timestamp: "15:15",
        icon: Mail,
        isSuspicious: true,
        flags: [BehaviorFlags.DATA_EXFILTRATION],
        riskScore: 90,
        evidence: {
          normalActivity: "Internal email communication",
          dataVolume: "15GB of files in 1 hour",
          destination: "Personal email domain",
          fileTypes: "Financial reports, customer data"
        },
        tips: [
          "Monitor email attachment sizes",
          "Check recipient domains",
          "Review data transfer patterns"
        ]
      },
      {
        id: 4,
        employee: "Lisa Wong",
        department: Departments.HR,
        accessLevel: AccessLevels.ELEVATED,
        activityType: ActivityTypes.EMAIL_ACTIVITY,
        details: "Monthly report distribution",
        timestamp: "10:00",
        icon: Mail,
        isSuspicious: false,
        riskScore: 15,
        evidence: {
          normalActivity: "Regular report distribution",
          recipients: "Internal management team",
          fileTypes: "Standard HR reports"
        }
      }
    ],
    learningPoints: [
      "Monitor data transfer volumes",
      "Track email recipient patterns",
      "Identify sensitive data movement"
    ]
  },
  {
    id: 'privilege-escalation',
    title: "Privilege Escalation Detection",
    description: "Monitor for unauthorized privilege changes",
    activities: [
      {
        id: 5,
        employee: "Tom Wilson",
        department: Departments.ENGINEERING,
        accessLevel: AccessLevels.BASIC,
        activityType: ActivityTypes.LOGIN_ATTEMPT,
        details: "Multiple failed admin login attempts",
        timestamp: "13:20",
        icon: Users,
        isSuspicious: true,
        flags: [BehaviorFlags.PRIVILEGE_ESCALATION],
        riskScore: 95,
        evidence: {
          attempts: "12 failed attempts in 5 minutes",
          targetAccount: "System Administrator",
          normalAccess: "Developer permissions only",
          location: "Office network"
        },
        tips: [
          "Monitor failed login patterns",
          "Check access level requirements",
          "Review authorization attempts"
        ]
      }
    ],
    learningPoints: [
      "Track privilege elevation attempts",
      "Monitor authentication patterns",
      "Review access control policies"
    ]
  }
];