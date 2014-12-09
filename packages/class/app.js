'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Class = new Module('class');

Class.angularDependencies(['angularFileUpload', 'focusOn', 'ui.calendar']);

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Class.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Class.routes(app, auth, database);

    Class.menus.add({
        title: 'Announcements',
        link: 'announcements',
        roles: ['authenticated'],
        menu: 'main'
    });

    Class.menus.add({
        title: 'Classes',
        link: 'class',
        roles: ['authenticated', 'student', 'admin', 'instructor'],
        menu: 'main'
    });

    Class.menus.add({
        title: 'My classes',
        link: 'my class',
        roles: ['admin', 'student', 'instructor'],
        menu: 'main'
    });

    //We are adding a link to the main menu for all authenticated users
    Class.menus.add({
        title: 'Create class',
        link: 'create class',
        roles: ['admin'],
        menu: 'main'
    });
    Class.aggregateAsset('css', 'class.css');

    return Class;
});
