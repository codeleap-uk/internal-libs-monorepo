import { DEFAULT_STYLES } from '../styles';
import fs from 'fs';
import nodePath from 'path';
const exists = (path) => {
  try {
    const fileStat = fs.statSync(path);

    return fileStat;
  } catch (e) {
    return false;
  }
};

const components = Object.keys(DEFAULT_STYLES).filter(
  (k) => Object.keys(DEFAULT_STYLES[k]).length > 0,
);
const DEFAULT_PATH = `${process.cwd()}/src/app/stylesheets/`;
const stylesPath = nodePath.resolve(process.argv?.[3] || DEFAULT_PATH);
const component = process.argv?.[2] || '--all';

const componentList = component === '--all' ? components : component.split(',');

if (!stylesPath) {
  console.error('You must supply a path for the styles eg: ' + DEFAULT_PATH);
  process.exit(1);
}

const fileData = exists(stylesPath);

if (!fileData || !fileData.isDirectory()) {
  console.error(
    `Styles path ${stylesPath} either doesn't exist or is not a directory`,
  );
  process.exit(1);
}

const existingFiles = fs
  .readdirSync(stylesPath, {
    withFileTypes: true,
  })
  .filter((f) => !f.isDirectory())
  .map((p) => p.name);

const { validFiles, invalidFiles } = componentList.reduce(
  (acc, cp) => {
    if (
      !existingFiles.includes(`${cp}.ts`) &&
      !existingFiles.includes(`${cp}.tsx`)
    ) {
      return {
        ...acc,
        validFiles: [...acc.validFiles, cp],
      };
    } else {
      return {
        ...acc,
        invalidFiles: [...acc.invalidFiles, cp],
      };
    }
  },
  {
    validFiles: [],
    invalidFiles: [],
  },
);

if (invalidFiles.length > 0) {
  console.log(
    `Ignoring StyleSheets ${invalidFiles.join(
      ', ',
    )} to not overwrite existing files`,
  );
}

if (validFiles.length < 1) {
  console.log('No  StyleSheets to create. Exiting');
  process.exit(0);
}

console.log(`Creating StyleSheets:\n\n${validFiles.join('  \n')}`);

const template = `
import { __CP__Composition } from '@codeleap/common'
import { variantProvider } from '../theme'

const create__CP__Style = variantProvider.createVariantFactory<__CP__Composition>()
const defaultStyles = variantProvider.getDefaultVariants('__CP__')

export const App__CP__Styles = {
  ...defaultStyles,
  default: create__CP__Style((theme) => ({
    ...defaultStyles.default,  
  })),
}
`;
validFiles.forEach((f) => {
  const fullPath = nodePath.join(stylesPath, `${f}.ts`);

  const content = template.replace(/__CP__/g, f);

  return fs.writeFileSync(fullPath, content, {
    encoding: 'utf-8',
  });
});

console.log(`\nCreated ${validFiles.length} stylesheets at ${stylesPath}.\n`);
console.log(`Happy Styling!`);
