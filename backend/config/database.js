import { Sequelize } from "sequelize";

const db = new Sequelize("resto_grandian","root","", {
    host: "localhost",
    dialect: "mysql"
})

export default db;