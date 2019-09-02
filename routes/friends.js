const express = require('express');
const router = express.Router();
const path = require('path');
var passport = require('passport')
var connection  = require('../config/db');
var bcrypt = require('bcrypt');
import multer from 'multer';

router.post("/sendFriendRequest", function(req, res){
    connection.query(`
        INSERT INTO friend_requests
        (user_id,request)
        VALUES (${req.body.user},${req.body.friend})  
    `,function(err,rows){
        if(err){ 
            console.log(err)
            return res.json({valid:false, error:'Error'}) 
        }else{
            return res.json({valid:true, error:false})
        }
    })
})

router.post("/deleteFriendRequest", function(req, res){
    connection.query(`
        DELETE FROM friend_requests
        WHERE user_id = ${req.body.user} AND request = ${req.body.friend} 
    `,function(err,rows){
        if(err){ 
            console.log(err)
            return res.json({valid:false, error:'Error'}) 
        }else{
            return res.json({valid:true, error:false})
        }
    })
})

router.post("/getFriendRequestById", function(req, res){

    connection.query(`
        SELECT users.id, users.firstName, users.surname, users.correo, profiles.avatar
        FROM friend_requests
        INNER JOIN users ON users.id = friend_request.user_id
        WHERE friend_requests.request = ${req.body.user}  
    `,function(err,rows){
        if(err){ 
            console.log(err)
            return res.json({valid:false, error:'Error'}) 
        }else{
            return res.json({valid:true, error:false})
        }
    })
})

router.post("/addFriend", function(req, res){
    connection.query(`
        INSERT INTO friends
        (user_id,friend)
        VALUES
            (${req.body.user},${req.body.friend}), 
            (${req.body.friend},${req.body.user})
    `,function(err,rows){
        if(err){ 
            console.log(err)
            return res.json({valid:false, error:'Error'}) 
        }else{
                connection.query(`
                INSERT INTO follows
                (user_id,follow)
                VALUES
                    (${req.body.user},${req.body.friend}), 
                    (${req.body.friend},${req.body.user})
                    
            `,function(err,rows){
                if(err){ 
                    console.log(err)
                    return res.json({valid:false, error:'Error'}) 
                }else{
                    
                    return res.json({valid:true, result:rows})
                }
            })
        }
    })
})

router.post('/deleteFriend', function(req, res, next) {
    // GET/users/ route
    connection.query(`DELETE FROM friends
    WHERE 
    (user_id = ${req.body.user} AND friend = ${req.body.friend}) OR
    (user_id = ${req.body.friend} AND friend =  ${req.body.user})
    `, function(err,rows){
      if(err){
        console.log(err)
        return res.status(203).json({valid:false, error: 'Error'});   
      }else{
        //console.log(rows);
        return res.json({valid:true, result: rows});
      }                   
    });
  });

router.post("/getFriendsById", function(req, res){
    connection.query(`
        SELECT users.id, users.firstName, users.surname, users.correo, profiles.avatar
        FROM friends
        JOIN users ON users.id = friends.user_id
        JOIN profiles ON friends.user_id = profiles.user_id
        WHERE friends.user_id = ${req.body.user}  
    `,function(err,rows){
        console.log(err)
        if(err){ 
            return res.status(203).json({valid:false, error: 'Error'}); 
        }else{
            return res.json({valid:true, result:rows});
        }
    })
})



module.exports = router;