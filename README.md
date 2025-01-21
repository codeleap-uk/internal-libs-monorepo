# Codeleap Libraries

This repository contains component and utility abstractions to make our work on projects easier, as well as templates for getting started with new projects or for reference on how to use a certain feature.

## Libraries

- @codeleap/mobile: Components for react-native, along with some systems specific to mobile platforms such as the permission and OSAlert modules.
- @codeleap/web: Components for websites, with various APIs for DOM manipulation and simplifying the process of making a Gatsby website.
- @codeleap/auth: Authentication utilities.
- @codeleap/analytics: Integration with analytics tools for tracking user actions and events.
- @codeleap/fetch: Provides API fetch wrappers.
- @codeleap/form: Form validation, handling, and submission.
- @codeleap/hooks: Custom React hooks for handling different state and side effects.
- @codeleap/i18n: Internationalization utilities for translating content.
- @codeleap/logger: Provides logging mechanisms for debugging and tracking events.
- @codeleap/modals: Handles modal dialogs and overlays.
- @codeleap/query: Integration with TanStack React Query, providing hooks and utilities for managing server state, caching, pagination, and background fetching.
- @codeleap/styles: Style system with themes, variants, caching and intelligent style management for any environment.
- @codeleap/redux: Redux state management integration for global state.
- @codeleap/store: Centralized state store for application data.
- @codeleap/types: TypeScript types and interfaces for type-safety.
- @codeleap/utils: Miscellaneous utilities for general purpose tasks.

## Contributing

This repository utilizes `workspaces` along with `turborepo` for package/build management. The templates are tracked through git submodules, to allow simple cloning for new projects.

### Setup

```bash
git clone https://github.com/codeleap-uk/internal-libs-monorepo

cd internal-libs-monorepo

# Pulls git submodules for templates
git submodule update --init --recursive

# Must use node 18+
nvm use 18.15.0

# Install dependencies
bun install

# Builds local versions of libraries
bun run build

# To build the app for android. Substitute android for 'ios' to run on apple devices
bun run mobile android
# To run the mobile template
bun run mobile dev

# To run the web template
bun run web dev
```

Changes made to the packages must be rebuilt to take effect inside template apps. It's recommended to configure the [Run on Save](https://marketplace.visualstudio.com/items?itemName=pucelle.run-on-save) extension for a smoother development experience. You can also just run `bun run build` again.

## Commit standard

This repository uses [cz-customizable](https://github.com/leoforfree/cz-customizable), an alternative to [Commitizen](https://github.com/commitizen/cz-cli) that allows for customization of the prompts for making a commit.

> It's advised to commit using a command line instead of a GUI tool such as VSCode's git feature or Github desktop, to ensure commit's follow the standard and are correctly displayed in changelogs for releases

There is no simple way to make git hooks interactive across windows and unix, so use `bun run commit` instead of `git commit`. 

These conventions are established to make tracking of changes to our libraries easier through changelogs.
### Submitting your changes

Please open a PR with an appropiatly named branch in the format `{scope}/{feature}`, where:

- `scope` is one of:
  - mobile: for changes to the mobile package or template
  - web: for changes to the web package or template
  - common: for changes to the common package
- `feature` is a simplified or abbreviated description of your changes

PRs will be integrated/approved with the following criteria in mind:

- What problem does the change solve?
- How difficult is it to integrate in existing apps?
- Does it provide both good UX and DX?

Please include this in the description of the PR to make discussion easier. 
