import { waitFor } from '@codeleap/common';
import { codeleapCommand } from '../lib/Command';

import { spinWhileNotCompleted } from '../lib/spinner';
import { chalk, inquirer, figlet } from '../lib';

export const initCommand = codeleapCommand(
  {
    name: 'init',
    parameters: [],
    alias: 'i',
  },
  async ({ _ }) => {
    const answers = await inquirer.prompt([
      {
        message: `What's your name?`,
        default: 'Codeleap',
        name: 'name',
      },
    ]);

    spinWhileNotCompleted(
      async () => {
        await waitFor(10000);

        console.log(
          chalk.greenBright(answers.name + ', your awesomeness level is:'),
        );

        console.log(chalk.yellow(figlet.textSync('Cacetinho')));
      },
      {
        name: 'Measuring your awesomeness...',
      },
    );
  },
);
