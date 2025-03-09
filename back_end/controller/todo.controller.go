package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Abhishekh669/backend/configuration"
	"github.com/Abhishekh669/backend/model"
	"github.com/Abhishekh669/backend/services"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUserAllTodosHandler(w http.ResponseWriter, r *http.Request) {
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

	todos, err := services.GetAllUserTodos(ObjectUserId)

	if err != nil {
		http.Error(w, " failed to get todos", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todos)

}

func CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var todoData model.TodoRequest

	if err := json.NewDecoder(r.Body).Decode(&todoData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
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

	currentUser, err := services.GetUserById(ObjectUserId)

	if err != nil || currentUser.ID.IsZero() {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	highestPostion, err := services.GetHighestPosition(todoData.State, ObjectUserId)
	if err != nil {
		http.Error(w, "failed to get highest position", http.StatusInternalServerError)
		return
	}

	fmt.Println("This is the highest position : ", highestPostion)

	var newTodoData = model.Todo{
		UserID:      ObjectUserId,
		Title:       todoData.Title,
		Position:    int64(highestPostion),
		Description: todoData.Description,
		Tag:         todoData.Tag,
		State:       todoData.State,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	newTodo, err := services.CreateTodo(newTodoData)

	if err != nil {
		http.Error(w, "failed to create new todo", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(newTodo)

}
