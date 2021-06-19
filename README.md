
<p align="center">
  <img src="https://user-images.githubusercontent.com/39219943/122637351-c3843900-d10b-11eb-980e-a3ecd1004960.PNG" height="100" alt="Pictionary image"/>
</p>


# Pictionary

[**Pictionary**](https://pictionary-game.netlify.app/) is free multipleyer drawing and guessing game.

 A game consists of a few rounds in which every round someone has to draw their chosen word and others have to guess it to gain points! Players with the highest scores are the winners at the end of the game.

[Play now!](https://pictionary-game.netlify.app/)

## A Demo of the app
https://user-images.githubusercontent.com/39219943/122636633-e280cc00-d107-11eb-9923-62819cfe8470.mp4

## Features

* Play with your friends in a private room or other users in public game.
* Tweak the game according to your likings, and your own custom words.
* A refreshing new UI and dark mode support
* If you get disconnected from a game you will not loose your score just rejoin again and continue
* The best part is Its Free and there are NO ADS!

I took inspiration from [skribbl.io](https://skribbl.io/) to make this project, however I have added a bunch new stuff in addition to what scribble offers like a new ui, dark mode, ability to preserve scores if disconnected and the best part there are no ads!

## Setup and run locally

If you want to run this project locally continue reading

Few things to know abotu the technology stack used in the project:
* The application uses [Elixir](https://elixir-lang.org/) for the backend server and [react js](https://reactjs.org/) for the frontend application.
* There is no database, all data is stored in an in memory database thats comes with elixir called [ETS](https://elixirschool.com/en/lessons/specifics/ets/) and will be lost when the backend server is stopped.

### Setup using Docker

WIP

### Setup manually

* Make sure you have [elixir](https://elixir-lang.org/install.html) and [npm](https://www.npmjs.com/get-npm) installed
* Clone this project
* `cd` into project directory and install dependencies by running `mix deps.get` and finally start the backend server by running `mix phx.server`
* Next cd into the `pictionary-app` directory and install dependencies by running `npm install` and start the front end application by running `npm start` 
* Enjoy!


