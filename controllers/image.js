const fetch = require('node-fetch-commonjs');

// Clarifai (according to: https://docs.clarifai.com/api-guide/predict/images/) 
const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = process.env.CLARIFAI_PAT;
    const USER_ID = process.env.CLARIFAI_USER_ID;       
    const APP_ID = 'smart-brain';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    
    return requestOptions
};

const handleApiCall = (req, res) => {  
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(req.body.input)) //image url is on body.input
    .then(response => response.json())
    .then(data => {
        res.json(data);
        console.log('done')
    })
    .catch(err => res.status(400).json('unable to work with API'))
};

const handleImage = (req, res, db) => {
    const { id } = req.body; 
    //Updating entries:
    db('users').where('id','=', id) //when the id equals the id that we received in the body, then increment by 1 the entries and return the updated entries
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries); //return an array of objects (number of entries of that user)
    })
    .catch(err => res.status(400).json('Unable to get entries'))
};

module.exports = {
    handleImage,
    handleApiCall
};