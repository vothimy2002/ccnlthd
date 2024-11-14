const express=require("express");
const app=express();
app.set("view engine","ejs");
const port=3000;
app.set("views","./views")
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
// connect database
    var mysql = require('mysql');
    var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:'',
        database:'task_manager'
    });
    db.connect((err)=>{
        if(err) console.log('Kết nối thất bại');
        else console.log('Kết nối thành công');
    })
    
app.get("/",(req,res)=>{
    res.render("login");
});


// app.listen(port,()=>console.log("chay chuong trinh ung dung"));

app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/homepage", (req, res) => {
    res.render("homepage");
});

// Đăng ký
app.post("/register",(req,res)=> {
    console.log(req.body);
    const {regUsername, regEmail, regPassword} = req.body;
    if(!regUsername || !regEmail || !regPassword){
        return res.status('missing username or email hoặc password');

    }
    var sql = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';
    db.query(sql,[regUsername,regPassword,regEmail],  (err, result)=>{
        if(err){
            console.log('Lỗi đăng ký : ', err);
            return res.status(500).send('Đăng ký thất bại');
        }
        console.log('Thêm người dùng thành công ', result);
        
        res.redirect("/login");
    }  )    
})
//Đăng nhập
// app.post("/login",(req,res)=>{
//     console.log(req.body);
//     const {loginUsername, loginPassword} = req.body;
//     if(!loginPassword || !loginPassword) console.log("Missing username or password");
//     var sql =`SELECT * FROM users WHERE username = '${loginUsername}' AND password = '${loginPassword}'`;
//     db.query(sql, (err, result)=>{
//         if(err){
//             console.log("Lỗi");
//             res.redirect("/");
//         };
//         if(result.length >0 ) {
//             res.redirect("homepage");
//         }
//         else
//         {
//             res.redirect("/");
//         }
//     });
// })
let id;
app.post("/homepage", (req, res) => {
    var id = req.query.id;
    var loginUsername = req.body.username
    var loginPassword = req.body.pass
    var sql;
    // const { loginUsername, loginPassword } = req.body;
    console.log(id)
    // Kiểm tra nếu thiếu username hoặc password
    if (!loginUsername || !loginPassword && id) {
        // console.log("Missing username or password");
        // res.redirect("/");
        sql = `SELECT * FROM users WHERE id = '${id}'`;
    }
    else{
        sql = `SELECT * FROM users WHERE username = '${loginUsername}' AND password = '${loginPassword}'`;
    }

    // Truy vấn cơ sở dữ liệu để kiểm tra user
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log("Lỗi truy vấn cơ sở dữ liệu", err);
            res.redirect("/");
        }

        // Kiểm tra nếu tìm thấy người dùng trong cơ sở dữ liệu
        if (result.length > 0) {
            var userId = result[0].id
            // console.log(userId)
            // console.log("co vao ")
            // Nếu đăng nhập thành công, chuyển hướng đến homepage

             uid = result[0].id;
            console.log(id);
            var sql2 = `SELECT * FROM tasks WHERE user_id = '${userId}'`
            db.query(sql2,(err,data)=>{
                if(err) throw err;
                else {
                     console.log(data)
                    res.render("homepage", { tasks: data, id: userId });
                }
            })
            

        } else {
            // console.log("co vao ")
            // Nếu không tìm thấy người dùng, render lại login với thông báo lỗi
            res.redirect("/");
        }
    });
});

app.post("/action",(req, res)=>{
    var idpost = req.body.idpost
    var userId = req.body.iduser
    var sql = `UPDATE tasks SET status_id = 3 WHERE id ='${idpost}'`;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.log("Lỗi truy vấn cơ sở dữ liệu", err);
            res.redirect("/");
        }
        else{
            var sql2 = `SELECT * FROM tasks WHERE user_id = '${userId}'`
            db.query(sql2,(err,data)=>{
                if(err) throw err;
                else {
                     console.log(data)
                    res.render("homepage", { tasks: data, id: userId });
                }
            })
            // res.redirect(`/homepage?id=${id}`);
            // res.redirect("/homepage");   
        }
    });
})

//add-task
app.post("/add-task",(req,res)=>{
    console.log(req.body);
    var id = req.body.id
    const {title, description, status} = req.body;
    if(!title, !description) console.log("missing title or description");
    const sql = 'INSERT INTO tasks (user_id, title, description, status_id, createdAt, updatedAt, priority_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log("id", id)
    db.query(sql,[uid,title, description,status,new Date(), new Date(), 1], (err, result)=>{
        if(err) {
            console.log('add thất bại', err);
            var sql2 = `SELECT * FROM tasks WHERE user_id = '${uid}'`
            db.query(sql2,(err,data)=>{
                if(err) throw err;
                else {
                     console.log(data)
                    res.render("homepage", { tasks: data , id:uid});
                }
            })

        }else{
            console.log('add thành công');
            var sql2 = `SELECT * FROM tasks WHERE user_id = '${uid}'`
            db.query(sql2,(err,data)=>{
                if(err) throw err;
                else {
                     console.log(data)
                    res.render("homepage", { tasks: data , id:uid});
                }
            })
            
        }
    })
     
})
//delete
app.post("/delete",(req,res)=>{
    console.log("id",req.body);
    const {idDelete} = req.body;
    var sql = `DELETE FROM tasks WHERE id = '${idDelete}'`;
    console.log(sql);
    console.log("id", idDelete);
    db.query(sql, (err,result)=>{
        if(err) console.log("Loi");
        else{
            var sql2 = `SELECT * FROM tasks WHERE user_id = '${uid}'`;
            db.query(sql2,(err,data)=>{
                if(err) throw err;
                else {
                     console.log(data)
                    res.render("homepage", { tasks: data , id:uid});
                }
            })
        }
        
    })


})
 app.listen(port,()=>console.log("chay chuong trinh ung dung"));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

