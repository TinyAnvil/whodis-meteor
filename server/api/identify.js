import { sendResponse, setOptionsHeaders, createAuthCode } from '../_system/utils';
import { createPopcoinUser } from '../popcoin';
import { sendAuthEmail } from '../email';

Router.route('/api/identify', {
  where: 'server'
})

.on('options', function(request, response) {
  setOptionsHeaders(response);
})

.post(function(request, response) {
  const email = request.body.email;
  const auth = request.body.auth;
  let user;

  try {
    check(email, ValidEmail);
    check(auth, Match.Maybe(Match.Where(a => {
      return Users.findOne({
        email: email,
        auth: a
      });
    })));

    user = Users.findOne({email: email});

    // User exists and auth is correct, rock and roll
    if (user && auth) {
      Users.update(user._id, {$set: {
        auth: createAuthCode()
      }});

      sendResponse(this, {
        message: 'User authenticated',
        user: user._id
      });
    } 

    // No user, no auth
    else if (!user && !auth) {
      const auth = createAuthCode();

      user = Users.insert({
        email: email,
        auth: auth
      });

      sendResponse(this, {
        message: 'User created, authentication sent'
      });

      sendAuthEmail(auth, email);

      createPopcoinUser(user);
    }
    
    // User exists, no auth
    else {
      sendResponse(this, {
        message: 'User found, authentication sent'
      });

      sendAuthEmail(user.auth, email);
    }
  } 
  
  catch (err) {
    sendResponse(this, {
      message: err.error ? err.error.message : err.message
    }, err.status === 'error' ? 400 : 402); return;
  }
});
