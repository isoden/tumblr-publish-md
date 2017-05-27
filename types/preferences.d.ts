
declare module 'preferences' {
  interface PreferencesConstructor {
    new<T extends {}> (id: string, defs: Object, options?: { key?: string }): T;
  }

  const Preferences: PreferencesConstructor

  export = Preferences;
}
