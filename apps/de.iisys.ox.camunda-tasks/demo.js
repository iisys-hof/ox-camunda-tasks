define('de.iisys.ox.camunda-tasks/demo', [

], function () {

	var demo = {
		'groups': [
			{'id':'demo_accounting','name':'DEMO Accounting','type':'WORKFLOW'},
			{'id':'demo_caseworker','name':'DEMO Case Worker','type':'ACM'},
			{'id':'demo_management','name':'DEMO Management','type':'WORKFLOW'}
		],
		'tasklist':[
			{	'id':'1de2079a-eb63-11e5-94a8-08002760b0e7',
				'name':'Create Wiki Page',
				'assignee':null,
				'created':'2016-03-16T11:37:44',
				'due':'2016-04-16T11:37:44',
				'followUp':null,
				'delegationState':null,
				'description':'Create a wiki page for further discussions in the community.',
				'executionId':null,
				'owner':null,
				'parentTaskId':null,
				'priority':50,
				'processDefinitionId':null,
				'processInstanceId':null,
				'taskDefinitionKey':'PI_humanTask_wikiPage',
				'caseExecutionId':'1dd84391-eb63-11e5-94a8-08002760b0e7',
				'caseInstanceId':'1dc7c8ce-eb63-11e5-94a8-08002760b0e7',
				'caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7',
				'suspended':false,
				'formKey':null
			},{
				'id':'7ab1dcb3-ea83-11e5-896f-08002760b0e7',
				'name':'Prepare Social Collaboration Workshop',
				'assignee':null,
				'created':'2016-03-15T08:56:52',
				'due':null,
				'followUp':null,'delegationState':null,
				'description':'Prepare the SC workshop. Further details in first meeting.',
				'executionId':null,'owner':null,'parentTaskId':null,
				'priority':50,
				'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage',
				'caseExecutionId':'7aa866ca-ea83-11e5-896f-08002760b0e7','caseInstanceId':'7a963e57-ea83-11e5-896f-08002760b0e7',
				'caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7',
				'suspended':false,'formKey':null
			},{
				'id':'0d9d32ab-e9bb-11e5-a548-08002760b0e7',
				'name':'Ask project partners for feedback',
				'assignee':null,
				'created':'2016-03-14T09:02:10',
				'due':'2016-05-05T09:04:33',
				'followUp':null,'delegationState':null,
				'description':'Create a wiki page for further discussions in the community.',
				'executionId':null,'owner':null,'parentTaskId':null,
				'priority':50,
				'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage',
				'caseExecutionId':'0d932082-e9bb-11e5-a548-08002760b0e7','caseInstanceId':'0d82308f-e9bb-11e5-a548-08002760b0e7',
				'caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7',
				'suspended':false,'formKey':null
			},{
				'id':'fa4491a5-e76c-11e5-990e-08002760b0e7',
				'name':'Do first research on Smart Home',
				'assignee':null,
				'created':'2016-03-11T10:38:14',
				'due':'2016-05-07T10:38:14',
				'followUp':null,'delegationState':null,
				'description':'Put all literature in zotero.',
				'executionId':null,'owner':null,'parentTaskId':null,
				'priority':50,
				'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage',
				'caseExecutionId':'fa35013c-e76c-11e5-990e-08002760b0e7','caseInstanceId':'fa1ce559-e76c-11e5-990e-08002760b0e7',
				'caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7',
				'suspended':false,'formKey':null},{'id':'2e217c1a-e695-11e5-94d6-08002760b0e7','name':'Create final document','assignee':null,'created':'2016-03-10T08:53:30','due':null,'followUp':null,'delegationState':null,'description':null,'executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_createFinalDoc','caseExecutionId':'2e0eb75d-e695-11e5-94d6-08002760b0e7','caseInstanceId':'2dfc40c7-e695-11e5-94d6-08002760b0e7','caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7','suspended':false,'formKey':null},{'id':'2e1d0f43-e695-11e5-94d6-08002760b0e7','name':'Create Wiki Page','assignee':null,'created':'2016-03-10T08:53:30','due':null,'followUp':null,'delegationState':null,'description':'Create a wiki page for further discussions in the community.','executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage','caseExecutionId':'2e0e693a-e695-11e5-94d6-08002760b0e7','caseInstanceId':'2dfc40c7-e695-11e5-94d6-08002760b0e7','caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7','suspended':false,'formKey':null},{'id':'db404954-e600-11e5-975f-08002760b0e7','name':'Create Wiki Page','assignee':null,'created':'2016-03-09T15:11:45','due':'2016-03-21T11:55:21','followUp':null,'delegationState':null,'description':'Create a wiki page for further discussions in the community.','executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage','caseExecutionId':'db2d0f6b-e600-11e5-975f-08002760b0e7','caseInstanceId':'db05d858-e600-11e5-975f-08002760b0e7','caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7','suspended':false,'formKey':null},{'id':'efb5776e-509e-11e5-9e83-08002760b0e7','name':'Create Wiki Page','assignee':null,'created':'2015-09-01T13:45:26','due':null,'followUp':null,'delegationState':null,'description':'Create a wiki page for further discussions in the community.','executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage','caseExecutionId':'efb417d5-509e-11e5-9e83-08002760b0e7','caseInstanceId':'efb3f0c2-509e-11e5-9e83-08002760b0e7','caseDefinitionId':'project_proposal_man:2:efb1a6d0-509e-11e5-9e83-08002760b0e7','suspended':false,'formKey':null},{'id':'5d8d2b4d-5070-11e5-9e83-08002760b0e7','name':'Create Wiki Page','assignee':null,'created':'2015-09-01T08:12:04','due':null,'followUp':null,'delegationState':null,'description':null,'executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage','caseExecutionId':'5d814465-5070-11e5-9e83-08002760b0e7','caseInstanceId':'5d6d4732-5070-11e5-9e83-08002760b0e7','caseDefinitionId':'project_proposal_manually:4:87509be4-4fe5-11e5-8e27-08002760b0e7','suspended':false,'formKey':null},{'id':'875b4a51-4fe5-11e5-8e27-08002760b0e7','name':'Create Wiki Page','assignee':null,'created':'2015-08-31T15:38:14','due':null,'followUp':null,'delegationState':null,'description':null,'executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_humanTask_wikiPage','caseExecutionId':'87586419-4fe5-11e5-8e27-08002760b0e7','caseInstanceId':'875779b6-4fe5-11e5-8e27-08002760b0e7','caseDefinitionId':'project_proposal_manually:4:87509be4-4fe5-11e5-8e27-08002760b0e7','suspended':false,'formKey':null},{'id':'929c34bf-3a85-11e5-ae2a-08002760b0e7','name':'Check Application','assignee':null,'created':'2015-08-04T09:48:26','due':null,'followUp':null,'delegationState':null,'description':null,'executionId':null,'owner':null,'parentTaskId':null,'priority':50,'processDefinitionId':null,'processInstanceId':null,'taskDefinitionKey':'PI_HumanTask_1','caseExecutionId':'929afc39-3a85-11e5-ae2a-08002760b0e7','caseInstanceId':'9293a934-3a85-11e5-ae2a-08002760b0e7','caseDefinitionId':'loan_application:2:e1a02316-c8c8-11e4-883d-08002760b0e7','suspended':false,'formKey':null}
		]
	};


	return demo;
});