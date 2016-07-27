var constants       = require('../scripts/constants');
var util						= require(constants.paths.scripts + "/util");
var logger					= require(constants.paths.scripts + "/logger");

var secure = {};

secure.isInAnyGroups = isInAnyGroups;
secure.getGroups = getGroups;

module.exports = secure;

var groups = {										// constants defining the application paths
    'admin'										: 'A20484567892345678900001',
    'exec'										: 'A20484567892345678900002',
    'vManager'								: 'A20484567892345678900003'
};

function isInAnyGroups(user, grps){
	// filter identified groups and user
	var check = false;
	grps.split(",").forEach(function(grp){

		grp = grp.trim();

		if(grp.toLowerCase() == "customer" && user.association == "customer"){
			check = true;
		}

		if (grp.toLowerCase() == "user"){
			check = true;
		}

		// check with predefined groups
		if(groups[grp] !== undefined){
			user.memberOf.forEach(function(member){
				member = ""+ member;
				if(member.compare(groups[grp])){
					check = true;
				}
			});
		}
	});

	// extend further for new groups
	return check;
}

function getGroups(user){
	if(user.memberOf === "")
		return "user";

	var grps = [];
		grps.push("Admin");

		grps.push("Visit Manager");
	return grps.join(',');
}
