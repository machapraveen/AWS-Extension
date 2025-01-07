class SecurityAnalyzer {
    constructor() {
      this.bestPractices = new Map();
      this.initialize();
    }
  
    async initialize() {
      // Load security best practices
      await this.loadSecurityRules();
    }
  
    async loadSecurityRules() {
      this.bestPractices.set('iam', [
        {
          rule: 'least-privilege',
          check: (policy) => {
            return !policy.Statement.some(stmt => 
              stmt.Effect === 'Allow' && 
              (stmt.Action.includes('*') || stmt.Resource.includes('*'))
            );
          },
          message: 'Avoid using wildcards in IAM policies'
        },
        {
          rule: 'require-mfa',
          check: (policy) => {
            return policy.Statement.some(stmt =>
              stmt.Condition?.Bool?.['aws:MultiFactorAuthPresent'] === 'true'
            );
          },
          message: 'Consider requiring MFA for sensitive actions'
        }
      ]);
  
      this.bestPractices.set('s3', [
        {
          rule: 'encryption',
          check: (bucket) => {
            return bucket.encryption?.enabled === true;
          },
          message: 'Enable default encryption for S3 buckets'
        },
        {
          rule: 'public-access',
          check: (bucket) => {
            return bucket.publicAccess?.blocked === true;
          },
          message: 'Block public access to S3 buckets by default'
        }
      ]);
    }
  
    async analyzeSecurity(service, resource) {
      const issues = [];
      const rules = this.bestPractices.get(service) || [];
  
      for (const rule of rules) {
        if (!rule.check(resource)) {
          issues.push({
            severity: 'warning',
            message: rule.message,
            rule: rule.rule
          });
        }
      }
  
      return {
        issues,
        recommendations: this.generateRecommendations(issues)
      };
    }
  
    generateRecommendations(issues) {
      return issues.map(issue => {
        switch (issue.rule) {
          case 'least-privilege':
            return {
              title: 'Implement Least Privilege',
              steps: [
                'Review and list required actions',
                'Specify exact resource ARNs',
                'Remove wildcard permissions'
              ]
            };
          case 'require-mfa':
            return {
              title: 'Enable MFA Protection',
              steps: [
                'Add MFA condition to policy',
                'Configure MFA devices',
                'Test MFA enforcement'
              ]
            };
          default:
            return {
              title: 'General Security Improvement',
              steps: [
                'Review security best practices',
                'Implement recommended changes',
                'Regular security audits'
              ]
            };
        }
      });
    }
  }
  
  export default new SecurityAnalyzer();