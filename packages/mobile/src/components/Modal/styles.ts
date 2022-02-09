import {
  ButtonComposition,
  createDefaultVariantFactory,
  includePresets,
  ModalComposition,
  ModalStyles,
} from "@codeleap/common";

export const backgroundTransition = {
  duration: 200,
  ease: "easeOut",
  useNativeDriver: false,
};

export const modalTransition = {
  duration: 150,
  ease: "easeOut",
  useNativeDriver: false,
};

export type MobileModalParts =
  | "wrapper"
  | "overlay"
  | "innerWrapper"
  | "innerWrapperScroll"
  | "box"
  | "footer"
  | "body"
  | "header"
  | "touchableBackdrop"
  | "box:pose"
  | "title"
  | `closeButton${Capitalize<ButtonComposition>}`;

export type MobileModalComposition =
  | MobileModalParts
  | `${MobileModalParts}:visible`;

const createModalStyle = createDefaultVariantFactory<MobileModalComposition>();

const presets = includePresets((style) =>
  createModalStyle(() => ({ wrapper: style }))
);

const defaultModalStyles = ModalStyles;

export const MobileModalStyles = {
  ...presets,
  ...defaultModalStyles,
  default: createModalStyle((Theme) => {
    const fullSize = {
      ...Theme.presets.whole,
      position: "absolute",
      width: Theme?.values?.width,
      height: Theme?.values?.height,
    };

    return {
      wrapper: {
        zIndex: 1,

        ...fullSize,
      },

      overlay: {
        opacity: 0,

        backgroundColor: Theme.colors.black,
        ...fullSize,
      },
      "overlay:visible": {
        opacity: 0.5,
      },
      innerWrapper: {},
      innerWrapperScroll: {
        display: "flex",
        alignItems: "center",
        ...Theme.presets.justifyCenter,
        minHeight: Theme.values.height,
      },
      box: {
        width: "80%",
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.borderRadius.medium,
        ...Theme.spacing.padding(1),
      },
      touchableBackdrop: {
        ...fullSize,
      },
      "box:pose": {
        opacity: 0,
        scale: 0.8,
        y: Theme.values.height * 0.15,
        transition: modalTransition,
      },
      "box:pose:visible": {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: modalTransition,
      },
      header: {
        flexDirection: "row",
        ...Theme.presets.justifySpaceBetween,
        ...Theme.presets.alignCenter,
      },
      closeButtonWrapper: {
        alignSelf: "center",
      },
    };
  }),
  popup: createModalStyle((Theme) => ({})),
};
