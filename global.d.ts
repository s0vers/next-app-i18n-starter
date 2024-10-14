// Only applicable if the project is using local json files for translations
// and the translation files are named as per the locale.
// This snippet is a declaration file for the translations files.
// If the project is using a api for translations, delete this file.
type messages = typeof import("./translations/en.json");
type arMessages = typeof import("./translations/ar.json");

declare interface IntlMessages extends messages, arMessages {}
