# SlapSticker Project


## Project Description
Hello, and welcome to my app. This is SlapStick.er, a single page app made mostly in javascript. The idea behind the page, is to make a site where users can draw their own stickers, then buy and sell drawn stickers with other users. I decided to make this page as practice for javascript and front-end web design in general. As this is something focused on the front-end, I decided to make something artsy!


## Technologies Used
* JavaScript
* Ruby on Rails
* Paper.css
* Jscolor


## Installation
* First, clone the repo to your machine
* Then navigate to the repo in your terminal, and then to the folder called  `slap-sticker-backend`
* Run `bundle install` to get any gems, then run  `rails s`
* Then navigate up to the root directory, then down into  `slap-sticker-frontend`
* Finally run  `open index.html`


## Schema
The model relationships for this project are pretty simple. An image belongs to the user that drew it. Users also have many other images through purchases.


## User Stories
* A user can log in (through a very simple login)
* A user can draw a new image and save and load their image at any time
* A user can see in their gallery all the images they've drawn and then open them back up in the canvas
* A user can mark an image as for sale and put it up in the store with a price they set
* A user can buy other stickers, and look at their collection


## Walkthrough of Page Functionality

When you load up the page, you will first be met with a login screen. This is a really basic login, so you just need to put in a username. If a user with that name exists in the database, you will gain access to their profile. If not, you will create a new instance and use that. Then it will automatically take you to the gallery page. If the account has any images, they will show up here. Attatched to them are text descriptions, and links to eidt or delete them. The delete button does what it says it does, and the edit button loads up the canvas with that image already attached. 


At the top of the page is the header. There are buttons with links to the gallery, store page, and sticker collection of the user. There is also a button to logout and return to the login screen, and a button to start up a new image. This will take you to the canvas with no image loaded.


The canvas 



## Challenges Faced