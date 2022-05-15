import { User } from './models/user';
import { Note } from './models/note';
import { Project } from './models/project';
import { Address } from './models/address';

Address.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'author',
});

Project.belongsTo(User, { targetKey: 'id' });

User.hasMany(Project, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'projects' // this determines the name in `associations`!
});
