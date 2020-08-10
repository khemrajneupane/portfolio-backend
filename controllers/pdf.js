const express = require("express");

const pdfRouter = express.Router();
const pdf = require('html-pdf');
//const bodyParser = require('body-parser')

const pdfTemplate = require('../documents/index');

pdfRouter.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('controllers/result.pdf', (err) => {
        
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

pdfRouter.get('/fetch-pdf', (req, res) => {
    //res.send("hello world")
    res.sendFile(`${__dirname}/result.pdf`)
})

module.exports = pdfRouter;
