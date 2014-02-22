module.exports.register = function(Handlebars, options) {
  Handlebars.registerHelper('obj_val', function(object, property) {
    return object ? object[property] : property;
  });

  Handlebars.registerHelper('json_to_str', function(object) {
    return JSON.stringify(object);
  });

  Handlebars.registerHelper('get', function(object/* ... */) {
    for (var i = 1; i < arguments.length - 1; i++) {
      if (object.hasOwnProperty(arguments[i])) {
        object = object[arguments[i]];
      } else {
        return 'null';
      }
    }
    if (typeof(object) === 'string') {
      return object;
    } else {
      return JSON.stringify(object);
    }
  });

  Handlebars.registerHelper('eachReverse', function(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
        for (var i = context.length - 1; i >= 0; i--) {
            ret += options.fn(context[i]);
        }
    } else {
        ret = options.inverse(this);
    }

    return ret;
  });

  Handlebars.registerHelper('objContains', function(obj, key, content) {
    if (obj.hasOwnProperty(key)) {
      return content.fn(this);
    } else {
      return content.inverse(this);
    }
  });
};
