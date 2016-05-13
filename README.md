# Ember Data Factory Guy

[![Build Status](https://secure.travis-ci.org/danielspaniel/ember-data-factory-guy.png?branch=master)](http://travis-ci.org/danielspaniel/ember-data-factory-guy) [![Ember Observer Score](http://emberobserver.com/badges/ember-data-factory-guy.svg)](http://emberobserver.com/addons/ember-data-factory-guy) [![npm version](https://badge.fury.io/js/ember-data-factory-guy.svg)](http://badge.fury.io/js/ember-data-factory-guy)

Feel the thrill and enjoyment of testing when using Factories instead of Fixtures.  
Factories simplify the process of testing, making you more efficient and your tests more readable.  

**Support for [ember-data-model-fragment](https://github.com/lytics/ember-data-model-fragments) usage is baked in since v2.5.0** 
                                  
Questions: Slack => [factory-guy](https://embercommunity.slack.com/messages/e-factory-guy/)

Contents:
  - [Installation](https://github.com/danielspaniel/ember-data-factory-guy#installation)
  - [How This Works](https://github.com/danielspaniel/ember-data-factory-guy#how-this-works)
  - [Setup](https://github.com/danielspaniel/ember-data-factory-guy#setup)
  - [Defining Factories](https://github.com/danielspaniel/ember-data-factory-guy#defining-factories)
  - [Using Factories](https://github.com/danielspaniel/ember-data-factory-guy#using-factories)
  - [Custom API formats](https://github.com/danielspaniel/ember-data-factory-guy#custom-api-formats)
  - [Sequences](https://github.com/danielspaniel/ember-data-factory-guy#sequences)
  - [Inline Function](https://github.com/danielspaniel/ember-data-factory-guy#inline-functions)
  - [Traits](https://github.com/danielspaniel/ember-data-factory-guy#traits)
  - [Associations](https://github.com/danielspaniel/ember-data-factory-guy#associations)
  - [Extending Other Definitions](https://github.com/danielspaniel/ember-data-factory-guy#extending-other-definitions)
  - [Ember Data Model Fragments](https://github.com/danielspaniel/ember-data-factory-guy#ember-data-model-fragments)
  - [Callbacks](https://github.com/danielspaniel/ember-data-factory-guy#callbacks)
  - [Testing - creating scenarios](https://github.com/danielspaniel/ember-data-factory-guy#testing---creating-scenarios)
  - [Testing models, controllers, components](https://github.com/danielspaniel/ember-data-factory-guy#testing-models-controllers-components)

ChangeLog: ( Notes about what has changed in each version )
  - [Release Notes](https://github.com/danielspaniel/ember-data-factory-guy/releases)

### Installation

 - ```ember install ember-data-factory-guy@2.5.6``` ( ember-data-1.13.5+ )
 - ```ember install ember-data-factory-guy@1.13.2``` ( ember-data-1.13.0 + )
 - ```ember install ember-data-factory-guy@1.1.2``` ( ember-data-1.0.0-beta.19.1 )
 - ```ember install ember-data-factory-guy@1.0.10``` ( ember-data-1.0.0-beta.16.1 )

### Upgrade
 -  remove ember-data-factory-guy from package.json
 - ```npm prune```
 - ```ember install ember-data-factory-guy  ( for latest release )``` 
 
### How this works

  - You create factories for you models.
    - put them in tests/factories directory
  - Then you use them to create models in your tests.
    - You can make records that persist in the store
    - Or you can build a json payload used for mocking an ajax call's payload

[![Thumbnail of Introduction to ember-data-factory-guy](https://i.vimeocdn.com/video/545504017.png?mw=1920&mh=1080)](https://vimeo.com/album/3607049/video/146964694)

### Setup

In the following examples, assume the models look like this:

```javascript
  // standard models
  User = DS.Model.extend({
    name:     DS.attr('string'),
    style:    DS.attr('string'),
    projects: DS.hasMany('project'),
    hats: DS.hasMany('hat', {polymorphic: true})
  });

  Project = DS.Model.extend({
    title:  DS.attr('string'),
    user:   DS.belongsTo('user')
  });

  // polymorphic models
  Hat = DS.Model.extend({
    type: DS.attr('string'),
    user: DS.belongsTo('user')
  });

  BigHat = Hat.extend();
  SmallHat = Hat.extend();
```


### Defining Factories
 - A factory has a name and a set of attributes.
 - The name should match the model type name. So, for 'User' model, the name would be 'user'
 - Create factory files in the tests/factories directory.
 - Can use generator to create the outline of a factory file:
  ```ember g factory user``` This will create a file named user.js in the tests/factories directory.


##### Standard models

- [Sample full blown factory: (user.js)](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/dummy/app/tests/factories/user.js)

```javascript

  // file tests/factories/user.js
  import FactoryGuy from 'ember-data-factory-guy';

  FactoryGuy.define('user', {
    // Put default 'user' attributes in the default section
    default: {
      style: 'normal',
      name: 'Dude'
    },
    // Create a named 'user' with custom attributes
    admin: {
      style: 'super',
      name: 'Admin'
    }
  });

```


##### Polymorphic models

 - Define each polymorphic model in it's own typed definition
 - May want to extend parent factory here
   - See [Extending Other Definitions](https://github.com/danielspaniel/ember-data-factory-guy#extending-other-definitions)

```javascript

  // file tests/factories/small-hat.js
  import FactoryGuy from 'ember-data-factory-guy';

  FactoryGuy.define('small-hat', {
    default: {
      type: 'SmallHat'
    }
  })

  // file tests/factories/big-hat.js
  import FactoryGuy from 'ember-data-factory-guy';

  FactoryGuy.define('big-hat', {
    default: {
      type: 'BigHat'
    }
  })

```

In other words, don't do this:

```javascript
  // file tests/factories/hat.js
  import FactoryGuy from 'ember-data-factory-guy';

  FactoryGuy.define('hat', {
    default: {},
    small-hat: {
      type: 'SmallHat'
    },
    big-hat: {
      type: 'BigHat'
    }
  })

```


### Using Factories

 - FactoryGuy.make
   - Loads model instance into the store
 - FactoryGuy.makeList
   - Loads zero to many model instances into the store
 - FactoryGuy.build
   - Builds json in accordance with the adapters specifications
     - [RESTAdapter](http://guides.emberjs.com/v2.0.0/models/the-rest-adapter/#toc_json-conventions)  (*assume this adapter being used in most of the following examples*)
     - [ActiveModelAdapter](https://github.com/ember-data/active-model-adapter#json-structure)
     - [JSONAPIAdapter](http://jsonapi.org/format/)
 - FactoryGuy.buildList
   - Builds json with list of zero or more items in accordance with the adapters specifications
 - Can override default attributes by passing in an object of options
 - Can add attributes or relationships with [traits](https://github.com/danielspaniel/ember-data-factory-guy#traits)
 - Can compose relationships 
    - By passing in other objects you've made with build/buildList or make/makeList 

##### make/makeList
  - all instances loaded into the ember data store

Usage:

##### make  
```javascript

  import { make } from 'ember-data-factory-guy';
  
  // make basic user with the default attributes in user factory
  let user = make('user');
  user.toJSON({includeId: true}) // => {id: 1, name: 'User1', style: 'normal'}
  
  // make user with default attributes plus those defined as 'admin' in user factory
  let user = make('admin');
  user.toJSON({includeId: true}) // => {id: 2, name: 'Admin', style: 'super'}

  // make user with default attributes plus these extra attributes
  let user = make('user', {name: 'Fred'});
  user.toJSON({includeId: true}) // => {id: 3, name: 'Fred', style: 'normal'}

  // make admin defined user with these extra attributes
  let user = make('admin', {name: 'Fred'});
  user.toJSON({includeId: true}) // => {id: 4, name: 'Fred', style: 'super'}
  
  // make default user with traits and with extra attributes
  let user = make('user', 'silly', {name: 'Fred'});
  user.toJSON({includeId: true}) // => {id: 5, name: 'Fred', style: 'silly'}

  // make user with hats relationship ( hasMany ) composed of a few pre 'made' hats
  let hat1 = make('big-hat');
  let hat2 = make('big-hat');
  let user = make('user', {hats: [hat1, hat2]});
  user.toJSON({includeId: true})  
  // => {id: 6, name: 'User2', style: 'normal', hats: [{id:1, type:"big_hat"},{id:1, type:"big_hat"}]}
  // note that hats are polymorphic. if they weren't, the hats array would be a list of ids: [1,2]

  // make user with company relationship ( belongsTo ) composed of a pre 'made' company
  let company = make('company');
  let user = make('user', {company: company});
  user.toJSON({includeId: true})  // => {id: 7, name: 'User3', style: 'normal', company: 1} 

```

##### makeList
  - check out [(user factory):](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/dummy/app/tests/factories/user.js) to see 'bob' user and 'with_car' trait  

Usage:

```javascript

  import { make, makeList } from 'ember-data-factory-guy';
  
  // Let's say bob is a named type in the user factory
  makeList('bob') // makes 0 bob's

  makeList('bob', 2) // makes 2 bob's

  makeList('bob', 2, 'with_car' , {name: "Dude"})
  // makes 2 bob's that have 'with_car' trait and name of "Dude"
  // In other words, applies the traits and options to every bob made  

  makeList('bob', 'with_car', ['with_car',{name: "Dude"}])
  // 2 User models with bob attributes, where the first also has 'with_car' trait
  // the last has 'with_car' trait and name of "Dude", so you get 2 different bob's
  

```
##### build
  - for building json that you can pass as json payload in [acceptance tests](https://github.com/danielspaniel/ember-data-factory-guy#acceptance-tests)
  - takes same arguments as make 
  - can compose relationships with other build/buildList payloads
  - to inspect the json use the get() method
  - use `.add()` method to include extra sideloaded data to the payload
  
Usage: 

```javascript
  
  import { build, buildList } from 'ember-data-factory-guy';  
  
  // build basic user with the default attributes in user factory
  let json = build('user');
  json.get() // => {id: 1, name: 'User1', style: 'normal'}

  // build user with default attributes plus those defined as 'admin' in user factory  
  let json = build('admin');
  json.get() // => {id: 2, name: 'Admin', style: 'super'}
  
  // build user with default attributes plus these extra attributes
  let json = build('user', {name: 'Fred'});
  json.get() // => {id: 3, name: 'Fred', style: 'normal'}

  // build admin defined user with extra attributes
  let json = build('admin', {name: 'Fred'});
  json.get() // => {id: 4, name: 'Fred', style: 'super'}

  // build default user with traits and with extra attributes
  let json = build('user', 'silly', {name: 'Fred'});
  json.get() // => {id: 5, name: 'Fred', style: 'silly'}

  // build user with hats relationship ( hasMany ) composed of a few pre 'built' hats 
  let hat1 = build('big-hat');
  let hat2 = build('big-hat');
  let json = build('user', {hats: [hat1, hat2]});
  // note that hats are polymorphic. if they weren't, the hats array would be a list of ids: [1,2]
  json.get() // => {id: 6, name: 'User2', style: 'normal', hats: [{id:1, type:"big_hat"},{id:1, type:"big_hat"}]}
  
  // build user with company relationship ( belongsTo ) composed of a pre 'built' company
  let company = build('company');
  let json = build('user', {company: company});
  json.get() // => {id: 7, name: 'User3', style: 'normal', company: 1} 

  // build and compose relationships to unlimited degree
  let company1 = build('company', {name: 'A Corp'});
  let company2 = build('company', {name: 'B Corp'});
  let owners = buildList('user', { company:company1 }, { company:company2 });
  let buildJson = build('property', { owners });

```
- Example of what json payload from build looks like
 - Although the RESTAdapter is being used, this works the same with ActiveModel or JSONAPI adapters

```javascript

  let json = build('user', 'with_company', 'with_hats');
  json // =>
    {
      user: {
        id: 1,
        name: 'User1',
        company: 1,
        hats: [
          {type: 'big_hat', id:1},
          {type: 'big_hat', id:2}
        ]
      },
      companies: [
        {id: 1, name: 'Silly corp'}
      ],
      'big-hats': [
        {id: 1, type: "BigHat" },
        {id: 2, type: "BigHat" }
      ]
    }

```

##### buildList
  - for building json that you can pass as json payload in [acceptance tests](https://github.com/danielspaniel/ember-data-factory-guy#acceptance-tests)
  - takes the same arguments as makeList
  - can compose relationships with other build/buildList payloads
  - to inspect the json use the get() method
    - can use get(index) to get to items in the list
  - use `.add()` method to include extra sideloaded data to the payload
           
Usage: 

```js
  import { build, buildList } from 'ember-data-factory-guy';
  
  let owners = buildList('bob', 2);  // builds 2 Bob's
  
  let owners = buildList('bob', 2, {name: 'Rob'); // builds 2 Bob's with name of 'Rob'
  
  // builds 2 users, one with name 'Bob' , the next with name 'Rob'  
  let owners = buildList('user', { name:'Bob' }, { name:'Rob' });
```

##### Using get() method 
  - for inspecting contents of json payload
    - get() returns all attributes of top level model 
    - get(attribute) gives you attribute in top level model
    - get(index) gives you the info for hasMany relationship at that index
    - get(relationships) gives you just id or type ( if polymorphic )
      - better to compose the build relationships by hand if you need more info
  - check out [user factory:](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/dummy/app/tests/factories/user.js) to see 'boblike' and 'adminlike' user traits

```js 
  let json = build('user');
  json.get() //=> {id: 1, name: 'User1', style: 'normal'}
  json.get('id') // => 1
  
  let json = buildList('user', 2);
  json.get(0) //=> {id: 1, name: 'User1', style: 'normal'}
  json.get(1) //=> {id: 2, name: 'User2', style: 'normal'}
  
  let json = buildList('user', 'boblike', 'adminlike');
  json.get(0) //=> {id: 1, name: 'Bob', style: 'boblike'}
  json.get(1) //=> {id: 2, name: 'Admin', style: 'super'}
```

* building relationships inline
  
```javascript

  let json = build('user', 'with_company', 'with_hats');
  json.get() //=> {id: 1, name: 'User1', style: 'normal'}
  
  // to get hats (hasMany relationship) info
  json.get('hats') //=> [{id: 1, type: "big_hat"},{id: 1, type: "big_hat"}]
  
  // to get company ( belongsTo relationship ) info
  json.get('company') //=> {id: 1, type: "company"}

```

* by composing the relationships you can get the full attributes of those associations

```javascript

  let company = build('company');
  let hats = buildList('big-hats');

  let user = build('user', {company: company, hats: hats});
  user.get() //=> {id: 1, name: 'User1', style: 'normal'}

  // to get hats info from hats json 
  hats.get(0) //=> {id: 1, type: "BigHat", plus .. any other attributes}
  hats.get(1) //=> {id: 2, type: "BigHat", plus .. any other attributes}

  // to get company info
  company.get() //=> {id: 1, type: "Company", name: "Silly corp"}

```

### Custom API formats

FactoryGuy handles JSON-API and RESTSerializer out of the box.
In case your API doesn't follow either of these conventions, you can
still build a custom formatter.

Currently, a custom formatter __must__ implement the following interface:

* `extractId(modelName, payload)`: Tells FactoryGuy where to find the ID of your payload
* `convertForBuild(modelName, payload)`: Transforms a fixture into a JSON payload compatible with your API

```javascript
// tests/acceptance/my_test.js

import Ember from 'ember';
import FactoryGuy from 'ember-data-factory-guy/factory-guy';

const builderClass = Ember.Object.extend({
  extractId(modelName, payload) {
    return payload.id;
  },
  convertForBuild(/* type, payload */) {
    return { convert: 'build' };
  }
});

FactoryGuy.set('fixtureBuilder', builderClass.create());
```

### Sequences

- For generating unique attribute values.
- Can be defined:
    - In the model definition's sequences hash
    - Inline on the attribute
- Values are generated by calling FactoryGuy.generate

##### Declaring sequences in sequences hash

```javascript

  FactoryGuy.define('user', {
    sequences: {
      userName: (num)=> `User${num}`
    },

    default: {
      // use the 'userName' sequence for this attribute
      name: FactoryGuy.generate('userName')
    }
  });

  let json = FactoryGuy.build('user');
  json.get('name') // => 'User1'

  let user = FactoryGuy.make('user');
  user.get('name') // => 'User2'

```

##### Declaring an inline sequence on attribute

```javascript

  FactoryGuy.define('project', {
    special_project: {
      title: FactoryGuy.generate((num)=> `Project #${num}`)
    },
  });

  let json = FactoryGuy.build('special_project');
  json.get('title') // => 'Project #1'

  let project = FactoryGuy.make('special_project');
  project.get('title') // => 'Project #2'

```


### Inline Functions

- Declare a function for an attribute
  - Can reference all other attributes, even id

```javascript

  FactoryGuy.define('user', {
    sequences: {
      userName: (num)=> `User${num}`
    },
    default: { 
      name: FactoryGuy.generate('userName') 
    },
    traits: {
      boringStyle: {
        style: (f)=> `${f.id} boring `
      }
      funnyUser: {
        style: (f)=> `funny ${f.name}`
      }
    }
  });

  let json = FactoryGuy.build('user', 'funny');
  json.get('name') // => 'User1'
  json.get('style') // => 'funny User1'

  let user = FactoryGuy.make('user', 'boring');
  user.get('id') // => 2
  user.get('style') // => '2 boring'

```

*Note the style attribute was built from a function which depends on the name
 and the name is a generated attribute from a sequence function*


### Traits
- Used with build, buildList, make, or makeList
- For grouping attributes together
- Can use one or more traits in a row
 - The last trait included overrides any values in traits before it

```javascript

  FactoryGuy.define('user', {
    traits: {
      big: { name: 'Big Guy' }
      friendly: { style: 'Friendly' }
    }
  });

  let json = FactoryGuy.build('user', 'big', 'friendly');
  json.get('name') // => 'Big Guy'
  json.get('style') // => 'Friendly'

  let user = FactoryGuy.make('user', 'big', 'friendly');
  user.get('name') // => 'Big Guy'
  user.get('style') // => 'Friendly'

```

You can still pass in a hash of options when using traits. This hash of
attributes will override any trait attributes or default attributes

```javascript

  let user = FactoryGuy.make('user', 'big', 'friendly', {name: 'Dave'});
  user.get('name') // => 'Dave'
  user.get('style') // => 'Friendly'

```


### Associations

- Can setup belongsTo or hasMany associations in factory definitions
    - As inline attribute definition
    - With traits
- Can setup belongsTo or hasMany associations manually 
  - With [build](https://github.com/danielspaniel/ember-data-factory-guy#build) / [buildList](https://github.com/danielspaniel/ember-data-factory-guy#buildlist) and [make](https://github.com/danielspaniel/ember-data-factory-guy#make) / [makeList](https://github.com/danielspaniel/ember-data-factory-guy#makelist) 
    - Can compose relationships to any level 

##### Setup belongsTo associations in Factory Definition

```javascript
  // Recall ( from above setup ) that there is a user belongsTo on the Project model
  // Also, assume 'user' factory is same as from 'user' factory definition above in
  // 'Defining Factories' section
  FactoryGuy.define('project', {

    project_with_user: {
      // create user model with default attributes
      user: {}
    },
    project_with_bob: {
      // create user model with custom attributes
      user: {name: 'Bob'}
    },
    project_with_admin: {
      // create a named user model with the FactoryGuy.belongsTo helper method
      user: FactoryGuy.belongsTo('admin')
    }
  });

  let project = FactoryGuy.make('project_with_admin');
  project.get('user.name') // => 'Admin'
  project.get('user.style') // => 'super'

```

*You could also accomplish the above with traits:*

```javascript

  FactoryGuy.define('project', {
    traits: {
      with_user: { user: {} },
      with_admin: { user: FactoryGuy.belongsTo('admin') }
    }
  });

  let user = FactoryGuy.make('project', 'with_user');
  project.get('user').toJSON({includeId: true}) // => {id:1, name: 'Dude', style: 'normal'}

```


##### Setup belongsTo associations manually
  - See [build](https://github.com/danielspaniel/ember-data-factory-guy#build) / [buildList](https://github.com/danielspaniel/ember-data-factory-guy#buildlist) and [make](https://github.com/danielspaniel/ember-data-factory-guy#make) / [makeList](https://github.com/danielspaniel/ember-data-factory-guy#makelist) for more ideas 

```javascript
  let user = FactoryGuy.make('user');
  let project = FactoryGuy.make('project', {user: user});

  project.get('user').toJSON({includeId: true}) // => {id:1, name: 'Dude', style: 'normal'}
```

*Note that though you are setting the 'user' belongsTo association on a project,
the reverse user hasMany 'projects' association is being setup for you on the user
( for both manual and factory defined belongsTo associations ) as well*

```javascript
  user.get('projects.length') // => 1
```



##### Setup hasMany associations in Factory Definition

``` javascript
  FactoryGuy.define('user', {
    user_with_projects: { projects: FactoryGuy.hasMany('project', 2) }
  });

  let user = FactoryGuy.make('user_with_projects');
  user.get('projects.length') // => 2

```

*You could also accomplish the above with traits:*

```javascript

  FactoryGuy.define('project', {
    traits: {
      with_projects: {
        projects: FactoryGuy.hasMany('project', 2)
      }
    }
  });

  let user = FactoryGuy.make('user', 'with_projects');
  user.get('projects.length') // => 2

```

##### Setup hasMany associations manually
  - See [build](https://github.com/danielspaniel/ember-data-factory-guy#build) / [buildList](https://github.com/danielspaniel/ember-data-factory-guy#buildlist) and [make](https://github.com/danielspaniel/ember-data-factory-guy#make) / [makeList](https://github.com/danielspaniel/ember-data-factory-guy#makelist) for more ideas
  
```javascript
  let project1 = FactoryGuy.make('project');
  let project2 = FactoryGuy.make('project');
  let user = FactoryGuy.make('user', {projects: [project1,project2]});
  user.get('projects.length') // => 2

  // or
  let projects = FactoryGuy.makeList('project', 2);
  let user = FactoryGuy.make('user', {projects: projects});
  user.get('projects.length') // => 2

```

*Note that though you are setting the 'projects' hasMany association on a user,
the reverse 'user' belongsTo association is being setup for you on the project
( for both manual and factory defined hasMany associations ) as well*

```javascript
  projects.get('firstObject.user')  // => user
```



### Extending Other Definitions
  - Extending another definition will inherit these sections:
    - sequences
    - traits
    - default attributes
  - Inheritance is fine grained, so in each section, any attribute that is local
    will take precedence over an inherited one. So you can override some
    attributes in the default section ( for example ), and inherit the rest

  - [Sample Factory using inheritance (big-group.js):](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/dummy/app/tests/factories/big-group.js)

### Ember Data Model Fragments
As of 2.5.2 you can create factories which contain [ember-data-model-fragments](https://github.com/lytics/ember-data-model-fragments). Setting up your fragments is easy and follows the same process as setting up regular factories. The mapping between fragment types and their associations are like so:

Fragment Type | Association
--- | ---
`fragment` | `FactoryGuy.belongsTo`
`fragmentArray` | `FactoryGuy.hasMany`
`array` | `[]`

For example, say we have the following `Employee` model which makes use of the `fragment`, `fragmentArray` and `array` fragment types.

```javascript
//Employee model
export default Model.extend({
  name      : fragment('name'),
  phoneNumbers: fragmentArray('phone-number')
})

//Name fragment
export default Fragment.extend({
  titles: array('string'),
  firstName : attr('string'),
  lastName  : attr('string')
});

//Phone Number fragment
export default Fragment.extend({
  number: attr('string')
  type: attr('string')
});
```

A factory for this model and its fragments would look like so:

```javascript
// Employee factory
FactoryGuy.define('employee', {
  default: {
    name: FactoryGuy.belongsTo('name'), //fragment
    phoneNumbers: FactoryGuy.hasMany('phone-number') //fragmentArray
  }
});

// Name fragment factory
FactoryGuy.define('employee', {
  default: {
    titles: ['Mr.', 'Dr.'], //array
    firstName: 'Jon',
    lastName: 'Snow'
  }
});

// Phone number fragment factory
FactoryGuy.define('phone-number', {
  default: {
    number: '123-456-789',
    type: 'home'
  }
});
```

For a more detailed example of setting up fragments have a look at the [employee test](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/unit/models/employee-test.js).

### Callbacks
 - afterMake
  - Uses transient attributes

Assuming the factory-guy model definition defines afterMake function:

```javascript
  FactoryGuy.define('property', {
    default: {
      name: 'Silly property'
    },

    // optionally set transient attributes, that will be passed in to afterMake function
    transient: {
      for_sale: true
    },

    // The attributes passed to after make will include any optional attributes you
    // passed in to make, and the transient attributes defined in this definition
    afterMake: function(model, attributes) {
      if (attributes.for_sale) {
        model.set('name', model.get('name') + '(FOR SALE)');
      }
    }
  }
```

You would use this to make models like:

```javascript
  Ember.run(function () {

    let property = FactoryGuy.make('property');
    property.get('name'); // => 'Silly property(FOR SALE)')

    let property = FactoryGuy.make('property', {for_sale: false});
    property.get('name'); // => 'Silly property')
  });

```

### Testing - Creating Scenarios
- Easy to create complex scenarios involving multi layered relationships.
  - Can use model instances to create relationships for making other models.
  
Example:

  - Setup a scenario where a user has two projects and belongs to a company

```javascript
   let company = make('company');
   let user = make('user', {company: company});
   let projects = makeList('project', 2, {user: user});
```

*You can use traits to help create the relationships as well, but this strategy allows you to
build up complex scenarios in a different way that has it's own benefits.*

####cacheOnlyMode
- FactoryGuy.cacheOnlyMode
  - Allows you to setup the adapters to prevent them from fetching data with ajax call 
    - for single models ( find ) you have to put something in the store
    - for collections ( findAll ) you don't have to put anything in the store.
  - Takes `except` parameter as a list of models you don't want to cache. 
    - These model requests will go to server with ajax call and need to be mocked.
   
This is helpful, when: 
  - you want to set up the test data with make/makeList, and then prevent
    calls like store.find or findAll from fetching more data, since you have 
    already setup the store with make/makeList data. 
  - you have an application that starts up and loads data that is not relevant
    to the test page you are working on. 

Usage:

```javascript
import FactoryGuy, { makeList } from 'ember-data-factory-guy';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Profiles View');

test("Using FactoryGuy.cacheOnlyMode", function() {
  FactoryGuy.cacheOnlyMode();
  // the store.find call for the user will go out unless there is a user
  // in the store
  make('user', {name: 'current'});
  // the application starts up and makes calls to findAll a few things, but
  // those can be ignored because of the cacheOnlyMode
  
  // for this test I care about just testing profiles
  makeList("profile", 2);

  visit('/profiles');

  andThen(()=> {
    // test stuff
  });
});

test("Using FactoryGuy.cacheOnlyMode with except", function() {
  FactoryGuy.cacheOnlyMode({except: ['profile']});

  make('user', {name: 'current'});
  
  // this time I want to allow the ajax call so I can return built json payload
  mockFindAll("profile", 2);

  visit('/profiles');

  andThen(()=> {
    // test stuff
  });
});
```
  
### Testing models, controllers, components

- FactoryGuy needs to setup the factories before the test run.
  - use manualSetup function to set up FactoryGuy in unit/component tests

- [Sample model test (profile-test.js):](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/unit/models/profile-test.js)
  - Use 'moduleForModel' ( ember-qunit ), or describeModel ( ember-mocha ) test helper
  - manually set up Factory guy 
  
- [Sample component test #1 (single-user-manual-setup-test.js):](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/components/single-user-manual-setup-test.js)
  - Using 'moduleForComponent' ( ember-qunit ), or describeComponent ( ember-mocha ) helper
  - Manually sets up Factory guy ( so it's faster )

  ```javascript
  import { make, manualSetup }  from 'ember-data-factory-guy';
  import hbs from 'htmlbars-inline-precompile';
  import { test, moduleForComponent } from 'ember-qunit';
  
  moduleForComponent('single-user', 'Integration | Component | single-user (manual setup)', {
    integration: true,
  
    beforeEach: function () {
      manualSetup(this.container);
    }
  });
          
  test("shows user information", function () {
    let user = make('user', {name: 'Rob'});
  
    this.render(hbs`{{single-user user=user}}`);
    this.set('user', user);
  
    ok(this.$('.name').text().match(user.get('name')));
    ok(this.$('.funny-name').text().match(user.get('funnyName')));
  });
  ```

- [Sample component test #2 (single-user-test.js):](https://github.com/danielspaniel/ember-data-factory-guy/blob/master/tests/components/single-user-test.js)
  - Using 'moduleForComponent' ( ember-qunit ), or describeComponent ( ember-mocha ) helper
  - Starts a new application with startApp() before each test  ( slower )
