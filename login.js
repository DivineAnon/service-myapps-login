var  configPortal = require('./dbportal'); 
const  sql = require('mssql');
const axios = require('axios');
const { json } = require('body-parser');
const generator = require('generate-password');
require('dotenv').config()
var jwt = require('jsonwebtoken');

function generateToken(data){
    var token = jwt.sign({data:data}, process.env.TOKEN_SECRET, { expiresIn: 60*60*24 });
    return token
}

async function login(userlogin, password) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).
        input('password', sql.VarChar, password).
        query(`SELECT '01' as m_program, a.m_login as loginid, 
        b.m_nik as nik, c.m_foto as profile, 
        b.m_nama as nama, b.m_cabang as cabang,
         b.m_departemen as departemen,
         e.m_departemen as departemen_name,
          b.m_divisi as divisi, 
           b.m_atasan1 as m_atasan1,
           b.m_atasan2 as m_atasan2,
           b.m_kode_pangkat as m_kode_pangkat,
           f.m_nama as m_nama_atasan1,
         b.m_subdivisi as subdivisi, b.m_golkar as level, 
         a.m_brand as brand, a.m_lokasi as store, 
         a.m_stock as stock, a.m_divisi2 as groupuser, 
         b.m_jabatan,b.m_subdivisinew as brand2,
         b.m_lokasi as lokasi, b.m_subdivisinew as subdivisinew, 
         convert(varchar(20),b.m_tglkeluar,103) as cotglkeluar, 
         b.m_tglkeluar as tglkeluar, a.m_status as status, 
         d.m_emailkantor,
         CASE
				WHEN g.is_atasan1 > 0 THEN '1'
				ELSE '0'
			END AS is_atasan1
         
         FROM 
         msuser a
         join dbhrd.dbo.mskaryawan b on a.m_nik = b.m_nik 
         join dbhrd.dbo.msdetilkaryawan c on a.m_nik = c.m_nik
         join dbhrd.dbo.msemailkaryawan d on a.m_nik = d.m_nik
         join dbhrd.dbo.msdepartemen e on b.m_departemen = e.m_iddept
         join dbhrd.dbo.mskaryawan f on b.m_atasan1 = f.m_nik 
         left join (
			select m_atasan1, COUNT(*)as is_atasan1
			from dbhrd.dbo.mskaryawan
			group by m_atasan1
         ) g on a.m_nik = g.m_atasan1
         WHERE a.m_nik = b.m_nik AND b.m_nik = c.m_nik 
          AND UPPER(a.m_login) = @userlogin AND 
         PWDCOMPARE(@password, a.m_newpass) = 1`)
        // query(`SELECT '01' as m_program, a.m_login as loginid, 
        // b.m_nik as nik, c.m_foto as profile, 
        // b.m_nama as nama, b.m_cabang as cabang,
        //  b.m_departemen as departemen, b.m_divisi as divisi, 
        //  b.m_subdivisi as subdivisi, b.m_golkar as level, 
        //  a.m_brand as brand, a.m_lokasi as store, 
        //  a.m_stock as stock, a.m_divisi2 as groupuser, 
        //  b.m_jabatan,b.m_subdivisinew as brand2,
        //  b.m_lokasi as lokasi, b.m_subdivisinew as subdivisinew, 
        //  convert(varchar(20),b.m_tglkeluar,103) as cotglkeluar, 
        //  b.m_tglkeluar as tglkeluar, a.m_status as status, 
        //  d.m_emailkantor FROM 
        //  msuser a, dbhrd.dbo.mskaryawan b, 
        //  dbhrd.dbo.msdetilkaryawan c ,
        //  dbhrd.dbo.msemailkaryawan d 
        //  WHERE a.m_nik = b.m_nik AND b.m_nik = c.m_nik 
        //  AND UPPER(a.m_login) = @userlogin AND 
        //  PWDCOMPARE(@password, m_newpass) = 1`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
} 
async function loginEproc(userlogin) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).
        query(`SELECT '01' as m_program, a.m_login as loginid, 
        b.m_nik as nik, c.m_foto as profile, 
        b.m_nama as nama, b.m_cabang as cabang,
         b.m_departemen as departemen, b.m_divisi as divisi, 
         b.m_subdivisi as subdivisi, b.m_golkar as level, 
         a.m_brand as brand, a.m_lokasi as store, 
         a.m_stock as stock, a.m_divisi2 as groupuser, 
         b.m_jabatan,b.m_subdivisinew as brand2,
         b.m_lokasi as lokasi, b.m_subdivisinew as subdivisinew, 
         convert(varchar(20),b.m_tglkeluar,103) as cotglkeluar, 
         b.m_tglkeluar as tglkeluar, a.m_status as status, 
         d.m_emailkantor
         FROM 
         msuser a
         join dbhrd.dbo.mskaryawan b on a.m_nik = b.m_nik 
         join dbhrd.dbo.msdetilkaryawan c on a.m_nik = c.m_nik
         join dbhrd.dbo.msemailkaryawan d on a.m_nik = d.m_nik
         WHERE a.m_nik = b.m_nik AND b.m_nik = c.m_nik 
          AND UPPER(a.m_login) = @userlogin `)
      
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
} 
async function getLoginData(userlogin) {
    try{ 
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`select * from msuser where m_login='${userlogin}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function resetPasswordData(userlogin, password) {
    try{
        let pool = await sql.connect(configPortal);
        let reset = await pool.request().query(`update msuser set m_password = '${password}', m_newpass = PWDENCRYPT('${password}') where m_login = '${userlogin}'`);
        return  reset.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function notification(userlogin) {
    try{
        let pool = await sql.connect(configPortal);
        // let data = await pool.request().query(`exec sp_notif '140639' `);
        let data = await pool.request().query(`exec sp_notif '${userlogin}' `);
        return  data.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function menuProgram(userlogin) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().input('userlogin', sql.VarChar, userlogin).query("select distinct a.m_program, c.m_nama, c.m_fawasome_react,c.m_folder,c.m_object from msakses a, msmenu b, msprogram c where a.m_login = @userlogin and a.m_akses = 'Y' and a.m_program = b.m_program and a.m_kode = b.m_kode and a.m_program = c.m_kode");
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
async function isExistMenu(kode) {
    try{
        let pool = await sql.connect(configPortal);
        let exist = await pool.request().query(`select isnull(count(*),0) as jumrow from msprogram where m_kode = '${kode}'`);
        return  exist.recordsets[0][0]?.jumrow;
    }catch(error){
        console.log(error);
    }
}
async function listMenuMyAppsNew(
    search,limit,page
) {
    let last = limit*page
    let first = last - (limit-1)
    let query = `
    select * from(
        select ROW_NUMBER() OVER 
           (ORDER BY id desc) as row,
            * from msmenumyappsnew 
           where LOWER(menu) like '%${search?.toLowerCase()}%'
    ) awek`
    if(limit!=''&&page!=''){
        query = query+` where row BETWEEN '${first}' AND '${last}'`
    }
    let query1 = `
    select count(*) as tot from(
        select ROW_NUMBER() OVER 
           (ORDER BY id desc) as row,
            * from msmenumyappsnew 
           where LOWER(menu) like '%${search?.toLowerCase()}%'
    ) awek`
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(query);
        let data1 = await pool.request().query(query1);
        return  {
            data:login.recordsets[0],tot:data1.recordsets[0][0]['tot']
            // ,
            // query
        };
    }catch(error){
        console.log(error);
    }
}
async function addMenuMyappsNew(
    menu,path,div,subdiv,dept,
    unit,jabatan,group_user,user_list,cabang
    ) {
    try{
        let pool = await sql.connect(configPortal);
       
        
        let add = await pool.request().query(`
        insert into 
        msmenumyappsnew (
            menu,path,div
            subdiv,dept, unit, 
            jabatan,group_user, user_list,cabang,
            created_at,
            updated_at) values 
            ('${menu}','${path}','${div}',
            '${subdiv}','${dept}','${unit}',
            '${jabatan}','${group_user}','${user_list}','${cabang}',
            '${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}',
            '${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}'
            )`);
        return  add?.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function updateMenuMyappsNew(
    id,menu,path,div,subdiv,dept,
    unit,jabatan,group_user,user_list,cabang
) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`
        update msmenumyappsnew set 
        menu = '${menu}', 
        path = '${path}',
        div = '${div}',
        subdiv= '${subdiv}',
        dept= '${dept}',
        unit= '${unit}',
        jabatan= '${jabatan}',
        group_user= '${group_user}',
        user_list= '${user_list}' ,
        cabang= '${cabang}' 
        where id = '${id}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}

async function deleteMenuMyAppsNew(id) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`DELETE FROM msmenumyappsnew  where id = '${id}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function listSubMenuMyAppsNew(
    search,limit,page
) {
    let last = limit*page
    let first = last - (limit-1)
    let query = `
    select * from(
        select ROW_NUMBER() OVER 
           (ORDER BY id desc) as row,
            * from mssubmenumyappsnew 
           where LOWER(menu) like '%${search?.toLowerCase()}%'
    ) awek`
    if(limit!=''&&page!=''){
        query = query+` where row BETWEEN '${first}' AND '${last}'`
    }
    let query1 = `
    select count(*) as tot from(
        select ROW_NUMBER() OVER 
           (ORDER BY id desc) as row,
            * from mssubmenumyappsnew 
           where LOWER(menu) like '%${search?.toLowerCase()}%'
    ) awek`
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(query);
        let data1 = await pool.request().query(query1);
        return  {
            data:login.recordsets[0],tot:data1.recordsets[0][0]['tot']
            // ,
            // query
        };
    }catch(error){
        console.log(error);
    }
}
async function addSubMenuMyappsNew(
    menu,path,div,subdiv,dept,
    unit,jabatan,group_user,user_list,cabang) {
    try{
        let pool = await sql.connect(configPortal);
       
        
        let add = await pool.request().query(`
        insert into 
        mssubmenumyappsnew (
            menu,path,div
            subdiv,dept, unit, 
            jabatan,group_user, user_list,cabang,
            created_at,
            updated_at) values 
            ('${menu}','${path}','${div}',
            '${subdiv}','${dept}','${unit}',
            '${jabatan}','${group_user}','${user_list}','${cabang}',
            '${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}',
            '${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}'
            )`);
        return  add?.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function updateSubMenuMyappsNew(
    id,menu,path,div,subdiv,dept,
    unit,jabatan,group_user,user_list,cabang
) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`
        update msmenumyappsnew set 
        menu = '${menu}', 
        path = '${path}',
        div = '${div}',
        subdiv= '${subdiv}',
        dept= '${dept}',
        unit= '${unit}',
        jabatan= '${jabatan}',
        group_user= '${group_user}',
        user_list= '${user_list}' ,
        cabang= '${cabang}' 
        where id = '${id}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function deleteSubMenuMyAppsNew(id) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`DELETE FROM mssubmenumyappsnew  where id = '${id}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function deleteMenu(kode) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`DELETE FROM msprogram  where m_kode = '${kode}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function updateMenu(code,nama,file,folder,edit) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`update msprogram set m_nama = '${nama}',m_editby='${edit}', m_folder = '${folder}', m_object = '${file}' where m_kode = '${code}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function addMenu(kode,nama,file,folder,created) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`insert into msprogram (m_kode, m_nama, m_object, m_folder,m_createby) values ('${kode}','${nama}','${file}','${folder}','${created}')`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function listMenu() {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`select * from msprogram order by m_kode asc`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function listSubMenu(code) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`select * from msmenu where m_program = '${code}' order by m_program asc`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function updateSubMenu(m_program,kode,nama,file,child,updated) {
    try{
        let pool = await sql.connect(configPortal);
        let login = await pool.request().query(`update msmenu set m_nama = '${nama}', m_object = '${file}',m_submenu = '${child}',m_updatedby= '${updated}' where m_kode = '${kode}' and m_program = '${m_program}'`);
        return  login.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function addSubMenu(m_program,kode,nama,file,child,created) {
    try{
        let pool = await sql.connect(configPortal);
       
        
        let add = await pool.request().query(`insert into msmenu (m_program,m_kode, m_nama, m_object, m_submenu,m_createdby) values ('${m_program}','${kode}','${nama}','${file}','${child}','${created}')`);
        return  add?.recordsets;
    }catch(error){
        console.log(error);
    }
}
async function isExistSubMenu(m_program,kode ) {
    try{
        let pool = await sql.connect(configPortal);
        let exist = await pool.request().query(`select isnull(count(*),0) as jumrow from msmenu where m_kode = '${kode}' and m_program = '${m_program}'`);
 
         
        return  exist.recordsets[0][0]?.jumrow;
        }catch(error){
            console.log(error);
        }
}
async function deleteSubMenu(m_program,kode ) {
    try{
        let pool = await sql.connect(configPortal);
        let exist = await pool.request().query(`DELETE FROM msmenu  where m_kode = '${kode}' and m_program = '${m_program}'`);
 
         
        return  exist.recordsets[0][0]?.jumrow;
        }catch(error){
            console.log(error);
        }
}

async function selectJabatanGroup( 
    search
    ) {
        let query = `select top 5  m_kode as value, m_nama as label from msjabatan
        where m_nama like '%${search?.toUpperCase()}%' `
   
    try{
        let pool = await sql.connect(configPortal);
        let data = await pool.request().query(query);
   
        let dats = data?.recordsets[0]
        let arr = [{value:'',label:'All'}]
        dats?.map((d)=>{
            arr.push(d)
        })
       
        return  {
          data:arr
        //   search
        };
    }catch(error){
        console.log({error})
    }
  }
module.exports = {
    listMenuMyAppsNew,
    addMenuMyappsNew,
    updateMenuMyappsNew,
    deleteMenuMyAppsNew,
    listSubMenuMyAppsNew,
    addSubMenuMyappsNew,
    updateSubMenuMyappsNew,
    deleteSubMenuMyAppsNew,
    loginEproc,
    selectJabatanGroup,
    notification,
    login,
    deleteSubMenu,
    deleteMenu,
    menuProgram,
    addSubMenu,
    listSubMenu,
    listMenu,
    isExistSubMenu,
    menu,
    isExistMenu,
    updateSubMenu,
    addMenu,
    updateMenu,
    getLoginData,
    resetPasswordData,
    submenu,
    forgotpass,
    getdataemail,
    generateToken
}