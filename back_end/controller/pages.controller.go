package controller

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Abhishekh669/backend/configuration"
	"github.com/Abhishekh669/backend/model"
	"github.com/Abhishekh669/backend/services"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUserAllPagesHandler(w http.ResponseWriter, r *http.Request) {
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

	pages, err := services.GetUserAllPages(ObjectUserId)

	if err != nil {
		http.Error(w, " failed to get pages", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(pages)

}

func UpdatePageDataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var pageData model.UpdatePageDataRequest

	if err := json.NewDecoder(r.Body).Decode(&pageData); err != nil {
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

	ObjectPageId, err := primitive.ObjectIDFromHex(pageData.ID)

	if err != nil {
		http.Error(w, "Failed to parse page id", http.StatusInternalServerError)
		return
	}

	if ObjectPageId.IsZero() {
		http.Error(w, "pageid  is invalid", http.StatusInternalServerError)
		return
	}

	data, err := services.GetPageById(ObjectPageId, ObjectUserId)

	if err != nil || data.ID.IsZero() {
		http.Error(w, "failed to get pages", http.StatusInternalServerError)
		return
	}

	newPageData := model.UpdatePageData{
		ID:      ObjectPageId,
		Title:   pageData.Title,
		Content: pageData.Content,
		UserId:  ObjectUserId,
	}

	result, err := services.UpdatePageData(newPageData)

	if err != nil {
		http.Error(w, "failed to update  page", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)

}

func GetPageByIdHander(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "GET")

	sessionData, err := configuration.GetSessionData(r)

	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return

	}

	ObjectUserId, err := primitive.ObjectIDFromHex(sessionData.UserId)

	if err != nil {
		http.Error(w, "Failed to parse userid ", http.StatusInternalServerError)
		return
	}

	currentUser, err := services.GetUserById(ObjectUserId)

	if err != nil {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	if currentUser.ID == primitive.NilObjectID || currentUser.Email == "" || !currentUser.IsOnBoarded {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	params := mux.Vars(r)
	pageId := params["id"]

	ObjectPageId, err := primitive.ObjectIDFromHex(pageId)

	if err != nil {
		http.Error(w, "Failed to parse page id", http.StatusInternalServerError)
		return
	}

	if ObjectPageId.IsZero() {
		http.Error(w, "pageid  is invalid", http.StatusInternalServerError)
		return
	}

	data, err := services.GetPageById(ObjectPageId, ObjectUserId)

	if err != nil || data.ID.IsZero() {
		http.Error(w, "failed to get pages", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)

}

func CreatePageHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")

	var pageData model.PageModelRequest

	if err := json.NewDecoder(r.Body).Decode(&pageData); err != nil {
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

	newPageData := model.PageModel{
		Title:       pageData.Title,
		Description: pageData.Description,
		UserId:      ObjectUserId,
		Type:        pageData.Type,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	result, err := services.CreateNewPage(newPageData)

	if err != nil {
		http.Error(w, "failed to create new page", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)

}
