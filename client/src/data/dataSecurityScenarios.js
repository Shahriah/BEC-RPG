// data/dataSecurityScenarios.js
import { DataClassification, AccessLevels, SecurityMeasures, DataTypes } from '../types/dataSecurityTypes';
import { Users, FileSpreadsheet, FileText, Briefcase, Target } from 'lucide-react';

export const scenarios = [
  {
    id: 'customer-database',
    title: "Customer Database Export",
    content: `File: customer_database_2024.csv
Contents: Full customer list including:
- Names
- Email addresses
- Phone numbers
- Purchase history
- Payment information (last 4 digits only)

Request: Marketing team needs this for campaign analysis`,
    icon: FileSpreadsheet,
    dataType: DataTypes.CUSTOMER,
    correctChoices: {
      classification: DataClassification.CONFIDENTIAL.value,
      access: AccessLevels.RESTRICTED.value,
      security: SecurityMeasures.ENCRYPTED.value
    },
    explanation: {
      classification: "Contains personally identifiable information (PII) that requires confidential handling",
      access: "Only authorized marketing personnel should have access to customer data",
      security: "Customer data must be encrypted to protect sensitive information"
    },
    securityTips: [
      "Always encrypt files containing PII",
      "Limit access to necessary team members",
      "Monitor data access patterns",
      "Implement data retention policies"
    ]
  },
  {
    id: 'product-roadmap',
    title: "Product Roadmap Document",
    content: `Document: Product_Roadmap_2024_Q2.pptx
Contents:
- Upcoming product features
- Release timelines
- Market strategy
- Competitive analysis

Request: Needs to be shared with external development partners`,
    icon: FileText,
    dataType: DataTypes.STRATEGIC,
    correctChoices: {
      classification: DataClassification.RESTRICTED.value,
      access: AccessLevels.NDA_REQUIRED.value,
      security: SecurityMeasures.SECURE_PORTAL.value
    },
    explanation: {
      classification: "Contains sensitive strategic information that could impact competitive advantage",
      access: "External sharing requires proper NDAs and controlled access",
      security: "Secure portal ensures trackable and controlled document sharing"
    },
    securityTips: [
      "Always require NDAs for external sharing",
      "Use secure sharing platforms",
      "Track document access",
      "Enable document expiration"
    ]
  },
  {
    id: 'employee-handbook',
    title: "Employee Handbook",
    content: `Document: Employee_Handbook_2024.pdf
Contents:
- Company policies
- Benefits information
- General procedures
- Office guidelines

Request: HR wants to make this available to all employees`,
    icon: Briefcase,
    dataType: DataTypes.EMPLOYEE,
    correctChoices: {
      classification: DataClassification.INTERNAL.value,
      access: AccessLevels.ALL_EMPLOYEES.value,
      security: SecurityMeasures.INTRANET.value
    },
    explanation: {
      classification: "Standard internal documentation for employee reference",
      access: "All employees need access to company policies and procedures",
      security: "Intranet storage provides appropriate security for internal documents"
    },
    securityTips: [
      "Keep internal documents within company network",
      "Ensure regular updates",
      "Maintain version control",
      "Set up proper access controls"
    ]
  },
  {
    id: 'financial-report',
    title: "Quarterly Financial Report",
    content: `Document: Financial_Report_Q1_2024.xlsx
Contents:
- Revenue figures
- Profit margins
- Investment details
- Market projections

Request: Finance team needs to share with board members`,
    icon: Target,
    dataType: DataTypes.FINANCIAL,
    correctChoices: {
      classification: DataClassification.RESTRICTED.value,
      access: AccessLevels.RESTRICTED.value,
      security: SecurityMeasures.ENCRYPTED.value
    },
    explanation: {
      classification: "Contains sensitive financial data requiring highest protection",
      access: "Only board members and senior finance team should have access",
      security: "Financial data must be encrypted and securely transmitted"
    },
    securityTips: [
      "Use end-to-end encryption",
      "Implement access logging",
      "Set up automatic file expiration",
      "Require secure authentication"
    ]
  }
];