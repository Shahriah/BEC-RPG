// data/emailScenarios.js
export const EmailScenarios = {
    CEO: [
      {
        id: 'urgent_board_request',
        title: 'Urgent Board Communication',
        context: `As CEO, you receive an urgent email appearing to be from your Board Chairman. 
                  Understanding how to verify such high-level communications is crucial.`,
        initialSituation: {
          from: "m.anderson@boardexec-global.net",
          subject: "Urgent: Emergency Board Meeting - Action Required",
          content: `Dear [CEO Name],
  
  A significant acquisition opportunity requires immediate board approval. Due to market sensitivity, we need to proceed quickly and confidentially.
  
  Please approve the attached preliminary agreement and wire $2.5M to the escrow account:
  Bank: Global Trust Bank
  Account: 7789654123
  Swift: GLTBNK456
  
  Time is critical. Please process within 2 hours and confirm only via this email.
  
  Regards,
  Michael Anderson
  Board Chairman`,
          timestamp: "8:15 AM"
        },
        educationalPoints: [
          "Board-level communications are prime targets for fraud",
          "Urgent financial requests often indicate scams",
          "Verification procedures apply even at the highest levels",
          "Time pressure is a common manipulation tactic"
        ],
        redFlags: [
          {
            type: "Unofficial Email Domain",
            description: "Board chairman using non-company email",
            tip: "Official board communications should come through verified channels"
          },
          {
            type: "Urgency and Pressure",
            description: "2-hour deadline for large transaction",
            tip: "Legitimate board matters follow proper governance procedures"
          },
          {
            type: "Restricted Communication",
            description: "Request to communicate only through this email",
            tip: "This prevents normal verification procedures"
          }
        ],
        options: [
          {
            text: "Follow standard board communication protocols and verify through official channels",
            correct: true,
            feedback: "Excellent! Even as CEO, following established verification procedures is crucial. This protects both the company and its governance structure.",
            points: 100
          },
          {
            text: "Reply requesting a video conference for urgent discussion",
            correct: false,
            feedback: "While better than immediate compliance, you should first verify through established board communication channels.",
            points: 40
          },
          {
            text: "Process urgently given the board chairman's authority",
            correct: false,
            feedback: "Never bypass verification procedures, regardless of authority level. This could be a sophisticated BEC attack.",
            points: 0
          }
        ],
        bestPractices: [
          "Establish secure board communication channels",
          "Maintain emergency verification procedures",
          "Document all high-level financial approvals",
          "Regular updates of authorized contact information"
        ]
      },
      {
        id: 'ceo_alert_staff',
        title: 'Managing Staff Security Alert',
        context: `You discover someone is impersonating you in emails to staff. 
                  You need to handle this situation while maintaining security and avoiding panic.`,
        initialSituation: {
          from: "notifications@secure-alerts.com",
          subject: "Security Alert: CEO Email Compromise",
          content: `ALERT: Multiple unauthorized emails detected
  
  Our email monitoring system has detected several emails impersonating you over the past hour, targeting finance and HR departments.
  
  Click here to view the suspicious emails and lock your account: [Account Security Portal]
  
  Requires immediate attention to prevent data breach.
  
  IT Security Team`,
          timestamp: "2:30 PM"
        },
        educationalPoints: [
          "CEOs must lead by example in security practices",
          "Security responses need to be coordinated",
          "Phishing attempts can target security alerts",
          "Clear communication prevents confusion"
        ],
        redFlags: [
          {
            type: "Suspicious Domain",
            description: "Security alert from non-company domain",
            tip: "Legitimate security alerts use internal systems"
          },
          {
            type: "External Link",
            description: "Request to click unknown security portal link",
            tip: "Verify security alerts through IT department directly"
          },
          {
            type: "Fear-based Urgency",
            description: "Creating panic about data breach",
            tip: "Real security processes are methodical and verified"
          }
        ],
        options: [
          {
            text: "Contact IT Security team directly and coordinate response",
            correct: true,
            feedback: "Perfect! This ensures a coordinated response using established security protocols.",
            points: 100
          },
          {
            text: "Send an immediate company-wide email warning",
            correct: false,
            feedback: "This could cause confusion and make it harder to identify legitimate communications.",
            points: 30
          },
          {
            text: "Click the link to review the suspicious activity",
            correct: false,
            feedback: "Never click suspicious links. This alert could be a phishing attempt targeting you.",
            points: 0
          }
        ],
        bestPractices: [
          "Work with IT team for security responses",
          "Use established communication channels",
          "Follow incident response procedures",
          "Document security incidents properly"
        ]
      }
    ],
  
    FINANCE: [
      {
        id: 'unusual_invoice_request',
        title: 'Unusual Payment Request',
        context: `You receive an invoice with unusual payment instructions. 
                  As finance staff, you must verify and handle payment requests properly.`,
        initialSituation: {
          from: "accounts@vendor-services.net",
          subject: "URGENT: Updated Invoice Payment Instructions",
          content: `Dear Finance Team,
  
  Due to a temporary banking issue, please process our pending invoice (#INV-2024-156) payment to our alternate account:
  
  Amount: $145,890
  Bank: Global Commerce Bank
  Account: 4567891230
  Reference: INV-2024-156-ALT
  
  This is urgent as we have pending payments to our suppliers.
  Please process today and reply only to this email.
  
  Thanks,
  Sarah Johnson
  Accounts Receivable`,
          timestamp: "3:45 PM"
        },
        educationalPoints: [
          "Verify all changes to payment details",
          "Follow established payment procedures",
          "Be alert to unusual payment requests",
          "Document verification attempts"
        ],
        redFlags: [
          {
            type: "Changed Payment Details",
            description: "Request to use alternate bank account",
            tip: "Always verify account changes through established contacts"
          },
          {
            type: "Time Pressure",
            description: "Request for same-day processing",
            tip: "Urgency is often used to bypass verification"
          },
          {
            type: "Limited Communication",
            description: "Request to reply only to this email",
            tip: "This prevents proper verification"
          }
        ],
        options: [
          {
            text: "Contact vendor using established contact information to verify",
            correct: true,
            feedback: "Excellent! Always verify payment changes through known, verified contacts.",
            points: 100
          },
          {
            text: "Request official company letterhead confirmation",
            correct: false,
            feedback: "Documents can be forged. Direct verification through established channels is necessary.",
            points: 30
          },
          {
            text: "Process payment due to urgent supplier needs",
            correct: false,
            feedback: "Never bypass verification procedures due to urgency. This is a common BEC tactic.",
            points: 0
          }
        ],
        bestPractices: [
          "Maintain current vendor contact lists",
          "Follow payment verification procedures",
          "Document all verification attempts",
          "Regular staff training on payment security"
        ]
      },
      {
        id: 'executive_request',
        title: 'Executive Payment Request',
        context: `An executive requests an urgent payment outside normal procedures. 
                  You must handle this while maintaining proper financial controls.`,
        initialSituation: {
          from: "j.smith@company-exec.com",
          subject: "Confidential: Urgent Wire Transfer",
          content: `Finance team,
  
  I need a wire transfer processed immediately for a time-sensitive acquisition:
  
  Amount: $387,500
  Bank: International Trust Bank
  Account: 1234567890
  Reference: Project Eagle
  
  This is highly confidential. Don't discuss with anyone else.
  I'm in meetings but will check email.
  
  John Smith
  Chief Financial Officer`,
          timestamp: "4:55 PM"
        },
        educationalPoints: [
          "Executive authority doesn't override controls",
          "Verify requests regardless of source",
          "Follow proper payment procedures",
          "Document all payment requests"
        ],
        redFlags: [
          {
            type: "Domain Discrepancy",
            description: "Executive using non-standard email domain",
            tip: "Verify sender's email domain carefully"
          },
          {
            type: "Isolated Communication",
            description: "Request for confidentiality and limited discussion",
            tip: "Security procedures should never be bypassed"
          },
          {
            type: "Unavailable for Verification",
            description: "Sender claims to be in meetings",
            tip: "This prevents proper verification"
          }
        ],
        options: [
          {
            text: "Follow standard payment authorization procedures",
            correct: true,
            feedback: "Perfect! Standard procedures must be followed regardless of authority level.",
            points: 100
          },
          {
            text: "Request more details about the acquisition",
            correct: false,
            feedback: "While gathering information is good, proper verification procedures must be followed first.",
            points: 40
          },
          {
            text: "Process given CFO authority",
            correct: false,
            feedback: "Authority doesn't override security procedures. This could be a sophisticated impersonation.",
            points: 0
          }
        ],
        bestPractices: [
          "Maintain payment authorization procedures",
          "Verify all payment requests",
          "Keep authorization matrices updated",
          "Document verification steps"
        ]
      }
    ],
    IT_SECURITY: [
        {
          id: 'security_breach_alert',
          title: 'Security System Alert',
          context: `As IT Security, you receive an alert about potential system breaches. 
                    You need to verify the legitimacy of the alert and respond appropriately.`,
          initialSituation: {
            from: "security-alerts@cloud-protection.net",
            subject: "CRITICAL: Multiple Login Attempts Detected",
            content: `SECURITY ALERT: Unauthorized Access Attempts
    
    Multiple failed login attempts detected for executive accounts.
    
    Required Actions:
    1. Click here to review the activity log: [Security Portal]
    2. Reset affected account passwords immediately
    3. Update security certificates (download attached)
    
    Warning: System access may be compromised if not addressed within 60 minutes.
    
    Cloud Security Monitoring Team`,
            timestamp: "10:15 AM"
          },
          educationalPoints: [
            "Security alerts should come through official channels",
            "Verify alert sources before taking action",
            "Follow incident response procedures",
            "Avoid clicking external links in security alerts"
          ],
          redFlags: [
            {
              type: "Unofficial Alert Source",
              description: "Alert from unknown third-party domain",
              tip: "Security alerts should come through internal systems"
            },
            {
              type: "Suspicious Links/Attachments",
              description: "Request to click external link and download files",
              tip: "Could contain malware or lead to phishing sites"
            },
            {
              type: "Artificial Time Pressure",
              description: "60-minute deadline for critical security action",
              tip: "Pressure tactics often indicate fraud"
            }
          ],
          options: [
            {
              text: "Verify alert through internal security systems and follow incident response plan",
              correct: true,
              feedback: "Excellent! Always verify alerts through internal systems and follow established procedures.",
              points: 100
            },
            {
              text: "Click the link to quickly check the activity logs",
              correct: false,
              feedback: "Never click suspicious links. Access security logs through internal systems.",
              points: 0
            },
            {
              text: "Immediately reset all executive passwords",
              correct: false,
              feedback: "Verify the threat first. Acting on fake alerts can cause unnecessary disruption.",
              points: 30
            }
          ],
          bestPractices: [
            "Maintain incident response procedures",
            "Use internal security monitoring systems",
            "Verify alerts through proper channels",
            "Document security incidents"
          ]
        },
        {
          id: 'vendor_security_request',
          title: 'Vendor Security Access',
          context: `A vendor requests emergency system access for maintenance. 
                    You must handle the request while maintaining security protocols.`,
          initialSituation: {
            from: "tech.support@vendorsys.com",
            subject: "Emergency: System Maintenance Required",
            content: `Dear IT Security Team,
    
    Our monitoring detected critical issues requiring immediate attention.
    
    Please provide emergency admin access to your systems:
    - VPN credentials
    - Admin dashboard access
    - Network configuration access
    
    This is urgent to prevent system failure.
    Server maintenance window closes in 30 minutes.
    
    Best regards,
    Technical Support Team
    VendorSys Solutions`,
            timestamp: "3:30 PM"
          },
          educationalPoints: [
            "Vendor access requires proper verification",
            "Emergency requests don't bypass security",
            "Maintain access control procedures",
            "Document all access requests"
          ],
          redFlags: [
            {
              type: "Excessive Access Request",
              description: "Request for broad system access",
              tip: "Legitimate maintenance requires minimal, specific access"
            },
            {
              type: "Urgency Tactics",
              description: "Claimed emergency and tight deadline",
              tip: "Pressure often indicates social engineering"
            },
            {
              type: "Lack of Verification Details",
              description: "No reference to existing contract or ticket",
              tip: "Legitimate vendors follow established procedures"
            }
          ],
          options: [
            {
              text: "Verify request through established vendor management procedures",
              correct: true,
              feedback: "Perfect! Always verify vendor requests through proper channels and contracts.",
              points: 100
            },
            {
              text: "Provide limited access after email confirmation",
              correct: false,
              feedback: "Email confirmation isn't enough. Proper vendor verification is required.",
              points: 20
            },
            {
              text: "Grant access due to maintenance urgency",
              correct: false,
              feedback: "Never bypass access controls for urgency. This is a common attack vector.",
              points: 0
            }
          ],
          bestPractices: [
            "Maintain vendor access procedures",
            "Verify all emergency requests",
            "Document access grants",
            "Regular access review"
          ]
        }
      ],
    
      HR: [
        {
          id: 'employee_data_request',
          title: 'Employee Information Request',
          context: `You receive an executive request for sensitive employee data. 
                    As HR, you must protect employee information while handling requests appropriately.`,
          initialSituation: {
            from: "ceo.smith@company-group.net",
            subject: "Confidential: Employee Information Needed",
            content: `Dear HR Team,
    
    For an urgent compensation review, I need the following employee data:
    - Full names and addresses
    - Salary information
    - Social security numbers
    - Bank account details
    
    Please send this information within the next hour.
    Keep this request confidential due to sensitivity.
    
    Regards,
    John Smith
    CEO`,
            timestamp: "2:45 PM"
          },
          educationalPoints: [
            "Protect sensitive employee data",
            "Follow data privacy regulations",
            "Verify all executive requests",
            "Maintain confidentiality procedures"
          ],
          redFlags: [
            {
              type: "Suspicious Domain",
              description: "CEO email from unofficial domain",
              tip: "Verify sender's email domain against known addresses"
            },
            {
              type: "Sensitive Data Request",
              description: "Request for comprehensive personal data",
              tip: "Bulk personal data requests require special handling"
            },
            {
              type: "Urgency and Secrecy",
              description: "One-hour deadline and confidentiality request",
              tip: "Pressure and secrecy are red flags"
            }
          ],
          options: [
            {
              text: "Follow data request procedures and verify through official channels",
              correct: true,
              feedback: "Excellent! Protecting employee data requires proper verification and procedures.",
              points: 100
            },
            {
              text: "Send data in encrypted format after email confirmation",
              correct: false,
              feedback: "Encryption doesn't solve verification. Always verify requests first.",
              points: 30
            },
            {
              text: "Provide data due to CEO authority",
              correct: false,
              feedback: "Authority doesn't override data protection procedures. This could be a scam.",
              points: 0
            }
          ],
          bestPractices: [
            "Implement data request procedures",
            "Verify executive requests",
            "Document data access",
            "Regular privacy training"
          ]
        },
        {
          id: 'payroll_update_request',
          title: 'Payroll Information Update',
          context: `An employee requests an urgent change to their payroll information. 
                    You must verify and handle such requests securely.`,
          initialSituation: {
            from: "james.wilson@personal-email.com",
            subject: "Urgent: Update Direct Deposit Information",
            content: `HR Department,
    
    I need to urgently update my direct deposit information for this month's payroll:
    
    New Bank: International Banking Corp
    Account: 9876543210
    Routing: 087654321
    
    Please update ASAP as I have important payments due.
    I'm currently traveling and can only be reached by email.
    
    Thanks,
    James Wilson
    Senior Developer`,
            timestamp: "4:15 PM"
          },
          educationalPoints: [
            "Verify payroll change requests",
            "Follow employee verification procedures",
            "Protect against payroll fraud",
            "Maintain secure communication channels"
          ],
          redFlags: [
            {
              type: "Personal Email Use",
              description: "Request from non-company email",
              tip: "Payroll requests should come from work email"
            },
            {
              type: "Limited Contact Options",
              description: "Employee claims to be unreachable except by email",
              tip: "This prevents proper verification"
            },
            {
              type: "Urgent Financial Change",
              description: "Request for immediate payroll update",
              tip: "Rush requests often indicate fraud"
            }
          ],
          options: [
            {
              text: "Follow standard payroll change procedures requiring proper verification",
              correct: true,
              feedback: "Perfect! Payroll changes require proper verification regardless of urgency.",
              points: 100
            },
            {
              text: "Request additional identification by email",
              correct: false,
              feedback: "Email verification isn't sufficient for payroll changes.",
              points: 30
            },
            {
              text: "Update details due to employee's urgent need",
              correct: false,
              feedback: "Never rush payroll changes. This is a common fraud tactic.",
              points: 0
            }
          ],
          bestPractices: [
            "Maintain payroll change procedures",
            "Require multi-factor verification",
            "Document all payroll changes",
            "Regular fraud awareness training"
          ]
        }
      ]
    };

