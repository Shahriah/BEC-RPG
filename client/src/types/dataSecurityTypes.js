// types/dataSecurityTypes.js

export const DataClassification = {
    PUBLIC: {
      value: 'public',
      label: 'Public',
      description: 'Can be freely shared',
      color: 'bg-green-100'
    },
    INTERNAL: {
      value: 'internal',
      label: 'Internal',
      description: 'For employee use only',
      color: 'bg-blue-100'
    },
    CONFIDENTIAL: {
      value: 'confidential',
      label: 'Confidential',
      description: 'Sensitive business data',
      color: 'bg-yellow-100'
    },
    RESTRICTED: {
      value: 'restricted',
      label: 'Restricted',
      description: 'Highly sensitive data',
      color: 'bg-red-100'
    }
  };
  
  export const AccessLevels = {
    ALL_EMPLOYEES: {
      value: 'all-employees',
      label: 'All Employees',
      description: 'Available to everyone',
      color: 'bg-green-100'
    },
    RESTRICTED: {
      value: 'restricted',
      label: 'Restricted',
      description: 'Limited to specific teams',
      color: 'bg-yellow-100'
    },
    NDA_REQUIRED: {
      value: 'nda-required',
      label: 'NDA Required',
      description: 'Requires signed NDA',
      color: 'bg-red-100'
    }
  };
  
  export const SecurityMeasures = {
    INTRANET: {
      value: 'intranet',
      label: 'Intranet',
      description: 'Internal network storage',
      color: 'bg-blue-100'
    },
    ENCRYPTED: {
      value: 'encrypted',
      label: 'Encrypted',
      description: 'Encrypted storage required',
      color: 'bg-yellow-100'
    },
    SECURE_PORTAL: {
      value: 'secure-portal',
      label: 'Secure Portal',
      description: 'Protected sharing platform',
      color: 'bg-red-100'
    }
  };
  
  export const DataTypes = {
    CUSTOMER: 'CUSTOMER',
    EMPLOYEE: 'EMPLOYEE',
    FINANCIAL: 'FINANCIAL',
    PRODUCT: 'PRODUCT',
    STRATEGIC: 'STRATEGIC'
  };