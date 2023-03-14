module.exports = {
    types: [
      { value: 'feat', name: 'feat: A new feature', section: "Features" },
      { value: 'fix', name: 'fix: A bug fix', section: "Bug fixes" },
      { value: 'docs', name: 'docs: Documentation only changes', section: "Documentation" },
      {
        value: 'style',
        name: 'style: Changes that do not affect the meaning of the code, (white-space, formatting, missing semi-colons, etc)',
        hidden: true
      },
      {
        value: 'refactor',
        name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        hidden: true
      },
      {
        value: 'perf',
        name: 'perf: A code change that improves performance',
        hidden: true
      },
      { value: 'test', name: 'test: Adding missing tests', hidden: true },
      {
        value: 'chore',
        name: 'chore: Changes to the build process or auxiliary tools, and libraries such as documentation generation',
        hidden: true
      },
      { value: 'revert', name: 'revert:   Revert to a commit', hidden: true },
      { value: 'WIP', name: 'WIP: Work in progress', hidden: true },
    ],
  
    scopes: [
      { name: 'mobile' },
      { name: 'web' },
      { name: 'common' },
      { name: 'cli' },
      { name: "mobile-template"},
      { name: "web-template" },
      { name: "documentation"} ,
      { name: 'tooling' },
      { name: 'general' }
    ],
  
    usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
    allowTicketNumber: false,
    isTicketNumberRequired: false,
   
  
    // it needs to match the value for field type. Eg.: 'fix'
    /*
    scopeOverrides: {
      fix: [
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
    // override the messages, defaults are as follows
    messages: {
      type: "Select the type of change that you're committing:",
      scope: '\nDenote the SCOPE of this change:',
      subject: '\nWrite a SHORT, IMPERATIVE tense description of the change:\n',
      body: '\nProvide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: '\nList any BREAKING CHANGES (optional):\n',
    },
  
    allowCustomScopes: false,
    allowBreakingChanges: ['feat', 'fix'],
    // skip any questions you want
    skipQuestions: ['footer','breaking','body'],
  
    // limit subject length
    subjectLimit: 100,
    // breaklineChar: '|', // It is supported for fields body and footer.
    // footerPrefix : 'ISSUES CLOSED:'
    // askForBreakingChangeFirst : true, // default is false
  };