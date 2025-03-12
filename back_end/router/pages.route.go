package router

import (
	"github.com/Abhishekh669/backend/controller"
	"github.com/gorilla/mux"
)

func PagesRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/planify/pages/create", controller.CreatePageHandler).Methods("POST")
	router.HandleFunc("/api/planify/pages/{id}", controller.GetPageByIdHander).Methods("GET")
	router.HandleFunc("/api/planify/pages/update", controller.UpdatePageDataHandler).Methods("POST")
	router.HandleFunc("/api/planify/pages/user/all", controller.GetUserAllPagesHandler).Methods("GET")
	return router
}
