# Codeleap Libraries

This repository contains component and utility abstractions to make our work on projects easier, as well as templates for getting started with new projects or for reference on how to use a certain feature.

Read the docs at [docs.codeleap.co.uk](http://docs.codeleap.co.uk/)

## Libraries

- @codeleap/common: Includes the styling system, redux, api, form and permission APIs as well as some miscellaneous utilities.
- @codeleap/mobile: Components for react-native, along with some systems specific to mobile platforms such as the permission and OSAlert modules.
- @codeleap/web: Components for websites, with various APIs for DOM manipulation and simplifying the process of making a Gatsby website.

## Templates and examples

Both the web and mobile templates include examples of API usage for their respective library and the @codeleap/common package.

## Contributing

This repository utilizes `yarn workspaces` along with `turborepo` for package/build management. The templates are tracked through git submodules, to allow simple cloning for new projects.

### Setup

```bash
git clone https://github.com/codeleap-uk/internal-libs-monorepo

cd internal-libs-monorepo

# Pulls git submodules for templates
git submodule update --init --recursive

# Install dependencies
yarn

# Builds local versions of libraries
yarn build

# To build the app for android. Substitute android for 'ios' to run on apple devices
yarn mobile android
# To run the mobile template
yarn mobile dev

# To run the web template
yarn web dev
```

Changes made to the packages must be rebuilt to take effect inside template apps. It's recommended to configure the [Run on Save](https://marketplace.visualstudio.com/items?itemName=pucelle.run-on-save) extension for a smoother development experience. You can also just run `yarn build` again.

### Updating the documentation

All pages for the docs website use mdx, a mix between markdown and react's jsx. The articles themselves are located at `apps/docs/src/articles`. The frontmatter at the start of each file defines it's metadata, such as which module it belongs to (common,mobile,web), the path it will have under the respective module's url, and the title among other things such as the category (used for sidebar).

```mdx
---
path: 'permissions/solution'
title: 'Our current solution'
date: '2022-06-30'
category: Permissions
module: mobile
index: 1
---
```

### Submitting your changes

Please open a PR with an appropiatly named branch in the format `{scope}/{feature}`, where:

- `scope` is one of:
  - mobile: for changes to the mobile package or template
  - web: for changes to the web package or template
  - common: for changes to the common package
- `feature` is a simplified description of your changes

PRs will be integrated/approved with the following criteria in mind:

- What problem does the change solve?
- How difficult is it to integrate in existing apps?
- Does it provide both good UX and DX?

Please include this in the description of the PR to make discussion easier. 
