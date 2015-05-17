'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('UsersCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.user;
    $scope.dataProjects = [];

    $scope.successes = [];
    $scope.alerts = [];

    /**
     * recupere tous les utilisateurs existants.
     */
    $scope.getAllUsers = function() {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
        .success(function (data) {
          $scope.users = data.data;
        });
    };

    /**
     * Cette fonction est necessaire pour recupere toutes les données des
     * projets existant, et attribuer à chaque projet une variable accepted
     * (qui permet un tri lors de l'affichage).
     */
    $scope.getAllDataProjects = function() {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
        .success(function(data) {
          $scope.brutProjects = data.data;
          $scope.dataProjects = [];

          for(var j = 0; j < $scope.brutProjects.length; j++){
            $scope.dataProjects[j] = [];
            $scope.dataProjects[j].accepted = "0";
            $scope.dataProjects[j].project = $scope.brutProjects[j];
          }
        });
    };

    /**
     * rajoute un utilisateur.
     */
    $scope.addAUser = function() {
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Users/', $scope.user)
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

    /**
     * change les donnes d'un utilisateur.
     */
    $scope.changeAUser = function() {
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.user.id, $scope.user)
        .success(function(data){
          // ->  data et status;
          if (data.status == "success"){
            $scope.successes.push("changement reussi");
          }else{
            $scope.alerts.push("le changement est un echec.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empéché le changement.");
        });
    };

    /**
     * supprime un utilisateur.
     */
    $scope.deleteAUser = function() {
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.user.id)
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

    /**
     * permet de changer l'affichage directement sur le template,
     * en affichant en plus les boutons pour ajouter les projets,
     * ainsi que les projets n'appartenant pas a l'utilisateur.
     * Désactive l'affichage du bouton permettant cette option.
     */
    $scope.addProjectsToUser = function(){
      $scope.addMode = true;
    };

    /**
     * permet de changer l'affichage directement sur le template,
     * en affichant en plus les boutons pour supprimer les projets.
     * Désactive l'affichage du bouton permettant cette option.
     */
    $scope.removeProjectsToUser = function(){
      $scope.removeMode = true;
    };

    /**
     * permet de changer l'affichage directement sur le template,
     * en reinitialisant aux paramétres initiaux.
     */
    $scope.resetProjectsToUser = function(){
      $scope.removeMode = null;
      $scope.addMode = null;
    };

    /**
     * Cette méthode compare la liste de tous les projets avec la liste des
     *  projets de l'utilisateur pour attribué la bonne variable accepted.
     *
     * @param idUser
     */
    $scope.getProjectByUser = function(idUser) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + idUser + '/Projects')
        .success(function(data) {
          if (data.status == "success") {
            $scope.user.projects = data.data;

            $scope.tmp = true;
            for (var j = 0; j < $scope.dataProjects.length; j++) {
              $scope.dataProjects[j].accepted = null;
            }
            for (var k = 0; k < $scope.user.projects.length; k++) {
              $scope.tmp = true;
              for (var i = 0; $scope.tmp && (i < $scope.dataProjects.length); i++) {
                if ($scope.idEquals($scope.dataProjects[i].project, $scope.user.projects[k])) {
                  $scope.dataProjects[i].accepted = "1";
                  $scope.tmp = false;
                }
                //console.log($scope.dataProjects[i]);
              }
            }
          }else{
            $scope.alerts.push("une erreur a empeché l'accèes aux projets de cette utilisateur.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empeché la récupération des projets de cette utilisateur.");
        });
    };

    /**
     * Cette méthode compare deux objet par leurs id.
     *
     * @param u1
     * @param u2
     * @returns true si l'id est identique. false sinon.
     */
    $scope.idEquals = function(u1, u2){
      if((u1 == 'undefined') || (u2 == 'undefined') || (u1 == null) || (u2 == null)){
        return false;
      }
      return (u1.id == u2.id);
    };

    /**
     * rajoute le projet identifier par l'id projectId à l'utilisateur courant.
     *
     * @param projectId
     */
    $scope.addProjectToUser = function(projectId){
      $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.user.id + '/Projects/' + projectId)
        .success(function(data){
          if (data.status == "success"){
            $scope.getProjectByUser($scope.user.id);
            $scope.successes.push("le projet "+ " a bien été ajouter à l'utilisateur.");
          }else{
            $scope.alerts.push("le projet n'a pas été ajouté à l'utilisateur.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empéche l'ajout du projet à l'utilisateur.");
        });
    };

    /**
     * supprime le projet identifier par l'id projectId à l'utilisateur courant.
     *
     * @param projectId
     */
    $scope.removeProjectToUser = function(projectId){
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.user.id + '/Projects/' + projectId)
        .success(function(data){
          if (data.status == "success"){
            $scope.getProjectByUser($scope.user.id);
            $scope.successes.push("le projet "+ " a bien été supprimé pour l'utilisateur.");
          }else{
            $scope.alerts.push("le projet n'a pas été supprimé pour l'utilisateur.");
          }
        }).error(function(){
          $scope.alerts.push("une erreur a empéche la suppression du projet de l'utilisateur.");
        });
    };

    /**
     * code executer: identifie si on veut la liste des users ou bien les
     * caractéristique d'un user.
     */
    if($routeParams.userId) {
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId)
      .success(function(data) {
      if (data.status == "success") {
        $scope.user = data.data;
        $scope.getAllDataProjects();
        $scope.getProjectByUser($routeParams.userId);
      }
      }).error(function(){
        $scope.alerts.push("les données de cette utilisateur sont indisponible");
      });
    }else{
      $scope.getAllUsers();
    }
  }]);
