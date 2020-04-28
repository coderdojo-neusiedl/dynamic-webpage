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


//                COMMANDS
/**
 * Triggers the server to increment to counter.
 *
 * provided data have no effect on the result of the operation
 *
 */
webapp.shared.topics.INCREMENT_COUNTER = '/shared/counter/increment';
