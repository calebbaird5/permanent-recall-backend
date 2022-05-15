import * as Sqlz from 'sequelize';

import { Project } from './project';
import { Address } from './address';
import { sequelize } from '../instances/sequelize';

export class User extends Sqlz.Model<Sqlz.InferAttributes<User, { omit: 'projects' }>, Sqlz.InferCreationAttributes<User, { omit: 'projects' }>> {
  declare id: Sqlz.CreationOptional<string>;
  declare email: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare passwordHash: Sqlz.CreationOptional<string>;
  declare password: Sqlz.NonAttribute<string>;
  declare createdAt: Sqlz.CreationOptional<Date>;
  declare updatedAt: Sqlz.CreationOptional<Date>;

  declare getProjects: Sqlz.HasManyGetAssociationsMixin<Project>;
  declare addProject: Sqlz.HasManyAddAssociationMixin<Project, string>;
  declare addProjects: Sqlz.HasManyAddAssociationsMixin<Project, string>;
  declare setProjects: Sqlz.HasManySetAssociationsMixin<Project, string>;
  declare removeProject: Sqlz.HasManyRemoveAssociationMixin<Project, string>;
  declare removeProjects: Sqlz.HasManyRemoveAssociationsMixin<Project, string>;
  declare hasProject: Sqlz.HasManyHasAssociationMixin<Project, string>;
  declare hasProjects: Sqlz.HasManyHasAssociationsMixin<Project, string>;
  declare countProjects: Sqlz.HasManyCountAssociationsMixin;
  declare createProject: Sqlz.HasManyCreateAssociationMixin<Project, 'ownerId'>;

  declare projects?: Sqlz.NonAttribute<Project[]>;

  get fullName(): Sqlz.NonAttribute<string> {
    return this.firstName + ' ' + this.lastName;
  }

  declare static associations: {
    projects: Sqlz.Association<User, Project>;
  };
}

let columns = {
  id: {
    type: Sqlz.DataTypes.UUID,
    defaultValue: Sqlz.DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: new Sqlz.DataTypes.STRING(128),
    allowNull: false
  },
  firstName: {
    type: new Sqlz.DataTypes.STRING(128),
    allowNull: true
  },
  lastName: {
    type: new Sqlz.DataTypes.STRING(128),
    allowNull: true
  },
  passwordHash: {
    type: new Sqlz.DataTypes.STRING(128),
    allowNull: false
  },
  createdAt: Sqlz.DataTypes.DATE,
  updatedAt: Sqlz.DataTypes.DATE,
}

User.init(columns, { tableName: 'Users', sequelize });

User.hasOne(Address, { sourceKey: 'id' });
