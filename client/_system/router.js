Blaze._allowJavascriptUrls();

Router.configure({
  layoutTemplate: 'app',
  loadingTemplate: 'loading',
  notFoundTemplate: '404'
});

Router.route('/', {
  name: 'home'
});