import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { create } from '../src/dom';
import { EventEmitter, EventRegister } from '../src/event';

describe('Event Utils', () => {
  describe('EventEmitter', () => {
    let emitter: EventEmitter;

    beforeEach(() => {
      emitter = new EventEmitter(['test', 'change', 'click']);
    });

    afterEach(() => {
      emitter.destroy();
    });

    describe('on', () => {
      it('should register event handler', () => {
        let called = false;
        const handler = () => {
          called = true;
        };

        emitter.on('test', handler);
        emitter.trigger('test');

        expect(called).toBe(true);
      });

      it('should handle multiple handlers for same event', () => {
        let callCount = 0;
        const handler1 = () => callCount++;
        const handler2 = () => callCount++;

        emitter.on('test', handler1);
        emitter.on('test', handler2);
        emitter.trigger('test');

        expect(callCount).toBe(2);
      });

      it('should pass arguments to handler', () => {
        let receivedArgs: any[] = [];
        const handler = (...args: any[]) => {
          receivedArgs = args;
        };

        emitter.on('test', handler);
        emitter.trigger('test', 'arg1', 'arg2');

        expect(receivedArgs).toEqual(['arg1', 'arg2']);
      });
    });

    describe('once', () => {
      it('should call handler only once', () => {
        let callCount = 0;
        const handler = () => {
          callCount++;
        };

        emitter.once('test', handler);
        emitter.trigger('test');
        emitter.trigger('test');

        expect(callCount).toBe(1);
      });
    });

    describe('off', () => {
      it('should remove specific handler', () => {
        let callCount = 0;
        const handler1 = () => callCount++;
        const handler2 = () => callCount++;

        emitter.on('test', handler1);
        emitter.on('test', handler2);
        emitter.off('test', handler1);
        emitter.trigger('test');

        expect(callCount).toBe(1);
      });

      it('should remove all handlers for event type', () => {
        let callCount = 0;
        const handler1 = () => callCount++;
        const handler2 = () => callCount++;

        emitter.on('test', handler1);
        emitter.on('test', handler2);
        emitter.off('test');
        emitter.trigger('test');

        expect(callCount).toBe(0);
      });

      it('should remove all events when no arguments provided', () => {
        let callCount = 0;
        const handler = () => callCount++;

        emitter.on('test', handler);
        emitter.on('change', handler);
        emitter.off();
        emitter.trigger('test');
        emitter.trigger('change');

        expect(callCount).toBe(0);
      });
    });

    describe('trigger', () => {
      it('should trigger registered handlers', () => {
        let called = false;
        const handler = () => {
          called = true;
        };

        emitter.on('test', handler);
        emitter.trigger('test');

        expect(called).toBe(true);
      });

      it('should return true when handler returns true', () => {
        const handler = () => true;
        emitter.on('test', handler);

        const result = emitter.trigger('test');
        expect(result).toBe(true);
      });

      it('should handle unknown event types with warning', () => {
        const result = emitter.trigger('unknown');
        expect(result).toBeUndefined();
      });
    });

    describe('destroy', () => {
      it('should clear all events and types', () => {
        let called = false;
        const handler = () => {
          called = true;
        };

        emitter.on('test', handler);
        emitter.destroy();
        emitter.trigger('test');

        expect(called).toBe(false);
        expect(emitter.events).toEqual({});
        expect(emitter.eventTypes).toEqual({});
      });
    });
  });

  describe('EventRegister', () => {
    let element: HTMLElement;
    let eventRegister: EventRegister;

    beforeEach(() => {
      element = create('div');
      document.body.appendChild(element);
    });

    afterEach(() => {
      if (eventRegister) {
        eventRegister.destroy();
      }
      document.body.removeChild(element);
    });

    it('should register DOM events', () => {
      let clicked = false;
      const events = [
        {
          name: 'click',
          handler: () => {
            clicked = true;
          }
        }
      ];

      eventRegister = new EventRegister(element, events);
      element.click();

      expect(clicked).toBe(true);
    });

    it('should handle multiple events', () => {
      let clickCount = 0;
      let changeCount = 0;

      const events = [
        {
          name: 'click',
          handler: () => {
            clickCount++;
          }
        },
        {
          name: 'change',
          handler: () => {
            changeCount++;
          }
        }
      ];

      eventRegister = new EventRegister(element, events);
      
      element.click();
      element.dispatchEvent(new Event('change'));

      expect(clickCount).toBe(1);
      expect(changeCount).toBe(1);
    });

    it('should destroy and remove event listeners', () => {
      let clicked = false;
      const events = [
        {
          name: 'click',
          handler: () => {
            clicked = true;
          }
        }
      ];

      eventRegister = new EventRegister(element, events);
      eventRegister.destroy();
      element.click();

      expect(clicked).toBe(false);
    });
  });
}); 