import { Constructor } from "../container";

export interface ModuleMetadata {
  imports?: Constructor<unknown>[];
  controllers?: Constructor<unknown>[];
  providers?: Constructor<unknown>[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return function (target: object) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
