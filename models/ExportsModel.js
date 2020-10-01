const KeyBiner = require('./KeyBinerModel');
const SumBiner = require('./SumBinerModel');
const File = require('./FileModel');
const User = require('./UserModel');
const ClientToken = require('./ClientTokenModel');
const OtherData = require('./OtherDataModel');

module.exports = {
    KeyBiner: KeyBiner,
    SumBiner: SumBiner,
    File: File,
    User: User,
    ClientToken: ClientToken,
    OtherData: OtherData,
};

File.hasOne(SumBiner, {foreignKey: 'parameter', sourceKey: 'parameter'})
File.hasMany(KeyBiner, {foreignKey: 'parameter', sourceKey: 'parameter'})
File.hasMany(OtherData, {foreignKey: 'parameter', sourceKey: 'parameter'})