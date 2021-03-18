const express = require('express');
const https = require('https');
const request = require('request');
const bodyParser = require('body-parser');
const { static } = require('express');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(`${__dirname}/signup.html`)
})

app.post("/",(req,res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data ={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/564bc75896";
    const options ={
        method:"POST",
        auth: "gowsh:6a9e45f585640f055e9c182781c7ec17-us1"
    }

    const request = https.request(url,options,(response)=>{

        if(response.statusCode==200){
            res.sendFile(`${__dirname}/success.html`)
            app.post("/success",(req,res)=>{
                res.redirect("/")
            })
        }else{
            res.sendFile(`${__dirname}/failure.html`)
        }
            response.on("data",(data)=>{
                console.log(JSON.parse(data));
            })
        })
    request.write(jsonData);
    request.end();
})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is Up and Running!!! yay!!")
})

// 6a9e45f585640f055e9c182781c7ec17-us1 --API key
// 564bc75896 -- unique id
// https://us1.api.mailchimp.com/3.0/lists/564bc75896/members/6a9e45f585640f055e9c182781c7ec17