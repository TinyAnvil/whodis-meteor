import Future from 'fibers/future';

export function createPopcoinUser(user) {
  user = Users.findOne({_id: user});

  const future = new Future;

  HTTP.post('https://popcoin.ws/api/identify', {
    headers: {
      authorization: `Bearer ${Meteor.settings.popcoin}`
    },
    data: {
      user: user._id,
      email: user.email
    }
  }, (err, res) => {
    if (err) {
      future.throw(res.data);
    } else {
      future.return(res.data);
    }
  });

  return future.wait();
}

export function chargePopcoinUser(user) {
  const future = new Future;

  HTTP.post('https://popcoin.ws/api/spend', {
    headers: {
      authorization: `Bearer ${Meteor.settings.popcoin}`
    },
    data: {
      user: user,
      amount: 10
    }
  }, (err, res) => {
    if (err) {
      future.throw(res.data);
    } else {
      future.return(res.data);
    }
  });

  return future.wait();
}