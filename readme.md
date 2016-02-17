### PDF Creation and saving engine for JustFix.NYC

## Overview
Hi! What you're looking at is a Work in Progress for the PDF generation service to assist the main functionality of JustFix.NYC. This is mostly a Node/Express<a href="https://github.com/litixsoft/lx-pdf">lx-pdf</a> driven micro-app, which at the end of this build will be able to take a JSON of data/complaints from a user and return a letter, which the user can then mail to the offending party.

## Architecture
The idea is this: the app hits the endpoints established the the apps/routes files (after running through the config/init file), which in turn talks to various helper functions contained in the controllers folder.

The way it's set up lets us build controllers for each endpoint we'll be hitting, and build out the different purposes of this app. Hopefully this should cover our bases as we expand out from the single letter building service depending on our needs. Also allows parallel development so we can work together and not step on each other's toes.
