/* eslint-disable @typescript-eslint/no-explicit-any */

import { decoratorWithParams } from './util';

type EqualityFunc = (a: any, b: any) => boolean;

interface MemoizeByOutputDecorator extends MethodDecorator {
  (equalityFunc?: EqualityFunc): MethodDecorator;
}

function ensureCachedProperties(target: any): void {
  if (!Object.prototype.hasOwnProperty.call(target, 'cachedProperties')) {
    target.cachedProperties = {};
  }
}

export function areObjectsEqual(a: any, b: any): boolean {
  const aKeys = a && Object.keys(a);
  const bKeys = b && Object.keys(b);

  return (
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    (aKeys && aKeys.length) === (bKeys && bKeys.length) &&
    aKeys.find((k: any) => a[k] !== b[k]) === undefined
  );
}

function memoizeByOutputFunction(
  original: any,
  key: string,
  equalityFunc: EqualityFunc,
): any {
  return function (this: any, ...args: any[]): any {
    ensureCachedProperties(this);
    const previousValue = this.cachedProperties[key];
    const newValue = original.call(this, ...args);
    this.cachedProperties[key] = equalityFunc(previousValue, newValue)
      ? previousValue
      : newValue;
    return this.cachedProperties[key];
  };
}

export const memoizeByOutput = decoratorWithParams(
  (
    _target: any,
    key: string,
    desc: PropertyDescriptor,
    [equalityFunc]: [EqualityFunc | undefined],
  ) => {
    equalityFunc = equalityFunc ?? areObjectsEqual;

    if (desc.value !== undefined) {
      desc.value = memoizeByOutputFunction(desc.value, key, equalityFunc);
    }
    if (desc.get !== undefined) {
      desc.get = memoizeByOutputFunction(desc.get, key, equalityFunc);
    }
  },
) as MemoizeByOutputDecorator;
