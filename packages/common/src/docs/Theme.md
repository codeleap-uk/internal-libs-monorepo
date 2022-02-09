# createTheme Usage

---

```typescript
import { createTheme } from "codeleap-common";

const appTheme = createTheme({
  breakpoints: {
    zero: 0,
    tinyest: 290,
    tiny: 350,
    smallish: 420,
    small: 600,
    mid: 900,
    largeish: 1050,
    large: 1200,
    xlarge: 1400,
    xxlarge: 1800,
    huge: 2559,
  },
  colors: {
    primary: "#000",
    secondary: "#ddd",
    text: "#fff",
  },
  spacing: 10,
});

console.log(appTheme.spacing.marginHorizontal(3)); // { marginLeft: 30, marginRight: 30 }
console.log(appTheme.media.down("small")); // @media screen and (max-width: 600px)
```

The createTheme function takes the provided values and places them appropriately inside media query and spacing functions, as well as providing type information for VariantProvider instances.
