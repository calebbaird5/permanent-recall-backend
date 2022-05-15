const Op = require("sequelize").Op;
import { splitArray } from './utils';

// export function generateEndpoints(Model, modelId, options) {
//   if(!options) options = {};
//   if(!options.associations) options.associations = {};
//   let endpoints = {};

//   endpoints.definition = (req, res) => {
//     return {id:"definition"};
//   }

//   endpoints.get = (req, res) => {
//     if(req.params[modelId]) {
//       //console.log("SequelizeAPI endpoints.get. modelId: " + modelId)
//       if (req.params[modelId] === 'search') {
//         delete req.params[modelId];
//       } else {
//         let params = generateGetParameters(req, options);
//         params.where = {id: req.params[modelId]};

//         try {
//           return Model.findOne(params);
//         } catch (error) {
//           console.log("ERROR IN GET ENDPOINT (1)")
//           console.log(error);
//           console.log(params);
//         }
//       }
//     }

//     //console.log("SequelizeAPI endpoints.get no modelId")


//     let params = generateGetParameters(req, options);

//     let limit = null;
//     if(req.query.limit) limit = Number(req.query.limit);

//     let offset = 0;
//     if(req.query.offset) offset = Number(req.query.offset);

//     try {
//       // Sequelize will include the included models in the count.
//       // This is not the desired behavior so do not include any associations
//       // for the count request.
//       return Model.count({...params, include: []}).then(amount => {
//         res.set("X-Total", amount);
//         if(limit) {
//           params.limit = limit;
//           res.set("X-Total-Pages", Math.ceil(amount/limit));
//         }
//         params.offset = offset;
//         if (req.query.definition)
//           addDefinitionAssociations(params, Model, options, req.query.definition);
//         return Model.findAll(params);
//       });
//     } catch (error) {
//       console.log("ERROR IN GET ENDPOINT (2)")
//       console.log(error);
//       console.log(params);
//       return [];
//     }
//   }

//   if(options.searchFields) {
//     endpoints.search = (req, res) => {
//       let or = [];
//       for(let i=0; i<options.searchFields.length; i++) {
//         let param = {};
//         param[options.searchFields[i]] = {[Op.like]: "%"+req.params.search_term+"%"};
//         or.push(param);
//       }
//       let params = generateGetParameters(req, options, {[Op.or]: or});

//       let limit = null;
//       if(req.query.limit) limit = Number(req.query.limit);

//       let offset = 0;
//       if(req.query.offset) offset = Number(req.query.offset);
//       params.offset = offset;

//       return Model.count({...params, include: []}).then(amount => {
//         params.limit = limit;
//         res.set("X-Total", amount);
//         if(limit) {
//           params.limit = limit;
//           res.set("X-Total-Pages", Math.ceil(amount/limit))
//         }
//         if (req.query.definition)
//           addDefinitionAssociations(params, Model, options, req.query.definition);
//         return Model.findAll(params);
//       });
//     }
//   }

//   function buildPostAssociationParams(associations) {
//     let includes = [];
//     for(let k in associations) {
//       let assoc = { association: associations[k].association };
//       if(associations[k].associations) assoc.include = buildPostAssociationParams(associations[k].associations);
//       includes.push(assoc);
//     }
//     return includes;
//   }

//   endpoints.post = (req, res) => {
//     let params = {};
//     if(options.associations) params.include = buildPostAssociationParams(options.associations);
//     return Model.create(req.body, params);
//   }

//   endpoints.put = (req, res) => {
//     if(!req.params[modelId]) return Promise.reject(missingParamError(modelId));
//     return endpoints.get(req, res).then(result => {
//       if(!result) return null;
//       for(let k in req.body) {
//         result[k] = req.body[k];
//       }
//       return result.save().then(savedResult => {
//         return savedResult;
//       });
//     });
//   }

//   endpoints.patch = endpoints.put;

//   endpoints.delete = (req, res) => {
//     if(!req.params[modelId]) return Promise.reject(missingParamError(modelId));
//     return Model.findOne({where: {id: req.params[modelId]}}).then(result => {
//       if(result) result.destroy()
//       return null;
//     });
//   }

//   return endpoints;
// }

// function missingParamError(param) {
//   let err = new Error("Missing required parameter '" + param + "'");
//   err.code = "MISSING_PARAM";
//   err.param = param;
//   return err;
// }

// function buildGetInclude(name: string, associations, include_query: string[], nestedNames) {
//   let include = {
//     model: associations[name].model,
//     as: name,
//     required: false
//   };

//   if (include_query && Object.keys(include_query).length > 0) {
//     let params = generateGetParameters({ query: include_query });
//     include = {
//       ...include,
//       seperate: true,
//       ...params,
//     };
//     // If our include through params contain a where clause we set required to true.
//     if (Object.keys(include.where).length > 0)
//       include.required = true;
//   }

//   if (nestedNames && nestedNames.length) {
//     const CCPlugins = require('./cc_plugins.js');
//     let nestedOptions = CCPlugins.getOptions(associations[name].modelName);
//     if (nestedOptions) {
//       let associations = nestedOptions.associations;
//       include.include = buildGetInclude(
//         nestedNames[0], associations, null, nestedNames.slice(1));
//     }
//   }

