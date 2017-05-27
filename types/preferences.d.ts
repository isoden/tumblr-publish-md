
declare module 'preferences' {
  interface PreferencesConstructor {
    new<T = { [key: string]: any }> (id: string, defs?: Object, options?: { key?: string }): T;
  }

  const Preferences: PreferencesConstructor

  export = Preferences;
}
