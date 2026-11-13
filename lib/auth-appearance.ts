import type { ComponentProps } from "react";
import type { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

// Scope layout customization to the authentication cards, not account popovers.
export const authAppearance: ComponentProps<typeof SignIn>["appearance"] = {
  theme: dark,
  variables: {
    colorPrimary: "#f5f5f5",
    colorPrimaryForeground: "#050505",
    colorBackground: "#050505",
    colorForeground: "#f5f5f5",
    colorMuted: "#171717",
    colorMutedForeground: "#99999f",
    colorNeutral: "#f5f5f5",
    colorBorder: "#353535",
    colorInput: "#050505",
    colorInputForeground: "#f5f5f5",
    colorRing: "#bdbdbd",
    fontSize: "15px",
    borderRadius: "0.25rem",
  },
  options: {
    elevation: "flush",
    socialButtonsVariant: "blockButton",
    socialButtonsPlacement: "top",
  },
  elements: {
    rootBox: "atom-auth-root",
    cardBox: "atom-auth-card-box",
    card: "atom-auth-card",
    header: "atom-auth-header",
    headerTitle: "atom-auth-title",
    headerSubtitle: "atom-auth-subtitle",
    main: "atom-auth-main",
    form: "atom-auth-form",
    formFieldLabel: "atom-auth-label",
    socialButtons: "atom-auth-socials",
    socialButtonsBlockButton: "atom-auth-social-button",
    socialButtonsBlockButtonText: "atom-auth-social-label",
    dividerRow: "atom-auth-divider",
    dividerLine: "atom-auth-divider-line",
    dividerText: "atom-auth-divider-text",
    formFieldInput: "atom-auth-input",
    formButtonPrimary: "atom-auth-submit",
    footer: "atom-auth-footer",
    footerAction: "atom-auth-footer-action",
    footerActionLink: "atom-auth-footer-link",
    formFieldAction: "atom-auth-footer-link",
  },
};
