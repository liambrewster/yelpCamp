<img src="https://github.com/liambrewster/liambrewster/raw/main/image/LB%20Dev%20Logo.png" width="150" height="150">

# YELP CAMP

Yelp Camp is the final project requirement for the [Web Developer Bootcamp by Colt Steele](https://www.udemy.com/course/the-web-developer-bootcamp/).

## Built With
- [Mongodb](https://www.mongodb.com/)
- [Express JS](https://expressjs.com/)
- [Node JS](https://nodejs.org/en/)

## Installation

if you dont have the project already, from your terminal:
```bash
git clone https://github.com/liambrewster/yelpCamp
```
>This Command  will copy a full  project  to your local  environment

Install the node modules with: 
```bash
npm install yelpCamp 
```
or from within your package.json file open the terminal and run 
```bash
npm install.
```
to then run the server from within your package.json file pen the terminal and run 
```bash
npm start.
```
this should confirm you have started and now running on localhost

## Folder Structure
    .
    ├── cloudinary              //logic to store images in the cloud
    ├── controllers             // all logic for each part
    ├── models                  // info for the schemas
    ├── public                  //reuseable JS or CSS files stored here
    ├── routes                  //route details
    ├── seeds                   //logic to populate database with see data here                   
    ├── utils                   //error files stored here
    ├── views                   // all view templates for rendering stored here
    ├── .gitignore
    ├── readme.md
    ├── app.js
    ├── middleware.js
    ├── schemas.js
    └── package.json
    └── package-lock.json
    

## Project Status
Bootcamp Complete But Still Adding Additional Features 🚀

## Additional Feature above the Tutorial
- Telegram Integration - i have added a telegram bot that will send a message to a group chat for evey New Campground, User & review but also when any of those are deleted.
- Added Created At & Updated At features to the Scheme for future tracking and visibility of when a users signs up etc