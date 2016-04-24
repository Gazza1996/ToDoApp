// Gary Mannion
// G00319609
// Factory and controller
// samples of code used from ionic framework website to help with storage
// creating a new task
// modal task bar
// creating a new list
// ionic framework.com
angular.module('todo', ['ionic'])

    .factory('Projects', function () {
        return {
            all: function () {
         // creates local storage for tasks and lists
                var projectString = window.localStorage['projects'];
                if (projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            // save the lists and tasks
            save: function (projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function (projectTitle) {
                // Add a new list
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            // takes the last list that was active
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveProject'] = index;
            }
        };
    })
    // controllers
    .controller('TodoCtrl', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

        // controller functions for creating a list/saving a task and list
        var createProject = function (projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            $scope.projects.push(newProject);
            Projects.save($scope.projects);

            $scope.selectProject(newProject, $scope.projects.length - 1);
        };
        // delete button function || NOT WORKING ||
        $scope.delete = function (index, tasks) {
            tasks.splice(index, 1);
        };
   
        // to load or start a list
        $scope.projects = Projects.all();

        // use the last active list
        $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

        // to create a new list from sidemenu
        $scope.newProject = function () {
            var projectTitle = prompt('List name');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // to select a given list
        $scope.selectProject = function (project, index) {
            $scope.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        // Creating the modal bar
        $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        // create a task
        $scope.createTask = function (task) {
            if (!$scope.activeProject || !task) {
                return;
            }
      
            $scope.createList = function (list) {
                if (!$scope.activeProject || !list) {
                    return;
                }
            };
            // pushes the active list
            $scope.activeProject.tasks.push({
                title: task.title
            });
            $scope.taskModal.hide();

            // saves the list
            Projects.save($scope.projects);

            task.title = "";
        };

        // show the new task
        $scope.newTask = function () {
            $scope.taskModal.show();
        };
    
        // hide the modal
        $scope.closeNewTask = function () {
            $scope.taskModal.hide();
        };
        $scope.closeNewList = function () {
            $scope.taskModal.hide();
        };

        // to view the lists
        $scope.toggleProjects = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };


        // to create the first list prompting for a title using the $timeout function
        $timeout(function () {
            if ($scope.projects.length === 0) {
                while (true) {
                    var projectTitle = prompt('Your first title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            }
        });

    }); // end of file