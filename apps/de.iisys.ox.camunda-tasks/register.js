/**
 * This work is provided under the terms of the CREATIVE COMMONS PUBLIC
 * LICENSE. This work is protected by copyright and/or other applicable
 * law. Any use of the work other than as authorized under this license
 * or copyright law is prohibited.
 *
 * http://creativecommons.org/licenses/by-nc-sa/2.5/
 *
 * © 2016 Institute of Information Systems, Hof, Germany.
 *
 * @author Christian Ochsenkühn <christian.ochsenkuehn@iisys.de>
 */

define('de.iisys.ox.camunda-tasks/register', [
    'io.ox/core/extensions',
    'io.ox/core/tk/vgrid',
    'io.ox/core/date',
    'gettext!de.iisys.ox.camunda-tasks/register',
    'de.iisys.ox.camunda-tasks/demo'
], function (ext, VGrid, date, gt, DemoTasklist) {

    'use strict';

    console.log('PLUGIN de.iisys.ox.camunda-tasks up and running...');

    // config:
    var CAMUNDA_URL = 'http://127.0.0.1:8080/engine-rest';
    var CAMUNDA_FRAG_GROUPS = '/group';
    var CAMUNDA_FRAG_TASKS_GROUP = '/task?candidateGroup=';
    var CAMUNDA_FRAG_TASK_SORTING = '&sortBy=created&sortOrder=desc';
    var EXCLUDED_GROUP_TYPE = 'SYSTEM';
    
    var SCROLLPANE_CLASS = 'vgrid-scrollpane-container';
    var TASK_HEIGHT = 65;
    var EXTERNAL_TASKS_CLASS = 'external';

    var USE_DEMOTASKS = true;

//    var describedbyID = _.uniqueId('description-');
    var describedbyID = 'camunda-tasks';
    var theFolder = 'virtual/flat/tasks/public';
    var theModel = 'flat/tasks/public';
    var isInvisible = '';

    var mainFolder;
    var camundaSubfolders;
    var ajaxAnimationDiv;
    var ajaxAnimationDiv_listView;

    var camundaFolderWasClicked = false;
    var demoFoldersInUse = false;


    var userId = ox.user;
//  console.log('ox.user_id: '+ox.user_id);
//  console.log('ox.user: '+ox.user);


    ext.point('io.ox/core/foldertree/tasks/app').extend({
        id: 'de.iisys.ox.camunda-tasks.sharedtasks',
        index: 400,
        draw: function () {

            this.append(
                mainFolder = $('<li class="folder selectable virtual open section">')
                .attr({
                    id: describedbyID,
                    'aria-label': '',
                    'aria-level': 1,
                    'aria-selected': false,
                    'data-id': theFolder,
                    'data-model': theModel,
                    'role': 'treeitem',
                    'tabindex': '-1'
                })
                .append(
                    $('<div class="folder-node" role="presentation">')
                        .css('padding-left', 0)
                        .append(
                            $('<div class="folder-arrow"'+isInvisible+'><i class="fa fa-caret-down"></i></div>')
                                .on('click', function(e) {
                                    e.preventDefault();
                                    camundaTasks.toggleFolders();
                                }),
                            $('<div class="folder-icon"><i class="fa fa-fw"></i></div>'),
                            $('<div class="folder-label">')
                                .text(gt('Group Tasks')),
                            $('<div class="folder-counter">')
                        ),
                    ajaxAnimationDiv = $('<div class="slight-drop-shadow" style="padding-left:25%;">'),
                    camundaSubfolders = $('<ul class="subfolders" role="group">')
                )
            );

            camundaTasks.loadCamundaGroups();
        }
    });

    // camunda grid template -----
    // see ..apps/io.ox/tasks/view-grid-template.js
    var gridTemplate = {
        main: {
            build: function() {
                var title, status, end_time, user, progress, private_flag, userMessage, progressMessage, private_flagMessage, end_timeMessage;
                this.addClass('tasks')
                    .addClass(EXTERNAL_TASKS_CLASS)
                    .append(
                    $('<div class="first-row">').append(
                        title = $('<div>').addClass('title'),
                        end_timeMessage = $('<span class="sr-only">'),
                        end_time = $('<span aria-hidden="true">').addClass('end_date'),
                        private_flagMessage = $('<span class="sr-only">').text(gt('private')).hide(),
                        private_flag = $('<i class="fa fa-lock private-flag" aria-hidden="true">').hide()
                    ),
                    $('<div class="second-row">').append(
                        status = $('<span>').addClass('status'),
                        //#. message for screenreaders in case selected task has participants
                        userMessage = $('<span class="sr-only">').text(gt('has participants')).hide(),
                        user = $('<i class="participants fa fa-user" aria-hidden="true">').hide(),
                        progressMessage = $('<span class="sr-only">').hide(),
                        progress = $('<div class="progress" aria-hidden="true"><div class="progress-bar" style="width: 0%;"></div></div>').hide()
                    )
                ).on('click', function(){
                    $(this).parent().children('.selected').removeClass('selected');
                    $(this).toggleClass('selected');
                });

                 return { title: title, private_flag: private_flag, end_time: end_time, status: status, user: user, progress: progress,
                         userMessage: userMessage, progressMessage: progressMessage, private_flagMessage: private_flagMessage, end_timeMessage: end_timeMessage };
            },
            set: function(task, fields, index, prev, grid) {

                if(prev && grid) {
                    // prevent compiler errors:
                }

                fields.title.text(_.noI18n(task.name));
                if(task.due && task.due!==null) {
                    fields.end_time.text(_.noI18n(camundaTasks.getDate(task.due,date.DATE)));
                }
                fields.status.attr('class', 'status badge')
                    .text(gt('Not claimed'))
                    .hover(function(){
                        fields.status.toggleClass('badge-important');
                        var txt = fields.status.text();
                        fields.status.text(txt==gt('Not claimed') ? gt('Claim now!') : gt('Not claimed'));
                    })
                    .on('click', null, task.id, camundaTasks.claimTaskEvent);
                // no participants:
                fields.user.hide();
                fields.userMessage.hide();
                // not private:
                fields.private_flag.hide();
                fields.private_flagMessage.hide();
                // no progress:
                fields.progressMessage.text('').hide();
                fields.progress.find('.progress-bar').css('width', 0 + '%').end().hide();

                this.attr({
                    'data-index': index
                });
            }
        }
    };
    // camunda grid template END -----
    

    var camundaTasks = {

        // Ajax calls -----

        loadCamundaGroups: function() {
            var member = '?member=';
            var url = CAMUNDA_URL+CAMUNDA_FRAG_GROUPS+member+userId;

            camundaTasks.animationOnOff(true, ajaxAnimationDiv);
            camundaTasks.sendAsyncRequest('GET', url, camundaTasks.appendFolders, null, null);
        },

        loadCamundaTasks: function(e) {
            // first, set on click listeners:
            if(!camundaFolderWasClicked)
                camundaTasks.manipulateExistingFolders();

            // then load tasks:
            var group = e.data;
            var url = CAMUNDA_URL+CAMUNDA_FRAG_TASKS_GROUP + group.id + CAMUNDA_FRAG_TASK_SORTING;

            // show loading spinner:
            var taskList = camundaTasks.getCleanTaskView();
            taskList.append(
                $('<div class="io-ox-center">').append(
                    ajaxAnimationDiv_listView = $('<div class="io-ox-fail">')
                )
            );
            camundaTasks.animationOnOff(true, ajaxAnimationDiv_listView);

            camundaTasks.sendAsyncRequest('GET', url, camundaTasks.appendTasks, null, group);
        },

        claimTaskEvent: function(e) {
            camundaTasks.claimTask(e.data);
        },
        claimTask: function(taskId) {
            var url = CAMUNDA_URL+'/task/'+taskId+'/claim';
            var requestBody = {
                id : userId
            };
            camundaTasks.sendAsyncRequest('POST', url, camundaTasks.claimTaskResult, requestBody, null);
        },

        // Ajax calls END -----

        appendFolders: function(data) {
            camundaTasks.animationOnOff(false, ajaxAnimationDiv);
            if(data.length<1) {
                if(USE_DEMOTASKS===true) {
                    data = DemoTasklist.groups;
                    demoFoldersInUse = true;
                } else {
                    camundaTasks.deactivateFolders();
                    return;
                }
            }
            for(var i=0; i<data.length; i++) {
                
                if(i>9) break;
                if(data[i].type===EXCLUDED_GROUP_TYPE) continue;

                camundaSubfolders.append(
                    $('<li id="camunda_'+data[i].id+'" class="folder selectable camunda" role="treeitem">')
                    .attr({
                        'data-id': data[i].id
                    })
                    .append(
                        $('<div class="folder-node" role="presentation">')
                            .css('padding-left', 0)
                            .append(
                                $('<div class="folder-arrow invisible"><i class="fa fa-caret-down"></i></div>'),
                                $('<div class="folder-icon"><i class="fa fa-fw"></i></div>'),
                                $('<div class="folder-label">')
                                    .text(data[i].name),
                                $('<div class="folder-counter">')
                            )
                    )
                    .on('click', null, 
                        {   id: data[i].id,
                            name: data[i].name
                        }, camundaTasks.loadCamundaTasks)
                );
            }
        },

        appendTasks: function(data, groupObj) {
            if(data!==null && data.length>0) {
    //            changeUrlParam('folder', groupObj.id);
                camundaTasks.showFolderInfo(groupObj.name, data.length);
                camundaTasks.showTaskDetail(data[0]);
                camundaTasks.manipulateTaskView(data);
            } else {
                if(USE_DEMOTASKS===true && demoFoldersInUse===true) {
                    camundaTasks.useDemoTasks();
                } else {
                    camundaTasks.showEmptyTaskView();
                    camundaTasks.showFolderInfo(groupObj.name, 0);
                    camundaTasks.showEmptyTaskDetail();
                }
            }

            // hide sorting-dropdown:
            // debug: remove css when showing ox-tasks
    //       $('.grid-options').css('display','none');
        },

        claimTaskResult: function(data) {
            console.log('Success: '+JSON.stringify(data));
        },


        // task view manipulation ------

        getCleanTaskView: function() {
            var taskList = $('.'+SCROLLPANE_CLASS);
    //        taskList.empty();
            taskList.children('.'+EXTERNAL_TASKS_CLASS).remove();
            taskList.children().css('display', 'none');
            taskList.parent().find('.io-ox-fail').parent().remove();
            return taskList;
        },

        manipulateTaskView: function(tasks) {
             var taskList = camundaTasks.getCleanTaskView();
             taskList
                .attr({
                    'aria-multiselectable': 'false',
                    'aria-setsize': tasks.length
                })
                .css('height', TASK_HEIGHT*tasks.length);

            // use template (see: .../apps/io.ox/tasks/view-grid-template.js)
            var tmpl = new VGrid.Template();
            // add template
            tmpl.add(gridTemplate.main);

            _(tasks).each(function(data, i) {
                var clone = tmpl.getClone();
                clone.update(data, i);
                clone.appendTo(taskList).node
                    .css('position', 'relative')
                    .data('object-data', data)
                    .addClass('hover')
                    .on('click', null, data, camundaTasks.showTaskDetailEvent);
            });
        },

        showEmptyTaskView: function() {
            var taskList = camundaTasks.getCleanTaskView();
            taskList.attr({
                    'aria-multiselectable': 'true',
                    'aria-setsize': 0
                 })
                .css('position', 'relative')
                .css('height', 0);

            taskList.parent().append(
                $('<div class="io-ox-center">').append(
                    $('<div class="io-ox-fail">').append(
                        $('<span>').text(gt('Empty'))
                    )
                )
            );
        },

        showFolderInfo: function(folderName, taskCount) {
            var gridInfo = $('.vgrid-toolbar').children('.grid-info')
                .attr({
                    'data-folder-id': folderName
                });

            gridInfo.children('.folder-name').text(folderName);
            gridInfo.children('.folder-count').text('('+taskCount+')');
        },

        // task view manipulation END -----


        // task detail manipulation -----

       getCleanTaskDetail: function() {
            var lePane;
            var scrollPane = $('.scrollable-pane');
            scrollPane.children().not('.'+EXTERNAL_TASKS_CLASS)
                .css('display','none');

            scrollPane.children('.'+EXTERNAL_TASKS_CLASS).remove();
            scrollPane.append(
                lePane = $('<div class="'+EXTERNAL_TASKS_CLASS+'">')
            );

            return lePane;
        },

        showTaskDetailEvent: function(e) {
            camundaTasks.showTaskDetail(e.data);
        },
        showTaskDetail: function(task) {
            var lePane;
            var infoPanel;

    //        lePane = $('.scrollable-pane').children()
            lePane = camundaTasks.getCleanTaskDetail();

            $(lePane).attr({
                    'data-cid': task.id
                })
                .removeClass('io-ox-center')
                .addClass('tasks-detailview')
                .addClass(EXTERNAL_TASKS_CLASS)
                .empty();
            $(lePane).parent().css('height','auto');

            lePane.append($('<header role="heading">')
                .append(
                    infoPanel = $('<div class="info-panel">'),
                    $('<h1 class="title clear-title">').text(task.name)
                )
            );

            // infoPanel:
            if (task.due && task.due!==null) {
                infoPanel.append(
                    $('<div>').addClass('end-date').text(
                            //#. %1$s due date of a task
                            //#, c-format
                            gt('Due %1$s', _.noI18n( camundaTasks.getDate(task.due, date.DATE) ))
                        )
                );
            }
            infoPanel.append(
                $('<div>').text(gt('Not claimed')).addClass('state badge')
            );

            // note/description:
            if(task.description && task.description!==null) {
                lePane.append(
                    $('<div class="note">').text(task.description)
                );
            }

            // details
            if(task.created && task.created!==null) {
                lePane.append(
                    $('<fieldset class="details">').append(
                        $('<dl class="task-details dl-horizontal">').append(
                            $('<dt class="detail-label">').text(gt('Start date')),
                            $('<dd class="detail-value">').text(camundaTasks.getDate(task.created, date.DATE))
                        )
                    )
                );
            }

            // claim
            if(task.id && task.id!==null) {
                lePane.append(
                    $('<div>').append(
                        $('<fieldset>').append(
                            $('<legend class="io-ox-label">').append(
                                $('<h2>').text(gt('Actions'))
                            ),
                            $('<button type="button">')
                                .addClass('btn').addClass('btn-primary')
                                .text(gt('Claim'))
                                .on('click', null, task.id, camundaTasks.claimTaskEvent)
                        )
                    )
                );
            }

            // see .../apps/io.ox/tasks/view-detail.js
        },

        showEmptyTaskDetail: function() {
    //        var lePane = $('.scrollable-pane')
            var lePane = camundaTasks.getCleanTaskDetail();
            $(lePane).parent().css('height','100%');

            $(lePane).removeClass('tasks-detailview')
                .addClass('io-ox-center')
                .empty()
                .removeAttr('data-cid')
                .append(
                    $('<div class="io-ox-multi-selection">').append(
                        $('<div class="summary empty">')
                            .text(gt('No elements selected'))
                    )
                );
        },

        // task detail manipulation END -----


        sendAsyncRequest: function(method, url, callback, payload, callbackValue) {            
            $.ajax(url, {
                dataType: 'json',
                type : method,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data : JSON.stringify(payload),
                success: function(data) {
                    if(callbackValue)
                        callback(data,callbackValue);
                    else
                        callback(data);
                },
                error: function(data) {
                    camundaTasks.showError(data);
                    if(USE_DEMOTASKS===true && callback==camundaTasks.appendFolders) {
                        camundaTasks.useDemoGroups();
                    } else if(USE_DEMOTASKS===true && callback==camundaTasks.appendTasks) {
                        camundaTasks.useDemoTasks();
                    } else {
                        camundaTasks.deactivateFolders();
                    }
                    
                    // deactivate spinners:
                    if(ajaxAnimationDiv_listView && ajaxAnimationDiv_listView!==null)
                        camundaTasks.animationOnOff(false, ajaxAnimationDiv_listView);
                }
            });

        },

        useDemoGroups: function() {
            console.log(DemoTasklist.groups);
            camundaTasks.appendFolders(DemoTasklist.groups);
        },
        useDemoTasks: function() {
            camundaTasks.appendTasks(DemoTasklist.tasklist, DemoTasklist.groups[1]);
        },

        // call, if camunda folders cannot be read
        deactivateFolders: function() {
            camundaTasks.animationOnOff(false, ajaxAnimationDiv);
            mainFolder.addClass('open close');
            mainFolder.children()
                .children('.folder-arrow').children().toggleClass('fa-caret-down fa-fw');
        },

        toggleFolders: function() {
            mainFolder.toggleClass('open');
            mainFolder.children()
                .children('.folder-arrow').children().toggleClass('fa-caret-down fa-caret-right');
        },


        // helper -----

        showError: function(error) {
            require(['io.ox/core/notifications'], function(notify) {
                    notify.yell('error','Cannot connect to Camunda ('+error.status+': '+error.statusText+')');
            });
        },

        animationOnOff: function(on, surroundingDiv) {
            if(on===true)
                surroundingDiv.append( $('<i style="opacity:0.5;">').addClass('fa').addClass('fa-refresh').addClass('fa-spin') );
            else
                surroundingDiv.empty();
        },

/*
        // setting right format and timezone
        // e.g. format = 'l'
        // using http://momentjs.com/
        getDate: function(theDate, format) {
            // see: .../apps/io.ox/tasks/print.js
            return moment(theDate).format(format);
        }, */


        // theDate: e.g. '2016-03-16T11:37:44'
        // theFormat: e.g. date.DATE, or date.TIME
        getDate: function(theDate, theFormat) {
            // see: http://oxpedia.org/wiki/index.php?title=AppSuite:Date_and_time
            return new date.Local(theDate).format(theFormat);
        },

        // helper END -----


        // reload hack -----

        manipulateExistingFolders: function() {
            var theChildren = mainFolder.parent().children('.section')
                .children('.subfolders').children().not('.camunda');

            for(var i=0; i<theChildren.length; i++) {
                $(theChildren[i]).on('click', null, theChildren[i], camundaTasks.reloadClickListener);
            }
            camundaFolderWasClicked = true;
        },

        reloadClickListener: function(event) {
            console.log('läuft');
            var sel = camundaSubfolders.children('.selected');
            if(sel.length && sel.length>0) {

                // removes all .external tasks:
                var taskList = camundaTasks.getCleanTaskView();

                // show hidden tasks:
                taskList.children().css('display', 'block');

                if($(event.data).attr('data-id')==camundaTasks.getUrlFolderParameter()) {
                    // show hidden task detail:
                    var lePane = camundaTasks.getCleanTaskDetail();
                    $(lePane).parent().children().not('.'+EXTERNAL_TASKS_CLASS)
                        .removeAttr('style');
                    $(lePane).parent().css('height','100%');
                    // refresh:
                    camundaTasks.refresh();
                }
            }
        },

        refresh: function() {
            //location.reload();
            ext.point('io.ox/core/refresh').invoke('action');
            ext.point('io.ox/core/refresh').invoke('reset');
        },

        getUrlFolderParameter: function() {
            var FOLDER_PARAM = 'folder';

            var sPageUrl = window.location.href+'';
            var paramIndex = sPageUrl.indexOf('&'+FOLDER_PARAM);

            var folderParam = sPageUrl.substring(paramIndex+1);
            folderParam = folderParam.split('&')[0].split('=')[1];
            return folderParam;
        }

        // reload hack END -----

    };


});
