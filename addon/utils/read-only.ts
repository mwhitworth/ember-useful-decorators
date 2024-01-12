/* eslint-disable @typescript-eslint/no-explicit-any */

function getFromPathParts(target: any, parts: string[]): any {
  return parts.reduce((nextTarget, part) => {
    return nextTarget?.[part];
  }, target);
}

export function readOnly(path: string): PropertyDecorator {
  const pathParts = path.split('.');
  return (_target: any, _propertyKey: string, desc?: any) => {
    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      get(this: any): any {
        return getFromPathParts(this, pathParts);
      },
    };
  };
}

