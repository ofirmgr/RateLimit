import fetch from "node-fetch";
import fs from "fs";

export async function getAction(requestId, intervalId, number, s) {
    const getResponse = await fetch('http://35.189.216.103:9005?' + new URLSearchParams({request_id: requestId}));
    console.log(getResponse.status);
    const json = await getResponse.json();
    console.log(json);
    if (getResponse.status == 200) {
        console.log('clearInterval')
        clearInterval(intervalId);
        fs.appendFile("output.txt", `number: ${number}, result: ${json.result}\n`, function (err) {
            if (err) throw err;
        });
        s.resume();
    }
}

export async function postAction(number, s) {
    console.log(`postAction: ${number}`);
    const response = await fetch('http://35.189.216.103:9005', {
        method: 'POST', body: `{"data": ${number}}`, headers: {
            'Content-Type': 'application/json'
        }
    });
    const resJson = await response.json(); //extract JSON from the http response
    console.log(resJson);
    const requestId = resJson.request_id;
    const intervalId = setInterval(async () => {
        getAction(requestId, intervalId, number, s);
    }, 2000);
}
