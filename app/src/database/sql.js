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

    getDriveListRentalTime: async (rentalID) => {
        const sql = `
            SELECT RentalTime
            FROM DriveList 
            WHERE RentalID = ?;
        `;
        try {
            console.log('Fetching rental time for RentalID:', rentalID); // Debug
            const [rows] = await promisePool.query(sql, [rentalID]);
            console.log('Query result:', rows); // Debug
            if (rows.length > 0) {
                return rows[0].RentalTime;
            } else {
                console.log('No rental time found for RentalID:', rentalID); // Debug
                return null;
            }
        } catch (error) {
            console.error('Error fetching rental time from DriveList:', error.message);
            throw error;
        }
    },
    getRentalTimes: async (rentalID) => {
        const sql = `
            SELECT StartTime, EndTime, CarName
            FROM Rentals
            WHERE RentalID = ?;
        `;
        try {
            const [result] = await promisePool.query(sql, [rentalID]);
            if (result.length > 0) {
                return result[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching rental times:', error.message);
            throw error;
        }
    },
    getSensorData: async (startTime, endTime, carName) => {
        const sql = `
            SELECT SD.time, SD.ax, SD.ay, SD.az, SD.gx, SD.gy, SD.gz
            FROM SensorData SD
            INNER JOIN CarSensorLinks CSL ON SD.SensorID = CSL.SensorID
            WHERE CSL.CarName = ? AND SD.time BETWEEN ? AND ?;
        `;
        try {
            const [result] = await promisePool.query(sql, [carName, startTime, endTime]);
            return result;
        } catch (error) {
            console.error('Error fetching sensor data:', error.message);
            throw error;
        }
    },
    
    getRentalInfo: async (rentalID) => {
        const sql = `
            SELECT StartTime, EndTime, CarName
            FROM Rentals
            WHERE RentalID = ?;
        `;
        try {
            const [rows] = await promisePool.query(sql, [rentalID]);
            if (rows.length > 0) {
                return rows[0]; // Assuming there's only one row per RentalID
            } else {
                console.log('No rental info found for RentalID:', rentalID);
                return null;
            }
        } catch (error) {
            console.error('Error fetching rental info:', error.message);
            throw error;
        }
    },
    getSensorLink: async (carName) => {
        const sql = `
            SELECT SensorID
            FROM CarSensorLinks
            WHERE CarName = ?;
        `;
        try {
            const [rows] = await promisePool.query(sql, [carName]);
            if (rows.length > 0) {
                return rows[0]; // Assuming there is only one sensor per car
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching sensor ID:', error.message);
            throw error;
        }
    },
    getSensorData: async (startTime, endTime) => {
        const sensorID = 1; // Constant sensorID
        const carName = 'Car1'; // Constant carName
        const sql = `
            SELECT SD.*
            FROM SensorData SD
            INNER JOIN Rentals R ON R.CarName = ?
            INNER JOIN CarSensorLinks CSL ON CSL.SensorID = ? AND CSL.CarName = R.CarName
            WHERE SD.time BETWEEN R.StartTime AND R.EndTime
            AND R.StartTime >= ? AND R.EndTime <= ?;
        `;
        try {
            const [result] = await promisePool.query(sql, [carName, sensorID, startTime, endTime]);
            return result;
        } catch (error) {
            console.error('Error fetching sensor data:', error.message);
            throw error;
        }
    },

    getCustomerDriveInfo: async (customerID) => {
        const sql = `
            SELECT DriveScore
            FROM Customers
            WHERE CustomerID = ?;
        `;

        try {
            const [rows] = await promisePool.query(sql, [customerID]);
            if (rows.length > 0) {
                return rows[0]; // 첫 번째 행 반환
            } else {
                return null; // 고객 정보가 없는 경우
            }
        } catch (error) {
            console.error('Error fetching customer drive info:', error.message);
            throw error;
        }
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
    startRental: async (data) => {
        const sql = `
            INSERT INTO Rentals(CustomerID, CarName, StartTime)
            VALUES (?, ?, NOW());
        `;
    
        try {
            const [result] = await promisePool.query(sql, [data.CustomerID, data.CarName]);
            return result; // 쿼리 결과 반환 (insertId 포함)
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
            console.log('Updating DriveList RentalTime for RentalID:', rentalID); // Debug
            const [result] = await promisePool.query(sql, [rentalID, rentalID, rentalID]);
            console.log('SQL Query:', sql); // Debug
            console.log('DriveList RentalTime Updated:', result); // Debug
            // Check if any rows were affected
            if (result.affectedRows === 0) {
                console.log('No rows updated in DriveList for RentalID:', rentalID); // Debug
            }
        } catch (error) {
            console.error('Error updating DriveList rental time:', error.message);
            throw error;
        }
    },
    updateDriveList: async ({ rentalID, rentalTime, recklessDriving, suddenAccel, rapidDecel, RentalDistance }) => {
        const sql = `
            UPDATE DriveList
            SET RentalTime = ?, 
                RecklessDriving = ?, 
                SuddenAccel = ?, 
                RapidAccel = ?, 
                RentalDistance = ?
            WHERE RentalID = ?;
        `;
    
        try {
            await promisePool.query(sql, [rentalTime, recklessDriving, suddenAccel, rapidDecel, RentalDistance, rentalID]);
        } catch (error) {
            console.error('Error updating DriveList:', error.message);
            throw error;
        }
    },

    updateCustomerDriveInfo: async (customerID) => {
        const sqlDriveTime = `
            UPDATE Customers
            SET DriveTime = (SELECT SUM(RentalTime) FROM DriveList WHERE CustomerID = ?)
            WHERE CustomerID = ?;
        `;

        const sqlDriveScore = `
            UPDATE Customers
            SET DriveScore = 100 - (
                (SELECT SUM(RecklessDriving + SuddenAccel + RapidAccel) FROM DriveList WHERE CustomerID = ?) / 
                (SELECT SUM(RentalDistance) FROM DriveList WHERE CustomerID = ?) * 1000 * 10
            )
            WHERE CustomerID = ?;
        `;

        try {
            // DriveTime 업데이트
            await promisePool.query(sqlDriveTime, [customerID, customerID]);

            // DriveScore 업데이트
            await promisePool.query(sqlDriveScore, [customerID, customerID, customerID]);
        } catch (error) {
            console.error('Error updating customer drive info:', error.message);
            throw error;
        }
    },
    
    
};