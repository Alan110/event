/*
 * @file view事件触发机制
 * @author yangfan16
 * @date 2016-06-02
 */

function EventEmitter() {}

var proto = EventEmitter.prototype;

function indexOfListener(listeners, listener) {
  var i = listeners.length;
  while (i--) {
    if (listeners[i].listener === listener) {
      return i;
    }
  }

  return -1;
}

/**
 * registe custom event into event center
 * @param {} evt event type
 * @param {} listener callback
 * @returns {} this reference
 */
proto.on = function (evt, listener) {
  var listeners = this._getEventListenersAsObject(evt);
  var isMulti = typeof listener === 'object';

  for (var key in listeners) {
    if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
      listeners[key].push(isMulti ? listener : {
        listener: listener,
        once: false
      });
    }
  }

  return this;
};

proto.once = function (evt, listener) {
  return this.on(evt, {
    listener: listener,
    once: true
  });
};

/**
 * delete event bind
 * @param {} evt
 * @param {} listener
 * @returns {}
 */
proto.off = function (evt, listener) {
  var listeners = this._getEventListenersAsObject(evt);

  for (var key in listeners) {
    if (listeners.hasOwnProperty(key)) {
      var index = indexOfListener(listeners[key], listener);

      if (index !== -1) {
        listeners[key].splice(index, 1);
      }
    }
  }

  return this;
};

/**
 * fire event with parmas
 * @param {} evt event type
 * @param {} args parmas
 * @returns {} this reference
 */
proto.emit = function (evt, args) {
  var listenersMap = this._getEventListenersAsObject(evt);
  var response;

  for (var key in listenersMap) {
    if (listenersMap.hasOwnProperty(key)) {
      var listeners = listenersMap[key].slice(0);
      var i = listeners.length;
      while (i--) {
        var listener = listeners[i];

        if (listener.once === true) {
          this.off(evt, listener.listener);
        }

        response = listener.listener.call(this, args || {});
      }
    }
  }

  return this;
};

proto._getEventListenersAsObject = function (evt) {
  var listeners = this._getEventListeners(evt);
  var response;

  if (listeners instanceof Array) {
    response = {};
    response[evt] = listeners;
  }

  return response || listeners;
};

proto._getEventListeners = function (evt) {
  var events = this._getEvents();
  return events[evt] || (events[evt] = []);
};

proto._getEvents = function () {
  return this._events || (this._events = {});
};

export {EventEmitter};

