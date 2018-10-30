'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const functions = new Map();

    return {

        addEvent: function (event, context, handler, { times, frequency }) {
            if (!functions.has(event)) {
                functions.set(event, new Map());
            }
            if (!functions.get(event).has(context)) {
                functions.get(event).set(context, []);
            }
            if (frequency <= 0) {
                frequency = 1;
            }
            if (times <= 0) {
                times = Infinity;
            }
            functions.get(event).get(context)
                .push({
                    handler: handler,
                    times: times,
                    frequency: frequency,
                    count: 0
                });
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {this}
         */
        on: function (event, context, handler) {
            this.addEvent(event, context, handler, { times: 0, frequency: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            Array.from(functions.keys()).forEach(eventName => {
                if (eventName === event || eventName.startsWith(event + '.')) {
                    functions.get(eventName).delete(context);
                }
            });

            return this;
        },

        handleEvent: function (context, handlerData) {
            if (handlerData.count >= handlerData.times ||
                handlerData.count % handlerData.frequency !== 0) {
                handlerData.count++;

                return;
            }
            handlerData.count++;
            handlerData.handler.call(context);
        },

        handleEmit: function (event) {
            if (!functions.has(event)) {
                return;
            }
            Array.from(functions.get(event).entries()).forEach(([key, val]) => {
                val.forEach(handlerData => {
                    this.handleEvent(key, handlerData);
                });
            });
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            let eventName = '';
            let eventNames = [];
            event.split('.').forEach(group => {
                if (eventName !== '') {
                    eventName += '.';
                }
                eventName += group;
                eventNames.push(eventName);
            });
            eventNames.reverse();
            eventNames.forEach(newEvent => {
                this.handleEmit(newEvent);
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {this}
         */
        several: function (event, context, handler, times) {
            this.addEvent(event, context, handler, { times: times, frequency: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            this.addEvent(event, context, handler, { times: 0, frequency: frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
