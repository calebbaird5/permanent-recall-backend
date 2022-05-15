import * as Sqlz from 'sequelize';

import { User } from './user';
import { sequelize } from '../instances/sequelize';

export class Address extends Sqlz.Model<Sqlz.InferAttributes<Address, {omit: 'author'}>, Sqlz.InferCreationAttributes<Address, {omit: 'author'}> > {
  declare id: Sqlz.CreationOptional<string>;
  declare authorId: string;
  declare address: string;
  declare createdAt: Sqlz.CreationOptional<Date>;
  declare updatedAt: Sqlz.CreationOptional<Date>;
  declare getAuthor: Sqlz.BelongsToGetAssociationMixin<User>;
  declare author?: Sqlz.NonAttribute<User>;
  declare setAuthor: Sqlz.BelongsToSetAssociationMixin<User, string>;
}

let columns = {
  id: {
    type: Sqlz.DataTypes.UUID,
    defaultValue: Sqlz.DataTypes.UUIDV4,
    primaryKey: true
  },
  authorId: {
    type: Sqlz.DataTypes.UUID,
  },
  address: {
    type: new Sqlz.DataTypes.STRING(128),
    allowNull: false
  },
  createdAt: Sqlz.DataTypes.DATE,
  updatedAt: Sqlz.DataTypes.DATE,
}

Address.init(columns, { tableName: 'address', sequelize });
