const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app =  express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

// ROUTES

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");        
});

app.post("/", function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]        
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/41fdb51615";
    const options = {
        method: "POST",
        auth: "Isabel:e7890abe133aa953d80065f70b73a6df-us10"
    }

    const request = https.request(url, options, (response) => {   

            // Lets user know if sign up was successfull
            if (response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");  
            }else{
                res.sendFile(__dirname + "/failure.html");  
            }
            // Logs user's data
            response.on("data", (data) =>{                
                console.log(JSON.parse(data));             
            });
        }).on("error", (e) => {
            console.error(e);
        })
    
    request.write(jsonData);
    request.end();
})

app.post("/back", function(req,res){
    res.redirect("/")
})

// listens to Heroku port or local host

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on 3000")
})

//API KEY:  e7890abe133aa953d80065f70b73a6df-us10
//List ID:  41fdb51615