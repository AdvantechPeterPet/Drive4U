import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: '210.111.178.93',
    port: 3306,
    user: 'dungdung2',
    password: 'advantechlove1234',
    database: 'Drive4U',
});

const promisePool = pool.promise();

//total applyquery
export const ApplyQuery = {
    applyquery: async(Query) => {
        const sql = Query;
        const[result] = await promisePool.query(sql);
        return result;
    },
}

//select query
export const selectSql = {
    getEmployees: async () => {
        const sql = `select * from Employees`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getCustomers: async() => {
        const sql = `select * from Customers`;
        const [result] = await promisePool.query(sql);
        return result;
    },
}

// insert query
export const insertSql = {
    setEmployee: async (data) => {
        const sql = `
            INSERT INTO Employees(EmployeeId, Password, Name, Email, RegDate)
            VALUES (?, ?, ?, ?, NOW());
        `;
        console.log(data);

        try {
            await promisePool.query(sql, [data.EmployeeId, data.Password, data.Name, data.Email]);
        } catch (error) {
            console.error('Error inserting employee:', error.message);
        }
    },

    setCustomer: async (data) => {
        const sql = `
            INSERT INTO Customers(CustomerId, Password, Name, Email, RegDate)
            VALUES (?, ?, ?, ?, NOW());
        `;
        console.log(data);

        try {
            await promisePool.query(sql, [data.CustomerId, data.Password, data.Name, data.Email]);
        } catch (error) {
            console.error('Error inserting customer:', error.message);
        }
    },

    setCar: async (data) => {
        const sql = `
            INSERT INTO Cars(CarName, CarType, CarPrice, RegDate)
            VALUES ("${data.CarName}","${data.CarType}",${data.CarPrice},NOW());
        `;
    
        try {
            await promisePool.query(sql,);
        } catch (error) {
            console.error('Error inserting car:', error.message);
            throw error; 
        }
    },
    
    setCarcare: async (data) => {
        const sql = `
            INSERT INTO CarCare(CarName, EmployeeID)
            VALUES (?, ?);
        `;
    
        try {
            await promisePool.query(sql, [data.CarName, data.EmployeeID]);
        } catch (error) {
            console.error('Error inserting car care record:', error.message);
            throw error; 
        }
    },

    setSensor:async (data) => {
        const sql = `insert into sensordata values ( 1,
            now(), ${data.ax}, ${data.ay},${data.az},
            ${data.gx}, ${data.gy}, ${data.gz},
            ${data.decibel}, ${data.temp}, ${data.humi}
        )`
        console.log(data);

        try {
          await promisePool.query(sql);
        } catch (error) {
            console.error('Error inserting sensor data:', error.message);
        }
    },

    // 임시페이지에서 start
    startRental: async (data) => {
        const sql = `
            INSERT INTO Rentals(CustomerID, CarName, StartTime)
            VALUES (?, ?, NOW());
        `;

        try {
            await promisePool.query(sql, [data.CustomerID, data.CarName]);
        } catch (error) {
            console.error('Error starting rental:', error.message);
            throw error;
        }
    },
};


// update query
export const updateSql = {

    //임시 페이지에서 종료
    endRental: async (rentalID) => {
        const sql = `
            UPDATE Rentals
            SET EndTime = NOW()
            WHERE RentalID = ?;
        `;

        try {
            await promisePool.query(sql, [rentalID]);
        } catch (error) {
            console.error('Error ending rental:', error.message);
            throw error;
        }
    },

    updateDriveListRentalTime: async (rentalID) => {
        const sql = `
            UPDATE DriveList
            SET RentalTime = TIMESTAMPDIFF(MINUTE, 
                (SELECT StartTime FROM Rentals WHERE RentalID = ?), 
                (SELECT EndTime FROM Rentals WHERE RentalID = ?))
            WHERE RentalID = ?;
        `;
    
        try {
            const [result] = await promisePool.query(sql, [rentalID, rentalID, rentalID]);
            console.log('SQL Query:', sql);
            console.log('DriveList RentalTime Updated:', result);
        } catch (error) {
            console.error('Error updating DriveList rental time:', error.message);
            throw error;
        }
    },
    
};