import dotnenv from 'dotenv';
dotnenv.config({ quiet: true });

import connect from './db/connect.js';
import app from './app.js'

const port = process.env.PORT

connect().then(() => {
    app.listen(port, () => {
        console.log('App started')
    })
}).catch(error => console.log('App not started', error))