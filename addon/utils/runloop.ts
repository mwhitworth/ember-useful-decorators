/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  next as emberNext,
  once as emberOnce,
  run as emberRun,
  scheduleOnce as emberScheduleOnce,
} from '@ember/runloop';
import { decoratorWithParams } from './util';

interface OnceDecorator extends MethodDecorator {
  (): MethodDecorator;
}

export const once = decoratorWithParams(
  (_target: any, _key: string, desc: PropertyDescriptor) => {
    const original = desc.value;
    desc.value = function (this: any, ...args: any[]): void {
      emberOnce(this, original, ...args);
    };
  },
) as OnceDecorator;

interface ScheduleOnceDecorator extends MethodDecorator {
  (queue: string): MethodDecorator;
}

export const scheduleOnce = decoratorWithParams(
  (_target: any, _key: string, desc: PropertyDescriptor, [queue]: [any]) => {
    const original = desc.value;
    desc.value = function (this: any, ...args: any[]): void {
      emberScheduleOnce(queue, this, original, ...args);
    };
  },
) as ScheduleOnceDecorator;

interface NextDecorator extends MethodDecorator {
  (): MethodDecorator;
}

export const next = decoratorWithParams(
  (_target: any, _key: string, desc: PropertyDescriptor) => {
    const original = desc.value;
    desc.value = function (this: any, ...args: any[]): void {
      emberNext(this, original, ...args);
    };
  },
) as NextDecorator;

interface RunDecorator extends MethodDecorator {
  (): MethodDecorator;
}

export const run = decoratorWithParams(
  (_target: any, _key: string, desc: PropertyDescriptor) => {
    const original = desc.value;
    desc.value = function (this: any, ...args: any[]): void {
      emberRun(this, original, ...args);
    };
  },
) as RunDecorator;
