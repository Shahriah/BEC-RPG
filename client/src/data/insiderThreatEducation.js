// src/data/insiderThreatEducation.js
export const InsiderThreatEducationalFeedback = {
    CEO: {
      roleOverview: "CEOs are prime targets for Business Email Compromise (BEC) due to their high-level access and authority.",
      commonThreats: [
        "Impersonation attempts to authorize fraudulent transfers",
        "Sensitive data exposure through email manipulation",
        "Social engineering targeting executive communication"
      ],
      preventionTips: [
        "Implement multi-factor authentication for email accounts",
        "Use email verification protocols like DMARC",
        "Establish strict verification processes for financial transactions"
      ],
      didYouKnow: [
        "BEC scams cost businesses over $1.8 billion in 2020 according to FBI reports",
        "Attackers often spend months researching executives' communication styles",
        "Executives are 12 times more likely to be targeted by cyber attacks"
      ]
    },
    FINANCE: {
      roleOverview: "Finance professionals are critical targets for Business Email Compromise and internal financial fraud.",
      commonThreats: [
        "Unauthorized fund transfers",
        "Manipulation of financial records",
        "Phishing attempts targeting sensitive financial information"
      ],
      preventionTips: [
        "Implement four-eye principle for financial transactions",
        "Regular reconciliation of financial records",
        "Use secure, encrypted communication channels"
      ],
      didYouKnow: [
        "80% of financial fraud involves someone inside the organization",
        "Insider threats in finance can go undetected for an average of 14 months",
        "Small changes in financial data can go unnoticed without careful monitoring"
      ]
    },
    IT_SECURITY: {
      roleOverview: "IT Security professionals are key defenders against insider threats and email-based attacks.",
      commonThreats: [
        "Unauthorized system access",
        "Privilege escalation",
        "Bypassing security controls"
      ],
      preventionTips: [
        "Implement least privilege access principles",
        "Continuous monitoring of system logs",
        "Regular security awareness training"
      ],
      didYouKnow: [
        "70% of insider threats involve privileged users",
        "IT security professionals can be both the strongest defense and potential insider threat vector",
        "Advanced persistent threats often start with compromised IT credentials"
      ]
    }
  };
  
  export const getInsiderThreatFeedback = (roleId, isCorrect) => {
    const roleInfo = InsiderThreatEducationalFeedback[roleId];
    if (!roleInfo) return null;
  
    const feedbackSections = [
      {
        title: "Role Overview",
        content: roleInfo.roleOverview
      },
      {
        title: "Common Threats",
        content: `Threats to watch: ${roleInfo.commonThreats.join(', ')}`
      },
      {
        title: "Prevention Tips",
        content: `Key prevention strategies: ${roleInfo.preventionTips.join(', ')}`
      },
      {
        title: "Did You Know?",
        content: `Insider Threat Insight: ${roleInfo.didYouKnow[Math.floor(Math.random() * roleInfo.didYouKnow.length)]}`
      }
    ];
  
    return {
      isCorrect,
      roleId,
      feedbackSections
    };
  };