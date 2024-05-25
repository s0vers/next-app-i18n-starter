type messages = typeof import("./translations/en.json");
type arMessages = typeof import("./translations/ar.json");

declare interface IntlMessages extends messages, arMessages {}
