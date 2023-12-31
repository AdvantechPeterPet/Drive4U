import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('signIn');
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const employees = await selectSql.getEmployees();

    employees.forEach((employee) => {
        console.log('Employee ID:', employee.EmployeeID);
        console.log('Employee Password:', employee.Password);
        console.log(' ');

        if (vars.id == employee.EmployeeID && vars.password == employee.Password) {
            console.log('Login success!');
            req.session.user = { id: employee.EmployeeID, role: 'employee', checkLogin: true };
            req.session.Id = employee.EmployeeID;
        }
    });

    if (req.session.user === undefined) {
        console.log('Login failed!');
        res.send(`<script>
                    alert('Please check your ID or Password!');
                    location.href='/';
                </script>`);
    } else if (req.session.user.checkLogin) {
        res.redirect('/adminMain');
    }
});

module.exports = router;
