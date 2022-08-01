Class for instancing application loggers.

#### Includes

- Sentry integration when `Settings.IS_DEVELOPMENT` is true
- Colored logs based on their type
- Disabled logs in production

#### Usage

---

```typescript
import { ABC } from "codeleap-common";
import { Settings } from "your-app-settings-file";

const logger = new Logger(Settings);

// Standard log
logger.log("Description", { some: "value" }, "Category");

// warn and error will send log as exception to sentry in production
logger.warn("Warning description", { thing: "happened" }, "Category");
logger.error("Error description", { thing: "happened" }, "Category");

// Other log types
logger.info("Information", { thing: "happened" }, "Category");

```
