import { expect } from "chai";
import { AppTheme, createTheme, EnhancedTheme } from "../..";
const themeConfig: AppTheme = {
  breakpoints: {
    xs: 576,
    xxs: 10,
  },
  colors: {
    primary: "red",
  },
  spacing: 10,
  baseFontSize: 16,
  borderRadius: 10,
  icons: {},
  fontFamily: "Arial, sans-serif",
};

let theme: EnhancedTheme<typeof themeConfig> = null;

let screenSize = [400, 500];
describe("Theme", () => {
  before(() => {
    theme = createTheme(themeConfig, {
      screenSize: () => screenSize,
    });
  });

  it("Theme should be created", () => {
    console.log(theme);
    expect(theme.colors).to.be.an("object");
  });

  it("All margins should be 20", () => {
    const props = {
      ...theme.spacing.marginVertical(2),
      ...theme.spacing.marginHorizontal(2),
    };
    const margins = Object.values(props);

    expect(margins.every((v) => v === 20)).to.eq(true);
  });

  it("should say screen is below xs breakpoint", () => {
    expect(theme.hooks.down("xs")).to.eq(true);
  });

  it("should say screen is over xxs breakpoint", () => {
    expect(theme.hooks.up("xxs")).to.eq(true);
  });

  it("should say screen is over xs breakpoint", () => {
    screenSize = [1000, 1000];
    expect(theme.hooks.up("xs")).to.eq(true);
  });
});
