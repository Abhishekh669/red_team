package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ReadingItem struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`       // MongoDB uses _id as the primary key
	UserId    primitive.ObjectID `json:"userId" bson:"userId,omitempty"` // MongoDB uses _id as the primary key
	Title     string             `json:"title" bson:"title"`
	Author    string             `json:"author,omitempty" bson:"author,omitempty"` // Optional field
	Completed bool               `json:"completed" bson:"completed"`
	Favorite  bool               `json:"favorite" bson:"favorite"`
	Notes     string             `json:"notes,omitempty" bson:"notes,omitempty"` // Optional field
	Type      string             `json:"type" bson:"type"`                       // "book" or "todo"
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}

type ReadingItemRequest struct {
	Title     string `json:"title" bson:"title"`
	Author    string `json:"author,omitempty" bson:"author,omitempty"` // Optional field
	Completed bool   `json:"completed" bson:"completed"`
	Favorite  bool   `json:"favorite" bson:"favorite"`
	Notes     string `json:"notes,omitempty" bson:"notes,omitempty"` // Optional field
	Type      string `json:"type" bson:"type"`                       // "book" or "todo"
}
