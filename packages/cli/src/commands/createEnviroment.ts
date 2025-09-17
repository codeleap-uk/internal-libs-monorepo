import { codeleapCommand } from "../lib/Command";

export const createEnvironment = codeleapCommand(
  {
    name: 'create-environment',
    parameters: [
        '[environment]',
    ],
  },
  async ({ _ }) => {
  },
)
