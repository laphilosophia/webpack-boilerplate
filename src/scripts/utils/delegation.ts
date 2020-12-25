// @ts-nocheck

export {};

declare global {
  interface Window {
    SWA: any;
  }
}

(function () {
  let _matcher: () => void;
  let _level = 0;
  let _id = 0;
  let _handlers = {};
  let _swaInstances = {};

  function _addEvent(swa: { element: { addEventListener: (arg0: any, arg1: any, arg2: boolean) => void; }; }, type: string, callback: any) {
    const useCapture = type == 'blur' || type == 'focus';
    swa.element.addEventListener(type, callback, useCapture);
  }

  function _cancel(e: { preventDefault: () => void; stopPropagation: () => void; }) {
    e.preventDefault();
    e.stopPropagation();
  }

  function _getMatcher(element: { matches: any; webkitMatchesSelector: any; mozMatchesSelector: any; msMatchesSelector: any; oMatchesSelector: any; }) {
    if (_matcher) {
      return _matcher;
    }

    if (element.matches) {
      _matcher = element.matches;
      return _matcher;
    }

    if (element.webkitMatchesSelector) {
      _matcher = element.webkitMatchesSelector;
      return _matcher;
    }

    if (element.mozMatchesSelector) {
      _matcher = element.mozMatchesSelector;
      return _matcher;
    }

    if (element.msMatchesSelector) {
      _matcher = element.msMatchesSelector;
      return _matcher;
    }

    if (element.oMatchesSelector) {
      _matcher = element.oMatchesSelector;
      return _matcher;
    }

    _matcher = SWA.matchesSelector;
    return _matcher;
  }

  function _matchesSelector(element: { parentNode: any; }, selector: string, boundElement: any) {
    if (selector == '_root') {
      return boundElement;
    }

    if (element === boundElement) {
      return;
    }

    if (_getMatcher((element as any)).call(element, selector)) {
      return element;
    }

    if (element.parentNode) {
      _level++;
      return _matchesSelector(element.parentNode, selector, boundElement);
    }
  }

  function _addHandler(swa: { id: string | number; }, event: string | number, selector: string | number, callback: any) {
    if (!_handlers[swa.id]) {
      _handlers[swa.id] = {};
    }

    if (!_handlers[swa.id][event]) {
      _handlers[swa.id][event] = {};
    }

    if (!_handlers[swa.id][event][selector]) {
      _handlers[swa.id][event][selector] = [];
    }

    _handlers[swa.id][event][selector].push(callback);
  }

  function _removeHandler(swa: { id: string | number; }, event: string | number, selector: string | number, callback: any) {
    if (!_handlers[swa.id]) {
      return;
    }

    if (!event) {
      for (let type in _handlers[swa.id]) {
        if (_handlers[swa.id].hasOwnProperty(type)) {
          _handlers[swa.id][type] = {};
        }
      }
      return;
    }

    if (!callback && !selector) {
      _handlers[swa.id][event] = {};
      return;
    }

    if (!callback) {
      delete _handlers[swa.id][event][selector];
      return;
    }

    if (!_handlers[swa.id][event][selector]) {
      return;
    }

    for (let i = 0; i < _handlers[swa.id][event][selector].length; i++) {
      if (_handlers[swa.id][event][selector][i] === callback) {
        _handlers[swa.id][event][selector].splice(i, 1);
        break;
      }
    }
  }

  function _handleEvent(id: string | number, e: { target: any; srcElement: any; stopPropagation: () => void; cancelBubble: boolean; }, type: string | number) {
    if (!_handlers[id][type]) {
      return;
    }

    let target = e.target || e.srcElement;
    let selector: string;
    let match: any;
    let matches = {};
    let i = 0;
    let j = 0;

    _level = 0;

    for (selector in _handlers[id][type]) {
      if (_handlers[id][type].hasOwnProperty(selector)) {
        match = _matchesSelector(target, selector, _swaInstances[id].element);

        if (
            match && SWA.matchesEvent(
              type,
              _swaInstances[id].element,
              match,
              selector == '_root',
              e
            )
        ) {
          _level++;
          _handlers[id][type][selector].match = match;
          matches[_level] = _handlers[id][type][selector];
        }
      }
    }

    e.stopPropagation = function () {
      e.cancelBubble = true;
    };

    for (i = 0; i <= _level; i++) {
      if (matches[i]) {
        for (j = 0; j < matches[i].length; j++) {
          if (matches[i][j].call(matches[i].match, e) === false) {
            SWA.cancel((e as any));
            return;
          }

          if (e.cancelBubble) {
            return;
          }
        }
      }
    }
  }

  function _bind(events: string | any[], selector: string, callback: any, remove: any) {
    if (!this.element) {
      return;
    }

    if (!(events instanceof Array)) {
      events = [events];
    }

    if (!callback && typeof (selector) == 'function') {
      callback = selector;
      selector = '_root';
    }

    let id = this.id;
    let i: number;

    function _getGlobalCallback(type: any) {
      return function (e: any) {
        _handleEvent(id, e, type);
      };
    }

    for (i = 0; i < events.length; i++) {
      if (remove) {
        _removeHandler(this, events[i], selector, callback);
        continue;
      }

      if (!_handlers[id] || !_handlers[id][events[i]]) {
        SWA.addEvent(this, events[i], _getGlobalCallback(events[i]));
      }

      _addHandler(this, events[i], selector, callback);
    }

    return this;
  }

  function SWA(element: any, id: number) {
    if (!(this instanceof SWA)) {
      for (let key in _swaInstances) {
        if (_swaInstances[key].element === element) {
          return _swaInstances[key];
        }
      }

      _id++;
      _swaInstances[_id] = new SWA(element, _id);

      return _swaInstances[_id];
    }

    this.element = element;
    this.id = id;
  }

  SWA.prototype.on = function (events: any, selector: any, callback: any) {
    return _bind.call(this, events, selector, callback);
  };


  SWA.prototype.off = function (events: any, selector: any, callback: any) {
    return _bind.call(this, events, selector, callback, true);
  };

  SWA.matchesSelector = function () { };

  SWA.cancel = _cancel;

  SWA.addEvent = _addEvent;

  SWA.matchesEvent = function (a: any, b: any, c: any, d: any, e: any) {
    return true;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SWA;
  }

  window.SWA = SWA;
})();
