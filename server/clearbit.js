import { removeEmpty } from './_system/utils';
import Future from 'fibers/future';

const clearbit = require('clearbit')(Meteor.settings.clearbit);

export function getEmail(email) {
  const future = new Future;
  
  clearbit.Enrichment.find({
    email: email,
    stream: true
  })
  .then(person => {
    future.return(removeEmpty(person));
  })
  .catch(err => {
    future.throw(err);
  });

  return future.wait();
}