//   if(associations[name].associations) {
//     include.include = [];
//     for(let k in associations[name].associations) {
//       include.include.push(buildGetInclude(k, associations[name].associations));
//     }
//   }

//   return include;
// }

// function buildGetAssociationParams(req_query, associations) {
//   if(req_query.include && associations) {
//     let includes = [];
//     for(let name of req_query.include) {
//       // This supports nested eager loading.
//       let names = name.split('.');
//       if(names[0] in associations) {
//         includes.push(
//           buildGetInclude(names[0], associations, req_query[name], names.slice(1)));
//       }
//     }

//     return includes;
//   }
// }

// function getSortParams(querySort, model, as) {
//   let sort = "updatedAt";
//   let direction = "DESC";
//   if(querySort) {
//     if (querySort === 'none') return [];
//     sort = querySort;
//     if(querySort[0] == "-") {
//       sort = querySort.substring(1);
//       direction = "ASC";
//     }
//   }
//   let sortArray = [sort, direction];
//   if (model && as) sortArray.unshift({model: model, as: as});
//   // if (association) sortArray.unshift({model: association.model, as: 'user'});
//   return sortArray;
// }

// export function generateGetParameters(req, options, where) {
//   if (!req.query) req.query = {};
//   if(!where) where = {};
//   let params = {};
//   let attributes = null;
//   if(req.query.columns) {
//     let [columns, columnsToRemove] = splitArray(req.query.columns, (el)=>el[0] !== '-');
//     if (columns && columns.length) {
//       attributes = columns;
//       if(!attributes.includes('id')) attributes.push('id');
//     } else if (columnsToRemove && columnsToRemove.length) {
//       columnsToRemove.filter(el => el !== 'id');
//       attributes = {exclude: columnsToRemove.map(el => el.substring(1))};
//     }
//   }

//   let includes = null;
//   if(req.query.include && options.associations) {
//     if (!Array.isArray(req.query.include)) req.query.include = [req.query.include];
//     includes = buildGetAssociationParams(req.query, options.associations);
//   }

//   for(let k in req.query) {
//     if(req.query.include && req.query.include.includes(k)) continue;
//     if(k == "columns") continue;
//     if(k == "include") continue;
//     if(k == "sort") continue;
//     if(k == "limit") continue;
//     if(k == "offset") continue;
//     if(k == "definition") continue;
//     if(k == "or") continue;

//     const parseInequalityExpression = (s) => {
//       if (!['<','>','='].includes(s[0]))
//         return null;
//       let expression = [];
//       let i = 0;
//       while (i < s.length) {
//         let operator = '';
//         while (i < s.length && ['<','>','='].includes(s[i])) {
//           operator += s[i++];
//         }

//         let operand = '';
//         while (i < s.length && !['<','>','='].includes(s[i])) {
//           operand += s[i++];
//         }

//         switch(operator) {
//           case '<':
//             expression.push({[Op.lt]: operand});
//             break;
//           case '>':
//             expression.push({[Op.gt]: operand});
//             break;
//           case '<=':
//             expression.push({[Op.lte]: operand});
//             break;
//           case '>=':
//             expression.push({[Op.gte]: operand});
//             break;
//           default:
//             return null;
//         }
//       }
//       return {[Op.and]: expression};
//     };

//     let expression = parseInequalityExpression(req.query[k]);
//     if (expression)
//       where[k] = expression;
//     else if (k === 'not') {
//       for (let subk in req.query.not)
//         if (!req.query.include.includes(subk))
//           where[subk] = {[Op.or]: req.query.not[subk]};
//     } else where[k] = req.query[k];
//   }

//   if(req.query.or) {
//     let orOpts = [];
//     for(let k in req.query.or) {
//       let opt = {};
//       opt[k] = req.query.or[k];
//       orOpts.push(opt);
//     }
//     where = {
//       [Op.and]: [
//         where,
//         {
//           [Op.or]: orOpts
//         }
//       ]
//     };
//   }

//   let sorts = [getSortParams(req.query.sort)];

//   if (req.query.include) {
//     let includeSorts = req.query.include.map(name => {
//       return !req.query[name] ? []
//         : getSortParams(req.query[name].sort, options.associations[name].model, name);
//     });
//     sorts.push(...includeSorts);
//   }

//   sorts = sorts.filter(el => el.length > 0);

//   params = {where: where, order: sorts};
//   if(attributes) params.attributes = attributes;
//   if(includes) params.include = includes;
//   return params;
// }

// function addDefinitionAssociations(params, Model, options, definition) {
//   // Add associations that are named the same as the key
//   const addAssociationByName = (name, label = 'name') => {
//     params.include.push({
//       model: options.associations[name].model,
//       as: name,
//       required: false,
//       attributes: ['id', label],
//     });
//   }
//   for (let k in Model.rawAttributes) {
//     if (options.associations[k.slice(0, -2)]) {
//       let name = k.slice(0, -2);
//       if (!params.include) params.include = [];
//       addAssociationByName(name);
//     }
//   }

//   // add custom associations
//   switch(definition) {
//     case 'MenuItem':
//       ['parentItem'].forEach(name => addAssociationByName(name, 'title'));
//       break;
//   }
// }
