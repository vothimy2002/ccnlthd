const express=require("express");
const app=express();
app.set("view engine","ejs");
const port=3000;
app.set("views","./views")

app.get("/",(req,res)=>{
    res.render("log");
});
app.listen(port,()=>console.log("chay chuong trinh ung dung"));s                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          