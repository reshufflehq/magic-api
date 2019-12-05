class Route {
  constructor(route) {
    this.method = route.method;
    this.path = route.path;
    this.getKeyPrefix = Route.getKeyPrefix;
  }

  toKey() {
    return `${this.getKeyPrefix()}${this.method}:${this.path}`;
  }

  toString() {
    return `${this.method} ${this.path}`;
  }
}

Route.getKeyPrefix = () => 'endpoint:route:';

export default Route;
