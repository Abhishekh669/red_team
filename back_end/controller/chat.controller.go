package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Abhishekh669/backend/configuration"
	"github.com/Abhishekh669/backend/model"
	"github.com/Abhishekh669/backend/services"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PaginationQuery struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

func GetUserAllConversationHandler(w http.ResponseWriter, r *http.Request) {
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

	if err != nil || currentUser.ID.IsZero() || currentUser.Email == "" {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	conversations, err := services.GetUserAllConversation(ObjectUserId)
	if err != nil {
		http.Error(w, "Failed to get conversations ", http.StatusInternalServerError)
		return
	}

	var newResponse []map[string]interface{}

	for _, conversation := range conversations {
		var membersData []map[string]interface{}
		for _, userId := range conversation.Members {
			user, err := services.GetUserById(userId)
			if err != nil {
				http.Error(w, "Failed to get user  ", http.StatusInternalServerError)
				return
			}
			data := map[string]interface{}{
				"_id":      user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"address":  user.Address,
				"field":    user.Field,
				"image":    user.Image,
				"codeName": user.CodeName,
			}
			membersData = append(membersData, data)
		}
		var newConversation map[string]interface{}
		if conversation.IsGroup {
			newConversation = map[string]interface{}{
				"_id":           conversation.ID,
				"members":       membersData,
				"isGroup":       conversation.IsGroup,
				"name":          conversation.Name,
				"groupImage":    conversation.GroupImage,
				"createdAt":     conversation.CreatedAt,
				"lastMessageAt": conversation.LastMessageAt,
			}

		} else {
			newConversation = map[string]interface{}{
				"_id":           conversation.ID,
				"members":       membersData,
				"groupImage":    conversation.GroupImage,
				"createdAt":     conversation.CreatedAt,
				"lastMessageAt": conversation.LastMessageAt,
			}
		}
		newResponse = append(newResponse, newConversation)

	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newResponse)

}

// Define default values for limit and offset

func CreateChatHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")
	var chatReq model.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&chatReq); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	fmt.Println("Chat is ", chatReq)

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
	if currentUser.ID == primitive.NilObjectID || currentUser.Email == "" {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	members := append(chatReq.Members, sessionData.UserId)

	var memberIDs []primitive.ObjectID

	for _, member := range members {
		memberID, err := primitive.ObjectIDFromHex(member)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid member ID format: %s", err), http.StatusBadRequest)
			return
		}

		memberIDs = append(memberIDs, memberID)
	}

	isGroup := len(memberIDs) > 2

	if !isGroup {

		// Query to check if the conversation already exists

		query := bson.M{"members": bson.M{"$all": memberIDs, "$size": 2}}

		//check if conversation already exist in the db

		chat_collection, err := configuration.GetCollection("chats")
		if err != nil {
			http.Error(w, "chat collection not found", http.StatusInternalServerError)
			return
		}

		var existingChat model.Chat

		err = chat_collection.FindOne(context.Background(), query).Decode(&existingChat)

		if err == nil {
			aggegratePipeline := []bson.M{
				{
					"$match": query,
				},
				{
					"$lookup": bson.M{
						"from":         "users",
						"localField":   "members",
						"foreignField": "_id",
						"as":           "user_details",
					},
				},
			}
			cursor, err := chat_collection.Aggregate(context.Background(), aggegratePipeline)

			if err != nil {
				http.Error(w, "Error populating user details", http.StatusInternalServerError)
				return
			}

			var populatedChat model.Chat

			if cursor.Next(context.Background()) {
				if err := cursor.Decode(&populatedChat); err != nil {
					http.Error(w, "Failed to decode populated conversation", http.StatusInternalServerError)
					return
				}
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(populatedChat)
			return

		}

		newChat := model.Chat{
			Members: memberIDs,
		}

		created_chat, err := services.CreateChat(newChat)

		if err != nil {
			http.Error(w, "Failed to create conversation", http.StatusInternalServerError)
			return
		}

		for _, memberId := range memberIDs {
			users, err := configuration.GetCollection("users")
			users.UpdateOne(
				context.Background(),
				bson.M{"_id": memberId},
				bson.M{"$addToSet": bson.M{"conversations": created_chat.ID}},
			)
			if err != nil {
				http.Error(w, "Failed to update user with new conversation", http.StatusInternalServerError)
				return
			}

		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(created_chat)
	} else {
		newGroupChat := model.Chat{
			Members:    memberIDs,
			IsGroup:    true,
			Name:       chatReq.Name,
			GroupImage: chatReq.GroupImage,
		}

		newGroup, err := services.CreateChat(newGroupChat)
		if err != nil {
			http.Error(w, "Failed to create conversation", http.StatusInternalServerError)
			return
		}

		for _, memberId := range memberIDs {
			users, err := configuration.GetCollection("users")
			users.UpdateOne(
				context.Background(),
				bson.M{"_id": memberId},
				bson.M{"$addToSet": bson.M{"conversations": newGroup.ID}},
			)
			if err != nil {
				http.Error(w, "Failed to update user with new conversation", http.StatusInternalServerError)
				return
			}

		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newGroup)

	}

}

// do improvement
func GetConversationByIdHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "GET")

	params := mux.Vars(r)
	conversationId := params["id"]

	ObjectConversationId, err := primitive.ObjectIDFromHex(conversationId)
	if err != nil {
		http.Error(w, "failed to parse conversation id ", http.StatusForbidden)
		return
	}

	conversation, err := services.GetConversationById(ObjectConversationId)

	if err != nil {
		http.Error(w, "failed to get  conversation  ", http.StatusForbidden)
		return
	}

	if conversation.ID.IsZero() || len(conversation.Members) == 0 {
		http.Error(w, "No conversation  found  ", http.StatusForbidden)
		return
	}

	//fetch members
	var members []model.User

	for _, memberID := range conversation.Members {
		user, err := services.GetUserById(memberID)
		if err != nil {
			http.Error(w, "failed to fetch user", http.StatusInternalServerError)
			return
		}
		members = append(members, user)
	}

	if conversation.IsGroup {
		response := map[string]interface{}{
			"_id":           conversation.ID,
			"members":       members,
			"createdAt":     conversation.CreatedAt,
			"lastMessageAt": conversation.LastMessageAt,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	} else {
		response := map[string]interface{}{
			"_id":           conversation.ID,
			"members":       members,
			"isGroup":       conversation.IsGroup,
			"groupImage":    conversation.GroupImage,
			"createdAt":     conversation.CreatedAt,
			"lastMessageAt": conversation.LastMessageAt,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}

}
