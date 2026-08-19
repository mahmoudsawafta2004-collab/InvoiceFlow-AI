import type en from "./dictionaries/en";

/** Every locale dictionary is checked against this shape at compile time. */
export type Dictionary = typeof en;
