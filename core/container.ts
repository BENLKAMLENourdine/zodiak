
type Constructor<T> = new (...args: any[]) => T;

export class Container {
    private instances: Map<Constructor<any>, any> = new Map();

    get<T>(Class: Constructor<T>): T {
        console.log(`Resolving ${Class.name}`);
        if(this.instances.has(Class)) {
            return this.instances.get(Class);
        }

        const paramTypes = Reflect.getMetadata('design:paramtypes', Class) || [];
        console.log(`Dependencies for ${Class.name}:`, paramTypes);
        const dependencies = paramTypes.map((param: any) => this.get(param));

        const instance = new Class(...dependencies);
        this.instances.set(Class, instance);
        return instance;
    }
}