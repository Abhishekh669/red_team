package router

import (
	"github.com/Abhishekh669/backend/controller"
	"github.com/gorilla/mux"
)

func TodoRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/todo/create", controller.CreateTodoHandler).Methods("POST")
	router.HandleFunc("/api/todo/all", controller.GetUserAllTodosHandler).Methods("GET")
	router.HandleFunc("/api/todo/delete/{id}", controller.DeleteTodoHandler).Methods("DELETE")
	router.HandleFunc("/api/todo/update", controller.UpdateTodoHandler).Methods("POST")
	router.HandleFunc("/api/todo/update/bulk", controller.TodoBulkUpdateHandler).Methods("POST")
	return router
}
