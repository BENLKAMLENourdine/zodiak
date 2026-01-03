export type Constructor<T> = new (...args: unknown[]) => T;
import chalk from "chalk";

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
    console.log(
      chalk.hex("#FF00FF")(
        `[INJECTABLE] ${Class.name} has been registered in the container.`,
      ),
    );
    return instance;
  }
}
