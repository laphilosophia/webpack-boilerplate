// @ts-nocheck
interface EventListenerDetails {
  capture?: boolean,
  once?: boolean,
  passive?: boolean,
  mozSystemGroup?: boolean,
}

interface ListenerDetails {
  _id: string|number,
  target: Window|Document|Element,
  type: string,
  listener(): any,
  options: EventListenerDetails,
}

class CustomEventRegisterManager {
  public debug: boolean;
  private _listeners: Map<string, Array<ListenerDetails>>;
  private _eventListenerCounter: number;

  constructor(debug: boolean = false) {
    this.debug                 = debug;
    this._listeners            = new Map();
    this._eventListenerCounter = 0;
  }

  setDebugMode(use: boolean = false): void {
    this.debug = true;
  }

  listAll(): Map<string, Array<ListenerDetails>> {
    return new Map(this._listeners);
  }

  getListenerDetailsByType(type: string): Array<ListenerDetails> {
    return this._listeners.get(type);
  }

  getListenerDetailsById(id) {
    for (const listenersDetails of this._listeners.values()) {
      for (const detail of listenersDetails) {
        if (detail._id === id) {
          return detail;
        }
      }
    }
    console.warn(`No associated listener for the id: ${id}`);
  }

  addEventListener(target: Window|Document|Element = window, type: string, listener: any, options: EventListenerDetails = {}, customId?: string): void {
    let details: Array<ListenerDetails> = [{
      _id: customId || this._eventListenerCounter,
      target,
      type,
      listener,
      options,
    }];
    if (this._listeners.size) {
      const currentListenerDetailsForType: Array<ListenerDetails> = this.getListenerDetailsByType(type);
      if (Array.isArray(currentListenerDetailsForType) && currentListenerDetailsForType.length) {
        details = [...details, ...currentListenerDetailsForType];
      }
    }
    this._listeners.set(type, details);
    this._eventListenerCounter = ++this._eventListenerCounter;
    target.addEventListener(type, listener, options);

    if (this.debug) console.debug(`The event listener for the type: ${type} has been added for the target:`, target);
  }

  removeEventListenersByType(type: string, basicCheckProcess: boolean = true): void {
    if (basicCheckProcess && !this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    const currentListenerDetailsForType: Array<ListenerDetails> = this.getListenerDetailsByType(type);

    if (!Array.isArray(currentListenerDetailsForType) || !currentListenerDetailsForType.length) {
      console.warn(`No listener saved for the type ${type}`);
      return;
    }

    for (const {target, listener, options} of currentListenerDetailsForType) {
      target.removeEventListener(type, listener, options);
    }

    this._listeners.delete(type);

    if (this.debug) console.debug(`All listeners for the type ${type} has been removed`);
  }

  removeEventListenersByTypes(types: Array<string> = []): void {
    if (!this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    for (const type of types) {
      this.removeEventListenersByType(type, false);
    }

    if (this.debug) console.debug(`All listeners for the following types: ${JSON.stringify(types)} has been removed`);
  }

  removeEventListenersByTarget(target: Window|Document|Element, basicCheckProcess: boolean = true): void {
    if (basicCheckProcess && !this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    for (const type of this._listeners.keys()) {
      const details: Array<ListenerDetails>        = this.getListenerDetailsByType(type);
      const updatedDetails: Array<ListenerDetails> = []; // Immutability
      details.forEach((value: ListenerDetails) => {
        if (value.target === target) {
          value.target.removeEventListener(type, value.listener, value.options);
        }
        else {
          updatedDetails.push(value);
        }
      });
      if (updatedDetails.length) this._listeners.set(type, updatedDetails);
    }
  }

  removeEventListenersByTargets(targets: Array<Window|Document|Element> = []): void {
    if (!this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    for (const target of targets) {
      this.removeEventListenersByTarget(target, false);
    }

    if (this.debug) console.debug(`All listeners for the following targets: ${JSON.stringify(targets)} has been removed`);
  }

  removeEventListenerById(id: string|number, basicCheckProcess: boolean = true): boolean {
    if (basicCheckProcess && !this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    for (const [type, listenersDetails] of this._listeners.entries()) {
      for (const [index, details] of listenersDetails.entries()) {
        if (details._id === id) {
          // remove finded element from the list
          const updatedDetails: Array<ListenerDetails> = [...listenersDetails];
          updatedDetails.splice(index, 1);

          this._listeners.set(type, updatedDetails); // update

          details.target.removeEventListener(details.type, details.listener, details.options);

          if (this.debug) console.debug(`The associated listener for the id: ${id} has been removed`);
          return true;
        }
      }
    }
    console.warn(`No associated listener found for the id: ${id}`);
    return false;
  }

  removeEventListenersByIds(ids: Array<string|number> = []): void {
    if (!this._listeners.size) {
      console.warn("No listener saved");
      return;
    }

    const removedIds: Array<string|number> = []; // list all removed ids

    for (const id of ids) {
      const isRemoved: boolean = this.removeEventListenerById(id, false);
      if (isRemoved) removedIds.push(id);
    }

    if (this.debug) console.debug(`All listeners for the following targets: ${JSON.stringify(removedIds)} has been removed`);
  }
}

export default new CustomEventRegisterManager();
