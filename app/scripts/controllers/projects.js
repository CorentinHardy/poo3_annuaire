'use strict';

/**
 *
 */
angular.module('pooIhmExemplesApp')
  .controller('ProjectsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.successes = [];
    $scope.alerts = [];

    $scope.dataUsers = [];

    $scope.project;

    $scope.getAllProjects = function() {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
        .success(function (data) {
          $scope.projects = data.data;
        });
    };

    $scope.getAllDataUsers = function() {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
        .success(function(data) {
          $scope.brutUsers = data.data;
          $scope.dataUsers = [];

          for(var j = 0; j < $scope.brutUsers.length; j++){
            $scope.dataUsers[j] = [];
            $scope.dataUsers[j].accepted = "0";
            $scope.dataUsers[j].user = $scope.brutUsers[j];
          }
        });
    };

    $scope.addAProject = function() {
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/', $scope.project)
        .success(function(data){
          if (data.status == "success"){
            $scope.successes.push("ajout reussi");
          }else{
            $scope.alerts.push("l'ajout est un échec.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empéché l'ajout.");
        });
    };

    $scope.changeAProject = function() {
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.project.id, $scope.project)
        .success(function(data){
          if (data.status == "success"){
            $scope.successes.push("changement reussi");
          }else{
            $scope.alerts.push("le changement est un echec.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empéché le changement.");
        });
    };

    $scope.deleteAProject = function() {
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.user.id)
        .success(function(data){
          if (data.status == "success"){
            $scope.successes.push("suppression reussi");
          }else{
            $scope.alerts.push("la suppression est un echec.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empeche la suppression");
        });
    };

    $scope.addUsersToProject = function(){
      $scope.addMode = true;
    };

    $scope.removeUsersToProject = function(){
      $scope.removeMode = true;
    };

    $scope.resetUsersToProject = function(){
      $scope.removeMode = null;
      $scope.addMode = null;
    };

    $scope.getUserByProject = function(idProject) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + idProject + '/Users')
        .success(function(data) {
          $scope.project.users = data.data;

          $scope.tmp = true;
          for (var j = 0; j < $scope.dataUsers.length; j++) {
            $scope.dataUsers[j].accepted = null;
          }
          for(var k = 0; k < $scope.project.users.length; k++){
            $scope.tmp = true;
            for(var i = 0; $scope.tmp && (i < $scope.dataUsers.length); i++) {
              if ($scope.idEquals($scope.dataUsers[i].user, $scope.project.users[k])) {
                $scope.dataUsers[i].accepted = "1";
                $scope.tmp = false;
              }
            }
            // console.log($scope.dataUsers[i]);
            // parfois une erreur inconnu arrive et empeche l'egalite d'etre reconnu ...
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empeché la récupération des utilisateurs de ce projet.");
        });
    };

    $scope.idEquals = function(u1, u2){
      if((u1 == 'undefined') || (u2 == 'undefined') || (u1 == null) || (u2 == null)){
        return false;
      }
      return (u1.id == u2.id);
    };

    $scope.addUserToProject = function(userId){
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.project.id + '/Users/' + userId)
        .success(function(data){
          if (data.status == "success"){
            $scope.getUserByProject($scope.project.id);
            $scope.successes.push("l'utilisateur "+ " a bien été ajouter au projet.");
          }else{
            $scope.alerts.push("l'utilisateur n'a pas été ajouté au projet.");
          }
      }).error(function(){
          $scope.alerts.push("une erreur a empéche l'ajout de l'utilisateur au projet.");
      });
    };

    $scope.removeUserToProject = function(userId){
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.project.id + '/Users/' + userId)
        .success(function(data){
          if (data.status == "success"){
            $scope.getUserByProject($scope.project.id);
            $scope.successes.push("l'utilisateur "+ " a bien été supprimé du projet.");
          }else{
            $scope.alerts.push("l'utilisateur n'a pas été supprimé du projet.");
          }
      }).error(function(){
          $scope.alerts.push("une erreur a empéche la suppression de l'utilisateur au projet.");
      });
    };

    if($routeParams.projectId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId)
        .success(function(data) {
          if (data.status == "success") {
            $scope.project = data.data;
            $scope.getAllDataUsers();
            $scope.getUserByProject($routeParams.projectId);
          }else{
              $scope.alerts.push("les données de ce projet sont indisponible");
            }
        }).error(function(){
          $scope.alerts.push("le projet est introuvable");
        })
    }else{
      $scope.getAllProjects();
    }

  }]);
