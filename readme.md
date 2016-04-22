# PDF Creation and saving engine for JustFix.nyc

## Overview
Hullo! So the purpose of this service is to aid <a href="http://justfix.nyc">JustFix.nyc</a>'s PDF creation. If something's falling apart, it's easier to have these concerns separated out, so there's less crossover/browser concerns. Keeping this in a separate repository will also allow for easier development, scalability, and deployment. Main points to consider are the PhantomJS script commands, which execute via Node's Child Process command. This package's name is phantomjs-prebuilt, which can be switched out to the phantom package at some point depending on how this server slows down (more native control over keeping phantom alive as opposed to closing it every time, as we must right now). 

## Architecture
This is built with the idea of a self contained micro-to-regular-sized-service in mind. As such, it operates under the SRC (Service Routes Controller) communication standards:

### Config/
This is where we save our configuration variables. Right now, our dev environment/live environment are almost interchangeable, so there's not a lot going on here. As this gets passed around, developers should save all keys/environments/etc setups here.

### Temp/
This should be an empty directory. We're stashing our files here before pushing them up to AWS, but that AWS service OR IDEALLY THE CONTROLLER should remove that file after aws finishes it's thing. God damn callbacks. Promises FTW.

### App/
This is where our app lives. All files that actually compile and build the various parts of our PDF live here. Normally, this would hold the backend services and connections to our database, but since this whole thing should be acting like a backend service, there's no real publicly visible interface, and there's no DB necessary, all our SRC divisions will go.

### /Controllers
Our controllers are the middlemen between the calls on the routes and the heavy lifting of the Services. So ideally, a route calls a Controller, which takes that data, and modifies it/augments it to whatever additional calls may be necessary. If there's nothing else that has to be done at this stage, the Controller should just respond to the Route call with the transformed/updated stuff. Otherwise, the controller will take that modified service, and pass that data along to the required Service file (PDF or AWS). It should then, IN THEORY, listen for that file to finish executing and hand the response back to the Route that called it but Async's hard and I'm kinda dumb so sometimes our service passes the response directly to the Route.

### /Routes
Our router's a pretty generic ExpressJS router. This should take requests to our service, then pass that data directly to the corresponding controller. This should never directly engage with our services, since they're external calls and need modifications by the Controllers.

### /Services
Services are agnostic outside calls, that can be called by any of the pdf generation controllers. These help cut down our DRY code, and enable us to reuse these modules in a much more free pattern. Ideally, refactoring the PhantomJS call would help reduce some overhead, especially with the newer phantom npm package. These service calls should remain as "dumb" as possible, and also try and follow a more function driven programming paradigm. 

### /Templates
These are our raw templates, which should be populated in the controllers with the data from the Route calls. These aren't services because they're not true executable files, but instead are only dummy HTML data. Our current template engine is Handlebars, but if we need something else we can adjust accordingly.

### /Styles
Our CSS files which should be included in the Template head. Just include it as a standard html css link, don't be fancy. Or a hero. Especially not a fancy hero. Should be one for each template, depending on how each PDF is styled. Repeating code in this instance is better than the confusion of multiple CSS files included in each template head -- remember, we're only using this to do a general layout so our PDF engine renders it's pages correctly.

## Wrap Up
Only calls available on this end service are on the raw / endpoint. As of right now, a post request here will return a url, which then can be saved to the user. Planned functionality can also include listing sets of urls, should we desire that. Current location is http://pdf-microservice.herokuapp.com

Woo! Obviously there's going to be some overlap, confusion, and might require some cleanup and clarification in terms of what we're expecting and how it's actually going down. Please let me know if you run into any issues or have any questions or comments, I'm available at matt.l.egan@gmail.com. This service was HEAVILY inspired by <a href="http://www.feedhenry.com/server-side-pdf-generation-node-js/">this</a> FeedHenry blog post by <a href="http://www.feedhenry.com/author/david-martin/">David Martin</a>.
