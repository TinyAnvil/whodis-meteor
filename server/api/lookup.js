import { sendResponse, setOptionsHeaders } from '../_system/utils';
import { getEmail } from '../clearbit'
import { chargePopcoinUser } from '../popcoin';

Router.route('/api/lookup', {
  where: 'server'
})

.on('options', function(request, response) {
  setOptionsHeaders(response);
})

.get(function(request, response) {
  const user = request.headers['whodis-user'];
  const email = request.query.email;

  try {
    check(email, ValidEmail);
    check(user, Match.Where(u => {
      return Users.findOne({_id: u});
    }));

    chargePopcoinUser(user);

    sendResponse(this, {
      data: getEmail(email)
    });
  } 
  
  catch (err) {
    if (err.status === 'process') {
      sendResponse(this, err.error ? err.error : err, 402);
    } else {
      sendResponse(this, {
        message: err.error ? err.error.message : err.message
      }, 400);
    }

    return;
  }
});
