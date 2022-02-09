import { AppSettings, EnhancedTheme, Logger, RequestClient } from "..";

export type GlobalVars = {
  Logger: Logger;
  Settings: AppSettings;
  Api: RequestClient;
  Theme: EnhancedTheme<any>;
};
