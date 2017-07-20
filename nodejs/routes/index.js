var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');

var serverKey = 'AAAAvYfixGU:APA91bErvr5btqby7eW1EE3nTduPhj-1Tg39Eu0AA3uJlROenYjE5mce8c2zXXUjpId7xD2-BvqpVBNG7E-oMfW3Hw_aMR-MrMlWfRt8odJ1hoX2eypqYYv7RZRVv_M8H4oWEHUAVyUS';
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //to: 'co8XVXGEeKw:APA91bH_MQ5ViHMsFOsA_jUCJs_ffdsmpixBjmtl00dXvi4cyw9ETN9YylCuHDc9z2SIU5nDFzbL58d-7bhiI_opA7Ohi5PJb6-gWP2g6QZVIcqno3YvaQ5k9FjMR7nqOqmThvM1l5g7', 
    registration_ids : ['dsjMmxvnO2k:APA91bFibzJPI23ljwvAS17ndnzLI9pPOizjrf1MCzF5uitdrcCP341ovm3Fhds5ZuTQCldmC4MJY_E-O7whfLlpyL8NdHLuG-0BsV4iT0aZNkRaJIEufhvk9x-jCXV80NBDluYSBJ_O','co8XVXGEeKw:APA91bH_MQ5ViHMsFOsA_jUCJs_ffdsmpixBjmtl00dXvi4cyw9ETN9YylCuHDc9z2SIU5nDFzbL58d-7bhiI_opA7Ohi5PJb6-gWP2g6QZVIcqno3YvaQ5k9FjMR7nqOqmThvM1l5g7'],
    collapse_key: 'your_collapse_key',
    
    notification: {
        title: 'Title of your push notification', 
        body: 'Body of your push notification' ,
        sound: 'default'
    },
    
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST User Login. */
router.post('/login', function(req, res) {
    var db = req.db;

    var userName = req.body.username;
    var passWord = req.body.password;
    var token = req.body.token;
    console.log(userName);
    console.log(passWord);

    var collection = db.get('userlist');
    collection.find({"username": userName, "password": passWord},{},function(e,docs){
        //console.log(docs);
        if(docs.length == 1 ){
            collection.update({"username": userName},{$set:{"token":token}},function(e,docs){
                //console.log(docs);
                res.send(
                            (e === null) ? { msg: 'Success' } : { msg: e }
                        );

            });
           res.json({"fullname" : docs[0].fullname,"role" : docs[0].role,"pic": docs[0].pic,"_id": docs[0]._id,"username" : docs[0].username,"email" : docs[0].email,"location" : docs[0].location});
           // res.json(docs);
        }
        else
            res.send("Failed");
        

    });
});

/* POST User Login. */
router.post('/profilepic', function(req, res) {
    var db = req.db;

    var _id = req.body._id;
    var pic = req.body.pic.toString();
   // console.log(userName);
    //console.log(passWord);

    var collection = db.get('userlist');
    collection.update({"_id": _id},{$set:{"pic":pic}},function(e,docs){
        //console.log(docs);
        res.send(
                    (e === null) ? { msg: 'Success' } : { msg: err }
                );

    });
});


/* POST User Login. */
router.post('/getprofilepic', function(req, res) {
    var db = req.db;

    var _id = req.body._id;
    //var pic = req.body.pic.toString();
   // console.log(userName);
    //console.log(passWord);

    var collection = db.get('userlist');
    collection.find({"_id": _id},{},function(e,docs){
        //console.log(docs);
        if(docs.length ==1)
            res.json({"pic":docs[0].pic});
        else
        res.send(
                    (e === null) ? { msg: 'Success' } : { msg: err }
                );

    });
});

/*POST Add User*/
router.post('/checkuser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;

    // Set our collection
    var collection = db.get('userlist');
    collection.find({"username": userName},{},function(e,docs){
        //console.log(docs);
        if(docs.length == 1 ){
            res.send("Username Already Exists");

        }
        else{
            res.send("Success");
        }
    });
});

router.post('/userinfo', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var _id = req.body._id;

    // Set our collection
    var collection = db.get('userlist');
    collection.find({"_id": _id},{},function(e,docs){
        //console.log(docs);
        if(docs.length == 1 ){
            res.json(docs);
        }
        else{
            res.send("Failed");
        }
    });
});

/*POST Add User Profile*/
router.post('/adduserprofile', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var passWord = req.body.password;
    var role = req.body.role;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var dob = new Date(req.body.dob);
    var gender = req.body.gender;
    var location = req.body.location;

    // Set our collection
    var collection = db.get('userlist');
    collection.find({"username": userName},{},function(e,docs){
        //console.log(docs);
        if(docs.length == 1 ){
            res.send("Username Already Exists");

        }
        else{
            collection.insert({"username": userName, 
                "role": role,
                "password": passWord,
                "email": email,
                "fullname": fullname,
                "DOB": dob,
                "gender": gender,
                "location": location},function(e,docs){
                res.send(
                    (e === null) ? { msg: 'Success' } : { msg: err }
                );
            });
        }
    });

    
});

/*POST Add User Profile*/
router.post('/addjob', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var title = req.body.title;
    var pay = req.body.pay;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var desc = req.body.desc;

    // Set our collection
    var collection = db.get('joblist');
           //console.log(docs);
    collection.find({"username": userName, "title": title, "pay": pay, "starttime": starttime, "endtime": endtime},{},function(e,docs){
        console.log(docs);
        console.log(docs.length);
        if(docs.length > 0 ){
            res.send("Job Already Exists");

        }
        else{
            collection.insert({"username": userName, 
                "title": title,
                "pay": pay,
                "starttime": starttime,
                "endtime": endtime,
                "desc": desc},function(e,docs){
                res.send(
                    (e === null) ? { msg: 'Success' } : { msg: err }
                );
            });
        }
    });
            
        
    });

/*POST Add User Profile*/
router.post('/getjobs', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;

    // Set our collection
    var collection = db.get('joblist');
           //console.log(docs);
    collection.find({"username": userName},{},function(e,docs){
        
        console.log(docs.length);
        if(docs.length == 0 ){
            res.send("No Jobs Found");

        }
        else{
            res.send(docs);
        }
    });
            
        
    });


module.exports = router;

var message = { 
    to: docs3[0].token ,
    
    notification: {
        title: 'Someone Applied for '+ docs[0].title, 
        body: fullname+ ' Applied to your job posting' ,
        sound: 'default'
    },
    
    data: {  //you can send only notification or only data(or include both)
        title: 'Someone Applied for '+ docs[0].title, 
        pay: fullname+ ' Applied to your job posting'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Notificaiton sent except for few");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});