import * as Sqlz from 'sequelize'

const db = 'permanent_recall'
const username = 'permanent_recall'
const password = 'permanent_recall123'

export const sequelize = new Sqlz.Sequelize(db, username, password, {
  dialect: "mysql",
  host: 'db',
  port: 3306,
});

sequelize.authenticate()
