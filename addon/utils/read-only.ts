/* eslint-disable @typescript-eslint/no-explicit-any */

import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

function getFromPathParts(target: any, parts: string[]): any {
  return parts.reduce((nextTarget, part) => {
    return nextTarget?.[part];
  }, target);
}

export function readOnly(path: string): PropertyDecorator {
  const pathParts = path.split('.');
  return (_target: any, _propertyKey: string | symbol, desc?: any) => {
    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      get(this: any): any {
        return getFromPathParts(this, pathParts);
      },
    };
  };
}

export function readOnce(path: string): PropertyDecorator {
  return (_target: any, key: string | symbol, desc?: any) => {
    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      get(this: any): any {
        const value = getFromPathParts(this, path.split('.'));
        Object.defineProperty(this, key, {
          value,
          writable: false,
        });
        triggerReread(this);
        return value;
      },
    };
  };
}

export const constant = (
  _target: any,
  key: string,
  desc: PropertyDescriptor,
): void => {
  const origFn = desc.get!;
  desc.get = function (this: any): any {
    const value = origFn.apply(this);
    Object.defineProperty(this, key, {
      value,
      writable: false,
    });
    triggerReread(this);
    return value;
  };
};

// Each time Glimmer calculates a property, p, it records (creates tags for) the objects and properties that
// were used in the last calculation.
// When a "constant" property (p) is first calculated, Glimmer will have created tags for properties that were
// used in the initial calculation.
// As, p is constant none of the consumed properties will change and Glimmer will continue validating tags unnecessarily
// on ever re-render.
// By including a dummy tracked variable in the calculation, Glimmer will consider the dirtying of this variable as a
// reason to recalculate `p`.
// If we later dirty it, then when Glimmer does the recalculation it will see a constant value with no dependencies.
// Hence, the tags created on the initial read are discarded.

let rereadScheduled = false;

class RereadTracker {
  @tracked
  rereadTrigger = true;
}

const rereadTracker = new RereadTracker();

function triggerReread(target: any): void {
  if (rereadTracker.rereadTrigger) {
    // By testing (consuming) rereadTrigger in the "if" condition, Glimmer now considers it part of the calculation of
    // the property we want to force Glimmer to reread after we make it a constant property
    if (!rereadScheduled) {
      next(null, () => {
        // At this point the "constant" property has been rewritten as a constant value
        // Dirty the "trigger" to tell Glimmer to reread the constant.
        rereadTracker.rereadTrigger = true;
        rereadScheduled = false;
      });
      rereadScheduled = true;
    }
  }
}
