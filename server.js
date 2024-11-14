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
    console.log(req.body);
    var loginUsername = req.body.username
    var loginPassword = req.body.pass
    // const { loginUsername, loginPassword } = req.body;

    // Kiểm tra nếu thiếu username hoặc password
    if (!loginUsername || !loginPassword) {
        console.log("Missing username or password");
        res.redirect("/");
    }

    // Truy vấn cơ sở dữ liệu để kiểm tra user
    var sql = `SELECT * FROM users WHERE username = '${loginUsername}' AND password = '${loginPassword}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log("Lỗi truy vấn cơ sở dữ liệu", err);
            res.redirect("/");
        }

        // Kiểm tra nếu tìm thấy người dùng trong cơ sở dữ liệu
        if (result.length > 0) {
            // console.log("co vao ")
            // Nếu đăng nhập thành công, chuyển hướng đến homepage
             id = result[0].id;
            console.log(id);
            res.redirect("/homepage");
        } else {
            // console.log("co vao ")
            // Nếu không tìm thấy người dùng, render lại login với thông báo lỗi
            res.redirect("/");
        }
    });
});

//add-task
app.post("/add-task",(req,res)=>{
    console.log(req.body);

    const {title, description, status,priority} = req.body;
    if(!title, !description) console.log("missing title or description");
    const today = new Date();

    // Lấy ngày, tháng, năm, giờ, phút, giây
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    
    // Định dạng ngày và giờ
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDateTime); // Ví dụ: "14/11/2024 15:30:45"
    const sql = 'INSERT INTO tasks (user_id, title, description, status_id, createdAt, updatedAt, priority_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql,[id,title, description,status,new Date(), new Date(), priority], (err, result)=>{
        if(err) {
            console.log('add thất bại', err);
            res.redirect("/homepage")

        }else{
            console.log('add thành công');
            res.redirect("/homepage")
        }
    })
     
})
 app.listen(port,()=>console.log("chay chuong trinh ung dung"));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

