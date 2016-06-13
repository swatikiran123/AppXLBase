'use strict';

angular.module('cviz-admin', ['users','confirmDialogDirective','tooltips','userprofileDirective','userDirective','userdisplayDirective',
	'appFilters','datePicker','richTextDirective','dropzone','fileuploadDirective','userAutoDirective','angucomplete-alt']);

angular.module('cviz-profile',
	['userprofileDirective','userDirective','userdisplayDirective',
	'appFilters',
	'datePicker','dropzone','fileuploadDirective',
	'profile']);
