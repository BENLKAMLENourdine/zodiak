// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export class Container {
  private instances: Map<Constructor<unknown>, unknown> = new Map();

  get<T>(Class: Constructor<T>): T {
    if (this.instances.has(Class)) {
      return this.instances.get(Class) as T;
    }

    const paramTypes = (Reflect.getMetadata("design:paramtypes", Class) ||
      []) as Constructor<unknown>[];

    const dependencies = paramTypes.map((param) => this.get(param));

    const instance = new Class(...dependencies);
    this.instances.set(Class, instance);
    return instance;
  }
}
