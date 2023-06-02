import { en } from './dictionaries/en';
import { createChainedI18nContext } from "@solid-primitives/i18n";

const [Provider, useI18nContext] = createChainedI18nContext({
  dictionaries: { en },
  locale: "en",
});

export const useI18n = () => {
  const context = useI18nContext();
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
};

export const I18nProvider = Provider;