package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Reactions struct {
	Emoji string   `json:"emoji" bson:"emoji"`
	Users []string `json:"users" bson:"users"`
}

type ReplyToSenderType struct {
	ID    string `json:"_id" bson:"_id"`
	Name  string `json:"name" bson:"name"`
	Image string `json:"image" bson:"image"`
}

type ReplyToType struct {
	ID     string            `json:"_id" bson:"_id"`
	Text   string            `json:"text" bson:"text"`
	Sender ReplyToSenderType `json:"sender" bson:"sender"`
}

type Message struct {
	ID             primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	ConversationId primitive.ObjectID   `json:"conversationId" bson:"conversationId"`
	Body           string               `json:"body,omitempty" bson:"body,omitempty"`
	Sender         primitive.ObjectID   `json:"sender,omitempty" bson:"sender,omitempty"`
	Receiver       primitive.ObjectID   `json:"receiver,omitempty" bson:"receiver,omitempty"`
	Image          string               `json:"image,omitempty" bson:"image,omitempty"`
	CreatedAt      time.Time            `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	SeenBy         []primitive.ObjectID `json:"seenBy,omitempty" bson:"seenBy,omitempty"`
	Reactions      []Reactions          `json:"reactions" bson:"reactions"`
	ReplyTo        ReplyToType          `json:"replyTo" bson:"replyTo"`
}

// type MessageRequest struct {
// 	ConversationId string `json:"conversationId,omitempty" bson:"conversationId,omitempty"`
// 	Body           string `json:"body,omitempty" bson:"body,omitempty"`
// 	Sender         string `json:"sender,omitempty" bson:"sender,omitempty"`
// 	Image          string `json:"image,omitempty" bson:"image,omitempty"`
// }

type MessageRequest struct {
	ConversationId string `json:"conversationId,omitempty" bson:"conversationId,omitempty"`
	Body           string `json:"body,omitempty" bson:"body,omitempty"`
	Sender         string `json:"sender,omitempty" bson:"sender,omitempty"`
	Receiver       string `json:"receiver,omitempty" bson:"receiver,omitempty"`
	Image          string `json:"image,omitempty" bson:"image,omitempty"`
}
