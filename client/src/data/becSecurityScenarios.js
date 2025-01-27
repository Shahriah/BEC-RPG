import { 
  EmailType,
  FraudType,
  ScenarioTypes,
  VerificationGameType,
  ActionTypes
} from '../types/becSecurityTypes';

export const scenarios = [
  {
    id: 'ceo-urgent-transfer',
    type: ScenarioTypes.CEO_REQUEST,
    emailContent: {
      from: "ceo.smith@companyname.com",
      subject: "Urgent Wire Transfer Required",
      content: `From: CEO Smith <ceo.smith@companyname.com>
Subject: Urgent Wire Transfer Needed
Time: 23:23

Dear Employee,

I need you to process an urgent wire transfer for a new supplier. This is time-sensitive and must be completed today. Please transfer $25,000 to the following account:

Bank: International Bank
Account: 1234567890
Swift: INTLBANK

Keep this confidential and confirm once done.

Regards,
CEO Smith`,
      timestamp: "23:23"
    },
    emailType: EmailType.FRAUD,
    fraudType: FraudType.CEO_FRAUD,
    riskScore: 85,
    redFlags: [
      "Late night email timing",
      "Urgent financial request",
      "Request for confidentiality",
      "Unusual payment request",
      "Suspicious domain (companyname.com vs company.com)"
    ],
    correctVerification: [
      VerificationGameType.CHECK_SENDER,
      VerificationGameType.VERIFY_POLICY
    ],  // Changed from requiredVerifications and removed CONTACT_SUPERVISOR for now
    correctAction: ActionTypes.FLAG,
    securityProtocol: "All payment requests must go through finance department with proper documentation.",
    learningPoints: [
      "Be wary of urgent financial requests",
      "Verify sender's email domain carefully",
      "Follow established payment procedures",
      "Don't let urgency override security protocols"
    ]
  },
  {
    id: 'vendor-payment-change',
    type: ScenarioTypes.VENDOR_COMMUNICATION,
    emailContent: {
      from: "accounts@supplier-inc.com",
      subject: "Updated Banking Details - URGENT",
      content: `From: Supplier Inc.
Subject: Updated Banking Details - URGENT
Time: 14:30

Dear Valued Customer,

We are writing to inform you that our banking details have changed. Please update your records for all future payments:

Bank Name: Global Trust Bank
Account: 456789123
Sort Code: 45-67-89

The payment for invoice #INV-2024-089 is due today. Please process this urgently to avoid supply disruption.

Note: Due to system maintenance, phone verification is temporarily unavailable.

Best regards,
Sarah Johnson
Accounts Team`,
      timestamp: "14:30"
    },
    emailType: EmailType.FRAUD,
    fraudType: FraudType.VENDOR_IMPERSONATION,
    riskScore: 90,
    redFlags: [
      "Urgent payment request",
      "Changed banking details",
      "Pressure tactics (supply disruption threat)",
      "Unavailable phone verification",
      "No prior notice of bank change"
    ],
    correctVerification: [
      VerificationGameType.CHECK_SENDER,
      VerificationGameType.VERIFY_POLICY
    ],  // Changed from requiredVerifications and simplified to current implemented games
    correctAction: ActionTypes.HOLD,
    securityProtocol: "Bank detail changes require formal documentation and multi-channel verification.",
    learningPoints: [
      "Verify banking changes through established channels",
      "Be suspicious of unavailable verification methods",
      "Don't let urgency bypass verification procedures",
      "Follow vendor management protocols"
    ]
  }
];

export default scenarios;