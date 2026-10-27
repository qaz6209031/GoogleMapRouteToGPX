import type { Dictionary } from "../dictionary";
import type { Locale } from "../locales";
import { en } from "./en";
import { id } from "./id";
import { es } from "./es";
import { ja } from "./ja";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, id, es, ja };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
