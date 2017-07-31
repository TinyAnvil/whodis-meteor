Iron.Route.prototype.on = function(method, fn) {
  // track the method being used for OPTIONS requests.
  this._methods[method] = true;

  this._actionStack.push(this._path, fn, {
    // give each method a unique name so it doesn't clash with the route's
    // name in the action stack
    name: this.getName() + '_' + method.toLowerCase(),
    method: method,

    // for now just make the handler where the same as the route, presumably a
    // server route.
    where: this.handler.where,
    mount: false
  });

  return this;
}

Router.route('/download', (request, response) => {
  response.writeHead(302, {
    'Location': Meteor.settings.download
  });

  return response.end();
}, {
  where: 'server'
});
