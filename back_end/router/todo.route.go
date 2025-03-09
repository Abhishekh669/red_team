package router

import (
	"github.com/Abhishekh669/backend/controller"
	"github.com/gorilla/mux"
)

func TodoRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/todo/create", controller.CreateTodoHandler).Methods("POST")
	router.HandleFunc("/api/todo/all", controller.GetUserAllTodosHandler).Methods("GET")
	return router
}
