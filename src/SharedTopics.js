/* global webapp, assertNamespace */

require('./NamespaceUtils.js');

assertNamespace('webapp.shared.topics');

//                PUBLICATIONS

/**
 * The server publishes on this topic the current value of the counter.
 *
 * example of such a counter value: 14

 */
webapp.shared.topics.COUNTER = '/shared/counter';

webapp.shared.topics.ACTUALLYNOTATHOME = '/shared/actuallynotathome';


//                COMMANDS

/**
 * Triggers the server to increment to counter.
 *
 * provided data have no effect on the result of the operation
 *
 */
webapp.shared.topics.INCREMENT_COUNTER = '/shared/counter/increment';

/**
 * Informs the server that a client wants to send a message to the other clients.
 *
 * The data is an object containing the values (keys):
 *
 * - name      : string    the name of the client
 * - message   : string    the message the client wants to send
 *
 * example data: { 'name': 'Thomas', 'message': 'hello world!'}
 */
webapp.shared.topics.CHAT_MESSAGE = '/shared/chatmessage';
/**
 * Informs the server that a client wants to send a message to the other clients.
 *
 * The data is an object containing the values (keys):
 *
 * - name      : string    the name of the client
 * - message   : string    the message the client wants to send
 *
 * example data: { 'name': 'Thomas', 'message': 'hello world!'}
 */
webapp.shared.topics.CHAT_BROADCAST = '/shared/chat_broadcast';


webapp.shared.topics.NOT_ATHOME = '/shared/not_athome';