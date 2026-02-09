import { Sequelize } from "sequelize";

const db = new Sequelize("kasir_ultraglow","root","", {
    host: "localhost",
    dialect: "mysql"
})

// db.sync({ alter: true });
export default db;