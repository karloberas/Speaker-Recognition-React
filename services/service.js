var profilesModel = require('../models/profiles.model.js');
var Axios = require('axios');
var fs = require('fs');
require('dotenv').config();

const key = process.env.KEY;

exports.AddProfile = function(data) {
    return new Promise(function(resolve, reject) {   
        console.log(key); 
        Axios.post(
            'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles',
            {
                "locale":"en-us"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key':key
                }
            }
        ).then(function(response) {
            var _identificationProfileId = response.data.identificationProfileId;
            var _profile = {identificationProfileId:_identificationProfileId, name:data.name, enrolled:false};
            profilesModel.create(_profile).then(function(response) {
                resolve(response);
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}

exports.ResetEnrollment = function(data) {
    return new Promise(function(resolve, reject) { 
        Axios.post(
            'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/'+data.id+'/reset',
            {},
            {
                headers: {
                    'Ocp-Apim-Subscription-Key':key
                }
            }
        ).then(function() {
            profilesModel.updateOne({identificationProfileId:data.id}, {enrolled:false}).then(function() {
                resolve();
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}

exports.DeleteProfile = function(_identificationProfileId) {
    console.log(_identificationProfileId);
    return new Promise(function(resolve, reject) { 
        Axios.delete(
            'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/'+_identificationProfileId,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key':key
                }
            }
        ).then(function() {
            profilesModel.deleteOne({identificationProfileId:_identificationProfileId}).then(function() {
                resolve();
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}

exports.GetProfiles = function() {
    return new Promise(function(resolve, reject) {
        profilesModel.find({}).then(function(response) {
            resolve(response);
        }, function(err) {
            reject(err);
        });
    });
}

exports.EnrollProfile = function(_identificationProfileId, _blob) {
    return new Promise(function(resolve, reject) {
        Axios.post(
            'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/'+_identificationProfileId+'/enroll?shortAudio=true',
            fs.createReadStream(_blob.path),
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Ocp-Apim-Subscription-Key':key
                }
            }
        ).then(function(response) {
            profilesModel.updateOne({identificationProfileId:_identificationProfileId}, {enrolled:true}).then(function() {
                resolve(response.headers["operation-location"]);
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}

exports.CheckStatus = function(data) {
    return new Promise(function(resolve, reject) {
        Axios.get(
            data.url,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key':key
                }
            }
        ).then(function(response) {
            if(response.data.status == "succeeded" && response.data.processingResult.identifiedProfileId) {
                profilesModel.findOne({identificationProfileId:response.data.processingResult.identifiedProfileId}).then(function(result) {
                    if(result) {
                        resolve({status:response.data.status, identificationProfileId:response.data.processingResult.identifiedProfileId, confidence:response.data.processingResult.confidence, name:result.name});
                    }
                    else {
                        resolve({status:response.data.status, identificationProfileId:response.data.processingResult.identifiedProfileId, confidence:response.data.processingResult.confidence, name:""});
                    }
                    
                }, function(err) {
                    reject(err);
                });
            }
            else {
                resolve(response.data);
            }
        }, function(err) {
            reject(err);
        });
    });
}

exports.IdentifyProfile = function(_blob) {
    return new Promise(function(resolve, reject) {
        profilesModel.find({}, 'identificationProfileId').then(function(result) {
            var profileIds = [];
            result.forEach(function(profile) {
                profileIds.push(profile.identificationProfileId);
            });
            var ids = profileIds.join(",");
            Axios.post(
                'https://westus.api.cognitive.microsoft.com/spid/v1.0/identify?identificationProfileIds='+ids+'&shortAudio=true',
                fs.createReadStream(_blob.path),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Ocp-Apim-Subscription-Key':key
                    }
                }
            ).then(function(response) {
                resolve(response.headers["operation-location"]);
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}