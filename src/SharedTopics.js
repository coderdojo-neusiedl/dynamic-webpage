/* global webapp, assertNamespace */

require('./NamespaceUtils.js');

assertNamespace('webapp.shared.topics');

//                PUBLICATIONS

/**
 * The server publishes on this topic the current list of addresses that were not at home.
 *
 * example: [{"street":"Hauptstraße","number":"33","creationTimestamp":1590331561740,"id":2},{"street":"Seestraße","number":"11","creationTimestamp":1590331617982,"id":3}]
 */
webapp.shared.topics.ACTUALLYNOTATHOME = '/shared/actuallynotathome';


//                COMMANDS

/**
 * Informs the server that a client wants to send a message to the other clients.
 *
 * The data is an object containing the values (keys):
 *
 * - name      : string    the name of the client
 * - message   : string    the message the client wants to send
 *
 * example data: {"name":"Thomas","message":"Hello world!"}
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
 * example data: {"name":"Thomas","message":"Hello world!"}
 */
webapp.shared.topics.CHAT_BROADCAST = '/shared/chat_broadcast';

/**
 * Informs the server that a client wants to add another address to the list of addresses that were not at home.
 *
 * The data is an object containing the values (keys):
 *
 * - street : string    the name of the street (e.g. 'Hauptstrasse')
 * - number : string    the number of the house or flat (e.g. '10', '33/7')
 *
 * example data: {'street': 'Hauptstrasse', 'number': '23'}
 */
webapp.shared.topics.ADD_ADDRESS_TO_NOT_AT_HOME_LIST = '/shared/addToNotAtHome';