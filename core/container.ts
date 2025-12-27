export class Container {
    private services: Map<string, any> = new Map();

    register<T>(name: string, service: T): void {
        this.services.set(name, service)
    }

    resolve<T>(name: string): T {
        return this.services.get(name);
    }
}