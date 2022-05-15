import * as Sqlz from 'sequelize';
import { User } from './user';

import { sequelize } from '../instances/sequelize';

export class Project extends Sqlz.Model< Sqlz.InferAttributes<Project>, Sqlz.InferCreationAttributes<Project> > {
  // id can be undefined during creation when using `autoIncrement`
  declare id: Sqlz.CreationOptional<string>;
  declare ownerId: string;
  declare name: string;

  // `owner` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare owner?: Sqlz.NonAttribute<User>;

  // createdAt can be undefined during creation
  declare createdAt: Sqlz.CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: Sqlz.CreationOptional<Date>;
}

Project.init(
  {
    id: {
      type: Sqlz.DataTypes.UUID,
      defaultValue: Sqlz.DataTypes.UUIDV4,
      primaryKey: true
    },
    ownerId: {
      type: Sqlz.DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: new Sqlz.DataTypes.STRING(128),
      allowNull: false
    },
    createdAt: Sqlz.DataTypes.DATE,
    updatedAt: Sqlz.DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'Projects'
  }
);

// Project.belongsTo(User, { targetKey: 'id' });
