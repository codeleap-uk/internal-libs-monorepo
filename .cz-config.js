module.exports = {
    types: [
      { value: 'feat', name: 'feat: A new feature' },
      { value: 'fix', name: 'fix: A bug fix' },
      { value: 'docs', name: 'docs: Documentation only changes' },
      {
        value: 'style',
        name: 'style: Changes that do not affect the meaning of the code, (white-space, formatting, missing semi-colons, etc)',
      },
      {
        value: 'refactor',
        name: 'refactor: A code change that neither fixes a bug nor adds a feature',
      },
      {
        value: 'perf',
        name: 'perf: A code change that improves performance',
      },
      { value: 'test', name: 'test: Adding missing tests' },
      {
        value: 'chore',
        name: 'chore: Changes to the build process or auxiliary tools, and libraries such as documentation generation',
      },
      { value: 'revert', name: 'revert:   Revert to a commit' },
      { value: 'WIP', name: 'WIP: Work in progress' },
    ],
  
    scopes: [{ name: 'mobile' }, { name: 'web' }, { name: 'common' }, { name: 'cli' }, { name: "mobile-template"}, {name: "web-template"}, {name: "documentation"},{name: 'tooling'}],
  
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