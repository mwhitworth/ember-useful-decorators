/* eslint-disable @typescript-eslint/no-explicit-any */

type DecoratorFunctionFactory<UParam, U> = (
  originalFn: (...a: UParam[]) => U | void,
  target: any,
  key: string,
  prefixedKey: string,
  params: any[],
) => (...a: UParam[]) => U | void;

function isDescriptor(possibleDesc: any): boolean {
  if (possibleDesc.length === 3) {
    const [target, key, desc] = possibleDesc;

    return (
      typeof target === 'object' &&
      target !== null &&
      typeof key === 'string' &&
      ((typeof desc === 'object' &&
        desc !== null &&
        'enumerable' in desc &&
        'configurable' in desc) ||
        desc === undefined) // TS compatibility
    );
  }

  return false;
}

export function decoratorWithParams(fn: any): MethodDecorator {
  return (...params: any[]) => {
    // determine if user called as @computed('blah', 'blah') or @computed()
    if (isDescriptor(params)) {
      return fn(...params, []);
    } else {
      return (target: any, key: string, desc: PropertyDescriptor) => {
        return fn(target, key, desc, params);
      };
    }
  };
}

export function decorateAllWithParams<UParam, U>(
  fnFactory: DecoratorFunctionFactory<UParam, U>,
): MethodDecorator {
  return decoratorWithParams(
    (target: any, key: string, desc: PropertyDescriptor, params: any[]) => {
      if (desc.value !== undefined) {
        desc.value = fnFactory(desc.value, target, key, key, params);
      }

      if (desc.get !== undefined) {
        desc.get = fnFactory(desc.get, target, key, `get ${key}`, params);
      }

      if (desc.set !== undefined) {
        desc.set = fnFactory(desc.set, target, key, `set ${key}`, params);
      }
    },
  );
}
