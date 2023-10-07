const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const request=require("request");
const { subscribe } = require("diagnostics_channel");
const d=require("dotenv").config();

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");

})

app.post("/",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    // MailChimp method for data entries
var data={
    members : [
        {
            email_address:email,
            status: "subscribed",

           merge_fields : {
            FNAME:fname,
            LNAME:lname
           }
         }
    ]
 
 };
 
 const jsonDATA=JSON.stringify(data);

 const mailchimp_key=process.env.mailchimp_key;
 const mailchimp_aud_id=process.env.mailchimp_aud_id;
 
 const url=mailchimp_aud_id;

 const options ={
     method:"post",
     auth: mailchimp_key
 }
 
 const request=https.request(url,options,function(response){
     response.on("data",function(data){
         console.log(JSON.parse(data));
     })

     if(response.statusCode==200){
        res.sendFile(__dirname + "/success.html");
     }
     else{
        res.sendFile(__dirname + "/failure.html");
     }
 
 })

 console.log(request); 
 
 // Send data to mailchimp
 request.write(jsonDATA);
 request.end();

})

// app.listen(process.env.PORT || 3000,function(req,res){
//     console.log("Server Started");
// })