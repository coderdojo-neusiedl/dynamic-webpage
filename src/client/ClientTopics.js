/* global webapp, assertNamespace */

assertNamespace('webapp.client.topics');

//                COMMANDS
/**
 * Adds items to the invoice. The data of the command is an array of items.
 * Each item is an object containing the values (keys):
 *
 * - name      : string    the name describing the item
 * - price     : number    the price of this product
 *
 * example of such a item: {"name":"in vitro flask","price":10}
 */
webapp.client.topics.ADD_ITEMS_TO_INVOICE_COMMAND = '/client/invoice/addItemsCommand';

//                PUBLICATIONS

/**
 * The client publishes on this topic an array of all items in the invoice. 
 * Each item is an object containing the values (keys):
 *
 * - name      : string    the name describing the item
 * - price     : number    the price of this item
 *
 * example of such an item: {"name":"in vitro flask","price":10}

 */
webapp.client.topics.INVOICE_ITEMS = '/client/invoice/items';
