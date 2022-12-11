## Available Scripts

In the project directory, you can run:

### `node index.js`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:3000) to view it in your browser.

when you make changes, you need to stop and re-run the application.\
This has two end point as follows:

# `/getOptions`
This API is a **get** call gives an object of 2 string array
`dateList` - contains the list of dates available.\
`fieldList` - contains the list of movement locations.\

# `/getOptions`
This API is a **post** call gives the list of movements with time stamp.\
This requires body params of specific **Date** and **Movement Location**