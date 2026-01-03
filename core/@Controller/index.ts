export function Controller(prefix: string = "") {
  return function (target: object) {
    Reflect.defineMetadata("controller:prefix", prefix, target);
  };
}
