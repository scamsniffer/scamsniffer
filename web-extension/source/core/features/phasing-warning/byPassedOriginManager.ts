import {getByPassedOrigin, setByPassedOrigin} from '../../storage';

class ByPassedOriginManager {
  private originSet: Set<string> = new Set();

  constructor() {
    getByPassedOrigin().then((data) => {
      this.originSet = new Set(data);
    });
  }

  public add(origin: string) {
    this.originSet.add(origin);
    setByPassedOrigin([...this.originSet]);
  }

  public has(origin: string) {
    return this.originSet.has(origin);
  }

  public delete(origin: string) {
    this.originSet.delete(origin);
    setByPassedOrigin([...this.originSet]);
  }

  public clear() {
    this.originSet.clear();
    setByPassedOrigin([...this.originSet]);
  }
}

export default new ByPassedOriginManager();
