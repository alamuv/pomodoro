# README

A deployed version of this app can be found at [http://pomodoro-rftd.herokuapp.com].

## Getting started
**Note:** Ensure that you are running `Node v6.1.0` as the code uses some ES6 syntax
- Run `npm install`
- Run `bower install`
- Run `npm start`

## Technology
This project is built on the MEAN (MongoDB, Express, AngularJS, Node.js) stack. These technologies were chosen for the reasonse listed below:
- **MongoDB:**
  - Lack of relational data eliminates one of the primary advantages of SQL databaes (E.g., ability to do complex joins)
  - Strong integration with Node.js/Express via Mongoose
  - Schemaless design allows for flexibility if the definition of a 'task' or pomodoro changes in the future
  - **Note:** A major downside of MongoDB, aside from it's inability to handle relational data, is that it is not ACID compliant. As such, many of the features around data integrity that are commonplace with SQL databases may not be present in MongoDB. That being said, for applications that don't require the highest levels of data integrity (e.g., a to-do list app), the benefits of MongoDB will often outweight the downsides.
- **Node.js/Express**
  - Javascript's eventloop allows Node.js to handle API requests and DB reads/write asynchronously.
  - NPM provides a robus package ecosystem that prevents one from 'reinventing the wheel'. Packages used in this project include bcrypt, body-parser, cookie-parser, and mongoose.
  - **Note:** for apps that require significant 'heavy lifting' on the backend, Node.js may not be the best options. However, for simple API servers, such as the one used here, Node.js works very well
- **AngularJS**
  - AngularJS' use of two-way databinding allows for highly interactive UIs where user input is required frequently. This works well for a to-do list app that requires regular creation/update/deletion of tasks by the user.
  - **Note:** For apps that require more significant DOM updates or have more complex state, React/Redux may be a better option due to (1) React's use of a Virtual DOM and (2) Redux's preference for immutable state.

## Architecure
This application makes use of a simple REST API. The API has 4 main routes for getting, creating, updating, and deleting tasks.
![Architecture Diagram](http://i.imgur.com/kiLIiyw.png)

## Serverside unit tests
This repository includes basic serverside unit tests.
- Run `npm test`

## Additional notes
- This application does not make use of SSL when sending usernames and passwords to the server. For a production-grade application, this would, obviously be a major security concern. However, I felt it was a reasonable compromise for a 'proof-of-concept' app
- A significant amount of ES6 has been used in writing this app. For the backend, ensure that you are running `Node v6.1.0`. For the frontend, run `grunt` (ensure you have the `grunt-cli` installed) after making any changes (the transpiled versions of the frontend javascript files will be saved in the `dist` folder)
