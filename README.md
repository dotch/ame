# A Million Eyes

## Description

Analyze Tobii Eye Tracking Survey Data

## Instructions

* install node.js
* clone this repository
* run `npm install`
* put raw data into `data/raw`
  * currently supports only `.csv` (use `npm run-script convert` to convert `.xlsx` to `csv`)
* run `npm run-script extract` to extract and process the relevant data
* run `npm start` to start the server
* open `http://localhost:9000` in your browser
