var  configPortal = require('./dbportal'); 
const  sql = require('mssql');
const axios = require('axios');
const { json } = require('body-parser');
const generator = require('generate-password');

async function login(userlogin, password) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).input('password', sql.VarChar, password).query("SELECT '01' as m_program, a.m_login as loginid, b.m_nik as nik, c.m_foto as profile, b.m_nama as nama, b.m_cabang as cabang, b.m_departemen as departemen, b.m_divisi as divisi, b.m_subdivisi as subdivisi, b.m_golkar as level, a.m_brand as brand, a.m_lokasi as store, a.m_stock as stock, a.m_divisi2 as groupuser, b.m_lokasi as lokasi, b.m_subdivisinew as subdivisinew, convert(varchar(20),b.m_tglkeluar,103) as cotglkeluar, b.m_tglkeluar as tglkeluar, a.m_status as status FROM msuser a, dbhrd.dbo.mskaryawan b, dbhrd.dbo.msdetilkaryawan c WHERE a.m_nik = b.m_nik AND b.m_nik = c.m_nik AND UPPER(a.m_login) = @userlogin AND PWDCOMPARE(@password, m_newpass) = 1");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function loginData(userlogin, password) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).input('password', sql.VarChar, password).query("SELECT '01' as m_program, a.m_login as loginid, b.m_nik as nik, c.m_foto as profile, b.m_nama as nama, b.m_cabang as cabang, b.m_departemen as departemen, b.m_divisi as divisi, b.m_subdivisi as subdivisi, b.m_golkar as level, a.m_brand as brand, a.m_lokasi as store, a.m_stock as stock, a.m_divisi2 as groupuser, b.m_lokasi as lokasi, b.m_subdivisinew as subdivisinew, convert(varchar(20),b.m_tglkeluar,103) as cotglkeluar, b.m_tglkeluar as tglkeluar, a.m_status as status FROM msuser a, dbhrd.dbo.mskaryawan b, dbhrd.dbo.msdetilkaryawan c WHERE a.m_nik = b.m_nik AND b.m_nik = c.m_nik AND UPPER(a.m_login) = @userlogin AND PWDCOMPARE(@password, m_newpass) = 1");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function menuProgram(userlogin) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).query("select distinct a.m_program, c.m_nama, c.m_fawasome_react from msakses a, msmenu b, msprogram c where a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = b.m_program and a.m_kode = b.m_kode and a.m_program = c.m_kode");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function menu(userlogin, kodeprogram) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).input('kodeprogram', sql.VarChar, kodeprogram).query("select a.*, b.m_nama, c.m_folder, b.m_object, d.jumrec from msakses a, msmenu b, msprogram c, (select left(a.m_kode,1) as groupmenu, COUNT(*) as jumrec from 	msakses a where a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = @kodeprogram group by left(a.m_kode,1) ) d where	a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = b.m_program and a.m_kode = b.m_kode and a.m_program = c.m_kode and LEFT(a.m_kode,1) = d.groupmenu and RIGHT(a.m_kode,5) = '00000' and a.m_program = @kodeprogram");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function submenu(userlogin, kodeprogram, kodemenu) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).input('kodeprogram', sql.VarChar, kodeprogram).input('kodemenu', sql.VarChar, kodemenu).query("select a.*, b.m_nama, c.m_folder, b.m_object, d.jumrec from msakses a, msmenu b, msprogram c, ( select left(a.m_kode,2) as groupmenu, COUNT(*) as jumrec from msakses a where a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = @kodeprogram and left(a.m_kode,1) = left(@kodemenu,1) group by left(a.m_kode,2) ) d where a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = b.m_program and a.m_kode = b.m_kode and a.m_program = c.m_kode and LEFT(a.m_kode,2) = d.groupmenu and RIGHT(a.m_kode,5) <> '00000' and a.m_program = @kodeprogram and left(a.m_kode,1) = left(@kodemenu,1)");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function forgotpass(userlogin) {
    try{
        const password = generator.generate({
            length: 10,
            numbers : false,
            lowercase: true,
            uppercase: true
        })
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).input('kodeprogram', sql.VarChar, password).query("exec dbo.sp_resetpassword @userlogin, @kodeprogram");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function getdataemail(userlogin) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).query("select a.m_emailkantor from dbhrd.dbo.msemailkaryawan a, dbportal.dbo.msuser b where a.m_nik = b.m_nik and b.m_login = @userlogin");
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    login,
    menuProgram,
    menu,
    submenu,
    forgotpass,
    getdataemail
}