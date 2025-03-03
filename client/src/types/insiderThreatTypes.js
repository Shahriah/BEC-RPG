

export const ActivityTypes = {
    DATABASE_ACCESS: 'DATABASE_ACCESS',
    FILE_TRANSFER: 'FILE_TRANSFER',
    SYSTEM_ACCESS: 'SYSTEM_ACCESS',
    EMAIL_ACTIVITY: 'EMAIL_ACTIVITY',
    LOGIN_ATTEMPT: 'LOGIN_ATTEMPT'
  };
  
  export const RiskLevels = {
    HIGH: { value: 'high', threshold: 80, color: 'bg-red-500' },
    MEDIUM: { value: 'medium', threshold: 50, color: 'bg-yellow-500' },
    LOW: { value: 'low', threshold: 30, color: 'bg-green-500' }
  };
  
  export const BehaviorFlags = {
    AFTER_HOURS: 'After hours activity',
    UNAUTHORIZED_ACCESS: 'Unauthorized access attempt',
    DATA_EXFILTRATION: 'Potential data exfiltration',
    PRIVILEGE_ESCALATION: 'Privilege escalation attempt',
    UNUSUAL_PATTERN: 'Unusual behavior pattern'
  };
  
  export const Departments = {
    IT: 'IT',
    SALES: 'Sales',
    FINANCE: 'Finance',
    HR: 'Human Resources',
    ENGINEERING: 'Engineering'
  };
  
  export const AccessLevels = {
    BASIC: 'Basic',
    ELEVATED: 'Elevated',
    ADMIN: 'Admin'
  };