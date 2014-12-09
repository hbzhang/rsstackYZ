'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Fuse = new Module('fuse');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Fuse.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Fuse.routes(app, auth, database);

    Fuse.menus.add({
        title: 'Activity',
        link: 'create activity',
        roles: ['authenticated'],
        menu: 'main'
    });

    return Fuse;
});
