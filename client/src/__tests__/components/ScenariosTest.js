import becScenarios from '../../data/becSecurityScenarios';
import { scenarios as dataScenarios } from '../../data/dataSecurityScenarios';
import { EmailScenarios } from '../../data/emailScenarios';
import { InsiderThreatEducationalFeedback, getInsiderThreatFeedback } from '../../data/insiderThreatEducation';
import InsiderScenarios from '../../data/insiderThreatScenarios';

describe('BEC Security Scenarios', () => {
  test('should export an array of scenarios', () => {
    expect(Array.isArray(becScenarios)).toBe(true);
    expect(becScenarios.length).toBeGreaterThan(0);
  });

  test('each scenario has the required properties', () => {
    becScenarios.forEach(scenario => {
      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('type');
      expect(scenario).toHaveProperty('emailContent');
      expect(scenario.emailContent).toHaveProperty('from');
      expect(scenario.emailContent).toHaveProperty('subject');
      expect(scenario.emailContent).toHaveProperty('content');
      expect(scenario.emailContent).toHaveProperty('timestamp');
      expect(scenario).toHaveProperty('emailType');
      expect(scenario).toHaveProperty('fraudType');
      expect(scenario).toHaveProperty('riskScore');
      expect(scenario).toHaveProperty('redFlags');
      expect(Array.isArray(scenario.redFlags)).toBe(true);
      expect(scenario).toHaveProperty('correctVerification');
      expect(Array.isArray(scenario.correctVerification)).toBe(true);
      expect(scenario).toHaveProperty('correctAction');
      expect(scenario).toHaveProperty('securityProtocol');
      expect(scenario).toHaveProperty('learningPoints');
      expect(Array.isArray(scenario.learningPoints)).toBe(true);
    });
  });
});

describe('Data Security Scenarios', () => {
  test('should export an array of scenarios', () => {
    expect(Array.isArray(dataScenarios)).toBe(true);
    expect(dataScenarios.length).toBeGreaterThan(0);
  });

  test('each scenario has the required properties', () => {
    dataScenarios.forEach(scenario => {
      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('title');
      expect(scenario).toHaveProperty('content');
      expect(scenario).toHaveProperty('icon');
      expect(scenario).toHaveProperty('correctChoices');
      expect(scenario.correctChoices).toHaveProperty('classification');
      expect(scenario.correctChoices).toHaveProperty('access');
      expect(scenario.correctChoices).toHaveProperty('security');
      expect(scenario).toHaveProperty('explanation');
      expect(scenario).toHaveProperty('securityTips');
      expect(Array.isArray(scenario.securityTips)).toBe(true);
    });
  });
});

describe('Email Scenarios', () => {
  test('should export an object with roles as keys', () => {
    expect(typeof EmailScenarios).toBe('object');
    expect(EmailScenarios).toHaveProperty('CEO');
    expect(EmailScenarios).toHaveProperty('FINANCE');
    expect(EmailScenarios).toHaveProperty('IT_SECURITY');
    expect(EmailScenarios).toHaveProperty('HR');
  });

  test('each email scenario has the required properties', () => {
    Object.keys(EmailScenarios).forEach(role => {
      const scenarios = EmailScenarios[role];
      expect(Array.isArray(scenarios)).toBe(true);
      scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('context');
        expect(scenario).toHaveProperty('initialSituation');
        expect(scenario.initialSituation).toHaveProperty('from');
        expect(scenario.initialSituation).toHaveProperty('subject');
        expect(scenario.initialSituation).toHaveProperty('content');
        expect(scenario.initialSituation).toHaveProperty('timestamp');
        expect(scenario).toHaveProperty('educationalPoints');
        expect(Array.isArray(scenario.educationalPoints)).toBe(true);
        expect(scenario).toHaveProperty('redFlags');
        expect(Array.isArray(scenario.redFlags)).toBe(true);
        expect(scenario).toHaveProperty('options');
        expect(Array.isArray(scenario.options)).toBe(true);
        expect(scenario).toHaveProperty('bestPractices');
        expect(Array.isArray(scenario.bestPractices)).toBe(true);
      });
    });
  });
});

describe('Insider Threat Education', () => {
  test('should export feedback for expected roles', () => {
    expect(typeof InsiderThreatEducationalFeedback).toBe('object');
    expect(InsiderThreatEducationalFeedback).toHaveProperty('CEO');
    expect(InsiderThreatEducationalFeedback).toHaveProperty('FINANCE');
    expect(InsiderThreatEducationalFeedback).toHaveProperty('IT_SECURITY');
  });

  test('each role feedback contains required fields', () => {
    Object.values(InsiderThreatEducationalFeedback).forEach(roleFeedback => {
      expect(roleFeedback).toHaveProperty('roleOverview');
      expect(typeof roleFeedback.roleOverview).toBe('string');
      expect(roleFeedback).toHaveProperty('commonThreats');
      expect(Array.isArray(roleFeedback.commonThreats)).toBe(true);
      expect(roleFeedback).toHaveProperty('preventionTips');
      expect(Array.isArray(roleFeedback.preventionTips)).toBe(true);
      expect(roleFeedback).toHaveProperty('didYouKnow');
      expect(Array.isArray(roleFeedback.didYouKnow)).toBe(true);
    });
  });

  test('getInsiderThreatFeedback returns valid feedback object', () => {
    const feedback = getInsiderThreatFeedback('CEO', true);
    expect(feedback).toHaveProperty('isCorrect', true);
    expect(feedback).toHaveProperty('roleId', 'CEO');
    expect(feedback).toHaveProperty('feedbackSections');
    expect(Array.isArray(feedback.feedbackSections)).toBe(true);
    feedback.feedbackSections.forEach(section => {
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('content');
    });
  });
});

describe('Insider Threat Scenarios', () => {
  test('should export an object with roles as keys', () => {
    expect(typeof InsiderScenarios).toBe('object');
    expect(InsiderScenarios).toHaveProperty('CEO');
    expect(InsiderScenarios).toHaveProperty('FINANCE');
    expect(InsiderScenarios).toHaveProperty('IT_SECURITY');
  });

  test('each insider threat scenario has the required properties', () => {
    Object.keys(InsiderScenarios).forEach(role => {
      const scenarios = InsiderScenarios[role];
      expect(Array.isArray(scenarios)).toBe(true);
      scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('activities');
        expect(Array.isArray(scenario.activities)).toBe(true);
        scenario.activities.forEach(activity => {
          expect(activity).toHaveProperty('id');
          expect(activity).toHaveProperty('employee');
          expect(activity).toHaveProperty('department');
          expect(activity).toHaveProperty('activityType');
          expect(activity).toHaveProperty('icon');
          expect(activity).toHaveProperty('normalPattern');
          expect(activity).toHaveProperty('timeline');
          expect(Array.isArray(activity.timeline)).toBe(true);
          activity.timeline.forEach(t => {
            expect(t).toHaveProperty('date');
            expect(t).toHaveProperty('time');
            expect(t).toHaveProperty('action');
            expect(t).toHaveProperty('details');
            expect(t).toHaveProperty('location');
            expect(t).toHaveProperty('isNormal');
            if (!t.isNormal && t.alerts !== undefined) {
              expect(Array.isArray(t.alerts)).toBe(true);
            }
          });
        });
      });
    });
  });
});
