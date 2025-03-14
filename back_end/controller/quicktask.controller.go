package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Abhishekh669/backend/configuration"
	"github.com/Abhishekh669/backend/model"
	"github.com/Abhishekh669/backend/services"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ToggleQuickTasksType struct {
	Field  string `json:"field" bson:"field"`
	Status bool   `json:"status" bson:"status"`
	ID     string `json:"_id" bson:"_id"`
}

func DeleteQuickTasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "DELETE")

	params := mux.Vars(r)

	taskId := params["id"]

	sessionData, err := configuration.GetSessionData(r)

	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return

	}

	ObjectUserId, err := primitive.ObjectIDFromHex(sessionData.UserId)
	if err != nil {
		http.Error(w, "failed to parse user id ", http.StatusForbidden)
		return
	}

	currentUser, err := services.GetUserById(ObjectUserId)

	if err != nil || currentUser.ID.IsZero() {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	ObjectTaskId, err := primitive.ObjectIDFromHex(taskId)

	if err != nil {
		http.Error(w, "Failed to parse page id", http.StatusInternalServerError)
		return
	}

	if ObjectTaskId.IsZero() {
		http.Error(w, "taskid  is invalid", http.StatusInternalServerError)
		return
	}

	data, err := services.GetQuickTaskById(ObjectTaskId, ObjectUserId)

	if err != nil || data.ID.IsZero() {
		http.Error(w, "failed to get page", http.StatusInternalServerError)
		return
	}

	deletePageWorkspace, err := services.DeleteQuickTasks(ObjectTaskId, ObjectUserId)
	if err != nil {
		http.Error(w, "failed to delete tasks", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(deletePageWorkspace)

}

func ToggleQuickTasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var UpdateData ToggleQuickTasksType
	if err := json.NewDecoder(r.Body).Decode(&UpdateData); err != nil {
		http.Error(w, "failed to parse data ", http.StatusBadRequest)
		return
	}

	fmt.Println("This is update data : ", UpdateData)

	sessionData, err := configuration.GetSessionData(r)

	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return

	}

	ObjectUserId, err := primitive.ObjectIDFromHex(sessionData.UserId)
	if err != nil {
		http.Error(w, "failed to parse user id ", http.StatusForbidden)
		return
	}

	user, err := services.GetUserById(ObjectUserId)

	if err != nil || user.ID.IsZero() {
		http.Error(w, "failed to get user data", http.StatusNotFound)
		return
	}

	ObjectPageId, err := primitive.ObjectIDFromHex(UpdateData.ID)

	if err != nil {
		http.Error(w, "Failed to parse task id", http.StatusInternalServerError)
		return
	}

	if ObjectPageId.IsZero() {
		http.Error(w, "task id is invalid", http.StatusInternalServerError)
		return
	}

	data, err := services.GetQuickTaskById(ObjectPageId, ObjectUserId)

	if err != nil || data.ID.IsZero() {
		http.Error(w, "failed to get tasks", http.StatusInternalServerError)
		return
	}

	result, err := services.ToggleQuickTasks(UpdateData.Field, UpdateData.Status, ObjectPageId, ObjectUserId)

	if err != nil || !result {
		http.Error(w, "failed to update  page", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)

}

func CreateQuickTaskHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var QuickTaskData model.ReadingItemRequest

	if err := json.NewDecoder(r.Body).Decode(&QuickTaskData); err != nil {
		http.Error(w, "failed to parse data ", http.StatusBadRequest)
		return
	}

	sessionData, err := configuration.GetSessionData(r)

	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return

	}

	ObjectUserId, err := primitive.ObjectIDFromHex(sessionData.UserId)
	if err != nil {
		http.Error(w, "failed to parse user id ", http.StatusForbidden)
		return
	}

	user, err := services.GetUserById(ObjectUserId)

	if err != nil || user.ID.IsZero() {
		http.Error(w, "failed to get user data", http.StatusNotFound)
		return
	}

	newQuickTasks := model.ReadingItem{
		Title:     QuickTaskData.Title,
		UserId:    ObjectUserId,
		Type:      QuickTaskData.Type,
		Favorite:  QuickTaskData.Favorite,
		Completed: QuickTaskData.Completed,
		Notes:     QuickTaskData.Notes,
		Author:    QuickTaskData.Author,
		CreatedAt: time.Now(),
	}

	success, err := services.CreateQuickTask(newQuickTasks)

	if err != nil || !success {
		http.Error(w, "failed to create quick task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(success)
}

func GetUserQuickTasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "GET")

	sessionData, err := configuration.GetSessionData(r)

	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return

	}

	ObjectUserId, err := primitive.ObjectIDFromHex(sessionData.UserId)
	if err != nil {
		http.Error(w, "failed to parse user id ", http.StatusForbidden)
		return
	}

	currentUser, err := services.GetUserById(ObjectUserId)

	if err != nil || currentUser.ID.IsZero() {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	tasks, err := services.GetUserQuickTaskList(ObjectUserId)

	if err != nil {
		http.Error(w, " failed to get tasks", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)

}
