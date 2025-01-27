// src/types/becSecurityTypes.js
import { Shield, Search, Phone, CheckCircle } from 'lucide-react';

export const EmailType = {
  LEGITIMATE: 'legitimate',
  FRAUD: 'fraud'
};

export const FraudType = {
  CEO_FRAUD: 'CEO Fraud',
  PAYMENT_FRAUD: 'Payment Fraud',
  VENDOR_IMPERSONATION: 'Vendor Impersonation',
  WIRE_TRANSFER_SCAM: 'Wire Transfer Scam'
};

export const SecurityBehaviors = {
  VERIFICATION_REQUESTED: 'Requested verification',
  PROCEDURE_FOLLOWED: 'Followed security procedures',
  AUTHORITY_QUESTIONED: 'Questioned authority appropriately',
  URGENCY_RESISTANT: 'Resisted urgency pressure',
  PROPER_CHANNELS: 'Used proper communication channels'
};

export const ActionTypes = {
  FLAG: 'flag',
  PROCESS: 'process',
  VERIFY: 'verify'
};

export const ScenarioTypes = {
  CEO_REQUEST: 'ceo_request',
  VENDOR_UPDATE: 'vendor_update',
  PAYMENT_CHANGE: 'payment_change',
  URGENT_TRANSFER: 'urgent_transfer'
};

// New verification game types
export const VerificationGameType = {
  CHECK_SENDER: 'check_sender',
  VERIFY_POLICY: 'verify_policy',
  CONTACT_SUPERVISOR: 'contact_supervisor',
  VALIDATE_REQUEST: 'validate_request'
};

export const VerificationGameStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const VerificationSteps = {
  [VerificationGameType.CHECK_SENDER]: {
    id: 'check_sender',
    title: 'Check Sender Details',
    description: 'Verify the authenticity of email senders',
    icon: Search,
    requiredScore: 70,
    maxScore: 100
  },
  [VerificationGameType.VERIFY_POLICY]: {
    id: 'verify_policy',
    title: 'Verify Security Policy',
    description: 'Ensure requests comply with security protocols',
    icon: Shield,
    requiredScore: 70,
    maxScore: 100
  },
  [VerificationGameType.CONTACT_SUPERVISOR]: {
    id: 'contact_supervisor',
    title: 'Contact Supervisor',
    description: 'Follow proper escalation procedures',
    icon: Phone,
    requiredScore: 70,
    maxScore: 100
  }
};