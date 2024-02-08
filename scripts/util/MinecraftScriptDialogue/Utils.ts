import { RawMessage, system } from '@minecraft/server';

export const asyncWait = async (ticks: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    system.runTimeout(() => {
      resolve();
    }, ticks);
  });
};

/**
 * Translation helper to make it easier to define a RawMessage with
 * translated text.
 *
 * @category Helpers
 * @param translate
 * @param with_
 * @constructor
 */
interface TranslateType {
  (translate: string, with_: RawMessage): RawMessage;
  (translate: string, ...with_: Array<string>): RawMessage;
}

export const TRANSLATE: TranslateType = (
  translate: string,
  with_: string | RawMessage,
  ...with__: Array<string>
): RawMessage => {
  return {
    translate,
    with: typeof with_ === 'string' ? [with_, ...with__] : with_,
  };
};

// Use a builder pattern
// builder pattern: https://medium.com/geekculture/implementing-a-type-safe-object-builder-in-typescript-e973f5ecfb9c
// Needs updating to support optional types
// class ObjectBuilder {
//   public static new<Target>(): IWith<Target, {}> {
//     return new Builder<Target, {}>({});
//   }
// }
//
// interface IWith<Target, Supplied> {
//   with<T extends Omit<Target, keyof Supplied>, K extends keyof T>(
//     key: K,
//     value: T[K],
//   ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
//     ? IBuild<Target>
//     : IWith<Target, Supplied & Pick<T, K>>;
// }
//
// interface IBuild<Target> {
//   build(): Target;
// }
//
// class Builder<Target, Supplied> implements IBuild<Target>, IWith<Target, Supplied> {
//   constructor(private target: Partial<Target>) {}
//
//   with<T extends Omit<Target, keyof Supplied>, K extends keyof T>(key: K, value: T[K]) {
//     const target: Partial<Target> = { ...this.target, [key]: value };
//
//     return new Builder<Target, Supplied & Pick<T, K>>(target);
//   }
//
//   build() {
//     return this.target as Target;
//   }
// }
