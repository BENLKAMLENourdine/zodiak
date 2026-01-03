export type Route = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  handlerName: string;
};

export function Get(url: string) {
  return function (target: object, propertyKey: string) {
    const routes = (Reflect.getMetadata(
      "controller:routes",
      target.constructor,
    ) || []) as Route[];

    routes.push({
      method: "GET",
      url,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

export function Post(url: string) {
  return function (target: object, propertyKey: string) {
    const routes = (Reflect.getMetadata(
      "controller:routes",
      target.constructor,
    ) || []) as Route[];
    routes.push({
      method: "POST",
      url,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

export function Put(url: string) {
  return function (target: object, propertyKey: string) {
    const routes = (Reflect.getMetadata(
      "controller:routes",
      target.constructor,
    ) || []) as Route[];
    routes.push({
      method: "PUT",
      url,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

export function Delete(url: string) {
  return function (target: object, propertyKey: string) {
    const routes = (Reflect.getMetadata(
      "controller:routes",
      target.constructor,
    ) || []) as Route[];
    routes.push({
      method: "DELETE",
      url,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}
