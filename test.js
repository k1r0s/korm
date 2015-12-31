/**
 * Created by ciroreed on 12/8/15.
 */
var test = function (mapper) {

    var modelArray = [
        {
            uid: 'person',
            defaults: {
                name: '',
                age: 0,
                address: '',
                timestamp: ''
            }
        },
        {
            uid: 'car',
            defaults: {
                brand: '',
                model: '',
                cv: 0,
                timestamp: ''
            }
        }
    ];

    var print = function (arr) {
        console.log('print query result:');
        console.log(arr);
    };

    var postCreation = function (tables) {
        console.log('Table list: ');
        console.log(tables);

        mapper.read({entity: 'person', type: 'collection'}, print);
        mapper.read({entity: 'car', type: 'collection'}, print);
    };

    var fillTables = function () {

        console.log('Tables creation done!');

        console.log('Fill table person...');
        mapper.create({entity: 'person', subject: {name: 'Jon Doe', age: 25, address: 'some street, 13'}});
        mapper.create({entity: 'person', subject: {name: 'Kane Del', age: 45, address: 'in the wall, 34'}});

        console.log('Fill table car...');
        mapper.create({entity: 'car', subject: {brand: 'Opel', model: 'Corsa', cv: 92 }});
        mapper.create({entity: 'car', subject: {brand: 'Renault', model: 'Clio', cv: 60 }});


        mapper.list(postCreation);

    };

    mapper.connect('./dbtest');

    console.log('Removing all tables...');
    mapper.dropTables(modelArray);

    console.log('Creating tables...');
    mapper.createTables(modelArray, fillTables);

}(require('./index.js'));







