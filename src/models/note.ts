import * as Sqlz from 'sequelize';

import {Project} from './project';
import { sequelize } from '../instances/sequelize';

// And with a functional approach defining a module looks like this
export class Note extends Sqlz.Model<Sqlz.InferAttributes<Note>, Sqlz.InferCreationAttributes<Note>> {
  declare id: Sqlz.CreationOptional<string>;
  declare title: Sqlz.CreationOptional<string>;
  declare content: string;
  declare createdAt: Sqlz.CreationOptional<Date>;
  declare updatedAt: Sqlz.CreationOptional<Date>;
}

let columns = {
  id: {
    type: Sqlz.DataTypes.UUID,
    defaultValue: Sqlz.DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: new Sqlz.DataTypes.STRING(64),
    defaultValue: 'Unnamed Note'
  },
  content: {
    type: new Sqlz.DataTypes.STRING(4096),
    allowNull: false
  },
  createdAt: Sqlz.DataTypes.DATE,
  updatedAt: Sqlz.DataTypes.DATE,
}

Note.init(columns, { tableName: 'Notes', sequelize });
