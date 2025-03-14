package router

import (
	"github.com/Abhishekh669/backend/controller"
	"github.com/gorilla/mux"
)

func PlanifyRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/planify/pages/create", controller.CreatePageHandler).Methods("POST")
	router.HandleFunc("/api/planify/pages/{id}", controller.GetPageByIdHander).Methods("GET")
	router.HandleFunc("/api/planify/pages/update", controller.UpdatePageDataHandler).Methods("POST")
	router.HandleFunc("/api/planify/pages/workspace/update", controller.UpdatePageWorkspaceHandler).Methods("POST")
	router.HandleFunc("/api/planify/pages/workspace/delete/{id}", controller.DeletePageWorkspaceHandler).Methods("DELETE")
	router.HandleFunc("/api/planify/pages/user/all", controller.GetUserAllPagesHandler).Methods("GET")

	router.HandleFunc("/api/planify/tasks/quicktasks/create", controller.CreateQuickTaskHandler).Methods("POST")
	router.HandleFunc("/api/planify/tasks/quicktasks/toggle", controller.ToggleQuickTasksHandler).Methods("POST")
	router.HandleFunc("/api/planify/tasks/quicktasks/all", controller.GetUserQuickTasksHandler).Methods("GET")
	router.HandleFunc("/api/planify/tasks/quicktasks/delete/{id}", controller.DeleteQuickTasksHandler).Methods("DELETE")

	return router
}
