import fs from 'fs';
import es from 'event-stream';
import {postAction} from "./serverClient.js";

const MAX_CONCURRENT_TASKS = 5;
let concurrentCounter = 0;

const s = fs.createReadStream('./input/very-large-file.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        console.log(line);
        // on first run start read MAX_CONCURRENT_TASKS lines at once
        if (concurrentCounter < MAX_CONCURRENT_TASKS - 1) {
            concurrentCounter++;
            console.log(`concurentCounter: ${concurrentCounter}`)
            postAction(line, s);
        } else {
            postAction(line, s);
            s.pause();
        }
    })
        .on('error', function (err) {
            console.log('Error while reading file.', err);
        })
        .on('end', function () {
            console.log('Read entire file.')
        }));



